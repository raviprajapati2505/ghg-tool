"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toastify } from "@/utils/toast";
import callApi from "@/utils/callApi";
import { clearAuth, setAuth } from "@/redux/reducer/auth";
import { useDispatch } from "react-redux";

export default function Page() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(clearAuth());
  }, []);

  const handleLogin = async (e: any) => {
    e.preventDefault();
    if (!email || !password) {
      toastify({ message: "Please enter both email and password", type: "error" });
      return;
    }
    callApi("/api/auth/login", { email, password })
      .then((res) => {
        if (res?.status === 200) {
          toastify({ message: "Login successful" });
          dispatch(setAuth(res?.user));
          router.push("/");
        } else {
          toastify({ message: "Login failed", type: "error" });
        }
      })
      .catch((err) => {
        toastify({ message: "Login failed", type: "error" });
      });
  };

  return (
    <div className="login-page-container">
      {/* Left Side - Branding */}
      <div className="login-branding-section">
          <div className="login-branding-content">
            <div className="login-green-bar"></div>
          <h1 className="login-branding-title">SUSTAINO-AI</h1>
          <h2 className="login-branding-subtitle">GHG Inventory Management System</h2>
          <p className="login-branding-description">
            Track, measure, and manage your greenhouse gas emissions with precision and ease.
          </p>
          <div className="login-features-list">
            <div className="login-feature-item">
              <i className="fas fa-check-circle"></i>
              <span>Real-time emissions tracking</span>
            </div>
            <div className="login-feature-item">
              <i className="fas fa-check-circle"></i>
              <span>Comprehensive reporting</span>
            </div>
            <div className="login-feature-item">
              <i className="fas fa-check-circle"></i>
              <span>Multi-scope coverage</span>
            </div>
          </div>
        </div>
        <div className="login-branding-footer">
          <img src="/images/logo/QIA-Logo-White.png" alt="QIA Logo" className="login-qia-logo" />
          <div className="login-powered-by-section">
            <p className="login-powered-by-text">Developed By:</p>
            <img src="/images/logo/GORD_White_Logo.png" alt="GORD Logo" className="login-gord-logo" />
          </div>
        </div>
      </div>
      <div className="login-form-section">
        <div className="login-form-container">
          <div className="login-form-header">
            <h3 className="login-form-title">Welcome Back</h3>
            <p className="login-form-subtitle">Sign in to continue to your dashboard</p>
          </div>

          <form onSubmit={handleLogin} className="login-form">
            <div className="login-input-group">
              <label htmlFor="email" className="login-input-label">
                <i className="fas fa-envelope me-2"></i>
                Email Address
              </label>
              <input
                type="email"
                id="email"
                className="login-input"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="login-input-group">
              <label htmlFor="password" className="login-input-label">
                <i className="fas fa-lock me-2"></i>
                Password
              </label>
              <div className="login-password-wrapper">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  className="login-input"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="login-password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  <i className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                </button>
              </div>
            </div>
            <div className="login-options">
              <label className="login-checkbox-label">
                <input type="checkbox" className="login-checkbox" />
                <span>Remember me</span>
              </label>
              <Link href="/reset-password" className="login-forgot-link">
                Forgot Password?
              </Link>
            </div>
            <button type="submit" className="login-submit-button">
              <span>Sign In</span>
              <i className="fas fa-arrow-right ms-2"></i>
            </button>
          </form>
          <div className="login-form-footer">
            <p className="login-help-text">
              Need help? <a href="mailto:support@qia.com" className="login-support-link">Contact Support</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}