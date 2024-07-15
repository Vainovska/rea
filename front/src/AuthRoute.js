import { useNavigate } from "react-router-dom";
import { AuthContext } from "./AuthProvider";
import { useContext } from "react";

const AuthRoute = ({ children }) => {
  const navigate = useNavigate();
  const { authState } = useContext(AuthContext);
  if (authState && authState.user) {
    return navigate("/balance");
  }
  return children;
};

export default AuthRoute;
