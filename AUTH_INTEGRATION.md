# Authentication System Integration

## Overview

This frontend now includes a complete role-based authentication system integrated with the Python FastAPI backend.

## Features

### 🔐 Authentication
- **Login**: Secure JWT-based authentication
- **Register**: User registration with validation
- **Logout**: Token invalidation and cleanup
- **Session Management**: Automatic token refresh and validation

### 👥 Role-Based Access Control (RBAC)
Three hierarchical user roles:

1. **USER** (Level 1)
   - Access to marketing tools
   - Campaign management
   - AI chat assistant
   - Personal dashboard

2. **ADMIN** (Level 2)
   - All USER features
   - View all users
   - Manage user accounts
   - Activate/deactivate users
   - Delete regular users
   - Admin dashboard

3. **SUPERADMIN** (Level 3)
   - All ADMIN features
   - Promote/demote user roles
   - Create superadmins
   - System statistics
   - Complete user control
   - Superadmin dashboard

## File Structure

```
src/
├── app/
│   ├── auth/
│   │   ├── login/page.tsx              # Login page
│   │   ├── register/page.tsx           # Registration page
│   │   ├── user-dashboard/page.tsx     # User dashboard
│   │   ├── admin-dashboard/page.tsx    # Admin dashboard
│   │   └── superadmin-dashboard/page.tsx # Superadmin dashboard
│   └── layout.tsx                      # Root layout with AuthProvider
│
├── components/
│   └── ProtectedRoute.tsx              # Route protection component
│
├── contexts/
│   └── AuthContext.tsx                 # Authentication context & provider
│
├── services/
│   └── authService.ts                  # API service for auth endpoints
│
└── types/
    └── auth.ts                         # TypeScript types for auth
```

## Setup Instructions

### 1. Environment Configuration

Create a `.env.local` file in the project root:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

**Note**: `.env.local` is already created and configured.

### 2. Install Dependencies

All required dependencies are already in `package.json`. If you need to reinstall:

```bash
npm install
```

### 3. Start the Backend

Make sure your Python backend is running:

```bash
cd backend
python run.py
```

The backend should be running at `http://localhost:8000`

### 4. Start the Frontend

```bash
npm run dev
```

The frontend will be available at `http://localhost:3000`

## Usage

### Accessing Authentication Pages

- **Login**: Navigate to `/auth/login`
- **Register**: Navigate to `/auth/register`
- **User Dashboard**: `/auth/user-dashboard` (requires USER role)
- **Admin Dashboard**: `/auth/admin-dashboard` (requires ADMIN role)
- **Superadmin Dashboard**: `/auth/superadmin-dashboard` (requires SUPERADMIN role)

### Registration Flow

1. Go to `/auth/register`
2. Fill in:
   - Email (required)
   - Username (required)
   - Password (min 8 characters, required)
   - Full Name (optional)
3. Click "Create Account"
4. You'll be automatically logged in and redirected to your dashboard

### Login Flow

1. Go to `/auth/login`
2. Enter email and password
3. Click "Sign In"
4. You'll be redirected based on your role:
   - USER → `/auth/user-dashboard`
   - ADMIN → `/auth/admin-dashboard`
   - SUPERADMIN → `/auth/superadmin-dashboard`

## Protected Routes

The `ProtectedRoute` component automatically:
- Checks authentication status
- Verifies user role permissions
- Redirects unauthenticated users to `/auth/login`
- Redirects users with insufficient permissions to their appropriate dashboard
- Shows loading state during authentication check

### Example Usage

```tsx
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { UserRole } from '@/types/auth';

export default function AdminPage() {
  return (
    <ProtectedRoute requiredRole={UserRole.ADMIN}>
      {/* Your admin content here */}
    </ProtectedRoute>
  );
}
```

## Authentication Hook

Use the `useAuth` hook to access authentication state in any component:

```tsx
import { useAuth } from '@/contexts/AuthContext';

function MyComponent() {
  const { user, isAuthenticated, logout, hasRole } = useAuth();

  if (!isAuthenticated) {
    return <div>Please log in</div>;
  }

  return (
    <div>
      <p>Welcome, {user?.username}!</p>
      <button onClick={logout}>Logout</button>
      {hasRole(UserRole.ADMIN) && <p>Admin access granted</p>}
    </div>
  );
}
```

### Available Properties & Methods

- `user`: Current user object or null
- `token`: JWT access token or null
- `loading`: Boolean indicating auth state loading
- `isAuthenticated`: Boolean indicating if user is logged in
- `login(credentials)`: Login function
- `register(data)`: Registration function
- `logout()`: Logout function
- `hasRole(role)`: Check if user has specific role or higher

## Role Hierarchy

Higher roles inherit all permissions from lower roles:

```
SUPERADMIN (Level 3)
    ↓ (includes all of)
ADMIN (Level 2)
    ↓ (includes all of)
USER (Level 1)
```

Example:
```tsx
const { hasRole } = useAuth();

// If user is ADMIN:
hasRole(UserRole.USER)       // ✓ true
hasRole(UserRole.ADMIN)      // ✓ true
hasRole(UserRole.SUPERADMIN) // ✗ false

// If user is SUPERADMIN:
hasRole(UserRole.USER)       // ✓ true
hasRole(UserRole.ADMIN)      // ✓ true
hasRole(UserRole.SUPERADMIN) // ✓ true
```

## API Integration

### Auth Service Methods

The `authService` provides methods for all backend endpoints:

**Authentication:**
- `login(credentials)`
- `register(data)`
- `getCurrentUser(token)`
- `logout(token)`

