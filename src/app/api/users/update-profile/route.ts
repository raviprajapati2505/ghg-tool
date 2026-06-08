import { NextRequest, NextResponse } from "next/server";
import { authGuard } from "@/helpers/server/authGuard";
import { updateMDBData } from "@/db/mongoQueries";

export const POST = async (request: NextRequest) => {
    try {
        const authUser = await authGuard(request);
        if (authUser instanceof Response) return authUser;

        const requestBody = await request.json();
        const { name } = requestBody;

        if (!name || name.trim() === "") {
            return NextResponse.json({
                status: 400,
                message: "Name is required.",
                data: {},
            });
        }

        await updateMDBData("users", { _id: authUser._id }, { name: name.trim() });

        return NextResponse.json({
            status: 200,
            message: "Profile updated successfully.",
            data: { name: name.trim() },
        });

    } catch (err: any) {
        return NextResponse.json({
            status: 500,
            message: "Something went wrong. The administrator has been notified.",
            error: err.message || err.toString(),
            data: {},
        });
    }
};