export const SESSION_KEY = "sessionAuth";

export const saveSession = (session) => {
  try {
    if (session) {
      localStorage.setItem("token", session.token);
      localStorage.setItem("user", JSON.stringify(session.user));
    } else {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    }
  } catch (err) {
    console.error("Failed to save session:", err);
  }
};

export const loadSession = () => {
  try {
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user"));
    if (token && user) {
      return { token, user };
    }
  } catch (err) {
    console.error("Failed to load session:", err);

    return null;
  }
};

export const getTokenSession = () => {
  try {
    const session = getSession();
    return session ? session.token : null;
  } catch (err) {
    console.error("Failed to get token from session:", err);
    return null;
  }
};

export const getSession = () => {
  try {
    const session = localStorage.getItem("session");
    return session ? JSON.parse(session) : null;
  } catch (err) {
    console.error("Failed to get session:", err);
    return null;
  }
};
loadSession();
