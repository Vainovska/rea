import "./index.css";
import Page from "../../component/page";
import Header from "../../component/header";
import FieldEmail from "../../component/field-email";
import FieldPassword from "../../component/field-password";
import Button from "../../component/button";
import Divider from "../../component/divider";
import { useState, useContext } from "react";
import { AuthContext } from "../../AuthProvider";
import { useNavigate } from "react-router-dom";
const SettingsPage = () => {
  const [newPassword, setNewPassword] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const { authState, dispatch } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChangePassword = async () => {
    try {
      const response = await fetch("http://localhost:4000/change-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authState.token}`,
        },
        body: JSON.stringify({ newPassword }),
      });
      const data = await response.json();
      if (response.ok) {
        alert(data.message);
      } else {
        alert(data.message);
      }
    } catch (error) {
      alert("Error changing password");
    }
  };

  const handleChangeEmail = async () => {
    try {
      const response = await fetch("http://localhost:4000/change-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authState.token}`,
        },
        body: JSON.stringify({ newEmail }),
      });
      const data = await response.json();
      if (response.ok) {
        dispatch({ type: "UPDATE_EMAIL", payload: newEmail });
        alert(data.message);
      } else {
        alert(data.message);
      }
    } catch (error) {
      alert("Error changing email");
    }
  };

  const handleLogout = () => {
    dispatch({ type: "LOGOUT" });
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
            onChange={(e) => setNewEmail(e.target.value)}
          />
          <FieldPassword
            label={"Your Password"}
            placeholder={"Input your password"}
          />
          <Button
            onClick={handleChangeEmail}
            className={"button"}
            text={"Save Email"}
          />
        </div>
        <Divider />
        <div className="setting-item">
          <h3 className="setting-title">Change password</h3>
          <FieldPassword
            label={"Old Password"}
            placeholder={"Input old password"}
          />
          <FieldPassword
            label={"New Password"}
            placeholder={"Input new password"}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <Button
            onClick={handleChangePassword}
            className={"button"}
            text={"Save Password"}
          />
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
