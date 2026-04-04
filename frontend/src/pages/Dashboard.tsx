import { useEffect, useState } from "react";
import api from "../services/api";

interface Vehicle {
  id: number;
  name: string;
  mileage: number;
}

export default function Dashboard() {
  const [user, setUser] = useState<any>(null);
  const [subscription, setSubscription] = useState<any>(null);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [vehicleName, setVehicleName] = useState("");
  const [mileage, setMileage] = useState("");

  // Fetch user + subscription
  useEffect(() => {
    const email = localStorage.getItem("email");
    const role = localStorage.getItem("role");
    setUser({ email, role });

    api.get("/subscription")
      .then(res => setSubscription(res.data))
      .catch(err => console.error(err));

    api.get("/vehicles")
      .then(res => setVehicles(res.data))
      .catch(() => setVehicles([]));
  }, []);

  const handleAddVehicle = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await api.post("/vehicles", { name: vehicleName, mileage: Number(mileage) });
      setVehicles([...vehicles, res.data]);
      setVehicleName("");
      setMileage("");
    } catch (err) {
      console.error(err);
      alert("Failed to add vehicle");
    }
  };

  return (
    <div style={{ padding: "2rem", color: "white", background: "#1a1a1a" }}>
      <h2>Welcome back, {user?.email}!</h2>
      <p>You are logged in as {user?.role} with a {subscription?.type} plan.</p>

      <section>
        <h3>Account Summary</h3>
        <p>Email: {user?.email}</p>
        <p>Role: {user?.role}</p>
        <p>Subscription: {subscription?.type}</p>
      </section>

      <section>
        <h3>Recent Activity</h3>
        {vehicles.length === 0 ? (
          <p>No recent vehicles added.</p>
        ) : (
          <ul>
            {vehicles.map(v => (
              <li key={v.id}>{v.name} — {v.mileage} km</li>
            ))}
          </ul>
        )}
      </section>

      <section>
        <h3>Add Vehicle</h3>
        <form onSubmit={handleAddVehicle}>
          <input
            type="text"
            placeholder="Vehicle Name"
            value={vehicleName}
            onChange={e => setVehicleName(e.target.value)}
          />
          <input
            type="number"
            placeholder="Mileage"
            value={mileage}
            onChange={e => setMileage(e.target.value)}
          />
          <button type="submit">Add Vehicle</button>
        </form>
      </section>
    </div>
  );
}
