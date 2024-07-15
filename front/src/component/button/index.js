import "./index.css";
const Button = ({ onClick, text, className, disabled }) => {
  return (
    <button
      type="submit"
      className={className}
      onClick={onClick}
      disabled={disabled}
    >
      {text}
    </button>
  );
};
export default Button;
