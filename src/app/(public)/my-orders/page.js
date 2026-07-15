"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import {
  Heart,
  ArrowLeft,
  Loader2,
  Clock,
  CheckCircle,
  Truck,
  XCircle,
  Receipt,
} from "lucide-react";

function getStatusStyle(status) {
  switch (status) {
    case "COMPLETED":
      return "bg-green-50 text-green-700 border-green-100";
    case "SHIPPED":
      return "bg-blue-50 text-blue-700 border-blue-100";
    case "PROCESSING":
      return "bg-indigo-50 text-indigo-700 border-indigo-100";
    case "PENDING":
      return "bg-amber-50 text-amber-700 border-amber-100";
    case "CANCELLED":
      return "bg-red-50 text-red-700 border-red-100";
    default:
      return "bg-gray-50 text-gray-700 border-gray-100";
  }
}

function getStatusIcon(status) {
  switch (status) {
    case "COMPLETED":
      return <CheckCircle className="w-3.5 h-3.5" />;
    case "SHIPPED":
      return <Truck className="w-3.5 h-3.5" />;
    case "CANCELLED":
      return <XCircle className="w-3.5 h-3.5" />;
    default:
      return <Clock className="w-3.5 h-3.5" />;
  }
}

export default function MyOrdersPage() {
  const router = useRouter();
  const { user, orders, loading, ordersLoading, isAuthenticated, fetchOrders } =
    useAuth();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/login?callbackUrl=/my-orders");
    }
  }, [loading, isAuthenticated, router]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchOrders();
    }
  }, [isAuthenticated, fetchOrders]);

  if (loading || !isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#FDFBF7]">
        <Loader2 className="w-8 h-8 animate-spin text-[#E0A996] mb-3" />
        <p className="text-xs text-[#4A3728]">Loading your orders...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFBF7]">
      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-10 space-y-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#2C2523] font-serif">
            My Orders
          </h1>
          <p className="text-xs text-[#A0958F] mt-1">
            Track your handcrafted orders, {user.name}.
          </p>
        </div>

        {ordersLoading ? (
          <div className="flex flex-col items-center justify-center py-20 bg-white border border-[#FBEFEA] rounded-2xl">
            <Loader2 className="w-8 h-8 animate-spin text-[#E0A996] mb-3" />
            <p className="text-xs text-[#4A3728]">
              Fetching your order history...
            </p>
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-16 bg-white border border-[#FBEFEA] rounded-2xl">
            <Receipt className="w-12 h-12 mx-auto text-[#A0958F] mb-4" />
            <h3 className="text-lg font-semibold text-[#2C2523] font-serif">
              No orders yet
            </h3>
            <p className="text-sm text-[#4A3728] mt-1 mb-6">
              When you place an order, it will appear here with live status
              updates.
            </p>
            <Link
              href="/shop"
              className="inline-flex py-2.5 px-6 bg-[#E0A996] hover:bg-[#CF9581] text-[#2C2523] font-semibold rounded-xl text-xs transition-colors"
            >
              Browse Collection
            </Link>
          </div>
        ) : (
          <div className="bg-white border border-[#FBEFEA] rounded-2xl shadow-xxs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#FDFBF7] text-[#A0958F] text-xxs font-bold uppercase tracking-wider border-b border-[#F5EFEB]">
                    <th className="px-6 py-4">Order ID</th>
                    <th className="px-6 py-4">Date</th>
                    <th className="px-6 py-4">Items</th>
                    <th className="px-6 py-4">Total</th>
                    <th className="px-6 py-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F5EFEB] text-xs text-[#4A3728]">
                  {orders.map((order) => (
                    <tr
                      key={order.id}
                      className="hover:bg-[#FDFBF7]/50 transition-colors"
                    >
                      <td className="px-6 py-4 font-mono font-semibold text-[#2C2523] truncate max-w-[140px]">
                        {order.id}
                      </td>
                      <td className="px-6 py-4 text-xxs text-[#A0958F] whitespace-nowrap">
                        {order.createdAt
                          ? new Date(order.createdAt).toLocaleDateString(
                              "en-US",
                              {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                              },
                            )
                          : "N/A"}
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-1 max-w-[240px]">
                          {order.items?.map((item, idx) => (
                            <div key={idx} className="text-xxs">
                              <span className="font-semibold text-[#2C2523]">
                                {item.name}
                              </span>
                              <span className="text-[#A0958F]">
                                {" "}
                                × {item.quantity}
                              </span>
                              {(item.yarnColor || item.size) && (
                                <div className="text-[#A0958F]">
                                  {item.yarnColor && (
                                    <span>{item.yarnColor}</span>
                                  )}
                                  {item.yarnColor && item.size && (
                                    <span> · </span>
                                  )}
                                  {item.size && <span>{item.size}</span>}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-4 font-bold text-[#2C2523] whitespace-nowrap">
                        ${(order.total || 0).toFixed(2)}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xxs font-bold border ${getStatusStyle(
                            order.status,
                          )}`}
                        >
                          {getStatusIcon(order.status)}
                          {order.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
