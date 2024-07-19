import React, { createContext, useReducer, useContext } from "react";
import { useEffect } from "react";
import { saveSession, loadSession } from "./session";

// Ініціалізація контексту
export const AuthContext = createContext();

// Початковий стан
const initialState = {
  token: null,
  user: null,
};

// Типи дій
const actionTypes = {
  LOGIN: "LOGIN",
  LOGOUT: "LOGOUT",
  UPDATE_AUTH: "UPDATE_AUTH",
  UPDATE_BALANCE: "UPDATE_BALANCE",
  UPDATE_EMAIL: "UPDATE_EMAIL",
  UPDATE_PASSWORD: "UPDATE_PASSWORD",
};

// Редюсер
const authReducer = (state, action) => {
  switch (action.type) {
    case actionTypes.LOGIN:
      return {
        ...state,
        token: action.payload.token,
        user: action.payload.user,
        balance: action.payload.balance,
      };
    case actionTypes.LOGOUT:
      return {
        ...state,
        token: null,
        user: null,
        balance: 0,
      };
    case actionTypes.UPDATE_AUTH:
      return {
        ...state,
        token: action.payload.token,
        user: action.payload.user,
        balance: action.payload.balance,
      };
    case actionTypes.UPDATE_BALANCE:
      return {
        ...state,
        user: { ...state.user, balance: action.payload },
      };
    case actionTypes.UPDATE_EMAIL:
      return {
        ...state,
        user: { ...state.user, email: action.payload },
      };
    case actionTypes.UPDATE_PASSWORD:
      return {
        ...state,
        user: { ...state.user, password: action.payload },
      };
    default:
      return state;
  }
};

// Провайдер контексту
export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);
  useEffect(() => {
    const session = loadSession();
    if (session) {
      dispatch({
        type: actionTypes.LOGIN,
        payload: { token: session.token, user: session.user },
      });
    }
  }, []);

  const login = (token, user) => {
    console.log("Logging in with token:", token, "and user:", user);
    if (!token || !user) {
      console.error("Token or user is undefined in login function");
      return;
    }
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));
    dispatch({ type: actionTypes.LOGIN, payload: { token, user } });
    saveSession({ token, user });
    console.log("Token saved:", token);
  };

  const logout = () => {
    console.log("Logging out");
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    dispatch({ type: actionTypes.LOGOUT });
    saveSession(null);
  };

  const updateAuth = (token, user) => {
    console.log("Updating auth with token:", token, "and user:", user);
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));
    dispatch({ type: actionTypes.UPDATE_AUTH, payload: { token, user } });
    saveSession({ token, user });
    console.log("Token update:", token);
  };

  return (
    <AuthContext.Provider value={{ ...state, login, logout, updateAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

// Користувацький хук для доступу до контексту
export const useAuth = () => {
  return useContext(AuthContext);
};
