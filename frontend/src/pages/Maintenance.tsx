import { useEffect, useState } from "react";
import api from "../services/api";

function Maintenance() {
  const [logs, setLogs] = useState<any[]>([]);
  const [vehicleId, setVehicleId] = useState("");
  const [details, setDetails] = useState("");

  useEffect(() => {
    api.get("/maintenance").then(res => setLogs(res.data));
  }, []);

  const addLog = async () => {
    await api.post("/maintenance", { vehicleId: Number(vehicleId), details });
    const res = await api.get("/maintenance");
    setLogs(res.data);
  };

  return (
    <div>
      <h1>Maintenance Logs</h1>
      <input placeholder="Vehicle ID" value={vehicleId} onChange={e => setVehicleId(e.target.value)} />
      <input placeholder="Details" value={details} onChange={e => setDetails(e.target.value)} />
      <button onClick={addLog}>Add Maintenance</button>

      <ul>
        {logs.map(log => (
          <li key={log.id}>
            Vehicle {log.vehicleId}: {log.details} ({new Date(log.date).toLocaleDateString()})
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Maintenance;
