"use client";
import React, { useState, useRef, useEffect } from "react";
import { getTooltip } from "@/utils/tooltipData";

interface TooltipIconProps {
    subject: string;
    customText?: string;
    position?: "top" | "bottom" | "left" | "right";
    iconClass?: string;
}

export default function TooltipIcon({
    subject,
    customText,
    position = "top",
    iconClass = "fa fa-info-circle",
}: TooltipIconProps) {
    const [visible, setVisible] = useState(false);
    const tooltipRef = useRef<HTMLSpanElement>(null);
    const text = customText || getTooltip(subject);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (tooltipRef.current && !tooltipRef.current.contains(e.target as Node)) {
                setVisible(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    if (!text) return null;

    const positionStyles: Record<string, React.CSSProperties> = {
        top: { bottom: "calc(100% + 8px)", left: "50%", transform: "translateX(-50%)" },
        bottom: { top: "calc(100% + 8px)", left: "50%", transform: "translateX(-50%)" },
        left: { right: "calc(100% + 8px)", top: "50%", transform: "translateY(-50%)" },
        right: { left: "calc(100% + 8px)", top: "50%", transform: "translateY(-50%)" },
    };

    return (
        <span
            ref={tooltipRef}
            className="position-relative d-inline-flex align-items-center ms-1"
        >
            <i
                className={`${iconClass} card-text`}
                style={{ fontSize: 13, cursor: "pointer", opacity: 0.75 }}
                onMouseEnter={() => setVisible(true)}
                onMouseLeave={() => setVisible(false)}
                onClick={() => setVisible((v) => !v)}
            />

            {visible && (
                <div
                    className="card shadow-sm"
                    style={{
                        position: "absolute",
                        ...positionStyles[position],
                        width: 290,
                        zIndex: 9999,
                        pointerEvents: "none",
                        animation: "none",
                    }}
                >
                    <div
                        className="d-flex align-items-center gap-2 px-3 py-2"
                        style={{
                            background: "rgba(104, 25, 73, 0.08)",
                            borderBottom: "1px solid rgba(104, 25, 73, 0.12)",
                            borderRadius: "20px 20px 0 0",
                        }}
                    >
                        <span className="card-icon" style={{ width: 28, height: 28, fontSize: 12, borderRadius: 8, flexShrink: 0 }}>
                            <i className={iconClass} />
                        </span>
                        <strong className="card-title mb-0" style={{ fontSize: 14 }}>
                            {subject}
                        </strong>
                    </div>
                    <div className="px-3 py-2">
                        <span className="d-block mb-0 text-secondary" style={{ fontSize: 14, lineHeight: 1.65 }}>
                            {text}
                        </span>
                    </div>
                </div>
            )}
        </span>
    );
}