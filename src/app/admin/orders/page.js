"use client";

import { useState, useEffect } from "react";
import { 
  Search, 
  Trash2, 
  Loader2, 
  AlertCircle, 
  ChevronDown
} from "lucide-react";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [search, setSearch] = useState("");

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/orders");
      const data = await res.json();
      if (data.success) {
        setOrders(data.orders);
      } else {
        setError(data.error || "Failed to load orders");
      }
    } catch (err) {
      setError("An error occurred while loading orders.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus })
      });

      const data = await res.json();
      if (data.success) {
        // Update local state dynamically
        setOrders(
          orders.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
        );
      } else {
        alert(data.error || "Failed to update order status.");
      }
    } catch (err) {
      alert("An error occurred while updating status.");
    }
  };

  const handleDelete = async (orderId) => {
    if (!confirm("Are you sure you want to delete/cancel this order?")) return;

    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: "DELETE"
      });
      const data = await res.json();
      if (data.success) {
        setOrders(orders.filter((o) => o.id !== orderId));
      } else {
        alert(data.error || "Failed to delete order.");
      }
    } catch (err) {
      alert("An error occurred while deleting.");
    }
  };

  // Filter & Search Logic
  const filteredOrders = orders.filter((o) => {
    const matchesSearch = 
      (o.id && o.id.toLowerCase().includes(search.toLowerCase())) ||
      (o.userEmail && o.userEmail.toLowerCase().includes(search.toLowerCase())) ||
      (o.userName && o.userName.toLowerCase().includes(search.toLowerCase()));
    const matchesStatus = filterStatus === "All" || o.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const statuses = ["All", "PENDING", "PROCESSING", "SHIPPED", "COMPLETED", "CANCELLED"];

  const getStatusBadge = (status) => {
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
  };

  return (
    <div className="space-y-6">
      {/* 1. Header Area */}
      <div>
        <h2 className="text-2xl font-bold text-[#2C2523] font-serif">Order Board</h2>
        <p className="text-xs text-[#A0958F]">Track, configure statuses, and manage handcrafted deliveries.</p>
      </div>

      {/* 2. Error Alerts */}
      {error && (
        <div className="flex items-center gap-2.5 p-4 text-xs font-semibold text-red-700 bg-red-50 border border-red-100 rounded-xl">
          <AlertCircle className="w-4.5 h-4.5" />
          <span>{error}</span>
        </div>
      )}

      {/* 3. Search and Filters */}
      <div className="bg-white p-4 border border-[#FBEFEA] rounded-2xl shadow-xxs flex flex-col md:flex-row gap-4 justify-between items-center">
        {/* Search */}
        <div className="relative w-full md:max-w-xs">
          <input
            type="text"
            placeholder="Search Order ID, Name, or Email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-[#FDFBF7] border border-[#EBE5E0] text-xs text-[#2C2523] placeholder-[#A0958F] rounded-xl focus:outline-none focus:border-[#E0A996] transition-all"
          />
          <Search className="absolute left-3 top-3 w-4 h-4 text-[#A0958F]" />
        </div>

        {/* Status filters */}
        <div className="flex flex-wrap gap-1.5 w-full md:w-auto">
          {statuses.map((stat) => (
            <button
              key={stat}
              onClick={() => setFilterStatus(stat)}
              className={`py-1.5 px-3 rounded-lg text-[10px] font-extrabold tracking-wide uppercase transition-all cursor-pointer ${
                filterStatus === stat
                  ? "bg-[#E0A996] text-[#2C2523]"
                  : "bg-[#FDFBF7] border border-[#EBE5E0] text-[#4A3728] hover:border-[#A0958F]"
              }`}
            >
              {stat}
            </button>
          ))}
        </div>
      </div>

      {/* 4. Orders Content */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white border border-[#FBEFEA] rounded-2xl">
          <Loader2 className="w-8 h-8 animate-spin text-[#E0A996] mb-3" />
          <p className="text-xs text-[#4A3728]">Loading order requests...</p>
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="text-center py-16 bg-white border border-[#FBEFEA] rounded-2xl text-[#A0958F] text-xs">
          No orders found matching your search.
        </div>
      ) : (
        <div className="bg-white border border-[#FBEFEA] rounded-2xl shadow-xxs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#FDFBF7] text-[#A0958F] text-xxs font-bold uppercase tracking-wider border-b border-[#F5EFEB]">
                  <th className="px-6 py-4">Order ID</th>
                  <th className="px-6 py-4">Customer</th>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4">Items</th>
                  <th className="px-6 py-4">Total</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F5EFEB] text-xs text-[#4A3728]">
                {filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-[#FDFBF7]/50 transition-colors">
                    <td className="px-6 py-4 font-mono font-semibold text-[#2C2523] truncate max-w-[120px]">
                      {order.id}
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-semibold text-[#2C2523]">{order.userName}</div>
                      <div className="text-xxs text-[#A0958F]">{order.userEmail}</div>
                    </td>
                    <td className="px-6 py-4 text-xxs text-[#A0958F] whitespace-nowrap">
                      {order.createdAt
                        ? new Date(order.createdAt).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })
                        : "N/A"}
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1 max-w-[220px]">
                        {order.items?.map((item, idx) => (
                          <div key={idx} className="text-xxs">
                            <span className="font-semibold text-[#2C2523]">{item.name}</span>
                            <span className="text-[#A0958F]"> × {item.quantity}</span>
                          </div>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4 font-bold text-[#2C2523] whitespace-nowrap">
                      ${order.total.toFixed(2)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="relative inline-block">
                        <select
                          value={order.status}
                          onChange={(e) => handleStatusChange(order.id, e.target.value)}
                          className={`pl-3 pr-8 py-1.5 border rounded-lg text-xxs font-bold appearance-none cursor-pointer focus:outline-none focus:ring-1 focus:ring-[#E0A996] ${getStatusBadge(
                            order.status
                          )}`}
                        >
                          {statuses.filter((s) => s !== "All").map((opt) => (
                            <option key={opt} value={opt} className="bg-white text-[#2C2523]">
                              {opt}
                            </option>
                          ))}
                        </select>
                        <ChevronDown className="w-3.5 h-3.5 absolute right-2.5 top-2.5 pointer-events-none text-[#4A3728]" />
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleDelete(order.id)}
                        className="p-1.5 border border-[#EBE5E0] hover:border-red-400 hover:bg-red-50 text-[#A0958F] hover:text-red-600 rounded-lg cursor-pointer transition-colors"
                        title="Delete/Cancel Order"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
