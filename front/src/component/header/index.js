import BackButton from "../back-button";
import "./index.css";
const Header = ({ title, description }) => {
  return (
    <div>
      <BackButton />
      <div className="header__content">
        <h1 className="header__title">{title}</h1>
        <p className="header__description">{description}</p>
      </div>
    </div>
  );
};
export default Header;
