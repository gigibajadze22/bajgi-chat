import { useState } from "react";
import { useAuthContext } from "../context/AuthContext";
import toast from "react-hot-toast";
import api from "../services/api";

const useLogout = () => {
  const [loading, setLoading] = useState(false);
  const { setAuthUser } = useAuthContext();

  const logout = async () => {
    setLoading(true);
    try {
      // 1. ვურეკავთ ბექენდს, რომ სესია დახუროს
      await api.post("/logout");
      
      // 2. ვშლით იუზერს LocalStorage-დან
      localStorage.removeItem("chat-user");
      
      // 3. ვასუფთავებთ კონტექსტს (ეს ავტომატურად გადაგიყვანს Login გვერდზე)
      setAuthUser(null);
      
      toast.success("წარმატებით გამოხვედით!");
    } catch (error) {
      toast.error(error.response?.data?.message || "გამოსვლა ვერ მოხერხდა");
    } finally {
      setLoading(false);
    }
  };

  return { loading, logout };
};

export default useLogout;