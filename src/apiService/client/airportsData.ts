import callApi from "@/utils/callApi";

const API_URL = "/api/airports-data";

export const getAirportsData = async (data: any = {}) => {
    try {
        data.action = "getAirportsData";
        const response = await callApi(API_URL, data, false, true);
        return response;
    } catch (error) {
        return null;
    }
};
