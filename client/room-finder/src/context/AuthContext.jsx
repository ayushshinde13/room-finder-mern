import { createContext, useState, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const res = await axios.get(
          "http://localhost:5001/api/users/me",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setUser(res.data);
      } catch (err) {
        console.error("Auth restore failed");
        localStorage.removeItem("token");
        setUser(null);
      } finally {
        setLoading(false); // 🔥 THIS WAS MISSING EARLIER
      }
    };

    fetchUser();
  }, [token]);

  const login = ({ user, token }) => {
    localStorage.setItem("token", token);
    setUser(user);
    setToken(token);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    setToken(null);
  };

  // Function to update user profile including avatar
  const updateUser = async (updatedData) => {
    try {
      const response = await axios.put(
        "http://localhost:5001/api/users/me",
        updatedData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Update the user context with the response
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