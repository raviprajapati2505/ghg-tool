'use client';

import React, { useEffect, useRef, useState, useCallback, useMemo } from "react";
import * as echarts from "echarts";
import type { EChartsType, EChartsOption } from "echarts";

// TODO: Remove this interface and hardcoded data when connecting to real data
// This should match the API response shape from your project result endpoint
interface ScopeEmission {
    name: string;  // e.g. "Scope 1", "Scope 2", "Scope 3"
    value: number; // tCO₂e
}

interface Props {
    // TODO: When connecting real data, pass scopeData from parent like:
    // scopeData={[
    //   { name: "Scope 1", value: projectResultInfo?.scope1Total },
    //   { name: "Scope 2", value: projectResultInfo?.scope2Total },
    //   { name: "Scope 3", value: projectResultInfo?.scope3Total },
    // ].filter(d => d.value != null)}
    scopeData?: ScopeEmission[];
    title?: string;
    height?: number;
    year?: string;
}

const SCOPE_COLORS = ["#00D084", "#00B8D4", "#FFD600"];

const iconButtonStyle = (active: boolean): React.CSSProperties => ({
    border: "none",
    borderRadius: "6px",
    padding: "6px 10px",
    fontSize: 14,
    cursor: "pointer",
    background: active ? "#00D084" : "rgba(229, 231, 235, 0.6)",
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

const ScopeBreakdownChart: React.FC<Props> = ({
    scopeData,
    title = "Scope Breakdown",
    height = 350,
    year = "2024",
}) => {
    const chartRef = useRef<HTMLDivElement | null>(null);
    const chartInstanceRef = useRef<EChartsType | null>(null);
    const [chartType, setChartType] = useState<"pie" | "bar" | "line" | "area">("pie");

    const hardcodedData: ScopeEmission[] = [
        { name: "Scope 1", value: 0 },
        { name: "Scope 2", value: 0 },
        { name: "Scope 3", value: 0 },
    ];

    const data = scopeData ?? hardcodedData;

    const createOption = useCallback(
        (type: "pie" | "bar" | "line" | "area"): EChartsOption => {
            const baseOption: EChartsOption = {
                backgroundColor: "transparent",
                tooltip: {
                    trigger: type === "pie" ? "item" : "axis",
                    backgroundColor: "rgba(255, 255, 255, 0.95)",
                    borderColor: "rgba(0, 208, 132, 0.3)",
                    borderWidth: 1,
                    textStyle: { color: "#2d3748", fontSize: 13 },
                    padding: [8, 12],
                },
            };

            if (type === "pie") {
                return {
                    ...baseOption,
                    legend: {
                        bottom: 10,
                        itemWidth: 16,
                        itemHeight: 16,
                        itemGap: 12,
                        textStyle: { color: "#4a5568", fontSize: 13 },
                    },
                    series: [
                        {
                            type: "pie",
                            radius: ["55%", "80%"],
                            avoidLabelOverlap: true,
                            emphasis: { focus: "none", scale: false },
                            label: { show: false },
                            labelLine: { show: false },
                            data: data.map((item, index) => ({
                                value: item.value,
                                name: item.name,
                                itemStyle: { color: SCOPE_COLORS[index % SCOPE_COLORS.length] },
                            })),
                        },
                    ],
                };
            }

            if (type === "bar") {
                return {
                    ...baseOption,
                    grid: { left: "8%", right: "8%", bottom: "15%", top: "10%", containLabel: true },
                    xAxis: {
                        type: "category",
                        data: data.map((d) => d.name),
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
                            type: "bar",
                            barMaxWidth: 60,
                            data: data.map((d) => d.value),
                            itemStyle: {
                                color: (params: any) => SCOPE_COLORS[params.dataIndex % SCOPE_COLORS.length],
                                borderRadius: [6, 6, 0, 0],
                            },
                        },
                    ],
                };
            }

            if (type === "line" || type === "area") {
                const isArea = type === "area";
                return {
                    ...baseOption,
                    grid: { left: "8%", right: "8%", bottom: "15%", top: "10%", containLabel: true },
                    xAxis: {
                        type: "category",
                        data: data.map((d) => d.name),
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
                            type: "line",
                            data: data.map((d) => d.value),
                            smooth: true,
                            lineStyle: { color: SCOPE_COLORS[0], width: isArea ? 2 : 3 },
                            itemStyle: { color: SCOPE_COLORS[0] },
                            symbolSize: 8,
                            areaStyle: isArea
                                ? {
                                    color: {
                                        type: "linear",
                                        x: 0, y: 0, x2: 0, y2: 1,
                                        colorStops: [
                                            { offset: 0, color: "rgba(0, 208, 132, 0.4)" },
                                            { offset: 1, color: "rgba(0, 208, 132, 0.02)" },
                                        ],
                                    },
                                }
                                : undefined,
                        },
                    ],
                };
            }

            return baseOption;
        },
        [data]
    );

    // Init chart on mount
    useEffect(() => {
        if (!chartRef.current) return;

        chartInstanceRef.current = echarts.init(chartRef.current);
        chartInstanceRef.current.setOption(createOption(chartType), true);

        const handleResize = () => chartInstanceRef.current?.resize();
        window.addEventListener("resize", handleResize);

        return () => {
            window.removeEventListener("resize", handleResize);
            chartInstanceRef.current?.dispose();
            chartInstanceRef.current = null;
        };
    }, []);

    // Update chart when type or data changes
    useEffect(() => {
        if (chartInstanceRef.current) {
            chartInstanceRef.current.setOption(createOption(chartType), true);
            chartInstanceRef.current.resize();
        }
    }, [chartType, createOption]);

    return (
        <div style={{ width: "100%" }}>
            {/* Header */}
            <div className="row">
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
                        {title} ({year})
                    </h3>
                </div>


                <div className="col-12 d-flex justify-content-end align-items-center gap-2 mt-2 mb-2">
                    <button
                        onClick={() => setChartType("pie")}
                        style={iconButtonStyle(chartType === "pie")}
                        title="Pie Chart"
                    >
                        <i className="fas fa-chart-pie"></i>
                    </button>
                    <button
                        onClick={() => setChartType("bar")}
                        style={iconButtonStyle(chartType === "bar")}
                        title="Bar Chart"
                    >
                        <i className="fas fa-chart-bar"></i>
                    </button>
                    <button
                        onClick={() => setChartType("line")}
                        style={iconButtonStyle(chartType === "line")}
                        title="Line Chart"
                    >
                        <i className="fas fa-chart-line"></i>
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
                        minHeight: `${height}px`,
                        backgroundColor: "#f8fafc",
                        borderRadius: "12px",
                        overflow: "hidden",
                        boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
                        background: "linear-gradient(120deg, #4f8a8b1e, #dedbddac)"
                    }}
                />
            )}
        </div>
    );
};

export default ScopeBreakdownChart;