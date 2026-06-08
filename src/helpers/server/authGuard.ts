
import { verifyJWT } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";
import { JwtPayload } from 'jsonwebtoken';
import { getMDBSingleData } from "@/db/mongoQueries";

export async function authGuard(request: NextRequest) {
    const token = request.cookies.get('GHGAuthToken')?.value;
    if (request.method !== 'POST') {
        return NextResponse.json({ message: 'Method not allowed', status: 405 }, { status: 405 });
    }
    const response = NextResponse.json({ message: "Your session has expired. Please sign in again to continue.", status: 401 }, { status: 401 });
    response.cookies.set("GHGAuthToken", "", { httpOnly: true, expires: new Date(0) });
    if (!token) {
        return response;
    }
    const verifyJWTToken = verifyJWT(token);
    if (!verifyJWTToken || typeof verifyJWTToken === 'string') {
        return response;
    }
    const user_id = (verifyJWTToken as JwtPayload).id || null;
    const user_email = (verifyJWTToken as JwtPayload).email || null;
    var user = null;
    if (user_id && user_email) {
        const where = {
            _id: user_id, token: token,
            status: "Active",
            $or: [
                { is_deleted: { $ne: true } },
                { is_deleted: { $exists: false } }
            ]
        };
        user = await getMDBSingleData("users", where);
        if (!user) {
            return response;
        }
    } else {
        return response;
    }
    return user;
}