**User Endpoints:**
- `getUserDashboard(token)`

**Admin Endpoints:**
- `getAdminDashboard(token)`
- `getAllUsers(token, skip, limit)`
- `updateUser(token, userId, data)`
- `deleteUser(token, userId)`

**Superadmin Endpoints:**
- `getSuperadminDashboard(token)`
- `getSystemStats(token)`
- `promoteToAdmin(token, userId)`
- `promoteToSuperadmin(token, userId)`
- `demoteToUser(token, userId)`
- `toggleUserActive(token, userId)`

## Security Features

### Client-Side
- ✅ JWT token stored in localStorage
- ✅ Automatic token validation on page load
- ✅ Protected routes with role checking
- ✅ Secure password input fields
- ✅ CSRF protection through token-based auth

### Best Practices Implemented
- Passwords never displayed in plain text
- Tokens automatically included in API requests
- Expired tokens handled gracefully
- User redirected to login on authentication failure
- Role-based UI rendering

## Testing the System

### 1. Create First Superadmin (Backend)

```bash
cd backend
python create_superadmin.py
```

### 2. Test Login
- Go to `http://localhost:3000/auth/login`
- Login with superadmin credentials
- Verify redirection to superadmin dashboard

### 3. Test Registration
- Go to `http://localhost:3000/auth/register`
- Create a new user account
- Verify automatic login and redirection

### 4. Test Role-Based Access
- Login as regular user
- Try accessing `/auth/admin-dashboard`
- Verify automatic redirection back to user dashboard

### 5. Test Admin Features
- Login as admin
- View users list
- Try updating/deleting users

### 6. Test Superadmin Features
- Login as superadmin
- Promote a user to admin
- View system statistics
- Test all role management features

## Troubleshooting

### "Failed to get user info"
- Check if backend is running at `http://localhost:8000`
- Verify DATABASE_URL in backend `.env`
- Check browser console for CORS errors

### "Incorrect email or password"
- Verify credentials are correct
- Check if user exists in database
- Ensure backend is connected to Supabase

### Protected route redirecting
- Check user's role in the database
- Verify token is valid (check localStorage)
- Clear localStorage and login again

### CORS Errors
- Backend already configured for all origins
- If issues persist, check browser console
- Verify API_URL in frontend `.env.local`

## Integration with Existing Features

The authentication system is **completely separate** from existing marketing tool features. You can:

1. Use the marketing tool without authentication (existing behavior)
2. Add authentication to existing pages by wrapping them with `ProtectedRoute`
3. Access user info in any component using `useAuth()`

### Example: Adding Auth to Existing Page

```tsx
'use client';

import { ProtectedRoute } from '@/components/ProtectedRoute';
import { useAuth } from '@/contexts/AuthContext';
import { UserRole } from '@/types/auth';

// Your existing component
function ExistingMarketingTool() {
  const { user } = useAuth();
  
  return (
    <div>
      <p>Welcome, {user?.username}</p>
      {/* Your existing marketing tool UI */}
    </div>
  );
}

// Wrap with protection
export default function Page() {
  return (
    <ProtectedRoute requiredRole={UserRole.USER}>
      <ExistingMarketingTool />
    </ProtectedRoute>
  );
}
```

## Dashboard Features

### User Dashboard
- Profile information
- Quick access to marketing tools
- Access to campaigns, chat, and content features

### Admin Dashboard
- User management table
- Activate/deactivate users
- Delete users (except superadmins)
- View admin statistics
- Access to all user features

### Superadmin Dashboard
- Complete system statistics
- Full user management
- Role promotion/demotion
- User activation/deactivation
- User deletion
- System monitoring

## Next Steps

1. ✅ Authentication system is fully functional
2. ✅ All role-based dashboards are created
3. ✅ Protected routes are implemented
4. 🔄 Optional: Add authentication to existing marketing pages
5. 🔄 Optional: Add user profile edit functionality
6. 🔄 Optional: Add password reset functionality

## API Endpoints Reference

### Base URL
```
http://localhost:8000
```

### Authentication
```
POST /api/auth/register   - Register new user
POST /api/auth/login      - Login
POST /api/auth/logout     - Logout
GET  /api/auth/me         - Get current user
```

### User Endpoints (USER+)
```
GET  /api/user/dashboard  - User dashboard
GET  /api/user/profile    - Get profile
PUT  /api/user/profile    - Update profile
```

### Admin Endpoints (ADMIN+)
```
GET    /api/admin/dashboard      - Admin dashboard
GET    /api/admin/users          - List users
GET    /api/admin/users/:id      - Get user
PUT    /api/admin/users/:id      - Update user
DELETE /api/admin/users/:id      - Delete user
```

### Superadmin Endpoints (SUPERADMIN only)
```
GET  /api/superadmin/dashboard                     - Superadmin dashboard
GET  /api/superadmin/stats                         - System stats
POST /api/superadmin/users/:id/promote-to-admin    - Promote to admin
POST /api/superadmin/users/:id/promote-to-superadmin - Promote to superadmin
POST /api/superadmin/users/:id/demote-to-user      - Demote to user
POST /api/superadmin/users/:id/toggle-active       - Toggle active status
```

## Support

For issues or questions:
1. Check the backend API is running
2. Verify environment variables
3. Check browser console for errors
4. Review backend logs
5. Test API endpoints directly using Swagger UI at `http://localhost:8000/docs`

---

**Note**: The authentication system is production-ready but consider:
- Using HTTPS in production
- Implementing refresh tokens
- Adding rate limiting
- Setting up proper CORS origins
- Using environment-specific API URLs
