import { useNavigate } from "react-router-dom";
import { AuthContext } from "./AuthProvider";
import { useContext, useEffect } from "react";

const PrivateRoute = ({ children }) => {
  const navigate = useNavigate();
  const { token, user } = useContext(AuthContext);

  useEffect(() => {
    if (!token) {
      navigate("/signin");
    } else if (user && !user.confirm) {
      navigate("/signup-confirm");
    }
  }, [token, user, navigate]);

  if (!token || (user && !user.confirm)) {
    return null;
  }

  return children;
};

export default PrivateRoute;
