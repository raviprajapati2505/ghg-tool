"use client";

import React, { useEffect, useRef, useState } from "react";
import { usePagination } from "@/hooks/usePagination";
import { PaginationControls } from "@/components/common/PaginationControls";
import { showErrorNotification } from "@/helpers/client/swal_fire_helper";
import { getUsers, toggleUserStatus } from "@/apiService/client/users";
import { getRoleByIdAndName, Roles } from "@/utils/roleAndPermission";
import UserAddEditModal from "./userAddEditModal";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store/store";
import { formatDateTime } from "@/utils/function";

export default function Users() {
    const authUser = useSelector((state: RootState) => state.auth);
    const authRoleId = authUser?.role_id;
    const [usersData, setUsersData] = useState<any[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editData, setEditData] = useState<any>(null);
    const [togglingId, setTogglingId] = useState<string | null>(null);

    const fetchUsersData = async () => {
        try {
            const result = await getUsers();
            setUsersData(result?.data || []);
        } catch (error) {
            showErrorNotification('Something went wrong. Admin has been notified.');
        } finally {
        }
    };

    useEffect(() => {
        fetchUsersData();
    }, []);
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
    } = usePagination<any>(usersData || []);

    const openAddModal = () => {
        setEditData(null);
        setIsModalOpen(true);
    };

    const openEditModal = (e: React.MouseEvent<HTMLButtonElement>, data: any = {}) => {
        e.preventDefault();
        setEditData(data);
        setIsModalOpen(true);
    };

    const handleToggleStatus = async (e: React.MouseEvent<HTMLButtonElement>, item: any) => {
        e.preventDefault();
        setTogglingId(item._id);
        await toggleUserStatus({ id: item._id });
        await fetchUsersData();
        setTogglingId(null);
    };

    return (
        <div className="bg-white rounded-xl shadow p-3">
            <div className="d-flex justify-content-between">
                <p className="main-title mb-3">Users</p>
                <button
                    onClick={openAddModal}
                    className="btn btn-primary btn-sm mb-2 action-button">
                    <i className="fa fa-plus"> </i> Create User
                </button>
            </div>
            <div className="table-responsive-div">
                <table className="w-100 bg-white">
                    <thead className="text-white bg-gray-800 z-10">
                        <tr>
                            <th>#</th>
                            <th className="text-start">Name</th>
                            <th className="text-start">Email</th>
                            <th className="text-start">Role</th>
                            <th className="text-start">Status</th>
                            <th className="text-start">Last Login</th>
                            <th>Action</th>
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
                                    <td>{startIndex + index + 1}</td>
                                    <td className="text-start">
                                        {item?.name}
                                    </td>
                                    <td className="text-start">
                                        {item?.email}
                                    </td>
                                    <td className="text-start">
                                        {getRoleByIdAndName(item?.role_id)}
                                    </td>
                                    <td className="text-start">
                                        {item?.status?.toLowerCase() === 'active' ? (
                                            <span style={{
                                                color: '#10b981',
                                                border: '1px solid #10b981',
                                                padding: '4px 12px',
                                                borderRadius: '4px',
                                                display: 'inline-block'
                                            }}>
                                                <i className="fas fa-check-circle"></i> Active
                                            </span>
                                        ) : (
                                            <span style={{
                                                color: '#ef4444',
                                                border: '1px solid #ef4444',
                                                padding: '4px 12px',
                                                borderRadius: '4px',
                                                display: 'inline-block'
                                            }}>
                                                <i className="fas fa-times-circle"></i> Inactive
                                            </span>
                                        )}
                                    </td>
                                    <td className="text-start">
                                        {item?.lastLogin ? formatDateTime(item?.lastLogin) : "Never"}
                                    </td>
                                    <td>
                                        <div className="d-flex gap-2 justify-content-center">
                                            <button
                                                onClick={(e) => openEditModal(e, item)}
                                                className="btn btn-primary btn-sm action-button"
                                                title="Edit user"
                                            >
                                                <i className="fa fa-edit" style={{ color: "white" }}></i>
                                            </button>

                                            {authUser?.id?.toString() !== item?._id?.toString() && (
                                                <button
                                                    onClick={(e) => handleToggleStatus(e, item)}
                                                    disabled={togglingId === item._id}
                                                    className="btn btn-sm"
                                                    title={item?.status?.toLowerCase() === "active" ? "Disable user" : "Enable user"}
                                                    style={{
                                                        backgroundColor: item?.status?.toLowerCase() === "active" ? "#ef4444" : "#10b981",
                                                        color: "white",
                                                        border: "none",
                                                        minWidth: 34,
                                                    }}
                                                >
                                                    {togglingId === item._id ? (
                                                        <span className="spinner-border spinner-border-sm" />
                                                    ) : (
                                                        <i className={`fas ${item?.status?.toLowerCase() === "active" ? "fa-user-slash" : "fa-user-check"}`}></i>
                                                    )}
                                                </button>
                                            )}
                                        </div>
                                    </td>

                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td
                                    colSpan={7}
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
            <UserAddEditModal
                isOpen={isModalOpen}
                onClose={(reload = false) => { reload && fetchUsersData(); setIsModalOpen(false) }}
                initialData={editData}
            />
        </div>
    );
}