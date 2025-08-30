// Base API configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';

// Helper function to get auth token from localStorage
// This will be updated when we integrate with a real backend
const getAuthToken = async () => {
  // For now, return a mock token
  // In production, you would get this from JWT or session storage
  const user = localStorage.getItem('user');
  if (user) {
    try {
      const userData = JSON.parse(user);
      return userData.id || 'mock-auth-token';
    } catch {
      return 'mock-auth-token';
    }
  }
  return 'mock-auth-token';
};

// Generic API request function
const apiRequest = async (
  endpoint: string,
  options: RequestInit = {},
  requireAuth: boolean = true
) => {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (requireAuth) {
    const token = await getAuthToken();
    headers.Authorization = `Bearer ${token}`;
  }

  const config: RequestInit = {
    ...options,
    headers,
  };

  try {
    const response = await fetch(url, config);
    
    if (!response.ok) {
      throw new Error(`API request failed: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('API request error:', error);
    throw error;
  }
};

// User management API endpoints
export const userAPI = {
  // Get all users (admin only)
  getAllUsers: async () => {
    return apiRequest('/users', { method: 'GET' }, true);
  },

  // Get user by ID
  getUserById: async (userId: string) => {
    return apiRequest(`/users/${userId}`, { method: 'GET' }, true);
  },

  // Update user
  updateUser: async (userId: string, userData: any) => {
    return apiRequest(`/users/${userId}`, {
      method: 'PUT',
      body: JSON.stringify(userData),
    }, true);
  },

  // Delete user (admin only)
  deleteUser: async (userId: string) => {
    return apiRequest(`/users/${userId}`, { method: 'DELETE' }, true);
  },

  // Get current user profile
  getCurrentUser: async () => {
    return apiRequest('/users/me', { method: 'GET' }, true);
  },

  // Update current user profile
  updateCurrentUser: async (userData: any) => {
    return apiRequest('/users/me', {
      method: 'PUT',
      body: JSON.stringify(userData),
    }, true);
  },
};

// Admin-specific API endpoints
export const adminAPI = {
  // Get system statistics
  getSystemStats: async () => {
    return apiRequest('/admin/stats', { method: 'GET' }, true);
  },

  // Get user analytics
  getUserAnalytics: async () => {
    return apiRequest('/admin/analytics/users', { method: 'GET' }, true);
  },

  // Bulk user operations
  bulkUpdateUsers: async (userIds: string[], updates: any) => {
    return apiRequest('/admin/users/bulk', {
      method: 'PUT',
      body: JSON.stringify({ userIds, updates }),
    }, true);
  },
};

// Public API endpoints (no auth required)
export const publicAPI = {
  // Health check
  healthCheck: async () => {
    return apiRequest('/health', { method: 'GET' }, false);
  },

  // Public announcements
  getAnnouncements: async () => {
    return apiRequest('/announcements', { method: 'GET' }, false);
  },
};

export default {
  userAPI,
  adminAPI,
  publicAPI,
};
