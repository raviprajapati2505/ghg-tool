import { useState, useMemo, useEffect } from "react";

export function usePagination<T>(
    data: T[] | undefined | null,
    initialRowsPerPage = 10,
    pageNumberLimit = 5
) {
    const safeData = Array.isArray(data) ? data : [];

    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(initialRowsPerPage);
    const [maxPageNumberLimit, setMaxPageNumberLimit] = useState(pageNumberLimit);
    const [minPageNumberLimit, setMinPageNumberLimit] = useState(1);

    const totalPages = Math.max(1, Math.ceil(safeData.length / rowsPerPage));

    useEffect(() => {
        if (currentPage > totalPages) {
            setCurrentPage(totalPages);
        }
    }, [totalPages, currentPage]);

    const startIndex = (currentPage - 1) * rowsPerPage;

    const currentPageData = useMemo(() => {
        return safeData.slice(startIndex, startIndex + rowsPerPage);
    }, [safeData, startIndex, rowsPerPage]);

    const pageNumbers = useMemo(
        () => Array.from({ length: totalPages }, (_, i) => i + 1),
        [totalPages]
    );

    const handleClick = (page: number) => {
        if (page < 1 || page > totalPages) return;

        // Make sure the clicked page is visible
        if (page > maxPageNumberLimit) {
            setMaxPageNumberLimit(page);
            setMinPageNumberLimit(page - pageNumberLimit + 1);
        } else if (page < minPageNumberLimit) {
            setMinPageNumberLimit(page);
            setMaxPageNumberLimit(page + pageNumberLimit - 1);
        }

        setCurrentPage(page);
    };

    const handlePrev = () => handleClick(currentPage - 1);
    const handleNext = () => handleClick(currentPage + 1);
    const handleFirst = () => {
        setMinPageNumberLimit(1);
        setMaxPageNumberLimit(pageNumberLimit);
        setCurrentPage(1);
    };

    const handleLast = () => {
        setMaxPageNumberLimit(totalPages);
        setMinPageNumberLimit(Math.max(1, totalPages - pageNumberLimit + 1));
        setCurrentPage(totalPages);
    };

    const handleRowsPerPageChange = (value: number) => {
        setRowsPerPage(value);
        setCurrentPage(1); // reset to first page
        setMinPageNumberLimit(1);
        setMaxPageNumberLimit(pageNumberLimit);
    };

    return {
        currentPageData,
        startIndex,
        currentPage,
        totalPages,
        pageNumbers,
        minPageNumberLimit,
        maxPageNumberLimit,
        rowsPerPage,
        handleClick,
        handlePrev,
        handleNext,
        handleFirst,
        handleLast,
        handleRowsPerPageChange,
    };
}