import { createContext, useContext, useEffect, useState } from "react";
import { useQuery } from "@apollo/client";
import { ME_QUERY } from "../graphql/queries";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [isAuth, setIsAuth] = useState(false);
  const [token, setToken] = useState(localStorage.getItem("token"));

  const { data, loading, error, refetch } = useQuery(ME_QUERY, {
    context: {
      headers: {
        Authorization: token ? `Bearer ${token}` : "",
      },
    },
    skip: !token,
    onCompleted: (data) => {
      if (data?.me) {
        setIsAuth(true);
      } else {
        setIsAuth(false);
      }
    },
    onError: (error) => {
      console.error("Auth query error:", error);
      setIsAuth(false);
    }
  });

  // Update token state when localStorage changes
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === "token") {
        setToken(e.newValue);
        if (e.newValue) {
          refetch();
        } else {
          setIsAuth(false);
        }
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [refetch]);

  // Check token on mount
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setToken(storedToken);
      refetch();
    }
  }, [refetch]);

  return (
    <AuthContext.Provider value={{ isAuth, setIsAuth, token, setToken }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
