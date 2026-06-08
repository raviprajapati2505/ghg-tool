'use client';

import React, { useEffect, useRef, useState } from 'react';
import Modal from "@/components/common/Modal";
import { OnlyFloatAndInteger } from '@/helpers/client/function';
import { mobileCombustionEmissionList } from '@/utils/emissionFactor';
import { formatDateDisplay } from '@/utils/function';

interface FormData {
    reporting_period: string;
    car_plate_id: string;
    vehicle_type: string;
    fuel_type: string;
    consumption: string;
    units: string;
}

interface rowData {
    reporting_period: string;
    car_plate_id: string;
    vehicle_type: string;
    fuel_type: string;
    consumption: string;
    units: string;
}

interface Props {
    isOpen: boolean;
    onClose: () => void;
    index?: number;
    rowData?: rowData | null;
    onUpdate: (data: any) => void;
}

export default function MobileCombustionModal({
    isOpen,
    onClose,
    index,
    rowData = null,
    onUpdate,
}: Props) {

    const initialEmptyData: FormData = {
        reporting_period: "",
        car_plate_id: "",
        vehicle_type: "",
        fuel_type: "",
        consumption: "",
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
            car_plate_id: rowData?.car_plate_id || "",
            vehicle_type: rowData?.vehicle_type || "",
            fuel_type: rowData?.fuel_type || "",
            consumption: rowData?.consumption || "",
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

        if (!formData.car_plate_id)
            validationErrors.car_plate_id = "Car Plate / ID is required.";

        if (!formData.vehicle_type)
            validationErrors.vehicle_type = "Vehicle type is required.";

        if (!formData.fuel_type)
            validationErrors.fuel_type = "Fuel type is required.";

        if (!formData.consumption)
            validationErrors.consumption = "Consumption is required.";

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
            title={index !== undefined && index !== null ? "Edit Mobile Combustion Data" : "Add Mobile Combustion Data"}
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

                {/* Car Plate / ID */}
                <div className="mb-3 col-lg-6">
                    <label htmlFor="car_plate_id" className="form-label">
                        Car Plate / ID
                    </label>
                    <input
                        type="text"
                        id="car_plate_id"
                        placeholder="Enter Car Plate / ID"
                        className={`form-control ${errors.car_plate_id ? "is-invalid" : ""}`}
                        value={formData.car_plate_id}
                        onChange={handleChange}
                    />
                    {errors.car_plate_id && (
                        <div className="invalid-feedback">{errors.car_plate_id}</div>
                    )}
                </div>

                {/* Vehicle Type */}
                <div className="mb-3 col-lg-6">
                    <label htmlFor="vehicle_type" className="form-label">
                        Vehicle Type
                    </label>
                    <select
                        id="vehicle_type"
                        className={`form-select ${errors.vehicle_type ? "is-invalid" : ""}`}
                        value={formData.vehicle_type}
                        onChange={handleChange}
                    >
                        <option value="">Select Vehicle Type</option>
                        <option value="Car">Car</option>
                        <option value="Truck">Truck</option>
                        <option value="Bus">Bus</option>
                        <option value="Motorbike">Motorbike</option>
                        <option value="Other">Other</option>
                    </select>
                    {errors.vehicle_type && (
                        <div className="invalid-feedback">{errors.vehicle_type}</div>
                    )}
                </div>

                {/* Fuel Type */}
                <div className="mb-3 col-lg-6">
                    <label htmlFor="fuel_type" className="form-label">
                        Type of Fuel Used
                    </label>
                    <select
                        id="fuel_type"
                        className={`form-select ${errors.fuel_type ? "is-invalid" : ""}`}
                        value={formData.fuel_type}
                        onChange={handleChange}
                    >
                        <option value="">Select Fuel Type</option>
                        {Object.entries(mobileCombustionEmissionList).map(([key, value]) => (
                            <option key={key} value={key}>
                                {key}
                            </option>
                        ))}
                    </select>
                    {errors.fuel_type && (
                        <div className="invalid-feedback">{errors.fuel_type}</div>
                    )}
                </div>

                {/* Consumption */}
                <div className="mb-3 col-lg-6">
                    <label htmlFor="consumption" className="form-label">
                        Consumption
                    </label>
                    <input
                        type="text"
                        onInput={OnlyFloatAndInteger}
                        id="consumption"
                        placeholder="Enter consumption value"
                        className={`form-control ${errors.consumption ? "is-invalid" : ""}`}
                        value={formData.consumption}
                        onChange={handleChange}
                    />
                    {errors.consumption && (
                        <div className="invalid-feedback">{errors.consumption}</div>
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
                        <option value="Litre">Litre</option>
                        <option value="Gallon">Gallon</option>
                        <option value="kWh">kWh (for electric)</option>
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