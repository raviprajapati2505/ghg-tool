import { NextResponse, NextRequest } from "next/server";
import { sendEmail } from "@/helpers/server/mailer";
import { getMDBSingleData, updateMDBData } from "@/db/mongoQueries";
import crypto from "crypto";

export const POST = async (request: NextRequest) => {
  try {
    const { email } = await request.json();

    // Validate input
    if (!email) {
      return NextResponse.json({ status: 400, message: "Email is required." });
    }

    // Find user
    const existingUser = await getMDBSingleData("users", { email });
    if (!existingUser) {
      return NextResponse.json({
        status: 400,
        message: "This email is not registered in our system.",
      });
    }

    if (existingUser.isVerified === false) {
      return NextResponse.json({
        status: 400,
        message: "Please verify your email before resetting your password.",
      });
    }
    const tokenCreationTime = existingUser.forgotPasswordTokenExpiry ? existingUser.forgotPasswordTokenExpiry - 22 * 60 * 60 * 1000 : Date.now();
    if (existingUser?.forgotPasswordToken && tokenCreationTime > Date.now()) {
      return NextResponse.json({
        status: 400,
        message: "Rest password link already sent. Please check your email. If you did not receive the email, please try again after 2 hours.",
      });
    }

    // Generate token
    const token = crypto.randomBytes(32).toString("hex");
    const tokenHash = crypto.createHash("sha256").update(token).digest("hex");
    const expiresAt = Date.now() + 24 * 60 * 60 * 1000;

    // Update user record
    await updateMDBData(
      "users",
      { _id: existingUser._id },
      {
        forgotPasswordToken: tokenHash,
        forgotPasswordTokenExpiry: expiresAt,
      }
    );

    // Generate reset link
    const domain = process.env.DOMAIN;
    if (!domain) {
      return NextResponse.json({
        status: 500,
        message: "Server configuration error: DOMAIN is missing.",
      });
    }
    const resetUrl = `${domain}/reset-password?token=${tokenHash}&id=${existingUser._id}`;

    // Email content
    const htmlBody = `
      <p>We received a request to reset your password.</p>
      <p>Click the button below to set a new password:</p>
      <p>
        <a href="${resetUrl}" 
           style="background-color: #007bff; color: #fff; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
           Reset Password
        </a>
      </p>
      <p>If the button doesn't work, copy and paste this URL into your browser:</p>
      <p> ${resetUrl} </p>
      <p>If you did not request a password reset, you can safely ignore this email.</p>
    `;

    // Send email
    await sendEmail({
      to: email,
      subject: "Password Reset Request",
      html: htmlBody,
    });

    return NextResponse.json({
      status: 200,
      message: "Reset password link sent successfully. Please check your email.",
    });
  } catch (error: any) {
    return NextResponse.json({
      status: 500,
      message: "An unexpected error occurred.",
      error: error?.message || error,
    });
  }
};
