export const validateProjectDataForReport = (projectData: any) => {
    const projectCategories = Array.isArray(projectData) ? projectData : projectData?.projectCategories || [];
    const validationErrors: Record<string, string> = {};

    if (!projectCategories || projectCategories.length === 0) {
        validationErrors["Project categories"] = "Project categories are missing.";
        return validationErrors;
    }

    for (const category of projectCategories) {
        const categoryData = category?.data || [];
        const categoryDetail = category?.categoryDetail?.[0] || {};
        const categoryName = categoryDetail?.name || "Category";

        if (!categoryData || categoryData.length === 0) {
            validationErrors[categoryName] = `${categoryName} data is missing.`;
            continue;
        }

        const totalUnapproved = categoryData.filter(
            (entry: any) => entry?.review_status !== "approved"
        ).length;

        if (totalUnapproved > 0) {
            validationErrors[categoryName] = `${totalUnapproved} entr${totalUnapproved === 1 ? "y is" : "ies are"}  unapproved.`;
        }
    }

    return validationErrors;
};