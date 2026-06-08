'use client';

import React, { useEffect, useRef, useState } from 'react';
import Modal from "@/components/common/Modal";
import { OnlyFloatAndInteger } from '@/helpers/client/function';
import { formatDateDisplay } from '@/utils/function';

interface FormData {
    reporting_period: string;
    location: string;
    electricity_supplier: string;
    electricity_consumption: string;
    units: string;
}

interface rowData {
    reporting_period: string;
    location: string;
    electricity_supplier: string;
    electricity_consumption: string;
    units: string;
}

interface Props {
    isOpen: boolean;
    onClose: () => void;
    index?: number;
    rowData?: rowData | null;
    onUpdate: (data: any) => void;
}

export default function ElectricityConsumptionModal({
    isOpen,
    onClose,
    index,
    rowData = null,
    onUpdate,
}: Props) {

    const initialEmptyData: FormData = {
        reporting_period: "",
        location: "",
        electricity_supplier: "",
        electricity_consumption: "",
        units: "",
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
            electricity_supplier: rowData?.electricity_supplier || "",
            electricity_consumption: rowData?.electricity_consumption || "",
            units: rowData?.units || "",
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

        if (!formData.electricity_supplier)
            validationErrors.electricity_supplier = "Supplier type is required.";

        if (!formData.electricity_consumption)
            validationErrors.electricity_consumption = "Consumption value is required.";

        if (!formData.units)
            validationErrors.units = "Units are required.";

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
            title={index !== undefined && index !== null ? "Edit Electricity Data" : "Add Electricity Data"}
            size="lg"
        >
            <div className="row">
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

                {/* Electricity Supplier */}
                <div className="mb-3 col-lg-6">
                    <label htmlFor="electricity_supplier" className="form-label">
                        Electricity Supplier
                    </label>
                    <select
                        id="electricity_supplier"
                        className={`form-select ${errors.electricity_supplier ? "is-invalid" : ""}`}
                        value={formData.electricity_supplier}
                        onChange={handleChange}
                    >
                        <option value="">Select Supplier Type</option>
                        <option value="Grid">Grid</option>
                    </select>
                    {errors.electricity_supplier && (
                        <div className="invalid-feedback">
                            {errors.electricity_supplier}
                        </div>
                    )}
                </div>

                {/* Electricity Consumption */}
                <div className="mb-3 col-lg-6">
                    <label htmlFor="electricity_consumption" className="form-label">
                        Electricity Consumption
                    </label>
                    <input
                        type="text"
                        onInput={OnlyFloatAndInteger}
                        id="electricity_consumption"
                        placeholder="Enter consumption value"
                        className={`form-control ${errors.electricity_consumption ? "is-invalid" : ""}`}
                        value={formData.electricity_consumption}
                        onChange={handleChange}
                    />
                    {errors.electricity_consumption && (
                        <div className="invalid-feedback">
                            {errors.electricity_consumption}
                        </div>
                    )}
                </div>

                {/* Units */}
                <div className="mb-3 col-lg-6">
                    <label htmlFor="units" className="form-label">
                        Units
                    </label>
                    <select
                        id="units"
                        className={`form-select ${errors.units ? "is-invalid" : ""}`}
                        value={formData.units}
                        onChange={handleChange}
                    >
                        <option value="">Select Unit</option>
                        <option value="kWh">kWh</option>
                    </select>
                    {errors.units && (
                        <div className="invalid-feedback">{errors.units}</div>
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