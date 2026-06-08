'use client';
import React from "react";

interface StatsCardProps {
    title: string;
    value: number | string;
    percentage: string;
    status: string;
    icon?: React.ReactNode;
    trend?: "up" | "down";
}

const DashboardCard: React.FC<StatsCardProps> = ({
    title,
    value,
    percentage,
    status,
    icon = "👥",
    trend = "up",
}) => {
    const isPositive = trend === "up";

    return (
        <div
            className="card border-2 shadow-sm position-relative overflow-hidden"
            style={{
                background: "linear-gradient(120deg, #8b4f7268, #dedbddac)",
                borderColor: "#9f738d",
                borderRadius: "1rem",
            }}
        >
            <div className="card-body p-4">

                {/* Top Section */}
                <div className="d-flex justify-content-between align-items-center mb-3">

                    <div className="d-flex align-items-center gap-3">
                        <div
                            className="d-flex align-items-center justify-content-center shadow-sm"
                            style={{
                                width: "48px",
                                height: "48px",
                                borderRadius: "0.75rem",
                                backgroundColor: "rgba(255,255,255,0.8)",
                                fontSize: "1.5rem",
                            }}
                        >
                            {icon && (
                                <i className={`fas ${icon}`}></i>
                            )}
                        </div>

                        <h5 className="mb-0 fw-semibold text-dark">
                            {title}
                        </h5>
                    </div>


                </div>

                {/* Year over Year */}
                <div className="mb-3">
                    <div className="d-flex justify-content-between small mb-1 items-center">
                        <span className="text-muted" style={{ fontSize: "15px", fontWeight: "500", alignContent: "center" }}>Emissions(MTCO2e)</span>
                        <span className={`text-muted`} style={{ fontSize: "22px", fontWeight: "600", alignContent: "center" }}>
                            {value}
                        </span>
                    </div>
                </div>

                {/* Status Badge */}
                {/* <div>
                    <span
                        className={`badge rounded-pill px-3 py-2 ${isPositive
                            ? "text-success bg-success-subtle border border-success"
                            : "text-danger bg-danger-subtle border border-danger"
                            }`}
                    >
                        {status}
                    </span>
                </div> */}

            </div>
        </div>
    );
};

export default DashboardCard;