"use client";
import React, { useEffect, useRef, useState } from "react";
import { usePagination } from "@/hooks/usePagination";
import { PaginationControls } from "@/components/common/PaginationControls";
import { showErrorNotification } from "@/helpers/client/swal_fire_helper";
import { getUsers } from "@/apiService/client/users";
import { getRoleByIdAndName, Roles } from "@/utils/roleAndPermission";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store/store";
import ElectricityConsumptionModal from "../projectFormModal/electricityConsumptionModal";
import Swal from "sweetalert2";
import { getProjectCategoryDetails, updateProjectCategory } from "@/apiService/client/projectCategories";
import UploadCategoryFilesModal from "../uploadCategoryFilesModal";
import CategoryDetailsModal from "@/components/projectCategories/categoryDetailsModal";
import { getTemplateUrl, getTemplateFields, getColumnMapping } from '@/utils/templateMapping';
import ReviewModal from "@/components/projectCategories/reviewModal/ReviewModal";
import { parseExcelFile } from '@/utils/excelParser';
import { formatDateDisplay } from "@/utils/function";

export default function ElectricityConsumption({ pid, scid }: { pid: string; scid: string }) {
    const authUser = useSelector((state: RootState) => state.auth);
    const authRoleId = authUser?.role_id;
    const [categoryInfo, setCategoryInfo] = useState<any[]>([]);
    const [categoryDataList, setCategoryDataList] = useState<any[]>([]);
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
    const [selectedReviewData, setSelectedReviewData] = useState<any>(null);
    const [selectedReviewIndex, setSelectedReviewIndex] = useState<number | null>(null);
    const [isProjectCancelled, setIsProjectCancelled] = useState(false);

    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const fetchCategoryData = async () => {
        try {
            const response = await getProjectCategoryDetails({
                pid,
                scid,
            })
            if (response && response?.status === 200) {
                setCategoryDataList(response.data?.data || []);
                setIsProjectCancelled(response.data?.project?.status === "Cancelled");
            }
        } catch (error) {
            showErrorNotification('Something went wrong. Admin has been notified.');
        } finally {
        }
    };

    const updateCategoryInfo = async (updatedList: any[], functionType: string = 'add') => {
        try {
            const response = await updateProjectCategory({
                pid,
                scid,
                dataList: updatedList,
                functionType
            });
            if (response && response?.status === 200) {
            }
        } catch (error) {

        } finally {
            fetchCategoryData();
        }
    };

    const handleDownloadTemplate = () => {
        const templateUrl = getTemplateUrl('electricity-consumption');
        if (templateUrl) {
            const link = document.createElement('a');
            link.href = templateUrl;
            link.download = 'Electricity_Consumption_Template.xlsx';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    };

    const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        setUploading(true);

        try {
            const expectedFields = getTemplateFields('electricity-consumption');
            const columnMapping = getColumnMapping('electricity-consumption');

            if (!expectedFields) {
                showErrorNotification('Template configuration not found');
                setUploading(false);
                return;
            }

            if (!columnMapping) {
                showErrorNotification('Column mapping not found');
                setUploading(false);
                return;
            }

            const { data, errors } = await parseExcelFile(file, expectedFields, columnMapping);

            if (errors.length > 0) {
                showErrorNotification(errors.join(', '));
                setUploading(false);
                return;
            }

            if (data.length === 0) {
                showErrorNotification('No data found in Excel file');
                setUploading(false);
                return;
            }

            const dataWithStatus = data.map(row => ({
                ...row,
                review_status: 'pending',
                review_messages: []
            }));
            const mergedData = [...categoryDataList, ...dataWithStatus];
            await updateCategoryInfo(mergedData, 'add');

            Swal.fire({
                icon: 'success',
                title: 'Success!',
                text: `${data.length} rows imported successfully`,
                confirmButtonColor: '#224b6bff',
            });

        } catch (error) {
            showErrorNotification('Failed to upload file');
        } finally {
            setUploading(false);
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        }
    };

    useEffect(() => {
        fetchCategoryData();
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
    } = usePagination<any>(categoryDataList || []);



    // modal logic <>
    const [selectedRowData, setSelectedRowData] = useState<any>({});
    const [selectedRowIndex, setSelectedRowIndex] = useState<any>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const openAddModal = () => {
        setSelectedRowData({});
        setSelectedRowIndex(null);
        setIsModalOpen(true);
    };

    const openEditModal = (e: React.MouseEvent<HTMLButtonElement>, data: any = {}, index: number) => {
        e.preventDefault();
        setSelectedRowData(data);
        setSelectedRowIndex(index);
        setIsModalOpen(true);
    };

    const updateRow = (data: any = {}) => {
        let updatedList = [];
        let type = "add";
        if (selectedRowIndex !== null) {
            updatedList = categoryDataList.map((item, index) =>
                index === selectedRowIndex ? {
                    ...data,
                    review_status: item.review_status || 'pending',
                    review_messages: item.review_messages || []
                } : item
            );
            type = "update";
        } else {
            updatedList = [...categoryDataList, {
                ...data,
                review_status: 'pending',
                review_messages: []
            }];
        }
        updateCategoryInfo(updatedList, type);
        closeModal();
    };

    const handleDeleteRow = (index: number) => {
        Swal.fire({
            icon: "warning",
            title: "Are you sure?",
            text: "Do you want to delete this row?",
            confirmButtonColor: "#224b6bff",
            confirmButtonText: "Delete",
            showCancelButton: true,
            cancelButtonText: "Cancel",
        }).then((result) => {
            if (!result.isConfirmed) return;
            const updatedList = categoryDataList.filter((row, i) => i !== index);
            updateCategoryInfo(updatedList, 'delete');
        });
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedRowData({});
        setSelectedRowIndex(null);
    }

    const openReviewModal = (data: any, index: number) => {
        setSelectedReviewData(data);
        setSelectedReviewIndex(index);
        setIsReviewModalOpen(true);
    };

    const handleStatusUpdate = (index: number, status: 'approved' | 'rejected' | 'pending', messages: any[]) => {
        const updatedList = categoryDataList.map((item, idx) =>
            idx === index ? {
                ...item,
                review_status: status,
                review_messages: messages
            } : item
        );
        updateCategoryInfo(updatedList, 'update');
    };

    const closeReviewModal = () => {
        setIsReviewModalOpen(false);
        setSelectedReviewData(null);
        setSelectedReviewIndex(null);
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'approved':
                return <span className="badge bg-success ms-2">Approved</span>;
            case 'rejected':
                return <span className="badge bg-danger ms-2">Rejected</span>;
            case 'pending':
            default:
                return <span className="badge bg-warning text-dark ms-2">Pending</span>;
        }
    };

    const [isFUModalOpen, setIsFUModalOpen] = useState(false);
    const [rowDataForFiles, setRowDataForFiles] = useState<any>(
        { pid: pid, scid: scid, index: selectedRowIndex }
    );
    const onFUModalClose = (reload: boolean = false) => {
        setIsFUModalOpen(false);
        setRowDataForFiles({ pid: "", scid: "", index: "" })
        if (reload) {
            fetchCategoryData();
        }
    };

    return (
        <div className="bg-white rounded-xl shadow p-3">
            <div className="d-flex justify-content-between">
                <p className="main-title mb-3">Electricity Consumption</p>
                <div className="d-flex gap-2">
                    {!isProjectCancelled && (
                        <>
                            <button
                                onClick={openAddModal}
                                className="btn btn-primary btn-sm mb-2 action-button"
                                title="Add Data">
                                <i className="fa fa-plus"> </i> Add Data
                            </button>
                            <button
                                onClick={() => fileInputRef.current?.click()}
                                className="btn btn-warning btn-sm mb-2"
                                disabled={uploading}
                                title="Upload filled Excel">
                                {uploading ? (
                                    <span className="spinner-border spinner-border-sm me-1" />
                                ) : (
                                    <i className="fas fa-upload me-1"></i>
                                )}
                                Upload
                            </button>
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept=".xlsx,.xls"
                                style={{ display: 'none' }}
                                onChange={handleFileUpload}
                            />
                        </>
                    )}
                    <button
                        onClick={handleDownloadTemplate}
                        className="btn btn-success btn-sm mb-2"
                        title="Download Excel Template">
                        <i className="fas fa-download me-1"></i> Template
                    </button>
                    {(authRoleId === Roles.AdminId || authRoleId === Roles.ManagerId) && (
                        <button
                            onClick={() => setShowDetailsModal(true)}
                            className="btn btn-secondary btn-sm mb-2"
                            title="View Logs">
                            <i className="fas fa-info-circle"></i> View Logs
                        </button>
                    )}
                </div>
            </div>
            {isProjectCancelled && (
                <div className="alert alert-warning d-flex align-items-center gap-2 py-2 px-3 mb-3" role="alert">
                    <i className="fa fa-lock"></i>
                    <div>
                        <strong>Project Cancelled</strong> — This project has been cancelled. All data is read-only and cannot be modified.
                    </div>
                </div>
            )}
            <div className="table-responsive-div">
                <table className="w-100 bg-white">
                    <thead className="text-white bg-gray-800 z-10">
                        <tr>
                            <th>#</th>
                            <th className="text-start">Reporting Period</th>
                            <th className="text-start">Location</th>
                            <th className="text-start">Electricity Supplier (Grid / Renewable / Mixed)</th>
                            <th className="text-start">Electricty Consumption</th>
                            <th className="text-start">Units</th>
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
                                    <td className="text-start">{formatDateDisplay(item?.reporting_period)}</td>
                                    <td className="text-start">{item.location}</td>
                                    <td className="text-start">{item.electricity_supplier}</td>
                                    <td className="text-start">{item.electricity_consumption}</td>
                                    <td className="text-start">{item.units}</td>
                                    <td className="text-start">{getStatusBadge(item.review_status)}</td>
                                    <td>
                                        {!isProjectCancelled && (
                                            <>
                                                <button
                                                    title="Edit"
                                                    onClick={(e) => openEditModal(e, item, index)}
                                                    className="btn btn-primary action-button">
                                                    <i className="fa fa-edit" style={{ color: "white" }}></i>
                                                </button>
                                                <button
                                                    title="Delete"
                                                    onClick={() => handleDeleteRow(index)}
                                                    className="btn btn-danger action-button ms-2">
                                                    <i className="fa fa-trash" style={{ color: "white" }}></i>
                                                </button>
                                                <button
                                                    title="Attach Reference Document"
                                                    onClick={() => {
                                                        setRowDataForFiles({ pid: pid, scid: scid, index: index })
                                                        setIsFUModalOpen(true);
                                                    }}
                                                    className="btn btn-secondary action-button ms-2">
                                                    <i className="fa fa-paperclip" style={{ color: "white" }}></i>
                                                </button>
                                            </>
                                        )}
                                        <button
                                            title="Review"
                                            onClick={() => openReviewModal(item, index)}
                                            className="btn btn-info action-button ms-2">
                                            <i className="fa fa-clipboard-check" style={{ color: "white" }}></i>
                                        </button>
                                    </td>

                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td
                                    colSpan={8}
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
            <ElectricityConsumptionModal
                isOpen={isModalOpen}
                onClose={() => { closeModal() }}
                index={selectedRowIndex}
                rowData={selectedRowData}
                onUpdate={updateRow}
            />
            <UploadCategoryFilesModal
                isOpen={isFUModalOpen}
                onClose={(reload) => { onFUModalClose(reload = false); }}
                Data={rowDataForFiles} />
            <CategoryDetailsModal
                isOpen={showDetailsModal}
                onClose={() => setShowDetailsModal(false)}
                projectCategoryId={scid}
                categoryName="Electricity Consumption"
            />
            <ReviewModal
                isOpen={isReviewModalOpen}
                onClose={closeReviewModal}
                rowData={selectedReviewData}
                rowIndex={selectedReviewIndex || 0}
                onStatusUpdate={handleStatusUpdate}
            />
        </div>
    );
}