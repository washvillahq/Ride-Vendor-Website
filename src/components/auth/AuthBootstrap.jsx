import React, { useEffect } from 'react';
import { useUser } from '../../features/auth/hooks';
import { useAuthStore } from '../../store/authStore';
import FullPageLoading from '../feedback/FullPageLoading';

const AuthBootstrap = ({ children }) => {
  const { data, isLoading, isSuccess } = useUser();
  const setUser = useAuthStore((state) => state.setUser);
  const isHydrated = useAuthStore((state) => state.isHydrated);

  useEffect(() => {
    if (isSuccess && data?.data?.user) {
      setUser(data.data.user);
    }
  }, [isSuccess, data, setUser]);

  // Prevent app from rendering until we know if we have a token
  if (!isHydrated || isLoading) {
    return <FullPageLoading message="Synchronizing session..." />;
  }

  return children;
};

export default AuthBootstrap;
