
import { NextRequest, NextResponse } from "next/server";
import {
    getDashboardData,
} from "@/apiService/server/dashboard";

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
            case "getDashboardData":
                response = await getDashboardData(requestBody, authUser);
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