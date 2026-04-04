import api from "../services/api";

function Pricing() {
  const handleUpgrade = async () => {
    try {
      await api.post("/subscription/upgrade", {}, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });
      alert("✅ Upgraded to Premium! Refresh Analytics page to see charts.");
    } catch (err) {
      alert("Upgrade failed");
    }
  };

  return (
    <div style={{ padding: "20px", color: "#eee" }}>
      <h1 style={{ color: "#a64ca6" }}>Pricing</h1>
      <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "20px" }}>
        <thead>
          <tr style={{ background: "#333", color: "#a64ca6" }}>
            <th>Feature</th>
            <th>Free</th>
            <th>Premium</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Vehicle Tracking</td>
            <td>✔</td>
            <td>✔</td>
          </tr>
          <tr>
            <td>Maintenance Logs</td>
            <td>✔</td>
            <td>✔</td>
          </tr>
          <tr>
            <td>Analytics & Reports</td>
            <td>✘</td>
            <td>✔</td>
          </tr>
          <tr>
            <td>Export to CSV/PDF</td>
            <td>✘</td>
            <td>✔</td>
          </tr>
        </tbody>
      </table>
      <button
        onClick={handleUpgrade}
        style={{ marginTop: "20px", background: "#a64ca6", color: "#fff", padding: "10px 20px" }}
      >
        Subscribe to Premium
      </button>
    </div>
  );
}

export default Pricing;

