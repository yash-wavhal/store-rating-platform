export default function RatingsTable({ ratings }) {
  return (
    <div className="bg-white shadow">
      <table className="w-full">
        <thead className="bg-gray-800">
          <tr>
            <th className="p-3 text-left text-white">User Name</th>
            <th className="p-3 text-left text-white">Email</th>
            <th className="p-3 text-center text-white">Rating</th>
          </tr>
        </thead>
        <tbody>
          {ratings.length === 0 ? (
            <tr>
              <td colSpan="3" className="p-4 text-center">
                No ratings yet
              </td>
            </tr>
          ) : (
            ratings.map((u) => (
              <tr key={u.id} className="border-t bg-gray-100">
                <td className="p-3">{u.name}</td>
                <td className="p-3">{u.email}</td>
                <td className="p-3 font-semibold text-center">{u.rating}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}