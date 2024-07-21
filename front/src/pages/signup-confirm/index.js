import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../AuthProvider";
import { saveSession, getTokenSession, getSession } from "../../session";
import Page from "../../component/page";
import Header from "../../component/header";
import Field from "../../component/field";
import Button from "../../component/button";
import { Alert } from "../../component/alert";

const FIELD_NAME = {
  CODE: "code",
};

const FIELD_ERROR = {
  IS_EMPTY: "Введіть значення в поле",
  IS_BIG: "Дуже довге значення",
};

const SignupConfirmPage = () => {
  const { user, updateAuth } = useAuth();
  const [values, setValues] = useState({});
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});
  const [disabled, setDisabled] = useState(true);
  const [alert, setAlert] = useState({ status: "", message: "" });

  useEffect(() => {
    const session = getSession();
    if (session && !session.user.isConfirm) {
      navigate("/signup-confirm");
    } else if (session && session.user.isConfirm) {
      navigate("/balance");
    } else {
      navigate("/");
    }
  }, [navigate]);

  function validate(value) {
    if (String(value).length < 1) {
      return FIELD_ERROR.IS_EMPTY;
    }
    if (String(value).length > 20) {
      return FIELD_ERROR.IS_BIG;
    }
    return null;
  }

  const handleChange = (name, value) => {
    const error = validate(value);
    setValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: error,
    }));
    checkDisabled();
  };

  const checkDisabled = () => {
    let isDisabled = false;
    Object.values(FIELD_NAME).forEach((name) => {
      if (errors[name] || !values[name]) {
        isDisabled = true;
      }
    });
    setDisabled(isDisabled);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Submitted values:", values);
    if (!values[FIELD_NAME.CODE]) {
      setAlert({ status: "error", message: "Invalid values or code" });
      return;
    }
    setAlert({ status: "progress", message: "Завантаження..." });
    try {
      const code = Number(values[FIELD_NAME.CODE]);
      if (isNaN(code)) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          [FIELD_NAME.CODE]: "Invalid code",
        }));
        setAlert({ status: "error", message: "Invalid code" });
        return;
      }
      const token = getTokenSession();
      console.log("Token retrieved:", token);
      if (!token) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          token: "Invalid token",
        }));
        setAlert({ status: "error", message: "Invalid token" });
        return;
      }
      const response = await fetch("http://localhost:4000/signup-confirm", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          code: values[FIELD_NAME.CODE],
          token: token,
        }),
      });

      const data = await response.json();
      console.log("Response data:", data);
      if (response.ok) {
        setAlert({ status: "success", message: data.message });
        saveSession(data.session);
        updateAuth(data.session.token, data.session.user);
        navigate("/balance");
      } else {
        console.error("API error:", data.message);
        setErrors((prevErrors) => ({
          ...prevErrors,
          api: data.message,
        }));
        setAlert({ status: "error", message: data.message });
      }
    } catch (error) {
      console.error("Network or server error:", error);
      setAlert({
        status: "error",
        message: "Something went wrong. Please try again later.",
      });
    }
  };

  const handleRenew = () => {
    const session = getSession();
    if (session && session.user) {
      navigate(`/signup-confirm?renew=true&email=${session.user.email}`);
    }
  };

  return (
    <Page>
      <Header
        title={"Confirm account"}
        description={"Write the code you received"}
      />
      <form className="form" onSubmit={handleSubmit}>
        <div className="form__item">
          <Field
            label={"Code:"}
            placeholder={"Input your code"}
            htmlFor={FIELD_NAME.CODE}
            id={FIELD_NAME.CODE}
            value={values[FIELD_NAME.CODE] || ""}
            onChange={(e) => handleChange(FIELD_NAME.CODE, e.target.value)}
          />
          {errors[FIELD_NAME.CODE] && <span>{errors[FIELD_NAME.CODE]}</span>}
        </div>
        <Button
          onClick={handleRenew}
          className={"button button__dark"}
          text={"Continue"}
          type="submit"
          disabled={disabled}
          id="renew"
        />
        {alert.status && (
          <Alert status={`${alert.status}`} message={alert.message} />
        )}
      </form>
    </Page>
  );
};

export default SignupConfirmPage;
