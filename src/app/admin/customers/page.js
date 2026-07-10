"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import {
  Users,
  UserPlus,
  Trash2,
  Loader2,
  ShieldAlert,
  AlertCircle,
  X,
  Save,
  Check,
  Shield,
} from "lucide-react";
import AdminSearchFilterBar from "@/components/AdminSearchFilterBar";

const ROLE_GROUPS = [
  { key: "ALL", label: "All Users" },
  { key: "USER", label: "Customers" },
  { key: "EDITOR", label: "Editors" },
  { key: "ADMIN", label: "Admins" },
  { key: "SUPER_ADMIN", label: "Super Admins" },
];

export default function AdminCustomersPage() {
  const { user: currentUser } = useAuth();
  const isSuperAdmin = currentUser?.role === "SUPER_ADMIN";

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const [search, setSearch] = useState("");
  const [activeGroup, setActiveGroup] = useState("ALL");

  // Add User Form Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState("USER");

  const fetchUsers = async () => {
    if (!isSuperAdmin) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/users");
      if (res.status === 403) {
        setError("Super Admin access required.");
        setLoading(false);
        return;
      }

      const data = await res.json();
      if (data.success) {
        setUsers(data.users);
      } else {
        setError(data.error || "Failed to load users");
      }
    } catch (err) {
      setError("An error occurred while loading the registry.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let active = true;

    const loadUsers = async () => {
      if (!isSuperAdmin) {
        if (active) setLoading(false);
        return;
      }

      if (active) {
        setLoading(true);
        setError("");
      }

      try {
        const res = await fetch("/api/users");
        if (res.status === 403) {
          if (active) {
            setError("Super Admin access required.");
            setLoading(false);
          }
          return;
        }

        const data = await res.json();
        if (active) {
          if (data.success) {
            setUsers(data.users);
          } else {
            setError(data.error || "Failed to load users");
          }
        }
      } catch (err) {
        if (active) {
          setError("An error occurred while loading the registry.");
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    loadUsers();

    return () => {
      active = false;
    };
  }, [isSuperAdmin]);

  const handleRoleChange = async (userId, newRole) => {
    try {
      const res = await fetch(`/api/users/${userId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: newRole }),
      });

      const data = await res.json();
      if (data.success) {
        setSuccessMsg(`User role updated to ${newRole}!`);
        // Update local state dynamically
        setUsers(
          users.map((u) => (u.id === userId ? { ...u, role: newRole } : u)),
        );
        setTimeout(() => setSuccessMsg(""), 3000);
      } else {
        alert(data.error || "Failed to change user role.");
      }
    } catch (err) {
      alert("An error occurred while updating the role.");
    }
  };

  const handleAddUser = async (e) => {
    e.preventDefault();
    setError("");
    setFormLoading(true);

    if (!email || !name || !role) {
      setError("Please fill out all fields.");
      setFormLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim(),
          name: name.trim(),
          role: role.trim(),
        }),
      });

      const data = await res.json();
      if (data.success) {
        setSuccessMsg(
          "User added successfully! They can now sign up using this email.",
        );
        setIsModalOpen(false);
        fetchUsers();
        setTimeout(() => setSuccessMsg(""), 4000);
      } else {
        setError(data.error || "Failed to add user.");
      }
    } catch (err) {
      setError("An error occurred while saving user profile.");
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async (userId) => {
    if (!confirm("Are you sure you want to delete this user profile?")) return;

    try {
      const res = await fetch(`/api/users/${userId}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        setSuccessMsg("User profile deleted successfully.");
        setUsers(users.filter((u) => u.id !== userId));
        setTimeout(() => setSuccessMsg(""), 3000);
      } else {
        alert(data.error || "Failed to delete user.");
      }
    } catch (err) {
      alert("An error occurred while deleting user.");
    }
  };

  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      (u.name && u.name.toLowerCase().includes(search.toLowerCase())) ||
      (u.email && u.email.toLowerCase().includes(search.toLowerCase())) ||
      (u.role && u.role.toLowerCase().includes(search.toLowerCase()));
    const matchesGroup = activeGroup === "ALL" || u.role === activeGroup;
    return matchesSearch && matchesGroup;
  });

  const getRoleLabelColor = (roleVal) => {
    switch (roleVal) {
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

  // 1. Guard Screen for unauthorized users
  if (!isSuperAdmin) {
    return (
      <div className="bg-white border border-red-100 rounded-3xl p-8 sm:p-12 text-center max-w-lg mx-auto shadow-sm mt-8 space-y-6">
        <div className="w-16 h-16 bg-red-50 text-red-600 flex items-center justify-center rounded-2xl mx-auto">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h2 className="text-xl font-bold text-[#2C2523] font-serif">
            Access Denied
          </h2>
          <p className="text-xs text-[#4A3728] leading-relaxed">
            Super Admin permissions are required to manage users and roles.
            Changing folder access or demoting users is restricted to directory
            owners.
          </p>
        </div>
        <div className="p-3 bg-[#FDFBF7] border border-[#F5EFEB] rounded-xl text-xxs text-[#A0958F]">
          Sign in with the seeded admin account to manage team access and
          customer records page.
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 2. Header Area */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-[#2C2523] font-serif">
            User Management
          </h2>
          <p className="text-xs text-[#A0958F]">
            Assign users to groups — customers, editors, admins — and change
            their roles.
          </p>
        </div>
        <button
          onClick={() => {
            setEmail("");
            setName("");
            setRole("USER");
            setError("");
            setIsModalOpen(true);
          }}
          className="py-2.5 px-5 bg-[#E0A996] hover:bg-[#CF9581] text-[#2C2523] font-semibold rounded-xl text-xs flex items-center gap-2 cursor-pointer transition-colors shadow-xxs"
        >
          <UserPlus className="w-4 h-4" /> Add User
        </button>
      </div>

      {/* 3. Messages */}
      {successMsg && (
        <div className="flex items-center gap-2.5 p-4 text-xs font-semibold text-green-700 bg-green-50 border border-green-100 rounded-xl">
          <Check className="w-4.5 h-4.5" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Search & group filters */}
      <AdminSearchFilterBar
        searchValue={search}
        onSearchChange={setSearch}
        placeholder="Search Name, Email, or Role..."
        summary={`${filteredUsers.length} user${filteredUsers.length === 1 ? "" : "s"}`}
      >
        {ROLE_GROUPS.map((group) => (
          <button
            key={group.key}
            onClick={() => setActiveGroup(group.key)}
            className={`py-1.5 px-3.5 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
              activeGroup === group.key
                ? "bg-[#E0A996] text-[#2C2523]"
                : "bg-[#FDFBF7] border border-[#EBE5E0] text-[#4A3728] hover:border-[#A0958F]"
            }`}
          >
            {group.label}
          </button>
        ))}
      </AdminSearchFilterBar>

      {/* 5. User List table */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white border border-[#FBEFEA] rounded-2xl">
          <Loader2 className="w-8 h-8 animate-spin text-[#E0A996] mb-3" />
          <p className="text-xs text-[#4A3728]">Loading registry accounts...</p>
        </div>
      ) : filteredUsers.length === 0 ? (
        <div className="text-center py-16 bg-white border border-[#FBEFEA] rounded-2xl text-[#A0958F] text-xs">
          No users registered in this project.
        </div>
      ) : (
        <div className="bg-white border border-[#FBEFEA] rounded-2xl shadow-xxs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#FDFBF7] text-[#A0958F] text-xxs font-bold uppercase tracking-wider border-b border-[#F5EFEB]">
                  <th className="px-6 py-4">User Details</th>
                  <th className="px-6 py-4">Auth Sync Status</th>
                  <th className="px-6 py-4">Active Role</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F5EFEB] text-xs text-[#4A3728]">
                {filteredUsers.map((u) => (
                  <tr
                    key={u.id}
                    className="hover:bg-[#FDFBF7]/50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="font-semibold text-[#2C2523] flex items-center gap-1.5">
                        {u.name}
                        {u.role === "SUPER_ADMIN" && (
                          <Shield className="w-3.5 h-3.5 text-purple-600" />
                        )}
                      </div>
                      <div className="text-xxs text-[#A0958F]">{u.email}</div>
                    </td>
                    <td className="px-6 py-4">
                      {u.uid ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-green-50 text-green-700 text-[10px] font-semibold border border-green-100">
                          Synced
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-amber-50 text-amber-700 text-[10px] font-semibold border border-amber-100">
                          Pending Signup
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <select
                        value={u.role}
                        onChange={(e) => handleRoleChange(u.id, e.target.value)}
                        className={`px-2 py-1.5 border rounded-lg text-xxs font-bold cursor-pointer focus:outline-none focus:ring-1 focus:ring-[#E0A996] ${getRoleLabelColor(
                          u.role,
                        )}`}
                      >
                        <option value="USER">USER</option>
                        <option value="EDITOR">EDITOR</option>
                        <option value="ADMIN">ADMIN</option>
                        <option value="SUPER_ADMIN">SUPER_ADMIN</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleDelete(u.id)}
                        className="p-1.5 border border-[#EBE5E0] hover:border-red-400 hover:bg-red-50 text-[#A0958F] hover:text-red-600 rounded-lg cursor-pointer transition-colors"
                        title="Delete User"
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

      {/* 6. ADD USER FORM MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#2C2523]/50 backdrop-blur-sm">
          <div className="bg-white border border-[#FBEFEA] w-full max-w-md rounded-3xl p-6 sm:p-8 shadow-xl relative">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 p-2 hover:bg-[#F5EFEB] rounded-full text-[#4A3728] cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-[#E0A996]/15 text-[#E0A996] flex items-center justify-center rounded-xl">
                <UserPlus className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-[#2C2523] font-serif">
                  Pre-Register User
                </h3>
                <p className="text-xxs text-[#A0958F]">
                  Create user mapping entries inside database.
                </p>
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 p-3 mb-4 text-xs text-red-700 bg-red-50 border border-red-100 rounded-xl">
                <AlertCircle className="w-4.5 h-4.5 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleAddUser} className="space-y-4">
              <div>
                <label className="block text-xxs font-bold text-[#2C2523] uppercase mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Dilru Editor"
                  className="w-full px-3 py-2.5 bg-[#FDFBF7] border border-[#EBE5E0] text-xs text-[#2C2523] rounded-xl focus:outline-none focus:border-[#E0A996]"
                />
              </div>

              <div>
                <label className="block text-xxs font-bold text-[#2C2523] uppercase mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. editor@dilrucrochet.com"
                  className="w-full px-3 py-2.5 bg-[#FDFBF7] border border-[#EBE5E0] text-xs text-[#2C2523] rounded-xl focus:outline-none focus:border-[#E0A996]"
                />
              </div>

              <div>
                <label className="block text-xxs font-bold text-[#2C2523] uppercase mb-1">
                  Role / Permissions
                </label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full px-3 py-2.5 bg-[#FDFBF7] border border-[#EBE5E0] text-xs text-[#2C2523] rounded-xl focus:outline-none focus:border-[#E0A996]"
                >
                  <option value="USER">USER (Customer)</option>
                  <option value="EDITOR">
                    EDITOR (Staff / Stock management)
                  </option>
                  <option value="ADMIN">ADMIN (Full content controls)</option>
                  <option value="SUPER_ADMIN">
                    SUPER_ADMIN (Owner / Role control)
                  </option>
                </select>
              </div>

              <div className="pt-4 border-t border-[#F5EFEB] flex gap-3 justify-end">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="py-2.5 px-5 border border-[#EBE5E0] text-xs font-semibold rounded-xl hover:bg-[#F5EFEB] cursor-pointer transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={formLoading}
                  className="py-2.5 px-6 bg-[#E0A996] text-[#2C2523] font-bold rounded-xl text-xs flex items-center gap-2 cursor-pointer hover:bg-[#CF9581] disabled:opacity-75 disabled:cursor-not-allowed"
                >
                  {formLoading ? (
                    <Loader2 className="w-4.5 h-4.5 animate-spin" />
                  ) : (
                    <>
                      <Save className="w-4 h-4" /> Save
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
