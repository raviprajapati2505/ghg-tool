'use client';
import React, { useMemo } from "react";


interface YearData {
  year: string;
  name: string;
  TotalResult: string;
}

interface Props {
  yearlyData?: YearData[];
}

const TopContributorsByYear: React.FC<Props> = ({ yearlyData = [] }) => {



  return (
    <div className="chart-wrapper" style={{ display: "flex", flexDirection: "column", height: "100%" }}>

      <h2 style={{
        fontSize: "16px",
        fontWeight: "600",
        marginBottom: "20px",
        color: "#1a1a1a",
        flexShrink: 0
      }}>
        {/* Dynamically shows count of years that have data */}
        Top Contributors (Last 5 Years)
      </h2>

      {yearlyData.length === 0 ? (
        // This empty state shows automatically when real data has no results
        <div style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#999",
          fontSize: "14px"
        }}>
          No data available
        </div>
      ) : (
        <div style={{ flex: 1, overflowY: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "separate", borderSpacing: "0" }}>
            <thead>
              <tr style={{ borderBottom: "2px solid rgba(0,0,0,0.1)", backgroundColor: "rgba(0,0,0,0.02)" }}>
                {["Year", "Name", "Emissions"].map(col => (
                  <th key={col} style={{
                    padding: "12px 16px",
                    textAlign: col === "Emissions" ? "right" : "left",
                    fontSize: "13px",
                    fontWeight: "600",
                    color: "#666",
                    textTransform: "uppercase",
                    letterSpacing: "0.5px"
                  }}>
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {yearlyData.map((item, index) => (
                <tr
                  key={index}
                  style={{ borderBottom: "1px solid rgba(0,0,0,0.06)", transition: "background-color 0.2s" }}
                  onMouseEnter={e => e.currentTarget.style.backgroundColor = "rgba(0,0,0,0.02)"}
                  onMouseLeave={e => e.currentTarget.style.backgroundColor = "transparent"}
                >
                  <td style={{ padding: "16px", fontSize: "14px", fontWeight: "500", color: "#1a1a1a" }}>
                    {item?.year}
                  </td>
                  <td style={{ padding: "16px", fontSize: "14px", fontWeight: "500", color: "#1a1a1a" }}>
                    {item?.name}
                  </td>
                  <td style={{ padding: "16px", textAlign: "right", fontSize: "14px", fontWeight: "600", color: "#1a1a1a" }}>
                    {item?.TotalResult}{" "}
                    {/* <span style={{ fontSize: "12px", fontWeight: "400", color: "#666" }}>{item.unit}</span> */}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default TopContributorsByYear;