import "./index.css";
export const Alert = ({ message, status = "default" }) => {
  return <div className={`alert alert--${status}`}>{message}</div>;
};
