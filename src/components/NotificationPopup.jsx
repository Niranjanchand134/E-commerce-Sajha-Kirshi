import React, { useState, useEffect, useCallback } from "react";
import { Badge, Popover, List, Avatar, Button } from "antd";
import { BellOutlined } from "@ant-design/icons";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";
import { useAuth } from "../Context/AuthContext";

const NotificationPopup = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [visible, setVisible] = useState(false);
  const [stompClient, setStompClient] = useState(null);

  // Fetch notifications with useCallback to memoize
  const fetchNotifications = useCallback(async () => {
    if (!user) return;

    try {
      const response = await fetch("http://localhost:8080/api/notifications", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const data = await response.json();
      setNotifications(data);
      setUnreadCount(data.filter((n) => !n.read).length);
    } catch (error) {
      console.error("Error fetching notifications:", error);
      message.error("Failed to load notifications");
    }
  }, [user]);

  useEffect(() => {

    if (!user) return;

    // Initial fetch
    fetchNotifications();

    // Setup WebSocket connection
    const socket = new SockJS("http://localhost:8080/ws");
    const client = new Client({
      webSocketFactory: () => socket,
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
      debug: (str) => console.log("STOMP: ", str),
    });

    client.onConnect = () => {
      console.log("Connected to WebSocket");

      // Subscribe to user-specific notifications
      client.subscribe(`/user/${user.id}/queue/notifications`, (message) => {
        const newNotification = JSON.parse(message.body);
        console.log("New notification received:", newNotification);

        setNotifications((prev) => [newNotification, ...prev]);
        setUnreadCount((prev) => prev + 1);
        showDesktopNotification(newNotification);
      });
    };

    client.onStompError = (frame) => {
      console.error("STOMP error:", frame.headers.message);
    };

    client.activate();
    setStompClient(client);

    return () => {
      if (client && client.connected) {
        client.deactivate();
      }
    };
  }, [user, fetchNotifications]);

  const showDesktopNotification = (notification) => {
    if ("Notification" in window && Notification.permission === "granted") {
      new Notification(notification.title, {
        body: notification.message,
        icon: "/logo.png",
      });
    }
  };

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
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await fetch("http://localhost:8080/api/notifications/mark-all-read", {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      setUnreadCount(0);
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
    }
  };

  const content = (
    <div style={{ width: 350, maxHeight: 400, overflowY: "auto" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          padding: "10px 15px",
          borderBottom: "1px solid #f0f0f0",
        }}
      >
        <h4>Notifications</h4>
        {unreadCount > 0 && (
          <Button type="link" size="small" onClick={markAllAsRead}>
            Mark all as read
          </Button>
        )}
      </div>
      <List
        itemLayout="horizontal"
        dataSource={notifications}
        renderItem={(notification) => (
          <List.Item
            style={{
              padding: "10px 15px",
              cursor: "pointer",
              backgroundColor: !notification.read ? "#f0f7ff" : "inherit",
            }}
            onClick={() => markAsRead(notification.id)}
          >
            <List.Item.Meta
              avatar={<Avatar src="/notification-icon.png" />}
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
              {new Date(notification.createdAt).toLocaleTimeString()}
            </div>
          </List.Item>
        )}
      />
      <div style={{ textAlign: "center", padding: "10px 0" }}>
        <Button
          type="link"
          onClick={() => (window.location.href = "/notifications")}
        >
          View all notifications
        </Button>
      </div>
    </div>
  );

  return (
    <Popover
      content={content}
      title={null}
      trigger="click"
      visible={visible}
      onVisibleChange={(visible) => {
        setVisible(visible);
        if (!visible && unreadCount > 0) {
          markAllAsRead();
        }
      }}
      placement="bottomRight"
      overlayStyle={{ padding: 0 }}
    >
      <Badge count={unreadCount} overflowCount={9}>
        <i
          className="fa-solid fa-bell text-xl text-gray-700 hover:text-black cursor-pointer"
        ></i>
      </Badge>
    </Popover>
  );
};

export default NotificationPopup;
