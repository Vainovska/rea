import "./index.css";
import Page from "../../component/page";
import Header from "../../component/header";
import Divider from "../../component/divider";
import { useParams, useNavigate } from "react-router-dom";
import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../../AuthProvider";
const TransactionPage = () => {
  const { transactionId } = useParams();
  const [transaction, setTransaction] = useState(null);
  const { authState } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTransaction = async () => {
      try {
        const response = await fetch(
          `http://localhost:4000/transactions/${transactionId}`,
          {
            headers: {
              Authorization: `Bearer ${authState.token}`,
            },
          }
        );
        const data = await response.json();
        if (response.ok) {
          setTransaction(data);
        } else {
          alert(data.message);
          navigate("/balance");
        }
      } catch (error) {
        alert("Error fetching transaction");
        navigate("/balance");
      }
    };

    fetchTransaction();
  }, [transactionId, authState.token, navigate]);

  if (!transaction) {
    return <div>Loading...</div>;
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
            <span>Adress</span>
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
