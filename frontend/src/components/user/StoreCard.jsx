import { useState } from "react";
import RatingModal from "./RatingModal.jsx";

export default function StoreCard({ store }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="bg-gray-100 shadow rounded p-6 space-y-2">
      <h2 className="text-lg font-semibold">{store.name}</h2>
      <p className="text-gray-600">{store.address}</p>

      <p>Overall Rating: ⭐ <strong>{store.average_rating}</strong></p>
      <p>Your Rating: <strong>{store.user_rating ?? "Not rated"}</strong></p>

      <button
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        onClick={() => setOpen(true)}
      >
        {store.user_rating ? "Edit Rating" : "Rate Store"}
      </button>

      {open && (
        <RatingModal
          storeId={store.id}
          existingRating={store.user_rating}
          onClose={() => setOpen(false)}
        />
      )}
    </div>
  );
}