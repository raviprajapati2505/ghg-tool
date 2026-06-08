"use client";
import React, { useRef } from "react";
import { useReactToPrint } from "react-to-print";
import { ReportData } from "@/data/reportData";

interface ProfessionalGhgReportProps {
  data: ReportData;
  onClose?: () => void;
}

export const ProfessionalGhgReport: React.FC<ProfessionalGhgReportProps> = ({
  data,
  onClose,
}) => {
  const reportRef = useRef<HTMLDivElement>(null);

  const handlePrint = useReactToPrint({
    contentRef: reportRef,
    documentTitle: `GHG_Report_${data.projectInfo.name}_${data.projectInfo.year}`,
    pageStyle: `
      @page { size: A4; margin: 0; }
      @media print {
        body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
      }
    `,
  });

  return (
    <>
      {/* Control Bar */}
      <div
        className="no-print"
        style={{
          position: "fixed", top: 0, left: 0, right: 0,
          background: "#0f172a", padding: "16px 24px", zIndex: 9999,
          display: "flex", justifyContent: "space-between", alignItems: "center",
          boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
        }}
      >
        <div style={{ color: "white", fontSize: "14px", fontWeight: 600 }}>
          GHG Report — {data.projectInfo.name} ({data.projectInfo.year})
        </div>
        <div style={{ display: "flex", gap: "12px" }}>
          {onClose && (
            <button
              onClick={onClose}
              style={{
                padding: "10px 20px", background: "#475569", color: "white",
                border: "none", borderRadius: "6px", cursor: "pointer",
                fontSize: "14px", fontWeight: 500,
              }}
            >
              Close Preview
            </button>
          )}
          <button
            onClick={handlePrint}
            style={{
              padding: "10px 24px", background: "#3b82f6", color: "white",
              border: "none", borderRadius: "6px", cursor: "pointer",
              fontSize: "14px", fontWeight: 600,
              display: "flex", alignItems: "center", gap: "8px",
            }}
          >
            <span>📄</span> Download PDF
          </button>
        </div>
      </div>

      <div style={{ paddingTop: "70px" }} className="no-print" />

      <div ref={reportRef} className="ghg-report-container">
        <CoverPage data={data} />
        <TableOfContents />
        <ExecutiveSummary data={data} />
        <EmissionsOverview data={data} />
        <DetailedEmissionsDataA data={data} />
        <DetailedEmissionsDataB data={data} />
        <Methodology data={data} />
        <FutureSteps data={data} />
      </div>
    </>
  );
};

// ==================== COVER PAGE ====================
const CoverPage: React.FC<{ data: ReportData }> = ({ data }) => (
  <div className="cover-page page-break">
    <div className="cover-accent-bar"></div>
    <div className="cover-header">
      <div className="logo-container">
        <div className="logo">
          <img
            src={data.companyInfo.logo}
            alt={`${data.companyInfo.name} Logo`}
            className="logo-img"
          />
        </div>
      </div>
      <div className="cover-meta">
        <div className="date">
          {new Date().toLocaleDateString("en-US", {
            year: "numeric", month: "long", day: "numeric",
          })}
        </div>
        <div className="report-id">ID: {data.projectInfo.id}</div>
      </div>
    </div>

    <div className="cover-content">
      <div className="category">{data.projectInfo.type}</div>
      <h1 className="title">
        Greenhouse Gas<br />
        <span className="highlight">Emissions Inventory</span>
      </h1>
      <p className="subtitle">{data.projectInfo.reportingPeriod}</p>
      <div className="divider-container">
        <div className="divider"></div>
        <div className="diamond"></div>
        <div className="divider"></div>
      </div>
    </div>

    <div className="cover-footer">
      <div className="company-info">
        <div className="company-name">{data.companyInfo.name}</div>
        <div className="address">{data.companyInfo.address}</div>
      </div>
      <div className="certification">
        <div className="cert-label">Verified by</div>
        <div className="cert-name">GHG Protocol</div>
      </div>
    </div>
  </div>
);

