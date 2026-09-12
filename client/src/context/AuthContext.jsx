import { createContext, useState, useEffect } from "react";
import API from "../services/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const userInfo = localStorage.getItem("userInfo");
      return userInfo ? JSON.parse(userInfo).user : null;
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState(() => {
    try {
      const userInfo = localStorage.getItem("userInfo");
      return userInfo ? JSON.parse(userInfo).token : null;
    } catch {
      return null;
    }
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const res = await API.get("/users/me");
        setUser(res.data);
        
        // Keep localStorage user up-to-date with latest server data
        const userInfo = JSON.parse(localStorage.getItem("userInfo") || "{}");
        userInfo.user = res.data;
        userInfo.token = token;
        localStorage.setItem("userInfo", JSON.stringify(userInfo));
      } catch (err) {
        console.error("Auth restore failed:", err);
        localStorage.removeItem("userInfo");
        setUser(null);
        setToken(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [token]);

  const login = ({ user, token }) => {
    // Store both user and token together in userInfo
    localStorage.setItem("userInfo", JSON.stringify({ user, token }));
    setUser(user);
    setToken(token);
  };

  const logout = () => {
    localStorage.removeItem("userInfo");
    setUser(null);
    setToken(null);
  };

  // Function to update user profile including avatar
  const updateUser = async (updatedData) => {
    try {
      const response = await API.put("/users/me", updatedData);

      // Update the user context and localStorage with the response
      const userInfo = JSON.parse(localStorage.getItem("userInfo") || "{}");
      userInfo.user = { ...(userInfo.user || {}), ...response.data };
      localStorage.setItem("userInfo", JSON.stringify(userInfo));
      setUser(response.data);
      return true;
    } catch (error) {
      console.error("Error updating user:", error);
      return false;
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, loading, updateUser }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export default AuthContext;