import { Navigate } from "react-router-dom";
import { useAppSelector } from "../../store/hooks";






export function RoleGuard({ children, allowedRoles }) {
 const { isAuthenticated, user } = useAppSelector((state) => state.auth);

 if (!isAuthenticated || !user) {
 return <Navigate to="/login" replace />;
 }

 const userRole = typeof user.role === "string" ? user.role.toUpperCase() : "";
 const normalizedAllowed = allowedRoles.map((r) => r.toUpperCase());

 // Check if role is allowed or if user is ADMIN (always allow admin to bypass)
 if (userRole !== "ADMIN" && !normalizedAllowed.includes(userRole)) {
 return <Navigate to="/unauthorized" replace />;
 }

 return <>{children}</>;
}