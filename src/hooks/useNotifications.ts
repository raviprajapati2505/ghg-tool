import { useEffect, useState, useCallback } from "react";

export function useNotifications() {
  const [notifications, setNotifications] = useState<any[]>([]);

  useEffect(() => {
    const eventSource = new EventSource("/api/notifications/stream");

    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setNotifications(data);
    };

    eventSource.onerror = () => {
      eventSource.close();
    };

    return () => eventSource.close();
  }, []);

  const markAsRead = async (id: string) => {
    await fetch(`/api/notifications/${id}`, { method: "PUT" });
    setNotifications(prev =>
      prev.map(n => n._id === id ? { ...n, is_read: true } : n)
    );
  };

  const markAllRead = async () => {
    await fetch("/api/notifications", { method: "PUT" });
    setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
  };

  const unreadCount = notifications.filter(n => !n.is_read).length;

  return { notifications, unreadCount, markAsRead, markAllRead };
}