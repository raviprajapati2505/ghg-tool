import { saveMDBData, updateMDBData, getMDBData, aggregateWithJoins, getMDBSingleData } from "@/db/mongoQueries";
import { sendEmail } from "@/helpers/server/mailer";
import { getRoleByIdAndName, Roles } from "@/utils/roleAndPermission";
import { generateRandomPassword } from "@/helpers/server/function";
import bcryptjs from "bcryptjs";
import { addAuditLog } from "./auditLogs";

const modal = "users";

export const getUsers = async (data: Record<string, any>, authUser: any) => {
    try {
        const authRoleId = authUser?.role_id?.toString() ?? null;
        const authUserId = authUser?._id?.toString() ?? null;
        var where: Record<string, any> = {
            _id: { $ne: authUserId },
            $or: [
                { is_deleted: { $ne: true } },
                { is_deleted: { $exists: false } }
            ]
        };
        const users = await getMDBData(modal, where);
        if (!users) {
            return {
                message: "Data not found.",
                status: 404,
                data: {},
            };
        }
        const superAdminRoleId = Roles.AdminId;
        let filteredUsers = users;

        if (authRoleId !== superAdminRoleId) {
            filteredUsers = users.filter((user: any) => {
                const userRoleId = user.role_id?.toString() || user.role_id;
                return userRoleId !== superAdminRoleId;
            });
        }
        return {
            message: "Data fetched successfully.",
            status: 200,
            data: filteredUsers,
        };
    } catch (error) {
        return {
            message: "something went wrong. Please try again.",
            status: 400,
            data: {},
        };
    }
};

export const addUser = async (data: Record<string, any>, authUser: any) => {
    try {
        const authRoleId = authUser?.role_id?.toString() ?? null;
        const authUserId = authUser?._id?.toString() ?? null;
        const normalizedUserEmail = data?.email.trim().toLowerCase();
        const existingUser = await getMDBSingleData("users", { email: normalizedUserEmail });
        if (existingUser) {
            return {
                message: "Email is already registered.",
                status: 400,
                data: {}
            };
        }

        const randomPassword = generateRandomPassword(8);
        const hashedPassword = await bcryptjs.hash(randomPassword, 10);
        const userData = {
            name: data?.name || "",
            phone_number: data?.phone_number || "",
            designation: data?.designation || "",
            email: normalizedUserEmail || "",
            role_id: data?.role_id,
            password: hashedPassword,
            isVerified: true,
            status: "Active",
        };

        const resData = await saveMDBData(modal, userData);
        if (!resData) {
            return {
                message: "Failed to add user.",
                status: 400,
                data: {}
            };
        }


        await addAuditLog({
            collection: modal,
            action_type: "added",
            description: `User added.`,
            metadata: { user_id: resData?._id?.toString() },
        }, authUser);

        const subject = "Your Account Details";
        const htmlBody = `
                        <p>Hello,</p>
                        <p>Your account has been created successfully.</p>
                        <p><strong>Email:</strong> ${normalizedUserEmail}</p>
                        <p><strong>Password:</strong> 
                            <span style="font-size:18px;font-weight:bold;color:#2d3748;">
                            ${randomPassword}
                            </span>
                        </p>
                        <p>You may access your account using the following link: <br/>
                            <a href="${process.env.DOMAIN}/login">${process.env.DOMAIN}/login</a>
                        </p>
                        <p>For security reasons, we recommend changing your password after your first login.</p>
                        <p>If you have any questions or need assistance, please feel free to contact us.</p>
                        <p>Kind regards,<br/>Support Team</p>
                        `;

        await sendEmail({
            to: normalizedUserEmail,
            html: htmlBody,
            subject,
        });
        return {
            message: "User added successfully.",
            status: 200,
            data: resData
        };

    } catch (error) {
        return {
            message: "Something went wrong while adding user.",
            status: 400,
            data: {},
        };
    }
};

export const updateUser = async (data: Record<string, any>, authUser: any) => {
    try {

        const authRoleId = authUser?.role_id?.toString() ?? null;
        const authUserId = authUser?._id?.toString() ?? null;

        const userId = data?.id;
        if (!userId) {
            return {
                message: "User not found.",
                status: 404,
                data: {},
            };
        }
        const userData = {
            name: data?.name || "",
            phone_number: data?.phone_number || "",
            designation: data?.designation || "",
            role_id: data?.role_id,
        };

        const resData = await updateMDBData(modal, { _id: userId }, userData);
        if (!resData) {
            return {
                message: "Failed to update user.",
                status: 400,
                data: {}
            };
        }

        await addAuditLog({
            collection: modal,
            action_type: "updated",
            description: `User updated.`,
            metadata: { user_id: userId },
        }, authUser);

        return {
            message: "User updated successfully.",
            status: 200,
            data: {},
        };
    } catch (error) {
        return {
            message: "Something went wrong while updating user.",
            status: 400,
            data: {},
        };
    }
};

export const toggleUserStatus = async (data: Record<string, any>, authUser: any) => {
    try {
        const authUserId = authUser?._id?.toString() ?? null;
        const userId = data?.id;

        if (!userId) {
            return { message: "User not found.", status: 404, data: {} };
        }

        if (authUserId === userId.toString()) {
            return { message: "You cannot change your own status.", status: 400, data: {} };
        }

        const user = await getMDBSingleData(modal, { _id: userId });
        if (!user) {
            return { message: "User not found.", status: 404, data: {} };
        }

        const newStatus = user.status === "Active" ? "Inactive" : "Active";

        await updateMDBData(modal, { _id: userId }, { status: newStatus });

        await addAuditLog({
            collection: modal,
            action_type: "user_status_changed",
            description: `User status changed to ${newStatus}.`,
            metadata: { user_id: userId },
        }, authUser);

        return {
            message: `User ${newStatus === "Active" ? "enabled" : "disabled"} successfully.`,
            status: 200,
            data: { status: newStatus },
        };
    } catch (error) {
        return { message: "Something went wrong while updating user status.", status: 400, data: {} };
    }
};

export const getAssignableUsers = async (data: Record<string, any>, authUser: any) => {
    try {
        const where: Record<string, any> = {
            role_id: Roles.DataEntryId,
            status: "Active",
            $or: [
                { is_deleted: { $ne: true } },
                { is_deleted: { $exists: false } }
            ]
        };

        const users = await getMDBData(modal, where);

        return {
            message: "Data fetched successfully.",
            status: 200,
            data: users || [],
        };
    } catch (error) {
        return {
            message: "Something went wrong. Please try again.",
            status: 400,
            data: {},
        };
    }
};