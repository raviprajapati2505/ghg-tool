'use client';

import React, { useEffect, useState } from 'react';
import Modal from "@/components/common/Modal";
import { getCategoryDetails, getCategoryAuditLog } from '@/apiService/client/projectCategories';
import { formatDateTime } from '@/utils/function';

interface Props {
    isOpen: boolean;
    onClose: () => void;
    projectCategoryId: string;
    categoryName: string;
}

export default function CategoryDetailsModal({ isOpen, onClose, projectCategoryId, categoryName }: Props) {
    const [details, setDetails] = useState<any>(null);
    const [auditLog, setAuditLog] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!isOpen || !projectCategoryId) return;
        fetchData();
    }, [isOpen, projectCategoryId]);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [detailsRes, auditRes] = await Promise.all([
                getCategoryDetails({ project_category_id: projectCategoryId }),
                getCategoryAuditLog({ project_category_id: projectCategoryId }),
            ]);

            setDetails(detailsRes?.data || null);
            setAuditLog(auditRes?.data || []);
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={`Activity Logs [${categoryName}]`}
            size="lg"
        >
            {loading ? (
                <div className="text-center py-5">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div>
            ) : (
                <>
                    <div>
                        <div className="table-responsive-div">
                            <table className="w-100 bg-white">
                                <thead className="text-white bg-gray-800 z-10">
                                    <tr>
                                        <th className="text-start">Timestamp</th>
                                        <th className="text-start">Action</th>
                                        <th className="text-start">Performed By</th>
                                    </tr>
                                </thead>
                                <tbody className="text-gray-700">
                                    {auditLog.length > 0 ? (
                                        auditLog.map((item, index) => (
                                            <tr key={item._id || index} className="bg-gray-100 hover:bg-gray-200 transition">
                                                <td className="text-start">
                                                    {item.timestamp ? formatDateTime(item.timestamp) : '—'}
                                                </td>
                                                <td className="text-start">{item.action || '—'}</td>
                                                <td className="text-start">{item.performedBy?.name || '—'}</td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={3} className="text-center py-4 text-muted">
                                                No audit log available.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </>
            )}
        </Modal>
    );
}