// ==================== TABLE OF CONTENTS ====================
const TableOfContents: React.FC = () => {
  const sections = [
    { title: "Executive Summary", page: 3 },
    { title: "Emissions Overview", page: 4 },
    { title: "Detailed Emissions Data", page: "5–6" },
    { title: "Methodology", page: 7 },
    { title: "Decarbonization Roadmap", page: 8 },
  ];
  return (
    <div className="toc-page page-break">
      <h2 className="toc-title">Table of Contents</h2>
      <p className="toc-subtitle">
        Navigate through our comprehensive GHG emissions inventory
      </p>
      <div>
        {sections.map((section, index) => (
          <div key={index} className="toc-item">
            <div className="toc-text">
              <span className="toc-number">
                {(index + 1).toString().padStart(2, "0")}
              </span>
              {section.title}
            </div>
            <span className="toc-page-num">{section.page}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

// ==================== EXECUTIVE SUMMARY ====================
const ExecutiveSummary: React.FC<{ data: ReportData }> = ({ data }) => {
  const { emissions, projectInfo, companyInfo, methodology } = data;
  return (
    <div className="content-page page-break">
      <div className="page-header">
        <div className="page-subtitle">Leadership in</div>
        <h2 className="page-title">Climate Stewardship</h2>
      </div>
      <div className="page-content">
        <div style={{ marginBottom: "20px" }}>
          <p style={{ fontSize: "13px", lineHeight: "1.7", color: "#475569", marginBottom: "14px" }}>
            This report presents the Greenhouse Gas (GHG) emissions inventory for{" "}
            <strong>{companyInfo.name}</strong> for the reporting period{" "}
            <strong>{projectInfo.reportingPeriod}</strong>. The inventory has been prepared
            in accordance with the {methodology.standard}.
          </p>
          <p style={{ fontSize: "13px", lineHeight: "1.7", color: "#475569" }}>
            The total GHG emissions for {projectInfo.year} amount to{" "}
            <strong>{emissions.totalEmissions.toLocaleString()} MT CO₂e</strong>, covering
            Scope 1 (direct), Scope 2 (energy indirect), and Scope 3 (value chain) emissions.
          </p>
        </div>

        {/* Summary stats */}
        <div style={{
          display: "grid", gridTemplateColumns: "repeat(3, 1fr)",
          gap: "12px", marginBottom: "20px",
        }}>
          {[
            { label: "Total Emissions", value: emissions.totalEmissions.toLocaleString(), unit: "MT CO₂e", color: "#6366f1" },
            { label: "Scope 1 Direct", value: emissions.scope1Total.toFixed(2), unit: "MT CO₂e", color: "#00D084" },
            { label: "Scope 2 Energy", value: emissions.scope2Total.toFixed(2), unit: "MT CO₂e", color: "#00B8D4" },
          ].map((stat, i) => (
            <div key={i} style={{
              background: "#f8fafc", borderRadius: "8px", padding: "14px",
              borderLeft: `4px solid ${stat.color}`, textAlign: "center",
            }}>
              <div style={{ fontSize: "11px", color: "#718096", marginBottom: "4px" }}>{stat.label}</div>
              <div style={{ fontSize: "20px", fontWeight: 700, color: stat.color }}>{stat.value}</div>
              <div style={{ fontSize: "11px", color: "#718096" }}>{stat.unit}</div>
            </div>
          ))}
        </div>

        <div className="highlights-box">
          <h3 className="highlights-title">Key Highlights</h3>
          {[
            `Total emissions of ${emissions.totalEmissions.toLocaleString()} MT CO₂e for ${projectInfo.year}`,
            `Scope 1 direct emissions: ${emissions.scope1Total.toFixed(2)} MT CO₂e across ${emissions.scope1Categories.length} source(s)`,
            `Scope 2 energy indirect emissions: ${emissions.scope2Total.toFixed(2)} MT CO₂e`,
            `Scope 3 value chain emissions: ${emissions.scope3Total.toLocaleString()} MT CO₂e across ${emissions.scope3Categories.length} source(s)`,
          ].map((item, index) => (
            <div key={index} className="highlight-item">
              <div className="check-icon">✓</div>
              <div className="highlight-text">{item}</div>
            </div>
          ))}
        </div>
      </div>
      <div className="page-footer">Page 3</div>
    </div>
  );
};

// ==================== EMISSIONS OVERVIEW ====================
const EmissionsOverview: React.FC<{ data: ReportData }> = ({ data }) => {
  const { emissions, projectInfo } = data;
  const { totalEmissions, scope1Total, scope2Total, scope3Total } = emissions;
  const pct = (val: number) =>
    totalEmissions > 0 ? ((val / totalEmissions) * 100).toFixed(1) : "0.0";

  return (
    <div className="content-page page-break">
      <div className="page-header">
        <div className="page-subtitle">Annual Performance</div>
        <h2 className="page-title">Emissions Overview — {projectInfo.year}</h2>
      </div>
      <div className="page-content">
        <div className="summary-cards">
          <div className="summary-card purple">
            <div className="card-icon">📊</div>
            <div className="card-label">Total Emissions {projectInfo.year}</div>
            <div className="card-value">{totalEmissions.toLocaleString()}</div>
            <div className="card-unit">MT CO₂e</div>
          </div>
          <div className="summary-card blue">
            <div className="card-icon">🏭</div>
            <div className="card-label">Scope 1 + Scope 2</div>
            <div className="card-value">{(scope1Total + scope2Total).toFixed(2)}</div>
            <div className="card-unit">MT CO₂e</div>
          </div>
          <div className="summary-card green">
            <div className="card-icon">🌐</div>
            <div className="card-label">Scope 3 Value Chain</div>
            <div className="card-value">{scope3Total.toLocaleString()}</div>
            <div className="card-unit">MT CO₂e</div>
          </div>
        </div>

        <div className="scope-cards">
          {/* Scope 1 */}
          <div className="scope-card scope-1 avoid-break">
            <div className="scope-header">
              <div className="scope-badge">1</div>
              <div className="scope-info">
                <div className="scope-title">Scope 1 — Direct Emissions</div>
                <div className="scope-subtitle">Sources owned or controlled</div>
              </div>
            </div>
            <p className="scope-description">
              Direct GHG emissions from sources owned or controlled by the organization.
            </p>
            <div className="scope-stats">
              <div className="stat-box">
                <div className="stat-label">{projectInfo.year}</div>
                <div className="stat-value">{scope1Total.toFixed(2)}</div>
                <div className="stat-unit">MT CO₂e</div>
              </div>
              <div className="stat-box change">
                <div className="stat-label">% of Total</div>
                <div className="stat-value">{pct(scope1Total)}%</div>
              </div>
              <div className="stat-box">
                <div className="stat-label">Sources</div>
                <div className="stat-value">{emissions.scope1Categories.length}</div>
                <div className="stat-unit">categories</div>
              </div>
            </div>
          </div>

          {/* Scope 2 */}
          <div className="scope-card scope-2 avoid-break">
            <div className="scope-header">
              <div className="scope-badge">2</div>
              <div className="scope-info">
                <div className="scope-title">Scope 2 — Energy Emissions</div>
                <div className="scope-subtitle">Purchased electricity</div>
              </div>
            </div>
            <p className="scope-description">
              Indirect emissions from purchased electricity consumed by the organization.
            </p>
            <div className="scope-stats">
              <div className="stat-box">
                <div className="stat-label">{projectInfo.year}</div>
                <div className="stat-value">{scope2Total.toFixed(2)}</div>
                <div className="stat-unit">MT CO₂e</div>
              </div>
              <div className="stat-box change">
                <div className="stat-label">% of Total</div>
                <div className="stat-value">{pct(scope2Total)}%</div>
              </div>
              <div className="stat-box">
                <div className="stat-label">Sources</div>
                <div className="stat-value">{emissions.scope2Categories.length}</div>
                <div className="stat-unit">categories</div>
              </div>
            </div>
          </div>

          {/* Scope 3 */}
          <div className="scope-card scope-3 avoid-break">
            <div className="scope-header">
              <div className="scope-badge">3</div>
              <div className="scope-info">
                <div className="scope-title">Scope 3 — Value Chain Emissions</div>
                <div className="scope-subtitle">Indirect emissions</div>
              </div>
            </div>
            <p className="scope-description">
              All other indirect emissions occurring across the organization's value chain.
            </p>
            <div className="scope-stats">
              <div className="stat-box">
                <div className="stat-label">{projectInfo.year}</div>
                <div className="stat-value">{scope3Total.toLocaleString()}</div>
                <div className="stat-unit">MT CO₂e</div>
              </div>
              <div className="stat-box change">
                <div className="stat-label">% of Total</div>
                <div className="stat-value">{pct(scope3Total)}%</div>
              </div>
              <div className="stat-box">
                <div className="stat-label">Sources</div>
                <div className="stat-value">{emissions.scope3Categories.length}</div>
                <div className="stat-unit">categories</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="page-footer">Page 4</div>
    </div>
  );
};

// ==================== DETAILED EMISSIONS DATA ====================
const DetailedEmissionsDataA: React.FC<{ data: ReportData }> = ({ data }) => {
  const { emissions, projectInfo } = data;

  const ScopeTable = ({
    scopeNum, label, categories, total,
  }: {
    scopeNum: number;
    label: string;
    categories: { name: string; total: number }[];
    total: number;
  }) => (
    <div className="data-table avoid-break">
      <div className="table-title">Scope {scopeNum} — {label}</div>
      <table>
        <thead>
          <tr>
            <th>Category</th>
            <th className="center">{projectInfo.year} (MT CO₂e)</th>
            <th className="center">% of Scope {scopeNum}</th>
          </tr>
        </thead>
        <tbody>
          {categories.length > 0 ? (
            categories.map((cat, index) => (
              <tr key={index}>
                <td>{cat.name}</td>
                <td className="center">{cat.total.toFixed(2)}</td>
                <td className="center">
                  {total > 0 ? ((cat.total / total) * 100).toFixed(1) : "0.0"}%
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={3} className="center" style={{ color: "#999" }}>
                No categories recorded
              </td>
            </tr>
          )}
          <tr className="total-row">
            <td>Total Scope {scopeNum}</td>
            <td className="center">{total.toFixed(2)}</td>
            <td className="center">100%</td>
          </tr>
        </tbody>
      </table>
    </div>
  );

  return (
    <div className="content-page page-break">
      <div className="page-header">
        <div className="page-subtitle">Detailed Analysis</div>
        <h2 className="page-title">Emissions Data Breakdown — {projectInfo.year}</h2>
      </div>
      <div className="page-content">
        <ScopeTable scopeNum={1} label="Direct Emissions" categories={emissions.scope1Categories} total={emissions.scope1Total} />
        <ScopeTable scopeNum={2} label="Energy Emissions" categories={emissions.scope2Categories} total={emissions.scope2Total} />
      </div>
      <div className="page-footer">Page 5</div>
    </div>
  );
};

const DetailedEmissionsDataB: React.FC<{ data: ReportData }> = ({ data }) => {
  const { emissions, projectInfo } = data;

  const ScopeTable = ({
    scopeNum, label, categories, total,
  }: {
    scopeNum: number;
    label: string;
    categories: { name: string; total: number }[];
    total: number;
  }) => (
    <div className="data-table avoid-break">
      <div className="table-title">Scope {scopeNum} — {label}</div>
      <table>
        <thead>
          <tr>
            <th>Category</th>
            <th className="center">{projectInfo.year} (MT CO₂e)</th>
            <th className="center">% of Scope {scopeNum}</th>
          </tr>
        </thead>
        <tbody>
          {categories.length > 0 ? (
            categories.map((cat, index) => (
              <tr key={index}>
                <td>{cat.name}</td>
                <td className="center">{cat.total.toFixed(2)}</td>
                <td className="center">
                  {total > 0 ? ((cat.total / total) * 100).toFixed(1) : "0.0"}%
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={3} className="center" style={{ color: "#999" }}>
                No categories recorded
              </td>
            </tr>
          )}
          <tr className="total-row">
            <td>Total Scope {scopeNum}</td>
            <td className="center">{total.toFixed(2)}</td>
            <td className="center">100%</td>
          </tr>
        </tbody>
      </table>
    </div>
  );

  return (
    <div className="content-page page-break">
      <div className="page-header">
        <div className="page-subtitle">Detailed Analysis (cont.)</div>
        <h2 className="page-title">Emissions Data Breakdown — {projectInfo.year}</h2>
      </div>
      <div className="page-content">
        <ScopeTable scopeNum={3} label="Value Chain Emissions" categories={emissions.scope3Categories} total={emissions.scope3Total} />
        <div className="data-table avoid-break">
          <div className="table-title">Total GHG Inventory Summary</div>
          <table>
            <thead>
              <tr>
                <th>Scope</th>
                <th className="center">{projectInfo.year} (MT CO₂e)</th>
                <th className="center">% of Total</th>
              </tr>
            </thead>
            <tbody>
              {[
                { label: "Scope 1 — Direct", val: emissions.scope1Total },
                { label: "Scope 2 — Energy Indirect", val: emissions.scope2Total },
                { label: "Scope 3 — Value Chain", val: emissions.scope3Total },
              ].map((row, i) => (
                <tr key={i}>
                  <td>{row.label}</td>
                  <td className="center">{row.val.toFixed(2)}</td>
                  <td className="center">
                    {emissions.totalEmissions > 0
                      ? ((row.val / emissions.totalEmissions) * 100).toFixed(1)
                      : "0.0"}%
                  </td>
                </tr>
              ))}
              <tr className="total-row">
                <td>Grand Total</td>
                <td className="center">{emissions.totalEmissions.toLocaleString()}</td>
                <td className="center">100%</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div className="page-footer">Page 6</div>
    </div>
  );
};

// ==================== METHODOLOGY ====================
const Methodology: React.FC<{ data: ReportData }> = ({ data }) => (
  <div className="content-page page-break">
    <div className="page-header">
      <div className="page-subtitle">Standards & Approach</div>
      <h2 className="page-title">Methodology</h2>
    </div>
    <div className="page-content">
      <div className="methodology-grid">
        <div className="method-card">
          <div className="method-icon">📚</div>
          <div className="method-title">Reporting Standard</div>
          <div className="method-text">{data.methodology.standard}</div>
        </div>
        <div className="method-card">
          <div className="method-icon">🧭</div>
          <div className="method-title">Consolidation Approach</div>
          <div className="method-text">{data.methodology.approach}</div>
        </div>
        <div className="method-card">
          <div className="method-icon">📍</div>
          <div className="method-title">Reporting Boundary</div>
          <div className="method-text">{data.methodology.boundary}</div>
        </div>
        <div className="method-card">
          <div className="method-icon">🧮</div>
          <div className="method-title">Emission Factors</div>
          <div className="method-text">
            <ul>
              {data.methodology.factors.map((factor, index) => (
                <li key={index}>{factor}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
    <div className="page-footer">Page 7</div>
  </div>
);

// ==================== FUTURE STEPS ====================
const FutureSteps: React.FC<{ data: ReportData }> = ({ data }) => (
  <div className="content-page page-break">
    <div className="page-header">
      <div className="page-subtitle">Strategic Initiatives</div>
      <h2 className="page-title">Decarbonization Roadmap</h2>
    </div>
    <div className="page-content">
      <p style={{ fontSize: "13px", color: "#475569", lineHeight: "1.7", marginBottom: "25px" }}>
        To align with sustainability targets and achieve long-term emissions reduction,
        the following strategic initiatives have been identified for {data.companyInfo.name}:
      </p>
      <div className="future-steps-grid">
        {data.futureSteps.map((step, index) => {
          const [title, description] = step.split(" - ");
          return (
            <div key={index} className="step-card avoid-break">
              <div className="step-number">{index + 1}</div>
              <div className="step-title">{title}</div>
              <div className="step-description">{description}</div>
            </div>
          );
        })}
      </div>
    </div>
    <div className="page-footer">Page 8</div>
    <div className="report-footer">
      <div className="footer-text">
        © {data.projectInfo.year} {data.companyInfo.name}
      </div>
      <div className="footer-meta">
        Report Generated: {new Date().toLocaleDateString()} | Project: {data.projectInfo.name} | ID: {data.projectInfo.id}
      </div>
    </div>
  </div>
);