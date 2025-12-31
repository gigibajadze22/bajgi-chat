import { createContext, useContext, useEffect, useState } from "react";
import api from "../api/axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const getMe = async () => {
    setLoading(true); // ჩატვირთვის დაწყება
    try {
      const res = await api.get("/users/me");
      console.log("Backend Response:", res.data); // ნახე კონსოლში რა მოდის

      // ვამოწმებთ შენი ბექენდის სტრუქტურას { status: "success", data: { user: {...} } }
      if (res.data && res.data.data && res.data.data.user) {
        setUser(res.data.data.user);
      } else if (res.data && res.data.user) {
        // თუ ბექენდი პირდაპირ { user: ... } აბრუნებს
        setUser(res.data.user);
      }
    } catch (err) {
      console.error("Auth error:", err.response?.status);
      setUser(null);
    } finally {
      setLoading(false); // ჩატვირთვა სრულდება ნებისმიერ შემთხვევაში!
    }
  };

  useEffect(() => {
    getMe();
  }, []);

  const login = async (email, password) => {
    await api.post("/auth/login", { email, password });
    await getMe();
  };

  const logout = async () => {
    try {
      await api.post("/auth/logout");
    } finally {
      setUser(null);
      window.location.href = "/login";
    }
  };

  return (
    <AuthContext.Provider value={{ user, setUser, login, logout, loading }}>
      {!loading ? children : <div style={loadingStyle}>იტვირთება...</div>}
    </AuthContext.Provider>
  );
};

const loadingStyle = {
  height: "100vh",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  fontSize: "20px",
  fontFamily: "sans-serif",
  color: "#4f46e5"
};

export const useAuth = () => useContext(AuthContext);