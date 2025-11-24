import { Navigate, Outlet } from "react-router-dom";

function ProtectedRoute() {
  const user = JSON.parse(localStorage.getItem("ActiveUser"));

  if (!user) {
    return <Navigate to="/" />;
  }
  return <Outlet />;
}

export default ProtectedRoute;
