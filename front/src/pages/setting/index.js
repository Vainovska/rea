import "./index.css";
import Page from "../../component/page";
import Header from "../../component/header";
import FieldEmail from "../../component/field-email";
import FieldPassword from "../../component/field-password";
import Button from "../../component/button";
import Divider from "../../component/divider";
import { Alert } from "../../component/alert";
import { useState } from "react";
import { useAuth } from "../../AuthProvider";
import { useNavigate } from "react-router-dom";

const SettingsPage = () => {
  const { token, user, logout, dispatch } = useAuth();
  const navigate = useNavigate();
  const [alert, setAlert] = useState({ status: "", message: "" });
  const [email, setEmail] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const handleChangePassword = async (oldPassword, newPassword) => {
    console.log("Token:", token); // Log token
    if (!token) {
      setAlert({
        status: "error",
        message: "Token is missing, cannot authenticate",
      });
      return;
    }

    try {
      const response = await fetch("http://localhost:4000/change-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ oldPassword, newPassword }),
      });
      const data = await response.json();
      console.log(data);
      if (response.ok) {
        dispatch({ type: "UPDATE_PASSWORD", payload: newPassword });
        setAlert({
          status: "success",
          message: "Password changed successfully",
        });
        setOldPassword("");
        setNewPassword("");
      } else {
        setAlert({ status: "error", message: data.message });
      }
    } catch (error) {
      console.error("Error changing password:", error); // Log error details
      setAlert({ status: "error", message: "Error changing password" });
    }
  };
  const handleChangeEmail = async (email, password) => {
    console.log(email, password);
    console.log("Token:", token);
    if (!token) {
      setAlert({
        status: "error",
        message: "Token is missing, cannot authenticate",
      });
      return;
    }

    try {
      const response = await fetch("http://localhost:4000/change-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      console.log(data);
      if (response.ok) {
        if (dispatch) {
          dispatch({ type: "UPDATE_EMAIL", payload: email });
        } else {
          console.error("dispatch function is not available");
        }
        setAlert({ status: "success", message: data.message });
        setEmail("");
        setOldPassword("");
      } else {
        setAlert({ status: "error", message: data.message });
      }
    } catch (error) {
      console.log(error);
      setAlert({ status: "error", message: "Error changing email" });
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/signin");
  };

  return (
    <Page>
      <Header title={"Settings"} />
      <div className="setting">
        <div className="setting-item">
          <h3 className="setting-title">Change email</h3>
          <FieldEmail
            label={"Email"}
            placeholder={"Input new e-mail"}
            name="email"
          />
          <FieldPassword
            label={"Your Password"}
            placeholder={"Input your password"}
            name="password"
          />
          <Button
            onClick={(e) => {
              e.preventDefault();
              const email = document.querySelector("input[name='email']").value;
              const password = document.querySelector(
                "input[name='password']"
              ).value;
              handleChangeEmail(email, password);
            }}
            className={"button"}
            text={"Save Email"}
          />
          {alert.status && (
            <Alert status={`${alert.status}`} message={alert.message} />
          )}
        </div>
        <Divider />
        <div className="setting-item">
          <h3 className="setting-title">Change password</h3>
          <FieldPassword
            label={"Old Password"}
            placeholder={"Input old password"}
            name="oldPassword"
          />
          <FieldPassword
            label={"New Password"}
            placeholder={"Input new password"}
            name="newPassword"
          />
          <Button
            onClick={(e) => {
              e.preventDefault();
              const oldPassword = document.querySelector(
                "input[name='oldPassword']"
              ).value;
              const newPassword = document.querySelector(
                "input[name='newPassword']"
              ).value;
              handleChangePassword(oldPassword, newPassword);
            }}
            className={"button"}
            text={"Save Password"}
          />
          {alert.status && (
            <Alert status={`${alert.status}`} message={alert.message} />
          )}
        </div>
        <Divider />
        <Button
          onClick={handleLogout}
          className={"button button__warning"}
          text={"Log out"}
        />
      </div>
    </Page>
  );
};

export default SettingsPage;
