'use client';

import React, { useEffect, useRef, useState } from 'react';
import Modal from "@/components/common/Modal";
import { addProject, updateProject } from '@/apiService/client/projects';
import SelectField from '../common/SelectField';

interface InitialData {
    _id?: string;
    name: string;
    year: string;
    projectCategories?: any[];
}

interface Props {
    isOpen: boolean;
    onClose: (reload?: boolean) => void;
    initialData?: InitialData | null;
    categories?: any;
}

const EMPTY_FORM = {
    id: "",
    name: "",
    year: "",
    scope1Categories: [] as string[],
    scope2Categories: [] as string[],
    scope3Categories: [] as string[],
};

export default function ProjectAddEditModal({
    isOpen,
    onClose,
    initialData = null,
    categories = {},
}: Props) {

    const [formData, setFormData] = useState<any>(EMPTY_FORM);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const isValidateOnChange = useRef(false);

    const [scope1Options, setScope1Options] = useState<any[]>([]);
    const [scope2Options, setScope2Options] = useState<any[]>([]);
    const [scope3Options, setScope3Options] = useState<any[]>([]);

    /* ------------------ Init / Edit mode ------------------ */
    useEffect(() => {
        if (!initialData) {
            resetForm();
            return;
        }

        setFormData((prev: any) => ({
            ...prev,
            id: initialData._id || "",
            name: initialData.name || "",
            year: initialData.year || "",
        }));
    }, [initialData]);

    /* ------------------ Categories ------------------ */
    useEffect(() => {
        if (!categories || Object.keys(categories).length === 0) return;

        setScope1Options(categories.scope1?.map((c: any) => ({ value: c.id, label: c.name })) || []);
        setScope2Options(categories.scope2?.map((c: any) => ({ value: c.id, label: c.name })) || []);
        setScope3Options(categories.scope3?.map((c: any) => ({ value: c.id, label: c.name })) || []);

        if (!initialData?.projectCategories) return;

        const mapScope = (scopeList: any[]) =>
            (initialData?.projectCategories ?? [])
                .filter(cat => scopeList?.some(s => s.id === cat.category_id))
                .map(cat => cat.category_id);

        setFormData((prev: any) => ({
            ...prev,
            scope1Categories: mapScope(categories.scope1),
            scope2Categories: mapScope(categories.scope2),
            scope3Categories: mapScope(categories.scope3),
        }));
    }, [categories, initialData]);

    /* ------------------ Live validation ------------------ */
    useEffect(() => {
        if (isValidateOnChange.current) validateForm();
    }, [formData]);

    /* ------------------ Helpers ------------------ */
    const resetForm = () => {
        setFormData(EMPTY_FORM);
        setErrors({});
        isValidateOnChange.current = false;
    };

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev: any) => ({ ...prev, [name]: value }));
    };

    const handleScopeChange = (val: string | string[], field: string) => {
        const normalized = Array.isArray(val) ? val : [val];
        setFormData((prev: any) => ({ ...prev, [field]: normalized }));
    };

    const validateForm = () => {
        const newErrors: Record<string, string> = {};

        if (!formData.name) newErrors.name = "Project Name is required.";
        if (!formData.year) newErrors.year = "Year is required.";
        if (!formData.scope1Categories.length) newErrors.scope1Categories = "Select at least one Scope 1 category.";
        if (!formData.scope2Categories.length) newErrors.scope2Categories = "Select at least one Scope 2 category.";
        if (!formData.scope3Categories.length) newErrors.scope3Categories = "Select at least one Scope 3 category.";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async () => {
        isValidateOnChange.current = true;
        if (!validateForm()) return;

        formData.id
            ? await updateProject(formData)
            : await addProject(formData);

        resetForm();
        onClose(true);
    };

    /* ------------------ Years ------------------ */
    const currentYear = new Date().getFullYear();
    const yearsList = Array.from({ length: currentYear - 2000 + 1 }, (_, i) => {
        const year = (currentYear - i).toString();
        return { value: year, label: year };
    });

    /* ------------------ UI ------------------ */
    return (
        <Modal
            isOpen={isOpen}
            onClose={() => { resetForm(); onClose(); }}
            title={formData.id ? "Edit Project" : "Create Project"}
            size="lg"
        >
            <div className="row">

                <div className="col-6 mb-3">
                    <SelectField
                        label="Reporting Year"
                        isMulti={false}
                        value={formData.year}
                        options={yearsList}
                        onChange={(val) => setFormData((p: any) => ({ ...p, year: val }))}
                        error={errors.year}
                        placeholder="Select Year..."
                    />
                </div>

                <div className="col-6 mb-3">
                    <label className="form-label">Project Name <span className="text-danger">*</span></label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                    />
                    {errors.name && <div className="invalid-feedback">{errors.name}</div>}
                </div>

                <div className="col-12 mb-3">
                    <SelectField
                        label="Select Categories [Scope1]"
                        isMulti
                        selectAllOptions
                        value={formData.scope1Categories}
                        options={scope1Options}
                        onChange={(v) => handleScopeChange(v, "scope1Categories")}
                        error={errors.scope1Categories}
                        
                    />
                </div>

                <div className="col-12 mb-3">
                    <SelectField
                        label="Select Categories [Scope2]"
                        isMulti
                        selectAllOptions
                        value={formData.scope2Categories}
                        options={scope2Options}
                        onChange={(v) => handleScopeChange(v, "scope2Categories")}
                        error={errors.scope2Categories}
                    />
                </div>

                <div className="col-12 mb-3">
                    <SelectField
                        label="Select Categories [Scope3]"
                        isMulti
                        selectAllOptions
                        value={formData.scope3Categories}
                        options={scope3Options}
                        onChange={(v) => handleScopeChange(v, "scope3Categories")}
                        error={errors.scope3Categories}
                    />
                </div>

                <div className="col-12 text-center pt-2">
                    <button className="btn btn-primary w-50 action-button" onClick={handleSubmit}>
                        {formData.id ? "Update Project" : "Create Project"}
                    </button>
                </div>

            </div>
        </Modal>
    );
}