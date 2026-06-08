'use client';

import React, { useEffect, useRef, useCallback } from "react";
import * as echarts from "echarts";
import type { EChartsType, EChartsOption } from "echarts";

interface ScopeYearData {
  year: string;
  scope1: number;
  scope2: number;
  scope3: number;
}

interface Props {
  yearlyScopes?: ScopeYearData[];
  title?: string;
  height?: number;
}

const SCOPE_COLORS = [
  "#00D084", "#00B8D4", "#FFD600",
  "#FF6B6B", "#6A1B9A", "#00897B",
  "#D32F2F", "#1976D2", "#2c542e",
  "#7a6c49", "#d531fa", "#f69606",
  "#511f10"
];

const ScopeComparisonChart: React.FC<Props> = ({
  yearlyScopes,
  title = "GHG Emissions by Scope",
  height = 400,
}) => {
  const chartRef = useRef<HTMLDivElement | null>(null);
  const chartInstanceRef = useRef<EChartsType | null>(null);

  const hardcodedData: ScopeYearData[] = [
    { year: "", scope1: 0, scope2: 0, scope3: 0 },
  ];

  // TODO: Switch this line to: const data = yearlyScopes ?? [];
  const data = yearlyScopes ?? hardcodedData;

  const createOption = useCallback((): EChartsOption => {
    return {
      backgroundColor: "transparent",
      tooltip: {
        trigger: "axis",
        axisPointer: { type: "shadow" },
        backgroundColor: "rgba(255, 255, 255, 0.95)",
        borderColor: "rgba(0, 208, 132, 0.3)",
        borderWidth: 1,
        textStyle: { color: "#2d3748", fontSize: 13 },
        padding: [8, 12],
      },
      legend: {
        bottom: 10,
        left: "center",
        itemWidth: 16,
        itemHeight: 16,
        itemGap: 12,
        textStyle: { color: "#4a5568", fontSize: 13 },
        data: data.map((item, idx) => ({
          name: item.year,
          textStyle: { color: "#4a5568" },
          itemStyle: { color: SCOPE_COLORS[idx % SCOPE_COLORS.length] },
        })),
      },
      grid: { left: "3%", right: "4%", bottom: 50, top: 50, containLabel: true },
      xAxis: {
        type: "category",
        data: ["Scope 1", "Scope 2", "Scope 3"],
        axisLabel: { color: "#2d3748", fontSize: 13 },
        axisLine: { show: false },
        axisTick: { show: false },
      },
      yAxis: {
        type: "value",
        name: "Emissions (tCO₂e)",
        nameTextStyle: { color: "#718096", fontSize: 12 },
        axisLabel: { color: "#718096", fontSize: 12 },
        axisLine: { show: false },
        splitLine: { lineStyle: { color: "rgba(229, 231, 235, 0.5)" } },
      },
      series: data.map((item, index) => ({
        name: item.year,
        type: "bar",
        barWidth: "22%",
        data: [item.scope1, item.scope2, item.scope3],
        itemStyle: {
          color: SCOPE_COLORS[index % SCOPE_COLORS.length],
          borderRadius: [6, 6, 0, 0],
        },
      })),
      animationDuration: 800,
    };
  }, [data]);

  // Init chart on mount
  useEffect(() => {
    if (!chartRef.current) return;

    chartInstanceRef.current = echarts.init(chartRef.current);
    chartInstanceRef.current.setOption(createOption(), true);

    const handleResize = () => chartInstanceRef.current?.resize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      chartInstanceRef.current?.dispose();
      chartInstanceRef.current = null;
    };
  }, [createOption]);

  return (
    <div style={{ width: "100%" }}>
      {/* Header */}
      <div
        style={{
          marginBottom: 16,
          display: "flex",
          justifyContent: "flex-start",
          alignItems: "center",
          padding: "0 8px",
        }}
      >
        <h3
          style={{
            fontSize: 18,
            fontWeight: 600,
            color: "#2d3748",
            margin: 0,
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
          }}
        >
          {title}
        </h3>
      </div>

      {/* Chart */}
      {data.length === 0 ? (
        // This empty state shows automatically when real data has no results
        <div
          style={{
            height,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#999",
            fontSize: "14px",
            backgroundColor: "#f8fafc",
            borderRadius: "12px",
          }}
        >
          No data available
        </div>
      ) : (
        <div
          ref={chartRef}
          style={{
            width: "100%",
            height: `${height}px`,
            minHeight: `${height}px`,
            backgroundColor: "#f8fafc",
            borderRadius: "12px",
            overflow: "hidden",
            boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
            background: "linear-gradient(135deg, #5f3e5105, #68194807)"
          }}
        />
      )}
    </div>
  );
};

export default ScopeComparisonChart;