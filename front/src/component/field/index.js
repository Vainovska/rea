import "./index.css";
const Field = ({ value, label, onChange, placeholder, disabled }) => {
  return (
    <div className="field">
      <label htmlFor="code" className="field__label">
        {label}
      </label>
      <input
        name="code"
        onChange={onChange}
        type="number"
        className="field__input validation"
        value={value}
        placeholder={placeholder}
        disabled={disabled}
      />
    </div>
  );
};
export default Field;
