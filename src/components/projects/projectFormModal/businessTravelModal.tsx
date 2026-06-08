'use client';

import React, { use, useEffect, useRef, useState } from 'react';
import Modal from "@/components/common/Modal";
import { businessTravelCountryList, businessTravelEFList, businessTravelFlightTypeList } from '@/utils/emissionFactor';
import SelectField from '@/components/common/SelectField';
import { airportsData } from '@/data/airportsData';
import { formatDateDisplay } from '@/utils/function';

interface FormData {
    reporting_period: string;
    flight_date: string;
    flight_type: string;
    flight_class: string;
    from: string;
    destinations: string[];
}

interface rowData {
    reporting_period: string;
    flight_date: string;
    flight_type: string;
    flight_class: string;
    from: string;
    destinations: string[];
}

interface Props {
    isOpen: boolean;
    onClose: () => void;
    index?: number;
    rowData?: rowData | null;
    onUpdate: (data: any) => void;
}

export default function BusinessTravelModal({
    isOpen,
    onClose,
    index,
    rowData = null,
    onUpdate,
}: Props) {

    const initialEmptyData: FormData = {
        reporting_period: "",
        flight_date: "",
        flight_type: "",
        flight_class: "",
        from: "",
        destinations: [],
    };

    const [formData, setFormData] = useState<FormData>(initialEmptyData);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const isValidateOnChange = useRef(false);

    const [airportsList, setAirportsList] = useState<any[] | [{ value: string, label: string }]>([]);

    const getCountriesAirportsData = async () => {

        const listOfCountries = airportsData && Object.entries(airportsData).map(([key, value]) => ({
            value: key,
            label: key
        }));
        setAirportsList(listOfCountries);
    }

    /* ------------------ Load Edit Data ------------------ */
    useEffect(() => {
        isValidateOnChange.current = false;
        if (!isOpen) return;
        getCountriesAirportsData();
        setFormData({
            reporting_period: formatDateDisplay(rowData?.reporting_period) || "",
            flight_date: formatDateDisplay(rowData?.flight_date) || "",
            flight_type: rowData?.flight_type || "",
            flight_class: rowData?.flight_class || "",
            from: rowData?.from || "",
            destinations: rowData?.destinations && Array.isArray(rowData?.destinations) ? rowData?.destinations : [],
        });

    }, [rowData]);

    /* ------------------ Live Validation ------------------ */
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

        if (!formData.flight_date)
            validationErrors.flight_date = "Flight date is required.";

        if (!formData.flight_type)
            validationErrors.flight_type = "Flight type is required.";

        if (!formData.flight_class)
            validationErrors.flight_class = "Flight class is required.";

        if (!formData.from)
            validationErrors.from = "Departure location is required.";

        if (!Array.isArray(formData.destinations) || formData?.destinations?.length === 0)
            validationErrors.destinations = "Destinations is required.";

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


    const handleDestinationsChange = (val: string | string[]) => {
        const normalized = Array.isArray(val) ? val : [val];
        setFormData((prev: any) => ({ ...prev, destinations: normalized }));
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={() => {
                onClose();
                resetForm();
            }}
            title={index !== undefined && index !== null ? "Edit Business Travel" : "Add Business Travel"}
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

                {/* Flight Date */}
                <div className="mb-3 col-lg-6">
                    <label htmlFor="flight_date" className="form-label">
                        Flight Date
                    </label>
                    <input
                        type="text"
                        className={`form-control ${errors.flight_date ? "is-invalid" : ""}`}
                        id="flight_date"
                        value={formData.flight_date}
                        onChange={handleChange}
                    />
                    {errors.flight_date && (
                        <div className="invalid-feedback">{errors.flight_date}</div>
                    )}
                </div>

                {/* Flight Type */}
                <div className="mb-3 col-lg-6">
                    <label htmlFor="flight_type" className="form-label">
                        Flight Type
                    </label>
                    <select
                        id="flight_type"
                        className={`form-select ${errors.flight_type ? "is-invalid" : ""}`}
                        value={formData.flight_type}
                        onChange={handleChange}
                    >
                        <option value="">Select Type</option>
                        {businessTravelFlightTypeList.map((type) => (
                            <option key={type} value={type}>
                                {type}
                            </option>
                        ))}
                    </select>
                    {errors.flight_type && (
                        <div className="invalid-feedback">{errors.flight_type}</div>
                    )}
                </div>

                {/* Flight Class */}
                <div className="mb-3 col-lg-6">
                    <label htmlFor="flight_class" className="form-label">
                        Flight Class
                    </label>
                    <select
                        id="flight_class"
                        className={`form-select ${errors.flight_class ? "is-invalid" : ""}`}
                        value={formData.flight_class}
                        onChange={handleChange}
                    >
                        <option value="">Select Class</option>
                        {Object.entries(businessTravelEFList).map(([type]) => (
                            <option key={type} value={type}>
                                {type}
                            </option>
                        ))}
                    </select>
                    {errors.flight_class && (
                        <div className="invalid-feedback">{errors.flight_class}</div>
                    )}
                </div>

                {/* From */}
                <div className="mb-3 col-lg-6">

                    <SelectField
                        label="From"
                        isMulti={false}
                        value={formData?.from}
                        options={airportsList}
                        onChange={(val) => setFormData((p: any) => ({ ...p, from: val }))}
                        error={errors.from}
                        placeholder="Select Departure City..."
                    />
                </div>

                {/* Destinations */}
                <div className="mb-3 col-lg-6">
                    <SelectField
                        label="Destinations"
                        isMulti={true}
                        value={formData?.destinations}
                        options={airportsList}
                        onChange={(val) => {
                            handleDestinationsChange(val);
                        }}
                        error={errors.destinations}
                        placeholder="Select Destinations City..."
                        separator=" → "

                    />
                </div>

                {/* Submit Button */}
                <div className="col-12 text-center pt-2">
                    <button
                        className="btn btn-primary mb-2 action-button px-4 py-2"
                        onClick={handleSubmit}
                    >
                        {index !== undefined && index !== null ? "Update Travel" : "Add Travel"}
                    </button>
                </div>

            </div>
        </Modal>
    );
}