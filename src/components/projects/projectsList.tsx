"use client";
import React, { useEffect, useState } from "react";
import { usePagination } from "@/hooks/usePagination";
import { PaginationControls } from "@/components/common/PaginationControls";
import JSZip from "jszip";
import Link from "next/link";
import ProjectAddEditModal from "./projectAddEditModal";
import { showErrorNotification } from "@/helpers/client/swal_fire_helper";
import { cancelProject, getProjects, restoreProject } from "@/apiService/client/projects";
import { formatDateTime } from "@/utils/function";
import { getCategories } from "@/apiService/client/categories";
import { getRolePermission } from "@/utils/roleAndPermission";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store/store";
import dynamic from 'next/dynamic';
import { buildReportData } from "@/data/reportData";
import { getProjectResult } from "@/apiService/client/projects";
import { validateProjectDataForReport } from "@/utils/validateProjectDataForReport";
import Swal from "sweetalert2";
import { getTemplateUrl } from "@/utils/templateMapping";
import { addAuditLog } from "@/apiService/client/auditLogs";


const ProfessionalGhgReport = dynamic(
    () => import('@/components/reports/ProfessionalGhgReport').then(mod => mod.ProfessionalGhgReport),
    { ssr: false }
);

interface ProjectData {
    _id?: string;
    project_name?: string;
    sector?: string;
}

type Status = "New" | "In Progress" | "Completed" | "Cancelled";

const STATUS_CONFIG: Record<Status, { icon: string; bg: string; color: string; border: string }> = {
    "New": { icon: "fa-star", bg: "#f3eaf0", color: "#681949", border: "1px solid #681949" },
    "In Progress": { icon: "fa-spinner fa-spin", bg: "#4f4d4d1a", color: "#4f4d4d", border: "1px solid #4f4d4d" },
    "Completed": { icon: "fa-check-circle", bg: "#e6f9f0", color: "#1a7a45", border: "1px solid #1a7a45" },
    "Cancelled": { icon: "fa-ban", bg: "#fdecea", color: "#c62828", border: "1px solid #c62828" },
};

const StatusBadge = ({ status }: { status?: string }) => {
    const config = STATUS_CONFIG[status as Status];
    if (!config) return <span>{status ?? "—"}</span>;
    return (
        <span style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "6px",
            padding: "4px 10px",
            borderRadius: "20px",
            fontSize: "11px",
            fontWeight: 600,
            letterSpacing: "0.3px",
            background: config.bg,
            color: config.color,
            border: config.border,
        }}>
            <i className={`fa ${config.icon}`} style={{ fontSize: "10px" }} />
            {status}
        </span>
    );
};

