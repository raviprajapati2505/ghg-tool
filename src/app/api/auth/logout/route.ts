
import { NextResponse, NextRequest } from "next/server";
import { addAuditLog } from "@/apiService/server/auditLogs";
import { verifyJWT } from "@/lib/auth";

export const POST = async (request: NextRequest) => {
  try {

    const token = request.cookies.get("GHGAuthToken")?.value;
    const authUser = token ? verifyJWT(token) as { name?: string; email?: string; id?: string } : null;
    const mappedAuthUser = authUser ? { ...authUser, _id: (authUser as any).id } : null;

    if (token && mappedAuthUser) {
      await addAuditLog(
        {
          action_type: "logout",
          description: `${mappedAuthUser?.name || mappedAuthUser?.email} logged out of the system.`,
          user_name: mappedAuthUser?.name || mappedAuthUser?.email,
        },
        mappedAuthUser
      );
    }


    const response = NextResponse.json({ message: "Logout successfully", status: 200, });
    response.cookies.set("GHGAuthToken", "", { httpOnly: true, expires: new Date(0) })
    return response;
  } catch (err: any) {
    return NextResponse.json({ Error: err, status: 500, });
  }
};