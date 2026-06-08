import { getMDBSingleData, updateMDBData } from "@/db/mongoQueries";
import { sendNotificationMessage } from "@/lib/slackNotifications";
import { NextResponse } from "next/server";

export const POST = async (request: Request) => {
  try {
    const requestBody = await request.json();
    const { token, id } = requestBody;

    const user = await getMDBSingleData("users", {
      _id: id,
      verifyToken: token,
      verifyTokenExpiry: { $gt: Date.now() },
    });

    if (!user) {
      return NextResponse.json(
        { message: "Invalid or expired token", status: 400 },
        { status: 200 }
      );
    }

    await updateMDBData(
      "users",
      { _id: user._id },
      {
        isVerified: true,
        verifyToken: null,
        verifyTokenExpiry: null,
      }
    );

    const slackMessage = `Email verified for user with id: ${user._id} and email: ${user.email}`;
    await sendNotificationMessage(slackMessage);
    // 3. Respond success
    return NextResponse.json(
      { message: "Email verified successfully", status: 200 },
      { status: 200 }
    );
  } catch (err: any) {
    return NextResponse.json(
      { message: err.message || "Server error", status: 500 },
      { status: 500 }
    );
  }
};
