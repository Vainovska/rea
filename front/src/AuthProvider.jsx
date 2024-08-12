import React, { createContext, useReducer, useContext, useEffect } from "react";
import { saveSession, loadSession } from "./session";

// Initialize context
export const AuthContext = createContext();

// Initial state
const initialState = {
  isAuthenticated: false,
  token: null,
  user: null,
  balance: 0,
};

// Action types
const actionTypes = {
  LOGIN: "LOGIN",
  LOGOUT: "LOGOUT",
  UPDATE_AUTH: "UPDATE_AUTH",
  UPDATE_BALANCE: "UPDATE_BALANCE",
  UPDATE_EMAIL: "UPDATE_EMAIL",
  UPDATE_PASSWORD: "UPDATE_PASSWORD",
};

// Reducer
const authReducer = (state, action) => {
  switch (action.type) {
    case actionTypes.LOGIN:
      return {
        ...state,
        isAuthenticated: true,
        token: action.payload.token,
        user: action.payload.user,
        balance: action.payload.balance || 0,
      };
    case actionTypes.LOGOUT:
      return {
        ...state,
        isAuthenticated: false,
        token: null,
        user: null,
        balance: 0,
      };
    case actionTypes.UPDATE_AUTH:
      return {
        ...state,
        isAuthenticated: true,
        token: action.payload.token,
        user: action.payload.user,
        balance: action.payload.balance || state.balance,
      };
    case actionTypes.UPDATE_BALANCE:
      return {
        ...state,
        balance: action.payload,
      };
    case actionTypes.UPDATE_EMAIL:
      return {
        ...state,
        user: { ...state.user, email: action.payload },
      };
    case actionTypes.UPDATE_PASSWORD:
      return state;
    default:
      return state;
  }
};

// Context provider
export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  useEffect(() => {
    const session = loadSession();
    if (session) {
      dispatch({
        type: actionTypes.LOGIN,
        payload: {
          token: session.token,
          user: session.user,
          balance: session.balance,
        },
      });
    }
  }, []);

  const login = (token, user, balance = 0) => {
    if (!token || !user) {
      console.error("Token or user is undefined in login function");
      return;
    }
    dispatch({
      type: actionTypes.LOGIN,
      payload: { token, user, balance },
    });
    saveSession({ token, user, balance });
  };

  const logout = () => {
    dispatch({ type: actionTypes.LOGOUT });
    saveSession(null);
  };

  const updateAuth = (token, user, balance = 0) => {
    dispatch({
      type: actionTypes.UPDATE_AUTH,
      payload: { token, user, balance },
    });
    saveSession({ token, user, balance });
  };
  const updateBalance = (balance) => {
    dispatch({
      type: actionTypes.UPDATE_BALANCE,
      payload: balance,
    });
    const session = loadSession();
    if (session) {
      session.balance = balance;
      saveSession(session);
    }
  };

  return (
    <AuthContext.Provider
      value={{ ...state, login, logout, updateAuth, updateBalance }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook for accessing the auth context
export const useAuth = () => {
  return useContext(AuthContext);
};
