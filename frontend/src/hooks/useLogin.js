import { useState } from "react";
import toast from "react-hot-toast";
import { useAuthContext } from "../context/AuthContext";
import api from "../services/api";

const useLogin = () => {
  const [loading, setLoading] = useState(false);
  const { setAuthUser } = useAuthContext();

  const login = async (email, password) => {
    if (!email || !password) {
      toast.error("გთხოვთ შეავსოთ ყველა ველი");
      return;
    }
    setLoading(true);
    try {
      const res = await api.post("/login", { email, password });
      const data = res.data;

      localStorage.setItem("chat-user", JSON.stringify(data));
      setAuthUser(data);
      toast.success("წარმატებით შეხვედით!");
    } catch (error) {
      toast.error(error.response?.data?.message || "ავტორიზაცია ვერ მოხერხდა");
    } finally {
      setLoading(false);
    }
  };

  return { loading, login };
};

export default useLogin;