import React, { useEffect } from 'react';
import { useUser } from '../../features/auth/hooks';
import { useAuthStore } from '../../store/authStore';
import FullPageLoading from '../feedback/FullPageLoading';

const AuthBootstrap = ({ children }) => {
  const { data, isLoading, isSuccess } = useUser();
  const setUser = useAuthStore((state) => state.setUser);
  const isHydrated = useAuthStore((state) => state.isHydrated);
  const [isReady, setIsReady] = React.useState(false);

  useEffect(() => {
    if (isSuccess && data?.data?.user) {
      setUser(data.data.user);
      setIsReady(true);
    } else if (!isLoading) {
      setIsReady(true);
    }
  }, [isSuccess, data, setUser, isLoading]);

  // Prevent app from rendering until we know if we have a token
  if (!isHydrated || isLoading || !isReady) {
    return <FullPageLoading message="Synchronizing session..." />;
  }

  return children;
};

export default AuthBootstrap;
