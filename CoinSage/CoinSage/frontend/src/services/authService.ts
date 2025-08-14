import api from './api';
import { User, RegisterData } from '../types/index';

export const authService = {
  async login(email: string, password: string): Promise<{ user: User; token?: string }> {
    try {
      const response = await api.post('/api/auth/login', {
        email,
        password,
      });
      return response.data;
    } catch (error: any) {
      if (error.response?.data?.error) {
        throw new Error(error.response.data.error);
      }
      throw new Error('Login failed. Please check your credentials.');
    }
  },

  async register(userData: RegisterData): Promise<{ user: User; token?: string }> {
    try {
      const response = await api.post('/api/auth/register', userData);
      return response.data;
    } catch (error: any) {
      if (error.response?.data?.error) {
        throw new Error(error.response.data.error);
      }
      throw new Error('Registration failed. Please try again.');
    }
  },

  async logout(): Promise<void> {
    try {
      await api.post('/api/auth/logout');
    } catch (error: any) {
      console.error('Logout error:', error);
      // Don't throw error for logout - just log it
    }
  },

  async getCurrentUser(): Promise<User> {
    try {
      const response = await api.get('/api/auth/me');
      return response.data.user;
    } catch (error: any) {
      throw new Error('Failed to get current user');
    }
  },

  async updateProfile(profileData: Partial<User>): Promise<User> {
    try {
      const response = await api.put('/api/users/profile', profileData);
      return response.data.user;
    } catch (error: any) {
      if (error.response?.data?.error) {
        throw new Error(error.response.data.error);
      }
      throw new Error('Failed to update profile');
    }
  },
}; 