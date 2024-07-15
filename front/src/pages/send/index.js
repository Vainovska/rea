import Page from "../../component/page";
import Header from "../../component/header";
import Field from "../../component/field";
import FieldEmail from "../../component/field-email";
import Button from "../../component/button";
import { Alert } from "../../component/alert";
import { useState, useContext } from "react";
import { AuthContext } from "../../AuthProvider";
const SendPage = () => {
  const [email, setEmail] = useState("");
  const [amount, setAmount] = useState("");
  const { authState, dispatch } = useContext(AuthContext);

  const handleSend = async () => {
    try {
      const response = await fetch("http://localhost:4000/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authState.token}`,
        },
        body: JSON.stringify({ email, amount }),
      });
      const data = await response.json();
      if (response.ok) {
        alert(data.message);
        dispatch({
          type: "UPDATE_BALANCE",
          payload: authState.user.balance - parseFloat(amount),
        });
      } else {
        alert(data.message);
      }
    } catch (error) {
      alert("Error sending money");
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
      <Alert />
    </Page>
  );
};
export default SendPage;
