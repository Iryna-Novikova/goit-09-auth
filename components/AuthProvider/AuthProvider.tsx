'use client';

import {
  getSessionServer,
  getUserProfileServer,
} from '../../lib/api/serverApi';
import { useUserAuthStore } from '../../lib/store/authStore';
import { useEffect } from 'react';

interface AuthProviderProps {
  children: React.ReactNode;
}

const AuthProvider = ({ children }: AuthProviderProps) => {
  const setAuht = useUserAuthStore(state => state.setUser);
  const clearIsAuth = useUserAuthStore(state => state.clearIsAuthenticated);

  useEffect(() => {
    const fetchSession = async () => {
      const response = await getSessionServer();
      if (response) {
        const user = await getUserProfileServer();
        setAuht(user);
      } else {
        clearIsAuth();
      }
    };
    fetchSession();
  }, [setAuht, clearIsAuth]);

  return children;
};

export default AuthProvider;
