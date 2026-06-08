import { saveMDBData, updateMDBData, aggregateWithJoins, getMDBData, insertManyMDBData } from "@/db/mongoQueries";
import { addAuditLog } from "./auditLogs";

const modal = "categories";

export const getCategories = async (data: Record<string, any>, authUser: any) => {
    try {
        const authRoleId = authUser?.role_id?.toString() ?? null;
        const authUserId = authUser?._id?.toString() ?? null;

        const where: Record<string, any> = {
            status: "active",
            isApproved: true,
            $or: [
                { is_deleted: { $ne: true } },
                { is_deleted: { $exists: false } }
            ]
        };

        const response = await getMDBData(modal, where);

        if (!response || response.length === 0) {
            return {
                message: "Data not found.",
                status: 404,
                data: {},
            };
        }

        let scope1: { id: string; name: string }[] = [];
        let scope2: { id: string; name: string }[] = [];
        let scope3: { id: string; name: string }[] = [];

        response.forEach((item: any) => {
            const obj = {
                id: item._id.toString(),
                name: item.name,
            };

            switch (item.scope) {
                case "1":
                    scope1.push(obj);
                    break;
                case "2":
                    scope2.push(obj);
                    break;
                case "3":
                    scope3.push(obj);
                    break;
                default:
                    break;
            }
        });

        return {
            message: "Data fetched successfully.",
            status: 200,
            data: {
                scope1,
                scope2,
                scope3
            },
        };
    } catch (error) {
        return {
            message: "Something went wrong. Please try again.",
            status: 400,
            data: {},
        };
    }
};

export const getAllCategories = async (data: Record<string, any>, authUser: any) => {
    try {
        const authRoleId = authUser?.role_id?.toString() ?? null;
        const authUserId = authUser?._id?.toString() ?? null;

        const where: Record<string, any> = {
            $or: [
                { is_deleted: { $ne: true } },
                { is_deleted: { $exists: false } }
            ]
        };

        const response = await getMDBData(modal, where);

        if (!response || response.length === 0) {
            return {
                message: "Data not found.",
                status: 404,
                data: {},
            };
        }

        return {
            message: "Data fetched successfully.",
            status: 200,
            data: response || [],
        };
    } catch (error) {
        return {
            message: "Something went wrong. Please try again.",
            status: 400,
            data: [],
        };
    }
};


export const addCategory = async (data: Record<string, any>, authUser: any) => {
    try {
        const authRoleId = authUser?.role_id?.toString() ?? null;
        const authUserId = authUser?._id?.toString() ?? null;
        return {
            message: "Category added successfully.",
            status: 200,
            data: {}
        };

    } catch (error) {
        return {
            message: "Something went wrong while adding category.",
            status: 400,
            data: {},
        };
    }
};

export const updateCategory = async (data: Record<string, any>, authUser: any) => {
    try {

        const authRoleId = authUser?.role_id?.toString() ?? null;
        const authUserId = authUser?._id?.toString() ?? null;

        const id = data?.id;
        if (!id) {
            return {
                message: "Category not found.",
                status: 404,
                data: {},
            };
        }

        const where = { _id: id, isApproved: true };

        const updateData = {
            status: data?.status || "inactive",
        };

        const category = await updateMDBData(modal, where, data);

        if (!category) {
            return {
                message: "Category not found.",
                status: 404,
                data: {},
            };
        }

        if (category) {

            await addAuditLog({
                collection: modal,
                action_type: "category_updated",
                description: `Updated category status to ${updateData.status}`,
                metadata: { category_id: id },
            }, authUser);

            return {
                message: "Category updated successfully.",
                status: 200,
                data: {},
            };
        }

        return {
            message: "Category not found.",
            status: 404,
            data: {},
        };
    } catch (error) {
        return {
            message: "Something went wrong while updating category.",
            status: 400,
            data: {},
        };
    }
};








