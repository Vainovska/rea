import { useNavigate } from "react-router-dom";
import backButton from "./back-button.svg";

const BackButton = () => {
  const history = useNavigate();
  const handelClick = () => {
    history(-1);
  };
  return (
    <button className="back" onClick={handelClick}>
      <img src={backButton} alt="<" width="24" height="24" />
    </button>
  );
};
export default BackButton;
