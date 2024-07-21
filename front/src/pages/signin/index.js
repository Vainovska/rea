import Page from "../../component/page";
import Header from "../../component/header";
import FieldEmail from "../../component/field-email";
import FieldPassword from "../../component/field-password";
import Button from "../../component/button";
import LinkHref from "../../component/link";
import { Alert } from "../../component/alert";
import { useNavigate } from "react-router-dom";
import React, { useState } from "react";
import { saveSession } from "../../session";
import { useAuth } from "../../AuthProvider";

const REG_EXP_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const FIELD_ERROR = {
  IS_EMPTY: "Введіть значення в поле",
  IS_BIG: "Дуже довге значення",
  EMAIL: "Введіть коректне значення e-mail адреси",
};

const SigninPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [formValues, setFormValues] = useState({
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [alert, setAlert] = useState("");

  const handleClick = () => {
    navigate("/recovery");
  };

  const validate = (name, value) => {
    if (value.length < 1) {
      return FIELD_ERROR.IS_EMPTY;
    }
    if (value.length > 20) {
      return FIELD_ERROR.IS_BIG;
    }
    if (name === "email" && !REG_EXP_EMAIL.test(value)) {
      return FIELD_ERROR.EMAIL;
    }
    return null;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
    const error = validate(name, value);
    setErrors({ ...errors, [name]: error });
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
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);
    setAlert("Завантаження...");

    try {
      const response = await fetch("http://localhost:4000/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formValues),
      });

      const data = await response.json();

      if (response.ok) {
        login(data.session.token, data.session.user);
        saveSession(data.session.token); // Assuming saveSession saves the token
        setAlert({ status: "success", message: data.message });

        if (data.session.user.isConfirm) {
          navigate("/balance");
        } else {
          navigate("/signup-confirm");
        }
      } else {
        setErrors({ general: data.message });
        setAlert({ status: "error", message: data.message });
      }
    } catch (error) {
      setErrors({ general: "Something went wrong. Please try again later." });
      setAlert({ status: "error", message: error.message });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Page>
      <Header title={"Sign In"} description={"Select login method"} />
      <form className="form" onSubmit={handleSubmit}>
        <div className="form__item">
          <FieldEmail
            label={"Email:"}
            placeholder={"Input your e-mail"}
            value={formValues.email}
            onChange={handleChange}
            disabled={isLoading}
          />
          {errors.email && <span className="form__error">{errors.email}</span>}
        </div>
        <div className="form__item">
          <FieldPassword
            label={"Password:"}
            placeholder={"Input your password"}
            value={formValues.password}
            onChange={handleChange}
            disabled={isLoading}
          />
          {errors.password && (
            <span className="form__error">{errors.password}</span>
          )}
        </div>
        {errors.general && (
          <span className="form__error">{errors.general}</span>
        )}
        <LinkHref
          text={"Forgot your password?"}
          name={"Recovery"}
          onClick={handleClick}
        />
        <Button
          type="submit"
          disabled={isLoading}
          className={"button button__dark"}
          text={"Continue"}
        />
        {alert && (
          <Alert
            status={isLoading ? "progress" : alert.status}
            message={alert.message}
          />
        )}
      </form>
    </Page>
  );
};

export default SigninPage;
