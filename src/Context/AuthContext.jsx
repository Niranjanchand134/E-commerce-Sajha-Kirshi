import React, { createContext, useContext, useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [authToken, setAuthToken] = useState(() => {
    return localStorage.getItem("token");
  });
  const [user, setUser] = useState(() => {
    const token = localStorage.getItem("token");
    console.log("here is the saved token,", token);
    return token ? decodeToken(token) : null;
  });

  // Decode token to extract user info
  function decodeToken(token) {
    try {
      const decoded = jwtDecode(token);
      console.log("here decoded email", decoded);
      return {
        email: decoded.sub || decoded.email,
        name: decoded.name,
        role: decoded.role,
        id: decoded.id,
      };
    } catch (err) {
      console.error("Invalid token:", err);
      return null;
    }
  }

  useEffect(() => {
    if (authToken) {
      const decodedUser = decodeToken(authToken);
      setUser(decodedUser);
      localStorage.setItem("token", authToken);
    } else {
      setUser(null);
      localStorage.removeItem("token");
    }
  }, [authToken]);

  const login = (token) => {
    setAuthToken(token);
  };

  // Logout function
  const logout = () => {
    setAuthToken(null);
  };

  return (
    <AuthContext.Provider value={{ authToken, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
