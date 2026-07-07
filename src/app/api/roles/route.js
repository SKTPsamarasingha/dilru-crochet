import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyAccessToken } from "@/lib/session";
import {
  ROLES,
  PERMISSIONS,
  DEFAULT_ROLE_PERMISSIONS,
  getRolePermissions,
  saveRolePermissions,
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

    const permissions = await getRolePermissions();

    return NextResponse.json({
      success: true,
      roles: ROLES,
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

    const validRoles = Object.keys(ROLES);
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
