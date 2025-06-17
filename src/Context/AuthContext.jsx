import React, { createContext, useContext, useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { checkAuth } from "../services/authService";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [authToken, setAuthToken] = useState(() => {
    return localStorage.getItem("token");
  });
  const [user, setUser] = useState(() => {
    const token = localStorage.getItem("token");
    return token ? decodeToken(token) : null;
  });

  // Decode token to extract user info
  function decodeToken(token) { 
    try {
      const decoded = jwtDecode(token);
      // console.log("here decoded email", decoded);
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

  useEffect(() => {
    setTimeout(() => {
      const verifyToken = async () => {
        try {
          // await checkAuth();
          // Token is valid, you can optionally update state here
        } catch (error) {
          // Token is invalid or there was an error
          localStorage.removeItem("token");
          setUser(null);
          // You might also want to redirect to login page or show a message
          console.error("Authentication failed:", error.message);
        }
      };

      // Only verify if there's a token
      if (localStorage.getItem("token")) {
        verifyToken();
      }
      
    }, 2000);
    
  }, ); 

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
