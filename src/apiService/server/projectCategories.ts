import { saveMDBData, updateMDBData, aggregateWithJoins, getMDBData, getMDBSingleData, insertManyMDBData } from "@/db/mongoQueries";
import { createNotification } from "@/helpers/server/notifications";
import { Roles } from "@/utils/roleAndPermission";
import { addAuditLog } from "./auditLogs";
import { updateProjectStatus } from "./projects";
import { sendEmail } from "@/helpers/server/mailer";
import { categoryAssignedTemplate, dataRejectedTemplate } from "@/lib/emailTemplates";

const modal = "project_categories";

export const getProjectCategoryDetails = async (data: Record<string, any>, authUser: any) => {
    try {
        const authRoleId = authUser?.role_id?.toString() ?? null;
        const authUserId = authUser?._id?.toString() ?? null;
        const pid = data?.pid;
        const scid = data?.scid;

        var where: Record<string, any> = {
            _id: scid,
            project_id: pid,
            $or: [
                { is_deleted: { $ne: true } },
                { is_deleted: { $exists: false } }
            ]
        };


        const response = await aggregateWithJoins({
            collectionName: modal,
            where,
            joins: [
                {
                    from: "projects",
                    localField: "project_id",
                    foreignField: "_id",
                    as: "project",
                    type: "single",
                    projection: { name: 1, type: 1, year: 1, status: 1 },
                    where: { $or: [{ is_deleted: { $ne: true } }, { is_deleted: { $exists: false } }] }
                },
                {
                    from: "categories",
                    localField: "category_id",
                    foreignField: "_id",
                    as: "category",
                    type: "single",
                    projection: { name: 1, scope: 1 },
                    where: { $or: [{ is_deleted: { $ne: true } }, { is_deleted: { $exists: false } }] }
                }
            ],
        });
        const categoryData = response?.[0] || {};
        if (!categoryData || Object.keys(categoryData).length === 0) {
            return {
                message: "Data not found.",
                status: 404,
                data: {},
            };
        }
        return {
            message: "Data fetched successfully.",
            status: 200,
            data: categoryData,
        };
    } catch (error) {
        return {
            message: "something went wrong. Please try again.",
            status: 400,
            data: {},
        };
    }
};

export const updateProjectCategory = async (data: Record<string, any>, authUser: any) => {
    try {
        const authRoleId = authUser?.role_id?.toString() ?? null;
        const authUserId = authUser?._id?.toString() ?? null;
        const datalist = data?.dataList || [];
        const pid = data?.pid;
        const scid = data?.scid;
        const functionType = data?.functionType || 'add';

        const parentProject = await getMDBSingleData("projects", { _id: pid });
        if (!parentProject) {
            return { message: "Project not found.", status: 404, data: {} };
        }
        if (parentProject.status === "Cancelled") {
            return { message: "Cannot modify data of a cancelled project.", status: 400, data: {} };
        }
        const existingCategory = await getMDBSingleData(modal, { _id: scid, project_id: pid });
        const existingDataList: any[] = existingCategory?.data || [];

        const response = await updateMDBData(modal, { _id: scid, project_id: pid }, { data: datalist });

        const actionMap: Record<string, string> = {
            'add': 'Data entry added',
            'update': 'Data entry updated',
            'delete': 'Data entry deleted'
        };
        const actionTypeMap: Record<string, string> = {
            add: "category_data_added",
            update: "category_data_updated",
            delete: "category_data_deleted",
        };
        await addAuditLog({
            collection: modal,
            action_type: functionType,
            description: `Category data ${functionType}.`,
            metadata: { category_id: scid, project_id: pid },
        }, authUser);

        if (functionType === 'add') {
            const allUsers = await getMDBData("users", {
                status: "Active",
                $or: [{ is_deleted: { $ne: true } }, { is_deleted: { $exists: false } }]
            });

            const adminAndManagerUsers = allUsers.filter((u: any) =>
                u.role_id?.toString() === Roles.AdminId ||
                u.role_id?.toString() === Roles.ManagerId
            );

            for (const admin of adminAndManagerUsers) {
                await createNotification({
                    user_id: (admin as any)._id.toString(),
                    title: "New Data Added",
                    message: "A user has added new data to a project category.",
                    type: "data_added",
                    related_id: scid,
                });
            }
        }

        if (functionType === 'update') {
            const newlyRejectedRow = datalist.find((row: any, index: number) =>
                row.review_status === 'rejected' &&
                existingDataList[index]?.review_status !== 'rejected'
            );

            const assignedUsers = await getMDBData("project_category_users", {
                project_category_id: scid,
                $or: [{ is_deleted: { $ne: true } }, { is_deleted: { $exists: false } }]
            });

            const statusMessages: Record<string, string> = {
                approved: "✅ Your submission has been approved.",
                rejected: "❌ Your submission has been rejected.",
                pending: "🔄 Your submission is under review.",
            };

            for (const row of datalist) {
                const reviewStatus = row?.review_status;
                if (reviewStatus && statusMessages[reviewStatus]) {
                    for (const assignment of assignedUsers) {
                        await createNotification({
                            user_id: assignment.user_id.toString(),
                            title: "Submission Status Updated",
                            message: statusMessages[reviewStatus],
                            type: "status_change",
                            related_id: scid,
                        });
                    }
                    break;
                }
            }
            if (newlyRejectedRow) {
                const reviewMessages: any[] = newlyRejectedRow?.review_messages || [];
                const latestRemark = reviewMessages.length > 0
                    ? reviewMessages[reviewMessages.length - 1]?.message
                    : undefined;

                const categoryDetails = await getCategoryDetails({ project_category_id: scid }, authUser);
                const projectName = categoryDetails?.data?.project?.name || "a project";
                const categoryName = categoryDetails?.data?.category?.name || "a category";

                await Promise.all(
                    assignedUsers.map(async (assignment: any) => {
                        const user = await getMDBSingleData("users", { _id: assignment.user_id });
                        if (user?.email) {
                            await sendEmail({
                                to: user.email,
                                ...dataRejectedTemplate(user.name, projectName, categoryName, latestRemark)
                            });
                        }
                    })
                );
            }
        }

        await updateProjectStatus(pid, authUserId);
        const message = functionType === 'add' ? 'added' : functionType === 'delete' ? 'deleted' : 'updated';
        if (response) {
            return {
                message: `Project Category ${message} successfully.`,
                status: 200,
                data: response,
            };
        }

        return {
            message: "Project Category not found.",
            status: 404,
            data: {},
        };
    } catch (error) {
        return {
            message: "Something went wrong while updating project category.",
            status: 400,
            data: {},
        };
    }
};

