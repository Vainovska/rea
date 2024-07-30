import React, { useEffect, useState } from "react";
import { useAuth } from "../../AuthProvider";
import Page from "../../component/page";
import Header from "../../component/header";

const NotificationsPage = () => {
  const state = useAuth();
  const [notifications, setNotifications] = useState([]);
  console.log("State:", state, "Token", state.token);
  useEffect(() => {
    if (state.isAuthenticated && state.token) {
      const fetchNotifications = async () => {
        try {
          const response = await fetch("http://localhost:4000/notification", {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${state.token}`,
            },
          });

          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }

          const data = await response.json();
          console.log("Fetched notifications:", data);
          if (Array.isArray(data)) {
            setNotifications(data);
          } else {
            console.error("Received data is not an array:", data);
          }
        } catch (error) {
          console.error("Error fetching notifications:", error);
        }
      };
      fetchNotifications();
    } else {
      console.error("User is not authenticated or token is missing");
    }
  }, [state.isAuthenticated, state.token]);

  useEffect(() => {
    console.log("Notifications in state:", notifications);
  }, [notifications]);

  return (
    <Page>
      <Header title="Notifications" />
      <ul>
        {notifications.length > 0 ? (
          notifications.map((notification) => (
            <li key={notification.id}>
              <p>{notification.text}</p>
            </li>
          ))
        ) : (
          <li>No notifications available</li>
        )}
      </ul>
    </Page>
  );
};

export default NotificationsPage;
