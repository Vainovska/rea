import { useState, useRef } from "react";
import "./index.css";

const FieldPassword = ({
  label,
  placeholder,
  disabled,
  value,
  onChange,
  name,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const inputRef = useRef(null);

  const togglePasswordShow = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
    if (inputRef.current) {
      inputRef.current.type = showPassword ? "password" : "text";
    }
  };

  return (
    <div className="field field--password">
      <label htmlFor={name} className="field__label">
        {label}
      </label>
      <div className="field__wrapper">
        <input
          ref={inputRef}
          onChange={onChange}
          type={showPassword ? "text" : "password"}
          className="field__input validation"
          value={value}
          name={name}
          placeholder={placeholder}
          disabled={disabled}
        />
        <span
          onClick={togglePasswordShow}
          className={
            showPassword ? "field__icon field__icon--show" : "field__icon"
          }
        ></span>
      </div>
    </div>
  );
};

export default FieldPassword;
