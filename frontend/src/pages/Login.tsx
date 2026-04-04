import { useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await api.post("/login", { email, password });
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", res.data.role);
      localStorage.setItem("email", res.data.email);
      navigate("/dashboard");
    } catch (err) {
      console.error("Login failed", err);
    }
  };

  return (
    <div style={{ padding: "20px", color: "#eee" }}>
      <h1 style={{ color: "#a64ca6" }}>Login</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="email">Email</label>
        <input
          id="email"
          name="email"
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />

        <label htmlFor="password">Password</label>
        <input
          id="password"
          name="password"
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />

        <button
          type="submit"
          style={{ background: "#a64ca6", color: "#fff", padding: "5px 15px", marginTop: "10px" }}
        >
          Login
        </button>
      </form>
    </div>
  );
}

export default Login;
