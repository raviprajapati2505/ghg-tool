
import { NextRequest, NextResponse } from "next/server";
import {
    addCategory,
    getAllCategories,
    getCategories,
    updateCategory,

} from "@/apiService/server/categories";

import { authGuard } from "@/helpers/server/authGuard";
import { getRoleByIdAndName, getRolePermission } from "@/utils/roleAndPermission";

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
            case "getCategories":
                response = await getCategories(requestBody, authUser);
                break;

            case "getAllCategories":
                response = await getAllCategories(requestBody, authUser);
                break;

            case "addCategory":
                response = await addCategory(requestBody, authUser);
                break;

            case "updateCategory":
                response = await updateCategory(requestBody, authUser);
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