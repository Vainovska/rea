import "./index.css";
import { useEffect, useState } from "react";
import { useAuth } from "../../AuthProvider";
import { Link, useNavigate } from "react-router-dom";
import Page from "../../component/page";

const BalancePage = () => {
  const [transactions, setTransactions] = useState({ list: [], isEmpty: true });
  const { token, balance, updateBalance } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate("/signin");
      return;
    }

    const getDate = (time) => {
      const date = new Date(time);
      const day = date.getDate().toString().padStart(2, "0");
      const month = (date.getMonth() + 1).toString().padStart(2, "0");
      const year = date.getFullYear();
      const hours = date.getHours().toString().padStart(2, "0");
      const minutes = date.getMinutes().toString().padStart(2, "0");
      return `${day}.${month}.${year} ${hours}:${minutes}`;
    };

    const convertData = (raw) => {
      const list = raw.map(
        ({ id, date, type, amount, paymentMethod, userEmail }) => ({
          id,
          type,
          amount: amount,
          paymentMethod,
          date: getDate(date),
          userEmail,
        })
      );
      return {
        list,
        isEmpty: list.length === 0,
      };
    };

    const fetchTransactions = async () => {
      try {
        const response = await fetch("http://localhost:4000/transactions", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (response.ok) {
          setTransactions(convertData(data));
          if (data.balance !== undefined) {
            updateBalance(data.balance);
          }
        } else {
          console.error("Server returned status", response.status, data);
          alert(data.message);
        }
      } catch (error) {
        console.error("Error fetching transactions:", error);
        alert("Error fetching transactions");
      }
    };

    fetchTransactions();
  }, [token, navigate, updateBalance]);

  if (!token) {
    return <div>Loading...</div>;
  }

  const handleNotification = () => {
    navigate("/notification");
  };

  const handleSetting = () => {
    navigate("/setting");
  };

  const handleReceive = () => {
    navigate("/recive");
  };

  const handleSend = () => {
    navigate("/send");
  };

  return (
    <Page>
      <header className="balance__header">
        <div className="header__top">
          <button onClick={handleSetting}>
            <span className="icon icon__setting"></span>
          </button>
          <span className="balance-header__title">Main wallet</span>
          <button onClick={handleNotification}>
            <span className="icon icon__notification"></span>
          </button>
        </div>
        <div className="balance">{balance} $</div>
        <div className="list-button">
          <div className="item-button">
            <button onClick={handleReceive} className="button__balance">
              <span className="button__receive"></span>
            </button>
            <span className="button__text">Receive</span>
          </div>
          <div className="item-button">
            <button onClick={handleSend} className="button__balance">
              <span className="button__send"></span>
            </button>
            <span>Send</span>
          </div>
        </div>
      </header>
      <div>
        <ul>
          {transactions.isEmpty ? (
            <li>No transaction available</li>
          ) : (
            transactions.list.reverse().map((transaction) => (
              <li key={transaction.id} className="transaction__list">
                <Link
                  to={`/transaction/${transaction.id}`}
                  className="transaction__item"
                >
                  {transaction.type === "Recive" ? (
                    transaction.paymentMethod === "Stripe" ? (
                      <div className="transaction__icon resive-stripe"></div>
                    ) : (
                      <div className="transaction__icon resive-coinbase"></div>
                    )
                  ) : (
                    <div className="transaction__icon send"></div>
                  )}
                  <div className="transaction__descr">
                    <h3 className="transaction__title">
                      {transaction.paymentMethod || transaction.userEmail}
                    </h3>
                    <p className="transaction__text">
                      {transaction.date} * {transaction.type}
                    </p>
                  </div>
                  {transaction.type === "Recive" ? (
                    <p className="transaction__amount plus">
                      +{transaction.amount} $
                    </p>
                  ) : (
                    <p className="transaction__amount">
                      -{transaction.amount} $
                    </p>
                  )}
                </Link>
              </li>
            ))
          )}
        </ul>
      </div>
    </Page>
  );
};

export default BalancePage;
