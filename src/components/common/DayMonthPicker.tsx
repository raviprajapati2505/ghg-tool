'use client';
import React, { use, useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

interface DayMonthPickerProps {
    value?: string; // format DD-MM
    onChange?: (value: string) => void;
    label?: string;
    placeholder?: string;
}

export default function DayMonthPicker({
    value,
    onChange,
    label = "Select Date",
    placeholder = "DD-MM",
}: DayMonthPickerProps) {

    const parseValueToDate = (val?: string) => {
        if (!val) return null;

        const parts = val?.split("-")?.map(str => str?.trim());
        if (parts.length === 2) {
            const day = Number(parts[0]);
            const month = Number(parts[1]);
            if (!isNaN(day) && !isNaN(month)) {
                if (day > 31 || month > 12 || day < 1 || month < 1) return null;
                return new Date(2000, month - 1, day); 
            }
        } else if (parts.length === 1) {
            const month = Number(parts[0]);
            if (!isNaN(month)) {
                return new Date(2000, month - 1, 1);
            }
        }
        return null;
    };
    const [selectedDate, setSelectedDate] = useState<Date | null>(parseValueToDate(value));

    useEffect(() => {
        setSelectedDate(parseValueToDate(value));
    }, [value]);

    const handleChange = (date: Date | null) => {
        setSelectedDate(date);
        if (date && onChange) {
            const day = String(date.getDate()).padStart(2, "0");
            const month = String(date.getMonth() + 1).padStart(2, "0");
            onChange(`${day}-${month}`);
        }
    };

    return (
        <div className="mb-3">
            <label className="form-label d-block">{label}</label>
            <DatePicker
                selected={selectedDate}
                onChange={handleChange}
                dateFormat="dd-MM"
                placeholderText={placeholder}
                className="form-control w-100"
                showMonthDropdown={false}
                showYearDropdown={false}
                renderCustomHeader={({
                    date,
                    decreaseMonth,
                    increaseMonth,
                    prevMonthButtonDisabled,
                    nextMonthButtonDisabled,
                }) => {
                    const currentYear = 2000; // fixed year

                    const prevMonth = new Date(currentYear, date.getMonth() - 1, 1);
                    const nextMonth = new Date(currentYear, date.getMonth() + 1, 1);

                    return (
                        <div
                            style={{
                                margin: 10,
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                            }}
                        >
                            <button
                                onClick={() => decreaseMonth()}
                                disabled={prevMonth.getFullYear() !== currentYear}
                            >
                                {"<"}
                            </button>

                            <span>{date.toLocaleString("default", { month: "long" })}</span>

                            <button
                                onClick={() => increaseMonth()}
                                disabled={nextMonth.getFullYear() !== currentYear}
                            >
                                {">"}
                            </button>
                        </div>
                    );
                }}
                minDate={new Date(2000, 0, 1)}
                maxDate={new Date(2000, 11, 31)}
            />
        </div>
    );
}