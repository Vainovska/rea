import "./index.css";
const FieldEmail = ({ label, placeholder, value, onChange }) => {
  return (
    <div className="field">
      <label htmlFor="email" className="field__label">
        {label}
      </label>
      <input
        onChange={onChange}
        value={value}
        name="email"
        type="email"
        className="field__input validation"
        placeholder={placeholder}
      />
    </div>
  );
};
export default FieldEmail;
