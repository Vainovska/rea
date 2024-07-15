import "../signup/index.css";
import Page from "../../component/page";
import Header from "../../component/header";
import Field from "../../component/field";
import FieldPassword from "../../component/field-password";
import Button from "../../component/button";
import { Alert } from "../../component/alert";
import React, { useState } from "react";
import { saveSession } from "../../session";
import { useNavigate } from "react-router-dom";

const REG_EXP_PASSWORD = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

const FIELD_ERROR = {
  IS_EMPTY: "Введіть значення в поле",
  IS_BIG: "Дуже довге значення",
  PASSWORD:
    "Пароль повинен складатися з не менше ніж 8 символів, включаючи хоча б одну цифру, малу та велику літеру",
  PASSWORD_AGAIN: "Ваш другий пароль не збігається з першим",
};
const RecoveryConfirmPage = () => {
  const [formValues, setFormValues] = useState({
    code: "",
    password: "",
    passwordAgain: "",
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [alert, setAlert] = useState("");
  const navigate = useNavigate();
  const validate = (name, value) => {
    if (value.length < 1) {
      return FIELD_ERROR.IS_EMPTY;
    }
    if (value.length > 20) {
      return FIELD_ERROR.IS_BIG;
    }
    if (name === "password" && !REG_EXP_PASSWORD.test(value)) {
      return FIELD_ERROR.PASSWORD;
    }
    if (name === "passwordAgain" && value !== formValues.password) {
      return FIELD_ERROR.PASSWORD_AGAIN;
    }
    return null;
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
    const error = validate(name, value);
    setError({ ...error, [name]: error });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {};
    Object.keys(formValues).forEach((name) => {
      const error = validate(name, formValues[name]);
      if (error) {
        newErrors[name] = error;
      }
    });
    if (Object.keys(newErrors).length > 0) {
      setError(newErrors);
      return;
    }

    setIsLoading(true);
    setAlert("Завантаження...");

    try {
      const response = await fetch("http://localhost:4000/recovery-confirm", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          code: Number(formValues.code),
          password: formValues.password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setAlert(data.message);
        saveSession(data.session);
        navigate("/balance");
      } else {
        setAlert(data.message);
        setError(data.message);
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
        title={"Sign Recover password"}
        description={"Write the code you received"}
      />
      <form className="form" onSubmit={handleSubmit}>
        <div className="form__item">
          <Field
            label="Code"
            id="code"
            value={formValues.code}
            onChange={handleChange}
            disabled={isLoading}
            placeholder={"Input your code"}
          />
          {error.code && <span className="form__error">{error.code}</span>}{" "}
        </div>
        <div className="form__item">
          <FieldPassword
            label={"New Password:"}
            placeholder={"Input your password"}
            value={formValues.password}
            onChange={handleChange}
            disabled={isLoading}
          />
          {error.password && (
            <span className="form__error">{error.password}</span>
          )}
        </div>
        <div className="form__item">
          <FieldPassword
            label={"Password again:"}
            placeholder={"Input your password again"}
            value={formValues.passwordAgain}
            onChange={handleChange}
            disabled={isLoading}
          />
          {error.passwordAgain && (
            <span className="form__error">{error.passwordAgain}</span>
          )}
        </div>
      </form>
      <Button
        className={"button button__dark"}
        text={"Restore password"}
        disabled={isLoading}
      />
      {alert && (
        <Alert
          status={`${isLoading ? "progress" : "success"}`}
          message={alert}
        />
      )}
    </Page>
  );
};
export default RecoveryConfirmPage;