export default function Projects() {
    const authUser = useSelector((state: RootState) => state.auth);
    const authRoleId = authUser?.role_id;
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editData, setEditData] = useState<any>(null);
    const [projectsList, setProjectsList] = useState<any[]>([]);
    const [categories, setCategories] = useState<any>({});
    const [showReport, setShowReport] = useState(false);
    const [reportData, setReportData] = useState<any>(null);
    const [reportLoadingId, setReportLoadingId] = useState<string | null>(null);
    const [cancelledLoadingId, setCancelledLoadingId] = useState<string | null>(null);
    const [restoreLoadingId, setRestoreLoadingId] = useState<string | null>(null);

    const fetchProjectsData = async () => {
        try {
            const result = await getProjects();
            setProjectsList(result?.data || []);
        } catch (error) {
            showErrorNotification('Something went wrong. Admin has been notified.');
        }
    };

    useEffect(() => {
        fetchProjectsData();
    }, []);

    const fetchCategories = async () => {
        try {
            const result = await getCategories();
            setCategories(result?.data || {});
        } catch (error) {
            showErrorNotification('Something went wrong. Admin has been notified.');
        }
    };

    const openAddModal = () => {
        setEditData(null);
        fetchCategories();
        setIsModalOpen(true);
    };

    const openEditModal = (e: React.MouseEvent<HTMLButtonElement>, data: ProjectData = {}) => {
        e.preventDefault();
        setEditData(data);
        fetchCategories();
        setIsModalOpen(true);
    };

    const handleGenerateReport = async (e: React.MouseEvent, item: any) => {
        e.preventDefault();
        e.stopPropagation();

        const validationErrors = validateProjectDataForReport(item);

        if (Object.keys(validationErrors).length > 0) {
            let errorMessage = "<div style='text-align: left;'>";
            for (const [key, value] of Object.entries(validationErrors)) {
                errorMessage += `<strong>${key}:</strong> <small>${value}</small><br>`;
            }
            errorMessage += "</div>";
            Swal.fire({
                title: "Report Generation Error",
                html: errorMessage,
                icon: "error",
                timerProgressBar: true,
                showConfirmButton: true,
                confirmButtonText: "OK",
                confirmButtonColor: "#4d2e31",
                showClass: {
                    popup: 'animate__animated animate__fadeInDown animate__faster',
                },
                hideClass: {
                    popup: 'animate__animated animate__fadeOutUp animate__faster',
                },
            });

            return;
        }

        try {
            setReportLoadingId(item._id);
            const result = await getProjectResult({ id: item._id });
            if (!result || result.status !== 200 || !result.data?.ProjectResultInfo) {
                showErrorNotification(result?.message || "Failed to load report data.");
                return;
            }
            const report = buildReportData(item, result.data);
            setReportData(report);
            setShowReport(true);
        } catch (error) {
            showErrorNotification("Failed to generate report. Please try again.");
        } finally {
            setReportLoadingId(null);
        }
    };

    const handleCancelProject = async (e: React.MouseEvent, item: any) => {
        e.preventDefault();
        e.stopPropagation();

        const confirm = await Swal.fire({
            title: "Cancel Project?",
            text: `Are you sure you want to cancel "${item.name}"?`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes, Cancel It",
            cancelButtonText: "No",
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            showClass: { popup: 'animate__animated animate__fadeInDown animate__faster' },
            hideClass: { popup: 'animate__animated animate__fadeOutUp animate__faster' },
        });

        if (!confirm.isConfirmed) return;

        try {
            setCancelledLoadingId(item._id);
            const result = await cancelProject({ id: item._id });
            if (result?.status === 200) {
                await fetchProjectsData();
            } else {
                showErrorNotification(result?.message || "Failed to cancel project.");
            }
        } catch (error) {
            showErrorNotification("Failed to cancel project. Please try again.");
        } finally {
            setCancelledLoadingId(null);
        }
    };

    const handleRestoreProject = async (e: React.MouseEvent, item: any) => {
        e.preventDefault();
        e.stopPropagation();

        const confirm = await Swal.fire({
            title: "Restore Project?",
            text: `Are you sure you want to restore "${item.name}"?`,
            icon: "question",
            showCancelButton: true,
            confirmButtonText: "Yes, Restore It",
            cancelButtonText: "No",
            confirmButtonColor: "#28a745",
            cancelButtonColor: "#3085d6",
        });

        if (!confirm.isConfirmed) return;

        try {
            setRestoreLoadingId(item._id);
            const result = await restoreProject({ id: item._id });
            if (result?.status === 200) {
                await fetchProjectsData();
            } else {
                showErrorNotification(result?.message || "Failed to restore project.");
            }
        } catch (error) {
            showErrorNotification("Failed to restore project. Please try again.");
        } finally {
            setRestoreLoadingId(null);
        }
    };

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
    } = usePagination<any>(projectsList || []);

    const handleDownloadAllTemplates = async (e: React.MouseEvent, item: any) => {
        e.preventDefault();
        e.stopPropagation();

        const categories = item?.projectCategories || [];
        if (!categories.length) {
            showErrorNotification("No categories found for this project.");
            return;
        }

        const zip = new JSZip();
        let fileAdded = false;

        await Promise.all(
            categories.map(async (pc: any) => {
                const categoryName = pc?.categoryDetail?.[0]?.name || "";
                const categoryType = pc?.categoryDetail?.[0]?.type || "";
                const templateUrl = getTemplateUrl(categoryType);
                if (!templateUrl) return;

                try {
                    const response = await fetch(templateUrl);
                    if (!response.ok) return;
                    const blob = await response.blob();
                    const arrayBuffer = await blob.arrayBuffer();
                    const fileName = `${categoryName.replace(/\s+/g, "_")}_Template.xlsx`;
                    zip.file(fileName, arrayBuffer);
                    fileAdded = true;
                } catch {
                }
            })
        );

        if (!fileAdded) {
            showErrorNotification("No templates available for this project's categories.");
            return;
        }

        const zipBlob = await zip.generateAsync({ type: "blob" });
        const url = URL.createObjectURL(zipBlob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${item.name || "project"}_templates.zip`;
        a.click();
        URL.revokeObjectURL(url);
    };

    const handleLogView = (item: any) => {
        try {
            addAuditLog(
                {
                    action_type: "view_details",
                    description: `User accessed details for project: ${item?.name}`,
                    user_name: authUser?.name || authUser?.email,
                },
                authUser
            );
        } catch (error) {
        }
    };


    return (
        <>
            <div className="bg-white rounded-xl shadow p-3">
                <div className="d-flex justify-content-between">
                    <p className="main-title mb-3">
                        Projects
                    </p>
                    {getRolePermission(authRoleId, "add-project") &&
                        <button
                            onClick={openAddModal}
                            className="btn btn-primary btn-sm mb-2 action-button"
                            title="Create a new project"
                        >
                            <i className="fa fa-plus"> </i> Create Project
                        </button>
                    }
                </div>
                <div className="table-responsive-div">
                    <table className="w-100 bg-white">
                        <thead className="text-white bg-gray-800 z-10">
                            <tr>
                                <th>Project Type</th>
                                <th className="text-start"> Year</th>
                                <th className="text-start">Project Name</th>
                                <th>Status</th>
                                <th>Created At</th>
                                <th>Created By</th>
                                <th style={{ minWidth: "120px" }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody className="text-gray-700">
                            {Array.isArray(currentPageData) &&
                                currentPageData.length > 0 ? (
                                currentPageData.map((item, index) => (
                                    <tr
                                        key={index + 1}
                                        className={`bg-gray-100 hover:bg-gray-200 transition`}
                                    >
                                        <td>{item?.type}</td>
                                        <td className="text-start">{item.year}</td>
                                        <td className="text-start">{item?.name}</td>
                                        <td><StatusBadge status={item?.status} /></td>
                                        <td>{formatDateTime(item?.createdAt)}</td>
                                        <td>{item?.createdBy?.name}</td>
                                        <td>
                                            {getRolePermission(authRoleId, "edit-project") && item?.status !== "Cancelled" &&
                                                <button
                                                    onClick={(e) => openEditModal(e, item)}
                                                    className="btn btn-primary action-button ms-1">
                                                    <i className="fa fa-edit" style={{ color: "white" }}></i>
                                                </button>
                                            }
                                            <Link
                                                href={`/projects/${item._id}/view-details`}
                                                className="btn btn-primary action-button ms-1"
                                                onClick={() => handleLogView(item)}>
                                                <i className="fa fa-eye" style={{ color: "white" }}></i>
                                            </Link>
                                            <button
                                                onClick={(e) => handleDownloadAllTemplates(e, item)}
                                                className="btn btn-success action-button ms-1"
                                                title="Download All Templates"
                                            >
                                                <i className="fa fa-download" style={{ color: "white" }}></i>
                                            </button>
                                            {getRolePermission(authRoleId, "generate-report") &&
                                                <button
                                                    onClick={(e) => handleGenerateReport(e, item)}
                                                    disabled={reportLoadingId === item._id}
                                                    className="btn btn-success action-button ms-1"
                                                    title="Generate GHG Report">
                                                    <i className="fa fa-file-pdf" style={{ color: "white" }}></i>
                                                </button>
                                            }
                                            {getRolePermission(authRoleId, "edit-project") && (
                                                item?.status === "Cancelled" ? (
                                                    <button
                                                        onClick={(e) => handleRestoreProject(e, item)}
                                                        disabled={restoreLoadingId === item._id}
                                                        className="btn btn-success action-button ms-1"
                                                        title="Restore Project"
                                                    >
                                                        {restoreLoadingId === item._id
                                                            ? <i className="fa fa-spinner fa-spin" style={{ color: "white" }}></i>
                                                            : <i className="fa fa-rotate-left" style={{ color: "white" }}></i>
                                                        }
                                                    </button>
                                                ) : (
                                                    <button
                                                        onClick={(e) => handleCancelProject(e, item)}
                                                        disabled={cancelledLoadingId === item._id}
                                                        className="btn btn-danger action-button ms-1"
                                                        title="Cancel Project"
                                                    >
                                                        {cancelledLoadingId === item._id
                                                            ? <i className="fa fa-spinner fa-spin" style={{ color: "white" }}></i>
                                                            : <i className="fa fa-ban" style={{ color: "white" }}></i>
                                                        }
                                                    </button>
                                                )
                                            )}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td
                                        colSpan={9}
                                        className="text-center py-4 text-muted"
                                    >
                                        No data available.
                                    </td>
                                </tr>
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
                <ProjectAddEditModal
                    isOpen={isModalOpen}
                    onClose={(reload = false) => { reload && fetchProjectsData(); setIsModalOpen(false) }}
                    initialData={editData}
                    categories={categories}
                />
            </div>
            {showReport && reportData && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'white',
                    zIndex: 9999,
                    overflow: 'auto'
                }}>
                    <ProfessionalGhgReport
                        data={reportData}
                        onClose={() => setShowReport(false)}
                    />
                </div>
            )}
        </>
    );
}