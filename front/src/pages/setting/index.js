import "./index.css";
import Page from "../../component/page";
import Header from "../../component/header";
import Button from "../../component/button";
import Divider from "../../component/divider";
import { Fragment } from "react";
import { useAuth } from "../../AuthProvider";
import { useNavigate } from "react-router-dom";
import ChangePassword from "../../container/changePassword";
import ChangeEmail from "../../container/changeEmail";

const SettingsPage = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/signin");
  };

  return (
    <Page>
      <Header title={"Settings"} />
      <div className="setting">
        <Fragment>
          <ChangeEmail />
        </Fragment>
        <Divider />
        <Fragment>
          <ChangePassword />
        </Fragment>
        <Divider />
        <Button
          onClick={handleLogout}
          className={"button button__warning"}
          text={"Log out"}
        />
      </div>
    </Page>
  );
};

export default SettingsPage;
