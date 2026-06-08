"use client";

import React, { useEffect, useRef, useState } from "react";
import { usePagination } from "@/hooks/usePagination";
import { PaginationControls } from "@/components/common/PaginationControls";
import { showErrorNotification, showInfoNotification } from "@/helpers/client/swal_fire_helper";
import CategoriesAddEditModal from "./categoriesAddEditModal";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store/store";
import { getAllCategories } from "@/apiService/client/categories";
import Breadcrumb from "../common/Breadcrumb";

export default function CategoriesSettings() {
    const authUser = useSelector((state: RootState) => state.auth);
    const authRoleId = authUser?.role_id;
    const [categoriesData, setCategoriesData] = useState<any[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editData, setEditData] = useState<any>(null);
    const [togglingId, setTogglingId] = useState<string | null>(null);

    const fetchCategoriesData = async () => {
        try {
            const result = await getAllCategories();
            const data = result?.data || [];
            setCategoriesData(data);
        } catch (error) {
            showErrorNotification('Something went wrong. Admin has been notified.');
        } finally {
        }
    };

    useEffect(() => {
        fetchCategoriesData();
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
    } = usePagination<any>(categoriesData || []);

    const openEditModal = (e: React.MouseEvent<HTMLButtonElement>, data: any = {}) => {
        e.preventDefault();
        setEditData(data);
        setIsModalOpen(true);
    };



    return (
        <>
            <Breadcrumb
                items={[
                    { label: "Settings", href: "/settings/" },
                    { label: "Categories" },
                ]}
            />
            <div className="bg-white rounded-xl shadow p-3">
                <p className="main-title pb-1">Categories</p>
                <div className="table-responsive-div">
                    <table className="w-100 bg-white">
                        <thead className="text-white bg-gray-800 z-10">
                            <tr>
                                <th>#</th>
                                <th className="text-start">Name</th>
                                <th className="text-start">Scope</th>
                                <th className="text-start">Status</th>
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
                                            {item?.scope}
                                        </td>
                                        <td className="text-start">
                                            {item?.status === "active" ? (
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
                                        <td>
                                            <div className="d-flex gap-2 justify-content-center">
                                                {item?.isApproved ? (
                                                    <button
                                                        onClick={(e) => openEditModal(e, item)}
                                                        className="btn btn-primary btn-sm action-button"
                                                        title="Edit Category"
                                                    >
                                                        <i className="fa fa-edit" style={{ color: "white" }}></i>
                                                    </button>
                                                ) : (
                                                    <button
                                                        onClick={(e) => showInfoNotification("This category has not been activated yet. Please contact the system support team.")}
                                                        className="btn btn-primary btn-sm action-button"
                                                        title="Edit Category"
                                                    >
                                                        <i className="fa fa-edit" style={{ color: "white" }}></i>
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
                <CategoriesAddEditModal
                    isOpen={isModalOpen}
                    onClose={(reload = false) => { reload && fetchCategoriesData(); setIsModalOpen(false) }}
                    initialData={editData}
                />
            </div>
        </>
    );
}