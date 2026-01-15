import { useEffect, useState } from "react";
import api from "../../services/api";
import StoreCard from "../../components/user/StoreCard.jsx";

export default function UserDashboard() {
  const [stores, setStores] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStores = async () => {
      try {
        const res = await api.get("/stores", {
          params: { search },
        });
        console.log("res.data", res.data);
        setStores(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchStores();
  }, [search]);

  if (loading) return <p className="p-6">Loading...</p>;

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-semibold">Stores</h1>

      <input
        type="text"
        placeholder="Search by name or address"
        className="border p-2 rounded w-full"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <div className="flex gap-6">
        {stores.length === 0 ? (
          <p>No stores found</p>
        ) : (
          stores.map((store) => (
            <StoreCard key={store.id} store={store} />
          ))
        )}
      </div>
    </div>
  );
}