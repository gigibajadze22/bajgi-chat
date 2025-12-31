import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Chat from "./pages/Chat";
import Profile from "./pages/Profile";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";

function App() {
  const { user, loading } = useAuth();

  if (loading) return <div>იტვირთება...</div>;

  return (
    <Routes>
      {/* თუ იუზერი არ არის, გადავიდეს ლოგინზე, თუ არის - ჩეთზე */}
      <Route path="/" element={user ? <Chat /> : <Navigate to="/login" />} />
      <Route path="/profile" element={user ? <Profile /> : <Navigate to="/login" />} />
      
      {/* თუ იუზერი უკვე შესულია, ლოგინის გვერდზე აღარ შეუშვას */}
      <Route path="/login" element={!user ? <Login /> : <Navigate to="/" />} />
      <Route path="/signup" element={!user ? <Signup /> : <Navigate to="/" />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
<Route path="/reset-password" element={<ResetPassword />} />
    </Routes>
  );
}

export default App;