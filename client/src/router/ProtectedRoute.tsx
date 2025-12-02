// src/router/ProtectedRoute.tsx
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAppSelector } from "../hooks/UseCustomeRedux";

const ProtectedRoute = () => {
  const isAuthenticated = useAppSelector(
    (state) => state.auth?.isAuthenticated
  );
  const location = useLocation();

  // Chưa đăng nhập -> đẩy về /login và lưu lại đường dẫn cũ
  if (!isAuthenticated) {
    return (
      <Navigate
        to="/login"
        replace
        state={{
          from: location,
        }}
      />
    );
  }

  // Đã đăng nhập -> cho vào bên trong
  return <Outlet />;
};

export default ProtectedRoute;
