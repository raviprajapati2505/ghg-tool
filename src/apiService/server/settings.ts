import { getMDBData, updateMDBData } from "@/db/mongoQueries";


export const getCategoriesData = async (data: Record<string, any>, authUser: any) => {
    try {
        const where = {
            $or: [{ is_deleted: { $ne: true } }, { is_deleted: { $exists: false } }]
        };

        const response = await getMDBData("categories", where);
        if (!response) {
            return {
                message: "Categories data not found.",
                status: 404,
                data: [],
            };
        }
        return {
            message: "Categories data fetched successfully.",
            status: 200,
            data: response,
        };

    } catch (error) {
        return {
            message: "Something went wrong while fetching categories data.",
            status: 400,
            data: [],
        };
    }
};