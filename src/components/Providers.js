"use client";

import { AuthProvider } from "@/context/AuthContext";
import NotificationProvider from "@/components/NotificationProvider";
import PageTransition from "@/components/PageTransition";

export default function Providers({ children }) {
  return (
    <AuthProvider>
      <NotificationProvider>
        <PageTransition>{children}</PageTransition>
      </NotificationProvider>
    </AuthProvider>
  );
}
