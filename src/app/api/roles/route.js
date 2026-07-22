import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyAccessToken } from "@/lib/session";
import {
  getAllRoles,
  PERMISSIONS,
  DEFAULT_ROLE_PERMISSIONS,
  getRolePermissions,
  saveRolePermissions,
  createCustomRole,
  deleteCustomRole
} from "@/lib/roles";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("accessToken")?.value;
    const payload = await verifyAccessToken(token);

    if (!payload || payload.role !== "SUPER_ADMIN") {
      return NextResponse.json(
        { success: false, error: "Unauthorized: Super Admin access required" },
        { status: 403 }
      );
    }

    const roles = await getAllRoles();
    const permissions = await getRolePermissions();

    return NextResponse.json({
      success: true,
      roles,
      permissionList: PERMISSIONS,
      permissions,
      defaults: DEFAULT_ROLE_PERMISSIONS,
    });
  } catch (error) {
    console.error("Get Roles Error:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

export async function PUT(request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("accessToken")?.value;
    const payload = await verifyAccessToken(token);

    if (!payload || payload.role !== "SUPER_ADMIN") {
      return NextResponse.json(
        { success: false, error: "Unauthorized: Super Admin access required" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { permissions } = body;

    if (!permissions || typeof permissions !== "object") {
      return NextResponse.json(
        { success: false, error: "Invalid permissions payload" },
        { status: 400 }
      );
    }

    const roles = await getAllRoles();
    const validRoles = Object.keys(roles);
    const validPermissions = Object.keys(PERMISSIONS);
    const sanitized = {};

    for (const role of validRoles) {
      if (!Array.isArray(permissions[role])) continue;
      sanitized[role] = permissions[role].filter((p) => validPermissions.includes(p));
    }

    // Super Admin must always keep role & user management
    sanitized.SUPER_ADMIN = [
      ...new Set([
        ...(sanitized.SUPER_ADMIN || []),
        "manage_users",
        "manage_role_permissions",
        "access_admin",
      ]),
    ];

    await saveRolePermissions(sanitized);

    return NextResponse.json({ success: true, permissions: sanitized });
  } catch (error) {
    console.error("Update Roles Error:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("accessToken")?.value;
    const payload = await verifyAccessToken(token);

    if (!payload || payload.role !== "SUPER_ADMIN") {
      return NextResponse.json(
        { success: false, error: "Unauthorized: Super Admin access required" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { key, label, description } = body;

    if (!key || !label) {
      return NextResponse.json(
        { success: false, error: "Key and label are required" },
        { status: 400 }
      );
    }

    const newRoleKey = await createCustomRole(key, label, description || "");

    return NextResponse.json({ success: true, roleKey: newRoleKey });
  } catch (error) {
    console.error("Create Role Error:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("accessToken")?.value;
    const payload = await verifyAccessToken(token);

    if (!payload || payload.role !== "SUPER_ADMIN") {
      return NextResponse.json(
        { success: false, error: "Unauthorized: Super Admin access required" },
        { status: 403 }
      );
    }

    const url = new URL(request.url);
    const roleKey = url.searchParams.get("key");

    if (!roleKey) {
      return NextResponse.json(
        { success: false, error: "Role key is required" },
        { status: 400 }
      );
    }

    await deleteCustomRole(roleKey);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete Role Error:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
