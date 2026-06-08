
import { NextResponse, NextRequest } from "next/server";
import bcrypt from 'bcryptjs';
import { signJWT } from "@/lib/auth";
import { getMDBSingleData, updateMDBData } from "@/db/mongoQueries";
import { addAuditLog } from "@/apiService/server/auditLogs";

export async function POST(request: NextRequest) {
  const { email, password } = await request.json();
  const user_info = await getMDBSingleData("users", { email });

  if (!user_info) {
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 200 });
  }

  const isMatch = bcrypt.compareSync(password, user_info.password);
  if (!isMatch) {
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 200 });
  }

  const tokenPayload = {
    id: user_info._id,
    email: user_info.email,
    name: user_info.name,
  };

  const token = signJWT(tokenPayload);
  try {
    await addAuditLog(
      {
        action_type: "login",
        description: `${user_info.name || user_info.email} logged into the system.`,
        user_name: user_info.name || user_info.email,
      },
      {
        _id: user_info._id,
        role_id: user_info.role_id
      }
    );
  } catch (logError) {
  }
  updateMDBData("users", { _id: user_info._id }, { lastLogin: Date.now(), token: token });

  const user: any = {
    id: user_info._id || null,
    name: user_info.name || null,
    email: user_info.email || null,
    role_id: user_info.role_id ? user_info.role_id.toString() : null,
    token: token
  }
  const response = NextResponse.json({ user, status: 200 });
  response.cookies.set("GHGAuthToken", token, { httpOnly: false, expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30), secure: true });
  return response;
}
