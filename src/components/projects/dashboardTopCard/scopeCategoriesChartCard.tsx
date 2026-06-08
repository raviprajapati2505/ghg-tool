'use client';
import React, { useEffect, useRef } from "react";
import * as echarts from "echarts";

interface Category {
  name: string;
  TotalResult: number;
}

interface Props {
  categoryResult?: Category[];
  title?: string;
}

const ScopeCategoriesChartCard: React.FC<Props> = ({
  categoryResult = [],
  title
}) => {
  const chartRef = useRef<HTMLDivElement>(null);
  const chartInstance = useRef<echarts.ECharts | null>(null);

  useEffect(() => {
    if (!chartRef.current) return;

    // Dispose previous instance to avoid duplication
    if (chartInstance.current) {
      chartInstance.current.dispose();
    }

    chartInstance.current = echarts.init(chartRef.current);

    const names = categoryResult.map(item => item.name);
    const values = categoryResult.map(item => Number(item.TotalResult) || 0);

    // Generate color shades from base color family
    const generateColors = (count: number) => {
      const colors: string[] = [
        "#7d1e57e0",
        "#623c53e0",
        "#ce057ee0",
        "#48355fe0",
        "#3e102be0",
        "#73433be0",
        "#5e8073e0",
        "#232a21e0",
        "#8c1a4fe0",
        "#2c542ee0",
        "#7a6c49e0",
      ];
      return colors;
    };

    const colors = generateColors(values.length);

    const option: echarts.EChartsOption = {
      tooltip: {
        trigger: "axis"
      },
      grid: {
        left: "5%",
        right: "5%",
        bottom: "12%",
        containLabel: true
      },
      xAxis: {
        type: "category",
        data: names,
        axisLabel: {
          rotate: 45,
          fontSize: 11
        }
      },
      yAxis: {
        type: "value",
        name: "MTCO2e"
      },
      series: [
        {
          name: "Emissions",
          type: "bar",
          barWidth: "25%",
          label: {
            show: true,
            position: "top",
            formatter: (params: any) => params.value.toFixed(3)
          },
          data: values.map((val, index) => ({
            value: val,
            itemStyle: {
              borderRadius: [6, 6, 0, 0],
              color: colors[index]
            }
          }))
        }
      ]
    };

    chartInstance.current.setOption(option);

    const handleResize = () => {
      chartInstance.current?.resize();
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      chartInstance.current?.dispose();
    };
  }, [categoryResult]);

  return (
    <div
      className="card shadow-sm border-1 bg-white"
      style={{ borderRadius: "1rem" }}
    >
      <div className="card-body">
        {title && <h5 className="fw-semibold mb-3">{title}</h5>}
        <div
          ref={chartRef}
          style={{ height: 450, width: "100%" }}
        />
      </div>
    </div>
  );
};

export default ScopeCategoriesChartCard;