import "./index.css";
import Page from "../../component/page";
import Header from "../../component/header";
import { useState, useContext, useEffect } from "react";
import { AuthContext } from "../../AuthProvider";
const NotificationsPage = () => {
  const [notifications, setNotifications] = useState([]);
  const { authState } = useContext(AuthContext);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await fetch("http://localhost:4000/notifications", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authState.token}`,
          },
        });
        const data = await response.json();
        setNotifications(data);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };

    fetchNotifications();
  }, [authState.token]);
  return (
    <Page>
      <Header title={"Notifications"} />
      <ul>
        {notifications.map((notification) => (
          <li key={notification._id} className="notification__card">
            <span className="{className}"></span>
            <div className="notification__desc">
              <span className="notification__title">'title'</span>
              <p className="notification__text">{notification.message}</p>
              <small>{new Date(notification.createdAt).toLocaleString()}</small>
            </div>
          </li>
        ))}
      </ul>
    </Page>
  );
};
export default NotificationsPage;
