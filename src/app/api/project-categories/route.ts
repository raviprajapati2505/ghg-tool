
import { NextRequest, NextResponse } from "next/server";
import {
    getProjectCategoryDetails,
    updateProjectCategory,
    getCategoryFiles,
    updateCategoryFiles,
    assignUsersToCategory,
    getCategoryAssignedUsers,
    getCategoryDetails,
    getCategoryAuditLog,
    updateCategoryStatus
} from "@/apiService/server/projectCategories";

import { authGuard } from "@/helpers/server/authGuard";

export const POST = async (request: NextRequest) => {
    try {
        const authUser = await authGuard(request);
        if (authUser instanceof Response) return authUser;

        // const authRoleId = authUser?.role_id.toString() || null;
        // const permDeniedResponse = NextResponse.json({ status: 403, message: "Permission denied.", data: {}, });

        const requestBody = await request.json();
        const { action } = requestBody;

        var response = {
            message: "",
            status: 200,
            data: {},
        };

        switch (action) {
            case "getProjectCategoryDetails":
                response = await getProjectCategoryDetails(requestBody, authUser);
                break;

            case "updateProjectCategory":
                response = await updateProjectCategory(requestBody, authUser);
                break;

            case "getCategoryFiles":
                response = await getCategoryFiles(requestBody, authUser);
                break;

            case "updateCategoryFiles":
                response = await updateCategoryFiles(requestBody, authUser);
                break;
            case "assignUsersToCategory":
                response = await assignUsersToCategory(requestBody, authUser);
                break;

            case "getCategoryAssignedUsers":
                response = await getCategoryAssignedUsers(requestBody, authUser);
                break;

            case "getCategoryDetails":
                response = await getCategoryDetails(requestBody, authUser);
                break;

            case "getCategoryAuditLog":
                response = await getCategoryAuditLog(requestBody, authUser);
                break;

            case "updateCategoryStatus":
                response = await updateCategoryStatus(requestBody, authUser);
                break;

            default:
                response = {
                    message: "Invalid action.",
                    status: 400,
                    data: {},
                };
                break;
        }

        return NextResponse.json(response);

    } catch (err: any) {
        return NextResponse.json({
            status: 500,
            message: "Something went wrong. The administrator has been notified.",
            error: err.message || err.toString(),
            data: {},
        });
    }
};