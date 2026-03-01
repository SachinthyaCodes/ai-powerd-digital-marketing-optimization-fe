/**
 * Authentication API service
 */

import { AuthResponse, LoginCredentials, RegisterData, User } from '@/types/auth';
import { API_BASE_URL, buildHeaders } from '@/config/api';

class AuthService {
  private getHeaders(token?: string): HeadersInit {
    return buildHeaders(token);
  }

  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Login failed');
    }

    return response.json();
  }

  async register(data: RegisterData): Promise<User> {
    const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Registration failed');
    }

    return response.json();
  }

  async getCurrentUser(token: string): Promise<User> {
    const response = await fetch(`${API_BASE_URL}/api/auth/me`, {
      method: 'GET',
      headers: this.getHeaders(token),
    });

    if (!response.ok) {
      throw new Error('Failed to get user info');
    }

    return response.json();
  }

  async logout(token: string): Promise<void> {
    await fetch(`${API_BASE_URL}/api/auth/logout`, {
      method: 'POST',
      headers: this.getHeaders(token),
    });
  }

  // User endpoints
  async getUserDashboard(token: string): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/api/user/dashboard`, {
      method: 'GET',
      headers: this.getHeaders(token),
    });

    if (!response.ok) {
      throw new Error('Failed to get user dashboard');
    }

    return response.json();
  }

  // Admin endpoints
  async getAdminDashboard(token: string): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/api/admin/dashboard`, {
      method: 'GET',
      headers: this.getHeaders(token),
    });

    if (!response.ok) {
      throw new Error('Failed to get admin dashboard');
    }

    return response.json();
  }

  // Admin – fetch role='user' accounts only
  async getAllUsers(token: string, skip = 0, limit = 100): Promise<User[]> {
    const response = await fetch(
      `${API_BASE_URL}/api/admin/users?skip=${skip}&limit=${limit}`,
      {
        method: 'GET',
        headers: this.getHeaders(token),
      }
    );

    if (!response.ok) {
      throw new Error('Failed to get users');
    }

    return response.json();
  }

  // Superadmin – fetch ALL accounts across all roles
  async getAllUsersAdmin(token: string, skip = 0, limit = 100): Promise<User[]> {
    const response = await fetch(
      `${API_BASE_URL}/api/superadmin/users?skip=${skip}&limit=${limit}`,
      {
        method: 'GET',
        headers: this.getHeaders(token),
      }
    );

    if (!response.ok) {
      throw new Error('Failed to get all users');
    }

    return response.json();
  }

  async updateUser(token: string, userId: string, data: Partial<User>): Promise<User> {
    const response = await fetch(`${API_BASE_URL}/api/admin/users/${userId}`, {
      method: 'PUT',
      headers: this.getHeaders(token),
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Failed to update user');
    }

    return response.json();
  }

  async deleteUser(token: string, userId: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/api/admin/users/${userId}`, {
      method: 'DELETE',
      headers: this.getHeaders(token),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to delete user');
    }
  }

  // Superadmin-level delete – can delete any account including admins/superadmins
  async deleteUserAdmin(token: string, userId: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/api/superadmin/users/${userId}`, {
      method: 'DELETE',
      headers: this.getHeaders(token),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to delete user');
    }
  }

  // Superadmin endpoints
  async getSuperadminDashboard(token: string): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/api/superadmin/dashboard`, {
      method: 'GET',
      headers: this.getHeaders(token),
    });

    if (!response.ok) {
      throw new Error('Failed to get superadmin dashboard');
    }

    return response.json();
  }

  async getSystemStats(token: string): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/api/superadmin/stats`, {
      method: 'GET',
      headers: this.getHeaders(token),
    });

    if (!response.ok) {
      throw new Error('Failed to get system stats');
    }

    return response.json();
  }

  async promoteToAdmin(token: string, userId: string): Promise<User> {
    const response = await fetch(
      `${API_BASE_URL}/api/superadmin/users/${userId}/promote-to-admin`,
      {
        method: 'POST',
        headers: this.getHeaders(token),
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to promote user');
    }

    return response.json();
  }

  async promoteToSuperadmin(token: string, userId: string): Promise<User> {
    const response = await fetch(
      `${API_BASE_URL}/api/superadmin/users/${userId}/promote-to-superadmin`,
      {
        method: 'POST',
        headers: this.getHeaders(token),
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to promote user');
    }

    return response.json();
  }

  async demoteToUser(token: string, userId: string): Promise<User> {
    const response = await fetch(
      `${API_BASE_URL}/api/superadmin/users/${userId}/demote-to-user`,
      {
        method: 'POST',
        headers: this.getHeaders(token),
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to demote user');
    }

    return response.json();
  }

  async toggleUserActive(token: string, userId: string): Promise<User> {
    const response = await fetch(
      `${API_BASE_URL}/api/superadmin/users/${userId}/toggle-active`,
      {
        method: 'POST',
        headers: this.getHeaders(token),
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to toggle user status');
    }

    return response.json();
  }
}

export const authService = new AuthService();
