'use client';
import React, { useEffect, useRef } from "react";
import * as echarts from "echarts";

interface Category {
    name: string;
    TotalResult: string;
}

interface Props {
    categoriesResult?: Category[];
}

const DonutChart: React.FC<Props> = ({ categoriesResult = [] }) => {
    const chartRef = useRef<HTMLDivElement>(null);
    const chartInstance = useRef<echarts.ECharts | null>(null);

    useEffect(() => {
        if (!chartRef.current) return;

        chartInstance.current = echarts.init(chartRef.current);

        const data = categoriesResult.length
            ? categoriesResult.map(item => ({
                name: item.name,
                value: parseFloat(item.TotalResult) || 0
            }))
            : [{ name: "No Data", value: 1 }];

        // Calculate total value
        const totalValue = data.reduce((sum, item) => sum + item.value, 0);

        const option: echarts.EChartsOption = {
            tooltip: {
                trigger: "item",
                formatter: "{b} <br/>{c} ({d}%)"
            },
            //   legend: {
            //     orient: "vertical",
            //     left: "left",
            //     textStyle: { fontSize: 12 }
            //   },
            series: [
                {
                    name: "Emissions",
                    type: "pie",
                    radius: ["50%", "75%"], // donut
                    center: ["50%", "50%"],
                    avoidLabelOverlap: false,
                    itemStyle: {
                        borderRadius: 6,
                        borderColor: "#fff",
                        borderWidth: 2
                    },
                    label: {
                        show: true,
                        position: "center",
                        formatter: `{total|\nOverall Emissions\n(MTCO2e)}`,
                        rich: {
                            total: {
                                fontSize: 12,
                                fontWeight: "bold",
                                color: "#333",
                                lineHeight: 25,
                                align: "center"
                            }
                        }
                    },
                    emphasis: {
                        label: {
                            show: false,
                            fontSize: 18,
                            fontWeight: "bold"
                        }
                    },
                    labelLine: { show: false },
                    data
                }
            ]
        };

        chartInstance.current.setOption(option);

        const handleResize = () => chartInstance.current?.resize();
        window.addEventListener("resize", handleResize);

        return () => {
            window.removeEventListener("resize", handleResize);
            chartInstance.current?.dispose();
        };
    }, [categoriesResult]);

    return (
        <div className="card shadow-sm border-0" style={{ borderRadius: "1rem" }}>
            <div className="card-body">
                <div ref={chartRef} style={{ height: 268, width: "100%" }} />
            </div>
        </div>
    );
};

export default DonutChart;