import { useState } from "react";
import { useAuth } from "../../AuthProvider";
import FieldEmail from "../../component/field-email";
import FieldPassword from "../../component/field-password";
import Button from "../../component/button";
import { Alert } from "../../component/alert";

const ChangeEmail = () => {
  const { token, dispatch } = useAuth();
  const [alert, setAlert] = useState({ status: "", message: "" });
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleChangeEmail = async (email, password) => {
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
      if (response.ok) {
        if (dispatch) {
          dispatch({ type: "UPDATE_EMAIL", payload: email });
        } else {
          console.error("dispatch function is not available");
        }
        setAlert({ status: "success", message: data.message });
        setEmail("");
        setPassword("");
      } else {
        setAlert({ status: "error", message: data.message });
      }
    } catch (error) {
      console.log(error);
      setAlert({ status: "error", message: "Error changing email" });
    }
  };

  return (
    <div className="setting-item">
      <h3 className="setting-title">Change email</h3>
      <FieldEmail
        label={"Email"}
        placeholder={"Input new e-mail"}
        name="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <FieldPassword
        label={"Your Password"}
        placeholder={"Input your password"}
        name="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <Button
        onClick={(e) => {
          e.preventDefault();
          handleChangeEmail(email, password);
        }}
        className={"button"}
        text={"Save Email"}
      />
      {alert.status && (
        <Alert status={`${alert.status}`} message={alert.message} />
      )}
    </div>
  );
};
export default ChangeEmail;
