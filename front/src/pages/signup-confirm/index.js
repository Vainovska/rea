import "../signup/index.css";
import Page from "../../component/page";
import Header from "../../component/header";
import Field from "../../component/field";
import Button from "../../component/button";
import { Alert } from "../../component/alert";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../AuthProvider";
import { saveSession, getTokenSession, getSession } from "../../session";

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
  const [error, setError] = useState("");
  const [disabled, setDisabled] = useState(true);
  const [alert, setAlert] = useState({ status: "", message: "" });

  useEffect(() => {
    const session = getSession();
    if (session && session.user.isConfirm) {
      navigate("/");
    } else if (!session) {
      navigate("/");
    }
  }, [navigate]);

  const validate = (name, value) => {
    if (String(value).length < 1) {
      return FIELD_ERROR.IS_EMPTY;
    }
    if (String(value).length > 20) {
      return FIELD_ERROR.IS_BIG;
    }
    return null;
  };
  const handleChange = (name, value) => {
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
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (disabled) {
      validateAll();
    } else {
      console.log(values);
      setAlert({ status: "progress", message: "Завантаження..." });
      try {
        const response = await fetch("http://localhost:4000/signup-confirm", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            [FIELD_NAME.CODE]: Number(values[FIELD_NAME.CODE]),
            token: getTokenSession(),
          }),
        });

        const data = await response.json();

        if (response.ok) {
          setAlert({ status: "success", message: data.message });
          saveSession(data.session);
          updateAuth(data.token, data.user);
          navigate("/balance");
        } else {
          setError(data.message);
          setAlert({ status: "error", message: data.message });
        }
      } catch (error) {
        setError("Something went wrong. Please try again later.");
        setAlert({ status: "error", message: error.message });
      }
    }
  };
  if (user.confirm) {
    navigate("/balance");
  }
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
  const handleRenew = (e) => {
    e.preventDefault();
    const session = getSession();
    navigate(`/signup-confirm?renew=true&email=${session.user.email}`);
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
            value={values[FIELD_NAME.CODE] || ""}
            onChange={(e) => handleChange(FIELD_NAME.CODE, e.target.value)}
          />
          {error[FIELD_NAME.CODE] && <span>{error[FIELD_NAME.CODE]}</span>}
        </div>
        <Button
          className={"button button__dark"}
          text={"Continue"}
          type="submit"
          disabled={disabled}
          id="renew"
          onClick={handleRenew}
        />
        {alert.status && (
          <Alert status={`${alert.status}`} message={alert.message} />
        )}
      </form>
    </Page>
  );
};
export default SignupConfirmPage;
