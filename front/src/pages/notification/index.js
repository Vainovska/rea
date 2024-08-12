import "./index.css";
import React, { useEffect, useState } from "react";
import Page from "../../component/page";
import Header from "../../component/header";
import { useAuth } from "../../AuthProvider";

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState({
    list: [],
    isEmpty: true,
  });
  const state = useAuth();

  useEffect(() => {
    const getDate = (time) => {
      const now = new Date();
      const date = new Date(time);

      const diff = now - date; // різниця в мілісекундах

      const seconds = Math.floor(diff / 1000);
      const minutes = Math.floor(seconds / 60);
      const hours = Math.floor(minutes / 60);
      const days = Math.floor(hours / 24);

      if (days > 0) {
        return `${days} days ago`;
      } else if (hours > 0) {
        return `${hours} hours ago`;
      } else if (minutes > 0) {
        return `${minutes} minuts ago`;
      } else {
        return `${seconds} seconds ago`;
      }
    };
    const convertData = (raw) => {
      const list = raw.list
        ? raw.list.map(({ id, text, type, date }) => ({
            id,
            text,
            type,
            date: getDate(date),
          }))
        : [];
      return {
        list,
        isEmpty: list.length === 0,
      };
    };
    const fetchNotifications = async () => {
      if (!state.token) {
        console.log("Token is missing, cannot authenticate");
        return;
      }
      try {
        const response = await fetch(`http://localhost:4000/notification`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${state.token}`,
          },
          body: JSON.stringify({ notifications }),
        });
        if (response.ok) {
          const data = await response.json();
          setNotifications(convertData(data));
        } else {
          console.error(
            `Error fetching notifications: HTTP status ${response.status}`
          );
          throw new Error(`HTTP error! status: ${response.status}`);
        }
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };

    fetchNotifications();
  }, [state.token]);

  return (
    <Page>
      <Header title="Notifications" />
      <ul className="notification__list">
        {notifications.isEmpty ? (
          <li>No notifications available</li>
        ) : (
          notifications.list.map((notification) => (
            <li key={notification.id} className="notification__card">
              {notification.type === "Announc" ? (
                <div className="notification__icon announc"></div>
              ) : (
                <div className="notification__icon warning"></div>
              )}
              <div className="notification__desc">
                <span>
                  <p className="notification__title">{notification.text}</p>
                </span>
                <span>
                  <p className="notification__text ">
                    {notification.date}*{notification.type}
                  </p>
                </span>
              </div>
            </li>
          ))
        )}
      </ul>
    </Page>
  );
};

export default NotificationsPage;
