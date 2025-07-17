import React, { useState, useEffect } from "react";
import { List, Avatar, Button, Badge } from "antd";
import { BellOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

const NotificationPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await fetch(
          "http://localhost:8080/api/notifications",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        const data = await response.json();
        setNotifications(data);
        setLoading(false);

        // Mark all as read when page loads
        await fetch("http://localhost:8080/api/notifications/mark-all-read", {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
      } catch (error) {
        console.error("Error fetching notifications:", error);
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  const markAsRead = async (notificationId) => {
    try {
      await fetch(
        `http://localhost:8080/api/notifications/${notificationId}/read`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      setNotifications((prev) =>
        prev.map((n) => (n.id === notificationId ? { ...n, read: true } : n))
      );
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Notifications</h1>
        <Button type="primary" onClick={() => navigate(-1)}>
          Back
        </Button>
      </div>

      <List
        itemLayout="horizontal"
        dataSource={notifications}
        loading={loading}
        renderItem={(notification) => (
          <List.Item
            style={{
              padding: "12px 16px",
              cursor: "pointer",
              backgroundColor: !notification.read ? "#f0f7ff" : "inherit",
              borderRadius: "8px",
              marginBottom: "8px",
            }}
            onClick={() => {
              markAsRead(notification.id);
              // Add navigation logic based on notification type if needed
            }}
          >
            <List.Item.Meta
              avatar={
                <Badge dot={!notification.read}>
                  <Avatar
                    icon={<BellOutlined />}
                    style={{ backgroundColor: "#1890ff" }}
                  />
                </Badge>
              }
              title={
                <span
                  style={{ fontWeight: notification.read ? "normal" : "bold" }}
                >
                  {notification.title}
                </span>
              }
              description={notification.message}
            />
            <div style={{ fontSize: 12, color: "#888" }}>
              {new Date(notification.createdAt).toLocaleString()}
            </div>
          </List.Item>
        )}
      />
    </div>
  );
};

export default NotificationPage;
