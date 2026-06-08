'use client';

import React, { useEffect, useRef, useState } from 'react';
import Modal from "@/components/common/Modal";
import { OnlyFloatAndInteger } from '@/helpers/client/function';
import { wasteGeneratedLandFillList, wasteGeneratedTreatmentTypeList } from '@/utils/emissionFactor';
import { formatDateDisplay } from '@/utils/function';

interface FormData {
    reporting_period: string;
    location: string;
    total_waste_collected: string;
    general_waste: string;
    treatment_type: string;
    recyclable_waste: string;
    paper_waste: string;
    plastic_waste: string;
    waste_type: string;
    units: string;
}

interface rowData {
    reporting_period: string;
    location: string;
    total_waste_collected: string;
    general_waste: string;
    treatment_type: string;
    recyclable_waste: string;
    paper_waste: string;
    plastic_waste: string;
    waste_type: string;
    units: string;
}

interface Props {
    isOpen: boolean;
    onClose: () => void;
    index?: number;
    rowData?: rowData | null;
    onUpdate: (data: any) => void;
}

export default function WasteGeneratedModal({
    isOpen,
    onClose,
    index,
    rowData = null,
    onUpdate,
}: Props) {

    const initialEmptyData: FormData = {
        reporting_period: "",
        location: "",
        total_waste_collected: "",
        general_waste: "",
        waste_type: "",
        treatment_type: "",
        recyclable_waste: "",
        paper_waste: "",
        plastic_waste: "",
        units: "",
    };

    const [formData, setFormData] = useState<FormData>(initialEmptyData);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const isValidateOnChange = useRef(false);

    useEffect(() => {
        isValidateOnChange.current = false;
        setFormData({
            reporting_period: formatDateDisplay(rowData?.reporting_period) || "",
            location: rowData?.location || "",
            total_waste_collected: rowData?.total_waste_collected || "",
            general_waste: rowData?.general_waste || "",
            treatment_type: rowData?.treatment_type || "",
            recyclable_waste: rowData?.recyclable_waste || "",
            paper_waste: rowData?.paper_waste || "",
            plastic_waste: rowData?.plastic_waste || "",
            waste_type: rowData?.waste_type || "",
            units: rowData?.units || "",
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
        if (!formData.reporting_period) validationErrors.reporting_period = "Reporting period is required.";
        if (!formData.location) validationErrors.location = "Location is required.";
        if (!formData.total_waste_collected) validationErrors.total_waste_collected = "Total waste collected is required.";
        if (!formData.general_waste) validationErrors.general_waste = "General waste is required.";
        if (!formData.treatment_type) validationErrors.treatment_type = "Treatment type is required.";
        if (!formData.recyclable_waste) validationErrors.recyclable_waste = "Recyclable waste is required.";
        if (!formData.paper_waste) validationErrors.paper_waste = "Paper waste is required.";
        if (!formData.plastic_waste) validationErrors.plastic_waste = "Plastic waste is required.";
        if (!formData.units) validationErrors.units = "Units are required.";
        if (!formData.waste_type) validationErrors.waste_type = "Waste type is required.";

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
            title={index !== undefined && index !== null ? "Edit Waste Data" : "Add Waste Data"}
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

                {/* Total Waste Collected */}
                <div className="mb-3 col-lg-6">
                    <label htmlFor="total_waste_collected" className="form-label">Total Waste Collected</label>
                    <input
                        type="text"
                        onInput={OnlyFloatAndInteger}
                        id="total_waste_collected"
                        placeholder="Enter total waste collected"
                        className={`form-control ${errors.total_waste_collected ? "is-invalid" : ""}`}
                        value={formData.total_waste_collected}
                        onChange={handleChange}
                    />
                    {errors.total_waste_collected && <div className="invalid-feedback">{errors.total_waste_collected}</div>}
                </div>

                {/* General Waste */}
                <div className="mb-3 col-lg-6">
                    <label htmlFor="general_waste" className="form-label">General Waste</label>
                    <input
                        type="text"
                        onInput={OnlyFloatAndInteger}
                        id="general_waste"
                        placeholder="Enter general waste"
                        className={`form-control ${errors.general_waste ? "is-invalid" : ""}`}
                        value={formData.general_waste}
                        onChange={handleChange}
                    />
                    {errors.general_waste && <div className="invalid-feedback">{errors.general_waste}</div>}
                </div>
                <div className="mb-3 col-lg-6">
                    <label htmlFor="waste_type" className="form-label">Waste Type</label>
                    <select
                        id="waste_type"
                        className={`form-select ${errors.waste_type ? "is-invalid" : ""}`}
                        value={formData.waste_type}
                        onChange={handleChange}
                    >
                        <option value="">Select waste type</option>
                        {Object.entries(wasteGeneratedLandFillList).map(([key, value]) => (
                            <option key={key} value={key}>
                                {key}
                            </option>
                        ))}
                    </select>
                    {errors.waste_type && <div className="invalid-feedback">{errors.waste_type}</div>}
                </div>
                <div className="mb-3 col-lg-6">
                    <label htmlFor="treatment_type" className="form-label">Treatment type</label>
                    <select
                        id="treatment_type"
                        className={`form-select ${errors.treatment_type ? "is-invalid" : ""}`}
                        value={formData.treatment_type}
                        onChange={handleChange}
                    >
                        <option value="">Select treatment_type</option>
                        {wasteGeneratedTreatmentTypeList.map((type) => (
                            <option key={type} value={type}>{type}</option>
                        ))}
                    </select>
                    {errors.treatment_type && <div className="invalid-feedback">{errors.treatment_type}</div>}
                </div>
                {/* Recyclable Waste */}
                <div className="mb-3 col-lg-6">
                    <label htmlFor="recyclable_waste" className="form-label">Recyclable Waste</label>
                    <input
                        type="text"
                        onInput={OnlyFloatAndInteger}
                        id="recyclable_waste"
                        placeholder="Enter recyclable waste"
                        className={`form-control ${errors.recyclable_waste ? "is-invalid" : ""}`}
                        value={formData.recyclable_waste}
                        onChange={handleChange}
                    />
                    {errors.recyclable_waste && <div className="invalid-feedback">{errors.recyclable_waste}</div>}
                </div>

                {/* Paper Waste */}
                <div className="mb-3 col-lg-6">
                    <label htmlFor="paper_waste" className="form-label">Paper Waste</label>
                    <input
                        type="text"
                        onInput={OnlyFloatAndInteger}
                        id="paper_waste"
                        placeholder="Enter paper waste"
                        className={`form-control ${errors.paper_waste ? "is-invalid" : ""}`}
                        value={formData.paper_waste}
                        onChange={handleChange}
                    />
                    {errors.paper_waste && <div className="invalid-feedback">{errors.paper_waste}</div>}
                </div>

                {/* Plastic Waste */}
                <div className="mb-3 col-lg-6">
                    <label htmlFor="plastic_waste" className="form-label">Plastic Waste</label>
                    <input
                        type="text"
                        onInput={OnlyFloatAndInteger}
                        id="plastic_waste"
                        placeholder="Enter plastic waste"
                        className={`form-control ${errors.plastic_waste ? "is-invalid" : ""}`}
                        value={formData.plastic_waste}
                        onChange={handleChange}
                    />
                    {errors.plastic_waste && <div className="invalid-feedback">{errors.plastic_waste}</div>}
                </div>

                {/* Units */}
                <div className="mb-3 col-lg-6">
                    <label htmlFor="units" className="form-label">Units</label>
                    <select
                        id="units"
                        className={`form-select ${errors.units ? "is-invalid" : ""}`}
                        value={formData.units}
                        onChange={handleChange}
                    >
                        <option value="">Select Unit</option>
                        <option value="kg">kg</option>
                    </select>
                    {errors.units && <div className="invalid-feedback">{errors.units}</div>}
                </div>

                {/* Submit Button */}
                <div className="col-12 text-center pt-2">
                    <button
                        className="btn btn-primary mb-2 action-button px-4 py-2"
                        onClick={handleSubmit}
                    >
                        {index !== undefined && index !== null ? "Update Waste Data" : "Add Waste Data"}
                    </button>
                </div>

            </div>
        </Modal>
    );
}