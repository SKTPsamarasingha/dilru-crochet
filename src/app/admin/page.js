import { db } from "@/lib/firebase";
import { collection, getDocs } from "firebase/firestore";
import { 
  DollarSign, 
  Receipt, 
  ShoppingBag, 
  Users, 
  Clock, 
  CheckCircle,
  ArrowRight
} from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  let orders = [];
  let products = [];
  let customers = [];

  try {
    const ordersSnap = await getDocs(collection(db, "orders"));
    orders = ordersSnap.docs.map((docSnap) => ({ id: docSnap.id, ...docSnap.data() }));
  } catch (e) {
    console.error("Dashboard orders fetch error:", e);
  }

  try {
    const productsSnap = await getDocs(collection(db, "products"));
    products = productsSnap.docs.map((docSnap) => ({ id: docSnap.id, ...docSnap.data() }));
  } catch (e) {
    console.error("Dashboard products fetch error:", e);
  }

  try {
    const usersSnap = await getDocs(collection(db, "users"));
    customers = usersSnap.docs.map((docSnap) => ({ id: docSnap.id, ...docSnap.data() }));
  } catch (e) {
    console.error("Dashboard users fetch error:", e);
  }

  const completedOrders = orders.filter((o) => o.status === "COMPLETED");
  const totalSales = completedOrders.reduce((sum, o) => sum + (o.total || 0), 0);
  const pendingOrdersCount = orders.filter((o) => o.status === "PENDING").length;

  const recentOrders = [...orders]
    .sort((a, b) => {
      const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return dateB - dateA;
    })
    .slice(0, 5);

  const recentProducts = [...products].slice(0, 5);
  const recentCustomers = [...customers].slice(0, 5);

  const stats = [
    {
      name: "Total Sales",
      value: `$${totalSales.toFixed(2)}`,
      icon: DollarSign,
      color: "text-green-600 bg-green-50 border-green-100",
      description: "From completed orders"
    },
    {
      name: "Total Orders",
      value: orders.length.toString(),
      icon: Receipt,
      color: "text-[#E0A996] bg-[#E0A996]/10 border-[#E0A996]/20",
      description: "Lifetime order count"
    },
    {
      name: "Pending Orders",
      value: pendingOrdersCount.toString(),
      icon: Clock,
      color: "text-amber-600 bg-amber-50 border-amber-100",
      description: "Awaiting handcrafted stitch"
    },
    {
      name: "Products Count",
      value: products.length.toString(),
      icon: ShoppingBag,
      color: "text-[#96A288] bg-[#96A288]/10 border-[#96A288]/20",
      description: "Items in catalog"
    }
  ];

  const getRoleColor = (role) => {
    switch (role) {
      case "SUPER_ADMIN":
        return "bg-purple-50 text-purple-700 border-purple-100";
      case "ADMIN":
        return "bg-red-50 text-red-700 border-red-100";
      case "EDITOR":
        return "bg-indigo-50 text-indigo-700 border-indigo-100";
      default:
        return "bg-gray-50 text-gray-700 border-gray-100";
    }
  };

  return (
    <div className="space-y-8">
      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.name}
              className="bg-white p-6 border border-[#FBEFEA] rounded-2xl shadow-xxs hover:shadow-xs transition-shadow flex items-center justify-between"
            >
              <div className="space-y-1.5">
                <span className="text-xs font-semibold text-[#A0958F] block uppercase tracking-wider">
                  {stat.name}
                </span>
                <span className="text-3xl font-extrabold text-[#2C2523] leading-none block font-serif">
                  {stat.value}
                </span>
                <span className="text-xxs text-[#4A3728] block">
                  {stat.description}
                </span>
              </div>
              <div className={`w-12 h-12 rounded-xl border flex items-center justify-center ${stat.color}`}>
                <Icon className="w-6 h-6" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Orders Table */}
      <div className="bg-white border border-[#FBEFEA] rounded-2xl shadow-xxs overflow-hidden">
        <div className="p-6 border-b border-[#F5EFEB] flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-[#2C2523] font-serif">Recent Orders</h3>
            <p className="text-xs text-[#A0958F]">Review and track latest custom purchases.</p>
          </div>
          <Link
            href="/admin/orders"
            className="inline-flex items-center gap-1 text-xs font-semibold text-[#E0A996] hover:text-[#CF9581] hover:underline"
          >
            View All Orders
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
        <div className="overflow-x-auto">
          {recentOrders.length === 0 ? (
            <div className="text-center py-16 text-[#A0958F] text-sm">
              No orders have been placed yet.
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#FDFBF7] text-[#A0958F] text-xxs font-bold uppercase tracking-wider border-b border-[#F5EFEB]">
                  <th className="px-6 py-4">Order ID</th>
                  <th className="px-6 py-4">Customer</th>
                  <th className="px-6 py-4">Total</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Items</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F5EFEB] text-xs text-[#4A3728]">
                {recentOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-[#FDFBF7]/50 transition-colors">
                    <td className="px-6 py-4 font-mono font-semibold text-[#2C2523] truncate max-w-[120px]">
                      {order.id}
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-semibold text-[#2C2523]">{order.userName}</div>
                      <div className="text-xxs text-[#A0958F]">{order.userEmail}</div>
                    </td>
                    <td className="px-6 py-4 font-bold text-[#2C2523]">
                      ${(order.total || 0).toFixed(2)}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xxs font-bold ${
                          order.status === "COMPLETED"
                            ? "bg-green-50 text-green-700 border border-green-100"
                            : order.status === "PENDING"
                            ? "bg-amber-50 text-amber-700 border border-amber-100"
                            : "bg-red-50 text-red-700 border border-red-100"
                        }`}
                      >
                        {order.status === "COMPLETED" ? (
                          <CheckCircle className="w-3 h-3" />
                        ) : (
                          <Clock className="w-3 h-3" />
                        )}
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right font-medium text-[#2C2523]">
                      {order.items?.reduce((sum, item) => sum + item.quantity, 0) || 0}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Products & Customers Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Products Table */}
        <div className="bg-white border border-[#FBEFEA] rounded-2xl shadow-xxs overflow-hidden">
          <div className="p-6 border-b border-[#F5EFEB] flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-[#2C2523] font-serif">Products</h3>
              <p className="text-xs text-[#A0958F]">Catalog inventory overview.</p>
            </div>
            <Link
              href="/admin/products"
              className="inline-flex items-center gap-1 text-xs font-semibold text-[#E0A996] hover:text-[#CF9581] hover:underline"
            >
              View All
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="overflow-x-auto">
            {recentProducts.length === 0 ? (
              <div className="text-center py-12 text-[#A0958F] text-sm">
                No products in catalog yet.
              </div>
            ) : (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#FDFBF7] text-[#A0958F] text-xxs font-bold uppercase tracking-wider border-b border-[#F5EFEB]">
                    <th className="px-6 py-4">Name</th>
                    <th className="px-6 py-4">Category</th>
                    <th className="px-6 py-4">Price</th>
                    <th className="px-6 py-4 text-right">Stock</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F5EFEB] text-xs text-[#4A3728]">
                  {recentProducts.map((product) => (
                    <tr key={product.id} className="hover:bg-[#FDFBF7]/50 transition-colors">
                      <td className="px-6 py-4 font-semibold text-[#2C2523]">{product.name}</td>
                      <td className="px-6 py-4">
                        <span className="text-[10px] font-bold text-[#96A288] uppercase tracking-wide">
                          {product.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-bold text-[#2C2523]">
                        ${(product.price || 0).toFixed(2)}
                      </td>
                      <td className="px-6 py-4 text-right font-medium text-[#2C2523]">
                        {product.stock ?? 0}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Recent Customers Table */}
        <div className="bg-white border border-[#FBEFEA] rounded-2xl shadow-xxs overflow-hidden">
          <div className="p-6 border-b border-[#F5EFEB] flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-[#2C2523] font-serif">Customers</h3>
              <p className="text-xs text-[#A0958F]">Registered user accounts.</p>
            </div>
            <Link
              href="/admin/customers"
              className="inline-flex items-center gap-1 text-xs font-semibold text-[#E0A996] hover:text-[#CF9581] hover:underline"
            >
              View All
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="overflow-x-auto">
            {recentCustomers.length === 0 ? (
              <div className="text-center py-12 text-[#A0958F] text-sm">
                No customers registered yet.
              </div>
            ) : (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#FDFBF7] text-[#A0958F] text-xxs font-bold uppercase tracking-wider border-b border-[#F5EFEB]">
                    <th className="px-6 py-4">Name</th>
                    <th className="px-6 py-4">Email</th>
                    <th className="px-6 py-4 text-right">Role</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F5EFEB] text-xs text-[#4A3728]">
                  {recentCustomers.map((customer) => (
                    <tr key={customer.id} className="hover:bg-[#FDFBF7]/50 transition-colors">
                      <td className="px-6 py-4 font-semibold text-[#2C2523]">{customer.name}</td>
                      <td className="px-6 py-4 text-xxs text-[#A0958F]">{customer.email}</td>
                      <td className="px-6 py-4 text-right">
                        <span
                          className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold border ${getRoleColor(
                            customer.role
                          )}`}
                        >
                          {customer.role || "USER"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
