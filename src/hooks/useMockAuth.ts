"use client";
import { useState, useEffect, useCallback } from 'react';

const AUTH_KEY = 'academiaArchiveAuth';

export function useMockAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true); 

  useEffect(() => {
    try {
      const authStatus = localStorage.getItem(AUTH_KEY);
      setIsAuthenticated(authStatus === 'true');
    } catch (error) {
      console.warn('localStorage not available for auth check.');
      setIsAuthenticated(false);
    }
    setIsLoading(false);
  }, []);

  const login = useCallback((email: string): boolean => {
    if (email.toLowerCase().endsWith('@mitsgwl.ac.in')) {
      try {
        localStorage.setItem(AUTH_KEY, 'true');
        setIsAuthenticated(true);
        return true;
      } catch (error) {
        console.warn('localStorage not available for auth set.');
        return false;
      }
    }
    return false;
  }, []);

  const logout = useCallback(() => {
    try {
      localStorage.removeItem(AUTH_KEY);
      setIsAuthenticated(false);
    } catch (error) {
      console.warn('localStorage not available for auth remove.');
    }
  }, []);

  return { isAuthenticated, isLoading, login, logout };
}
