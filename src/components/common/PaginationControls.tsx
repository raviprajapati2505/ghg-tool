"use client";
import React from "react";

interface Props {
  currentPage: number;
  totalPages: number;
  pageNumbers: number[];
  minPageNumberLimit: number;
  maxPageNumberLimit: number;
  rowsPerPage: number;
  onPageClick: (n: number) => void;
  onPrev: () => void;
  onNext: () => void;
  onFirst: () => void;
  onLast: () => void;
  onRowsPerPageChange: (n: number) => void;
}

export function PaginationControls({
  currentPage,
  totalPages,
  pageNumbers,
  minPageNumberLimit,
  maxPageNumberLimit,
  rowsPerPage,
  onPageClick,
  onPrev,
  onNext,
  onFirst,
  onLast,
  onRowsPerPageChange,
}: Props) {
  if (totalPages <= 1) return null;

  const rowsOptions = [5, 10, 15, 20, 25, 50, 100];

  return (
    <div className="d-flex justify-content-start align-items-center mt-3 flex-wrap gap-2">
      <div className="d-flex align-items-center gap-2">
        <div className="d-flex align-items-center gap-1 px-2 py-1 bg-light border rounded-2" style={{ fontSize: 12 }}>
          <strong style={{ color: "#1a1a2e" }}>{currentPage}</strong>
          <span className="text-muted">/</span>
          <span className="text-muted">{totalPages}</span>
        </div>
        <select
          className="form-select form-select-sm w-auto"
          value={rowsPerPage}
          onChange={(e) => onRowsPerPageChange(Number(e.target.value))}
          style={{ color: "#1a1a2e" }}
        >
          {rowsOptions.map((n) => (
            <option key={n} value={n}>{n} rows</option>
          ))}
        </select>
      </div>
      <nav>
        <ul className="pagination pagination-sm mb-0 gap-1">
          <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
            <button
              className="page-link rounded-2 border"
              onClick={onPrev}
              disabled={currentPage === 1}
              style={{ fontSize: 12, fontWeight: 500, color: "#1a1a2e" }}
            >
              ← Prev
            </button>
          </li>
          {minPageNumberLimit > 1 && (
            <li className="page-item disabled">
              <span className="page-link border-0 text-muted">···</span>
            </li>
          )}
          {pageNumbers
            .filter((n) => n >= minPageNumberLimit && n <= maxPageNumberLimit)
            .map((n) => (
              <li key={n} className={`page-item ${currentPage === n ? "active" : ""}`}>
                <button
                  className="page-link rounded-2"
                  onClick={() => onPageClick(n)}
                  style={{
                    fontSize: 13,
                    minWidth: 32,
                    textAlign: "center",
                    color: currentPage === n ? "#fff" : "#1a1a2e",
                    background: currentPage === n ? "#1a1a2e" : undefined,
                    borderColor: currentPage === n ? "#1a1a2e" : undefined,
                  }}
                >
                  {n}
                </button>
              </li>
            ))}

          {maxPageNumberLimit < totalPages && (
            <li className="page-item disabled">
              <span className="page-link border-0 text-muted">···</span>
            </li>
          )}
          <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
            <button
              className="page-link rounded-2 border"
              onClick={onNext}
              disabled={currentPage === totalPages}
              style={{ fontSize: 12, fontWeight: 500, color: "#1a1a2e" }}
            >
              Next →
            </button>
          </li>

        </ul>
      </nav>
    </div>
  );
}