import { useState } from "react";
import toast from "react-hot-toast";
import { useAuthContext } from "../context/AuthContext";
import api from "../services/api";

const useSignup = () => {
  const [loading, setLoading] = useState(false);
  const { setAuthUser } = useAuthContext();

  const signup = async ({ fullName, email, password, confirmPassword }) => {
    // 1. ვალიდაცია
    if (!fullName || !email || !password || !confirmPassword) {
      toast.error("გთხოვთ შეავსოთ ყველა ველი");
      return false;
    }
    if (password !== confirmPassword) {
      toast.error("პაროლები არ ემთხვევა");
      return false;
    }

    setLoading(true);
    try {
      // 2. ბექენდთან დაკავშირება
      const res = await api.post("/signup", { fullName, email, password });
      
      const data = res.data;
      if (data.error) throw new Error(data.error);

      // 3. LocalStorage-ში შენახვა და კონტექსტის განახლება
      localStorage.setItem("chat-user", JSON.stringify(data));
      setAuthUser(data);
      
      toast.success("რეგისტრაცია წარმატებულია!");
    } catch (error) {
      toast.error(error.response?.data?.message || "რეგისტრაცია ვერ მოხერხდა");
    } finally {
      setLoading(false);
    }
  };

  return { loading, signup };
};

export default useSignup;