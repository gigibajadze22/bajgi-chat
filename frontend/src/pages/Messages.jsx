import { useEffect, useState, useRef } from "react";
import api from "../api/axios";
import { getSocket } from "../api/socket";

const Messages = ({ selectedUser, currentUser }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [activeMenuId, setActiveMenuId] = useState(null);
  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null); // რეფი ტექსტარეას ზომის სამართავად
  const socket = getSocket();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (!selectedUser) return;
    const fetchMessages = async () => {
      try {
        const res = await api.get(`/messages/${selectedUser.id}`);
        setMessages(res.data || []);
        setTimeout(scrollToBottom, 100);
      } catch (err) {
        console.error("Failed to load messages", err);
      }
    };
    fetchMessages();
  }, [selectedUser]);

  useEffect(() => {
    if (!socket || !selectedUser) return;

    const handleReceive = (msg) => {
      if (msg.senderId === selectedUser.id || msg.receiverId === selectedUser.id) {
        setMessages((prev) => [...prev, msg]);
        setTimeout(scrollToBottom, 50);
      }
    };

    const handleDeleted = (msgId) => {
      setMessages((prev) => prev.filter((m) => m.id !== Number(msgId)));
    };

    const handleUpdated = (msg) => {
      setMessages((prev) => prev.map((m) => (m.id === msg.id ? msg : m)));
    };

    socket.on("receiveMessage", handleReceive);
    socket.on("deleteMessage", handleDeleted);
    socket.on("updateMessage", handleUpdated);

    return () => {
      socket.off("receiveMessage", handleReceive);
      socket.off("deleteMessage", handleDeleted);
      socket.off("updateMessage", handleUpdated);
    };
  }, [socket, selectedUser]);

  const handleSend = async (e) => {
    if (e) e.preventDefault();
    if (!newMessage.trim() || !currentUser || !selectedUser || !socket) return;

    try {
      if (editingId) {
        await api.post(`/messages/update/${editingId}`, { content: newMessage });
        const updatedMsg = { ...messages.find((m) => m.id === editingId), content: newMessage };
        setMessages((prev) => prev.map((m) => (m.id === editingId ? updatedMsg : m)));
        setEditingId(null);
        setActiveMenuId(null);
      } else {
        const res = await api.post(`/messages/send/${selectedUser.id}`, { content: newMessage });
        const messageData = { ...res.data, senderId: currentUser.id, receiverId: selectedUser.id };
        setMessages((prev) => [...prev, messageData]);
        socket.emit("sendMessage", messageData);
      }
      
      // ინპუტის გასუფთავება და ზომის დაბრუნება
      setNewMessage("");
      if (textareaRef.current) {
        textareaRef.current.style.height = "24px"; 
      }
      setTimeout(scrollToBottom, 50);
    } catch (err) {
      console.error("Failed to send/update message", err);
    }
  };

  // Enter-ზე გაგზავნის ლოგიკა
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/messages/delete/${id}`);
      setMessages((prev) => prev.filter((msg) => msg.id !== Number(id)));
      socket.emit("deleteMessage", id, selectedUser.id);
      setActiveMenuId(null);
    } catch (err) {
      console.error("წაშლა ვერ მოხერხდა", err);
    }
  };

  const startEdit = (msg) => {
    setEditingId(msg.id);
    setNewMessage(msg.content);
    setActiveMenuId(null);
    // ედიტისას ინპუტი რომ ავტომატურად გაიზარდოს ტექსტის შესაბამისად
    setTimeout(() => {
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto";
        textareaRef.current.style.height = textareaRef.current.scrollHeight + "px";
      }
    }, 0);
  };

  if (!selectedUser || !currentUser) return null;

  return (
    <div style={styles.chatContainer}>
      <div style={styles.messagesList}>
        {messages.map((msg, index) => {
          const isMe = msg.senderId === currentUser.id;

          return (
            <div key={msg.id || index} style={{
              ...styles.messageRow,
              justifyContent: isMe ? "flex-end" : "flex-start",
            }}>
              {!isMe && <img src={selectedUser.profilePic || "/avatar.png"} alt="avatar" style={styles.avatar} />}

              <div style={styles.bubbleWrapper}>
                {/* სამი წერტილი მარცხნივ */}
                {isMe && (
                  <span 
                    style={styles.menuTrigger} 
                    onClick={() => setActiveMenuId(activeMenuId === msg.id ? null : msg.id)}
                  >
                    ⋮
                  </span>
                )}

                <div style={{
                  ...styles.bubble,
                  backgroundColor: isMe ? "#4f46e5" : "#ffffff",
                  color: isMe ? "#fff" : "#1f2937",
                  borderRadius: isMe ? "18px 18px 2px 18px" : "18px 18px 18px 2px",
                }}>
                  {msg.content}
                </div>

                {activeMenuId === msg.id && (
                  <div style={styles.dropdown}>
                    <div onClick={() => startEdit(msg)} style={styles.dropdownBtn}>Edit</div>
                    <div onClick={() => handleDelete(msg.id)} style={{...styles.dropdownBtn, color: "#ef4444", borderTop: "1px solid #f3f4f6"}}>Delete</div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} style={{ height: "10px" }} />
      </div>

      <div style={styles.inputArea}>
        <div style={styles.inputWrapper}>
          <textarea
            ref={textareaRef}
            placeholder={editingId ? "Edit message..." : "Type a message..."}
            value={newMessage}
            onKeyDown={handleKeyDown}
            onChange={(e) => setNewMessage(e.target.value)}
            rows={1}
            onInput={(e) => {
                e.target.style.height = 'auto';
                e.target.style.height = `${e.target.scrollHeight}px`;
            }}
            style={styles.textarea}
          />
          <button onClick={handleSend} style={styles.sendBtn}>
            {editingId ? "Save" : "Send"}
          </button>
        </div>
      </div>
    </div>
  );
};

const styles = {
  chatContainer: { height: "100%", display: "flex", flexDirection: "column", backgroundColor: "#f3f4f6" },
  messagesList: { flex: 1, overflowY: "auto", padding: "20px", display: "flex", flexDirection: "column", gap: "10px" },
  messageRow: { display: "flex", alignItems: "flex-end", width: "100%" },
  avatar: { width: "32px", height: "32px", borderRadius: "50%", marginRight: "8px" },
  bubbleWrapper: { position: "relative", display: "flex", alignItems: "center", maxWidth: "75%" },
  bubble: { padding: "10px 16px", fontSize: "15px", lineHeight: "1.5", whiteSpace: "pre-wrap", overflowWrap: "anywhere" },
  menuTrigger: { padding: "0 8px", color: "#9ca3af", cursor: "pointer", fontSize: "20px" },
  dropdown: { 
    position: "absolute", top: "100%", left: "0", marginTop: "5px", backgroundColor: "#fff", 
    borderRadius: "12px", boxShadow: "0 10px 25px rgba(0,0,0,0.1)", zIndex: 1000, minWidth: "100px", border: "1px solid #f0f0f0" 
  },
  dropdownBtn: { padding: "10px", cursor: "pointer", fontSize: "13px", fontWeight: "600", textAlign: "center", backgroundColor: "#fff" },
  inputArea: { padding: "15px 20px 25px 20px", backgroundColor: "#f3f4f6" },
  inputWrapper: { display: "flex", alignItems: "flex-end", gap: "10px", backgroundColor: "#fff", padding: "10px 14px", borderRadius: "24px" },
  textarea: { 
    flex: 1, border: "none", outline: "none", fontSize: "15px", backgroundColor: "transparent", 
    fontFamily: "inherit", maxHeight: "120px", minHeight: "24px", resize: "none", padding: "4px 0" 
  },
  sendBtn: { backgroundColor: "#4f46e5", color: "#fff", border: "none", padding: "8px 18px", borderRadius: "18px", fontWeight: "700", cursor: "pointer" }
};

export default Messages;