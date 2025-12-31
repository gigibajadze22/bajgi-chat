import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/axios";

const Signup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ fullName: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(""); // წარმატების შეტყობინებისთვის

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    
    try {
      await api.post("/auth/signup", formData);
      setSuccess("Registration successful! Redirecting to login..."); // მწვანე შეტყობინება
      
      // 2 წამში გადავიდეს ლოგინზე, რომ იუზერმა მოასწროს ტექსტის წაკითხვა
      setTimeout(() => {
        navigate("/login");
      }, 2000);
      
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div style={authStyles.container}>
      <div style={authStyles.card}>
        <h2 style={authStyles.title}>Create Account</h2>
        
        {/* შეცდომის შეტყობინება (წითელი) */}
        {error && <div style={authStyles.errorBadge}>{error}</div>}
        
        {/* წარმატების შეტყობინება (მწვანე) */}
        {success && <div style={authStyles.successBadge}>{success}</div>}

        <form onSubmit={submit} style={authStyles.form}>
          <input 
            placeholder="Full Name" 
            style={authStyles.input} 
            onChange={(e) => setFormData({...formData, fullName: e.target.value})} 
            required
          />
          <input 
            type="email" 
            placeholder="Email Address" 
            style={authStyles.input} 
            onChange={(e) => setFormData({...formData, email: e.target.value})} 
            required
          />
          <input 
            type="password" 
            placeholder="Password" 
            style={authStyles.input} 
            onChange={(e) => setFormData({...formData, password: e.target.value})} 
            required
          />
          <button type="submit" style={authStyles.button}>Sign Up</button>
        </form>
        
        <p style={authStyles.footerText}>
          Already have an account? <Link to="/login" style={authStyles.linkBold}>Login</Link>
        </p>
      </div>
    </div>
  );
};

const authStyles = {
  container: { 
    height: "100vh", 
    display: "flex", 
    justifyContent: "center", 
    alignItems: "center", 
    backgroundColor: "#f3f4f6", 
    fontFamily: "'Inter', sans-serif" 
  },
  card: { 
    width: "100%", 
    maxWidth: "400px", 
    padding: "40px", 
    backgroundColor: "#fff", 
    borderRadius: "24px", 
    boxShadow: "0 10px 25px rgba(0,0,0,0.05)" 
  },
  title: { fontSize: "26px", fontWeight: "800", color: "#111", marginBottom: "20px", textAlign: "center" },
  form: { display: "flex", flexDirection: "column", gap: "15px" },
  input: { padding: "12px", borderRadius: "10px", border: "1px solid #ddd", outline: "none", fontSize: "15px" },
  button: { 
    padding: "14px", 
    borderRadius: "10px", 
    border: "none", 
    backgroundColor: "#4f46e5", 
    color: "#fff", 
    fontWeight: "bold", 
    cursor: "pointer", 
    fontSize: "16px",
    marginTop: "10px"
  },
  errorBadge: { 
    padding: "12px", 
    backgroundColor: "#fef2f2", 
    color: "#b91c1c", 
    borderRadius: "12px", 
    textAlign: "center", 
    marginBottom: "15px",
    fontSize: "14px",
    border: "1px solid #fee2e2"
  },
  successBadge: { 
    padding: "12px", 
    backgroundColor: "#f0fdf4", 
    color: "#15803d", 
    borderRadius: "12px", 
    textAlign: "center", 
    marginBottom: "15px",
    fontSize: "14px",
    border: "1px solid #dcfce7",
    fontWeight: "500"
  },
  linkBold: { color: "#4f46e5", fontWeight: "bold", textDecoration: "none" },
  footerText: { textAlign: "center", marginTop: "20px", color: "#666", fontSize: "14px" }
};

export default Signup;