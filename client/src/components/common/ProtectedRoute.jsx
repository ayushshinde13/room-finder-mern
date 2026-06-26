import { Navigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

const ProtectedRoute = ({ children, role }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-400">
        Loading...
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  // If a specific role is required, check if user has that role
  if (role && user.role !== role) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500">
        Access denied. {role}s only.
      </div>
    );
  }

  return children;
};

export default ProtectedRoute;