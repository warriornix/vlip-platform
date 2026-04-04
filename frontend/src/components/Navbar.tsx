import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../services/api";

export default function Navbar() {
  const [subscription, setSubscription] = useState<any>(null);

  useEffect(() => {
    api.get("/subscription")
      .then(res => setSubscription(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <nav>
      <h1>VLIP Platform</h1>
      {subscription && <p>Subscription: {subscription.type} ({subscription.status})</p>}
      <div>
        <Link to="/">Dashboard</Link> |{" "}
        <Link to="/login">Login</Link> |{" "}
        <Link to="/register">Register</Link>
      </div>
    </nav>
  );
}
