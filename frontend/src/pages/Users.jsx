import { useEffect, useState } from "react";
import api from "../api/axios";

const Users = ({ onSelect }) => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await api.get("/users/all");

        // 🔥 backend აბრუნებს პირდაპირ array-ს
        setUsers(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error("Failed to load users", err);
        setUsers([]);
      }
    };

    fetchUsers();
  }, []);

  return (
    <div>
      <h3>Users</h3>

      {users.length === 0 && <p>No users</p>}

      {users.map(user => (
        <div
          key={user.id}
          onClick={() => onSelect(user)}
          style={{
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            marginBottom: "10px"
          }}
        >
          <img
            src={user.profilePic || "/avatar.png"}
            width="32"
            height="32"
            style={{ borderRadius: "50%" }}
          />
          <span>{user.fullName}</span>
        </div>
      ))}
    </div>
  );
};

export default Users;
