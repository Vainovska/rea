import { useNavigate } from "react-router-dom";
import { AuthContext } from "./AuthProvider";
import { useContext } from "react";

const AuthRoute = ({ children }) => {
  const navigate = useNavigate();
  const { state } = useContext(AuthContext);
  if (state && state.user && state.token) {
    return navigate("/balance");
  }
  return children;
};

export default AuthRoute;
