"use client";

import React, { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store/store";
import { Roles } from "@/utils/roleAndPermission";

interface Message {
    user_id: string;
    user_name: string;
    user_role: string;
    message: string;
    timestamp: Date;
}

interface ReviewModalProps {
    isOpen: boolean;
    onClose: () => void;
    rowData: any;
    rowIndex: number;
    onStatusUpdate: (index: number, status: 'approved' | 'rejected' | 'pending', messages: Message[]) => void;
}

export default function ReviewModal({
    isOpen,
    onClose,
    rowData,
    rowIndex,
    onStatusUpdate
}: ReviewModalProps) {
    const authUser = useSelector((state: RootState) => state.auth);
    const authRoleId = authUser?.role_id;
    const authUserId = authUser?.id || authUser?._id?.$oid || authUser?._id || authUser?.user_id;
    const authUserName = authUser?.name || 'Unknown User';
    const authUserRole = authUser?.role_name || 'User';
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState("");
    const [currentStatus, setCurrentStatus] = useState<'approved' | 'rejected' | 'pending'>('pending');
    const [selectedStatus, setSelectedStatus] = useState<'approved' | 'rejected' | 'pending'>('pending');
    const [sending, setSending] = useState(false);
    const [remarkError, setRemarkError] = useState("");
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const canApproveReject = authRoleId === Roles.AdminId || authRoleId === Roles.ManagerId;

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        if (isOpen && rowData) {
            setMessages(rowData.review_messages || []);
            setCurrentStatus(rowData.review_status || 'pending');
            setSelectedStatus(rowData.review_status || 'pending');
        }
    }, [isOpen, rowData]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleAddRemark = () => {
        if (selectedStatus === 'rejected' && !newMessage.trim()) {
            setRemarkError('Remarks are required for rejection');
            return;
        }
        setSending(true);
        setRemarkError("");
        const updatedMessages = [...messages];
        if (newMessage.trim()) {
            const message: Message = {
                user_id: authUserId,
                user_name: authUserName,
                user_role: authUserRole,
                message: newMessage.trim(),
                timestamp: new Date()
            };
            updatedMessages.push(message);
        }
        setMessages(updatedMessages);
        setNewMessage("");
        setCurrentStatus(selectedStatus);
        onStatusUpdate(rowIndex, selectedStatus, updatedMessages);
        setSending(false);
        onClose();
    };
    useEffect(() => {
        setRemarkError("");
    }, [newMessage, selectedStatus]);
    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'approved':
                return <span className="badge bg-success">Approved</span>;
            case 'rejected':
                return <span className="badge bg-danger">Rejected</span>;
            case 'pending':
            default:
                return <span className="badge bg-warning text-dark">Pending </span>;
        }
    };

    const timestampToTime = (timestamp: Date) => {
        const date = new Date(timestamp);
        return date.toLocaleString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
        });
    };

    const isCurrentUser = (msgUserId: string) => {
        if (!authUserId || !msgUserId) return false;
        return String(authUserId) === String(msgUserId);
    };

    const getUserLabel = (msg: Message) => {
        const isCurrent = isCurrentUser(msg.user_id);
        if (isCurrent) return 'You';
        return `${msg.user_name} (${msg.user_role})`;
    };

    if (!isOpen) return null;

    return (
        <div
            className="modal fade show d-block"
            style={{ background: 'rgba(0,0,0,0.5)', zIndex: 1050 }}
            onClick={onClose}
        >
            <div
                className="modal-dialog modal-dialog-centered"
                style={{ maxWidth: '500px', maxHeight: '90vh', overflow: 'hidden' }}
                onClick={(e) => e.stopPropagation()}
            >
                <div className="modal-content border-0 rounded-3 overflow-hidden shadow-lg">
                    <div className="modal-header text-black py-3 border-bottom">
                        <div className="d-flex justify-content-between align-items-center w-100">
                            <div>
                                <h6 className="modal-title fw-semibold mb-1">
                                    <i className="fa fa-comments me-2"></i>
                                    Remarks
                                </h6>
                            </div>
                            <div className="d-flex align-items-center gap-3">
                                <button
                                    type="button"
                                    className="btn-close btn-close-black"
                                    onClick={onClose}
                                    aria-label="Close"
                                />
                            </div>
                        </div>
                    </div>
                    <div className="p-3 bg-white border-bottom">
                        <div className="mb-3">
                            <small className="d-block opacity-90
                             mb-2" style={{ fontSize: '12px' }}>
                                Status: {getStatusBadge(currentStatus)}
                            </small>
                            <textarea
                                className={`form-control ${remarkError ? 'is-invalid' : ''}`}
                                placeholder="Enter your remarks or feedback here..."
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                                disabled={sending}
                                rows={3}
                                style={{
                                    borderRadius: '8px',
                                    border: remarkError ? '1px solid #dc3545' : '1px solid #ddd',
                                    padding: '10px 14px',
                                    resize: 'none'
                                }}
                            />
                            {remarkError && (
                                <div className="text-danger mt-1" style={{ fontSize: '13px' }}>
                                    <i className="fas fa-exclamation-circle me-1"></i>
                                    {remarkError}
                                </div>
                            )}
                        </div>
                        <div className="d-flex w-100 justify-content-between align-items-center">
                            {canApproveReject && (
                                <div className="d-flex gap-3 align-items-center">
                                    <div className="form-check mb-0">
                                        <input
                                            className="form-check-input"
                                            type="radio"
                                            name="statusRadio"
                                            id="approveRadio"
                                            value="approved"
                                            checked={selectedStatus === 'approved'}
                                            onChange={(e) => setSelectedStatus('approved')}
                                        />
                                        <label className="form-check-label text-success fw-semibold" htmlFor="approveRadio">
                                            Approve
                                        </label>
                                    </div>
                                    <div className="form-check mb-0">
                                        <input
                                            className="form-check-input"
                                            type="radio"
                                            name="statusRadio"
                                            id="rejectRadio"
                                            value="rejected"
                                            checked={selectedStatus === 'rejected'}
                                            onChange={(e) => setSelectedStatus('rejected')}
                                        />
                                        <label className="form-check-label text-danger fw-semibold" htmlFor="rejectRadio">
                                            Reject
                                        </label>
                                    </div>
                                </div>
                            )}
                            <button
                                type="button"
                                className="btn action-button d-flex align-items-center justify-content-center gap-2 px-4 text-white"
                                onClick={handleAddRemark}
                                disabled={sending}
                                style={{ minWidth: '150px', height: '42px' }}
                            >
                                {sending ? (
                                    <span className="spinner-border spinner-border-sm" />
                                ) : (
                                    <>
                                        <i className="fas fa-paper-plane"></i>
                                        Add Remark
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                    <div
                        className="modal-body p-0"
                        style={{
                            maxHeight: '400px',
                            overflowY: 'auto',
                            backgroundColor: '#f8f9fa'
                        }}
                    >
                        {messages.length > 0 ? (
                            <div className="p-3">
                                {messages.map((msg, idx) => {
                                    const isCurrent = isCurrentUser(msg.user_id);
                                    const userLabel = getUserLabel(msg);
                                    return (
                                        <div
                                            key={idx}
                                            className={`d-flex flex-column ${isCurrent ? 'align-items-end ms-auto' : 'align-items-start me-auto'
                                                } mb-3`}
                                            style={{ maxWidth: '75%' }}
                                        >
                                            <small className={`fw-semibold ${isCurrent ? 'text-success' : 'text-muted'
                                                } mb-1`}>
                                                {userLabel}
                                            </small>
                                            <div
                                                className="px-3 py-2 rounded-3 shadow-sm small"
                                                style={{
                                                    backgroundColor: isCurrent ? '#681949' : '#ffffff',
                                                    color: isCurrent ? '#ffffff' : '#333',
                                                    borderBottomRightRadius: isCurrent ? '4px' : '16px',
                                                    borderBottomLeftRadius: isCurrent ? '16px' : '4px',
                                                    maxWidth: '100%',
                                                    wordBreak: 'break-word'
                                                }}
                                            >
                                                {msg.message}
                                            </div>
                                            <small className="text-muted mt-1">
                                                {timestampToTime(msg.timestamp)}
                                            </small>
                                        </div>
                                    );
                                })}
                                <div ref={messagesEndRef} />
                            </div>
                        ) : (
                            <div className="text-center text-muted py-5">
                                <i className="fa fa-comments fa-3x mb-3 opacity-25"></i>
                                <p className="mb-0">No remarks yet. Start the conversation!</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}