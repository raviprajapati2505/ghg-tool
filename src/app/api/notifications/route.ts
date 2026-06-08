import { getNotifications, markAllNotificationsRead } from "@/helpers/server/notifications";
import { verifyJWT } from "@/lib/auth";
import { getMDBSingleData } from "@/db/mongoQueries";
import { NextRequest, NextResponse } from "next/server";
import { JwtPayload } from "jsonwebtoken";

async function getAuthUser(req: NextRequest) {
    const token = req.cookies.get('GHGAuthToken')?.value;
    if (!token) return null;
    const verifyJWTToken = verifyJWT(token);
    if (!verifyJWTToken || typeof verifyJWTToken === 'string') return null;
    const user_id = (verifyJWTToken as JwtPayload).id || null;
    const user_email = (verifyJWTToken as JwtPayload).email || null;
    if (!user_id || !user_email) return null;
    return await getMDBSingleData("users", {
        _id: user_id, token, status: "Active",
        $or: [{ is_deleted: { $ne: true } }, { is_deleted: { $exists: false } }]
    }) || null;
}

export async function GET(req: NextRequest) {
    const authUser = await getAuthUser(req);
    if (!authUser) return NextResponse.json({ message: "Unauthorized", status: 401 });
    const notifications = await getNotifications(authUser._id.toString());
    return NextResponse.json({ status: 200, data: notifications });
}

export async function PUT(req: NextRequest) {
    const authUser = await getAuthUser(req);
    if (!authUser) return NextResponse.json({ message: "Unauthorized", status: 401 });
    await markAllNotificationsRead(authUser._id.toString());
    return NextResponse.json({ status: 200, message: "All marked as read" });
}