import { BellOutlined } from "@ant-design/icons";
import { Menu, Avatar, Badge, Dropdown } from "antd";
import React, { useEffect, useState } from "react";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";

const Notifications = () => {

    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [stompClient, setStompClient] = useState(null);

    useEffect(() => {
      // Fetch initial notifications
      
      fetchNotifications();
      fetchUnreadCount();

      // Setup WebSocket connection
      setupWebSocket();

      // Request notification permission
      requestNotificationPermission();

      return () => {
        if (stompClient) {
          stompClient.disconnect();
        }
      };
    }, []);

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

        if (response.ok) {
          const data = await response.json();
          setNotifications(data);
        }
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };

    const fetchUnreadCount = async () => {
      try {
        const response = await fetch(
          "http://localhost:8080/api/notifications/unread-count",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          setUnreadCount(data.unreadCount);
        }
      } catch (error) {
        console.error("Error fetching unread count:", error);
      }
    };

    const setupWebSocket = () => {
      const socket = new SockJS("/ws");
      const client = new Client({
        webSocketFactory: () => socket,
        onConnect: () => {
          console.log("Connected to WebSocket");

          // Subscribe to user-specific notifications
          const userId = getUserIdFromToken(); // Implement this function
          client.subscribe(
            `http://localhost:8080/user/${userId}/topic/notifications`,
            (message) => {
              const notification = JSON.parse(message.body);
              handleNewNotification(notification);
            }
          );
        },
        onDisconnect: () => {
          console.log("Disconnected from WebSocket");
        },
      });

      client.activate();
      setStompClient(client);
    };




    const handleNewNotification = (notification) => {
      // Add to notifications list
      setNotifications((prev) => [notification, ...prev]);

      // Update unread count
      setUnreadCount((prev) => prev + 1);

      // Show browser notification
      showBrowserNotification(notification);
    };

    const showBrowserNotification = (notification) => {
      if (Notification.permission === "granted") {
        new Notification(notification.title, {
          body: notification.message,
          icon: "/path/to/your/icon.png", // Add your app icon
          badge: "/path/to/your/badge.png",
        });
      }
    };

    const requestNotificationPermission = () => {
      if ("Notification" in window && Notification.permission === "default") {
        Notification.requestPermission();
      }
    };

    const markAsRead = async (notificationId) => {
      try {
        const response = await fetch(
          `/api/notifications/${notificationId}/read`,
          {
            method: "PATCH",
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        if (response.ok) {
          setNotifications((prev) =>
            prev.map((n) =>
              n.id === notificationId ? { ...n, read: true } : n
            )
          );
          setUnreadCount((prev) => Math.max(0, prev - 1));
        }
      } catch (error) {
        console.error("Error marking notification as read:", error);
      }
    };

    const markAllAsRead = async () => {
      try {
        const response = await fetch("/api/notifications/mark-all-read", {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (response.ok) {
          setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
          setUnreadCount(0);
        }
      } catch (error) {
        console.error("Error marking all notifications as read:", error);
      }
    };

    const getUserIdFromToken = () => {
      // Implement token parsing to get user ID
      // This is a placeholder - implement based on your JWT structure
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const payload = JSON.parse(atob(token.split(".")[1]));
          return payload.userId || payload.sub;
        } catch (e) {
          console.error("Error parsing token:", e);
        }
      }
      return null;
    };

  const renderNotificationContent = (notification) => {
    return (
      <div
        className={`w-full ps-3 ${!notification.read ? "bg-blue-50" : ""}`}
        onClick={() => !notification.read && markAsRead(notification.id)}
      >
        <div className="text-gray-900 font-medium text-sm mb-1 dark:text-white">
          {notification.title}
        </div>
        <div className="text-gray-600 text-xs mb-1.5 dark:text-gray-400">
          {notification.message}
        </div>
        <div className="text-xs text-blue-600 dark:text-blue-500">
          {new Date(notification.createdAt).toLocaleString()}
        </div>
      </div>
    );
  };

  const notificationMenu = (
    <div className="w-96 max-w-sm bg-white divide-y divide-gray-100 rounded-lg shadow-lg dark:bg-gray-800 dark:divide-gray-700">
      <div className="flex justify-between items-center px-4 py-3 font-medium text-center text-gray-700 rounded-t-lg bg-gray-50 dark:bg-gray-800 dark:text-white">
        <span>Notifications</span>
        {unreadCount > 0 && (
          <Button
            type="link"
            size="small"
            onClick={markAllAsRead}
            className="text-blue-600 p-0"
          >
            Mark all as read
          </Button>
        )}
      </div>

      <div className="max-h-96 overflow-y-auto divide-y divide-gray-100 dark:divide-gray-700">
        {notifications.length > 0 ? (
          notifications.map((notification) => (
            <div
              key={notification.id}
              className={`flex px-4 py-3 hover:bg-gray-50 cursor-pointer dark:hover:bg-gray-700 ${
                !notification.read ? "bg-blue-50 dark:bg-blue-900/20" : ""
              }`}
              onClick={() => !notification.read && markAsRead(notification.id)}
            >
              <div className="shrink-0 mr-3">
                <div
                  className={`w-2 h-2 mt-2 rounded-full ${
                    !notification.read ? "bg-blue-500" : "bg-transparent"
                  }`}
                />
              </div>
              {renderNotificationContent(notification)}
            </div>
          ))
        ) : (
          <div className="px-4 py-6 text-center text-gray-500 dark:text-gray-400">
            No notifications yet
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div>
      <Dropdown
        overlay={notificationMenu}
        trigger={["click"]}
        placement="bottomRight"
      >
        <Badge count={unreadCount} overflowCount={99}>
          <Avatar
            className="dropdown cursor-pointer hover:bg-gray-100"
            icon={<BellOutlined />}
          />
        </Badge>
      </Dropdown>
    </div>
  );
};

export default Notifications;
