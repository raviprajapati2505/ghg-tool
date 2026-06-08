import { aggregateWithJoins, saveMDBData } from "@/db/mongoQueries";
import { act } from "react";
const modal = "audit_logs";
export const getAuditLogs = async (data: Record<string, any>, authUser: any) => {
    try {
        const authRoleId = authUser?.role_id?.toString() ?? null;
        const authUserId = authUser?._id?.toString() ?? null;

        const where: Record<string, any> = {};

        if (data.userId) {
            where.user_id = data.userId;
        }

        if (data.actionType) {
            where.action_type = data.actionType;
        }

        if (data.dateFrom || data.dateTo) {
            where.timestamp = {};
            if (data.dateFrom) where.timestamp.$gte = new Date(data.dateFrom);
            if (data.dateTo) {
                const endOfDay = new Date(data.dateTo);
                endOfDay.setHours(23, 59, 59, 999);
                where.timestamp.$lte = endOfDay;
            }
        }

        if (data.search) {
            const searchRegex = { $regex: data.search.trim(), $options: "i" };
            where.$or = [
                { description: searchRegex },
                { user_name: searchRegex },
                { action_type: searchRegex },
            ];
        }

        const allLogs = await aggregateWithJoins({
            collectionName: modal,
            where,
            joins: [
                {
                    from: "users",
                    localField: "action_by",
                    foreignField: "_id",
                    as: "user",
                    type: "single",
                    projection: { name: 1, email: 1, role_id: 1 },
                },
            ],
            sort: { column: "timestamp", order: -1 },
        });

        if (allLogs.length < 1) return {
            message: "No audit logs found.",
            status: 200,
            data: [],
        };
        return {
            message: "Audit logs retrieved successfully.",
            status: 200,
            data: allLogs,
        };

    } catch (error) {
        return {
            message: "Something went wrong while retrieving audit logs.",
            status: 400,
            data: {},
        };
    }
};
export const addAuditLog = async (data: Record<string, any>, authUser: any) => {
    try {
        const authRoleId = authUser?.role_id?.toString() ?? null;
        const authUserId = authUser?._id?.toString() ?? null;

        if (authUserId === null) {
            return {
                message: "Unauthorized user.",
                status: 401,
                data: {},
            };
        }

        const logData = {
            action_by: authUserId,
            timestamp: new Date(),
            ...data,
        };
        await saveMDBData(modal, logData);
        return {
            message: "Audit log added successfully.",
            status: 200,
            data: {}
        };

    } catch (error) {
        return {
            message: "Something went wrong while adding audit log.",
            status: 400,
            data: {},
        };
    }
};
export const deleteAuditLog = async (data: Record<string, any>, authUser: any) => {
    try {
        const authRoleId = authUser?.role_id?.toString() ?? null;
        const authUserId = authUser?._id?.toString() ?? null;
        return {
            message: "Audit log deleted successfully.",
            status: 200,
            data: {}
        };

    } catch (error) {
        return {
            message: "Something went wrong while deleting audit log.",
            status: 400,
            data: {},
        };
    }
};