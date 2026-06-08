import bcryptjs from "bcryptjs";
import { NextResponse, NextRequest } from "next/server";
import { sendEmail } from "@/helpers/server/mailer";
import { getMDBSingleData, saveMDBData } from "@/db/mongoQueries";
import crypto from "crypto";

export const POST = async (request: NextRequest) => {
  try {
    const requestData = await request.json();

    if (!requestData?.email || !requestData?.password) {
      return NextResponse.json({
        status: 400,
        message: "Email and password are required.",
      });
    }
    const normalizedUserEmail = requestData?.email.trim().toLowerCase();
    const normalizedOrganizationEmail = requestData?.organization_email.trim().toLowerCase();

    const existingUser = await getMDBSingleData("users", { email: normalizedUserEmail });
    if (existingUser) {
      return NextResponse.json({
        status: 400,
        message: "Email is already registered.",
      });
    }

    const userDomain = normalizedUserEmail.split("@")[1];
    const domainUser = await getMDBSingleData("users", {
      email: { $regex: `@${userDomain}$`, $options: "i" },
    });

    if (domainUser) {
      return NextResponse.json({
        status: 400,
        message: "This user has already been registered with this domain. Please contact your organization's administrator.",
      });
    }

    const organizationDomain = normalizedOrganizationEmail.split("@")[1];
    const domainOrganization = await getMDBSingleData("organizations", {
      email: { $regex: `@${organizationDomain}$`, $options: "i" },
    });

    if (domainOrganization) {
      return NextResponse.json({
        status: 400,
        message: "This organization has already been registered with this domain. Please contact your organization's administrator.",
      });
    }

    const token = crypto.randomBytes(32).toString("hex");
    const tokenHash = crypto.createHash("sha256").update(token).digest("hex");
    const expiry = Date.now() + 24 * 60 * 60 * 1000; // 24 hours

    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(requestData?.password, salt);

    const organizationData = {
      name: requestData?.organization_name || "",
      email: normalizedOrganizationEmail || "",
      phone: requestData?.organization_phone || "",
      address: requestData?.organization_address || "",
      country: requestData?.organization_country || "",
      city: requestData?.organization_city || "",
      sector: requestData?.organization_sector || "",
      isVerified: true,
      status: "Active",
    };
    const saveOrganization = await saveMDBData("organizations", organizationData);

    if (!saveOrganization) {
      return NextResponse.json({
        status: 500,
        message: "Server error: Failed to save company data.",
      });

    }

    const userData = {
      name: requestData?.name || "",
      phone: requestData?.phone_number || "",
      designation: requestData?.designation || "",
      email: normalizedUserEmail,
      role_id: "693d00c077dcb901a58d53f2",
      password: hashedPassword,
      isVerified: false,
      status: "Active",
      verifyToken: tokenHash,
      verifyTokenExpiry: expiry,
    };

    const savedUser = await saveMDBData("users", userData);

    const domainEnv = process.env.DOMAIN;
    if (!domainEnv) {
      return NextResponse.json({
        status: 500,
        message: "Server error: DOMAIN is not configured.",
      });
    }

    const verifyUrl = `${domainEnv}/verify-email?token=${tokenHash}&id=${savedUser._id}`;

    const htmlBody = `
      <p>Welcome! Please verify your email address.</p>
      <p>Click the button below to complete your registration:</p>
      <p>
        <a href="${verifyUrl}" 
           style="background-color: #007bff; color: #fff; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
           Verify Email
        </a>
      </p>
      <p>If the button doesn't work, copy and paste this link into your browser:</p>
      <p> ${verifyUrl} </p>
      <p>If you did not create an account, you can safely ignore this email.</p>
    `;


    await sendEmail({
      to: normalizedUserEmail,
      subject: "Verify Your Email Address",
      html: htmlBody,
    });

    return NextResponse.json({
      status: 200,
      message:
        "Registration successful. Please check your email to verify your account.",
    });
  } catch (err: any) {
    return NextResponse.json({
      status: 500,
      message: "An unexpected error occurred.",
      error: err?.message || err,
    });
  }
};
