"use client";
import { useState, useEffect, useCallback } from "react";

const AUTH_KEY = "ExamArchiveAuth";
const USER_DB_KEY = "ExamArchiveUsers";

type User = {
  username: string;
  email: string;
  password: string;
};

export function useMockAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  // Helper: get users from localStorage
  function getUsers(): User[] {
    if (typeof window === "undefined") return [];
    const usersJson = localStorage.getItem(USER_DB_KEY);
    return usersJson ? JSON.parse(usersJson) : [];
  }

  // Helper: save users to localStorage
  function saveUsers(users: User[]) {
    localStorage.setItem(USER_DB_KEY, JSON.stringify(users));
  }

  // On mount, check auth status & load user
  useEffect(() => {
    try {
      const authEmail = localStorage.getItem(AUTH_KEY);
      if (authEmail) {
        const users = getUsers();
        const user = users.find(
          (u) => u.email.toLowerCase() === authEmail.toLowerCase()
        );
        if (user) {
          setCurrentUser(user);
          setIsAuthenticated(true);
        }
      }
    } catch {
      setIsAuthenticated(false);
    }
    setIsLoading(false);
  }, []);

  // Signup method
  const signup = useCallback(
    (data: User): boolean => {
      const users = getUsers();
      const exists = users.some(
        (u) => u.email.toLowerCase() === data.email.toLowerCase()
      );
      if (exists) return false; // already registered

      users.push(data);
      saveUsers(users);
      // Automatically login user on signup
      localStorage.setItem(AUTH_KEY, data.email);
      setCurrentUser(data);
      setIsAuthenticated(true);
      return true;
    },
    []
  );

  // Login method (email + password)
  const login = useCallback((email: string, password: string): boolean => {
    const users = getUsers();
    const user = users.find(
      (u) =>
        u.email.toLowerCase() === email.toLowerCase() && u.password === password
    );
    if (user) {
      localStorage.setItem(AUTH_KEY, user.email);
      setCurrentUser(user);
      setIsAuthenticated(true);
      return true;
    }
    return false;
  }, []);

  // Logout method
  const logout = useCallback(() => {
    localStorage.removeItem(AUTH_KEY);
    setCurrentUser(null);
    setIsAuthenticated(false);
  }, []);

  return {
    isAuthenticated,
    isLoading,
    currentUser,
    signup,
    login,
    logout,
  };
}
