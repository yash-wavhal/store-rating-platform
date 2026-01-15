import { useEffect, useState } from "react";
import api from "../../services/api";
import StatCard from "../../components/owner/StatCard";
import RatingsTable from "../../components/owner/RatingsTable";

export default function OwnerDashboard() {
  const [store, setStore] = useState(null);
  const [averageRating, setAverageRating] = useState(0);
  const [ratings, setRatings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await api.get("/owner/dashboard");

        setStore(res.data.store);
        setAverageRating(res.data.averageRating);
        setRatings(res.data.ratedUsers);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (loading) return <p className="p-6">Loading...</p>;

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-semibold">
        Owner Dashboard - <strong className="text-orange-500 text-3xl">{store?.name}</strong>
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <StatCard title="Average Rating" value={Number(averageRating).toFixed(1)} />
        <StatCard title="Total Ratings" value={ratings.length} />
      </div>

      <RatingsTable ratings={ratings} />
    </div>
  );
}