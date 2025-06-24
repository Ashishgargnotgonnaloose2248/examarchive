"use client";

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";

const AUTH_KEY = "ExamArchiveAuth";
const USER_DB_KEY = "ExamArchiveUsers";
const ADMIN_EMAIL = "admin@mitsgwl.ac.in";

type StoredUser = {
  fullName: string;
  email: string;
  password: string;
};

export type AuthUser = {
  uid: string;
  fullName: string;
  email: string;
  isAdmin: boolean;
};

type AuthContextType = {
  currentUser: AuthUser | null;
  isLoading: boolean;
  signup: (data: { fullName: string; email: string; password: string }) => Promise<AuthUser>;
  login: (email: string, password: string) => Promise<AuthUser>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | null>(null);

/* ─────────────────────── Storage Utilities ─────────────────────── */
const loadUsers = (): StoredUser[] =>
  JSON.parse(localStorage.getItem(USER_DB_KEY) ?? "[]");

const saveUsers = (users: StoredUser[]) =>
  localStorage.setItem(USER_DB_KEY, JSON.stringify(users));

const toAuthUser = (u: StoredUser): AuthUser => ({
  uid: u.email,
  fullName: u.fullName,
  email: u.email,
  isAdmin: u.email.toLowerCase() === ADMIN_EMAIL.toLowerCase(),
});

/* ─────────────────────── Provider Component ─────────────────────── */
export function MockAuthProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const email = localStorage.getItem(AUTH_KEY);
    if (email) {
      const user = loadUsers().find(u => u.email.toLowerCase() === email.toLowerCase());
      if (user) setCurrentUser(toAuthUser(user));
    }
    setIsLoading(false);
  }, []);

  const signup = useCallback(async (data: { fullName: string; email: string; password: string }) => {
    const users = loadUsers();
    const exists = users.some(u => u.email.toLowerCase() === data.email.toLowerCase());
    if (exists) throw new Error("Account already exists. Please log in.");

    const newUser: StoredUser = {
      fullName: data.fullName.trim(),
      email: data.email.trim(),
      password: data.password,
    };

    users.push(newUser);
    saveUsers(users);

    return toAuthUser(newUser);
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const user = loadUsers().find(u => u.email.toLowerCase() === email.toLowerCase());
    if (!user) throw new Error("No user found. Please sign up first.");
    if (user.password !== password) throw new Error("Incorrect password.");

    const authUser = toAuthUser(user);
    localStorage.setItem(AUTH_KEY, authUser.email);
    setCurrentUser(authUser);
    return authUser;
  }, []);

  const logout = useCallback(async () => {
    localStorage.removeItem(AUTH_KEY);
    setCurrentUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ currentUser, isLoading, signup, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

/* ─────────────────────── Custom Hook ─────────────────────── */
export function useMockAuth(): AuthContextType {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useMockAuth must be used within MockAuthProvider");
  return ctx;
}
