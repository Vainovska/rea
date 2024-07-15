import "./index.css";
const LinkHref = ({ onClick, text, name }) => {
  return (
    <span className="link__prefix">
      {text}
      <button onClick={onClick} className="link">
        {name}
      </button>
    </span>
  );
};
export default LinkHref;
