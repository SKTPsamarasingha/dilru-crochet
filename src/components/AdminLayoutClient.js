"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import {
  LayoutDashboard,
  ShoppingBag,
  Receipt,
  Users,
  Settings,
  Store,
  LogOut,
  Menu,
  X,
  Heart,
  User,
} from "lucide-react";

export default function AdminLayoutClient({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, signOut } = useAuth();
  const [per, setPer] = useState([]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const fetchPermissions = async () => {
      try {
        const response = await fetch("/api/admin/permission");
        const allPer = await response.json();
        setPer(allPer);
      } catch (error) {
        console.error("Error fetching settings:", error);
      }
    };

    fetchPermissions();
  }, []);

  const menuItems = [
    { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { name: "Products", href: "/admin/products", icon: ShoppingBag },
    { name: "Orders", href: "/admin/orders", icon: Receipt },
    { name: "Users", href: "/admin/users", icon: Users },
    { name: "Settings", href: "/admin/settings", icon: Settings },
  ];

  const userPermissions = per[user?.role] || [];

  const visibleMenuItems = useMemo(() => {
    // Super admin bypasses permission checks entirely
    if (user?.role === "SUPER_ADMIN") {
      return menuItems;
    }

    // "manage_products" -> "products", "manage_orders" -> "orders", etc.
    const allowedKeys = userPermissions
      .filter((p) => p.startsWith("manage"))
      .map((p) => p.split("_")[1]);

    return menuItems.filter(
      (item) =>
        item.name === "Dashboard" || // always visible if you have any access
        allowedKeys.includes(item.name.toLowerCase()),
    );
  }, [user?.role, userPermissions]);


  const handleSignOut = async () => {
    await signOut();
    router.push("/");
    router.refresh();
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] flex">
      {/* 1. DESKTOP SIDEBAR */}
      <aside className="hidden lg:flex lg:flex-col lg:w-64 bg-white border-r border-[#F5EFEB] flex-shrink-0">
        <div className="h-20 flex items-center px-6 border-b border-[#F5EFEB]">
          <Link href="/admin" className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-[#E0A996]" fill="#E0A996" />
            <span className="font-bold text-lg text-[#2C2523] font-serif">
              Dilru Admin
            </span>
          </Link>
        </div>

        <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
          {visibleMenuItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${
                  isActive
                    ? "bg-[#E0A996] text-[#2C2523] shadow-xxs"
                    : "text-[#4A3728] hover:bg-[#F5EFEB] hover:text-[#2C2523]"
                }`}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-[#F5EFEB] space-y-1.5">
          <Link
            href="/"
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-[#4A3728] hover:bg-[#F5EFEB] hover:text-[#2C2523] transition-all"
          >
            <Store className="w-5 h-5" />
            Back to Store
          </Link>
          <button
            onClick={handleSignOut}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-red-600 hover:bg-red-50 transition-all text-left cursor-pointer"
          >
            <LogOut className="w-5 h-5" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* 2. MOBILE HEADER & NAVIGATION */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="h-20 border-b border-[#F5EFEB] bg-white/95 backdrop-blur-sm flex items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4 min-w-0">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-2 text-[#4A3728] hover:bg-[#F5EFEB] rounded-xl transition-colors cursor-pointer"
              aria-label="Open menu"
            >
              <Menu className="w-6 h-6" />
            </button>
            <div className="min-w-0">
              <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#96A288]">
                Shop control
              </p>
              <h1 className="text-lg font-bold text-[#2C2523] font-serif truncate">
                {pathname === "/admin"
                  ? "Overview"
                  : pathname.split("/").pop().replace(/-/g, " ")}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex flex-col items-end">
              <span className="text-sm font-semibold text-[#2C2523]">
                {user?.name}
              </span>
              <span className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#96A288]">
                {user?.role?.replace("_", " ") || "Studio Manager"}
              </span>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-full border border-[#E0A996]/20 bg-[#E0A996]/10 text-[#E0A996]">
              <User className="w-5 h-5" />
            </div>
          </div>
        </header>

        {/* MAIN BODY SCROLL */}
        <main className="flex-grow p-4 sm:p-6 lg:p-8 overflow-y-auto">
          {children}
        </main>
      </div>

      {/* MOBILE DRAWER DIALOG */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-[#2C2523]/40 backdrop-blur-xxs"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="relative w-64 max-w-xs bg-white h-full shadow-xl flex flex-col border-r border-[#F5EFEB]">
            <div className="h-20 flex items-center justify-between px-6 border-b border-[#F5EFEB]">
              <Link
                href="/admin"
                className="flex items-center gap-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                <Heart className="w-5 h-5 text-[#E0A996]" fill="#E0A996" />
                <span className="font-bold text-base text-[#2C2523] font-serif">
                  Dilru Admin
                </span>
              </Link>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-1.5 hover:bg-[#F5EFEB] rounded-full text-[#4A3728] transition-colors cursor-pointer"
                aria-label="Close menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
              {visibleMenuItems.map((item) => {
                const isActive = pathname === item.href;
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                      isActive
                        ? "bg-[#E0A996] text-[#2C2523]"
                        : "text-[#4A3728] hover:bg-[#F5EFEB] hover:text-[#2C2523]"
                    }`}
                  >
                    <Icon className="w-5 h-5 flex-shrink-0" />
                    {item.name}
                  </Link>
                );
              })}
            </nav>

            <div className="p-4 border-t border-[#F5EFEB] space-y-1.5">
              <Link
                href="/"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold text-[#4A3728] hover:bg-[#F5EFEB] transition-all"
              >
                <Store className="w-4.5 h-4.5" />
                Back to Store
              </Link>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleSignOut();
                }}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold text-red-600 hover:bg-red-50 transition-all text-left cursor-pointer"
              >
                <LogOut className="w-4.5 h-4.5" />
                Sign Out
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
