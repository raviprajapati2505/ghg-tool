'use client';

import React, { useEffect, useRef, useState } from 'react';
import Modal from "@/components/common/Modal";
import { OnlyFloatAndInteger } from '@/helpers/client/function';
import { purchasedGoodsAndServicesEmissionList } from '@/utils/emissionFactor';
import { formatDateDisplay } from '@/utils/function';

interface FormData {
    date_of_expense: string;
    description: string;
    currency: string;
    amount: string;
}

interface rowData {
    date_of_expense: string;
    description: string;
    currency: string;
    amount: string;
}

interface Props {
    isOpen: boolean;
    onClose: () => void;
    index?: number;
    rowData?: rowData | null;
    onUpdate: (data: any) => void;
}

export default function PurchasedGoodsAndServicesModal({
    isOpen,
    onClose,
    index,
    rowData = null,
    onUpdate,
}: Props) {

    const initialEmptyData: FormData = {
        date_of_expense: "",
        description: "",
        currency: "",
        amount: "",
    };

    const [formData, setFormData] = useState<FormData>(initialEmptyData);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const isValidateOnChange = useRef(false);

    useEffect(() => {
        isValidateOnChange.current = false;
        setFormData({
            date_of_expense: formatDateDisplay(rowData?.date_of_expense) || "",
            description: rowData?.description || "",
            currency: rowData?.currency || "",
            amount: rowData?.amount || "",
        });
    }, [rowData]);

    useEffect(() => {
        if (isValidateOnChange.current) validateForm();
    }, [formData]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
    };

    const validateForm = () => {
        const validationErrors: Record<string, string> = {};
        if (!formData.date_of_expense) validationErrors.date_of_expense = "Date of expense is required.";
        if (!formData.description) validationErrors.description = "Description is required.";
        if (!formData.currency) validationErrors.currency = "Currency is required.";
        if (!formData.amount) validationErrors.amount = "Amount is required.";

        setErrors(validationErrors);
        return Object.keys(validationErrors).length === 0;
    };

    const resetForm = () => {
        setFormData(initialEmptyData);
        setErrors({});
        isValidateOnChange.current = false;
    };
    const handleSubmit = async () => {
        isValidateOnChange.current = true;

        if (!validateForm()) return;
        try {

            onUpdate(formData);
            resetForm();

        } catch (error) {
            console.error("Error saving data:", error);
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={() => { resetForm(); onClose(); }}
            title={index !== undefined && index !== null ? "Edit Expense" : "Add Expense"}
            size="lg"
        >
            <div className="row">

                {/* Date of Expense */}
                <div className="mb-3 col-lg-6">
                    <label htmlFor="date_of_expense" className="form-label">
                        Date of Expense
                    </label>
                    <input
                        type="text"
                        className={`form-control ${errors.date_of_expense ? "is-invalid" : ""}`}
                        id="date_of_expense"
                        value={formData.date_of_expense}
                        onChange={handleChange}
                    />
                    {errors.date_of_expense && (
                        <div className="invalid-feedback">{errors.date_of_expense}</div>
                    )}
                </div>

                {/* Description */}
                <div className="mb-3 col-lg-6">
                    <label htmlFor="description" className="form-label">Description of Purchase / Expense</label>
                    <select
                        id="description"
                        className={`form-select ${errors.description ? "is-invalid" : ""}`}
                        value={formData.description}
                        onChange={handleChange}
                    >
                        <option value="">Select description</option>
                        {Object.keys(purchasedGoodsAndServicesEmissionList).map((key) => (
                            <option key={key} value={key}>
                                {key}
                            </option>
                        ))}
                    </select>
                    {errors.description && <div className="invalid-feedback">{errors.description}</div>}
                </div>

                {/* Currency */}
                <div className="mb-3 col-lg-6">
                    <label htmlFor="currency" className="form-label">Currency</label>
                    <select
                        id="currency"
                        className={`form-select ${errors.currency ? "is-invalid" : ""}`}
                        value={formData.currency}
                        onChange={handleChange}
                    >
                        <option value="">Select Currency</option>
                        <option value="QAR">QAR</option>
                    </select>
                    {errors.currency && <div className="invalid-feedback">{errors.currency}</div>}
                </div>

                {/* Amount */}
                <div className="mb-3 col-lg-6">
                    <label htmlFor="amount" className="form-label">Amount Debited</label>
                    <input
                        type="text"
                        onInput={OnlyFloatAndInteger}
                        id="amount"
                        placeholder="Enter amount"
                        className={`form-control ${errors.amount ? "is-invalid" : ""}`}
                        value={formData.amount}
                        onChange={handleChange}
                    />
                    {errors.amount && <div className="invalid-feedback">{errors.amount}</div>}
                </div>

                {/* Submit Button */}
                <div className="col-12 text-center pt-2">
                    <button
                        className="btn btn-primary mb-2 action-button px-4 py-2"
                        onClick={handleSubmit}
                    >
                        {index !== undefined && index !== null ? "Update Expense" : "Add Expense"}
                    </button>
                </div>

            </div>
        </Modal>
    );
}