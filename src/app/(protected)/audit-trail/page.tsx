"use client";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import ExcelJS from "exceljs";
import { RootState } from "@/redux/store/store";
import { getRolePermission } from "@/utils/roleAndPermission";
import { getAuditLogs } from "@/apiService/client/auditLogs";
import { formatDateTime } from "@/utils/function";
import { showErrorNotification } from "@/helpers/client/swal_fire_helper";
import { usePagination } from "@/hooks/usePagination";
import { PaginationControls } from "@/components/common/PaginationControls";

const formatActionLabel = (action: string) =>
    action.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

const sanitize = (val: unknown): string =>
    typeof val === "string" ? val.replace(/[\r\n\t]/g, " ").trim() : "—";

interface AuditLog {
    _id: string;
    user_id: string;
    user_name: string;
    action_type: string;
    description: string;
    timestamp: string | number;
    user?: { name: string; email: string };
}

interface Filters {
    actionType: string;
    userSearch: string;
    keyword: string;
    dateFrom: string;
    dateTo: string;
}

const INITIAL_FILTERS: Filters = {
    actionType: "", userSearch: "", keyword: "", dateFrom: "", dateTo: "",
};

export default function AuditTrail() {
    const authUser = useSelector((state: RootState) => state.auth);
    const authRoleId = authUser?.role_id;

    const [logs, setLogs] = useState<AuditLog[]>([]);
    const [loading, setLoading] = useState(false);
    const [filters, setFilters] = useState<Filters>(() => {
        try {
            const saved = sessionStorage.getItem("auditTrailFilters");
            return saved ? JSON.parse(saved) : INITIAL_FILTERS;
        } catch {
            return INITIAL_FILTERS;
        }
    });
    const [isExporting, setIsExporting] = useState(false);

    const actionTypeOptions = useMemo(() =>
        Array.from(new Set(logs.map((l) => l.action_type).filter(Boolean))).sort()
        , [logs]);

    const filteredLogs = useMemo(() => logs.filter((item) => {
        if (filters.actionType && item.action_type !== filters.actionType) return false;

        if (filters.userSearch) {
            const q = filters.userSearch.toLowerCase();
            const name = (item.user?.name || item.user_name || "").toLowerCase();
            const email = (item.user?.email || "").toLowerCase();
            if (!name.includes(q) && !email.includes(q)) return false;
        }

        if (filters.keyword) {
            if (!(item.description || "").toLowerCase().includes(filters.keyword.toLowerCase())) return false;
        }

        if (filters.dateFrom || filters.dateTo) {
            const ts = new Date(item.timestamp).getTime();
            if (isNaN(ts)) return false;
            if (filters.dateFrom && ts < new Date(filters.dateFrom).getTime()) return false;
            if (filters.dateTo) {
                const toEnd = new Date(filters.dateTo);
                toEnd.setHours(23, 59, 59, 999);
                if (ts > toEnd.getTime()) return false;
            }
        }

        return true;
    }), [logs, filters]);

    const isFiltered = useMemo(() => Object.values(filters).some((v) => v !== ""), [filters]);

    const {
        currentPageData,
        startIndex,
        currentPage,
        totalPages,
        pageNumbers,
        minPageNumberLimit,
        maxPageNumberLimit,
        rowsPerPage,
        handleClick,
        handlePrev,
        handleNext,
        handleFirst,
        handleLast,
        handleRowsPerPageChange,
    } = usePagination<AuditLog>(filteredLogs);

    const fetchLogs = useCallback(async () => {
        setLoading(true);
        try {
            const res: any = await getAuditLogs();
            if (res?.status === 200) {
                setLogs(res.data || []);
            } else {
                showErrorNotification("Failed to load audit logs.");
            }
        } catch {
            showErrorNotification("Something went wrong.");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchLogs();
    }, [fetchLogs]);

    const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        if (!(name in INITIAL_FILTERS)) return;
        setFilters((prev) => {
            const updated = { ...prev, [name]: value };
            sessionStorage.setItem("auditTrailFilters", JSON.stringify(updated));
            return updated;
        });
    };

    const handleClearFilters = () => {
        setFilters(INITIAL_FILTERS);
        sessionStorage.removeItem("auditTrailFilters");
    };

    const handleExportExcel = async () => {
        if (!filteredLogs.length) return;
        setIsExporting(true);
        try {
            const workbook = new ExcelJS.Workbook();
            const sheet = workbook.addWorksheet("Audit Logs");

            sheet.columns = [
                { header: "#", key: "index", width: 6 },
                { header: "Timestamp", key: "timestamp", width: 22 },
                { header: "User Name", key: "userName", width: 30 },
                { header: "User Email", key: "userEmail", width: 28 },
                { header: "Action", key: "action", width: 24 },
                { header: "Description", key: "description", width: 40 },
            ];

            sheet.getRow(1).font = { bold: true };

            filteredLogs.forEach((item, i) => {
                sheet.addRow({
                    index: i + 1,
                    timestamp: item.timestamp ? formatDateTime(new Date(item.timestamp).getTime()) : "—",
                    userName: sanitize(item.user?.name || item.user_name),
                    userEmail: sanitize(item.user?.email),
                    action: sanitize(formatActionLabel(item.action_type)),
                    description: sanitize(item.description),
                });
            });

            const buffer = await workbook.xlsx.writeBuffer();
            const blob = new Blob([buffer], {
                type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `audit-logs-${new Date().toISOString().slice(0, 10)}.xlsx`;
            a.click();
            URL.revokeObjectURL(url);
        } catch {
            showErrorNotification("Export failed. Please try again.");
        } finally {
            setIsExporting(false);
        }
    };

    if (!getRolePermission(authRoleId, "view-audit-trail")) {
        return (
            <div className="bg-white rounded-xl shadow p-5 text-center text-muted">
                <i className="fas fa-lock fa-2x mb-3 d-block"></i>
                You do not have permission to view this page.
            </div>
        );
    }

    return (
        <div className="bg-white rounded-xl shadow p-3">
            <div className="d-flex justify-content-between align-items-center mb-3">
                <p className="main-title mb-0">Audit Trail</p>
                <button
                    className="btn btn-primary btn-sm mb-2 action-button"
                    onClick={handleExportExcel}
                    disabled={isExporting || filteredLogs.length === 0}
                    title="Export to Excel"
                >
                    <i className="fa fa-file-excel"> </i> {isExporting ? "Exporting…" : "Export Excel"}
                </button>
            </div>

            <div className="d-flex gap-2 mb-3 align-items-center w-auto">
                <select
                    name="actionType"
                    value={filters.actionType}
                    onChange={handleFilterChange}
                    className="form-select form-select-sm w-auto"
                >
                    <option value="">All Actions</option>
                    {actionTypeOptions.map((a) => (
                        <option key={a} value={a}>{formatActionLabel(a)}</option>
                    ))}
                </select>

                <input
                    type="text"
                    name="userSearch"
                    value={filters.userSearch}
                    onChange={handleFilterChange}
                    placeholder="Search user…"
                    className="form-control form-control-sm w-auto"
                    maxLength={100}
                />

                <input
                    type="date"
                    name="dateFrom"
                    value={filters.dateFrom}
                    onChange={handleFilterChange}
                    className="form-control form-control-sm w-auto"
                    max={filters.dateTo || undefined}
                />

                <input
                    type="date"
                    name="dateTo"
                    value={filters.dateTo}
                    onChange={handleFilterChange}
                    className="form-control form-control-sm w-auto"
                    min={filters.dateFrom || undefined}
                />
                <div className="col-auto">
                    <button
                        className="btn btn-primary btn-sm action-button"
                        onClick={handleClearFilters}
                        disabled={!isFiltered}
                    >
                        <i> </i> Clear
                    </button>
                </div>
            </div>
            <div className="table-responsive-div" style={{ position: "relative", minHeight: 700 }}>
                {loading && (
                    <div style={{
                        position: "absolute", inset: 0,
                        background: "rgba(255,255,255,0.7)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        zIndex: 10,
                    }}>
                        <div className="spinner-border text-primary" role="status">
                            <span className="visually-hidden">Loading…</span>
                        </div>
                    </div>
                )}
                <table className="w-100 bg-white">
                    <thead className="text-white bg-gray-800 z-10">
                        <tr>
                            <th>#</th>
                            <th className="text-start">Timestamp</th>
                            <th className="text-start">User</th>
                            <th className="text-start">Action</th>
                            <th className="text-start">Description</th>
                        </tr>
                    </thead>
                    <tbody className="text-gray-700">
                        {!loading && currentPageData.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="text-center py-4 text-muted">
                                    No data available.
                                </td>
                            </tr>
                        ) : (
                            currentPageData.map((item, index) => (
                                <tr key={item._id} className="bg-gray-100 hover:bg-gray-200 transition">
                                    <td>{startIndex + index + 1}</td>
                                    <td className="text-start">
                                        {item.timestamp ? formatDateTime(new Date(item.timestamp).getTime()) : "—"}
                                    </td>
                                    <td className="text-start">
                                        <div>{item.user?.name || item.user_name || "—"}</div>
                                        {item.user?.email && (
                                            <div className="text-muted" style={{ fontSize: 11 }}>
                                                {item.user.email}
                                            </div>
                                        )}
                                    </td>
                                    <td className="text-start">
                                        {formatActionLabel(item.action_type)}
                                    </td>
                                    <td className="text-start">
                                        {item.description || "—"}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
            <PaginationControls
                currentPage={currentPage}
                totalPages={totalPages}
                pageNumbers={pageNumbers}
                minPageNumberLimit={minPageNumberLimit}
                maxPageNumberLimit={maxPageNumberLimit}
                rowsPerPage={rowsPerPage}
                onPageClick={handleClick}
                onPrev={handlePrev}
                onNext={handleNext}
                onFirst={handleFirst}
                onLast={handleLast}
                onRowsPerPageChange={handleRowsPerPageChange}
            />
        </div>
    );
}