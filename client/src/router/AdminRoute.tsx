import { Navigate, Outlet } from "react-router-dom";
import { useAppSelector } from "../hooks/UseCustomeRedux";

/**
 * Chỉ cho phép user có role = "admin" truy cập.
 * - Nếu chưa đăng nhập -> /login
 * - Nếu đã đăng nhập nhưng không phải admin -> /
 */
const AdminRoute = () => {
  const { currentUser, isAuthenticated } = useAppSelector(
    (state) => state.auth
  );

  if (!isAuthenticated || !currentUser) {
    return <Navigate to="/login" replace />;
  }

  if (currentUser.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default AdminRoute;
