import "./index.css";
import Page from "../../component/page";
import Header from "../../component/header";
import Divider from "../../component/divider";
import { useParams, useNavigate } from "react-router-dom";
import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../../AuthProvider";

// Custom hook for fetching transaction data
const useTransaction = (transactionId, token, navigate) => {
  const [transaction, setTransaction] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTransaction = async () => {
      try {
        const response = await fetch(
          `http://localhost:4000/transactions/${transactionId}`,
          {
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

        if (data.amount && data.createdAt && data.id && data.type) {
          setTransaction(data);
        } else {
          console.error("Invalid transaction data:", data);
          alert("Invalid transaction data received");
          navigate("/balance");
        }
      } catch (error) {
        console.error("Error fetching transaction:", error);
        alert("Error fetching transaction");
        navigate("/balance");
      } finally {
        setLoading(false);
      }
    };

    fetchTransaction();
  }, [transactionId, token, navigate]);

  return { transaction, loading };
};

// TransactionPage Component
const TransactionPage = () => {
  const { transactionId } = useParams();
  const { authState } = useContext(AuthContext);
  const navigate = useNavigate();

  const { transaction, loading } = useTransaction(
    transactionId,
    authState.token,
    navigate
  );

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!transaction) {
    return <div>Error loading transaction</div>;
  }

  return (
    <Page>
      <Header title={"Transaction"} />
      <div className="transaction">
        <h1 className="transaction__sum receipt">{transaction.amount}</h1>
        <div className="transaction_desc">
          <div className="transaction__item">
            <span>Date</span>
            <span>{new Date(transaction.createdAt).toLocaleString()}</span>
          </div>
          <Divider />
          <div className="transaction__item">
            <span>Address</span>
            <span>{transaction.id}</span>
          </div>
          <Divider />
          <div className="transaction__item">
            <span>Type</span>
            <span>{transaction.type}</span>
          </div>
          <Divider />
        </div>
      </div>
    </Page>
  );
};

export default TransactionPage;
