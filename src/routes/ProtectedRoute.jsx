import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../contexts/AuthContexts";

export const ProtectedRoute = () => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">loading ...</div>;
  }
  if (!user) {
    return <Navigate to={"/login"} replace />;
  }
  return <Outlet />;
};
