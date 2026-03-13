import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { ReactNode } from 'react';

type GuestRouteProps = {
  children: ReactNode;
};

export default function GuestRoute({ children }: GuestRouteProps) {
  const { isAuthenticated, isInitializing } = useAuth();

  if (isInitializing) {
    return <div>Loading...</div>;
  }

  if (isAuthenticated) {
    return <Navigate to="/timeline" replace />;
  }

  return children;
}
