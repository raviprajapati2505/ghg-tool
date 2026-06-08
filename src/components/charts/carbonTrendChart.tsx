'use client';

import React, { useEffect, useRef, useState, useMemo } from "react";
import * as echarts from "echarts";

interface YearEmission {
  year: string;
  value: number;
}

interface Props {

  yearlyEmissions?: any[];
  title?: string;
  height?: number;
}

const ACCENT = "#00D084";

const iconButtonStyle = (active: boolean): React.CSSProperties => ({
  border: "none",
  borderRadius: "6px",
  padding: "6px 10px",
  fontSize: 14,
  cursor: "pointer",
  background: active ? ACCENT : "rgba(229, 231, 235, 0.6)",
  color: active ? "#fff" : "#4a5568",
  boxShadow: active
    ? "0 2px 8px rgba(0, 208, 132, 0.3)"
    : "0 1px 3px rgba(0,0,0,0.08)",
  transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
  fontWeight: active ? 600 : 500,
  minWidth: "36px",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
});

const CarbonTrendChart: React.FC<Props> = ({
  yearlyEmissions,
  title = "Carbon Emissions Trend",
  height = 350,
}) => {
  const chartRef = useRef<HTMLDivElement>(null);
  const chartInstanceRef = useRef<echarts.ECharts | null>(null);
  const [chartType, setChartType] = useState<"line" | "bar" | "area">("line");

  const [data, setData] = useState<YearEmission[]>([]);
  useEffect(() => {
    if (yearlyEmissions && yearlyEmissions.length > 0) {
      setData(yearlyEmissions);
    }
  }, [yearlyEmissions]);

  const years = useMemo(() => data.map((d) => d.year), [data]);
  const values = useMemo(() => data.map((d) => d.value), [data]);

  useEffect(() => {
    if (!chartRef.current) return;

    if (!chartInstanceRef.current) {
      chartInstanceRef.current = echarts.init(chartRef.current);
    }

    const chartInstance = chartInstanceRef.current;

    const option: echarts.EChartsOption = {
      backgroundColor: "transparent",

      tooltip: {
        trigger: "axis",
        backgroundColor: "rgba(255, 255, 255, 0.95)",
        borderColor: "rgba(0, 208, 132, 0.3)",
        borderWidth: 1,
        textStyle: { color: "#2d3748", fontSize: 13 },
        padding: [8, 12],
      },

      grid: {
        left: "5%",
        right: "5%",
        bottom: "10%",
        top: 20,
        containLabel: true,
      },

      xAxis: {
        type: "category",
        data: years,
        axisLabel: { color: "#2d3748", fontSize: 13 },
        axisLine: { show: false },
        axisTick: { show: false },
      },

      yAxis: {
        type: "value",
        name: "tCO₂e",
        nameTextStyle: { color: "#718096", fontSize: 12 },
        axisLabel: { color: "#718096", fontSize: 12 },
        splitLine: { lineStyle: { color: "rgba(229, 231, 235, 0.5)" } },
        axisLine: { show: false },
      },

      series: [
        {
          name: "Emissions",
          type: chartType === "bar" ? "bar" : "line",
          smooth: chartType !== "bar",
          data: values,
          itemStyle: {
            color: ACCENT,
            borderRadius: chartType === "bar" ? [6, 6, 0, 0] : undefined,
          },
          lineStyle:
            chartType !== "bar" ? { color: ACCENT, width: 3 } : undefined,
          areaStyle:
            chartType === "area"
              ? {
                color: {
                  type: "linear",
                  x: 0,
                  y: 0,
                  x2: 0,
                  y2: 1,
                  colorStops: [
                    { offset: 0, color: "rgba(0, 208, 132, 0.4)" },
                    { offset: 1, color: "rgba(0, 208, 132, 0.02)" },
                  ],
                },
              }
              : undefined,
        },
      ],

      animationDuration: 800,
    };

    chartInstance.setOption(option, true);

    const handleResize = () => chartInstance.resize();
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, [years, values, chartType]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      chartInstanceRef.current?.dispose();
      chartInstanceRef.current = null;
    };
  }, []);

  return (
    <div style={{ width: "100%" }}>
      {/* Header */}
      <div
        className="row"
      >
        <div className="col-12">
          <h3
            style={{
              fontSize: 18,
              fontWeight: 600,
              color: "#2d3748",
              margin: 0,
              fontFamily:
                '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
            }}
          >
            {title}
          </h3>
        </div>


        <div className="col-12 d-flex justify-content-end align-items-center gap-2 mt-2 mb-2">
          <button
            onClick={() => setChartType("line")}
            style={iconButtonStyle(chartType === "line")}
            title="Line Chart"
          >
            <i className="fas fa-chart-line"></i>
          </button>
          <button
            onClick={() => setChartType("bar")}
            style={iconButtonStyle(chartType === "bar")}
            title="Bar Chart"
          >
            <i className="fas fa-chart-bar"></i>
          </button>
          <button
            onClick={() => setChartType("area")}
            style={iconButtonStyle(chartType === "area")}
            title="Area Chart"
          >
            <i className="fas fa-chart-area"></i>
          </button>
        </div>
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
            backgroundColor: "#f8fafc",
            borderRadius: "12px",
            overflow: "hidden",
            boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
            background: "linear-gradient(120deg, #c8d3953a, #dedbddac)"
          }}
        />
      )}
    </div>
  );
};

export default CarbonTrendChart;