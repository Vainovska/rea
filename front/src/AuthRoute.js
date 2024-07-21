import { useContext, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "./AuthProvider";

const AuthRoute = ({ children }) => {
  const navigate = useNavigate();
  const { state } = useContext(AuthContext);

  const handleNavigate = useCallback(() => {
    if (state && state.user && state.user.isConfirm && state.token) {
      navigate("/balance", { replace: true });
    }
  }, [state, navigate]);

  useEffect(() => {
    handleNavigate();
  }, [handleNavigate]);

  return state && state.user && state.user.isConfirm && state.token
    ? null
    : children;
};

export default AuthRoute;
