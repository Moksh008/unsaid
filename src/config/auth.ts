// Authentication configuration
// This file can be extended with real OAuth credentials later

export const authConfig = {
  // Google OAuth Configuration (for future implementation)
  google: {
    clientId: process.env.VITE_GOOGLE_CLIENT_ID || 'your-google-client-id',
    clientSecret: process.env.VITE_GOOGLE_CLIENT_SECRET || 'your-google-client-secret',
    redirectUri: process.env.VITE_GOOGLE_REDIRECT_URI || 'http://localhost:5173/auth/google/callback',
  },
  
  // JWT Configuration (for future implementation)
  jwt: {
    secret: process.env.VITE_JWT_SECRET || 'your-jwt-secret',
    expiresIn: '24h',
  },
  
  // API Configuration
  api: {
    baseUrl: process.env.VITE_API_BASE_URL || 'http://localhost:3001/api',
    authEndpoint: '/auth',
  },
  
  // Role-based access control
  roles: {
    admin: ['unsaidtalkstech2@gmail.com'],
    mentor: ['mokshkulshrestha@gmail.com'],
    mentee: ['mokshkulshrestha19@gmail.com'],
  },
  
  // Default settings
  defaults: {
    defaultRole: 'mentee',
    sessionTimeout: 24 * 60 * 60 * 1000, // 24 hours in milliseconds
  },
};

export default authConfig;
