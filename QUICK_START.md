# 🚀 Quick Start Guide

## 1. Install Dependencies
```bash
npm install @clerk/clerk-react @clerk/themes
```

## 2. Set Up Clerk
1. Go to [clerk.com](https://clerk.com) and sign up
2. Create a new application
3. Copy your **publishable key** (starts with `pk_test_`)

## 3. Create Environment File
Create a `.env` file in the root directory:
```env
VITE_CLERK_PUBLISHABLE_KEY=pk_test_your_key_here
```

## 4. Run the App
```bash
npm run dev
```

## 5. Test Authentication
- Visit `/signup` to create an account
- Visit `/signin` to sign in
- After authentication, you'll be redirected to `/welcome`

## 🎯 What's Working Now
- ✅ Landing page with auth buttons
- ✅ Sign in/Sign up pages
- ✅ Protected welcome page
- ✅ User profile display
- ✅ Admin panel (for admin users)
- ✅ Role-based access control

## 🔧 Admin Access
To make a user an admin:
1. Sign up with email `admin@example.com`, OR
2. Set user role to "admin" in Clerk dashboard metadata

## 📁 Key Files
- `src/App.tsx` - Main app with routes
- `src/components/auth/` - Authentication components
- `src/pages/Welcome.tsx` - User dashboard
- `src/services/api.ts` - API service layer
- `src/hooks/useAuth.ts` - Authentication hook

## 🚨 Troubleshooting
If you see import errors:
1. Make sure you've installed Clerk dependencies
2. Check your `.env` file has the correct key
3. Restart your dev server after adding environment variables
