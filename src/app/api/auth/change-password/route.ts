import { NextRequest, NextResponse } from "next/server";
import { authGuard } from "@/helpers/server/authGuard";
import { getMDBSingleData, updateMDBData } from "@/db/mongoQueries";
import bcrypt from "bcryptjs";

export const POST = async (request: NextRequest) => {
    try {
        const authUser = await authGuard(request);
        if (authUser instanceof Response) return authUser;

        const requestBody = await request.json();
        const { current_password, new_password } = requestBody;

        if (!current_password || !new_password) {
            return NextResponse.json({
                status: 400,
                message: "Current password and new password are required.",
                data: {},
            });
        }

        if (new_password.length < 6) {
            return NextResponse.json({
                status: 400,
                message: "New password must be at least 6 characters.",
                data: {},
            });
        }

        const user = await getMDBSingleData("users", { _id: authUser._id });
        if (!user) {
            return NextResponse.json({
                status: 404,
                message: "User not found.",
                data: {},
            });
        }

        const isMatch = bcrypt.compareSync(current_password, user.password);
        if (!isMatch) {
            return NextResponse.json({
                status: 400,
                message: "Current password is incorrect.",
                data: {},
            });
        }

        const isSame = bcrypt.compareSync(new_password, user.password);
        if (isSame) {
            return NextResponse.json({
                status: 400,
                message: "New password cannot be the same as the current password.",
                data: {},
            });
        }

        const hashedPassword = bcrypt.hashSync(new_password, 10);
        await updateMDBData("users", { _id: authUser._id }, { password: hashedPassword });

        return NextResponse.json({
            status: 200,
            message: "Password changed successfully.",
            data: {},
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