'use client';
import React, { useMemo } from "react";

interface Category {
  name: string;
  TotalResult: string;
}

interface Props {
  categoriesResult: Category[];
}

const TopFiveContributorsCard: React.FC<Props> = ({ categoriesResult }) => {

  const topFive = useMemo(() => {
    if (!categoriesResult?.length) return [];

    // Convert to numbers and sort descending
    const sorted = [...categoriesResult]
      .map(item => ({
        name: item.name,
        value: parseFloat(item.TotalResult) || 0
      }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 5);

    if (!sorted.length) return [];

    const topValue = sorted[0].value;
    const minAllowed = topValue - (topValue * 0.05); // 5% below top

    return sorted.map(item => ({
      ...item,
      percentage: (item.value / topValue) * 100,
      isMinRange: item.value >= minAllowed
    }));

  }, [categoriesResult]);

  return (
    <div
      className="card border-2 shadow-sm position-relative overflow-hidden"
      style={{
        background: "linear-gradient(120deg, #4f8a8b68, #dedbddac)",
        // borderColor: "#9f738d",
        borderRadius: "1rem",
      }}
    >
      <div className="card-body p-4" style={{ height: 300, width: "100%" }} >

        {topFive.map((item, index) => (
          <div key={index} className="mb-3">

            {/* Label Row */}
            <div className="d-flex justify-content-between small mb-1">
              <span className="text-dark fw-medium">
                {item.name}{" "}(MTCO2e)
              </span>
              <span className="fw-semibold">
                {item.value.toFixed(2)}
              </span>
            </div>

            {/* Progress Line */}
            <div className="progress" style={{ height: "8px" }}>
              <div
                className={`progress-bar ${
                  item.isMinRange ? "bg-success" : "bg-primary"
                }`}
                role="progressbar"
                style={{ width: `${item.percentage}%` }}
              />
            </div>

          </div>
        ))}

      </div>
    </div>
  );
};

export default TopFiveContributorsCard;