import { saveMDBData, updateMDBData, aggregateWithJoins, getMDBData, getMDBSingleData, insertManyMDBData } from "@/db/mongoQueries";
import { calculateProjectResult } from "@/helpers/server/calculateProjectResult";
import { formatDateTime } from "@/utils/function";
import { Roles } from "@/utils/roleAndPermission";
import { validateProjectDataForReport } from "@/utils/validateProjectDataForReport";

const modal = "projects";

export const getDashboardData = async (data: Record<string, any>, authUser: any) => {
    try {


        const where = {
            $or: [{ is_deleted: { $ne: true } }, { is_deleted: { $exists: false } }]
        };

        const response = await aggregateWithJoins({
            collectionName: modal,
            where,
            joins: [
                {
                    from: "project_categories",
                    localField: "_id",
                    foreignField: "project_id",
                    as: "categoriesData",
                    type: "multiple",
                    projection: { category_id: 1, data: 1 },
                    where: { $or: [{ is_deleted: { $ne: true } }, { is_deleted: { $exists: false } }] },
                    childLookup: {
                        from: "categories",
                        localField: "category_id",
                        foreignField: "_id",
                        as: "categoryDetail",
                        projection: { name: 1, scope: 1, type: 1, icon: 1 },
                        where: { $or: [{ is_deleted: { $ne: true } }, { is_deleted: { $exists: false } }] },
                    },
                },
            ],
        });
        if (response.length === 0) {
            return {
                message: "Project not found.",
                status: 404,
                data: [],
            };
        }
        const allProjectsData: any = [];
        const allYearsTopCategoriesData: any[] = [];
        for (let i = 0; i < response.length; i++) {
            const project = response[i] || {};
            const categoriesData = project?.categoriesData || [];
            if (!categoriesData || categoriesData.length === 0) {
                continue;
            }
            const validCategoriesData = validateProjectDataForReport(categoriesData);
            if (validCategoriesData && Object.keys(validCategoriesData).length > 0) {
                continue;
            }
            const result = await calculateProjectResult(categoriesData);

            const projectresultData = result?.ProjectResultInfo || {};

            if (result) {
                allProjectsData.push({
                    year: project?.year,
                    name: project?.name,
                    type: project?.type,
                    totalProjectEmissionsmTCO2e: projectresultData?.totalProjectEmissionsmTCO2e || 0,
                    scope1TotalEmissionsmTCO2e: projectresultData?.scope1TotalEmissionsmTCO2e || 0,
                    scope2TotalEmissionsmTCO2e: projectresultData?.scope2TotalEmissionsmTCO2e || 0,
                    scope3TotalEmissionsmTCO2e: projectresultData?.scope3TotalEmissionsmTCO2e || 0,
                    allCategoriesResult: projectresultData?.allCategoriesResult || [],
                })

                const topCategory = projectresultData?.allCategoriesResult.reduce((max: any, category: any) =>
                    Number(category.TotalResult) > Number(max.TotalResult) ? category : max
                    , projectresultData?.allCategoriesResult[0]);

                allYearsTopCategoriesData.push({
                    ...topCategory,
                    year: project?.year
                });

            }
        }

        const yearlyAscendingData = [...allProjectsData].sort(
            (a, b) => Number(a.year) - Number(b.year)
        );
        const yearlyDescendingData = [...allProjectsData].sort(
            (a, b) => Number(b.year) - Number(a.year)
        );

        const allYearsTopCategoriesDescendingData = [...allYearsTopCategoriesData].sort(
            (a, b) => Number(b.year) - Number(a.year)
        );

        const yearlyScopeComparisonData: any = [];
        const yearlyTotalEmissionsData: any = [];
        const topFiveContributorsData: any = [];
        for (let i = 0; i < yearlyDescendingData.length; i++) {
            const project = yearlyDescendingData[i] || {};
            const projectresultData = project || {};

            yearlyTotalEmissionsData.push({
                year: project?.year,
                value: projectresultData?.totalProjectEmissionsmTCO2e || 0,
            })

            yearlyScopeComparisonData.push({
                year: project?.year,
                scope1: projectresultData?.scope1TotalEmissionsmTCO2e || 0,
                scope2: projectresultData?.scope2TotalEmissionsmTCO2e || 0,
                scope3: projectresultData?.scope3TotalEmissionsmTCO2e || 0,
            })


        }



        return {
            message: "Project result calculated successfully.",
            status: 200,
            data: {
                yearlyScopeComparisonData,
                yearlyAscendingData,
                yearlyTotalEmissionsData,
                allYearsTopCategoriesDescendingData,
            },
        };

    } catch (error) {
        return {
            message: "Something went wrong while updating project.",
            status: 400,
            data: [],
        };
    }
};