export const addFilesToCategory = async (data: Record<string, any>, files: { original_name: string; name: string; path: string, uploaded_at: string }[]) => {
    try {
        const pid = data?.pid;
        const scid = data?.scid;
        const rowIndex = data?.rowIndex;
        const parentProject = await getMDBSingleData("projects", { _id: pid });
        if (parentProject?.status === "Cancelled") {
            return false;
        }
        const where = { _id: scid };


        const categoryData = await getMDBSingleData(modal, where);

        if (!categoryData) {
            return false;
        }
        const datalist = categoryData?.data || [];
        const rowData = datalist[rowIndex];
        if (!rowData) {
            return false;
        }
        rowData.files = [...(rowData?.files || []), ...files];
        datalist[rowIndex] = rowData;

        const response = await updateMDBData(modal, where, { data: datalist });
        return response ? true : false;
    } catch (error) {
        console.error("Error updating category with files:", error);
        return false;
    }
}

export const getCategoryFiles = async (data: Record<string, any>, authUser: any) => {
    try {
        const scid = data?.scid;
        const rowIndex = data?.rowIndex;
        const where = { _id: scid };

        const categoryData = await getMDBSingleData(modal, where);

        if (!categoryData) {
            return {
                message: "Project Category not found.",
                status: 404,
                data: {},
            };
        }
        const datalist = categoryData?.data || [];
        const rowData = datalist[rowIndex];
        if (!rowData) {
            return {
                message: "Project Category data not found.",
                status: 200,
                data: {},
            };
        }
        const filesList = rowData?.files || [];
        return {
            message: "Data fetched successfully.",
            status: 200,
            data: filesList,
        };
    } catch (error) {
        return {
            message: "Something went wrong while updating project category.",
            status: 400,
            data: {},
        };
    }
};
export const updateCategoryFiles = async (data: Record<string, any>, authUser: any) => {
    try {
        const scid = data?.scid;
        const rowIndex = data?.rowIndex;
        const where = { _id: scid };
        const filesList = data?.filesList;
        const pid = data?.pid;

        const parentProject = await getMDBSingleData("projects", { _id: pid });
        if (parentProject?.status === "Cancelled") {
            return { message: "Cannot modify files of a cancelled project.", status: 400, data: {} };
        }

        const categoryData = await getMDBSingleData(modal, where);

        if (!categoryData) {
            return {
                message: "Project Category not found.",
                status: 404,
                data: {},
            };
        }
        const datalist = categoryData?.data || [];
        const rowData = datalist[rowIndex];
        if (!rowData) {
            return {
                message: "Project Category data not found.",
                status: 404,
                data: {},
            };
        }
        rowData.files = filesList;
        datalist[rowIndex] = rowData;

        const response = await updateMDBData(modal, where, { data: datalist });
        if (response) {
            return {
                message: "Project Category file deleted successfully.",
                status: 200,
                data: response,
            };
        }
        return {
            message: "Project Category not found.",
            status: 404,
            data: {},
        };
    } catch (error) {
        return {
            message: "Something went wrong while updating project category.",
            status: 400,
            data: {},
        };
    }
};
export const assignUsersToCategory = async (data: Record<string, any>, authUser: any) => {
    try {
        const authUserId = authUser?._id?.toString() ?? null;
        const projectCategoryId = data?.project_category_id;
        const userIds = data?.user_ids || [];

        if (!projectCategoryId) {
            return { message: "Project category ID is required.", status: 400, data: {} };
        }
        if (!Array.isArray(userIds)) {
            return { message: "Invalid user IDs format.", status: 400, data: {} };
        }

        const where = {
            project_category_id: projectCategoryId,
            $or: [
                { is_deleted: { $ne: true } },
                { is_deleted: { $exists: false } }
            ]
        };

        const existingAssignments = await getMDBData("project_category_users", where);
        const existingUserIds = existingAssignments.map((item: any) => item.user_id.toString());

        const usersToAdd = userIds.filter(id => !existingUserIds.includes(id));
        const usersToRemove = existingUserIds.filter(id => !userIds.includes(id));


        if (usersToAdd.length > 0) {
            const insertData = usersToAdd.map(userId => ({
                project_category_id: projectCategoryId,
                user_id: userId,
                created_by: authUserId,
            }));
            await insertManyMDBData("project_category_users", insertData);

            await addAuditLog({
                collection: modal,
                action_type: "user_assigned",
                description: `Category assigned to users successfully.`,
                metadata: { category_id: projectCategoryId, user_ids: usersToAdd },
            }, authUser);

            const categoryDetails = await getCategoryDetails({ project_category_id: projectCategoryId }, authUser);
            const projectName = categoryDetails?.data?.project?.name || "a project";
            const categoryName = categoryDetails?.data?.category?.name || "a category";

            await Promise.all(
                usersToAdd.map(async (userId: string) => {
                    const [user] = await Promise.all([
                        getMDBSingleData("users", { _id: userId }),
                        createNotification({
                            user_id: userId,
                            title: "You've been assigned",
                            message: "You have been assigned to a new project category.",
                            type: "user_assigned",
                            related_id: projectCategoryId,
                        }),
                    ]);

                    if (user?.email) {
                        await sendEmail({
                            to: user.email,
                            ...categoryAssignedTemplate(user.name, projectName, categoryName)
                        });
                    }
                })
            );
        }

        if (usersToRemove.length > 0) {
            await updateMDBData(
                "project_category_users",
                { project_category_id: projectCategoryId, user_id: { $in: usersToRemove } },
                { is_deleted: true, deleted_by: authUserId, deleted_at: new Date() },
                true
            );

            await addAuditLog({
                collection: modal,
                action_type: "user_removed",
                description: `User removed from category successfully.`,
                metadata: { category_id: projectCategoryId, user_ids: usersToRemove },
            }, authUser);

            for (const userId of usersToRemove) {
                await createNotification({
                    user_id: userId,
                    title: "You've been removed",
                    message: "You have been removed from a project category.",
                    type: "user_removed",
                    related_id: projectCategoryId,
                });
            }
        }

        let message = "No changes made.";
        if (usersToAdd.length > 0 && usersToRemove.length > 0) {
            message = "User updated successfully.";
        } else if (usersToAdd.length > 0) {
            message = "User assigned successfully.";
        } else if (usersToRemove.length > 0) {
            message = "User removed successfully.";
        }

        return { message, status: 200, data: {} };
    } catch (error) {
        return { message: "Something went wrong while assigning users.", status: 400, data: {} };
    }
};

