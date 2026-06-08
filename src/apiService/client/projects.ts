import callApi from "@/utils/callApi";

const API_URL = "/api/projects";

export const getProjects = async (data: any = {}) => {
    try {
        data.action = "getProjects";
        const response = await callApi(API_URL, data, false, true);
        return response;
    } catch (error) {
        return null;
    }
};

export const getProjectDetails = async (data: any = {}) => {
    try {
        data.action = "getProjectDetails";
        const response = await callApi(API_URL, data, false, true);
        return response;
    } catch (error) {
        return null;
    }
};

export const addProject = async (data: any = {}) => {
    try {
        data.action = "addProject";
        const response = await callApi(API_URL, data, true, true);
        return response;
    } catch (error) {
        return null;
    }
};

export const updateProject = async (data: any = {}) => {
    try {
        data.action = "updateProject";
        const response = await callApi(API_URL, data, true, true);
        return response;
    } catch (error) {
        return null;
    }
};

export const cancelProject = async (data: any = {}) => {
    try {
        data.action = "cancelProject";
        const response = await callApi(API_URL, data, true, true);
        return response;
    } catch (error) {
        return null;
    }
};

export const restoreProject = async (data: any = {}) => {
    try {
        data.action = "restoreProject";
        const response = await callApi(API_URL, data, true, true);
        return response;
    } catch (error) {
        return null;
    }
};

export const getProjectResult = async (data: any = {}) => {
    try {
        data.action = "getProjectResult";
        const response = await callApi(API_URL, data, true, true);
        return response;
    } catch (error) {
        return null;
    }
};
