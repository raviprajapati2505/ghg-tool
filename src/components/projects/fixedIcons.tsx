'use client';
import Link from "next/link";
import React from "react";

interface FixedIconItem {
  label: string;
  href?: string;
  icon?: string;
}

interface FixedIconsProps {
  activeKey: string;
  items: FixedIconItem[];
}

const FixedIcons: React.FC<FixedIconsProps> = ({ activeKey, items }) => {
  return (
    <div className="fixed-icons flex-column align-items-center">
      {items.map((item, index) => {
        if (!item.href) return null; // skip if no href
        return (
          <Link
            href={item.href}
            title={item.label}
            key={index}
            className={`mb-3 text-dark ${activeKey.toLowerCase() === item.label.toLowerCase() ? "active-fixed-icon" : ""}`}
          >
            <i className={item.icon} aria-hidden="true"></i>
          </Link>
        );
      })}
    </div>
  );
};

export default FixedIcons;
