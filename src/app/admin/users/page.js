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
  Edit,
  UserCog,
  Lock,
} from "lucide-react";
import AdminSearchFilterBar from "@/components/AdminSearchFilterBar";
import { useNotifications } from "@/components/NotificationProvider";

export default function AdminUsersPage() {
  const { user: currentUser } = useAuth();
  const { addToast, confirm } = useNotifications();
  const isSuperAdmin = currentUser?.role === "SUPER_ADMIN";

  const [users, setUsers] = useState([]);
  const [availableRoles, setAvailableRoles] = useState({});
  const [permissions, setPermissions] = useState({});
  const [permissionList, setPermissionList] = useState({});

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const [search, setSearch] = useState("");
  const [activeGroup, setActiveGroup] = useState("ALL");

  // Add User Form Modal
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [name, setName] = useState("");
  const [role, setRole] = useState("USER");

  // Edit User & Permissions Modal
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [editingName, setEditingName] = useState("");
  const [editingRole, setEditingRole] = useState("USER");
  const [editingPermissions, setEditingPermissions] = useState({});
  const [editLoading, setEditLoading] = useState(false);

  const fetchData = async () => {
    if (!isSuperAdmin) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError("");
    try {
      const [usersRes, rolesRes] = await Promise.all([
        fetch("/api/users"),
        fetch("/api/roles"),
      ]);

      if (usersRes.status === 403 || rolesRes.status === 403) {
        setError("Super Admin access required.");
        setLoading(false);
        return;
      }

      const usersData = await usersRes.json();
      const rolesData = await rolesRes.json();

      if (usersData.success && rolesData.success) {
        setUsers(usersData.users);
        setAvailableRoles(rolesData.roles);
        setPermissions(rolesData.permissions || {});
        setPermissionList(rolesData.permissionList || {});
      } else {
        setError("Failed to load users or roles");
      }
    } catch (err) {
      setError("An error occurred while loading the registry.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
        setUsers(
          users.map((u) => (u.id === userId ? { ...u, role: newRole } : u)),
        );
        addToast(`Role updated to ${newRole}.`, "success");
        setTimeout(() => setSuccessMsg(""), 3000);
      } else {
        addToast(data.error || "Failed to change user role.", "error");
      }
    } catch (err) {
      addToast("An error occurred while updating the role.", "error");
    }
  };

  const handleAddUser = async (e) => {
    e.preventDefault();
    setError("");
    setFormLoading(true);

    if (!email || !password || !name || !role) {
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
          password: password.trim(),
          name: name.trim(),
          role: role.trim(),
        }),
      });

      const data = await res.json();
      if (data.success) {
        setSuccessMsg(
          "User added successfully! They can now sign up using this email.",
        );
        setIsAddModalOpen(false);
        fetchData();
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

  const openEditModal = (targetUser) => {
    setEditingUser(targetUser);
    setEditingName(targetUser.name || "");
    setEditingRole(targetUser.role || "USER");
    setEditingPermissions(JSON.parse(JSON.stringify(permissions)));
    setError("");
    setIsEditModalOpen(true);
  };

  const toggleEditingPermission = (roleKey, permKey) => {
    if (roleKey === "SUPER_ADMIN") return;

    setEditingPermissions((prev) => {
      const current = prev[roleKey] || [];
      const next = current.includes(permKey)
        ? current.filter((p) => p !== permKey)
        : [...current, permKey];
      return { ...prev, [roleKey]: next };
    });
  };

  const handleSaveEditUser = async (e) => {
    e.preventDefault();
    if (!editingUser) return;
    setError("");
    setEditLoading(true);

    try {
      // 1. Update User Profile & Role
      const userRes = await fetch(`/api/users/${editingUser.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: editingName.trim(),
          role: editingRole,
        }),
      });
      const userData = await userRes.json();

      if (!userData.success) {
        throw new Error(userData.error || "Failed to update user profile");
      }

      // 2. Save Updated Role Permissions
      const roleRes = await fetch("/api/roles", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ permissions: editingPermissions }),
      });
      const roleData = await roleRes.json();

      if (!roleData.success) {
        throw new Error(roleData.error || "Failed to save role permissions");
      }

      setSuccessMsg(`Updated profile and permissions for ${editingName}!`);
      addToast(`Updated user profile and role permissions.`, "success");
      setIsEditModalOpen(false);
      await fetchData();
      setTimeout(() => setSuccessMsg(""), 4000);
    } catch (err) {
      setError(err.message || "An error occurred while saving updates.");
      addToast(err.message || "Failed to update profile.", "error");
    } finally {
      setEditLoading(false);
    }
  };

  const handleDelete = async (userId, userRole) => {
    const isProtectedRole = ["SUPER_ADMIN", "ADMIN"].includes(userRole);

    if (isProtectedRole) {
      addToast(
        "Admin profiles are protected and cannot be deleted.",
        "warning",
      );
      return;
    }

    const ok = await confirm(
      "Are you sure you want to delete this user profile?",
    );
    if (!ok) return;

    try {
      const res = await fetch(`/api/users/${userId}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        setSuccessMsg("User profile deleted successfully.");
        setUsers(users.filter((u) => u.id !== userId));
        addToast("User profile deleted successfully.", "success");
        setTimeout(() => setSuccessMsg(""), 3000);
      } else {
        addToast(data.error || "Failed to delete user.", "error");
      }
    } catch (err) {
      addToast("An error occurred while deleting user.", "error");
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
      case "USER":
        return "bg-gray-50 text-gray-700 border-gray-100";
      default:
        return "bg-amber-50 text-amber-700 border-amber-100";
    }
  };

  // Guard Screen for unauthorized users
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

  // Create role groups for filters
  const roleGroups = [
    { key: "ALL", label: "All Users" },
    ...Object.values(availableRoles).map((role) => ({
      key: role.key,
      label: role.label || role.key,
    })),
  ];

  return (
    <div className="space-y-6">
      {/* Header Area */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-[#2C2523] font-serif">
            User Management
          </h2>
          <p className="text-xs text-[#A0958F]">
            Assign users to groups — customers, editors, admins, and custom
            roles — and customize their permissions per role.
          </p>
        </div>
        <button
          onClick={() => {
            setEmail("");
            setName("");
            setRole("USER");
            setError("");
            setIsAddModalOpen(true);
          }}
          className="py-2.5 px-5 bg-[#E0A996] hover:bg-[#CF9581] text-[#2C2523] font-semibold rounded-xl text-xs flex items-center gap-2 cursor-pointer transition-colors shadow-xxs"
        >
          <UserPlus className="w-4 h-4" /> Add User
        </button>
      </div>

      {/* Messages */}
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
        <div className="flex gap-2 flex-wrap max-w-full">
          {roleGroups.map((group) => (
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
        </div>
      </AdminSearchFilterBar>

      {/* User List table */}
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
                        {Object.values(availableRoles).map((r) => (
                          <option key={r.key} value={r.key}>
                            {r.key}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEditModal(u)}
                          className="p-1.5 border border-[#EBE5E0] rounded-lg transition-colors hover:border-[#2C2523] hover:bg-[#F5EFEB] text-[#2C2523] cursor-pointer"
                          title="Edit User & Role Permissions"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(u.id, u.role)}
                          disabled={["SUPER_ADMIN", "ADMIN"].includes(u.role)}
                          className={`p-1.5 border border-[#EBE5E0] rounded-lg transition-colors ${
                            ["SUPER_ADMIN", "ADMIN"].includes(u.role)
                              ? "opacity-50 cursor-not-allowed"
                              : "hover:border-red-400 hover:bg-red-50 text-[#A0958F] hover:text-red-600 cursor-pointer"
                          }`}
                          title={
                            ["SUPER_ADMIN", "ADMIN"].includes(u.role)
                              ? "Protected admin profile"
                              : "Delete User"
                          }
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ADD USER FORM MODAL */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#2C2523]/50 backdrop-blur-sm">
          <div className="bg-white border border-[#FBEFEA] w-full max-w-md rounded-3xl p-6 sm:p-8 shadow-xl relative">
            <button
              onClick={() => setIsAddModalOpen(false)}
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
                  Password
                </label>
                <input
                  type="Password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
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
                  {Object.values(availableRoles).map((r) => (
                    <option key={r.key} value={r.key}>
                      {r.key} ({r.label || r.key})
                    </option>
                  ))}
                </select>
              </div>

              <div className="pt-4 border-t border-[#F5EFEB] flex gap-3 justify-end">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
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

      {/* EDIT USER & ROLE PERMISSIONS MODAL */}
      {isEditModalOpen && editingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#2C2523]/50 backdrop-blur-sm">
          <div className="bg-white border border-[#FBEFEA] w-full max-w-xl rounded-3xl p-6 sm:p-8 shadow-xl relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setIsEditModalOpen(false)}
              className="absolute top-4 right-4 p-2 hover:bg-[#F5EFEB] rounded-full text-[#4A3728] cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-[#2C2523] text-white flex items-center justify-center rounded-xl">
                <UserCog className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-[#2C2523] font-serif">
                  Edit User & Role Permissions
                </h3>
                <p className="text-xxs text-[#A0958F]">
                  Customize user details and configure permissions for role:{" "}
                  <span className="font-bold text-[#2C2523]">
                    {editingRole}
                  </span>
                </p>
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 p-3 mb-4 text-xs text-red-700 bg-red-50 border border-red-100 rounded-xl">
                <AlertCircle className="w-4.5 h-4.5 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSaveEditUser} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xxs font-bold text-[#2C2523] uppercase mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={editingName}
                    onChange={(e) => setEditingName(e.target.value)}
                    className="w-full px-3 py-2.5 bg-[#FDFBF7] border border-[#EBE5E0] text-xs text-[#2C2523] rounded-xl focus:outline-none focus:border-[#2C2523]"
                  />
                </div>

                <div>
                  <label className="block text-xxs font-bold text-[#2C2523] uppercase mb-1">
                    Assigned Role
                  </label>
                  <select
                    value={editingRole}
                    onChange={(e) => setEditingRole(e.target.value)}
                    className="w-full px-3 py-2.5 bg-[#FDFBF7] border border-[#EBE5E0] text-xs text-[#2C2523] rounded-xl focus:outline-none focus:border-[#2C2523]"
                  >
                    {Object.values(availableRoles).map((r) => (
                      <option key={r.key} value={r.key}>
                        {r.key} ({r.label || r.key})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Permissions Customization Section */}
              <div className="border-t border-[#F5EFEB] pt-5 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-[#2C2523] font-serif uppercase tracking-wider">
                      Customize Role Permissions: {editingRole}
                    </h4>
                    <p className="text-xxs text-[#A0958F]">
                      Permissions checked here apply to all users assigned to
                      role <span className="font-semibold">{editingRole}</span>.
                    </p>
                  </div>
                  {editingRole === "SUPER_ADMIN" && (
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-[#A0958F] bg-[#F5EFEB] px-2 py-1 rounded-full">
                      <Lock className="w-3 h-3" /> Locked
                    </span>
                  )}
                </div>

                {editingRole === "USER" ? (
                  <p className="text-xs text-[#4A3728] italic p-3 bg-[#FDFBF7] border border-[#F5EFEB] rounded-xl">
                    Customer role users only browse store and place orders.
                    Admin permissions do not apply.
                  </p>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                    {Object.values(permissionList).map((perm) => {
                      const rolePerms = editingPermissions[editingRole] || [];
                      const checked = rolePerms.includes(perm.key);
                      const disabled = editingRole === "SUPER_ADMIN";

                      return (
                        <label
                          key={perm.key}
                          className={`flex items-start gap-2.5 p-2.5 rounded-xl border transition-colors ${
                            disabled
                              ? "border-[#F5EFEB] bg-[#FDFBF7] opacity-75 cursor-not-allowed"
                              : checked
                                ? "border-[#2C2523] bg-[#2C2523]/5 cursor-pointer"
                                : "border-[#EBE5E0] bg-white hover:border-[#A0958F] cursor-pointer"
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={checked}
                            disabled={disabled}
                            onChange={() =>
                              toggleEditingPermission(editingRole, perm.key)
                            }
                            className="mt-0.5 w-4 h-4 rounded border-[#EBE5E0] text-[#2C2523] focus:ring-[#2C2523]"
                          />
                          <div>
                            <span className="text-xs font-semibold text-[#2C2523] block leading-tight">
                              {perm.label}
                            </span>
                            <span className="text-[10px] text-[#A0958F] block leading-tight mt-0.5">
                              {perm.description}
                            </span>
                          </div>
                        </label>
                      );
                    })}
                  </div>
                )}
              </div>

              <div className="pt-4 border-t border-[#F5EFEB] flex gap-3 justify-end">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="py-2.5 px-5 border border-[#EBE5E0] text-xs font-semibold rounded-xl hover:bg-[#F5EFEB] cursor-pointer transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={editLoading}
                  className="py-2.5 px-6 bg-[#2C2523] text-white font-bold rounded-xl text-xs flex items-center gap-2 cursor-pointer hover:bg-[#1A1615] disabled:opacity-75 disabled:cursor-not-allowed"
                >
                  {editLoading ? (
                    <Loader2 className="w-4.5 h-4.5 animate-spin" />
                  ) : (
                    <>
                      <Save className="w-4 h-4" /> Save Changes
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
