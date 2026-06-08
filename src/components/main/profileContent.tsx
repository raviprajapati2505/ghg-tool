"use client";

import { useSelector } from "react-redux";
import { RootState } from "@/redux/store/store";
import { getRoleByIdAndName } from "@/utils/roleAndPermission";
import { useState } from "react";
import callApi from "@/utils/callApi";
import { useDispatch } from "react-redux";
import { setAuthKey } from "@/redux/reducer/auth";

export default function ProfileContent() {
    const authUser = useSelector((state: RootState) => state.auth);
    const dispatch = useDispatch();

    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(false);
    const [form, setForm] = useState({
        name: authUser?.name || "",
        email: authUser?.email || "",
    });
    const [passwordForm, setPasswordForm] = useState({
        current_password: "",
        new_password: "",
        confirm_password: "",
    });
    const [passwordError, setPasswordError] = useState("");
    const [passwordSuccess, setPasswordSuccess] = useState("");

    const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPasswordForm({ ...passwordForm, [e.target.name]: e.target.value });
        setPasswordError("");
        setPasswordSuccess("");
    };

    const handleSaveProfile = async () => {
        setLoading(true);
        const res = await callApi(
            "/api/users/update-profile",
            { name: form.name },
            true,
            true
        );
        if (res?.status === 200) {
            dispatch(setAuthKey({ key: "name", value: form.name }));
            setIsEditing(false);
        }
        setLoading(false);
    };

    const handleChangePassword = async () => {
        setPasswordError("");
        setPasswordSuccess("");
        if (!passwordForm.current_password || !passwordForm.new_password || !passwordForm.confirm_password) {
            setPasswordError("All password fields are required.");
            return;
        }
        if (passwordForm.new_password !== passwordForm.confirm_password) {
            setPasswordError("New password and confirm password do not match.");
            return;
        }
        if (passwordForm.new_password.length < 6) {
            setPasswordError("New password must be at least 6 characters.");
            return;
        }
        setLoading(true);
        const res = await callApi(
            "/api/auth/change-password",
            {
                current_password: passwordForm.current_password,
                new_password: passwordForm.new_password,
            },
            true,
            true
        );
        if (res?.status === 200) {
            setPasswordSuccess("Password changed successfully.");
            setPasswordForm({ current_password: "", new_password: "", confirm_password: "" });
        }
        setLoading(false);
    };

    return (
        <div>
            <p className="main-title mb-3">My Profile</p>
            <div className="row g-3">
                <div className="col-lg-6 col-md-6">
                    <div className="bg-white rounded-3 shadow p-4 h-100">
                        <div className="d-flex justify-content-between align-items-center mb-3">
                            <h6 className="fw-bold mb-0" style={{ color: "rgb(5, 5, 108)" }}>
                                <i className="fas fa-user me-2"></i>Profile Information
                            </h6>
                            {!isEditing ? (
                                <button
                                    className="btn btn-sm action-button btn-primary"
                                    onClick={() => setIsEditing(true)}
                                >
                                    <i className="fas fa-edit me-1"></i> Edit
                                </button>
                            ) : (
                                <div className="d-flex gap-2">
                                    <button
                                        className="btn btn-sm btn-secondary"
                                        onClick={() => {
                                            setIsEditing(false);
                                            setForm({ name: authUser?.name || "", email: authUser?.email || "" });
                                        }}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        className="btn btn-sm action-button btn-primary"
                                        onClick={handleSaveProfile}
                                        disabled={loading}
                                    >
                                        {loading ? (
                                            <span className="spinner-border spinner-border-sm me-1" />
                                        ) : (
                                            <i className="fas fa-save me-1"></i>
                                        )}
                                        Save
                                    </button>
                                </div>
                            )}
                        </div>
                        <hr className="mt-0" />
                        {!isEditing ? (
                            <div className="text-start">
                                <div className="d-flex align-items-center mb-3 gap-2">
                                    <i className="fas fa-user text-muted" style={{ width: 18 }}></i>
                                    <div>
                                        <div style={{ fontSize: 11, color: "#999" }}>Full Name</div>
                                        <div style={{ fontSize: 14, color: "#333", fontWeight: 500 }}>
                                            {authUser?.name || "—"}
                                        </div>
                                    </div>
                                </div>
                                <div className="d-flex align-items-center mb-3 gap-2">
                                    <i className="fas fa-envelope text-muted" style={{ width: 18 }}></i>
                                    <div>
                                        <div style={{ fontSize: 11, color: "#999" }}>Email Address</div>
                                        <div style={{ fontSize: 14, color: "#333", fontWeight: 500 }}>
                                            {authUser?.email || "—"}
                                        </div>
                                    </div>
                                </div>
                                <div className="d-flex align-items-center mb-3 gap-2">
                                    <i className="fas fa-user-tag text-muted" style={{ width: 18 }}></i>
                                    <div>
                                        <div style={{ fontSize: 11, color: "#999" }}>Role</div>
                                        <div style={{ fontSize: 14, color: "#333", fontWeight: 500 }}>
                                            <span
                                                className="badge px-3 py-2"
                                                style={{
                                                    backgroundColor: "rgb(5, 5, 108)",
                                                    fontSize: 12,
                                                    borderRadius: 20,
                                                }}
                                            >
                                                {getRoleByIdAndName(authUser?.role_id) || "User"}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                {authUser?.created_at && (
                                    <div className="d-flex align-items-center gap-2">
                                        <i className="fas fa-calendar-alt text-muted" style={{ width: 18 }}></i>
                                        <div>
                                            <div style={{ fontSize: 11, color: "#999" }}>Member Since</div>
                                            <div style={{ fontSize: 14, color: "#333", fontWeight: 500 }}>
                                                {new Date(authUser.created_at).toLocaleDateString()}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="row g-3">
                                <div className="col-12">
                                    <label className="form-label fw-semibold" style={{ fontSize: 13 }}>
                                        Full Name
                                    </label>
                                    <input
                                        type="text"
                                        name="name"
                                        className="form-control"
                                        value={form.name}
                                        onChange={handleFormChange}
                                        placeholder="Full name"
                                    />
                                </div>
                                <div className="col-12">
                                    <label className="form-label fw-semibold" style={{ fontSize: 13 }}>
                                        Email Address
                                    </label>
                                    <input
                                        type="email"
                                        name="email"
                                        className="form-control"
                                        value={form.email}
                                        disabled
                                        placeholder="Email"
                                    />
                                </div>
                                <div className="col-12">
                                    <label className="form-label fw-semibold" style={{ fontSize: 13 }}>
                                        Role
                                    </label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={getRoleByIdAndName(authUser?.role_id) || ""}
                                        disabled
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                </div>
                <div className="col-lg-6 col-md-6">
                    <div className="bg-white rounded-3 shadow p-4 h-100">
                        <div className="d-flex justify-content-between align-items-center mb-3">
                            <h6 className="fw-bold mb-0" style={{ color: "rgb(5, 5, 108)" }}>
                                <i className="fas fa-lock me-2"></i>Change Password
                            </h6>
                            <button
                                className="btn btn-sm action-button btn-primary"
                                onClick={handleChangePassword}
                                disabled={loading}
                            >
                                {loading ? (
                                    <span className="spinner-border spinner-border-sm me-1" />
                                ) : (
                                    <i className="fas fa-key me-1"></i>
                                )}
                                Update Password
                            </button>
                        </div>
                        <hr className="mt-0" />
                        {passwordError && (
                            <div className="alert alert-danger py-2" style={{ fontSize: 13 }}>
                                <i className="fas fa-exclamation-circle me-1"></i> {passwordError}
                            </div>
                        )}
                        {passwordSuccess && (
                            <div className="alert alert-success py-2" style={{ fontSize: 13 }}>
                                <i className="fas fa-check-circle me-1"></i> {passwordSuccess}
                            </div>
                        )}
                        <div className="row g-3">
                            <div className="col-12">
                                <label className="form-label fw-semibold" style={{ fontSize: 13 }}>
                                    Current Password
                                </label>
                                <input
                                    type="password"
                                    name="current_password"
                                    className="form-control"
                                    value={passwordForm.current_password}
                                    onChange={handlePasswordChange}
                                    placeholder="Enter current password"
                                />
                            </div>
                            <div className="col-12">
                                <label className="form-label fw-semibold" style={{ fontSize: 13 }}>
                                    New Password
                                </label>
                                <input
                                    type="password"
                                    name="new_password"
                                    className="form-control"
                                    value={passwordForm.new_password}
                                    onChange={handlePasswordChange}
                                    placeholder="Enter new password"
                                />
                            </div>
                            <div className="col-12">
                                <label className="form-label fw-semibold" style={{ fontSize: 13 }}>
                                    Confirm New Password
                                </label>
                                <input
                                    type="password"
                                    name="confirm_password"
                                    className="form-control"
                                    value={passwordForm.confirm_password}
                                    onChange={handlePasswordChange}
                                    placeholder="Confirm new password"
                                />
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}