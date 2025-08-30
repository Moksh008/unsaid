# Google OAuth Setup Guide

This guide explains how to implement real Google OAuth authentication in your application.

## Current Implementation

The app currently uses a mock authentication system that simulates Google OAuth. This allows you to develop and test the UI without setting up real OAuth credentials.

## Setting Up Real Google OAuth

### 1. Create Google OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google+ API
4. Go to "Credentials" → "Create Credentials" → "OAuth 2.0 Client IDs"
5. Configure the OAuth consent screen
6. Set the application type to "Web application"
7. Add authorized redirect URIs:
   - `http://localhost:5173/auth/google/callback` (for development)
   - `https://yourdomain.com/auth/google/callback` (for production)
8. Copy the Client ID and Client Secret

### 2. Update Environment Variables

Create a `.env` file in your project root:

```env
VITE_GOOGLE_CLIENT_ID=your_actual_google_client_id
VITE_GOOGLE_CLIENT_SECRET=your_actual_google_client_secret
VITE_GOOGLE_REDIRECT_URI=http://localhost:5173/auth/google/callback
```

### 3. Install Google OAuth Library

```bash
npm install @react-oauth/google
```

### 4. Update the Auth Service

Replace the mock `loginWithGoogle` method in `src/services/auth.ts` with real Google OAuth:

```typescript
import { GoogleOAuthProvider, useGoogleLogin } from '@react-oauth/google';

async loginWithGoogle(): Promise<AuthResponse> {
  try {
    // Use Google OAuth flow
    const response = await this.googleLogin();
    
    if (response.success) {
      return {
        success: true,
        user: response.user,
      };
    }
    
    return {
      success: false,
      error: 'Google authentication failed',
    };
  } catch (error) {
    console.error('Google OAuth error:', error);
    return {
      success: false,
      error: 'Google authentication failed',
    };
  }
}
```

### 5. Update App.tsx

Wrap your app with Google OAuth provider:

```typescript
import { GoogleOAuthProvider } from '@react-oauth/google';

const App = () => (
  <GoogleOAuthProvider clientId={process.env.VITE_GOOGLE_CLIENT_ID!}>
    <AuthProvider>
      {/* Your app content */}
    </AuthProvider>
  </GoogleOAuthProvider>
);
```

### 6. Update Sign-in/Sign-up Components

Use the Google OAuth hook in your components:

```typescript
import { useGoogleLogin } from '@react-oauth/google';

const SignInPage = () => {
  const login = useGoogleLogin({
    onSuccess: (response) => {
      // Handle successful Google login
      console.log('Google login success:', response);
    },
    onError: () => {
      // Handle Google login error
      console.log('Google login failed');
    },
  });

  const handleGoogleLogin = () => {
    login();
  };

  // ... rest of component
};
```

## Backend Integration

For production, you'll need a backend service to:

1. **Verify Google tokens** - Validate the OAuth tokens from Google
2. **Create user accounts** - Store user information in your database
3. **Generate JWT tokens** - Create session tokens for your app
4. **Handle user roles** - Assign and manage user permissions

### Example Backend Endpoint

```typescript
// POST /api/auth/google
app.post('/api/auth/google', async (req, res) => {
  const { access_token } = req.body;
  
  try {
    // Verify token with Google
    const googleUser = await verifyGoogleToken(access_token);
    
    // Find or create user in database
    let user = await findUserByEmail(googleUser.email);
    if (!user) {
      user = await createUser({
        email: googleUser.email,
        name: googleUser.name,
        picture: googleUser.picture,
        role: 'mentee', // Default role
      });
    }
    
    // Generate JWT token
    const token = generateJWT(user);
    
    res.json({
      success: true,
      user,
      token,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: 'Authentication failed',
    });
  }
});
```

## Security Considerations

1. **Never expose client secrets** in frontend code
2. **Always verify tokens** on the backend
3. **Use HTTPS** in production
4. **Implement proper session management**
5. **Add rate limiting** to prevent abuse
6. **Validate user permissions** on every request

## Testing

1. Test with real Google accounts
2. Test error scenarios (network failures, invalid tokens)
3. Test role-based access control
4. Test session expiration and renewal

## Troubleshooting

- **Redirect URI mismatch**: Ensure the redirect URI in Google Console matches your app
- **CORS issues**: Configure your backend to allow requests from your frontend domain
- **Token validation**: Verify that your backend is properly validating Google tokens

## Next Steps

1. Implement the backend authentication service
2. Add proper error handling and user feedback
3. Implement session management and token refresh
4. Add user profile management
5. Implement role-based access control
6. Add audit logging for security events
