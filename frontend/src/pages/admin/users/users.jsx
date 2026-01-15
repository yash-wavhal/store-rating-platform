import { useEffect, useState } from "react";
import api from "../../../services/api";

export default function Users() {
  const [users, setUsers] = useState([]);

  const [form, setForm] = useState({
    name: "",
    email: "",
    address: "",
    password: "",
    role: "USER",
  });

  const [filters, setFilters] = useState({
    name: "",
    email: "",
    address: "",
    role: "",
  });

  const [error, setError] = useState("");

  const fetchUsers = async () => {
    try {
      const res = await api.get("/admin/users", {
        params: filters,
      });
      setUsers(res.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch users");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/admin/users", form);
      fetchUsers();
      alert("User created");
    } catch (err) {
      setError(err.response?.data?.message || "Error");
    }
  };

  const handleFilter = (e) => {
    e.preventDefault();
    fetchUsers();
  };

  const clearFilters = () => {
    setFilters({ name: "", email: "", address: "", role: "" });
    fetchUsers();
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Users</h1>

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
          value={filters.role}
          onChange={(e) => setFilters({ ...filters, role: e.target.value })}
          className="border p-2 w-72"
        >
          <option value="">All Roles</option>
          <option value="USER">USER</option>
          <option value="STORE_OWNER">STORE_OWNER</option>
          <option value="ADMIN">ADMIN</option>
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
        className="bg-white p-4 rounded shadow mb-6 grid grid-cols-1 md:grid-cols-5 gap-3"
      >
        <input placeholder="Name" onChange={e => setForm({ ...form, name: e.target.value })} className="border p-2" />
        <input placeholder="Email" onChange={e => setForm({ ...form, email: e.target.value })} className="border p-2" />
        <input placeholder="Address" onChange={e => setForm({ ...form, address: e.target.value })} className="border p-2" />
        <input placeholder="Password" onChange={e => setForm({ ...form, password: e.target.value })} className="border p-2" />
        <select onChange={e => setForm({ ...form, role: e.target.value })} className="border p-2">
          <option value="USER">USER</option>
          <option value="STORE_OWNER">STORE_OWNER</option>
          <option value="ADMIN">ADMIN</option>
        </select>
        <button className="bg-blue-600 hover:bg-blue-700 text-white py-2 rounded col-span-full">
          Create User
        </button>
      </form>

      <table className="w-full bg-white rounded shadow">
        <thead className="bg-gray-200">
          <tr>
            <th className="p-2 text-left">Name</th>
            <th className="p-2 text-left">Email</th>
            <th className="p-2 text-left">Address</th>
            <th className="p-2 text-left">Role</th>
            <th className="p-2 text-center">Rating</th>
          </tr>
        </thead>
        <tbody>
          {users.map(u => (
            <tr key={u.id} className="border-t">
              <td className="p-2">{u.name}</td>
              <td className="p-2">{u.email}</td>
              <td className="p-2">{u.address}</td>
              <td className="p-2">{u.role}</td>
              <td className="p-2 text-center">
                {u.role === "STORE_OWNER"
                  ? (u.rating ? Number(u.rating).toFixed(1) : "0.0")
                  : "N/A"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}