import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AuthState, AuthAction, LoginCredentials, RegisterCredentials, User } from '@/types/auth.types';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

interface AuthStore extends AuthState {
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (credentials: RegisterCredentials) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  loginWithGithub: () => Promise<void>;
  logout: () => void;
  clearError: () => void;
}

const initialState: AuthState = {
  user: null,
  token: null,
  loading: false,
  error: null,
};

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      ...initialState,

      login: async (credentials) => {
        try {
          set({ loading: true, error: null });
          const { data } = await axios.post(`${API_URL}/auth/login`, credentials);
          set({ user: data.user, token: data.token, loading: false });
          // Set the JWT token in axios defaults
          axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
        } catch (error) {
          set({
            loading: false,
            error: error instanceof Error ? error.message : 'Failed to login',
          });
        }
      },

      register: async (credentials) => {
        try {
          set({ loading: true, error: null });
          const { data } = await axios.post(`${API_URL}/auth/register`, credentials);
          set({ user: data.user, token: data.token, loading: false });
          axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
        } catch (error) {
          set({
            loading: false,
            error: error instanceof Error ? error.message : 'Failed to register',
          });
        }
      },

      loginWithGoogle: async () => {
        try {
          set({ loading: true, error: null });
          window.location.href = `${API_URL}/auth/google`;
        } catch (error) {
          set({
            loading: false,
            error: error instanceof Error ? error.message : 'Failed to login with Google',
          });
        }
      },

      loginWithGithub: async () => {
        try {
          set({ loading: true, error: null });
          window.location.href = `${API_URL}/auth/github`;
        } catch (error) {
          set({
            loading: false,
            error: error instanceof Error ? error.message : 'Failed to login with Github',
          });
        }
      },

      logout: () => {
        set(initialState);
        delete axios.defaults.headers.common['Authorization'];
      },

      clearError: () => {
        set({ error: null });
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ user: state.user, token: state.token }),
    }
  )
); 