'use client';
import React, { useEffect, useState, useMemo } from 'react';
import Modal from "@/components/common/Modal";
import { assignUsersToCategory, getCategoryAssignedUsers } from '@/apiService/client/projectCategories';
import { getAssignableUsers } from '@/apiService/client/users';
import { formatDateTime } from '@/utils/function';

interface Props {
    isOpen: boolean;
    onClose: (reload?: boolean) => void;
    projectCategoryId: string;
    categoryName: string;
}

export default function CategoryAssignUsersModal({ isOpen, onClose, projectCategoryId, categoryName }: Props) {
    const [assignedUsers, setAssignedUsers] = useState<any[]>([]);
    const [allUsers, setAllUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [removingUserId, setRemovingUserId] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedUsers, setSelectedUsers] = useState<any[]>([]);
    const [filteredUsers, setFilteredUsers] = useState<any[]>([]);
    const assignedUserIds = useMemo(() => assignedUsers.map(u => u.user_id.toString()), [assignedUsers]);

    const availableUsers = useMemo(
        () => allUsers.filter(u => !assignedUserIds.includes(u._id.toString())),
        [allUsers, assignedUserIds]
    );

    useEffect(() => {
        if (!searchTerm) {
            setFilteredUsers([]);
            return;
        }

        const filtered = availableUsers.filter((user) =>
            !selectedUsers.some(sel => sel._id === user._id) &&
            (
                user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                user.email.toLowerCase().includes(searchTerm.toLowerCase())
            )
        );

        setFilteredUsers(filtered);
    }, [searchTerm, availableUsers, selectedUsers]);

    useEffect(() => {
        if (!isOpen || !projectCategoryId) return;
        fetchData();
    }, [isOpen, projectCategoryId]);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [usersRes, assignedRes] = await Promise.all([
                getAssignableUsers(),
                getCategoryAssignedUsers({ project_category_id: projectCategoryId }),
            ]);

            setAllUsers(usersRes?.data || []);
            setAssignedUsers(assignedRes?.data || []);
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAssignUser = async () => {
        if (selectedUsers.length === 0) return;

        setLoading(true);

        await assignUsersToCategory({
            project_category_id: projectCategoryId,
            user_ids: [
                ...assignedUsers.map(u => u.user_id.toString()),
                ...selectedUsers.map(u => u._id.toString())
            ]
        });

        await fetchData();

        setSearchTerm("");
        setSelectedUsers([]);
        setFilteredUsers([]);

        setLoading(false);
    };

    const handleRemoveUser = async (userId: string) => {
        setRemovingUserId(userId);
        await assignUsersToCategory({
            project_category_id: projectCategoryId,
            user_ids: assignedUsers.filter(u => u.user_id.toString() !== userId).map(u => u.user_id.toString())
        });
        await fetchData();
        setRemovingUserId(null);
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={() => onClose()}
            title={`Category User Assignment [${categoryName}]`}
            size="lg"
        >
            {loading && assignedUsers.length === 0 ? (
                <div className="text-center py-5">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div>
            ) : (
                <>
                    <div className="d-flex justify-content-end mb-3 align-items-start">
                        <div className="position-relative flex-grow-1" style={{ maxWidth: "500px" }}>
                            <div
                                className="form-control d-flex flex-wrap align-items-center"
                                style={{ minHeight: "38px", cursor: "text" }}
                            >
                                {selectedUsers.map((user) => (
                                    <span
                                        key={user._id}
                                        className="multi-select-tag me-1 mb-1 d-flex align-items-center"
                                    >
                                        {user.name}
                                        <i
                                            className="fa fa-times ms-1"
                                            style={{ cursor: "pointer" }}
                                            onClick={() =>
                                                setSelectedUsers(prev =>
                                                    prev.filter(u => u._id !== user._id)
                                                )
                                            }
                                        />
                                    </span>
                                ))}
                                <input
                                    type="text"
                                    className="border-0 flex-grow-1"
                                    style={{ outline: "none", minWidth: "120px" }}
                                    placeholder="Search user..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                            {searchTerm && (
                                <ul
                                    className="list-group position-absolute w-100 mt-1"
                                    style={{ zIndex: 1050, maxHeight: "200px", overflowY: "auto" }}
                                >
                                    {filteredUsers.length > 0 ? (
                                        filteredUsers.map((user) => (
                                            <li
                                                key={user._id}
                                                className="list-group-item list-group-item-action"
                                                style={{ cursor: "pointer" }}
                                                onClick={() => {
                                                    setSelectedUsers(prev => [...prev, user]);
                                                    setSearchTerm("");
                                                    setFilteredUsers([]);
                                                }}
                                            >
                                                <strong>{user.name}</strong>
                                                <br />
                                                <small className="text-muted">{user.email}</small>
                                            </li>
                                        ))
                                    ) : (
                                        <li className="list-group-item text-center text-muted">
                                            No users found
                                        </li>
                                    )}
                                </ul>
                            )}
                        </div>
                        <button
                            className="btn ms-2"
                            style={{
                                height: "38px",
                                backgroundColor: "rgb(51, 63, 73)",
                                color: "white",
                                border: "1px solid #6c757d"
                            }}
                            disabled={loading}
                            onClick={handleAssignUser}
                        >
                            {loading ? (
                                <span className="spinner-border spinner-border-sm" />
                            ) : (
                                <>
                                    <i className="fa fa-plus"></i> Assign User
                                </>
                            )}
                        </button>
                    </div>
                    <div className="table-responsive-div">
                        <table className="w-100 bg-white">
                            <thead className="text-white bg-gray-800 z-10">
                                <tr>
                                    <th className="text-start">User Name</th>
                                    <th className="text-start">Email</th>
                                    <th className="text-start">Assigned By</th>
                                    <th>Assigned Date</th>
                                    <th style={{ minWidth: "90px" }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody className="text-gray-700">
                                {assignedUsers.length > 0 ? (
                                    assignedUsers.map((item, index) => (
                                        <tr key={item._id} className="bg-gray-100 hover:bg-gray-200 transition">
                                            <td className="text-start">{item.user?.name || '—'}</td>
                                            <td className="text-start">{item.user?.email || '—'}</td>
                                            <td className="text-start">{item.createdBy?.name || '—'}</td>
                                            <td>
                                                {item.createdAt ? formatDateTime(item.createdAt) : '—'}
                                            </td>
                                            <td>
                                                <button
                                                    className="btn btn-sm btn-danger ms-2"
                                                    style={{ height: "32px" }}
                                                    disabled={loading}
                                                    onClick={() => handleRemoveUser(item.user_id.toString())}
                                                >
                                                    {removingUserId === item.user_id.toString() ? (
                                                        <span className="spinner-border spinner-border-sm" />
                                                    ) : (
                                                        <i className="fa fa-times" style={{ color: "white" }}></i>
                                                    )}
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={5} className="text-center py-4 text-muted">
                                            No users assigned yet. Click Assign User to get started.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </>
            )}
        </Modal>
    );
}