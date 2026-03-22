import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import * as authApi from './api';
import { useAuthStore } from '../../store/authStore';
import { QUERY_KEYS } from '../../lib/react-query';

export const useLogin = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { setAuth } = useAuthStore();
  
  return useMutation({
    mutationFn: authApi.loginUser,
    onSuccess: (data) => {
      const { user, token } = data.data;
      setAuth(user, token);
      queryClient.setQueryData(QUERY_KEYS.auth.me(), data);
      toast.success(`Welcome back, ${user.name}!`);
      navigate('/dashboard');
    },
    // Error handled globally in react-query.js
  });
};

export const useRegister = () => {
  const navigate = useNavigate();
  
  return useMutation({
    mutationFn: authApi.registerUser,
    onSuccess: () => {
      toast.success('Registration successful! Please login.');
      navigate('/login');
    },
  });
};

export const useLogout = () => {
  const queryClient = useQueryClient();
  const logout = useAuthStore((state) => state.logout);
  const navigate = useNavigate();

  return useMutation({
    mutationFn: authApi.logoutUser,
    onSuccess: () => {
      logout();
      queryClient.clear();
      toast.success('Logged out successfully');
      navigate('/login');
    },
  });
};

export const useUser = () => {
  const { token, setUser } = useAuthStore();
  
  return useQuery({
    queryKey: QUERY_KEYS.auth.me(),
    queryFn: authApi.getCurrentUser,
    enabled: !!token,
    retry: false,  });
};

// Simple helper hook
export const useAuth = () => {
  const { user, isAuthenticated, isLoading } = useAuthStore();
  return { user, isAuthenticated, isLoading };
};
