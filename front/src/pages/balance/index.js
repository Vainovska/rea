import "./index.css";
import { useEffect, useState } from "react";
import { useContext } from "react";
import { AuthContext } from "../../AuthProvider";
import { Link } from "react-router-dom";
import Page from "../../component/page";
const BalancePage = () => {
  const [transactions, setTransactions] = useState([]);
  const { authState } = useContext(AuthContext);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await fetch("http://localhost:4000/transactions", {
          headers: {
            Authorization: `Bearer ${authState.token}`,
          },
        });
        const data = await response.json();
        if (response.ok) {
          setTransactions(data);
        } else {
          alert(data.message);
        }
      } catch (error) {
        alert("Error fetching transactions");
      }
    };

    fetchTransactions();
  }, [authState.token]);

  return (
    <Page>
      <header className="balance__header">
        <div className="header__top">
          <span className="icon icon__setting"></span>
          <span className="header__title">Main wallet</span>
          <span className="icon icon__notification"></span>
        </div>
        <div className="balance">`${authState.user.balance}`</div>
        <div className="list-button">
          <div className="item-button">
            <button className="button__balance">
              <span className="button__receive"></span>
            </button>
            <span className="button__text">Receive</span>
          </div>
          <div className="item-button">
            <button className="button__balance">
              <span className="button__send"></span>
            </button>
            <span>Send</span>
          </div>
        </div>
      </header>
      <div>
        <ul>
          {transactions.map((transaction) => (
            <li key={transaction.id}>
              <Link to={`/transaction/${transaction._id}`}>
                <p>Date: {transaction.date}</p>
                <p>Type: {transaction.type}</p>
                <p>Amount: {transaction.amount}</p>
                <p>Description: {transaction.paymentMethod}</p>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </Page>
  );
};
export default BalancePage;
