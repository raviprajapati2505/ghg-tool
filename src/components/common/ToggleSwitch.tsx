"use client";

import { useState, useEffect } from "react";

interface ToggleSwitchProps {
    title: string;
    unit: string;
    name: string;
    checked?: boolean;
    onChange: (name: string, value: boolean) => void;
}

export default function ToggleSwitch({ title, unit, name, checked = false, onChange }: ToggleSwitchProps) {
    const [enabled, setEnabled] = useState(checked);

    useEffect(() => {
        onChange(name, enabled);
    }, [enabled]);

    return (
        <label className="items-center cursor-pointer space-x-2" style={{display:"flex", fontSize:"14px", fontWeight:"600"}}>
            
            <div className="relative">
                <input
                    type="checkbox"
                    checked={enabled}
                    onChange={() => setEnabled(!enabled)}
                    className="sr-only"
                />
                <div className={`w-10 h-6 rounded-full transition ${enabled ? "bg-green-500" : "bg-gray-300" }`} ></div>
                <div className={`absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform ${enabled ? "translate-x-4" : ""  }`} ></div>
            </div>
            <span className="text-sm text-gray-700 capitalize">{title} <small style={{fontSize:"10px"}}>{unit}</small></span>
        </label>
    );
}
