# Authentication System Setup Guide

## Prerequisites

1. **Clerk Account**: Sign up at [clerk.com](https://clerk.com)
2. **Node.js**: Version 16 or higher
3. **npm or yarn**: Package manager

## Installation

1. Install Clerk dependencies:
```bash
npm install @clerk/clerk-react @clerk/themes
```

2. Create a `.env` file in the root directory with your Clerk credentials:
```env
# Clerk Authentication
VITE_CLERK_PUBLISHABLE_KEY=pk_test_your_publishable_key_here

# API Configuration
VITE_API_BASE_URL=http://localhost:3001/api

# Optional: Clerk configuration
VITE_CLERK_SIGN_IN_URL=/signin
VITE_CLERK_SIGN_UP_URL=/signup
VITE_CLERK_AFTER_SIGN_IN_URL=/welcome
VITE_CLERK_AFTER_SIGN_UP_URL=/welcome
```

## Clerk Dashboard Setup

1. Go to [Clerk Dashboard](https://dashboard.clerk.com/)
2. Create a new application
3. Copy your publishable key (you only need the publishable key for frontend)
4. In your Clerk dashboard, go to **User & Authentication** → **Email, Phone, Username**
5. Enable email authentication
6. Go to **User & Authentication** → **Social Connections** (optional)
7. Configure your sign-in and sign-up URLs

## Admin User Setup

To create an admin user:

1. Sign up with the email `admin@example.com` (or change this in the code)
2. Or set the user's public metadata role to "admin" in Clerk dashboard:
   - Go to Users in Clerk dashboard
   - Select the user
   - Go to Public metadata
   - Add: `{"role": "admin"}`

## Features

### Public Routes
- `/` - Landing page with sign-in/sign-up buttons
- `/signin` - Sign in page
- `/signup` - Sign up page

### Protected Routes
- `/welcome` - User dashboard (requires authentication)
- Admin section visible only to admin users

### Authentication Features
- Email/password authentication
- Protected routes with role-based access
- User profile management
- Admin panel for user management

## API Integration

The system includes a service layer (`src/services/api.ts`) for:
- User management
- Admin operations
- Protected API endpoints

## Customization

### Changing Admin Logic
Edit `src/hooks/useAuth.ts` to modify how admin status is determined:

```typescript
const isAdmin = useMemo(() => {
  if (!user) return false;
  
  // Customize this logic
  const hasAdminRole = user.publicMetadata?.role === 'admin';
  const isAdminEmail = user.emailAddresses?.[0]?.emailAddress === 'your-admin-email@example.com';
  
  return hasAdminRole || isAdminEmail;
}, [user]);
```

### Styling
All components use Tailwind CSS and can be customized in:
- `src/components/auth/SignIn.tsx`
- `src/components/auth/SignUp.tsx`
- `src/pages/Welcome.tsx`

## Running the Application

1. Start the development server:
```bash
npm run dev
```

2. Open your browser to the URL shown in the terminal
3. Test the authentication flow:
   - Sign up with a new account
   - Sign in with existing account
   - Access the protected welcome page
   - Test admin functionality (if applicable)

## Troubleshooting

### Common Issues

1. **Clerk not loading**: Check your environment variables
2. **Authentication errors**: Verify Clerk dashboard configuration
3. **Admin access denied**: Check user role in Clerk dashboard

### Support

- [Clerk Documentation](https://clerk.com/docs)
- [React Router Documentation](https://reactrouter.com/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
