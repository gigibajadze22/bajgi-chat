import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/axios";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await api.post("/auth/forgot-password", { email });
      // გადავიყვანოთ Reset Password გვერდზე და გადავაყოლოთ მეილი state-ით
      navigate("/reset-password", { state: { email } });
    } catch (err) {
      setError(err.response?.data?.message || "User not found");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={authStyles.container}>
      <div style={authStyles.card}>
        <h2 style={authStyles.title}>Forgot Password</h2>
        <p style={authStyles.subtitle}>Enter your email to receive a 6-digit verification code.</p>
        
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
          <button type="submit" disabled={loading} style={authStyles.button}>
            {loading ? "Sending..." : "Get Reset Code"}
          </button>
        </form>
        
        <p style={authStyles.footerText}>
          <Link to="/login" style={authStyles.linkBold}>Back to Login</Link>
        </p>
      </div>
    </div>
  );
};

// სტილები იგივე რჩება რაც წინა ვერსიაში...
const authStyles = {
  container: { height: "100vh", display: "flex", justifyContent: "center", alignItems: "center", backgroundColor: "#f3f4f6", fontFamily: "'Inter', sans-serif" },
  card: { width: "100%", maxWidth: "400px", padding: "40px", backgroundColor: "#fff", borderRadius: "28px", boxShadow: "0 10px 25px rgba(0,0,0,0.05)" },
  title: { fontSize: "28px", fontWeight: "800", color: "#111", marginBottom: "8px", textAlign: "center" },
  subtitle: { fontSize: "14px", color: "#6b7280", marginBottom: "25px", textAlign: "center" },
  form: { display: "flex", flexDirection: "column", gap: "20px" },
  inputGroup: { display: "flex", flexDirection: "column", gap: "8px" },
  label: { fontSize: "13px", fontWeight: "600", color: "#374151" },
  input: { padding: "12px 16px", borderRadius: "12px", border: "1px solid #d1d5db", outline: "none", backgroundColor: "#f9fafb" },
  button: { padding: "14px", borderRadius: "12px", border: "none", backgroundColor: "#4f46e5", color: "#fff", fontWeight: "700", cursor: "pointer" },
  errorBadge: { padding: "12px", backgroundColor: "#fef2f2", color: "#b91c1c", borderRadius: "12px", fontSize: "14px", textAlign: "center", marginBottom: "15px" },
  linkBold: { color: "#4f46e5", fontWeight: "700", textDecoration: "none" },
  footerText: { textAlign: "center", marginTop: "24px", fontSize: "14px", color: "#6b7280" }
};

export default ForgotPassword;