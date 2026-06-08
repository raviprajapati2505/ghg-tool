'use client';

import React, { useEffect, useRef, useState } from 'react';
import Modal from "@/components/common/Modal";
import { OnlyFloatAndInteger } from '@/helpers/client/function';
import { formatDateDisplay } from '@/utils/function';

interface rowData {
    reporting_period: string;
    working_days: string;
    employees: string;
    car_commuters: string;

    petrol_users: string;
    petrol_avg_km: string;

    diesel_users: string;
    diesel_avg_km: string;

    hybrid_users: string;
    hybrid_avg_km: string;

    ev_users: string;
    ev_avg_km: string;

    metro_commuters: string;
    metro_avg_km: string;

    walking_commuters: string;
    walking_avg_km: string;
}

interface Props {
    isOpen: boolean;
    onClose: () => void;
    index?: number;
    rowData?: rowData | null;
    onUpdate: (data: rowData) => void;
}

export default function EmployeeCommuteModal({
    isOpen,
    onClose,
    index,
    rowData = null,
    onUpdate,
}: Props) {

    const initialEmptyData: rowData = {
        reporting_period: "",
        working_days: "",
        employees: "",
        car_commuters: "",

        petrol_users: "",
        petrol_avg_km: "",

        diesel_users: "",
        diesel_avg_km: "",

        hybrid_users: "",
        hybrid_avg_km: "",

        ev_users: "",
        ev_avg_km: "",

        metro_commuters: "",
        metro_avg_km: "",

        walking_commuters: "",
        walking_avg_km: "",
    };

    const [formData, setFormData] = useState<rowData>(initialEmptyData);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const isValidateOnChange = useRef(false);

    /* ---------------- Load Edit Data ---------------- */
    useEffect(() => {
        isValidateOnChange.current = false;
        setFormData({
            reporting_period: formatDateDisplay(rowData?.reporting_period) || "",
            working_days: rowData?.working_days || "",
            employees: rowData?.employees || "",
            car_commuters: rowData?.car_commuters || "",
            petrol_users: rowData?.petrol_users || "",
            petrol_avg_km: rowData?.petrol_avg_km || "",
            diesel_users: rowData?.diesel_users || "",
            diesel_avg_km: rowData?.diesel_avg_km || "",
            hybrid_users: rowData?.hybrid_users || "",
            hybrid_avg_km: rowData?.hybrid_avg_km || "",
            ev_users: rowData?.ev_users || "",
            ev_avg_km: rowData?.ev_avg_km || "",
            metro_commuters: rowData?.metro_commuters || "",
            metro_avg_km: rowData?.metro_avg_km || "",
            walking_commuters: rowData?.walking_commuters || "",
            walking_avg_km: rowData?.walking_avg_km || "",
        });
    }, [rowData]);

    /* ---------------- Live Validation ---------------- */
    useEffect(() => {
        if (isValidateOnChange.current) validateForm();
    }, [formData]);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
    };

    const validateForm = () => {
        const validationErrors: Record<string, string> = {};

        if (!formData.reporting_period)
            validationErrors.reporting_period = "Reporting period is required.";

        if (!formData.working_days)
            validationErrors.working_days = "Working days are required.";

        if (!formData.employees)
            validationErrors.employees = "Total employees are required.";

        if (!formData.car_commuters)
            validationErrors.car_commuters = "Car commuters are required.";

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
        onUpdate(formData);
        resetForm();
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={() => { resetForm(); onClose(); }}
            title={index !== undefined && index !== null ? "Edit Employee Commute" : "Add Employee Commute"}
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

                {/* Working Days */}
                <div className="mb-3 col-lg-6">
                    <label htmlFor="working_days" className="form-label">Working Days</label>
                    <input
                        type="text"
                        id="working_days"
                        onInput={OnlyFloatAndInteger}
                        className={`form-control ${errors.working_days ? "is-invalid" : ""}`}
                        value={formData.working_days}
                        onChange={handleChange}
                    />
                    {errors.working_days && <div className="invalid-feedback">{errors.working_days}</div>}
                </div>

                {/* Total Employees */}
                <div className="mb-3 col-lg-6">
                    <label htmlFor="employees" className="form-label">Total Employees</label>
                    <input
                        type="text"
                        id="employees"
                        onInput={OnlyFloatAndInteger}
                        className={`form-control ${errors.employees ? "is-invalid" : ""}`}
                        value={formData.employees}
                        onChange={handleChange}
                    />
                    {errors.employees && <div className="invalid-feedback">{errors.employees}</div>}
                </div>

                {/* Car Commuters */}
                <div className="mb-3 col-lg-6">
                    <label htmlFor="car_commuters" className="form-label">Car Commuters</label>
                    <input
                        type="text"
                        id="car_commuters"
                        onInput={OnlyFloatAndInteger}
                        className={`form-control ${errors.car_commuters ? "is-invalid" : ""}`}
                        value={formData.car_commuters}
                        onChange={handleChange}
                    />
                    {errors.car_commuters && <div className="invalid-feedback">{errors.car_commuters}</div>}
                </div>

                {/* Petrol */}
                <div className="mb-3 col-lg-6">
                    <label htmlFor="petrol_users" className="form-label">Petrol Users</label>
                    <input
                        type="text"
                        id="petrol_users"
                        onInput={OnlyFloatAndInteger}
                        className="form-control"
                        value={formData.petrol_users}
                        onChange={handleChange}
                    />
                </div>
                <div className="mb-3 col-lg-6">
                    <label htmlFor="petrol_avg_km" className="form-label">Petrol Avg (KM)</label>
                    <input
                        type="text"
                        id="petrol_avg_km"
                        onInput={OnlyFloatAndInteger}
                        className="form-control"
                        value={formData.petrol_avg_km}
                        onChange={handleChange}
                    />
                </div>

                {/* Diesel */}
                <div className="mb-3 col-lg-6">
                    <label htmlFor="diesel_users" className="form-label">Diesel Users</label>
                    <input
                        type="text"
                        id="diesel_users"
                        onInput={OnlyFloatAndInteger}
                        className="form-control"
                        value={formData.diesel_users}
                        onChange={handleChange}
                    />
                </div>
                <div className="mb-3 col-lg-6">
                    <label htmlFor="diesel_avg_km" className="form-label">Diesel Avg (KM)</label>
                    <input
                        type="text"
                        id="diesel_avg_km"
                        onInput={OnlyFloatAndInteger}
                        className="form-control"
                        value={formData.diesel_avg_km}
                        onChange={handleChange}
                    />
                </div>

                {/* Hybrid */}
                <div className="mb-3 col-lg-6">
                    <label htmlFor="hybrid_users" className="form-label">Hybrid Users</label>
                    <input
                        type="text"
                        id="hybrid_users"
                        onInput={OnlyFloatAndInteger}
                        className="form-control"
                        value={formData.hybrid_users}
                        onChange={handleChange}
                    />
                </div>
                <div className="mb-3 col-lg-6">
                    <label htmlFor="hybrid_avg_km" className="form-label">Hybrid Avg (KM)</label>
                    <input
                        type="text"
                        id="hybrid_avg_km"
                        onInput={OnlyFloatAndInteger}
                        className="form-control"
                        value={formData.hybrid_avg_km}
                        onChange={handleChange}
                    />
                </div>

                {/* EV */}
                <div className="mb-3 col-lg-6">
                    <label htmlFor="ev_users" className="form-label">EV Users</label>
                    <input
                        type="text"
                        id="ev_users"
                        onInput={OnlyFloatAndInteger}
                        className="form-control"
                        value={formData.ev_users}
                        onChange={handleChange}
                    />
                </div>
                <div className="mb-3 col-lg-6">
                    <label htmlFor="ev_avg_km" className="form-label">EV Avg (KM)</label>
                    <input
                        type="text"
                        id="ev_avg_km"
                        onInput={OnlyFloatAndInteger}
                        className="form-control"
                        value={formData.ev_avg_km}
                        onChange={handleChange}
                    />
                </div>

                {/* Metro */}
                <div className="mb-3 col-lg-6">
                    <label htmlFor="metro_commuters" className="form-label">Metro Commuters</label>
                    <input
                        type="text"
                        id="metro_commuters"
                        onInput={OnlyFloatAndInteger}
                        className="form-control"
                        value={formData.metro_commuters}
                        onChange={handleChange}
                    />
                </div>
                <div className="mb-3 col-lg-6">
                    <label htmlFor="metro_avg_km" className="form-label">Metro Avg (KM)</label>
                    <input
                        type="text"
                        id="metro_avg_km"
                        onInput={OnlyFloatAndInteger}
                        className="form-control"
                        value={formData.metro_avg_km}
                        onChange={handleChange}
                    />
                </div>

                {/* Walking */}
                <div className="mb-3 col-lg-6">
                    <label htmlFor="walking_commuters" className="form-label">Walking Commuters</label>
                    <input
                        type="text"
                        id="walking_commuters"
                        onInput={OnlyFloatAndInteger}
                        className="form-control"
                        value={formData.walking_commuters}
                        onChange={handleChange}
                    />
                </div>
                <div className="mb-3 col-lg-6">
                    <label htmlFor="walking_avg_km" className="form-label">Walking Avg (KM)</label>
                    <input
                        type="text"
                        id="walking_avg_km"
                        onInput={OnlyFloatAndInteger}
                        className="form-control"
                        value={formData.walking_avg_km}
                        onChange={handleChange}
                    />
                </div>

                {/* Submit */}
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