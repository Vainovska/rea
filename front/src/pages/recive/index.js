import "./index.css";
import Page from "../../component/page";
import Header from "../../component/header";
import Field from "../../component/field";
import Divider from "../../component/divider";
import { useState, useContext } from "react";
import { AuthContext } from "../../AuthProvider";
const RecivePage = () => {
  const [amount, setAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const { authState, dispatch } = useContext(AuthContext);
  const handleChange = (e) => setAmount(e.target.value);
  const handleRecive = async () => {
    try {
      const response = await fetch("/api/recive", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authState.token}`,
        },
        body: JSON.stringify({ amount, paymentMethod }),
      });
      const data = await response.json();
      if (response.ok) {
        alert(data.message);
        dispatch({
          type: "UPDATE_BALANCE",
          payload: authState.user.balance + parseFloat(amount),
        });
      } else {
        alert(data.message);
      }
    } catch (error) {
      alert("Error topping up balance");
    }
  };
  return (
    <Page>
      <Header title={"Receive"} />
      <form className="recive">
        <div className="recive__item">
          <h3 className="recive__title">Receive amount</h3>
          <Field
            label="Input sum"
            placeholder={"Input your sum"}
            value={amount}
            onChange={handleChange}
            disabled="none"
          />
        </div>

        <Divider />
        <div className="recive__item">
          <h3 className="recive__title">Payment system</h3>
          <button onClick={handleRecive} className="recive__card">
            <div
              className="recive__card-item"
              onChange={(e) => setPaymentMethod(e.target.value)}
              value="stripe"
            >
              <span className="recive__icon recive__icon--stripe"></span>
              <h3 className="recive__title">Stripe</h3>
            </div>
            <div className="recive__card-item">
              <span className="recive__icon recive__icon--stripe2"></span>
            </div>
          </button>
          <button onClick={handleRecive} className="recive__card">
            <div
              className="recive__card-item"
              value="stripe2"
              onChange={(e) => setPaymentMethod(e.target.value)}
            >
              <span className="recive__icon recive__icon--coin"></span>
              <h3 className="recive__title">Coinbase</h3>
            </div>
            <div className="recive__card-item">
              <span className="recive__icon recive__icon--coin2"></span>
            </div>
          </button>
        </div>
      </form>
    </Page>
  );
};
export default RecivePage;
