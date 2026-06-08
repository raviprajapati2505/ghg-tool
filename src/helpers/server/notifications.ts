import { saveMDBData, getMDBData, updateMDBData } from "@/db/mongoQueries";

export const createNotification = async ({
  user_id,
  title,
  message,
  type,
  related_id,
}: {
  user_id: string;
  title: string;
  message: string;
  type: string;
  related_id?: string;
}) => {
  await saveMDBData("notifications", {
    user_id,
    title,
    message,
    type,
    related_id: related_id || null,
    is_read: false,
    created_at: new Date(),
  });
};

export const getNotifications = async (userId: string) => {
  const data = await getMDBData("notifications", {
    user_id: userId,
    $or: [{ is_deleted: { $ne: true } }, { is_deleted: { $exists: false } }],
  });
  return data;
};

export const markNotificationRead = async (notificationId: string) => {
  await updateMDBData("notifications", { _id: notificationId }, { is_read: true });
};

export const markAllNotificationsRead = async (userId: string) => {
  await updateMDBData(
    "notifications",
    { user_id: userId, is_read: false },
    { is_read: true },
    true
  );
};