import "./index.css";
import Page from "../../component/page";
import Header from "../../component/header";
import FieldEmail from "../../component/field-email";
import FieldPassword from "../../component/field-password";
import Button from "../../component/button";
import LinkHref from "../../component/link";
import { Alert } from "../../component/alert";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { saveSession } from "../../session";
import { useAuth } from "../../AuthProvider";
const REG_EXP_EMAIL = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,}$/;
const REG_EXP_PASSWORD = /^(?=.*\d)(?=.*[a-z])(?=.*[a-zA-Z]).{8,}$/;

const FIELD_NAME = {
  EMAIL: "email",
  PASSWORD: "password",
  PASSWORD_AGAIN: "passwordAgain",
  IS_CONFIRM: "isConfirm",
};

const FIELD_ERROR = {
  IS_EMPTY: "Введіть значення в поле",
  IS_BIG: "Дуже довге значення",
  EMAIL: "Введіть коректне значення e-mail адреси",
  PASSWORD:
    "Пароль повинен складатися з не менше ніж 8 символів, включаючи хоча б одну цифру, малу та велику літеру",
  PASSWORD_AGAIN: "Ваш другий пароль не збігається з першим",
  NOT_CONFIRM: "Ви не погоджуєтесь з правилами",
};

const SignupForm = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [values, setValues] = useState({});
  const [error, setError] = useState("");
  const [disabled, setDisabled] = useState(true);
  const [alert, setAlert] = useState({ status: "", message: "" });

  const validate = (name, value) => {
    if (String(value).length < 1) {
      return FIELD_ERROR.IS_EMPTY;
    }
    if (String(value).length > 20) {
      return FIELD_ERROR.IS_BIG;
    }
    if (name === FIELD_NAME.EMAIL) {
      if (!REG_EXP_EMAIL.test(String(value))) {
        return FIELD_ERROR.EMAIL;
      }
    }
    if (name === FIELD_NAME.PASSWORD) {
      if (!REG_EXP_PASSWORD.test(String(value))) {
        return FIELD_ERROR.PASSWORD;
      }
    }
    if (name === FIELD_NAME.PASSWORD_AGAIN) {
      if (String(value) !== values[FIELD_NAME.PASSWORD]) {
        return FIELD_ERROR.PASSWORD_AGAIN;
      }
    }
    if (name === FIELD_NAME.IS_CONFIRM) {
      if (!Boolean(value)) {
        return FIELD_ERROR.NOT_CONFIRM;
      }
    }

    return null;
  };
  const handleChange = (name, value) => {
    console.log(`handleChange: ${name} = ${value}`);
    const error = validate(name, value);
    setValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
    setError((prevErrors) => ({
      ...prevErrors,
      [name]: error,
    }));
    checkDisabled();
  };
  const checkDisabled = () => {
    let disabled = false;
    Object.values(FIELD_NAME).forEach((name) => {
      if (error[name] || values[name] === undefined) {
        disabled = true;
      }
    });
    setDisabled(disabled);
    console.log(`checkDisabled: ${disabled}`);
  };
  const handelClick = () => {
    navigate("/signin");
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (disabled) {
      validateAll();
    } else {
      console.log(values);

      setAlert({ status: "progress", message: "Завантаження..." });

      try {
        const response = await fetch("http://localhost:4000/signup", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(values),
        });

        const data = await response.json();

        if (response.ok) {
          setAlert({ status: "success", message: data.message });
          saveSession(data.session);
          login(data.token, data.user);
          navigate("/signup-confirm");
        } else {
          setAlert({ status: "error", message: data.message });
        }
      } catch (error) {
        setAlert({ status: "error", message: error.message });
      }
    }
  };
  const validateAll = () => {
    const newErrors = {};
    Object.values(FIELD_NAME).forEach((name) => {
      const error = validate(name, values[name]);
      if (error) {
        newErrors[name] = error;
      }
    });
    setError(newErrors);
  };
  return (
    <Page>
      <Header title={"Sign Up"} description={"Choose a registration method"} />
      <form className="form" onSubmit={handleSubmit}>
        <div className="form__item ">
          <FieldEmail
            label={"Email:"}
            placeholder={"Input your e-mail"}
            value={values[FIELD_NAME.EMAIL] || ""}
            onChange={(e) => handleChange(FIELD_NAME.EMAIL, e.target.value)}
          />
          {error[FIELD_NAME.EMAIL] && <span>{error[FIELD_NAME.EMAIL]}</span>}
        </div>
        <div className="form__item ">
          <FieldPassword
            label={"Password:"}
            placeholder={"Input your password"}
            value={values[FIELD_NAME.PASSWORD] || ""}
            onChange={(e) => handleChange(FIELD_NAME.PASSWORD, e.target.value)}
          />
          {error[FIELD_NAME.PASSWORD] && (
            <span>{error[FIELD_NAME.PASSWORD]}</span>
          )}
        </div>
        <div className="form__item ">
          <FieldPassword
            label={"Password again:"}
            placeholder={"Input your password again"}
            value={values[FIELD_NAME.PASSWORD_AGAIN] || ""}
            onChange={(e) =>
              handleChange(FIELD_NAME.PASSWORD_AGAIN, e.target.value)
            }
          />
          {error[FIELD_NAME.PASSWORD_AGAIN] && (
            <span>{error[FIELD_NAME.PASSWORD_AGAIN]}</span>
          )}
        </div>

        <LinkHref
          text={"Already have an account?"}
          name={"Sign In"}
          onClick={handelClick}
        />
        <div className="form__item ">
          <label htmlFor="isConfirm">
            <input
              type="checkbox"
              name="isConfirm"
              id={FIELD_NAME.IS_CONFIRM}
              checked={values[FIELD_NAME.IS_CONFIRM] || false}
              onChange={(e) =>
                handleChange(FIELD_NAME.IS_CONFIRM, e.target.checked)
              }
            />
            Я згоден/-на з умовами
          </label>
          {error[FIELD_NAME.IS_CONFIRM] && (
            <span>{error[FIELD_NAME.IS_CONFIRM]}</span>
          )}
        </div>
        <Button
          onClick={handleSubmit}
          className={"button button__dark"}
          text={"Continue"}
        />
        {alert.status && (
          <Alert status={`${alert.status}`} message={alert.message} />
        )}
      </form>
    </Page>
  );
};
export default SignupForm;
