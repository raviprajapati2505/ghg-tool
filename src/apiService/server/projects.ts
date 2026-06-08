import { saveMDBData, updateMDBData, aggregateWithJoins, getMDBData, getMDBSingleData, insertManyMDBData } from "@/db/mongoQueries";
import { calculateProjectResult } from "@/helpers/server/calculateProjectResult";
import { Roles } from "@/utils/roleAndPermission";
import { addAuditLog } from "./auditLogs";
import { projectCreatedTemplate } from "@/lib/emailTemplates";
import { sendEmail } from "@/helpers/server/mailer";

const modal = "projects";

export const getProjects = async (data: Record<string, any>, authUser: any) => {
    try {
        const authRoleId = authUser?.role_id?.toString() ?? null;
        const authUserId = authUser?._id?.toString() ?? null;

        var where: Record<string, any> = {
            $or: [
                { is_deleted: { $ne: true } },
                { is_deleted: { $exists: false } }
            ]
        };

        // Filter projects for non-admin users based on assigned project-categories
        if (authRoleId !== Roles.AdminId && authRoleId !== Roles.ManagerId) {
            const userAssignments = await getMDBData("project_category_users", {
                user_id: authUserId,
                $or: [
                    { is_deleted: { $ne: true } },
                    { is_deleted: { $exists: false } }
                ]
            });

            if (userAssignments.length === 0) {
                return { message: "Data fetched successfully.", status: 200, data: [] };
            }

            const assignedProjectCategoryIds = userAssignments.map((a: any) => a.project_category_id.toString());

            const projectCategories = await getMDBData("project_categories", {
                _id: { $in: assignedProjectCategoryIds },
                $or: [
                    { is_deleted: { $ne: true } },
                    { is_deleted: { $exists: false } }
                ]
            });

            const allowedProjectIds = [...new Set(projectCategories.map((pc: any) => pc.project_id.toString()))];

            if (allowedProjectIds.length === 0) {
                return { message: "Data fetched successfully.", status: 200, data: [] };
            }

            where._id = { $in: allowedProjectIds };
        }

        const projects = await aggregateWithJoins({
            collectionName: modal,
            where,
            joins: [
                {
                    from: "users",
                    localField: "created_by",
                    foreignField: "_id",
                    as: "createdBy",
                    type: "single",
                    projection: { name: 1 }
                },
                {
                    from: "project_categories",
                    localField: "_id",
                    foreignField: "project_id",
                    as: "projectCategories",
                    type: "multiple",
                    projection: { category_id: 1, data: 1 },
                    where: { $or: [{ is_deleted: { $ne: true } }, { is_deleted: { $exists: false } }] },
                    childLookup: {
                        from: "categories",
                        localField: "category_id",
                        foreignField: "_id",
                        as: "categoryDetail",
                        projection: { name: 1, scope: 1, type: 1, icon: 1 },
                        where: { $or: [{ is_deleted: { $ne: true } }, { is_deleted: { $exists: false } }] },
                    },
                },
            ],
            sort: { column: "createdAt", order: -1 }
        });

        if (!projects) {
            return { message: "Data not found.", status: 404, data: [] };
        }
        return { message: "Data fetched successfully.", status: 200, data: projects };
    } catch (error) {
        return { message: "something went wrong. Please try again.", status: 400, data: [] };
    }
};

