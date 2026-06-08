"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import TooltipDataList from "./tooltip_data_list";
import "../../../scss/customTooltip.scss";

type TooltipItem = {
  message: string | null;
  link: string | null;
};

type CustomTooltipProps = {
  tooltipKey: string;
};

const CustomTooltip = ({ tooltipKey }: CustomTooltipProps) => {
  const [isTop, setIsTop] = useState<boolean>(true);
  const [isLeft, setIsLeft] = useState<boolean>(true);
  const tooltipRef = useRef<HTMLDivElement | null>(null);
  const iconRef = useRef<HTMLSpanElement | null>(null);
  const [tooltip, setTooltip] = useState<TooltipItem | null>(null);

  const updatePosition = () => {
    if (iconRef.current && tooltipRef.current) {
      const iconRect = iconRef.current.getBoundingClientRect();
      const tooltipRect = tooltipRef.current.getBoundingClientRect();
      const spaceAbove = iconRect.top;
      const spaceRight = iconRect.right - tooltipRect.width;
      setIsTop(spaceAbove > tooltipRect.height + 130);

      setIsLeft(spaceRight < tooltipRect.width+ 20);
    }
  };

  useEffect(() => {
    setTooltip(TooltipDataList({ tooltipKey }));

    window.addEventListener("resize", updatePosition);
    window.addEventListener("scroll", updatePosition);

    updatePosition();

    return () => {
      window.removeEventListener("resize", updatePosition);
      window.removeEventListener("scroll", updatePosition);
    };
  }, [tooltipKey]);

  return (
    <>
      {tooltip?.message && (
        <span className="tooltip-wrapper">
          <i ref={iconRef} className="fa fa-info-circle info-icon"></i>
          <span
            ref={tooltipRef}
            className={`tooltip-text ${isTop ? "top" : "bottom"} ${isLeft ? "left" : "right"
              }`}
          >
            <span
              className={`tooltip-arrow ${isTop ? "bottom-arrow" : "top-arrow"
                }`}
            ></span>

            {tooltip?.message || ""}{" "}

            {tooltip?.link && (
              <Link
                className="tooltip-link"
                target="_blank"
                href={tooltip.link}
              >
                See More…
              </Link>
            )}
          </span>
        </span>
      )}
    </>
  );
};

export default CustomTooltip;