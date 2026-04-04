import { useEffect, useState } from "react";
import api from "../services/api";
import "./Users.css";

function Users() {
  const [users, setUsers] = useState<any[]>([]);
  const [role, setRole] = useState("");
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (token) {
      api.get("/users", { headers: { Authorization: `Bearer ${token}` } })
        .then(res => setUsers(res.data))
        .catch(() => alert("Access denied: Admins only"));
    }
  }, [token]);

  const changeRole = async (id: number) => {
    await api.put("/users/role", { id, role }, { headers: { Authorization: `Bearer ${token}` } });
    const res = await api.get("/users", { headers: { Authorization: `Bearer ${token}` } });
    setUsers(res.data);
  };

  const deleteUser = async (id: number) => {
    await api.delete(`/users/${id}`, { headers: { Authorization: `Bearer ${token}` } });
    setUsers(users.filter(u => u.id !== id));
  };

  return (
    <div className="users">
      <h1>User Management (Admin Only)</h1>
      <table>
        <thead>
          <tr>
            <th>ID</th><th>Email</th><th>Role</th><th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map(u => (
            <tr key={u.id}>
              <td>{u.id}</td>
              <td>{u.email}</td>
              <td>{u.role}</td>
              <td>
                <input
                  placeholder="New Role"
                  value={role}
                  onChange={e => setRole(e.target.value)}
                />
                <button onClick={() => changeRole(u.id)}>Update Role</button>
                <button onClick={() => deleteUser(u.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Users;
