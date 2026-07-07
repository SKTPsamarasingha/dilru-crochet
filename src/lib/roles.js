import { db } from "@/lib/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";

export const ROLES = {
  USER: {
    key: "USER",
    label: "Customer",
    description: "Store shoppers who can browse and place orders.",
  },
  EDITOR: {
    key: "EDITOR",
    label: "Editor",
    description: "Staff who manage products and order statuses.",
  },
  ADMIN: {
    key: "ADMIN",
    label: "Admin",
    description: "Full content control including deletions.",
  },
  SUPER_ADMIN: {
    key: "SUPER_ADMIN",
    label: "Super Admin",
    description: "Owner access — manages users and role permissions.",
  },
};

export const PERMISSIONS = {
  access_admin: {
    key: "access_admin",
    label: "Access Admin Panel",
    description: "Open the admin dashboard and sidebar.",
  },
  manage_products: {
    key: "manage_products",
    label: "Manage Products",
    description: "Create and edit product catalog items.",
  },
  delete_products: {
    key: "delete_products",
    label: "Delete Products",
    description: "Remove products from the catalog.",
  },
  manage_orders: {
    key: "manage_orders",
    label: "Manage Orders",
    description: "View and update order statuses.",
  },
  delete_orders: {
    key: "delete_orders",
    label: "Delete Orders",
    description: "Cancel or remove orders.",
  },
  manage_users: {
    key: "manage_users",
    label: "Manage Users",
    description: "Add, edit roles, and remove user accounts.",
  },
  manage_role_permissions: {
    key: "manage_role_permissions",
    label: "Manage Role Permissions",
    description: "Configure what each user group is allowed to do.",
  },
};

export const DEFAULT_ROLE_PERMISSIONS = {
  USER: [],
  EDITOR: ["access_admin", "manage_products", "manage_orders"],
  ADMIN: [
    "access_admin",
    "manage_products",
    "delete_products",
    "manage_orders",
    "delete_orders",
  ],
  SUPER_ADMIN: Object.keys(PERMISSIONS),
};

const SETTINGS_DOC = "rolePermissions";

export async function getRolePermissions() {
  try {
    const snap = await getDoc(doc(db, "settings", SETTINGS_DOC));
    if (snap.exists()) {
      return { ...DEFAULT_ROLE_PERMISSIONS, ...snap.data() };
    }
  } catch (e) {
    console.error("Failed to load role permissions:", e);
  }
  return { ...DEFAULT_ROLE_PERMISSIONS };
}

export async function saveRolePermissions(permissions) {
  await setDoc(doc(db, "settings", SETTINGS_DOC), permissions, { merge: true });
}

export function roleHasPermission(rolePermissions, role, permission) {
  const perms = rolePermissions[role] || DEFAULT_ROLE_PERMISSIONS[role] || [];
  return perms.includes(permission);
}

export async function authorize(role, permission) {
  const rolePermissions = await getRolePermissions();
  return roleHasPermission(rolePermissions, role, permission);
}

export const ADMIN_PANEL_ROLES = ["EDITOR", "ADMIN", "SUPER_ADMIN"];
