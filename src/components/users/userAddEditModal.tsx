'use client';

import React, { useEffect, useRef, useState } from 'react';
import Modal from "@/components/common/Modal";
import SelectField from '../common/SelectField';
import { roleListForOption, Roles } from '@/utils/roleAndPermission';
import { addUser, updateUser } from '@/apiService/client/users';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store/store';

interface FormData {
    id?: string;
    name: string;
    email: string;
    phone_number: string;
    role_id: string;
}

interface initialData {
    _id: string;
    name: string;
    email: string;
    phone_number: string;
    role_id: string;
}

interface Props {
    isOpen: boolean;
    onClose: (reload?: boolean) => void;
    initialData?: initialData | null;
}

export default function UserAddEditModal({
    isOpen,
    onClose,
    initialData = null,
}: Props) {

    const initialEmptyData = {
        id: "",
        name: "",
        email: "",
        phone_number: "",
        role_id: "",
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
                name: initialData.name || "",
                email: initialData.email || "",
                phone_number: initialData.phone_number || "",
                role_id: initialData.role_id || "",
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
        if (!formData?.name) errors.name = "Name is required.";
        if (!formData?.email) errors.email = "Email is required.";
        if (!formData?.phone_number) errors.phone_number = "Phone number is required.";
        if (!formData?.role_id) errors.role_id = "Role is required.";

        setErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async () => {
        isValidateOnChange.current = true;

        if (!validateForm()) return;

        if (formData.id) {
            await updateUser(formData);
        } else {
            await addUser(formData);
        }

        resetForm();
        onClose(true);
    };

    return (
        <Modal isOpen={isOpen} onClose={() => { resetForm(); onClose(); }} title={formData?.id ? "Edit User" : "Add User"} size="lg">
            <div className="row space-y-2">
                <div className="mb-3 col-lg-6 col-md-12">
                    <label htmlFor="name" className="form-label">Name</label>
                    <input
                        type="text"
                        className={`form-control ${errors?.name ? "is-invalid" : ""}`}
                        id="name"
                        placeholder="Enter name"
                        value={formData?.name || ""}
                        onChange={handleChange}
                    />
                    {errors?.name && <div className="invalid-feedback">{errors?.name}</div>}
                </div>

                {/* Email */}
                <div className="mb-3 col-lg-6 col-md-12">
                    <label htmlFor="email" className="form-label">Email</label>
                    <input
                        type="email"
                        className={`form-control ${errors?.email ? "is-invalid" : ""}`}
                        id="email"
                        placeholder="Enter email"
                        value={formData?.email || ""}
                        onChange={handleChange}
                    />
                    {errors?.email && <div className="invalid-feedback">{errors?.email}</div>}
                </div>

                {/* Phone Number */}
                <div className="mb-3 col-lg-6 col-md-12">
                    <label htmlFor="phone_number" className="form-label">Phone Number</label>
                    <input
                        type="text"
                        className={`form-control ${errors?.phone_number ? "is-invalid" : ""}`}
                        id="phone_number"
                        placeholder="Enter phone number"
                        value={formData?.phone_number || ""}
                        onChange={handleChange}
                    />
                    {errors?.phone_number && <div className="invalid-feedback">{errors?.phone_number}</div>}
                </div>

                <div className="mb-3 col-lg-6 col-md-12">
                    <SelectField
                        label="Role"
                        isMulti={false}
                        selectAllOptions={false}
                        value={formData.role_id}
                        options={roleListForOption}
                        onChange={(val) =>
                            setFormData({ ...formData, role_id: val as string })
                        }
                        error={errors?.role_id}
                    />
                </div>


                {/* Button */}
                <div className="col-12 text-center pt-2">
                    <button className="btn btn-primary action-button w-50" onClick={handleSubmit}>
                        {formData.id ? "Update User" : "Add User"}
                    </button>
                </div>

            </div>
        </Modal>
    );
}
