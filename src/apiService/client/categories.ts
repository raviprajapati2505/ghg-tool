import callApi from "@/utils/callApi";

const API_URL = "/api/categories";

export const getCategories = async (data: any = {}) => {
    try {
        data.action = "getCategories";
        const response = await callApi(API_URL, data, false, true);
        return response;
    } catch (error) {
        return null;
    }
};

export const getAllCategories = async (data: any = {}) => {
    try {
        data.action = "getAllCategories";
        const response = await callApi(API_URL, data, false, true);
        return response;
    } catch (error) {
        return null;
    }
};

export const addCategory = async (data: any) => {
    try {
        data.action = "addCategory";
        const response = await callApi(API_URL, data, true, true);
        return response;
    } catch (error) {
        return null;
    }
};

export const updateCategory = async (data: any) => {
    try {
        data.action = "updateCategory";
        const response = await callApi(API_URL, data, true, true);
        return response;
    } catch (error) {
        return null;
    }
};



export const getBatchCategoryCounts = async (data: any) => {
    try {
        const response = await callApi("/api/categories/batchCounts", data, false, true);
        return response;
    } catch (error) {
        return null;
    }
};