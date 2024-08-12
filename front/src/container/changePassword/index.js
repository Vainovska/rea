import { useState } from "react";
import { useAuth } from "../../AuthProvider";
import FieldPassword from "../../component/field-password";
import Button from "../../component/button";
import { Alert } from "../../component/alert";

const ChangePassword = () => {
  const { token, dispatch } = useAuth();
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [alert, setAlert] = useState({ status: "", message: "" });

  const handleChangePassword = async (oldPassword, newPassword) => {
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

      if (response.ok) {
        if (dispatch) {
          dispatch({ type: "UPDATE_PASSWORD", payload: newPassword });
        } else {
          console.error("dispatch function is not available");
        }
        setAlert({
          status: "success",
          message: data.message,
        });
        setOldPassword("");
        setNewPassword("");
      } else {
        setAlert({ status: "error", message: data.message });
      }
    } catch (error) {
      setAlert({ status: "error", message: "Error changing password" });
    }
  };

  return (
    <div className="setting-item">
      <h3 className="setting-title">Change password</h3>
      <FieldPassword
        label={"Old Password"}
        placeholder={"Input old password"}
        name="oldPassword"
        onChange={(e) => setOldPassword(e.target.value)}
      />
      <FieldPassword
        label={"New Password"}
        placeholder={"Input new password"}
        name="newPassword"
        onChange={(e) => setNewPassword(e.target.value)}
      />
      <Button
        onClick={(e) => {
          e.preventDefault();
          handleChangePassword(oldPassword, newPassword);
        }}
        className={"button"}
        text={"Save Password"}
      />
      {alert.status && (
        <Alert status={`${alert.status}`} message={alert.message} />
      )}
    </div>
  );
};

export default ChangePassword;
