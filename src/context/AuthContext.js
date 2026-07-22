"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { clientSignIn, clientSignUp, clientSignOut } from "@/lib/auth-client";


const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [ordersLoading, setOrdersLoading] = useState(false);

  const fetchOrders = useCallback(async () => {
    setOrdersLoading(true);
    try {
      const res = await fetch("/api/orders");
      const data = await res.json();
      if (data.success) {
        setOrders(data.orders);
      } else {
        setOrders([]);
      }
    } catch {
      setOrders([]);
    } finally {
      setOrdersLoading(false);
    }
  }, []);

  const fetchSession = useCallback(async () => {
    setLoading(true);
    try {
      let res = await fetch("/api/auth/session");
      let data = await res.json();

      if (data.success && data.user) {
        setUser(data.user);
        return data.user;
      }

      res = await fetch("/api/auth/refresh", { method: "POST" });
      data = await res.json();

      if (data.success && data.user) {
        setUser(data.user);
        return data.user;
      }

      setUser(null);
      setOrders([]);
      return null;
    } catch {
      setUser(null);
      setOrders([]);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;

    const loadSession = async () => {
      const sessionUser = await fetchSession();
      if (!cancelled && sessionUser) {
        await fetchOrders();
      } else if (!cancelled) {
        setOrders([]);
      }
    };

    loadSession();

    return () => {
      cancelled = true;
    };
  }, [fetchSession, fetchOrders]);

  const signIn = async (email, password) => {
    const loggedInUser = await clientSignIn(email, password);
    setUser(loggedInUser);
    await fetchOrders();
    return loggedInUser;
  };

  const signUp = async (email, password, name) => {
    const newUser = await clientSignUp(email, password, name);
    setUser(newUser);
    await fetchOrders();
    return newUser;
  };

  const signOut = async () => {
    await clientSignOut();
    setUser(null);
    setOrders([]);
  };

  const value = {
    user,
    orders,
    loading,
    ordersLoading,
    signIn,
    signUp,
    signOut,
    login: signIn,
    logout: signOut,
    fetchSession,
    fetchOrders,
    isAuthenticated: !!user,
    isAdmin: user ? user.role !== "USER" : false,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
