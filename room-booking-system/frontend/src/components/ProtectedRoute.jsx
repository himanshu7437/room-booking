import { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";
import { Loading } from "./ui/Loading";

const ProtectedRoute = () => {
  const { admin, loading } = useContext(AuthContext);

  if (loading) {
    return <Loading />;
  }

  if (!admin) {
    return <Navigate to="/admin/login" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
