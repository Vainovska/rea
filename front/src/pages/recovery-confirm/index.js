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
  const [errors, setErrors] = useState({});
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
    setFormValues((prevValues) => ({ ...prevValues, [name]: value }));
    const error = validate(name, value);
    setErrors((prevErrors) => ({ ...prevErrors, [name]: error }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Form submitted"); // Debugging log

    const newErrors = {};
    Object.keys(formValues).forEach((name) => {
      const error = validate(name, formValues[name]);
      if (error) {
        newErrors[name] = error;
      }
    });

    console.log("Errors:", newErrors); // Debugging log

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
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

      console.log("Response:", response); // Debugging log

      const data = await response.json();

      console.log("Data:", data); // Debugging log

      if (response.ok) {
        setAlert(data.message);
        saveSession(data.session);
        navigate("/balance");
      } else {
        setAlert(data.message);
        setErrors({ general: data.message });
      }
    } catch (error) {
      console.error("Error:", error); // Debugging log
      setAlert(error.message);
      setErrors({ general: "Something went wrong. Please try again later." });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Page>
      <Header
        title={"Recover password"}
        description={"Write the code you received"}
      />
      <form className="form" onSubmit={handleSubmit}>
        <div className="form__item">
          <Field
            label="Code"
            id="code"
            name="code"
            value={formValues.code}
            onChange={handleChange}
            disabled={isLoading}
            placeholder={"Input your code"}
          />
          {errors.code && <span className="form__error">{errors.code}</span>}
        </div>
        <div className="form__item">
          <FieldPassword
            label={"New Password:"}
            placeholder={"Input your password"}
            name="password"
            value={formValues.password}
            onChange={handleChange}
            disabled={isLoading}
          />
          {errors.password && (
            <span className="form__error">{errors.password}</span>
          )}
        </div>
        <div className="form__item">
          <FieldPassword
            label={"Password again:"}
            placeholder={"Input your password again"}
            name="passwordAgain"
            value={formValues.passwordAgain}
            onChange={handleChange}
            disabled={isLoading}
          />
          {errors.passwordAgain && (
            <span className="form__error">{errors.passwordAgain}</span>
          )}
        </div>
        <Button
          className={"button button__dark"}
          text={"Restore password"}
          disabled={isLoading}
          type="submit"
        />
      </form>
      {errors && (
        <Alert
          status={`${isLoading ? "progress" : "success"}`}
          message={errors.password}
        />
      )}
    </Page>
  );
};

export default RecoveryConfirmPage;
