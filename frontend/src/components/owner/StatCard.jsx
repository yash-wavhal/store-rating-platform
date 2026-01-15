export default function StatCard({ title, value }) {
  return (
    <div className="bg-gray-100 rounded p-6 shadow-lg">
      <p className="text-gray-500">{title}</p>
      <p className="text-3xl font-bold mt-2">{value}</p>
    </div>
  );
}