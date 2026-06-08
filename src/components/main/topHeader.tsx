"use client";

import Link from "next/link";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store/store";
import { usePathname } from "next/navigation";
import callApi from "@/utils/callApi";
import { clearAuth } from "@/redux/reducer/auth";
import { toastify } from "@/utils/toast";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { getRoleByIdAndName, getRolePermission } from "@/utils/roleAndPermission";
import { useState } from "react";
import { useNotifications } from "@/hooks/useNotifications";

export default function TopHeader() {
  const authUser = useSelector((state: RootState) => state.auth);
  const authRoleId = authUser?.role_id;
  const router = useRouter();
  const dispatch = useDispatch();
  const pathname = usePathname();
  const [showAll, setShowAll] = useState(false);
  const { notifications, unreadCount, markAsRead, markAllRead } = useNotifications();

  const handleLogout = async (e: React.MouseEvent) => {
    e.preventDefault();
    callApi("/api/auth/logout", {})
      .then((res) => {
        if (res?.status === 200) {
          toastify({ message: "Logout successful" });
          dispatch(clearAuth());
          router.push("/login");
        } else {
          toastify({ message: "Logout failed", type: "error" });
        }
      })
      .catch(() => {
        toastify({ message: "Logout failed", type: "error" });
      });
  };

  return (
    <nav className="navbar navbar-expand-lg fixed-top shadow-sm px-3 top-header-navbar">
      <a className="navbar-brand" href="#" style={{ fontWeight: "900", fontSize: "1.5rem" }}>
        <span
          style={{
            background:
              "linear-gradient(90deg, #b8336a 0%, #8d2153 25%, #681949 50%, #5a1540 75%, #4f123a 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          Sustaino-AI
        </span>
      </a>
      <button
        className="navbar-toggler mb-2"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#mainNavbar"
        aria-controls="mainNavbar"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span className="navbar-toggler-icon"></span>
      </button>
      <div className="collapse navbar-collapse" id="mainNavbar">
        <ul className="navbar-nav mx-auto mb-2 mb-lg-0">
          <li className="nav-item">
            <Link
              href="/"
              className={`nav-link top-header-link first-top-header-link ${pathname === "/" ? "link-active" : ""
                }`}
            >
              <i className="fas fa-th-large me-1"></i> Dashboard
            </Link>
          </li>
          {getRolePermission(authRoleId, "view-projects") && (
            <li className="nav-item">
              <Link
                href="/projects"
                className={`nav-link top-header-link ${pathname.startsWith("/projects") ? "link-active" : ""
                  }`}
              >
                <i className="fas fa-briefcase me-1"></i> Projects
              </Link>
            </li>
          )}
          {getRolePermission(authRoleId, "view-users") && (
            <li className="nav-item">
              <Link
                href="/users"
                className={`nav-link top-header-link ${pathname.startsWith("/users") ? "link-active" : ""
                  }`}
              >
                <i className="fas fa-users me-1"></i> Users Management
              </Link>
            </li>
          )}
          {getRolePermission(authRoleId, "view-settings") && (
            <li className="nav-item">
              <Link
                href="/settings"
                className={`nav-link top-header-link ${pathname.startsWith("/settings") ? "link-active" : ""
                  }`}
              >
                <i className="fas fa-cog me-1"></i> settings
              </Link>
            </li>
          )}
          {/* ── Audit Trail — admin/manager only ── */}
          {getRolePermission(authRoleId, "view-audit-trail") && (
            <li className="nav-item">
              <Link
                href="/audit-trail"
                className={`nav-link top-header-link ${pathname.startsWith("/audit-trail") ? "link-active" : ""
                  }`}
              >
                <i className="fas fa-history me-1"></i> Audit Trail
              </Link>
            </li>
          )}
        </ul>
        <div className="nav-item me-1">
          <Link
            href="/documentation"
            className="nav-link p-2"
            title="Getting Started"
          >
            <i className="fas fa-question-circle fs-4"></i>
          </Link>
        </div>
        <div className="nav-item dropdown me-3">
          <a
            className="nav-link p-2 position-relative"
            href="#"
            role="button"
            data-bs-toggle="dropdown"
            aria-expanded="false"
            data-bs-auto-close="outside"
            title="Notifications"
          >
            <i className="fas fa-bell fs-4"></i>
            {unreadCount > 0 && (
              <span
                className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
                style={{ fontSize: "10px" }}
              >
                {unreadCount > 99 ? "99+" : unreadCount}
              </span>
            )}
          </a>
          <div
            className="dropdown-menu dropdown-menu-end p-0"
            style={{ width: "320px", maxHeight: "400px", overflowY: "auto" }}
          >
            <div className="d-flex justify-content-between align-items-center px-3 py-2 border-bottom">
              <strong>Notifications</strong>
              {unreadCount > 0 && (
                <button
                  className="btn btn-sm btn-link text-decoration-none p-0"
                  onClick={markAllRead}
                >
                  Mark all read
                </button>
              )}
            </div>
            {notifications.length === 0 ? (
              <div className="text-center text-muted py-4">
                <i className="fas fa-bell-slash d-block mb-2"></i>
                No notifications
              </div>
            ) : (
              <>
                {[...notifications]
                  .reverse()
                  .slice(0, showAll ? notifications.length : 5)
                  .map((n: any) => (
                    <div
                      key={n._id}
                      onClick={() => !n.is_read && markAsRead(n._id)}
                      className={`px-3 py-2 border-bottom ${!n.is_read ? "bg-light" : ""}`}
                      style={{ cursor: n.is_read ? "default" : "pointer" }}
                    >
                      <div className="d-flex justify-content-between">
                        <strong style={{ fontSize: "13px" }}>{n.title}</strong>
                        {!n.is_read && (
                          <span className="badge bg-primary" style={{ fontSize: "9px" }}>
                            New
                          </span>
                        )}
                      </div>
                      <p className="mb-0 text-muted" style={{ fontSize: "12px" }}>
                        {n.message}
                      </p>
                      <small className="text-muted" style={{ fontSize: "11px" }}>
                        {new Date(n.created_at).toLocaleString()}
                      </small>
                    </div>
                  ))}
                {notifications.length > 5 && (
                  <div
                    className="text-center py-2 border-top"
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowAll(!showAll);
                    }}
                    style={{ cursor: "pointer", fontSize: "13px", color: "#0d6efd" }}
                  >
                    {showAll ? (
                      <>
                        <i className="fas fa-chevron-up me-1"></i> See Less
                      </>
                    ) : (
                      <>
                        <i className="fas fa-chevron-down me-1"></i> See More (
                        {notifications.length - 5} more)
                      </>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
        <div className="d-flex align-items-center">
          <span
            className="me-3 d-none d-lg-block"
            style={{
              maxWidth: "150px",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
            title={authUser?.name}
          >
            {authUser?.name}
          </span>
          <ul className="navbar-nav">
            <li className="nav-item dropdown">
              <a
                className="nav-link dropdown-toggle d-flex align-items-center"
                href="#"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
                title="Profile"
              >
                <i className="far fa-user-circle fs-3"></i>
              </a>
              <ul className="dropdown-menu dropdown-menu-end">
                <li>
                  <Link className="dropdown-item" href="/profile">
                    <i className="fas fa-user me-2"></i> Profile
                  </Link>
                </li>
                <li>
                  <hr className="dropdown-divider" />
                </li>
                <li>
                  <Link
                    className="dropdown-item"
                    href="#"
                    onClick={handleLogout}
                  >
                    <i className="fas fa-sign-out-alt me-2"></i> Logout
                  </Link>
                </li>
              </ul>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}