import callApi from "@/utils/callApi";

const API_URL = "/api/project-categories";

export const getProjectCategoryDetails = async (data: any = {}) => {
    try {
        data.action = "getProjectCategoryDetails";
        const response = await callApi(API_URL, data, false, true);
        return response;
    } catch (error) {
        return null;
    }
};


export const updateProjectCategory = async (data: any = {}) => {
    try {
        data.action = "updateProjectCategory";
        const response = await callApi(API_URL, data, true, true);
        return response;
    } catch (error) {
        return null;
    }
};

export const uploadCategoryFiles = async (data: Record<string, any> | FormData) => {
    try {
        return await callApi("/api/upload-category-files", data, true, true, { headers: { "Content-Type": "multipart/form-data" } });
    } catch (error) {
        return [];
    }
};

export const getCategoryFiles = async (data: any = {}) => {
    try {
        data.action = "getCategoryFiles";
        const response = await callApi(API_URL, data, false, true);
        return response;
    } catch (error) {
        return null;
    }
};
export const updateCategoryFiles = async (data: any = {}) => {
    try {
        data.action = "updateCategoryFiles";
        const response = await callApi(API_URL, data, true, true);
        return response;
    } catch (error) {
        return null;
    }
};

export const viewCategoryFile = async (data: any = {}) => {
    try {

        const response = await callApi("/api/view-file", data, true, true, {
            responseType: "blob"
        });
        return response;
    } catch (error) {
        return null;
    }
};

export const assignUsersToCategory = async (data: any) => {
    try {
        data.action = "assignUsersToCategory";
        const response = await callApi(API_URL, data, true, true);
        return response;
    } catch (error) {
        return null;
    }
};

export const getCategoryAssignedUsers = async (data: any) => {
    try {
        data.action = "getCategoryAssignedUsers";
        const response = await callApi(API_URL, data, false, true);
        return response;
    } catch (error) {
        return null;
    }
};

export const getCategoryDetails = async (data: any) => {
    try {
        data.action = "getCategoryDetails";
        const response = await callApi(API_URL, data, false, true);
        return response;
    } catch (error) {
        return null;
    }
};

export const getCategoryAuditLog = async (data: any) => {
    try {
        data.action = "getCategoryAuditLog";
        const response = await callApi(API_URL, data, false, true);
        return response;
    } catch (error) {
        return null;
    }
};

export const updateCategoryStatus = async (data: any) => {
    try {
        data.action = "updateCategoryStatus";
        const response = await callApi(API_URL, data, true, true);
        return response;
    } catch (error) {
        return null;
    }
};

