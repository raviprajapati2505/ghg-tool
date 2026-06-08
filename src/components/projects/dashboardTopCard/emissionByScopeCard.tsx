'use client';
import React, { useMemo } from "react";

interface StatsCardProps {
  scope1: number | string;
  scope2: number | string;
  scope3: number | string;
}

const EmissionByScopeCard: React.FC<StatsCardProps> = ({
  scope1,
  scope2,
  scope3,
}) => {
  // Convert all scopes to numbers
  const scopes = useMemo(() => {
    const data = [
      { name: "Scope 1", value: Number(scope1) || 0 },
      { name: "Scope 2", value: Number(scope2) || 0 },
      { name: "Scope 3", value: Number(scope3) || 0 },
    ];

    // Determine max value to scale progress bars
    const maxValue = Math.max(...data.map(d => d.value)) || 1;

    // Calculate percentage for each scope
    return data.map(d => ({
      ...d,
      percentage: (d.value / maxValue) * 100
    }));
  }, [scope1, scope2, scope3]);

  return (
    <div
      className="card border-2 shadow-sm position-relative overflow-hidden"
      style={{
        background: "linear-gradient(120deg, #c8d39568, #dedbddac)",
        // borderColor: "#9f738d",
        borderRadius: "1rem",
      }}
    >
      <div className="card-body p-4" style={{ height: 300, width: "100%" }}>
        <h5 className="fw-semibold mb-4">Emissions by Scope (MTCO2e)</h5>

        {scopes.map((scope, index) => (
          <div key={index} className="mb-3">

            {/* Label Row */}
            <div className="d-flex justify-content-between small mb-1">
              <span className="text-muted" style={{ fontSize: "15px", fontWeight: 500 }}>
                {scope.name} Emissions
              </span>
              <span style={{ fontSize: "22px", fontWeight: 600 }}>
                {scope.value}
              </span>
            </div>

            {/* Progress Line */}
            <div className="progress" style={{ height: "10px" }}>
              <div
                className="progress-bar bg-primary"
                role="progressbar"
                style={{ width: `${scope.percentage}%` }}
              />
            </div>

          </div>
        ))}
      </div>
    </div>
  );
};

export default EmissionByScopeCard;