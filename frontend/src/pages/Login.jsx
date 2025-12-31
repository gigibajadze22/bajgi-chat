import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await login(email, password);
      navigate("/"); // Redirect to main on success
    } catch (err) {
      setError("Invalid email or password"); 
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={authStyles.container}>
      <div style={authStyles.card}>
        <h2 style={authStyles.title}>Welcome Back</h2>
        <p style={authStyles.subtitle}>Please enter your details</p>
        
        {error && <div style={authStyles.errorBadge}>{error}</div>}

        <form onSubmit={handleSubmit} style={authStyles.form}>
          <div style={authStyles.inputGroup}>
            <label style={authStyles.label}>Email Address</label>
            <input
              type="email"
              placeholder="example@mail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={authStyles.input}
              required
            />
          </div>

          <div style={authStyles.inputGroup}>
            <label style={authStyles.label}>Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={authStyles.input}
              required
            />
          </div>

          <button type="submit" disabled={loading} style={authStyles.button}>
            {loading ? "Logging in..." : "Login"}
          </button>

          {/* Forgot Password Link - Now placed lower for a cleaner look */}
          <Link to="/forgot-password" style={authStyles.forgotLink}>
            Forgot your password?
          </Link>
        </form>
        
        <p style={authStyles.footerText}>
          Don't have an account? <Link to="/signup" style={authStyles.linkBold}>Sign up</Link>
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
    borderRadius: "28px", 
    boxShadow: "0 10px 25px rgba(0,0,0,0.05)" 
  },
  title: { fontSize: "28px", fontWeight: "800", color: "#111", marginBottom: "8px", textAlign: "center" },
  subtitle: { fontSize: "15px", color: "#6b7280", marginBottom: "32px", textAlign: "center" },
  form: { display: "flex", flexDirection: "column", gap: "18px" },
  inputGroup: { display: "flex", flexDirection: "column", gap: "8px" },
  label: { fontSize: "13px", fontWeight: "600", color: "#374151" },
  input: { 
    padding: "12px 16px", 
    borderRadius: "12px", 
    border: "1px solid #d1d5db", 
    fontSize: "15px", 
    outline: "none", 
    backgroundColor: "#f9fafb",
    transition: "border-color 0.2s"
  },
  button: { 
    padding: "14px", 
    borderRadius: "12px", 
    border: "none", 
    backgroundColor: "#4f46e5", 
    color: "#fff", 
    fontSize: "16px", 
    fontWeight: "700", 
    cursor: "pointer",
    transition: "opacity 0.2s",
    marginTop: "5px"
  },
  forgotLink: { 
    fontSize: "13px", 
    color: "#6b7280", 
    textDecoration: "none", 
    textAlign: "center", 
    marginTop: "2px",
    fontWeight: "500"
  },
  errorBadge: { 
    padding: "12px", 
    backgroundColor: "#fef2f2", 
    color: "#b91c1c", 
    borderRadius: "12px", 
    fontSize: "14px", 
    textAlign: "center", 
    marginBottom: "15px",
    border: "1px solid #fee2e2"
  },
  linkBold: { color: "#4f46e5", fontWeight: "700", textDecoration: "none" },
  footerText: { textAlign: "center", marginTop: "24px", fontSize: "14px", color: "#6b7280" }
};

export default Login;