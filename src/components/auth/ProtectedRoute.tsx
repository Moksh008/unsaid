import { useAuth } from '@/contexts/AuthContext';
import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRole?: 'admin' | 'mentor' | 'mentee';
  dashboardType?: 'admin' | 'mentor' | 'mentee';
}

const ProtectedRoute = ({ children, requiredRole, dashboardType }: ProtectedRouteProps) => {
  const { isAuthenticated, isLoading, userRole, isAdmin, isMentor, isMentee, dashboardUrl } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/signin" replace />;
  }

  // Check if specific role is required
  if (requiredRole) {
    if (requiredRole === 'admin' && !isAdmin) {
      return <Navigate to={dashboardUrl} replace />;
    }
    if (requiredRole === 'mentor' && !isMentor) {
      return <Navigate to={dashboardUrl} replace />;
    }
    if (requiredRole === 'mentee' && !isMentee) {
      return <Navigate to={dashboardUrl} replace />;
    }
  }

  // Check if user is accessing the correct dashboard type
  if (dashboardType) {
    if (dashboardType === 'admin' && !isAdmin) {
      return <Navigate to={dashboardUrl} replace />;
    }
    if (dashboardType === 'mentor' && !isMentor) {
      return <Navigate to={dashboardUrl} replace />;
    }
    if (dashboardType === 'mentee' && !isMentee) {
      return <Navigate to={dashboardUrl} replace />;
    }
  }

  return <>{children}</>;
};

export default ProtectedRoute;
