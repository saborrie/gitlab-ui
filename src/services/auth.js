import React from "react";

const TokenContext = React.createContext(null);

export function LoginProvider({ children }) {
  const [token, setToken] = React.useState(() => localStorage.getItem("token"));

  return <TokenContext.Provider value={{ token, setToken }}>{children}</TokenContext.Provider>;
}

export function useSignIn() {
  const { setToken } = React.useContext(TokenContext);

  return React.useCallback((token) => {
    localStorage.setItem("token", token);
    setToken(token);
  }, []);
}

export function useToken() {
  const { token } = React.useContext(TokenContext);
  return token;
}

export function useLoggedIn() {
  const token = useToken();
  return Boolean(token);
}
