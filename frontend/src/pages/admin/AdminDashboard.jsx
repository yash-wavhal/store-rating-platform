import { useEffect, useState } from "react";
import api from "../../services/api";

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get("/admin/dashboard");
        setStats(res.data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch dashboard");
      }
    };

    fetchStats();
  }, []);

  if (!stats) return <p>Loading...</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

      {error && (
        <p className="text-red-600 text-sm text-center mb-3">{error}</p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-4 rounded shadow">
          <h3 className="text-gray-600">Total Users</h3>
          <p className="text-2xl font-bold">{stats.users}</p>
        </div>

        <div className="bg-white p-4 rounded shadow">
          <h3 className="text-gray-600">Total Stores</h3>
          <p className="text-2xl font-bold">{stats.stores}</p>
        </div>

        <div className="bg-white p-4 rounded shadow">
          <h3 className="text-gray-600">Total Ratings</h3>
          <p className="text-2xl font-bold">{stats.ratings}</p>
        </div>
      </div>
    </div>
  );
}