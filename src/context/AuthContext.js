import { createContext, useContext, useEffect, useState } from "react";
import { useQuery } from "@apollo/client";
import { ME_QUERY } from "../graphql/queries";

const AuthContext = createContext(null);
export const AuthProvider = ({ children }) => {
  const { data, loading, error } = useQuery(ME_QUERY, {
    context: {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    },
  });
  const [isAuth, setIsAuth] = useState(false);

  useEffect(() => {
    if (data?.me) {
      setIsAuth(true);
    } else {
      setIsAuth(false);
    }
  }, [data]);

  return (
    <AuthContext.Provider value={{ isAuth , setIsAuth}}>{children}</AuthContext.Provider>
  );
};
export const useAuth = () => useContext(AuthContext);
