import { NextRequest, NextResponse } from "next/server";
import { authGuard } from "@/helpers/server/authGuard";
import { getRoleByIdAndName, getRolePermission } from "@/utils/roleAndPermission";
import { getAuditLogs, addAuditLog, deleteAuditLog } from "@/apiService/server/auditLogs";

export const POST = async (request: NextRequest) => {
    try {
        const authUser = await authGuard(request);
        if (authUser instanceof Response) return authUser;

        const requestBody = await request.json();
        const { action } = requestBody;

        var response = {
            message: "",
            status: 200,
            data: {},
        };

        switch (action) {
            case "getAuditLogs":
                response = await getAuditLogs(requestBody, authUser);
                break;

            case "addAuditLog":
                response = await addAuditLog(requestBody, authUser);
                break;

            case "deleteAuditLog":
                response = await deleteAuditLog(requestBody, authUser);
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