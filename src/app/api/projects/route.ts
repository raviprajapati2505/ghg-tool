
import { NextRequest, NextResponse } from "next/server";
import {
    addProject,
    cancelProject,
    getProjectDetails,
    getProjectResult,
    getProjects,
    updateProject,
    restoreProject,
} from "@/apiService/server/projects";

import { authGuard } from "@/helpers/server/authGuard";
import { getRoleByIdAndName, getRolePermission } from "@/utils/roleAndPermission";

export const POST = async (request: NextRequest) => {
    try {
        const authUser = await authGuard(request);
        if (authUser instanceof Response) return authUser;

        const authRoleId = authUser?.role_id.toString() || null;
        const permDeniedResponse = NextResponse.json({ status: 403, message: "Permission denied.", data: {}, });

        const requestBody = await request.json();
        const { action } = requestBody;

        var response = {
            message: "",
            status: 200,
            data: {},
        };

        switch (action) {
            case "getProjects":
                response = await getProjects(requestBody, authUser);
                break;

            case "getProjectDetails":
                response = await getProjectDetails(requestBody, authUser);
                break;

            case "addProject":
                response = await addProject(requestBody, authUser);
                break;

            case "updateProject":
                response = await updateProject(requestBody, authUser);
                break;

            case "cancelProject":
                response = await cancelProject(requestBody, authUser);                
                break;

            case "restoreProject":
                response = await restoreProject(requestBody, authUser);
                break;

            case "getProjectResult":
                response = await getProjectResult(requestBody, authUser);
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