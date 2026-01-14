import { Link, Outlet } from "react-router-dom";

export default function AdminLayout() {
    return (
        <div className="min-h-screen flex bg-gray-100">

            <aside className="w-64 bg-gray-900 text-white p-6">
                <h2 className="text-xl font-bold mb-6">Admin Panel</h2>

                <nav className="space-y-3">
                    <Link to="/admin/dashboard" className="block hover:text-gray-300">
                        Dashboard
                    </Link>
                    <Link to="/admin/users" className="block hover:text-gray-300">
                        Users
                    </Link>
                    <Link to="/admin/stores" className="block hover:text-gray-300">
                        Stores
                    </Link>
                </nav>
            </aside>

            {/* Page Content */}
            <main className="flex-1 p-6">
                <Outlet />
            </main>
        </div>
    );
}