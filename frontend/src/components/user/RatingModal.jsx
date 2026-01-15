import { useState } from "react";
import api from "../../services/api";

export default function RatingModal({ storeId, existingRating, onClose }) {
  const [rating, setRating] = useState(existingRating || 1);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    try {
      setLoading(true);

      await api.post("/ratings", {
        store_id: storeId,
        rating,
      });

      onClose();
      window.location.reload();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
      <div className="bg-white p-6 rounded space-y-4 w-80">
        <h2 className="text-lg font-semibold">
          {existingRating ? "Edit Rating" : "Rate Store"}
        </h2>

        <select
          className="border p-2 rounded w-full"
          value={rating}
          onChange={(e) => setRating(Number(e.target.value))}
        >
          {[1, 2, 3, 4, 5].map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </select>

        <div className="flex justify-end gap-2 mt-10">
          <button className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300" onClick={onClose}>Cancel</button>
          <button
            onClick={handleSubmit}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            disabled={loading}
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
}