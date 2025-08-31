'use client';

import { getSession, getUserProfile } from '../../lib/api/clientApi';
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
      const response = await getSession();
      if (response) {
        const user = await getUserProfile();
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
