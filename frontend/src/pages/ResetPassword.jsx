import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../api/axios";

const ResetPassword = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const [email] = useState(location.state?.email || "");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  
  // Resend ლოგიკა
  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);

  // ტაიმერის ათვლა
  useEffect(() => {
    let interval;
    if (timer > 0) {
      interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
    } else {
      setCanResend(true);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const handleResend = async () => {
    if (!canResend) return;
    setError("");
    setSuccess("");
    try {
      await api.post("/auth/forgot-password", { email });
      setSuccess("New code sent successfully!");
      setTimer(60);
      setCanResend(false);
    } catch (err) {
      setError("Failed to resend code.");
    }
  };

const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      // აუცილებელია გავაგზავნოთ 'otpCode' და არა 'otp', რადგან ბექენდი ასე ელოდება
      await api.post("/auth/reset-password", { 
        email, 
        otpCode: otp, // აქ შეიცვალა!
        newPassword 
      });
      
      setSuccess("Password updated successfully! Redirecting...");
      setTimeout(() => navigate("/login"), 2500);
    } catch (err) {
      
      setError(err.response?.data?.message || "Invalid or expired code");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div style={authStyles.container}>
      <div style={authStyles.card}>
        <h2 style={authStyles.title}>Verify OTP</h2>
        <p style={authStyles.subtitle}>Enter the code sent to <b>{email}</b></p>
        
        {error && <div style={authStyles.errorBadge}>{error}</div>}
        {success && <div style={authStyles.successBadge}>{success}</div>}

        <form onSubmit={handleSubmit} style={authStyles.form}>
          <div style={authStyles.inputGroup}>
            <label style={authStyles.label}>6-Digit Code</label>
            <input
              type="text"
              placeholder="000000"
              maxLength="6"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              style={{ ...authStyles.input, textAlign: "center", letterSpacing: "8px", fontSize: "20px" }}
              required
            />
          </div>

          <div style={authStyles.inputGroup}>
            <label style={authStyles.label}>New Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              style={authStyles.input}
              required
            />
          </div>

          <button type="submit" disabled={loading} style={authStyles.button}>
            {loading ? "Verifying..." : "Update Password"}
          </button>
        </form>

        <div style={authStyles.resendWrapper}>
          <p style={authStyles.resendText}>Didn't receive the code?</p>
          <button 
            onClick={handleResend} 
            disabled={!canResend}
            style={{ 
              ...authStyles.resendButton, 
              color: canResend ? "#4f46e5" : "#9ca3af",
              cursor: canResend ? "pointer" : "not-allowed"
            }}
          >
            {canResend ? "Resend Code" : `Resend in ${timer}s`}
          </button>
        </div>
      </div>
    </div>
  );
};

const authStyles = {
  container: { height: "100vh", display: "flex", justifyContent: "center", alignItems: "center", backgroundColor: "#f3f4f6", fontFamily: "'Inter', sans-serif" },
  card: { width: "100%", maxWidth: "400px", padding: "40px", backgroundColor: "#fff", borderRadius: "28px", boxShadow: "0 10px 25px rgba(0,0,0,0.05)" },
  title: { fontSize: "28px", fontWeight: "800", color: "#111", marginBottom: "8px", textAlign: "center" },
  subtitle: { fontSize: "14px", color: "#6b7280", marginBottom: "25px", textAlign: "center" },
  form: { display: "flex", flexDirection: "column", gap: "20px" },
  inputGroup: { display: "flex", flexDirection: "column", gap: "8px" },
  label: { fontSize: "13px", fontWeight: "600", color: "#374151" },
  input: { padding: "12px 16px", borderRadius: "12px", border: "1px solid #d1d5db", outline: "none", backgroundColor: "#f9fafb", width: "100%", boxSizing: "border-box" },
  button: { padding: "14px", borderRadius: "12px", border: "none", backgroundColor: "#4f46e5", color: "#fff", fontWeight: "700", cursor: "pointer" },
  errorBadge: { padding: "12px", backgroundColor: "#fef2f2", color: "#b91c1c", borderRadius: "12px", fontSize: "14px", textAlign: "center", marginBottom: "15px" },
  successBadge: { padding: "12px", backgroundColor: "#f0fdf4", color: "#15803d", borderRadius: "12px", fontSize: "14px", textAlign: "center", marginBottom: "15px" },
  resendWrapper: { marginTop: "25px", textAlign: "center" },
  resendText: { fontSize: "13px", color: "#6b7280", marginBottom: "5px" },
  resendButton: { background: "none", border: "none", fontWeight: "700", fontSize: "14px" }
};

export default ResetPassword;