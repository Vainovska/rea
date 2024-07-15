import React, { createContext, useReducer, useContext } from "react";
import { useEffect } from "react";

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
    const token = localStorage.getItem("token");
    if (token) {
      const user = JSON.parse(localStorage.getItem("user"));
      dispatch({ type: "LOGIN", payload: { token, user } });
    }
  }, []);

  const login = (token, user) => {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));
    dispatch({ type: "LOGIN", payload: { token, user } });
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    dispatch({ type: "LOGOUT" });
  };

  const updateAuth = (token, user) => {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));
    dispatch({ type: "UPDATE_AUTH", payload: { token, user } });
  };

  return (
    <AuthContext.Provider value={{ ...state, login, logout, updateAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

// Користувацький хук для доступу до контексту
export const useAuth = () => useContext(AuthContext);
