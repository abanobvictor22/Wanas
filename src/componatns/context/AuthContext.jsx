import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { createContext, useState } from "react";

export const AuthContext = createContext();

export function AuthContextProvider({ children }) {
  const [token, setToken] = useState(function () {
    return localStorage.getItem("tokenUser");
  });

  // const [userData, setUserData] = useState(null);

  async function getUserData() {
    const res = await axios.get(
      "https://route-posts.routemisr.com/users/profile-data",
      {
        headers: {
          token: token,
        },
      },
    );

    return res.data.data.user;
  }
  const { data: userData } = useQuery({
    queryKey: ["userData", token],
    queryFn: () => {
      return getUserData();
    },
    enabled: !!token,
  });

  return (
    <AuthContext.Provider value={{ token, setToken, userData }}>
      {children}
    </AuthContext.Provider>
  );
}
