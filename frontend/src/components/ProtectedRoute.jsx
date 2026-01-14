import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children, role, userRole }) {
  if (!userRole) return <Navigate to="/login" />;
  if (role && role !== userRole) return <Navigate to="/login" />;
  return children;
}