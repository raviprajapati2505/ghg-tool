'use client';

import React, { useEffect, useRef, useState } from 'react';
import Modal from "@/components/common/Modal";
import { OnlyFloatAndInteger } from '@/helpers/client/function';
import { fuelEnergyRelatedEmissionTDList } from '@/utils/emissionFactor';
import { formatDateDisplay } from '@/utils/function';

interface FormData {
    reporting_period: string;
    location: string;
    energy_type: string;
    energy_consumed: string;
    units: string;
}

interface rowData {
    reporting_period: string;
    location: string;
    energy_type: string;
    energy_consumed: string;
    units: string;
}

interface Props {
    isOpen: boolean;
    onClose: () => void;
    index?: number;
    rowData?: rowData | null;
    onUpdate: (data: any) => void;
}

export default function FuelEnergyRelatedModal({
    isOpen,
    onClose,
    index,
    rowData = null,
    onUpdate,
}: Props) {

    const initialEmptyData: FormData = {
        reporting_period: "",
        location: "",
        energy_type: "",
        energy_consumed: "",
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
            energy_type: rowData?.energy_type || "",
            energy_consumed: rowData?.energy_consumed || "",
            units: rowData?.units || "",
        });
    }, [rowData]);

    /* ---------------- Live Validation ---------------- */
    useEffect(() => {
        if (isValidateOnChange.current) validateForm();
    }, [formData]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
    };

    const validateForm = () => {
        const validationErrors: Record<string, string> = {};

        if (!formData.reporting_period)
            validationErrors.reporting_period = "Reporting period is required.";

        if (!formData.location)
            validationErrors.location = "Location is required.";

        if (!formData.energy_type)
            validationErrors.energy_type = "Energy type is required.";

        if (!formData.energy_consumed)
            validationErrors.energy_consumed = "Energy consumed is required.";

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
            title={index !== undefined && index !== null ? "Edit Fuel & Energy Data" : "Add Fuel & Energy Data"}
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

                {/* Energy Type */}
                <div className="mb-3 col-lg-6">
                    <label htmlFor="energy_type" className="form-label">
                        Energy Type
                    </label>
                    <select
                        id="energy_type"
                        className={`form-select ${errors.energy_type ? "is-invalid" : ""}`}
                        value={formData.energy_type}
                        onChange={handleChange}
                    >
                        {Object.entries(fuelEnergyRelatedEmissionTDList).map(([key, value]) => (
                            <option key={key} value={key}>
                                {key}
                            </option>
                        ))}
                    </select>
                    {errors.energy_type && (
                        <div className="invalid-feedback">{errors.energy_type}</div>
                    )}
                </div>

                {/* Energy Consumed */}
                <div className="mb-3 col-lg-6">
                    <label htmlFor="energy_consumed" className="form-label">
                        Energy Consumed
                    </label>
                    <input
                        type="text"
                        onInput={OnlyFloatAndInteger}
                        id="energy_consumed"
                        placeholder="Enter consumption value"
                        className={`form-control ${errors.energy_consumed ? "is-invalid" : ""}`}
                        value={formData.energy_consumed}
                        onChange={handleChange}
                    />
                    {errors.energy_consumed && (
                        <div className="invalid-feedback">{errors.energy_consumed}</div>
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