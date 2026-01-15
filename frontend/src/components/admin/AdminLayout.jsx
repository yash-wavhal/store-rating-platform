import { NavLink, Outlet } from "react-router-dom";

export default function AdminLayout() {
  const linkClass = ({ isActive }) =>
    `block rounded px-4 py-2 transition ${
      isActive
        ? "bg-gray-700 font-semibold"
        : "hover:bg-gray-700"
    }`;

  return (
    <div className="min-h-screen flex bg-gray-100">
      <aside className="w-64 min-h-screen bg-gray-900 text-white p-6">
        <h2 className="text-xl font-bold mb-8">Admin Panel</h2>

        <nav className="space-y-2">
          <NavLink to="/admin/dashboard" className={linkClass}>
            Dashboard
          </NavLink>

          <NavLink to="/admin/users" className={linkClass}>
            Users
          </NavLink>

          <NavLink to="/admin/stores" className={linkClass}>
            Stores
          </NavLink>
        </nav>
      </aside>
      
      <main className="flex-1 p-6">
        <Outlet />
      </main>
    </div>
  );
}