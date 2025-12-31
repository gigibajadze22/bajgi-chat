import { useState, useEffect } from "react";
import api from "../api/axios";
import { connectSocket } from "../api/socket";
import Messages from "./Messages";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Chat = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [socket, setSocket] = useState(null);

  const BASE_URL = "http://localhost:3000";
  const UPLOADS_URL = `${BASE_URL}/uploads/`;

  useEffect(() => {
    if (!user?.id) return;
    const s = connectSocket(user.id);
    setSocket(s);
    s.on("getOnlineUsers", (online) => setOnlineUsers(online));
    return () => s.disconnect();
  }, [user]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await api.get("/users/all");
        setUsers(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error("Failed to load users", err);
      }
    };
    if (user) fetchUsers();
  }, [user]);

  const getAvatar = (pic) => {
    if (!pic) return "https://cdn-icons-png.flaticon.com/512/149/149071.png";
    return pic.startsWith("http") ? pic : `${UPLOADS_URL}${pic}`;
  };

  if (!user) return <div style={styles.loader}>Loading...</div>;

  return (
    <div style={styles.mainWrapper}>
      {/* Sidebar */}
      <div style={styles.sidebar}>
        <div onClick={() => navigate("/profile")} style={styles.profileCard}>
          <img src={getAvatar(user.profilePic)} alt="profile" style={styles.sidebarAvatar} />
          <div style={{ flex: 1, overflow: "hidden" }}>
            <div style={styles.profileName}>{user.fullName}</div>
            <div style={styles.profileSubtitle}>My Profile</div>
          </div>
        </div>

        <h3 style={styles.sidebarTitle}>Chats</h3>

        <div style={styles.userList}>
          {users.length === 0 ? (
            <p style={styles.noContacts}>No contacts found</p>
          ) : (
            users.map(u => {
              const isOnline = onlineUsers.includes(u.id.toString());
              return (
                <div
                  key={u.id}
                  onClick={() => setSelectedUser(u)}
                  style={{
                    ...styles.userItem,
                    backgroundColor: selectedUser?.id === u.id ? "#f0f7ff" : "transparent"
                  }}
                >
                  <div style={{ position: "relative" }}>
                    <img src={getAvatar(u.profilePic)} alt="profile" style={styles.userAvatar} />
                    {isOnline && <div style={styles.onlineBadge} />}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={styles.userName}>{u.fullName}</div>
                    <div style={{ ...styles.userStatus, color: isOnline ? "#31a24c" : "#65676b" }}>
                      {isOnline ? "Online" : "Offline"}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Main Chat Area */}
      <div style={styles.chatAreaWrapper}>
        <div style={styles.chatMainCard}>
          {selectedUser ? (
            <Messages selectedUser={selectedUser} currentUser={user} />
          ) : (
            <div style={styles.welcomeContainer}>
              <div style={styles.welcomeContent}>
                <div style={styles.iconCircle}>
                  <span style={{ fontSize: "60px" }}>✨</span>
                </div>
                <h2 style={styles.welcomeTitle}>Welcome, {user.fullName.split(" ")[0]}!</h2>
                <p style={styles.welcomeText}>Select a friend to start chatting.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const styles = {
  mainWrapper: {
    display: "flex",
    position: "fixed", // აფიქსირებს ეკრანზე
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    height: "100vh",
    width: "100vw",
    overflow: "hidden", // თიშავს ყველანაირ სქროლს მთავარ გვერდზე
    fontFamily: "'Inter', sans-serif",
    backgroundColor: "#f0f2f5",
    boxSizing: "border-box"
  },
  loader: { display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" },
  
  sidebar: { 
    width: "350px", 
    minWidth: "350px",
    backgroundColor: "#fff", 
    borderRight: "1px solid #e5e7eb", 
    display: "flex", 
    flexDirection: "column",
    height: "100%" 
  },
  profileCard: { 
    display: "flex", 
    alignItems: "center", 
    gap: "12px", 
    padding: "16px", 
    margin: "15px", 
    cursor: "pointer", 
    borderRadius: "16px", 
    backgroundColor: "#f8fafc", 
    border: "1px solid #f1f5f9"
  },
  sidebarAvatar: { width: "45px", height: "45px", borderRadius: "50%", objectFit: "cover" },
  profileName: { fontWeight: "700", fontSize: "15px", color: "#1c1e21" },
  profileSubtitle: { fontSize: "12px", color: "#65676b" },
  sidebarTitle: { fontSize: "22px", fontWeight: "800", padding: "0 20px 10px 20px", color: "#1c1e21" },
  
  userList: { 
    flex: 1, 
    overflowY: "auto", 
    paddingBottom: "20px"
  },
  userItem: { display: "flex", alignItems: "center", gap: "12px", padding: "12px 20px", cursor: "pointer", transition: "0.2s" },
  userAvatar: { width: "50px", height: "50px", borderRadius: "50%", objectFit: "cover" },
  userName: { fontSize: "15px", fontWeight: "600" },
  userStatus: { fontSize: "12px" },
  onlineBadge: { width: "13px", height: "13px", backgroundColor: "#31a24c", borderRadius: "50%", position: "absolute", bottom: "2px", right: "2px", border: "2px solid #fff" },
  noContacts: { textAlign: "center", color: "#999", marginTop: "40px" },

  chatAreaWrapper: {
    flex: 1,
    height: "100%",
    padding: "20px 20px 20px 20px", // მარჯვნიდან 80px დაშორება
    boxSizing: "border-box", 
    display: "flex",
    overflow: "hidden" // რომ შიგთავსმა არ გაბეროს გარეთ
  },
  chatMainCard: {
    flex: 1,
    height: "100%",
    backgroundColor: "#fff",
    borderRadius: "28px",
    boxShadow: "0 10px 30px rgba(0,0,0,0.04)",
    display: "flex",
    flexDirection: "column",
    overflow: "hidden", 
    border: "1px solid #eef0f2"
  },

  welcomeContainer: { flex: 1, display: "flex", justifyContent: "center", alignItems: "center" },
  welcomeContent: { textAlign: "center" },
  iconCircle: { width: "120px", height: "120px", borderRadius: "50%", backgroundColor: "#f0f7ff", display: "flex", justifyContent: "center", alignItems: "center", margin: "0 auto 20px auto" },
  welcomeTitle: { fontSize: "26px", fontWeight: "800", color: "#1c1e21" },
  welcomeText: { color: "#65676b", fontSize: "15px" }
};

export default Chat;