export const getProjectDetails = async (data: Record<string, any>, authUser: any) => {
    try {
        const authRoleId = authUser?.role_id?.toString() ?? null;
        const authUserId = authUser?._id?.toString() ?? null;

        var where: Record<string, any> = {
            $or: [
                { is_deleted: { $ne: true } },
                { is_deleted: { $exists: false } }
            ]
        };

        const projectId = data?.project_id;
        if (projectId) {
            where._id = projectId;
        } else {
            return { message: "Project id required.", status: 404, data: {} };
        }

        const response = await aggregateWithJoins({
            collectionName: modal,
            where,
            joins: [
                {
                    from: "project_categories",
                    localField: "_id",
                    foreignField: "project_id",
                    as: "categories",
                    type: "multiple",
                    projection: { category_id: 1 },
                    where: { $or: [{ is_deleted: { $ne: true } }, { is_deleted: { $exists: false } }] },
                    childLookup: {
                        from: "categories",
                        localField: "category_id",
                        foreignField: "_id",
                        as: "category",
                        projection: { name: 1, scope: 1, icon: 1, type: 1 },
                        where: { $or: [{ is_deleted: { $ne: true } }, { is_deleted: { $exists: false } }] },
                    },
                },
            ],
        });

        if (!response) {
            return { message: "Data not found.", status: 404, data: {} };
        }

        const projectData = response?.[0] || {};
        let projectCategories = projectData?.categories || [];

        // Filter categories for non-admin users
        if (authRoleId !== Roles.AdminId && authRoleId !== Roles.ManagerId) {
            const userAssignments = await getMDBData("project_category_users", {
                user_id: authUserId,
                $or: [
                    { is_deleted: { $ne: true } },
                    { is_deleted: { $exists: false } }
                ]
            });

            const assignedProjectCategoryIds = userAssignments.map((a: any) => a.project_category_id.toString());
            projectCategories = projectCategories.filter((pc: any) => assignedProjectCategoryIds.includes(pc._id.toString()));
        }

        let scope1: { id: string; name: string; icon: string; type: string }[] = [];
        let scope2: { id: string; name: string; icon: string; type: string }[] = [];
        let scope3: { id: string; name: string; icon: string; type: string }[] = [];

        projectCategories.forEach((item: any) => {
            const scope = item?.category?.[0]?.scope;
            const name = item?.category?.[0]?.name || "";
            const icon = item?.category?.[0]?.icon || "";
            const type = item?.category?.[0]?.type || "";

            const obj = { id: item._id.toString(), name, icon, type };

            switch (scope) {
                case "1":
                    scope1.push(obj);
                    break;
                case "2":
                    scope2.push(obj);
                    break;
                case "3":
                    scope3.push(obj);
                    break;
            }
        });

        return { message: "Data fetched successfully.", status: 200, data: { ...projectData, scope1, scope2, scope3 } };
    } catch (error) {
        return { message: "something went wrong. Please try again.", status: 400, data: {} };
    }
};

export const addProject = async (data: Record<string, any>, authUser: any) => {
    try {
        const authRoleId = authUser?.role_id?.toString() ?? null;
        const authUserId = authUser?._id?.toString() ?? null;
        const ProjectData = {
            name: data?.name || "",
            type: "Carbon Footprint",
            year: data?.year || "",
            status: "New",
            created_by: authUserId
        };

        const scope1Categories = data?.scope1Categories || [];
        const scope2Categories = data?.scope2Categories || [];
        const scope3Categories = data?.scope3Categories || [];

        const allCategories = [...scope1Categories, ...scope2Categories, ...scope3Categories];

        const saveProject = await saveMDBData(modal, ProjectData);
        if (!saveProject) {
            return {
                message: "Failed to add Project.",
                status: 400,
                data: {}
            };
        }

        await addAuditLog({
            collection: modal,
            action_type: "project_created",
            description: `Project created.`,
            metadata: { project_id: saveProject?._id?.toString() },
        }, authUser);

        const adminAndManagers = await getMDBData("users", {
            status: "Active",
            role_id: { $in: [Roles.AdminId, Roles.ManagerId] },
            $or: [{ is_deleted: { $ne: true } }, { is_deleted: { $exists: false } }]
        });

        if (adminAndManagers.length > 0) {
            const template = projectCreatedTemplate(ProjectData.name, ProjectData.year);
            await Promise.all(
                adminAndManagers
                    .filter((u: any) => u.email)
                    .map((u: any) => sendEmail({ to: u.email, ...template }))
            );
        }

        if (allCategories.length) {
            const projectCategoriesData = allCategories.map((categoryId: string) => ({
                project_id: saveProject._id.toString(),
                category_id: categoryId,
                created_by: authUserId
            }));
            const saveProjectCategories = await insertManyMDBData("project_categories", projectCategoriesData);
        }

        return {
            message: "Project added successfully.",
            status: 200,
            data: {}
        };

    } catch (error) {
        return {
            message: "Something went wrong while adding project.",
            status: 400,
            data: {},
        };
    }
};

