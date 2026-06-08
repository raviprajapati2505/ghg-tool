'use client';
import React from "react";

interface StatsCardProps {
  value: number | string;
  label?: string;
  iconClass?: string;
}

const TotalEmissionCard: React.FC<StatsCardProps> = ({
  value,
  label = "Total Emissions (MTCO2e)",
  iconClass = "fas fa-bolt"
}) => {
  return (
    <div
      className="card border-0 shadow-sm text-center"
      style={{
        borderRadius: "1rem",
        background: "linear-gradient(135deg, #e0f2fe, #bae6fd)",
        minHeight: "180px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: "1.5rem",
        height: "300px"
      }}
    >
      {/* Icon */}
      {iconClass && (
        <div
          className="mx-auto mb-3 d-flex align-items-center justify-content-center shadow-sm"
          style={{
            width: "50px",
            height: "50px",
            borderRadius: "1rem",
            backgroundColor: "#ffffffcc",
            fontSize: "1.5rem",
            color: "#3b82f6"
          }}
        >
          <i className={iconClass}></i>
        </div>
      )}

      {/* Label */}
      <h6 className="text-muted mb-1">{label}</h6>

      {/* Main Value */}
      <div
        className="fw-bold text-dark"
        style={{ fontSize: "42px", lineHeight: "1.2" }}
      >
        {value}
      </div>
    </div>
  );
};

export default TotalEmissionCard;