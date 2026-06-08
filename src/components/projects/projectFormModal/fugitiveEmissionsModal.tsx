'use client';

import React, { useEffect, useRef, useState } from 'react';
import Modal from "@/components/common/Modal";
import { OnlyFloatAndInteger } from '@/helpers/client/function';
import { fugitiveEmissionsEmissionList } from '@/utils/emissionFactor';
import { formatDateDisplay } from '@/utils/function';

interface FormData {
    reporting_period: string;
    location: string;
    equipment_id: string;
    equipment_type: string;
    refrigerant_used: string;
    total_consumption_refill: string;
    units: string;
}

interface rowData {
    reporting_period: string;
    location: string;
    equipment_id: string;
    equipment_type: string;
    refrigerant_used: string;
    total_consumption_refill: string;
    units: string;
}

interface Props {
    isOpen: boolean;
    onClose: () => void;
    index?: number;
    rowData?: rowData | null;
    onUpdate: (data: any) => void;
}

export default function FugitiveEmissionsModal({
    isOpen,
    onClose,
    index,
    rowData = null,
    onUpdate,
}: Props) {

    const initialEmptyData: FormData = {
        reporting_period: "",
        location: "",
        equipment_id: "",
        equipment_type: "",
        refrigerant_used: "",
        total_consumption_refill: "",
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
            equipment_id: rowData?.equipment_id || "",
            equipment_type: rowData?.equipment_type || "",
            refrigerant_used: rowData?.refrigerant_used || "",
            total_consumption_refill: rowData?.total_consumption_refill || "",
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

        if (!formData.equipment_id)
            validationErrors.equipment_id = "Equipment ID is required.";

        if (!formData.equipment_type)
            validationErrors.equipment_type = "Equipment type is required.";

        if (!formData.refrigerant_used)
            validationErrors.refrigerant_used = "Refrigerant used is required.";

        if (!formData.total_consumption_refill)
            validationErrors.total_consumption_refill = "Total consumption is required.";

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
            title={index !== undefined && index !== null ? "Edit Refrigerant Data" : "Add Refrigerant Data"}
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

                {/* Equipment ID */}
                <div className="mb-3 col-lg-6">
                    <label htmlFor="equipment_id" className="form-label">
                        Equipment ID
                    </label>
                    <input
                        type="text"
                        id="equipment_id"
                        placeholder="Enter equipment ID"
                        className={`form-control ${errors.equipment_id ? "is-invalid" : ""}`}
                        value={formData.equipment_id}
                        onChange={handleChange}
                    />
                    {errors.equipment_id && (
                        <div className="invalid-feedback">{errors.equipment_id}</div>
                    )}
                </div>

                {/* Equipment Type */}
                <div className="mb-3 col-lg-6">
                    <label htmlFor="equipment_type" className="form-label">
                        Equipment Type
                    </label>
                    <select
                        id="equipment_type"
                        className={`form-select ${errors.equipment_type ? "is-invalid" : ""}`}
                        value={formData.equipment_type}
                        onChange={handleChange}
                    >
                        <option value="">Select Equipment Type</option>
                        <option value="Refrigerator">Refrigerator</option>
                        <option value="Air Conditioner">Air Conditioner</option>
                        <option value="Chiller">Chiller</option>
                        <option value="Freezer">Freezer</option>
                        <option value="Other">Other</option>
                    </select>
                    {errors.equipment_type && (
                        <div className="invalid-feedback">{errors.equipment_type}</div>
                    )}
                </div>

                {/* Refrigerant Used */}

                <div className="mb-3 col-lg-6">
                    <label htmlFor="refrigerant_used" className="form-label">
                        Refrigerant Used
                    </label>
                    <select
                        id="refrigerant_used"
                        className={`form-select ${errors.refrigerant_used ? "is-invalid" : ""}`}
                        value={formData.refrigerant_used}
                        onChange={handleChange}
                    >
                        <option value="">Select Refrigerant Used</option>
                        {Object.entries(fugitiveEmissionsEmissionList).map(([key, value]) => (
                            <option key={key} value={key}>
                                {key}
                            </option>
                        ))}
                    </select>
                    {errors.refrigerant_used && (
                        <div className="invalid-feedback">{errors.refrigerant_used}</div>
                    )}
                </div>

                {/* Total Consumption */}
                <div className="mb-3 col-lg-6">
                    <label htmlFor="total_consumption_refill" className="form-label">
                        Total Consumption (Refill) in Reporting Period
                    </label>
                    <input
                        type="text"
                        onInput={OnlyFloatAndInteger}
                        id="total_consumption_refill"
                        placeholder="Enter total consumption"
                        className={`form-control ${errors.total_consumption_refill ? "is-invalid" : ""}`}
                        value={formData.total_consumption_refill}
                        onChange={handleChange}
                    />
                    {errors.total_consumption_refill && (
                        <div className="invalid-feedback">{errors.total_consumption_refill}</div>
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
                        <option value="kg">kg</option>
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