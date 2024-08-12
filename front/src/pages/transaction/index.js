import "./index.css";
import Page from "../../component/page";
import Header from "../../component/header";
import Divider from "../../component/divider";
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../AuthProvider";
const getDate = (time) => {
  const date = new Date(time);
  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const year = date.getFullYear();
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  return `${day}.${month}.${year} ${hours}:${minutes}`;
};
const TransactionPage = () => {
  const { transactionId } = useParams();
  const [transaction, setTransaction] = useState(null);
  const [loading, setLoading] = useState(true);
  const { token } = useAuth();
  const navigate = useNavigate();
  console.log(token);
  if (!token) {
    console.error("Token is undefined");
    navigate("/balance");
  }

  useEffect(() => {
    const fetchTransaction = async () => {
      try {
        const response = await fetch(
          `http://localhost:4000/transactions/${transactionId}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.message || "Error fetching transaction");
        }

        if (data.amount && data.date && data.id && data.type) {
          setTransaction(data);
        } else {
          console.error("Invalid transaction data:", data);
          alert("Invalid transaction data received");
          navigate("/balance");
        }
      } catch (error) {
        console.error("Error fetching transaction:", error);
        alert(`Error fetching transaction: ${error.message}`);
        return (
          <Page>
            <Header title={"Transaction"} />
            <div className="error-message">
              Error fetching transaction: {error.message}
            </div>
          </Page>
        );
      } finally {
        setLoading(false);
      }
    };

    fetchTransaction();
  }, [transactionId, token, navigate]);

  return (
    <Page>
      <Header title={"Transaction"} />
      {loading ? (
        <div>Loading...</div>
      ) : transaction ? (
        <div className="transaction">
          {transaction.type === "Recive" ? (
            <h1 className="transaction__sum receipt">
              +{transaction.amount} $
            </h1>
          ) : (
            <h1 className="transaction__sum ">-{transaction.amount} $</h1>
          )}
          <div className="transaction_desc">
            <div className="transaction__item">
              <span>Date</span>
              <span>{getDate(transaction.date)}</span>
            </div>
            <Divider />
            <div className="transaction__item">
              <span>Address</span>
              <span>
                {transaction.type === "Recive"
                  ? transaction.paymentMethod
                  : transaction.userEmail}
              </span>
            </div>
            <Divider />
            <div className="transaction__item">
              <span>Type</span>
              <span>{transaction.type}</span>
            </div>
          </div>
        </div>
      ) : (
        <div className="error-message">Transaction not found.</div>
      )}
    </Page>
  );
};

export default TransactionPage;
