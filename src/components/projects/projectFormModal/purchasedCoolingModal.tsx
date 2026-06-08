'use client';

import React, { useEffect, useRef, useState } from 'react';
import Modal from "@/components/common/Modal";
import { OnlyFloatAndInteger } from '@/helpers/client/function';
import { purchasedCoolingUnitsList } from '@/utils/emissionFactor';
import { formatDateDisplay } from '@/utils/function';

interface FormData {
    reporting_period: string;
    location: string;
    cooling_supplier: string;
    cooling_type: string;
    cooling_consumption: string;
    units: string;
}

interface rowData {
    reporting_period: string;
    location: string;
    cooling_supplier: string;
    cooling_type: string;
    cooling_consumption: string;
    units: string;
}

interface Props {
    isOpen: boolean;
    onClose: () => void;
    index?: number;
    rowData?: rowData | null;
    onUpdate: (data: any) => void;
}

export default function PurchasedCoolingModal({
    isOpen,
    onClose,
    index,
    rowData = null,
    onUpdate,
}: Props) {

    const initialEmptyData: FormData = {
        reporting_period: "",
        location: "",
        cooling_supplier: "",
        cooling_type: "",
        cooling_consumption: "",
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
            cooling_supplier: rowData?.cooling_supplier || "",
            cooling_type: rowData?.cooling_type || "",
            cooling_consumption: rowData?.cooling_consumption || "",
            units: rowData?.units || "",
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
        if (!formData.cooling_supplier) validationErrors.cooling_supplier = "Cooling supplier is required.";
        if (!formData.cooling_type) validationErrors.cooling_type = "Cooling type is required.";
        if (!formData.cooling_consumption) validationErrors.cooling_consumption = "Cooling consumption is required.";
        if (!formData.units) validationErrors.units = "Units are required.";

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

                {/* Cooling Supplier */}
                <div className="mb-3 col-lg-6">
                    <label htmlFor="cooling_supplier" className="form-label">Cooling Supplier</label>
                    <input
                        type="text"
                        id="cooling_supplier"
                        placeholder="Enter supplier"
                        className={`form-control ${errors.cooling_supplier ? "is-invalid" : ""}`}
                        value={formData.cooling_supplier}
                        onChange={handleChange}
                    />
                    {errors.cooling_supplier && <div className="invalid-feedback">{errors.cooling_supplier}</div>}
                </div>

                {/* Cooling Type */}
                <div className="mb-3 col-lg-6">
                    <label htmlFor="cooling_type" className="form-label">Cooling Type</label>
                    <select
                        id="cooling_type"
                        className={`form-select ${errors.cooling_type ? "is-invalid" : ""}`}
                        value={formData.cooling_type}
                        onChange={handleChange}
                    >
                        <option value="">Select Cooling Type</option>
                        <option value="District Cooling">District Cooling</option>
                        <option value="Chilled Water">Chilled Water</option>
                        <option value="HVAC">HVAC System</option>
                        <option value="Other">Other</option>
                    </select>
                    {errors.cooling_type && <div className="invalid-feedback">{errors.cooling_type}</div>}
                </div>

                {/* Cooling Consumption */}
                <div className="mb-3 col-lg-6">
                    <label htmlFor="cooling_consumption" className="form-label">Cooling Consumption</label>
                    <input
                        type="text"
                        onInput={OnlyFloatAndInteger}
                        id="cooling_consumption"
                        placeholder="Enter consumption"
                        className={`form-control ${errors.cooling_consumption ? "is-invalid" : ""}`}
                        value={formData.cooling_consumption}
                        onChange={handleChange}
                    />
                    {errors.cooling_consumption && <div className="invalid-feedback">{errors.cooling_consumption}</div>}
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
                        {purchasedCoolingUnitsList.map((unit) => (
                            <option key={unit} value={unit}>{unit}</option>
                        ))}
                    </select>
                    {errors.units && <div className="invalid-feedback">{errors.units}</div>}
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