export const getCategoryAssignedUsers = async (data: Record<string, any>, authUser: any) => {
    try {
        const projectCategoryId = data?.project_category_id;

        if (!projectCategoryId) {
            return { message: "Project category ID is required.", status: 400, data: {} };
        }

        const assignments = await aggregateWithJoins({
            collectionName: "project_category_users",
            where: {
                project_category_id: projectCategoryId,
                $or: [
                    { is_deleted: { $ne: true } },
                    { is_deleted: { $exists: false } }
                ]
            },
            joins: [
                {
                    from: "users",
                    localField: "user_id",
                    foreignField: "_id",
                    as: "user",
                    type: "single",
                    projection: { name: 1, email: 1 },
                    where: {
                        status: "Active",
                        $or: [
                            { is_deleted: { $ne: true } },
                            { is_deleted: { $exists: false } }
                        ]
                    }
                },
                {
                    from: "users",
                    localField: "created_by",
                    foreignField: "_id",
                    as: "createdBy",
                    type: "single",
                    projection: { name: 1 },
                }
            ]
        });

        return { message: "Data fetched successfully.", status: 200, data: assignments };
    } catch (error) {
        return { message: "Something went wrong while fetching assigned users.", status: 400, data: {} };
    }
};

export const getCategoryDetails = async (data: Record<string, any>, authUser: any) => {
    try {
        const projectCategoryId = data?.project_category_id;

        if (!projectCategoryId) {
            return { message: "Project category ID is required.", status: 400, data: {} };
        }

        const details = await aggregateWithJoins({
            collectionName: "project_categories",
            where: {
                _id: projectCategoryId,
                $or: [
                    { is_deleted: { $ne: true } },
                    { is_deleted: { $exists: false } }
                ]
            },
            joins: [
                {
                    from: "projects",
                    localField: "project_id",
                    foreignField: "_id",
                    as: "project",
                    type: "single",
                    projection: { name: 1 }
                },
                {
                    from: "categories",
                    localField: "category_id",
                    foreignField: "_id",
                    as: "category",
                    type: "single",
                    projection: { name: 1, scope: 1, icon: 1 }
                },
                {
                    from: "users",
                    localField: "created_by",
                    foreignField: "_id",
                    as: "createdBy",
                    type: "single",
                    projection: { name: 1 }
                }
            ]
        });

        if (!details || details.length === 0) {
            return { message: "Category not found.", status: 404, data: {} };
        }

        return { message: "Data fetched successfully.", status: 200, data: details[0] };
    } catch (error) {
        return { message: "Something went wrong while fetching category details.", status: 400, data: {} };
    }
};

