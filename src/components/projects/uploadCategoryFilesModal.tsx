'use client';

import React, { use, useEffect, useRef, useState } from 'react';
import Modal from "@/components/common/Modal";
import { getCategoryFiles, updateCategoryFiles, uploadCategoryFiles, viewCategoryFile } from '@/apiService/client/projectCategories';
import Swal from "sweetalert2";
import { formatDateDisplay } from '@/utils/function';

interface Data {
    index: number;
    pid: string;
    scid: string;
}

interface Props {
    isOpen: boolean;
    onClose: (reload?: boolean) => void;
    Data: Data;
}

export default function UploadCategoryFilesModal({
    isOpen,
    onClose,
    Data,
}: Props) {

    const fileRef = useRef<HTMLInputElement>(null);
    const pid = useRef(Data?.pid);
    const scid = useRef(Data?.scid);
    const rowIndex = useRef(Data?.index?.toString());
    const [filesList, setFilesList] = useState<any[]>([]);
    const [linkInput, setLinkInput] = useState("");
    const [linksList, setLinksList] = useState<string[]>([]);

    const loadFiles = useRef(true);

    const [error, setError] = useState("");

    const [loading, setLoading] = useState(false);

    const getFiles = async () => {
        const response = await getCategoryFiles({
            scid: scid?.current,
            rowIndex: rowIndex?.current,
        });
        if (response && response?.status === 200) {
            setFilesList(response?.data);

        }
    };
    useEffect(() => {
        if (scid.current) {
            getFiles();
        }

    }, [scid.current]);

    useEffect(() => {
        pid.current = Data?.pid;
        scid.current = Data?.scid;
        rowIndex.current = Data?.index?.toString();
        if (Data.scid) {
            getFiles();
        }
    }, [Data]);

    const validateFiles = (files: File[]): boolean => {
        const allowedTypes = [
            "application/pdf",
            "image/jpeg",
            "image/png",
            "image/jpg",
            "image/webp"
        ];

        const maxSize = 200 * 1024 * 1024;

        for (let file of files) {
            if (!allowedTypes.includes(file.type)) {
                setError("Only PDF and Image files are allowed.");
                return false;
            }

            if (file.size > maxSize) {
                setError("Each file must be less than 2MB.");
                return false;
            }
        }

        return true;
    };

    const handleSubmit = async () => {
        if (!fileRef.current?.files?.length) {
            setError("Please select at least one file.");
            return;
        }

        const files = Array.from(fileRef.current.files);

        if (!validateFiles(files)) return;

        setLoading(true);

        const formData = new FormData();
        files.forEach((file) => {
            formData.append("files[]", file);
        });
        formData.append("pid", pid.current);
        formData.append("scid", scid.current);
        formData.append("rowIndex", rowIndex.current);

        const response = await uploadCategoryFiles(formData);

        setLoading(false);

        if (response?.status === 200) {
            if (fileRef.current) fileRef.current.value = "";
            setError("");
            getFiles();
        }
    };

    const handleUpdateCategoryFiles = async (updatedList: any[]) => {
        try {
            const response = await updateCategoryFiles({
                scid: scid?.current,
                rowIndex: rowIndex?.current,
                filesList: updatedList,
            });
            if (response && response?.status === 200) {
                setFilesList(updatedList);
            }
        } catch (error) {
        }
    };

    const handleViewFile = async (name: string, index: number) => {
        try {
            const response = await viewCategoryFile({
                scid: scid?.current,
                rowIndex: rowIndex?.current,
                fileName: name,
                fileIndex: index
            });

            if (!response) {
                Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: "File not found",
                });
                return;
            }
            const contentType = response.headers?.["content-type"] || "application/octet-stream";
            const fileBlob = new Blob([response.data], { type: contentType });
            const fileURL = window.URL.createObjectURL(fileBlob);
            window.open(fileURL, "_blank");

        } catch (error: any) {
            if (error?.response?.data instanceof Blob) {
                try {
                    const text = await error.response.data.text();
                    const json = JSON.parse(text);
                    Swal.fire({
                        icon: "error",
                        title: "Error",
                        text: json?.message || "File not found",
                    });
                } catch {
                    Swal.fire({
                        icon: "error",
                        title: "Error",
                        text: "File not found",
                    });
                }
            } else {
                Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: error?.message || "Something went wrong",
                });
            }
        }
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
            const updatedList = filesList.filter((_, i) => i !== index);
            handleUpdateCategoryFiles(updatedList);
        });
    };

    const handleAddLink = async () => {
        if (!linkInput.trim()) return;
        const newLink = { original_name: linkInput.trim(), type: 'link', uploaded_at: new Date() };
        const updatedList = [...filesList, newLink];
        await handleUpdateCategoryFiles(updatedList);
        setLinkInput("");
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={() => { onClose(); setFilesList([]); setError(""); }}
            title="Source Files"
            size="lg"
        >
            <div className="row">
                <div className="mb-3 col-8">
                    <label className="form-label">Select Files or Paste Link
                        <small className="text-muted fa-2xs ps-1">
                            ( PDF, JPG, PNG, WEBP (Max 200MB) or any URL )
                        </small>
                    </label>
                    <div className="input-group">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Paste a link or Outlook URL..."
                            value={linkInput}
                            onChange={(e) => setLinkInput(e.target.value)}
                            onKeyDown={(e) => { if (e.key === 'Enter') handleAddLink(); }}
                        />
                        <input
                            ref={fileRef}
                            type="file"
                            multiple
                            accept=".pdf,image/*"
                            style={{ display: 'none' }}
                            onChange={() => handleSubmit()}
                        />
                    </div>
                    {error && <small className="text-danger">{error}</small>}
                </div>

                <div className="col-4 text-end align-content-center">
                    <button
                        className="btn btn-primary action-button"
                        onClick={() => {
                            if (linkInput.trim()) {
                                handleAddLink();
                            } else {
                                fileRef.current?.click();
                            }
                        }}
                        disabled={loading}
                    >
                        <i className={`fas ${linkInput.trim() ? 'fa-link' : 'fa-upload'} me-1`}></i>
                        {loading ? "Uploading..." : linkInput.trim() ? "Add Link" : "Upload"}
                    </button>
                </div>
            </div>
            <div className="row pt-3">
                <div className="table-responsive-div" style={{ maxHeight: "200px" }}>
                    <table className="w-100 bg-white">
                        <thead className="text-white bg-gray-800 z-10">
                            <tr>
                                <th>#</th>
                                <th className="text-start">File</th>
                                <th className="text-start">Uploaded At</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody className="text-gray-700">
                            {Array.isArray(filesList) &&
                                filesList.length > 0 ? (
                                filesList.map((item, index) => (
                                    <tr
                                        key={index + 1}
                                        className={`bg-gray-100 hover:bg-gray-200 transition`}
                                    >
                                        <td>{index + 1}</td>
                                        <td className="text-start">{item?.original_name}</td>
                                        <td style={{ minWidth: "200px" }} className="text-start">{formatDateDisplay(item?.uploaded_at)}</td>
                                        <td style={{ minWidth: "100px" }}>
                                            <button
                                                onClick={() => {
                                                    if (item?.type === 'link') {
                                                        window.open(item?.original_name, '_blank');
                                                    } else {
                                                        handleViewFile(item?.name, index);
                                                    }
                                                }}
                                                className="btn action-button">
                                                <i className={`fa ${item?.type === 'link' ? 'fa-external-link' : 'fa-eye'}`} style={{ color: "white" }}></i>
                                            </button>
                                            <button
                                                onClick={() => handleDeleteRow(index)}
                                                className="btn btn-danger action-button ms-2">
                                                <i className="fa fa-trash" style={{ color: "white" }}></i>
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
            </div>
        </Modal>
    );
}