"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import {
  Shield,
  ShieldAlert,
  Loader2,
  Save,
  Check,
  AlertCircle,
  Users,
  UserCog,
  Plus,
  Trash2
} from "lucide-react";

const ROLE_ICONS = {
  USER: Users,
  EDITOR: UserCog,
  ADMIN: Shield,
  SUPER_ADMIN: Shield,
};

export default function AdminRolesPage() {
  const { user } = useAuth();
  const isSuperAdmin = user?.role === "SUPER_ADMIN";

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const [roles, setRoles] = useState({});
  const [permissionList, setPermissionList] = useState({});
  const [permissions, setPermissions] = useState({});

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newRoleKey, setNewRoleKey] = useState("");
  const [newRoleLabel, setNewRoleLabel] = useState("");
  const [newRoleDesc, setNewRoleDesc] = useState("");
  const [creating, setCreating] = useState(false);

  const fetchRoles = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/roles");
      if (res.status === 403) {
        setError("Super Admin access required.");
        return;
      }
      const data = await res.json();
      if (data.success) {
        setRoles(data.roles);
        setPermissionList(data.permissionList);
        setPermissions(data.permissions);
      } else {
        setError(data.error || "Failed to load role permissions.");
      }
    } catch {
      setError("An error occurred while loading permissions.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isSuperAdmin) return;
    fetchRoles();
  }, [isSuperAdmin]);

  const togglePermission = (roleKey, permKey) => {
    if (roleKey === "SUPER_ADMIN") return;

    setPermissions((prev) => {
      const current = prev[roleKey] || [];
      const next = current.includes(permKey)
        ? current.filter((p) => p !== permKey)
        : [...current, permKey];
      return { ...prev, [roleKey]: next };
    });
  };

  const handleSave = async () => {
    setSaving(true);
    setError("");
    try {
      const res = await fetch("/api/roles", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ permissions }),
      });
      const data = await res.json();
      if (data.success) {
        setPermissions(data.permissions);
        setSuccessMsg("Role permissions updated successfully.");
        setTimeout(() => setSuccessMsg(""), 3000);
      } else {
        setError(data.error || "Failed to save permissions.");
      }
    } catch {
      setError("An error occurred while saving.");
    } finally {
      setSaving(false);
    }
  };

  const handleCreateRole = async (e) => {
    e.preventDefault();
    setCreating(true);
    setError("");
    try {
      const res = await fetch("/api/roles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          key: newRoleKey,
          label: newRoleLabel,
          description: newRoleDesc
        })
      });
      const data = await res.json();
      if (data.success) {
        setSuccessMsg(`Role ${newRoleLabel} created successfully.`);
        setTimeout(() => setSuccessMsg(""), 3000);
        setShowCreateForm(false);
        setNewRoleKey("");
        setNewRoleLabel("");
        setNewRoleDesc("");
        await fetchRoles();
      } else {
        setError(data.error || "Failed to create role.");
      }
    } catch {
      setError("An error occurred while creating the role.");
    } finally {
      setCreating(false);
    }
  };

  const handleDeleteRole = async (roleKey) => {
    if (!confirm(`Are you sure you want to delete the role ${roleKey}?`)) return;
    
    setError("");
    try {
      const res = await fetch(`/api/roles?key=${roleKey}`, {
        method: "DELETE"
      });
      const data = await res.json();
      if (data.success) {
        setSuccessMsg(`Role ${roleKey} deleted successfully.`);
        setTimeout(() => setSuccessMsg(""), 3000);
        await fetchRoles();
      } else {
        setError(data.error || "Failed to delete role.");
      }
    } catch {
      setError("An error occurred while deleting the role.");
    }
  };

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
            Only Super Admins can configure role permissions for customers,
            editors, and admins.
          </p>
        </div>
      </div>
    );
  }

  // Ensure CORE_ROLES come first
  const coreRolesKeys = ["USER", "EDITOR", "ADMIN", "SUPER_ADMIN"];
  const dynamicRolesKeys = Object.keys(roles).filter(k => !coreRolesKeys.includes(k));
  const displayRolesKeys = [...coreRolesKeys, ...dynamicRolesKeys];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-[#2C2523] font-serif">
            Roles & Permissions
          </h2>
          <p className="text-xs text-[#A0958F]">
            Configure what each user group — customers, editors, admins, and custom roles — is allowed to do.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="py-2.5 px-4 bg-white border border-[#EBE5E0] hover:bg-[#FDFBF7] text-[#2C2523] font-semibold rounded-xl text-xs flex items-center gap-2 cursor-pointer transition-colors shadow-xxs"
          >
            <Plus className="w-4 h-4" />
            Create Role
          </button>
          <button
            onClick={handleSave}
            disabled={saving || loading}
            className="py-2.5 px-5 bg-[#2C2523] hover:bg-[#1A1615] text-white font-semibold rounded-xl text-xs flex items-center gap-2 cursor-pointer transition-colors shadow-xxs disabled:opacity-75"
          >
            {saving ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            Save Permissions
          </button>
        </div>
      </div>

      {showCreateForm && (
        <form onSubmit={handleCreateRole} className="bg-white border border-[#EBE5E0] rounded-2xl p-6 shadow-xxs space-y-4">
          <h3 className="text-sm font-bold text-[#2C2523] font-serif mb-2">Create New Role</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#2C2523] mb-1.5">Role Key</label>
              <input
                required
                type="text"
                placeholder="e.g. MANAGER"
                value={newRoleKey}
                onChange={e => setNewRoleKey(e.target.value)}
                className="w-full px-3 py-2 bg-[#FDFBF7] border border-[#EBE5E0] rounded-xl text-sm focus:outline-none focus:border-[#2C2523]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#2C2523] mb-1.5">Display Label</label>
              <input
                required
                type="text"
                placeholder="e.g. Store Manager"
                value={newRoleLabel}
                onChange={e => setNewRoleLabel(e.target.value)}
                className="w-full px-3 py-2 bg-[#FDFBF7] border border-[#EBE5E0] rounded-xl text-sm focus:outline-none focus:border-[#2C2523]"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-[#2C2523] mb-1.5">Description</label>
              <input
                type="text"
                placeholder="Brief description of the role..."
                value={newRoleDesc}
                onChange={e => setNewRoleDesc(e.target.value)}
                className="w-full px-3 py-2 bg-[#FDFBF7] border border-[#EBE5E0] rounded-xl text-sm focus:outline-none focus:border-[#2C2523]"
              />
            </div>
          </div>
          <div className="flex justify-end pt-2">
            <button
              type="button"
              onClick={() => setShowCreateForm(false)}
              className="px-4 py-2 text-xs font-semibold text-[#A0958F] hover:text-[#2C2523] mr-2"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={creating}
              className="py-2 px-4 bg-[#E0A996] hover:bg-[#CF9581] text-[#2C2523] font-semibold rounded-xl text-xs flex items-center gap-2"
            >
              {creating ? <Loader2 className="w-4 h-4 animate-spin" /> : "Create Role"}
            </button>
          </div>
        </form>
      )}

      {successMsg && (
        <div className="flex items-center gap-2.5 p-4 text-xs font-semibold text-green-700 bg-green-50 border border-green-100 rounded-xl">
          <Check className="w-4.5 h-4.5" />
          <span>{successMsg}</span>
        </div>
      )}

      {error && (
        <div className="flex items-center gap-2.5 p-4 text-xs font-semibold text-red-700 bg-red-50 border border-red-100 rounded-xl">
          <AlertCircle className="w-4.5 h-4.5" />
          <span>{error}</span>
        </div>
      )}

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white border border-[#EBE5E0] rounded-2xl">
          <Loader2 className="w-8 h-8 animate-spin text-[#2C2523] mb-3" />
          <p className="text-xs text-[#4A3728]">Loading permission groups...</p>
        </div>
      ) : (
        <div className="space-y-6">
          {displayRolesKeys.map((roleKey) => {
            const role = roles[roleKey];
            if (!role) return null;

            const Icon = ROLE_ICONS[roleKey] || Users;
            const rolePerms = permissions[roleKey] || [];
            const isSuperAdminRole = roleKey === "SUPER_ADMIN";
            const isUserRole = roleKey === "USER";
            const isLocked = isSuperAdminRole || isUserRole;
            const isCore = coreRolesKeys.includes(roleKey);

            return (
              <div
                key={roleKey}
                className="bg-white border border-[#EBE5E0] rounded-2xl shadow-xxs overflow-hidden"
              >
                <div className="px-6 py-4 border-b border-[#F5EFEB] flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#F5EFEB] text-[#2C2523] flex items-center justify-center rounded-xl">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-[#2C2523] font-serif flex items-center">
                      {role?.label || roleKey}
                      <span className="ml-2 text-[10px] font-mono text-[#A0958F] uppercase">
                        {roleKey}
                      </span>
                    </h3>
                    <p className="text-xxs text-[#A0958F]">
                      {role?.description}
                    </p>
                  </div>
                  <div className="ml-auto flex items-center gap-3">
                    {isLocked && (
                      <span className="text-[10px] font-bold text-[#A0958F] bg-[#F5EFEB] px-2 py-1 rounded-full">
                        {isUserRole ? "Store only" : "Locked"}
                      </span>
                    )}
                    {!isCore && (
                      <button 
                        onClick={() => handleDeleteRole(roleKey)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete custom role"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>

                <div className="p-6">
                  {isUserRole ? (
                    <p className="text-xs text-[#4A3728]">
                      Customers browse the store and place orders. Admin
                      permissions do not apply to this group.
                    </p>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {Object.values(permissionList).map((perm) => {
                        const checked = rolePerms.includes(perm.key);
                        const disabled = isSuperAdminRole;

                        return (
                          <label
                            key={perm.key}
                            className={`flex items-start gap-3 p-3 rounded-xl border transition-colors ${
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
                                togglePermission(roleKey, perm.key)
                              }
                              className="mt-0.5 w-4 h-4 rounded border-[#EBE5E0] text-[#2C2523] focus:ring-[#2C2523]"
                            />
                            <div>
                              <span className="text-xs font-semibold text-[#2C2523] block">
                                {perm.label}
                              </span>
                              <span className="text-xxs text-[#A0958F]">
                                {perm.description}
                              </span>
                            </div>
                          </label>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
