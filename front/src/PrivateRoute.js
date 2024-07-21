import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "./AuthProvider";

const PrivateRoute = ({ children }) => {
  const navigate = useNavigate();
  const { token, user } = useContext(AuthContext);
  const [hasNavigated, setHasNavigated] = useState(false);

  useEffect(() => {
    console.log("PrivateRoute: useEffect called");
    if (!token && !hasNavigated) {
      console.log("PrivateRoute: No token, navigating to signin");
      navigate("/signin", { replace: true });
      setHasNavigated(true);
    } else if (user && !user.isConfirm && !hasNavigated) {
      console.log(
        "PrivateRoute: User not confirmed, navigating to signup-confirm"
      );
      navigate("/signup-confirm", { replace: true });
      setHasNavigated(true);
    }
  }, [token, user, navigate, hasNavigated]);

  if (!token || (user && !user.isConfirm)) {
    return <div>Loading...</div>;
  }

  console.log("PrivateRoute: Rendering children");
  return children;
};

export default PrivateRoute;
