import Page from "../../component/page";
import Header from "../../component/header";
import Field from "../../component/field";
import FieldEmail from "../../component/field-email";
import Button from "../../component/button";
import { Alert } from "../../component/alert";
import { useState } from "react";
import { useAuth } from "../../AuthProvider";
import { useNavigate } from "react-router-dom";
const SendPage = () => {
  const [email, setEmail] = useState("");
  const [amount, setAmount] = useState("");
  const { balance, token, updateBalance } = useAuth();
  const [alert, setAlert] = useState({ status: "", message: "" });
  const navigate = useNavigate();
  const handleSend = async () => {
    try {
      const response = await fetch("http://localhost:4000/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ email, amount }),
      });
      const data = await response.json();
      if (response.ok) {
        console.log("Response data:", data);
        setAlert({ status: "success", message: data.message });
        updateBalance(data.newBalance);
        navigate("/balance");
      } else {
        console.error(`Server returned status ${response.status}:`, data);
        setAlert({ status: "error", message: data.message });
      }
    } catch (error) {
      setAlert({ status: "error", message: error.message });
    }
  };

  return (
    <Page>
      <Header title={"Send"} />
      <FieldEmail
        label={"Email"}
        placeholder={"Input e-mail"}
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <Field
        label={"Sum:"}
        placeholder={"Input sum"}
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />
      <Button
        onClick={handleSend}
        className={"button button__dark"}
        text={"Send"}
      />
      {alert.status && (
        <Alert status={`${alert.status}`} message={alert.message} />
      )}
    </Page>
  );
};
export default SendPage;
