'use client';

import React, { useEffect, useRef, useState } from 'react';
import Modal from "@/components/common/Modal";
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store/store';
import { updateCategory } from '@/apiService/client/categories';

interface FormData {
    id?: string;
    name: string;
    scope: string;
    status?: string;
}

interface initialData {
    _id: string;
    name: string;
    scope: string;
    status?: string;
}

interface Props {
    isOpen: boolean;
    onClose: (reload?: boolean) => void;
    initialData?: initialData | null;
}

export default function CategoriesAddEditModal({
    isOpen,
    onClose,
    initialData = null,
}: Props) {

    const initialEmptyData = {
        id: "",
        name: "",
        scope: "",
        status: "",
    }
    const authUser = useSelector((state: RootState) => state.auth);
    const authRoleId = authUser?.role_id;
    const [formData, setFormData] = useState<FormData>(initialEmptyData);

    const [errors, setErrors] = useState<Record<string, string>>({});
    const isValidateOnChange = useRef(false);


    useEffect(() => {
        if (initialData) {
            setFormData({
                id: initialData._id || "",
                name: initialData?.name || "",
                scope: initialData?.scope || "",
                status: initialData?.status || "",
            });
        } else {
            resetForm(); // safe now
        }
    }, [initialData]);

    /* ------------------ Live validation ------------------ */
    useEffect(() => {
        if (isValidateOnChange.current) validateForm();
    }, [formData]);

    const resetForm = () => {
        setFormData(initialEmptyData);
        setErrors({});
        isValidateOnChange.current = false;
    };

    const handleChange = (e: any) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
    };
    const validateForm = () => {
        const errors: Record<string, string> = {};
        if (!formData?.status) errors.status = "Status is required.";

        setErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async () => {
        isValidateOnChange.current = true;

        if (!validateForm()) return;
        if (formData.id) {
            await updateCategory({ status: formData.status, id: formData.id });
        }

        resetForm();
        onClose(true);
    };

    return (
        <Modal isOpen={isOpen} onClose={() => { resetForm(); onClose(); }} title={"Edit Category"} size="lg">
            <div className="row space-y-2">
                <div className="mb-3 col-lg-6 col-md-12">
                    <label htmlFor="name" className="form-label">Name</label>
                    <input
                        type="text"
                        className={`form-control ${errors?.name ? "is-invalid" : ""}`}
                        id="name"
                        placeholder="Enter name"
                        value={formData?.name || ""}
                        disabled
                    />
                    {errors?.name && <div className="invalid-feedback">{errors?.name}</div>}
                </div>

                <div className="mb-3 col-lg-6 col-md-12">
                    <label htmlFor="scope" className="form-label">Scope</label>
                    <select
                        className={`form-select ${errors?.scope ? "is-invalid" : ""}`}
                        id="scope"
                        value={formData?.scope || ""}
                        disabled
                    >
                        <option value="">Select Scope</option>
                        <option value="1">Scope 1</option>
                        <option value="2">Scope 2</option>
                        <option value="3">Scope 3</option>
                    </select>
                    {errors?.scope && <div className="invalid-feedback">{errors?.scope}</div>}
                </div>

                <div className="mb-3 col-lg-6 col-md-12">
                    <label htmlFor="status" className="form-label">Status</label>
                    <select
                        className={`form-select ${errors?.status ? "is-invalid" : ""}`}
                        id="status"
                        value={formData?.status || ""}
                        onChange={handleChange}
                    >
                        <option value="">Select Status</option>
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                    </select>
                    {errors?.status && <div className="invalid-feedback">{errors?.status}</div>}
                </div>


                {/* Button */}
                <div className="col-12 text-center pt-2">
                    <button className="btn btn-primary action-button " onClick={handleSubmit}>
                        {"Update Category"}
                    </button>
                </div>

            </div>
        </Modal>
    );
}
