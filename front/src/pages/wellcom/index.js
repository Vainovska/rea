import "./index.css";
import Page from "../../component/page";
import Heading from "../../component/heading";
import Button from "../../component/button";
import { useNavigate } from "react-router-dom";
const WellcomePage = () => {
  const navigate = useNavigate();
  const onHandelUp = () => {
    return navigate("../signup");
  };
  const onHandelIn = () => {
    return navigate("/signin");
  };
  return (
    <Page>
      <Heading />
      <div className="button-list">
        <Button
          text={"Sign up"}
          className={"button button__dark"}
          onClick={onHandelUp}
        />
        <Button text={"Sign in"} className={"button"} onClick={onHandelIn} />
      </div>
    </Page>
  );
};
export default WellcomePage;