export const updateProject = async (data: Record<string, any>, authUser: any) => {
    try {
        const authUserId = authUser?._id?.toString() ?? null;
        const project_id = data?.id;
        if (!project_id) {
            return {
                message: "Project ID is required.",
                status: 400,
                data: {},
            };
        }
        const existingProject = await getMDBSingleData(modal, { _id: project_id });
        if (!existingProject) {
            return { message: "Project not found.", status: 404, data: {} };
        }
        if (existingProject.status === "Cancelled") {
            return { message: "Cannot edit a cancelled project.", status: 400, data: {} };
        }
        const ProjectData = {
            name: data?.name || "",
            year: data?.year || "",
            updated_by: authUserId,
            updated_at: new Date(),
        };
        const updatedProject = await updateMDBData(
            modal,
            { _id: project_id },
            ProjectData
        );
        if (!updatedProject) {
            return {
                message: "Project not found.",
                status: 404,
                data: {},
            };
        }
        await addAuditLog({
            collection: modal,
            action_type: "project_updated",
            description: `Project updated.`,
            metadata: { project_id: project_id },
        }, authUser);

        const scope1Categories = data?.scope1Categories || [];
        const scope2Categories = data?.scope2Categories || [];
        const scope3Categories = data?.scope3Categories || [];

        const incomingCategoryIds: string[] = [
            ...scope1Categories,
            ...scope2Categories,
            ...scope3Categories,
        ];

        const existingCategories = await getMDBData("project_categories", {
            project_id: project_id.toString(),
            $or: [
                { is_deleted: { $ne: true } },
                { is_deleted: { $exists: false } }
            ]
        });

        const existingCategoryIds = existingCategories.map(
            (item: any) => item?.category_id?.toString()
        );


        const categoriesToAdd = incomingCategoryIds.filter(
            id => !existingCategoryIds.includes(id)
        );

        const categoriesToRemove = existingCategoryIds.filter(
            id => !incomingCategoryIds.includes(id)
        );

        if (categoriesToAdd.length) {
            const insertData = categoriesToAdd.map(categoryId => ({
                project_id: project_id.toString(),
                category_id: categoryId,
                created_by: authUserId,
            }));

            await insertManyMDBData("project_categories", insertData);
        }

        if (categoriesToRemove.length) {
            await updateMDBData(
                "project_categories",
                {
                    project_id: project_id.toString(),
                    category_id: { $in: categoriesToRemove },
                },
                {
                    is_deleted: true,
                    deleted_by: authUserId,
                    deleted_at: new Date(),
                },
                true
            );
        }

        return {
            message: "Project updated successfully.",
            status: 200,
            data: {},
        };

    } catch (error) {
        return {
            message: "Something went wrong while updating project.",
            status: 400,
            data: {},
        };
    }
};

export const cancelProject = async (data: Record<string, any>, authUser: any) => {
    try {
        const authUserId = authUser?._id?.toString() ?? null;
        const project_id = data?.id;
        if (!project_id) {
            return { message: "Project ID is required.", status: 400, data: {} };
        }
        const existingProject = await getMDBSingleData(modal, { _id: project_id });
        if (!existingProject) {
            return { message: "Project not found.", status: 404, data: {} };
        }
        if (!["New", "In Progress"].includes(existingProject.status)) {
            return { message: "Only New or In Progress projects can be cancelled.", status: 400, data: {} };
        }
        const updatedProject = await updateMDBData(
            modal,
            { _id: project_id },
            {
                status: "Cancelled",
                updated_by: authUserId,
                updated_at: new Date(),
            }
        );
        if (!updatedProject) {
            return { message: "Failed to cancel project.", status: 400, data: {} };
        }
        await addAuditLog({
            collection: modal,
            action_type: "project_cancelled",
            description: `Project cancelled.`,
            metadata: { project_id },
        }, authUser);
        return { message: "Project cancelled successfully.", status: 200, data: {} };
    } catch (error) {
        return { message: "Something went wrong while cancelling project.", status: 400, data: {} };
    }
};

