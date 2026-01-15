import { useEffect, useState } from "react";
import api from "../../../services/api";

export default function Stores() {
  const [stores, setStores] = useState([]);
  const [owners, setOwners] = useState([]);

  const [form, setForm] = useState({
    name: "",
    email: "",
    address: "",
    owner_id: "",
  });

  const [filters, setFilters] = useState({
    name: "",
    email: "",
    address: "",
    owner_id: "",
  });

  const [error, setError] = useState("");

  const fetchStores = async () => {
    try {
      const res = await api.get("/admin/stores", {
        params: filters,
      });
      setStores(res.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch stores");
    }
  };

  const fetchOwners = async () => {
    try {
      const res = await api.get("/admin/users?role=STORE_OWNER");
      setOwners(res.data);
    } catch {
      setOwners([]);
    }
  };

  useEffect(() => {
    fetchStores();
    fetchOwners();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await api.post("/admin/stores", form);
      fetchStores();
      setForm({ name: "", email: "", address: "", owner_id: "" });
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create store");
    }
  };

  const handleFilter = (e) => {
    e.preventDefault();
    fetchStores();
  };

  const clearFilters = () => {
    setFilters({ name: "", email: "", address: "", owner_id: "" });
    fetchStores();
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Stores</h1>

      {error && (
        <p className="text-red-600 text-sm text-center mb-3">{error}</p>
      )}

      <form
        onSubmit={handleFilter}
        className="bg-white p-4 rounded shadow mb-6 flex gap-2 w-full"
      >
        <input
          placeholder="Filter by Name"
          value={filters.name}
          onChange={(e) => setFilters({ ...filters, name: e.target.value })}
          className="border p-2"
        />

        <input
          placeholder="Filter by Email"
          value={filters.email}
          onChange={(e) => setFilters({ ...filters, email: e.target.value })}
          className="border p-2"
        />

        <input
          placeholder="Filter by Address"
          value={filters.address}
          onChange={(e) => setFilters({ ...filters, address: e.target.value })}
          className="border p-2"
        />

        <select
          value={filters.owner_id}
          onChange={(e) =>
            setFilters({ ...filters, owner_id: e.target.value })
          }
          className="border p-2 w-72"
        >
          <option value="">All Owners</option>
          {owners.map((o) => (
            <option key={o.id} value={o.id}>
              {o.name}
            </option>
          ))}
        </select>

        <div className="flex gap-2 ml-4">
          <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded">
            Apply
          </button>
          <button
            type="button"
            onClick={clearFilters}
            className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
          >
            Clear
          </button>
        </div>
      </form>

      <form
        onSubmit={handleSubmit}
        className="bg-white p-4 rounded shadow mb-6 grid grid-cols-1 md:grid-cols-4 gap-3"
      >
        <input
          placeholder="Store Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="border p-2"
          required
        />

        <input
          placeholder="Store Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          className="border p-2"
          required
        />

        <input
          placeholder="Address"
          value={form.address}
          onChange={(e) => setForm({ ...form, address: e.target.value })}
          className="border p-2"
          required
        />

        <select
          value={form.owner_id}
          onChange={(e) =>
            setForm({ ...form, owner_id: e.target.value })
          }
          className="border p-2"
          required
        >
          <option value="">Select Store Owner</option>
          {owners.map((o) => (
            <option key={o.id} value={o.id}>
              {o.name} ({o.email})
            </option>
          ))}
        </select>

        <button className="bg-blue-600 hover:bg-blue-700 text-white py-2 rounded col-span-full">
          Create Store
        </button>
      </form>

      <table className="w-full bg-white rounded shadow">
        <thead className="bg-gray-200">
          <tr>
            <th className="p-2 text-left">Name</th>
            <th className="p-2 text-left">Email</th>
            <th className="p-2 text-left">Address</th>
            <th className="p-2 text-center">Rating</th>
          </tr>
        </thead>
        <tbody>
          {stores.map((s) => (
            <tr key={s.id} className="border-t">
              <td className="p-2">{s.name}</td>
              <td className="p-2">{s.email}</td>
              <td className="p-2">{s.address}</td>
              <td className="p-2 text-center">
                {s.rating ? Number(s.rating).toFixed(1) : "N/A"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}