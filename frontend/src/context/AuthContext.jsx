import { createContext, useContext, useState } from "react";

export const AuthContext = createContext();

// ეს ფუნქცია დაგვჭირდება სხვა ფაილებში იუზერის გამოსაყენებლად
export const useAuthContext = () => {
  return useContext(AuthContext);
};

export const AuthContextProvider = ({ children }) => {
  // ვამოწმებთ, ხომ არ გვიწერია უკვე იუზერი კომპიუტერის მეხსიერებაში (LocalStorage)
  const [authUser, setAuthUser] = useState(JSON.parse(localStorage.getItem("chat-user")) || null);

  return (
    <AuthContext.Provider value={{ authUser, setAuthUser }}>
      {children}
    </AuthContext.Provider>
  );
};