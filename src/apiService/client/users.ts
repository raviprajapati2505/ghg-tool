import callApi from "@/utils/callApi";

const API_URL = "/api/users";

export const getUsers = async (data: any = {}) => {
    try {
        data.action = "getUsers";
        const response = await callApi(API_URL, data, false, true);
        return response;
    } catch (error) {
        return null;
    }
};

export const getUserDetails = async (data: any = {}) => {
    try {
        data.action = "getUserDetails";
        const response = await callApi(API_URL, data, false, true);
        return response;
    } catch (error) {
        return null;
    }
};

export const addUser = async (data: any) => {
    try {
        data.action = "addUser";
        const response = await callApi(API_URL, data, true, true);
        return response.data;
    } catch (error) {
        return null;
    }
};

export const updateUser = async (data: any) => {
    try {
        data.action = "updateUser";
        const response = await callApi(API_URL, data, true, true);
        return response.data;
    } catch (error) {
        return null;
    }
};

export const toggleUserStatus = async (data: any) => {
    try {
        data.action = "toggleUserStatus";
        const response = await callApi(API_URL, data, true, true);
        return response;
    } catch (error) {
        return null;
    }
};

export const getAssignableUsers = async (data: any = {}) => {
    try {
        data.action = "getAssignableUsers";
        const response = await callApi(API_URL, data, false, true);
        return response;
    } catch (error) {
        return null;
    }
};