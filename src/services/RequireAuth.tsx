

import { Navigate, useLocation } from "react-router-dom";
import { ReactNode } from "react";


const useAuth = () => {
  const user = localStorage.getItem("user"); 
  return { user };
};

interface RequireAuthProps {
  children: ReactNode;
}

const RequireAuth = ({ children }: RequireAuthProps) => {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) {
    // Redirect to login if not authenticated
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default RequireAuth;
