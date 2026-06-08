"use client";

import React, { use, useEffect, useRef, useState } from "react";
import CategoriesByYearChart from "@/components/charts/categoriesbyYearChart";
import ScopeComparisonChart from "@/components/charts/scopeComparisonChart";
import CarbonTrendChart from "@/components/charts/carbonTrendChart";
import ScopeBreakdownChart from "@/components/charts/scopeBreakdownChart";
import TopContributorsByYear from "@/components/charts/topContributersbyYear";
import "@/scss/dashboard.scss";
import { getDashboardData } from "@/apiService/client/dashboard";

export default function Home() {

  const [yearlyAscendingData, setYearlyAscendingData] = useState<any[]>([]);
  const [scopeComparisonData, setScopeComparisonData] = useState<any[]>([]);
  const [lastFiveYearTopContributors, setLastFiveYearTopContributors] = useState<any[]>([]);
  const [yearlyTotalEmissionsData, setYearlyTotalEmissionsData] = useState<any[]>([]);


  const loadData = useRef(true);

  const loadDashboardData = async () => {
    const response = await getDashboardData({});
    const data = response?.data;
    if (!data) return;
    setYearlyAscendingData(data?.yearlyAscendingData || []);
    setScopeComparisonData(data?.yearlyScopeComparisonData || []);
    setYearlyTotalEmissionsData(data?.yearlyTotalEmissionsData || []);

    setLastFiveYearTopContributors(data?.allYearsTopCategoriesDescendingData?.slice(0, 5) || []);
  }
  useEffect(() => {
    if (!loadData.current) return;
    loadData.current = false;
    loadDashboardData();

  }, []);

  return (
    <div className="dashboard-container">

      {/* FOUR ITEMS IN ONE ROW: Table + Three Charts */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr 1fr 1fr",
        gap: "16px",
        marginBottom: "16px"
      }}>


        <div className="glass-card chart-card" style={{ background: "linear-gradient(120deg, #c8d39568, #dedbddac)", }}>
          <div className="chart-wrapper">
            <CarbonTrendChart
              yearlyEmissions={yearlyTotalEmissionsData}
              title="Carbon Emissions Trend"
              height={350}
            />
          </div>
        </div>
        <div className="glass-card chart-card" style={{ background: "linear-gradient(135deg, #5f3e5125, #68194843)", }}>
          <div className="chart-wrapper">
            <ScopeComparisonChart
              yearlyScopes={scopeComparisonData}
              title="Scope Comparison"
              height={350}
            />
          </div>
        </div>
        <div className="glass-card chart-card" style={{ background: "linear-gradient(120deg, #4f8a8b68, #dedbddac)", }}>
          <div className="chart-wrapper">
            <ScopeBreakdownChart
              scopeData={
                [
                  { name: "Scope 1", value: scopeComparisonData[0]?.scope1 ?? 0 },
                  { name: "Scope 2", value: scopeComparisonData[0]?.scope2 ?? 0 },
                  { name: "Scope 3", value: scopeComparisonData[0]?.scope3 ?? 0 },
                ]
              }
              title="Scope Breakdown"
              height={350}
              year={scopeComparisonData[0]?.year || ""}
            />
          </div>
        </div>
        <div className="glass-card chart-card" style={{ background: "linear-gradient(135deg, #e0f2fe, #bae6fd)", }}>
          <TopContributorsByYear yearlyData={lastFiveYearTopContributors} />
        </div>



      </div>

      <div className="hero-chart-section">
        <div className="glass-card hero-chart-card">
          <CategoriesByYearChart
            yearlyData={yearlyAscendingData}
            title="Emissions by Category"
            height={500}
          />
        </div>
      </div>

    </div>
  );
}