export const restoreProject = async (data: Record<string, any>, authUser: any) => {
    try {
        const authUserId = authUser?._id?.toString() ?? null;
        const project_id = data?.id;
        if (!project_id) {
            return { message: "Project ID is required.", status: 400, data: {} };
        }
        const existingProject = await getMDBSingleData(modal, { _id: project_id });
        if (!existingProject) {
            return { message: "Project not found.", status: 404, data: {} };
        }
        if (existingProject.status !== "Cancelled") {
            return { message: "Only cancelled projects can be restored.", status: 400, data: {} };
        }
        const updatedProject = await updateMDBData(
            modal,
            { _id: project_id },
            {
                status: "New",
                updated_by: authUserId,
                updated_at: new Date(),
            }
        );
        if (!updatedProject) {
            return { message: "Failed to restore project.", status: 400, data: {} };
        }
        await addAuditLog({
            collection: modal,
            action_type: "project_restored",
            description: `Project restored.`,
            metadata: { project_id },
        }, authUser);

        return { message: "Project restored successfully.", status: 200, data: {} };
    } catch (error) {
        return { message: "Something went wrong while restoring project.", status: 400, data: {} };
    }
};

export const updateProjectStatus = async (pid: string, authUserId: string) => {
    try {
        const project = await getMDBSingleData(modal, { _id: pid });
        if (!project || project.status === "Cancelled") return;

        const projectCategories = await getMDBData("project_categories", {
            project_id: pid,
            $or: [{ is_deleted: { $ne: true } }, { is_deleted: { $exists: false } }]
        });

        if (!projectCategories?.length) return;

        const allData = projectCategories.flatMap((pc: any) => pc.data || []);
        const allCategoriesHaveData = projectCategories.every((pc: any) => pc.data?.length > 0);

        const newStatus = allData.length === 0
            ? "New"
            : allCategoriesHaveData && allData.every((row: any) => row.review_status === "approved")
                ? "Completed"
                : "In Progress";

        if (project.status === newStatus) return;

        await updateMDBData(modal, { _id: pid }, {
            status: newStatus,
            updated_by: authUserId,
            updated_at: new Date()
        });
    } catch (error) {
        console.error("Failed to update project status:", error);
    }
};

export const getProjectResult = async (data: Record<string, any>, authUser: any) => {
    try {
        const authUserId = authUser?._id?.toString() ?? null;
        const project_id = data?.id;

        if (!project_id) {
            return {
                message: "Project ID is required.",
                status: 400,
                data: {},
            };
        }

        const where = {
            _id: project_id,
            $or: [{ is_deleted: { $ne: true } }, { is_deleted: { $exists: false } }]
        };

        const response = await aggregateWithJoins({
            collectionName: modal,
            where,
            joins: [
                {
                    from: "project_categories",
                    localField: "_id",
                    foreignField: "project_id",
                    as: "categoriesData",
                    type: "multiple",
                    projection: { category_id: 1, data: 1 },
                    where: { $or: [{ is_deleted: { $ne: true } }, { is_deleted: { $exists: false } }] },
                    childLookup: {
                        from: "categories",
                        localField: "category_id",
                        foreignField: "_id",
                        as: "categoryDetail",
                        projection: { name: 1, scope: 1, type: 1, icon: 1 },
                        where: { $or: [{ is_deleted: { $ne: true } }, { is_deleted: { $exists: false } }] },
                    },
                },
            ],
        });

        if (response.length === 0) {
            return {
                message: "Project not found.",
                status: 404,
                data: {},
            };
        }

        const categoriesData = response[0]?.categoriesData || [];

        if (!categoriesData || categoriesData.length === 0) {
            return {
                message: "Project categories not found.",
                status: 404,
                data: {},
            };
        }

        const result = await calculateProjectResult(categoriesData);
        return {
            message: "Project result calculated successfully.",
            status: 200,
            data: result,
        };

    } catch (error) {
        return {
            message: "Something went wrong while updating project.",
            status: 400,
            data: {},
        };
    }
};