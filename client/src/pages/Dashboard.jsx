import { useEffect, useState } from "react";
import API from "../api/api";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  // 🔥 Fetch users
  useEffect(() => {
    const fetchUsers = async () => {
      try {   
        const res = await API.get("/users");
        setUsers(res.data.data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchUsers();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div>
      <h1>Dashboard</h1>

      <button onClick={handleLogout}>Logout</button>

      <h2>Users:</h2>

      {users.length === 0 ? (
        <p>No users found</p>
      ) : (
        users.map((u, i) => (
          <p key={i}>{u.email}</p>
        ))
      )}
    </div>
  );
}

export default Dashboard;