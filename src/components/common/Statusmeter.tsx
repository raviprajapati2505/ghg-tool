"use client";
import React, { useState } from "react";

type ReviewStatus = "approved" | "rejected" | "pending" | "cancel";

const STATUS_CONFIG: Record<ReviewStatus, { color: string; label: string; order: number }> = {
    approved: { color: "#22c55e", label: "Approved", order: 0 },
    pending: { color: "#f59e0b", label: "Pending", order: 1 },
    cancel: { color: "#64748b", label: "Cancelled", order: 2 },
    rejected: { color: "#ef4444", label: "Rejected", order: 3 },
};

function getDominantStatus(counts: Record<string, number>): ReviewStatus {
    const priority: ReviewStatus[] = ["rejected", "pending", "cancel", "approved"];
    for (const status of priority) {
        if (counts[status] > 0) return status;
    }
    return "cancel";
}

interface StatusGaugeMeterProps {
    data: { review_status?: string }[];
}

export default function StatusGaugeMeter({ data }: StatusGaugeMeterProps) {
    const [hovered, setHovered] = useState(false);
    const counts: Record<string, number> = { approved: 0, rejected: 0, pending: 0, cancel: 0 };
    data?.forEach((entry) => {
        const s = (entry.review_status || "cancel").toLowerCase();
        if (counts[s] !== undefined) counts[s]++;
        else counts["cancel"]++;
    });

    const total = Object.values(counts).reduce((a, b) => a + b, 0);
    const dominant = getDominantStatus(counts);
    const dominantColor = STATUS_CONFIG[dominant].color;
    const cx = 20, cy = 20, r = 14;
    const circumference = Math.PI * r;
    let segments: { color: string; offset: number; dash: number }[] = [];
    let accumulated = 0;

    if (total > 0) {
        (Object.keys(STATUS_CONFIG) as ReviewStatus[])
            .sort((a, b) => STATUS_CONFIG[a].order - STATUS_CONFIG[b].order)
            .forEach((status) => {
                const pct = counts[status] / total;
                const dash = pct * circumference;
                segments.push({
                    color: STATUS_CONFIG[status].color,
                    offset: accumulated,
                    dash,
                });
                accumulated += dash;
            });
    }

    return (
        <div
            style={{ position: "relative", zIndex: 0 }}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
        >
            <svg
                width={40}
                height={24}
                viewBox="0 0 40 24"
                style={{ cursor: "pointer", filter: `drop-shadow(0 0 4px ${dominantColor}88)` }}
            >
                <path
                    d={`M 6,20 A 14,14 0 0,1 34,20`}
                    fill="none"
                    stroke="#e2e8f0"
                    strokeWidth={4}
                    strokeLinecap="round"
                />
                {total > 0 && segments.map((seg, i) => (
                    seg.dash > 0.01 && (
                        <path
                            key={i}
                            d={`M 6,20 A 14,14 0 0,1 34,20`}
                            fill="none"
                            stroke={seg.color}
                            strokeWidth={4}
                            strokeLinecap="butt"
                            strokeDasharray={`${seg.dash} ${circumference}`}
                            strokeDashoffset={-seg.offset}
                            pathLength={circumference}
                        />
                    )
                ))}
                <circle cx={20} cy={20} r={2.5} fill={dominantColor} />
            </svg>
            {hovered && (
                <div
                    className="card shadow-sm position-absolute"
                    style={{
                        bottom: "calc(100% + 8px)",
                        right: 0,
                        width: 160,
                        padding: "10px 12px",
                        zIndex: 9999,
                        animation: "none",
                        minWidth: 150,
                    }}
                >
                    <p className="mb-2" style={{ fontSize: 11, fontWeight: 700, color: "#681949" }}>
                        Summary
                    </p>
                    {(Object.keys(STATUS_CONFIG) as ReviewStatus[]).map((status) => (
                        <div key={status} className="d-flex align-items-center justify-content-between mb-1">
                            <div className="d-flex align-items-center gap-1">
                                <span
                                    style={{
                                        width: 8,
                                        height: 8,
                                        borderRadius: "50%",
                                        background: STATUS_CONFIG[status].color,
                                        display: "inline-block",
                                        flexShrink: 0,
                                    }}
                                />
                                <span style={{ fontSize: 11, color: "#64748b" }}>
                                    {STATUS_CONFIG[status].label}
                                </span>
                            </div>
                            <span style={{ fontSize: 11, fontWeight: 700, color: "#1e293b" }}>
                                {counts[status]}
                            </span>
                        </div>
                    ))}
                    <div
                        style={{
                            borderTop: "1px solid rgba(104,25,73,0.12)",
                            marginTop: 6,
                            paddingTop: 6,
                            display: "flex",
                            justifyContent: "space-between",
                        }}
                    >
                        <span style={{ fontSize: 11, color: "#64748b" }}>Total</span>
                        <span style={{ fontSize: 11, fontWeight: 700, color: "#681949" }}>{total}</span>
                    </div>
                </div>
            )}
        </div>
    );
}