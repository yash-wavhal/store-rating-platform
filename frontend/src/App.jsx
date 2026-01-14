import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AdminDashboard from "./pages/admin/AdminDashboard";
import UserDashboard from "./pages/user/UserDashboard";
import OwnerDashboard from "./pages/owner/OwnerDashboard";
import AdminLayout from "./pages/admin/AdminLayout";
import Users from "./pages/admin/users";
import Stores from "./pages/admin/stores";
import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";
import api from "./services/api";

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = async () => {
    try {
      const res = await api.get("/auth/me");
      setUser(res.data);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/login"
          element={!user ? <Login refreshUser={fetchUser} /> : <Navigate to="/" />}
        />
        <Route
          path="/signup"
          element={!user ? <Signup /> : <Navigate to="/" />}
        />
        <Route
          path="/"
          element={
            user ? (
              <Navigate
                to={
                  user.role === "ADMIN"
                    ? "/admin/dashboard"
                    : user.role === "STORE_OWNER"
                      ? "/owner"
                      : "/user"
                }
              />
            ) : (
              <Navigate to="/login" />
            )
          }
        />

        <Route
          path="/admin"
          element={
            user?.role === "ADMIN" ? <AdminLayout /> : <Navigate to="/" />
          }
        >
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="users" element={<Users />} />
          <Route path="stores" element={<Stores />} />
        </Route>

        <Route
          path="/user/*"
          element={
            user?.role === "USER" ? <UserDashboard /> : <Navigate to="/" />
          }
        />

        <Route
          path="/owner/*"
          element={
            user?.role === "STORE_OWNER" ? <OwnerDashboard /> : <Navigate to="/" />
          }
        />

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;