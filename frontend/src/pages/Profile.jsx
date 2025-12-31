import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const { user, setUser, logout } = useAuth();
  const navigate = useNavigate();

  const [fullName, setFullName] = useState("");
  const [profilePic, setProfilePic] = useState(null);
  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ show: false, message: "", type: "" });
  const [isHovered, setIsHovered] = useState(false);

  const BASE_URL = "http://localhost:3000";
  const UPLOADS_URL = `${BASE_URL}/uploads/`;

  useEffect(() => {
    if (user) {
      setFullName(user.fullName || "");
      if (user.profilePic) {
        const photoUrl = user.profilePic.startsWith("http")
          ? user.profilePic
          : `${UPLOADS_URL}${user.profilePic}`;
        setPreview(photoUrl);
      }
    }
  }, [user]);

  const showToast = (msg, type) => {
    setToast({ show: true, message: msg, type: type });
    setTimeout(() => setToast({ show: false, message: "", type: "" }), 3000);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePic(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("fullName", fullName);
      if (profilePic) formData.append("profilePic", profilePic);

      const res = await api.post("/users/update-me", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (res.data) {
        setUser(res.data);
        showToast("Profile updated! ✅", "success"); // ინგლისურად
      }
    } catch (err) {
      showToast(err.response?.data?.error || "Error ❌", "error"); // ინგლისურად
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      {/* Back Button */}
      <button onClick={() => navigate(-1)} style={styles.backBtn}>
        ⬅ Back
      </button>

      <h2 style={styles.title}>Edit Profile</h2>

      <form onSubmit={handleUpdate} style={styles.form}>
        <div style={styles.avatarWrapper}>
          <div 
            style={styles.imageContainer}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            {preview ? (
              <img src={preview} alt="Profile" style={{
                ...styles.avatar,
                filter: isHovered ? "brightness(60%)" : "none"
              }} />
            ) : (
              <div style={styles.placeholder}>{fullName?.charAt(0) || "U"}</div>
            )}
            
            <label htmlFor="camera-input" style={{
              ...styles.cameraOverlay,
              opacity: isHovered ? 1 : 0
            }}>
              <span style={{ fontSize: "30px" }}>📷</span>
              <input 
                id="camera-input" 
                type="file" 
                accept="image/*" 
                onChange={handleFileChange} 
                style={{ display: "none" }} 
              />
            </label>
          </div>
        </div>

        <div style={styles.inputGroup}>
          <label style={styles.label}>Full Name</label>
          <input
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            style={styles.input}
            required
          />
        </div>

        <button type="submit" disabled={loading} style={styles.saveBtn}>
          {loading ? "Saving..." : "Save Changes"}
        </button>

        <button type="button" onClick={logout} style={styles.logoutBtn}>
          🚪 Logout
        </button>
      </form>

      {/* Toast notification */}
      {toast.show && (
        <div style={{
          ...styles.toast,
          backgroundColor: toast.type === "success" ? "#2ecc71" : "#e74c3c"
        }}>
          {toast.message}
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    maxWidth: "380px",
    margin: "50px auto",
    padding: "30px",
    borderRadius: "20px",
    backgroundColor: "#ffffff",
    boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
    position: "relative",
    fontFamily: "'Inter', sans-serif"
  },
  backBtn: {
    position: "absolute",
    top: "20px",
    left: "20px",
    border: "none",
    background: "none",
    fontSize: "14px",
    fontWeight: "bold",
    color: "#007bff",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: "5px"
  },
  title: { textAlign: "center", marginBottom: "25px", color: "#333", marginTop: "10px" },
  form: { display: "flex", flexDirection: "column", gap: "20px" },
  avatarWrapper: { display: "flex", justifyContent: "center" },
  imageContainer: {
    width: "140px",
    height: "140px",
    borderRadius: "50%",
    position: "relative",
    cursor: "pointer",
    overflow: "hidden",
    border: "4px solid #f0f2f5"
  },
  avatar: { 
    width: "100%", 
    height: "100%", 
    borderRadius: "50%", 
    objectFit: "cover",
    transition: "0.3s ease" 
  },
  placeholder: {
    width: "100%", height: "100%", borderRadius: "50%",
    backgroundColor: "#f0f2f5", display: "flex", alignItems: "center",
    justifyContent: "center", fontSize: "40px", color: "#999"
  },
  cameraOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.2)",
    transition: "0.3s ease",
    borderRadius: "50%"
  },
  inputGroup: { display: "flex", flexDirection: "column", gap: "5px" },
  label: { fontSize: "14px", fontWeight: "bold", color: "#555" },
  input: { padding: "12px", borderRadius: "10px", border: "1px solid #ddd", outline: "none" },
  saveBtn: {
    padding: "12px", borderRadius: "10px", border: "none",
    backgroundColor: "#007bff", color: "white", fontWeight: "bold", cursor: "pointer",
    transition: "0.2s"
  },
  logoutBtn: {
    padding: "12px", borderRadius: "10px", border: "1px solid #ff4757",
    backgroundColor: "transparent", color: "#ff4757", fontWeight: "bold", cursor: "pointer"
  },
  toast: {
    position: "fixed",
    bottom: "20px",
    left: "50%",
    transform: "translateX(-50%)",
    padding: "12px 25px",
    borderRadius: "50px",
    color: "white",
    fontWeight: "bold",
    boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
    zIndex: 9999
  }
};

export default Profile;