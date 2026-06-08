'use client';

import React, { useEffect, useRef, useState } from 'react';
import Modal from "@/components/common/Modal";
import { OnlyFloatAndInteger } from '@/helpers/client/function';
import { formatDateDisplay } from '@/utils/function';

interface FormData {
    reporting_period: string;
    location: string;
    office: string;
    office_id: string;
    total_quantity_of_co2: string;
    consumption_units: string;
}

interface rowData {
    reporting_period: string;
    location: string;
    office: string;
    office_id: string;
    total_quantity_of_co2: string;
    consumption_units: string;
}

interface Props {
    isOpen: boolean;
    onClose: () => void;
    index?: number;
    rowData?: rowData | null;
    onUpdate: (data: any) => void;
}

export default function FireExtinguishersModal({
    isOpen,
    onClose,
    index,
    rowData = null,
    onUpdate,
}: Props) {

    const initialEmptyData: FormData = {
        reporting_period: "",
        location: "",
        office: "",
        office_id: "",
        total_quantity_of_co2: "",
        consumption_units: "",
    };

    const [formData, setFormData] = useState<FormData>(initialEmptyData);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const isValidateOnChange = useRef(false);

    /* ---------------- Load Edit Data ---------------- */
    useEffect(() => {
        isValidateOnChange.current = false;
        setFormData({
            reporting_period: formatDateDisplay(rowData?.reporting_period) || "",
            location: rowData?.location || "",
            office: rowData?.office || "",
            office_id: rowData?.office_id || "",
            total_quantity_of_co2: rowData?.total_quantity_of_co2 || "",
            consumption_units: rowData?.consumption_units || "",
        });
    }, [rowData]);

    /* ---------------- Live Validation ---------------- */
    useEffect(() => {
        if (isValidateOnChange.current) validateForm();
    }, [formData]);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
    };

    const validateForm = () => {
        const validationErrors: Record<string, string> = {};

        if (!formData.reporting_period)
            validationErrors.reporting_period = "Reporting period is required.";

        if (!formData.location)
            validationErrors.location = "Location is required.";

        if (!formData.office)
            validationErrors.office = "Office is required.";

        if (!formData.office_id)
            validationErrors.office_id = "Office ID is required.";

        if (!formData.total_quantity_of_co2)
            validationErrors.total_quantity_of_co2 = "Total quantity of CO2 is required.";

        if (!formData.consumption_units)
            validationErrors.consumption_units = "Consumption units are required.";

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
            onClose={() => {
                resetForm();
                onClose();
            }}
            title={index !== undefined && index !== null ? "Edit Cooling Data" : "Add Cooling Data"}
            size="lg"
        >
            <div className="row">

                {/* Reporting Period */}
                <div className="mb-3 col-lg-6">
                    <label htmlFor="reporting_period" className="form-label">
                        Reporting Period
                    </label>
                    <input
                        type="text"
                        className={`form-control ${errors.reporting_period ? "is-invalid" : ""}`}
                        id="reporting_period"
                        value={formData.reporting_period}
                        onChange={handleChange}
                    />
                    {errors.reporting_period && (
                        <div className="invalid-feedback">{errors.reporting_period}</div>
                    )}
                </div>

                <div className="mb-3 col-lg-6">
                    <label htmlFor="office" className="form-label">
                        Office
                    </label>
                    <input
                        type="text"
                        id="office"
                        placeholder="Enter Office"
                        className={`form-control ${errors.office ? "is-invalid" : ""}`}
                        value={formData.office}
                        onChange={handleChange}
                    />
                    {errors.office && (
                        <div className="invalid-feedback">{errors.office}</div>
                    )}
                </div>

                {/* Location */}
                <div className="mb-3 col-lg-6">
                    <label htmlFor="location" className="form-label">
                        Location
                    </label>
                    <input
                        type="text"
                        id="location"
                        placeholder="Enter location"
                        className={`form-control ${errors.location ? "is-invalid" : ""}`}
                        value={formData.location}
                        onChange={handleChange}
                    />
                    {errors.location && (
                        <div className="invalid-feedback">{errors.location}</div>
                    )}
                </div>



                <div className="mb-3 col-lg-6">
                    <label htmlFor="office_id" className="form-label">
                        Office ID
                    </label>
                    <input
                        type="text"
                        id="office_id"
                        placeholder="Enter Office ID"
                        className={`form-control ${errors.office_id ? "is-invalid" : ""}`}
                        value={formData.office_id}
                        onChange={handleChange}
                    />
                    {errors.office_id && (
                        <div className="invalid-feedback">{errors.office_id}</div>
                    )}
                </div>

                <div className="mb-3 col-lg-6">
                    <label htmlFor="total_quantity_of_co2" className="form-label"
                        title='Total Quantity of CO2 Refilled during Reporting period'>
                        Total Quantity of CO2
                    </label>
                    <input
                        type="text"
                        onInput={OnlyFloatAndInteger}
                        id="total_quantity_of_co2"
                        placeholder="Enter Total Quantity of CO2"
                        className={`form-control ${errors.total_quantity_of_co2 ? "is-invalid" : ""}`}
                        value={formData.total_quantity_of_co2}
                        onChange={handleChange}
                    />
                    {errors.total_quantity_of_co2 && (
                        <div className="invalid-feedback">
                            {errors.total_quantity_of_co2}
                        </div>
                    )}
                </div>

                {/* consumption_units */}
                <div className="mb-3 col-lg-6">
                    <label htmlFor="consumption_units" className="form-label">
                        consumption_units
                    </label>
                    <select
                        id="consumption_units"
                        className={`form-select ${errors.consumption_units ? "is-invalid" : ""}`}
                        value={formData.consumption_units}
                        onChange={handleChange}
                    >
                        <option value="">Select Unit</option>
                        <option value="kg">kg</option>
                    </select>
                    {errors.consumption_units && (
                        <div className="invalid-feedback">{errors.consumption_units}</div>
                    )}
                </div>

                {/* Submit Button */}
                <div className="col-12 text-center pt-2">
                    <button
                        className="btn btn-primary mb-2 action-button px-4 py-2"
                        onClick={handleSubmit}
                    >
                        {index !== undefined && index !== null ? "Update Data" : "Add Data"}
                    </button>
                </div>

            </div>
        </Modal>
    );
}