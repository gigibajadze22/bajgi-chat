import { Navigate, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import { useAuthContext } from "./context/AuthContext";
import { Toaster } from "react-hot-toast";

function App() {
  const { authUser } = useAuthContext();

  return (
    <div className="p-4 h-screen flex items-center justify-center">
      <Routes>
        {/* თუ იუზერი დალოგინებულია, მიდის მთავარზე, თუ არა - ლოგინზე */}
        <Route path="/" element={authUser ? <Home /> : <Navigate to="/login" />} />
        
        {/* თუ დალოგინებულია და ცდილობს ლოგინზე შესვლას, ვაბრუნებთ მთავარზე */}
        <Route path="/login" element={authUser ? <Navigate to="/" /> : <Login />} />
        
        {/* იგივე რეგისტრაციაზეც */}
        <Route path="/signup" element={authUser ? <Navigate to="/" /> : <Signup />} />
      </Routes>
      
      {/* ეს კომპონენტი გამოაჩენს პატარა შეტყობინებებს (მაგ: "წარმატებით შეხვედით") */}
      <Toaster />
    </div>
  );
}

export default App;