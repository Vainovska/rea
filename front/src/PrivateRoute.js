import { useNavigate } from "react-router-dom";
import { AuthContext } from "./AuthProvider";
import { useContext, useEffect } from "react";

const PrivateRoute = ({ children }) => {
  const navigate = useNavigate();
  const { token, user } = useContext(AuthContext);

  useEffect(() => {
    console.log("PrivateRoute - token:", token);
    console.log("PrivateRoute - user:", user);

    if (!token) {
      navigate("/signin");
    } else if (user && !user.isConfirm) {
      navigate("/signup-confirm");
    }
  }, [token, user, navigate]);

  return token ? children : null;
};

export default PrivateRoute;
