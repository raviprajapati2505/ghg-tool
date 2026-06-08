'use client';

import React, { useEffect, useRef, useState } from 'react';
import Modal from "@/components/common/Modal";
import { OnlyFloatAndInteger } from '@/helpers/client/function';
import { formatDateDisplay } from '@/utils/function';

interface FormData {
    reporting_period: string;
    location: string;
    asset_id: string;
    source_of_combustion: string;
    fuel_type: string;
    total_consumption: string;
    consumption_unit: string;
}

interface rowData {
    reporting_period: string;
    location: string;
    asset_id: string;
    source_of_combustion: string;
    fuel_type: string;
    total_consumption: string;
    consumption_unit: string;
}

interface Props {
    isOpen: boolean;
    onClose: () => void;
    index?: number;
    rowData?: rowData | null;
    onUpdate: (data: any) => void;
}

export default function StationaryCombustionModal({
    isOpen,
    onClose,
    index,
    rowData = null,
    onUpdate,
}: Props) {

    const initialEmptyData: FormData = {
        reporting_period: "",
        location: "",
        asset_id: "",
        source_of_combustion: "",
        fuel_type: "",
        total_consumption: "",
        consumption_unit: "",
    };

    const [formData, setFormData] = useState<FormData>(initialEmptyData);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const isValidateOnChange = useRef(false);

    useEffect(() => {
        isValidateOnChange.current = false;
        setFormData({
            reporting_period: formatDateDisplay(rowData?.reporting_period) || "",
            location: rowData?.location || "",
            asset_id: rowData?.asset_id || "",
            source_of_combustion: rowData?.source_of_combustion || "",
            fuel_type: rowData?.fuel_type || "",
            total_consumption: rowData?.total_consumption || "",
            consumption_unit: rowData?.consumption_unit || "",
        });
    }, [rowData]);

    useEffect(() => {
        if (isValidateOnChange.current) validateForm();
    }, [formData]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
    };

    const validateForm = () => {
        const validationErrors: Record<string, string> = {};
        if (!formData.reporting_period) validationErrors.reporting_period = "Reporting period is required.";
        if (!formData.location) validationErrors.location = "Location is required.";
        if (!formData.asset_id) validationErrors.asset_id = "Asset / Equipment ID is required.";
        if (!formData.source_of_combustion) validationErrors.source_of_combustion = "Source of combustion is required.";
        if (!formData.fuel_type) validationErrors.fuel_type = "Fuel type is required.";
        if (!formData.total_consumption) validationErrors.total_consumption = "Total consumption is required.";
        if (!formData.consumption_unit) validationErrors.consumption_unit = "Consumption unit is required.";

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
            title={index !== undefined && index !== null ? "Edit Stationary Combustion Data" : "Add Stationary Combustion Data"}
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

                {/* Location */}
                <div className="mb-3 col-lg-6">
                    <label htmlFor="location" className="form-label">Location</label>
                    <input
                        type="text"
                        id="location"
                        placeholder="Enter location"
                        className={`form-control ${errors.location ? "is-invalid" : ""}`}
                        value={formData.location}
                        onChange={handleChange}
                    />
                    {errors.location && <div className="invalid-feedback">{errors.location}</div>}
                </div>

                {/* Asset / Equipment ID */}
                <div className="mb-3 col-lg-6">
                    <label htmlFor="asset_id" className="form-label">Asset / Equipment ID</label>
                    <input
                        type="text"
                        id="asset_id"
                        placeholder="Enter Asset / Equipment ID"
                        className={`form-control ${errors.asset_id ? "is-invalid" : ""}`}
                        value={formData.asset_id}
                        onChange={handleChange}
                    />
                    {errors.asset_id && <div className="invalid-feedback">{errors.asset_id}</div>}
                </div>

                {/* Source of Combustion */}
                <div className="mb-3 col-lg-6">
                    <label htmlFor="source_of_combustion" className="form-label">Source of Combustion</label>
                    <input
                        type="text"
                        id="source_of_combustion"
                        placeholder="Enter source of combustion"
                        className={`form-control ${errors.source_of_combustion ? "is-invalid" : ""}`}
                        value={formData.source_of_combustion}
                        onChange={handleChange}
                    />
                    {errors.source_of_combustion && <div className="invalid-feedback">{errors.source_of_combustion}</div>}
                </div>

                {/* Fuel Type */}
                <div className="mb-3 col-lg-6">
                    <label htmlFor="fuel_type" className="form-label">Type of Fuel Used</label>
                    <select
                        id="fuel_type"
                        className={`form-select ${errors.fuel_type ? "is-invalid" : ""}`}
                        value={formData.fuel_type}
                        onChange={handleChange}
                    >
                        <option value="">Select Fuel Type</option>
                        <option value="Diesel">Diesel</option>
                        <option value="Gasoline">Gasoline</option>
                        <option value="CNG">CNG</option>
                        <option value="LPG">LPG</option>
                        <option value="Other">Other</option>
                    </select>
                    {errors.fuel_type && <div className="invalid-feedback">{errors.fuel_type}</div>}
                </div>

                {/* Total Fuel Consumption */}
                <div className="mb-3 col-lg-6">
                    <label htmlFor="total_consumption" className="form-label">Total Fuel Consumption during Reporting Period</label>
                    <input
                        type="text"
                        onInput={OnlyFloatAndInteger}
                        id="total_consumption"
                        placeholder="Enter total fuel consumption"
                        className={`form-control ${errors.total_consumption ? "is-invalid" : ""}`}
                        value={formData.total_consumption}
                        onChange={handleChange}
                    />
                    {errors.total_consumption && <div className="invalid-feedback">{errors.total_consumption}</div>}
                </div>

                {/* Consumption Unit */}
                <div className="mb-3 col-lg-6">
                    <label htmlFor="consumption_unit" className="form-label">Consumption Unit</label>
                    <select
                        id="consumption_unit"
                        className={`form-select ${errors.consumption_unit ? "is-invalid" : ""}`}
                        value={formData.consumption_unit}
                        onChange={handleChange}
                    >
                        <option value="">Select Unit</option>
                        <option value="Litre">Litre</option>
                        <option value="Gallon">Gallon</option>
                        <option value="kg">Kilogram</option>
                    </select>
                    {errors.consumption_unit && <div className="invalid-feedback">{errors.consumption_unit}</div>}
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