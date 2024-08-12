import "./index.css";
import Page from "../../component/page";
import Header from "../../component/header";
import Field from "../../component/field";
import Divider from "../../component/divider";
import { Alert } from "../../component/alert";
import { useState } from "react";
import { useAuth } from "../../AuthProvider";
import { useNavigate } from "react-router-dom";

const RecivePage = () => {
  const [amount, setAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const { balance, token, updateBalance } = useAuth();
  const [alert, setAlert] = useState({ status: "", message: "" });
  const handleChange = (e) => setAmount(e.target.value);
  const navigate = useNavigate();
  const handleRecive = async (e) => {
    e.preventDefault();
    if (!amount || !paymentMethod) {
      setAlert({
        status: "error",
        message: "Please enter amount and select payment method",
      });
      return;
    }

    try {
      console.log("Sending request with:", { amount, paymentMethod });
      const response = await fetch("http://localhost:4000/recive", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ amount, paymentMethod }),
      });

      const data = await response.json();
      if (response.ok) {
        setAlert({ status: "success", message: data.message });
        updateBalance(data.newBalance);
        navigate("/balance");
      } else {
        console.error(`Server returned status ${response.status}:`, data);
        setAlert({ status: "error", message: data.message });
      }
    } catch (error) {
      console.error("Error caught in handleRecive:", error);
      setAlert({ status: "error", message: "Error topping up balance" });
    }
  };

  return (
    <Page>
      <Header title={"Receive"} />
      <form className="recive" onSubmit={handleRecive}>
        <div className="recive__item">
          <h3 className="recive__title">Receive amount</h3>
          <Field
            label="Input sum"
            placeholder={"Input your sum"}
            value={amount}
            onChange={handleChange}
          />
        </div>

        <Divider />
        <div className="recive__item">
          <h3 className="recive__title">Payment system</h3>
          <div className="recive__card">
            <div
              className="recive__card-item"
              onClick={() => setPaymentMethod("Stripe")}
            >
              <button type="submit" className="recive__button">
                <span className="recive__icon recive__icon--stripe"></span>
                <h3 className="recive__title">Stripe</h3>
                <span className="recive__icon recive__icon--stripe2"></span>
              </button>
            </div>
            <div
              className="recive__card-item"
              onClick={() => setPaymentMethod("Coinbase")}
            >
              <button type="submit" className="recive__button">
                <span className="recive__icon recive__icon--coin"></span>
                <h3 className="recive__title">Coinbase</h3>
                <span className="recive__icon recive__icon--coin2"></span>
              </button>
            </div>
          </div>

          {alert.status && (
            <Alert status={`${alert.status}`} message={alert.message} />
          )}
        </div>
      </form>
    </Page>
  );
};

export default RecivePage;
