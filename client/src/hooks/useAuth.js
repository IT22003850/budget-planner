import { useContext } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../lib/api';
import { AuthContext } from '../context/AuthContext';
import toast from 'react-hot-toast';

export const useAuth = () => {
  const { user, setUser, logout: contextLogout } = useContext(AuthContext);
  const queryClient = useQueryClient();

  const login = useMutation({
    mutationFn: (credentials) => {
      console.log('Login mutation called with:', credentials);
      return api.post('/auth/login', credentials);
    },
    onSuccess: (response) => {
      const { token, user } = response.data;
      console.log('Login mutation success, token:', token, 'user:', user);
      localStorage.setItem('token', token);
      setUser(user);
      queryClient.invalidateQueries(['budgets']);
      queryClient.invalidateQueries(['report']);
    },
    onError: (err) => {
      console.error('Login mutation error:', err);
      toast.error(err.response?.data.message || 'Login failed');
    },
  });

  const logout = useMutation({
    mutationFn: () => {
      console.log('Logout mutation called');
      contextLogout();
      return Promise.resolve();
    },
    onSuccess: () => {
      console.log('Logout mutation success');
      queryClient.clear();
      toast.success('Logged out successfully');
    },
    onError: () => {
      console.error('Logout mutation error');
      toast.error('Logout failed');
    },
  });

  return { user, login, logout, setUser };
};