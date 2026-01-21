import { useState, useEffect } from 'react';
import { ADMIN_CODE } from '../lib/constants';

const ADMIN_KEY = 'vortech_admin';

export function useAdmin() {
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(ADMIN_KEY);
    if (stored === 'true') {
      setIsAdmin(true);
    }
  }, []);

  const login = (code) => {
    if (code === ADMIN_CODE) {
      setIsAdmin(true);
      localStorage.setItem(ADMIN_KEY, 'true');
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAdmin(false);
    localStorage.removeItem(ADMIN_KEY);
  };

  return {
    isAdmin,
    login,
    logout,
  };
}
