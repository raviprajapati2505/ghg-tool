"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import Swal from "sweetalert2";
import callApi from "@/utils/callApi";
import { PasswordValidate } from "@/helpers/client/function";

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [uid, setUid] = useState("");
  const [utoken, setUtoken] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [formErrors, setFormErrors] = useState<any>({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (searchParams) {
      setUid(searchParams.get("id") || "");
      setUtoken(searchParams.get("token") || "");
    }
  }, [searchParams]);

  const validateEmailForm = () => {
    const errors: any = {};
    if (!email) errors.email = "Email is required.";
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validatePasswordForm = () => {
    const errors: any = {};
    if (!password) errors.password = "Password is required.";
    if (!confirmPassword) errors.confirmPassword = "Confirm password is required.";
    if (password !== confirmPassword)
      errors.confirmPassword = "Password and confirm password do not match.";
    if (!PasswordValidate(password))
      errors.password =
        "Password must contain uppercase, lowercase, number, and special character.";
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSendResetEmail = async (e: any) => {
    e.preventDefault();
    if (!validateEmailForm()) return;

    setIsLoading(true);
    try {
      const res = await callApi("/api/auth/rest-password-email", { email });
      setIsLoading(false);
      if (res?.status === 200) {
        Swal.fire({
          icon: "success",
          title: "Success",
          text: res?.message,
          confirmButtonColor: "#224b6b",
        });
      } else {
        Swal.fire({
          icon: "error",
          text: res?.message || "Error, try again",
          confirmButtonColor: "#224b6b",
        });
      }
    } catch (err) {
      setIsLoading(false);
      Swal.fire({
        icon: "error",
        text: "Error, try again",
        confirmButtonColor: "#224b6b",
      });
    }
  };

  const handleResetPassword = async (e: any) => {
    e.preventDefault();
    if (!validatePasswordForm()) return;

    setIsLoading(true);
    try {
      const res = await callApi("/api/auth/rest-password", {
        id: uid,
        token: utoken,
        password,
      });
      setIsLoading(false);
      if (res?.status === 200) {
        Swal.fire({
          icon: "success",
          title: "Success",
          text: res?.message,
          confirmButtonColor: "#224b6b",
          confirmButtonText: "Login",
        }).then((result) => {
          if (result.isConfirmed) router.push("/login");
        });
      } else {
        Swal.fire({
          icon: "error",
          text: res?.message || "Error, try again",
          confirmButtonColor: "#224b6b",
        });
      }
    } catch (err) {
      setIsLoading(false);
      Swal.fire({
        icon: "error",
        text: "Error, try again",
        confirmButtonColor: "#224b6b",
      });
    }
  };

  return (
    <div className="container-fluid min-vh-100 d-flex align-items-center justify-content-center bg-light">
      <div className="row w-100 justify-content-center">
        <div className="col-12 col-md-6 col-lg-5">
          <div className="card shadow-lg rounded-3">
            <div className="card-body p-4 p-md-5">

              <h2 className="card-title text-center mb-4">
                {uid && utoken ? "Reset Password" : "Request Password Reset"}
              </h2>

              {uid && utoken ? (
                <form onSubmit={handleResetPassword} noValidate>
                  <div className="mb-3">
                    <label htmlFor="password" className="form-label">New Password</label>
                    <input
                      type="password"
                      className={`form-control ${formErrors.password ? "is-invalid" : ""}`}
                      id="password"
                      placeholder="Enter new password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    {formErrors.password && <div className="invalid-feedback">{formErrors.password}</div>}
                  </div>

                  <div className="mb-3">
                    <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
                    <input
                      type="password"
                      className={`form-control ${formErrors.confirmPassword ? "is-invalid" : ""}`}
                      id="confirmPassword"
                      placeholder="Confirm new password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                    {formErrors.confirmPassword && <div className="invalid-feedback">{formErrors.confirmPassword}</div>}
                  </div>

                  <div className="d-grid mb-3">
                    <button type="submit" className="btn btn-primary" disabled={isLoading}>
                      {isLoading ? "Processing..." : "Reset Password"}
                    </button>
                  </div>
                </form>
              ) : (
                <form onSubmit={handleSendResetEmail} noValidate>
                  <div className="mb-3">
                    <label htmlFor="email" className="form-label">Email</label>
                    <input
                      type="email"
                      className={`form-control ${formErrors.email ? "is-invalid" : ""}`}
                      id="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                    {formErrors.email && <div className="invalid-feedback">{formErrors.email}</div>}
                  </div>

                  <div className="d-grid mb-3">
                    <button type="submit" className="btn btn-primary" disabled={isLoading}>
                      {isLoading ? "Sending..." : "Send Reset Link"}
                    </button>
                  </div>
                </form>
              )}

              <p className="text-center text-muted mb-0">
                Remembered your password? <Link href="/login" className="text-primary">Login</Link>
              </p>
            </div>
          </div>

          <div className="text-center mt-3 text-muted">
            Powered by <strong>GORD</strong>
          </div>
        </div>
      </div>
    </div>
  );
}
