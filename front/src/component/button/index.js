import "./index.css";

const Button = ({ onClick, text, className, disabled, type }) => {
  return (
    <button
      type={type || "button"}
      className={className}
      onClick={onClick}
      disabled={disabled}
    >
      {text}
    </button>
  );
};

export default Button;
