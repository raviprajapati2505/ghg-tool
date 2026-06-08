import { getMDBSingleData, updateMDBData } from "@/db/mongoQueries";
import { NextResponse } from "next/server";
import bcryptjs from "bcryptjs";
import { sendNotificationMessage } from "@/lib/slackNotifications";

export const POST = async (request: Request) => {
  try {
    const { token, id, password } = await request.json();

    if (!password) {
      return NextResponse.json(
        { status: 400, message: "Password is required." }
      );
    }

    if (!token || !id) {
      return NextResponse.json(
        { status: 400, message: "Invalid or expired password reset link." }
      );
    }

    const user = await getMDBSingleData("users", {
      _id: id,
      forgotPasswordToken: token,
      forgotPasswordTokenExpiry: { $gt: Date.now() },
    });

    if (!user) {
      return NextResponse.json(
        { status: 400, message: "Invalid or expired password reset link." },
      );
    }

    if (user.isVerified === false) {
      return NextResponse.json(
        { status: 400, message: "Please verify your email before resetting your password." }
      );
    }

    if (!user) {
      return NextResponse.json(
        { status: 400, message: "Invalid or expired password reset link." }
      );
    }

    // 3. Hash new password
    const hashedPassword = await bcryptjs.hash(password, 10);

    // 4. Update user record
    await updateMDBData(
      "users",
      { _id: user._id },
      {
        password: hashedPassword,
        forgotPasswordToken: null,
        forgotPasswordTokenExpiry: null,
      }
    );

    const slackMessage = `Password reset for user with id: ${user._id} and email: ${user.email}`;
    await sendNotificationMessage(slackMessage);
    return NextResponse.json(
      { status: 200, message: "Your password has been reset successfully." },
      { status: 200 }
    );
  } catch (err: any) {
    return NextResponse.json(
      { status: 500, message: "Internal server error.", error: err?.message },
      { status: 500 }
    );
  }
};
