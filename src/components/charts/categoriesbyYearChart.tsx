'use client';

import React, { useEffect, useRef, useMemo, use, useState } from "react";
import * as echarts from "echarts";

// TODO: Remove these interfaces and hardcoded data when connecting to real data
// This should match the API response shape from your project result endpoint
interface CategoryEmissions {
  [category: string]: number;
}

interface YearData {
  year: string;
  categories: CategoryEmissions;
}

interface Props {
  // TODO: When connecting real data, pass yearlyData from parent like:
  // yearlyData={[
  //   { year: "2022", categories: year2022CategoriesResult },
  //   { year: "2023", categories: year2023CategoriesResult },
  //   { year: "2024", categories: projectResultInfo?.allCategoriesResult },
  // ].filter(yd => yd.categories != null)}
  yearlyData?: any[];
  // TODO: Pass categoryList from your category master list API
  categoryList?: string[];
  title?: string;
  height?: number;
}

const COLORS = [
  "#00D084", "#00B8D4", "#FFD600",
  "#FF6B6B", "#6A1B9A", "#00897B",
  "#D32F2F", "#1976D2", "#2c542e",
  "#7a6c49", "#d531fa", "#f69606",
  "#511f10"
];

const CategoriesByYearChart: React.FC<Props> = ({
  yearlyData,
  categoryList,
  title = "Emissions Comparison by Category",
  height = 500,
}) => {
  const chartRef = useRef<HTMLDivElement | null>(null);
  const chartInstanceRef = useRef<echarts.ECharts | null>(null);
  const [data, setData] = useState<YearData[]>([]);

  // ============================================================
  // TODO: REPLACE WITH REAL DATA
  // 1. Delete hardcodedCategories and hardcodedData below
  // 2. Change: const categories = hardcodedCategories → const categories = categoryList ?? []
  // 3. Change: const data = hardcodedData      → const data = yearlyData ?? []
  // ============================================================
  const hardcodedCategories: string[] = [
    "Fire Extinguishers",
    "Fugitive Emissions",
    "Mobile Combustion",
    "Stationary Combustion",
    "Electricity Consumption",
    "Purchased Cooling",
    "Purchased Goods and Services",
    "Fuel & Energy Related",
    "Waste Generated",
    "Business Travel",
    "Employee Commute",
  ];

  const hardcodedData: YearData[] = [
    {
      year: "2022",
      categories: {
        "Fire Extinguishers": 5.2,
        "Fugitive Emissions": 12.8,
        "Mobile Combustion": 18.5,
        "Stationary Combustion": 22.3,
        "Electricity Consumption": 35.6,
        "Purchased Cooling": 15.4,
        "Purchased Goods and Services": 45.2,
        "Fuel & Energy Related": 28.7,
        "Waste Generated": 18.9,
        "Business Travel": 32.4,
        "Employee Commute": 25.6,
      },
    },
    {
      year: "2023",
      categories: {
        "Fire Extinguishers": 4.8,
        "Fugitive Emissions": 11.2,
        "Mobile Combustion": 16.8,
        "Stationary Combustion": 20.5,
        "Electricity Consumption": 32.8,
        "Purchased Cooling": 14.2,
        "Purchased Goods and Services": 42.8,
        "Fuel & Energy Related": 26.3,
        "Waste Generated": 17.2,
        "Business Travel": 29.8,
        "Employee Commute": 23.5,
      },
    },
    {
      year: "2024",
      categories: {
        "Fire Extinguishers": 4.2,
        "Fugitive Emissions": 10.5,
        "Mobile Combustion": 15.2,
        "Stationary Combustion": 19.8,
        "Electricity Consumption": 30.5,
        "Purchased Cooling": 13.8,
        "Purchased Goods and Services": 40.5,
        "Fuel & Energy Related": 24.8,
        "Waste Generated": 16.5,
        "Business Travel": 28.2,
        "Employee Commute": 22.8,
      },
    },
  ];

  useEffect(() => {

    if (yearlyData && yearlyData.length > 0) {
      for (let i = 0; i < yearlyData.length; i++) {

        const year = yearlyData[i]?.year || 0;
        const CategoriesResult = yearlyData[i]?.allCategoriesResult || [];
        let categories: any = {};

        for (let j = 0; j < CategoriesResult.length; j++) {
          const category = CategoriesResult[j]?.name || "";
          const value = CategoriesResult[j]?.TotalResult || 0;

          categories[category] = value;

        }

        const value = yearlyData[i]?.totalProjectEmissionsmTCO2e || 0;
        setData((prevData) => [...prevData, { year, categories }]);
      }
    }

  }, [yearlyData]);
  const categories = categoryList ?? hardcodedCategories;
  // const data = yearlyData ?? hardcodedData;

  const years = useMemo(() => data.map((d) => d.year), [data]);

  const series = useMemo(() =>
    years.map((year, index) => ({
      name: year,
      type: "bar",
      barMaxWidth: 35,
      data: categories.map((category) => {
        const yearObj = data.find((d) => d.year === year);
        return yearObj?.categories?.[category] ?? 0;
      }),
      itemStyle: {
        color: COLORS[index % COLORS.length],
        borderRadius: [6, 6, 0, 0],
      },
    })),
    [years, categories, data]);

  useEffect(() => {
    if (!chartRef.current) return;

    if (!chartInstanceRef.current) {
      chartInstanceRef.current = echarts.init(chartRef.current);
    }

    const chartInstance = chartInstanceRef.current;

    const option: echarts.EChartsOption = {
      backgroundColor: "transparent",

      title: {
        text: title,
        left: "left",
        top: 10,
        textStyle: {
          fontSize: 16,
          fontWeight: 600,
          color: "#2d3748",
        },
      },

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
      },

      grid: {
        left: "3%",
        right: "4%",
        bottom: 80,
        top: 110,
        containLabel: true,
      },

      xAxis: {
        type: "category",
        data: categories,
        axisLabel: {
          interval: 0,
          rotate: 15,
          fontSize: 12,
        },
        axisLine: { show: false },
        axisTick: { show: false },
      },

      yAxis: {
        type: "value",
        name: "Emissions (tCO₂e)",
        nameTextStyle: { color: "#718096", fontSize: 12 },
        axisLabel: { color: "#718096", fontSize: 12 },
        splitLine: { lineStyle: { color: "rgba(229, 231, 235, 0.5)" } },
        axisLine: { show: false },
      },

      series: series as any,

      animationDuration: 800,
    };

    chartInstance.setOption(option, true);

    const handleResize = () => chartInstance.resize();
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, [series, title]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      chartInstanceRef.current?.dispose();
      chartInstanceRef.current = null;
    };
  }, []);

  return (
    <div style={{ width: "100%" }}>
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
          }}
        />
      )}
    </div>
  );
};

export default CategoriesByYearChart;