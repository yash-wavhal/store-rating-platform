import { Link } from "react-router-dom";
import api from "../services/api";

export default function Navbar({ user }) {
  const handleLogout = async () => {
    await api.post("/auth/logout");
    window.location.href = "/login";
  };

  return (
    <div className="flex justify-between items-center bg-gray-800 text-white px-6 py-6">
      <h1 className="font-semibold text-xl">Store Rating Platform</h1>

      <div className="relative">
        <span className="mr-4">{user?.name}</span>

        <div className="inline-flex gap-3">
          {(user.role === "USER" || user.role === "STORE_OWNER") && (
            <Link
              to={
                  "/update-password"
              }
              className="bg-gray-900 py-2 px-4 rounded-md hover:bg-gray-600"
            >
              Update Password
            </Link>
          )}

          <button onClick={handleLogout} className="bg-gray-900 py-2 px-4 rounded-md hover:bg-gray-600">
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}