import { useAuth } from '@/contexts/AuthContext';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Welcome = () => {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      const email = user.email;
      let dashboardUrl = '/welcome'; // Default fallback
      
      if (email === 'admin@example.com') {
        dashboardUrl = '/admin-dashboard';
      } else if (email === 'mentor@example.com') {
        dashboardUrl = '/mentor-dashboard';
      } else if (email === 'mentee@example.com') {
        dashboardUrl = '/mentee-dashboard';
      } else {
        // Default to mentee dashboard for any other email
        dashboardUrl = '/mentee-dashboard';
      }
      
      // Redirect to appropriate dashboard
      navigate(dashboardUrl);
    }
  }, [user, navigate]);

  if (!isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // If user is authenticated, they should be redirected to their dashboard
  // This page will only show briefly before redirect
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Redirecting to your dashboard...</p>
      </div>
    </div>
  );
};

export default Welcome;
