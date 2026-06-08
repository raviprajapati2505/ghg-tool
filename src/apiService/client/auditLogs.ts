import callApi from "@/utils/callApi";

const API_URL = "/api/audit-logs";
export interface AuditLogFilters {
    page?: number;
    limit?: number;
    userId?: string;
    actionType?: string;
    dateFrom?: string;
    dateTo?: string;
    search?: string;
}

export const getAuditLogs = async (data: any = {}) => {
    try {
        data.action = "getAuditLogs";
        const response = await callApi(API_URL, data, false, true);
        return response;
    } catch (error) {
        return null;
    }
};

export const addAuditLog = async (logData: any, authUser: any) => {
    try {
        const payload = {
            ...logData,
            action: "addAuditLog",
            authUser: authUser 
        };
        const response = await callApi(API_URL, payload, false, true);
        return response;
    } catch (error) {
        return null;
    }
};