export const getCategoryAuditLog = async (data: Record<string, any>, authUser: any) => {
    try {
        const projectCategoryId = data?.project_category_id;

        if (!projectCategoryId) {
            return { message: "Project category ID is required.", status: 400, data: {} };
        }

        const auditLog = await aggregateWithJoins({
            collectionName: "category_audit_logs",
            where: {
                project_category_id: projectCategoryId
            },
            joins: [
                {
                    from: "users",
                    localField: "performed_by",
                    foreignField: "_id",
                    as: "performedBy",
                    type: "single",
                    projection: { name: 1 }
                }
            ],
            sort: { column: "timestamp", order: -1 }
        });

        return { message: "Data fetched successfully.", status: 200, data: auditLog };
    } catch (error) {
        return { message: "Something went wrong while fetching audit log.", status: 400, data: {} };
    }
};

export const updateCategoryStatus = async (data: Record<string, any>, authUser: any) => {
    try {
        const authUserId = authUser?._id?.toString() ?? null;
        const projectCategoryId = data?.project_category_id;
        const newStatus = data?.status;

        if (!projectCategoryId) {
            return { message: "Project category ID is required.", status: 400, data: {} };
        }

        const validStatuses = ['new', 'pending', 'in_progress', 'approved', 'cancelled', 'completed'];
        if (!validStatuses.includes(newStatus)) {
            return { message: "Invalid status.", status: 400, data: {} };
        }

        const currentData = await getMDBData("project_categories", { _id: projectCategoryId });
        if (!currentData || currentData.length === 0) {
            return { message: "Project category not found.", status: 404, data: {} };
        }

        const oldStatus = currentData[0]?.status || 'new';

        await updateMDBData(
            "project_categories",
            { _id: projectCategoryId },
            {
                status: newStatus,
                updated_by: authUserId,
                updatedAt: new Date()
            }
        );

        await addAuditLog({
            collection: modal,
            action_type: "status_updated",
            description: `Category status updated to "${newStatus}"`,
            metadata: { category_id: projectCategoryId, status: newStatus },
        }, authUser);

        const statusMessages: Record<string, string> = {
            approved: "✅ Your submission has been approved.",
            rejected: "❌ Your submission has been rejected.",
            in_progress: "🔄 Your submission is now in progress.",
            completed: "🎉 Your submission has been marked as completed.",
            cancelled: "🚫 Your submission has been cancelled.",
            pending: "⏳ Your submission is pending review.",
        };

        const assignedUsers = await getMDBData("project_category_users", {
            project_category_id: projectCategoryId,
            $or: [{ is_deleted: { $ne: true } }, { is_deleted: { $exists: false } }]
        });

        for (const assignment of assignedUsers) {
            await createNotification({
                user_id: assignment.user_id.toString(),
                title: "Status Updated",
                message: statusMessages[newStatus] || `Status changed to "${newStatus}"`,
                type: "status_change",
                related_id: projectCategoryId,
            });
        }

        return { message: "Status updated successfully.", status: 200, data: {} };
    } catch (error) {
        return { message: "Something went wrong while updating status.", status: 400, data: {} };
    }
};