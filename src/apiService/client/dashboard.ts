import callApi from "@/utils/callApi";

const API_URL = "/api/dashboard";

export const getDashboardData = async (data: any = {}) => {
    try {
        data.action = "getDashboardData";
        const response = await callApi(API_URL, data, false, true);
        return response;
    } catch (error) {
        return null;
    }
};
