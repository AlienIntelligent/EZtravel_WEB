import { Navigate } from "react-router-dom";
import { useAppSelector } from "../../store/hooks";





export function GuestGuard({ children }) {
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);

  if (isAuthenticated && user) {
    const role = typeof user.role === "string" ? user.role.toUpperCase() : "";
    if (role === "ADMIN") {
      return <Navigate to="/admin" replace />;
    } else if (role === "PROVIDER") {
      return <Navigate to="/provider" replace />;
    } else {
      return <Navigate to="/explore" replace />;
    }
  }

  return <>{children}</>;
}