import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import authService from '@/services/auth';

interface User {
  id: string;
  email: string;
  name: string;
  picture?: string;
  role: 'admin' | 'mentor' | 'mentee';
  createdAt: Date;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  signup: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
  userRole: string;
  isAdmin: boolean;
  isMentor: boolean;
  isMentee: boolean;
  dashboardUrl: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load user from localStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try {
        const userData = JSON.parse(savedUser);
        // Convert string dates back to Date objects
        userData.createdAt = new Date(userData.createdAt);
        setUser(userData);
      } catch (error) {
        console.error('Error parsing saved user:', error);
        localStorage.removeItem('user');
      }
    }
    setIsLoading(false);
  }, []);

  const determineUserRole = (email: string): 'admin' | 'mentor' | 'mentee' => {
    if (email === 'unsaidtalkstech2@gmail.com') return 'admin';
    if (email === 'mokshkulshrestha@gmail.com') return 'mentor';
    if (email === 'mokshkulshrestha19@gmail.com') return 'mentee';
    return 'mentee'; // Default role
  };

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const response = await authService.login({ email, password });
      
      if (response.success && response.user) {
        setUser(response.user);
        localStorage.setItem('user', JSON.stringify(response.user));
      } else {
        throw new Error(response.error || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const loginWithGoogle = async () => {
    setIsLoading(true);
    try {
      const response = await authService.loginWithGoogle();
      
      if (response.success && response.user) {
        setUser(response.user);
        localStorage.setItem('user', JSON.stringify(response.user));
      } else {
        throw new Error(response.error || 'Google login failed');
      }
    } catch (error) {
      console.error('Google login error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (email: string, password: string, name: string) => {
    setIsLoading(true);
    try {
      const response = await authService.signup({ name, email, password });
      
      if (response.success && response.user) {
        setUser(response.user);
        localStorage.setItem('user', JSON.stringify(response.user));
      } else {
        throw new Error(response.error || 'Signup failed');
      }
    } catch (error) {
      console.error('Signup error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    authService.logout();
  };

  const userRole = user?.role || 'guest';
  const isAdmin = userRole === 'admin';
  const isMentor = userRole === 'mentor';
  const isMentee = userRole === 'mentee';
  const isAuthenticated = !!user;

  const dashboardUrl = isAdmin ? '/admin-dashboard' : 
                      isMentor ? '/mentor-dashboard' : 
                      isMentee ? '/mentee-dashboard' : '/welcome';

  const value: AuthContextType = {
    user,
    isAuthenticated,
    isLoading,
    login,
    loginWithGoogle,
    signup,
    logout,
    userRole,
    isAdmin,
    isMentor,
    isMentee,
    dashboardUrl,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
