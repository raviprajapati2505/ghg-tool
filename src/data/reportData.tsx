
export interface CategoryResult {
  name: string;
  total: number;
}

export interface ReportData {
  projectInfo: {
    id: string;
    name: string;
    type: string;
    year: string;
    reportingPeriod: string;
  };
  companyInfo: {
    name: string;
    logo: string;
    address: string;
  };
  emissions: {
    totalEmissions: number;
    scope1Total: number;
    scope2Total: number;
    scope3Total: number;
    scope1Categories: CategoryResult[];
    scope2Categories: CategoryResult[];
    scope3Categories: CategoryResult[];
    allCategoriesResult: { name: string; TotalResult: string }[];
  };
  methodology: {
    standard: string;
    approach: string;
    boundary: string;
    factors: string[];
  };
  futureSteps: string[];
}

// ============================================================
export const buildReportData = (
  project: {
    _id: string;
    name: string;
    type: string;
    year: string;
  },
  apiResult: {
    scope1: { name: string; TotalResult: string }[];
    scope2: { name: string; TotalResult: string }[];
    scope3: { name: string; TotalResult: string }[];
    ProjectResultInfo: {
      totalProjectEmissionsmTCO2e: string;
      scope1TotalEmissionsmTCO2e: string;
      scope2TotalEmissionsmTCO2e: string;
      scope3TotalEmissionsmTCO2e: string;
      allCategoriesResult: { name: string; TotalResult: string }[];
    };
  }
): ReportData => {
  const info = apiResult.ProjectResultInfo;

  return {
    projectInfo: {
      id: project._id,
      name: project.name,
      type: project.type,
      year: project.year,
      reportingPeriod: `January ${project.year} - December ${project.year}`,
    },
    companyInfo: {
      name: "Qatar Investment Authority",
      logo: "/images/logo/QIA-Logo-White.png",
      address: "Doha, Qatar",
    },
    emissions: {
      totalEmissions: parseFloat(info.totalProjectEmissionsmTCO2e) || 0,
      scope1Total: parseFloat(info.scope1TotalEmissionsmTCO2e) || 0,
      scope2Total: parseFloat(info.scope2TotalEmissionsmTCO2e) || 0,
      scope3Total: parseFloat(info.scope3TotalEmissionsmTCO2e) || 0,
      scope1Categories: (apiResult.scope1 || []).map((c) => ({
        name: c.name,
        total: parseFloat(c.TotalResult) || 0,
      })),
      scope2Categories: (apiResult.scope2 || []).map((c) => ({
        name: c.name,
        total: parseFloat(c.TotalResult) || 0,
      })),
      scope3Categories: (apiResult.scope3 || []).map((c) => ({
        name: c.name,
        total: parseFloat(c.TotalResult) || 0,
      })),
      allCategoriesResult: info.allCategoriesResult || [],
    },
    // TODO: Replace with dynamic values from project settings if you add that feature
    methodology: {
      standard: "GHG Protocol Corporate Accounting and Reporting Standard",
      approach: "Operational Control",
      boundary: `${project.name} — ${project.year}`,
      factors: ["DEFRA 2023", "DEFRA 2024", "UNFCCC", "USEEIO v1.3"],
    },
    futureSteps: [
      "Energy Efficiency - Optimize equipment and reduce consumption",
      "Renewable Energy - Increase green electricity procurement",
      "EV Fleet - Transition to electric vehicles",
      "Carbon Offsets - Invest in verified projects",
      "Energy Audits - Regular monitoring and tracking",
      "Sustainable Procurement - ESG criteria integration",
    ],
  };
};