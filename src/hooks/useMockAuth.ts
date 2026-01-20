"use client";
console.log("✅ Using simplified useMockAuth");

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";  // ⚠️ Added for redirect support

const AUTH_KEY   = "ExamArchiveAuth";
const USER_DB_KEY = "ExamArchiveUsers";
const ADMIN_EMAIL = "admin@mitsgwl.ac.in";

type User = {
  fullName: string;
  email: string;
  password: string;
  isAdmin?: boolean;
};

export function useMockAuth() {
  const router = useRouter();                       // ⚠️ Init router for redirects
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  /* ----------------------------- helper ------------------------------ */
  const getUsers = (): User[] => {
    if (typeof window === "undefined") return [];
    const usersJson = localStorage.getItem(USER_DB_KEY);
    return usersJson ? JSON.parse(usersJson) : [];
  };

  const saveUsers = (users: User[]) => {
    localStorage.setItem(USER_DB_KEY, JSON.stringify(users));
  };

  /* -------------------------- bootstrapping --------------------------- */
  useEffect(() => {
    try {
      const authEmail = localStorage.getItem(AUTH_KEY);
      if (authEmail) {
        const users = getUsers();
        const user = users.find(
          (u) => u.email.toLowerCase() === authEmail.toLowerCase()
        );
        if (user) {
          const potentialAdminUser = {
            ...user,
            isAdmin: user.email.toLowerCase() === ADMIN_EMAIL.toLowerCase(),
          };
          setCurrentUser(potentialAdminUser);
          setIsAuthenticated(true);
        }
      }
    } catch {
      setIsAuthenticated(false);
    }
    setIsLoading(false);
  }, []);

  /* ----------------------------- signup logic------------------------------ */
  const signup = useCallback(
    (data: { fullName: string; email: string; password: string }): boolean => {
      const users = getUsers();
      const exists = users.some(
        (u) => u.email.toLowerCase() === data.email.toLowerCase()
      );
      if (exists) return false;

      const newUser: User = {
        fullName: data.fullName,
        email:    data.email,
        password: data.password,
        isAdmin:  data.email.toLowerCase() === ADMIN_EMAIL.toLowerCase(),
      };
      users.push(newUser);
      saveUsers(users);

      localStorage.setItem(AUTH_KEY, data.email);
      setCurrentUser(newUser);
      setIsAuthenticated(true);
      return true;
    },
    []
  );

  /* ------------------------------ login ------------------------------ */
  const login = useCallback(
    (email: string, password: string): boolean => {
      const users = getUsers();
      const user  = users.find(
        (u) =>
          u.email.toLowerCase() === email.toLowerCase() && u.password === password
      );
      if (user) {
        const loggedInUser: User = {
          ...user,
          isAdmin: user.email.toLowerCase() === ADMIN_EMAIL.toLowerCase(),
        };
        localStorage.setItem(AUTH_KEY, loggedInUser.email);
        setCurrentUser(loggedInUser);
        setIsAuthenticated(true);
        return true;
      }
      return false;
    },
    []
  );

  /* ----------------------------- logout ------------------------------ */
  const logout = useCallback(() => {
    localStorage.removeItem(AUTH_KEY);
    setCurrentUser(null);
    setIsAuthenticated(false);
    router.push("/login");          // ⚠️ Redirect after logout
  }, [router]);

  /* ----------------------------- exports ----------------------------- */
  return {
    isAuthenticated,
    isLoading,
    currentUser,
    signup,
    login,
    logout,
  };
}
