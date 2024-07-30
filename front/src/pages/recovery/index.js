import "../signup/index.css";
import Page from "../../component/page";
import Header from "../../component/header";
import FieldEmail from "../../component/field-email";
import Button from "../../component/button";
import { Alert } from "../../component/alert";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const REG_EXP_EMAIL = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,}$/;

const FIELD_ERROR = {
  IS_EMPTY: "Введіть значення в поле",
  IS_BIG: "Дуже довге значення",
  EMAIL: "Введіть коректне значення e-mail адреси",
};

const RecoveryPage = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [alert, setAlert] = useState("");
  const navigate = useNavigate();

  const validate = (value) => {
    if (value.length < 1) {
      return FIELD_ERROR.IS_EMPTY;
    }
    if (value.length > 50) {
      return FIELD_ERROR.IS_BIG;
    }
    if (!REG_EXP_EMAIL.test(value)) {
      return FIELD_ERROR.EMAIL;
    }
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationError = validate(email);
    if (validationError) {
      setError(validationError);
      return;
    }
    setError("");
    setIsLoading(true);
    setAlert("Завантаження...");
    try {
      const response = await fetch("http://localhost:4000/recovery", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setAlert(data.message);
        navigate("/recovery-confirm");
      } else {
        setError(data.message);
        setAlert(data.message);
      }
    } catch (error) {
      setAlert(error.message);
      setError("Something went wrong. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Page>
      <Header
        title={"Recover password"}
        description={"Choose a recovery method"}
      />
      <form className="form" onSubmit={handleSubmit}>
        <div className="form__item">
          <FieldEmail
            label={"Email:"}
            placeholder={"Input your e-mail"}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isLoading}
          />
          {error && <span className="form__error">{error}</span>}
        </div>
        <Button
          className={"button button__dark"}
          text={"Send code"}
          disabled={isLoading}
          type="submit"
        />
      </form>
      {alert && (
        <Alert
          status={`${isLoading ? "progress" : "success"}`}
          message={alert}
        />
      )}
    </Page>
  );
};

export default RecoveryPage;
