import { getMDBData, insertManyMDBData } from "@/db/mongoQueries";
import { businessTravelCountryList } from "@/utils/emissionFactor";
const modal = "airports_data";

export const getAirportsData = async (data: Record<string, any>, authUser: any) => {
    try {
        const where = {
            $or: [{ is_deleted: { $ne: true } }, { is_deleted: { $exists: false } }]
        };

        const response = await getMDBData(modal, where);
        if (!response) {
            return {
                message: "Airports data not found.",
                status: 404,
                data: [],
            };
        }

        return {
            message: "Airports data fetched successfully.",
            status: 200,
            data: response,
        };

    } catch (error) {
        return {
            message: "Something went wrong while fetching airports data.",
            status: 400,
            data: [],
        };
    }
};