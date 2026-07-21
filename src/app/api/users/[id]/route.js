import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { db } from "@/lib/firebase";
import { doc, updateDoc, deleteDoc, getDoc } from "firebase/firestore";
import { verifyAccessToken } from "@/lib/session";
import { canManageUserProfile } from "@/lib/user-access.mjs";

const SUPER_ADMIN_ROLE = "SUPER_ADMIN";

export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    const cookieStore = await cookies();
    const token = cookieStore.get("accessToken")?.value;
    const payload = await verifyAccessToken(token);

    if (!payload) {
      return NextResponse.json(
        { success: false, error: "Unauthorized: authentication required" },
        { status: 401 },
      );
    }

    const body = await request.json();
    const { role, name } = body;

    const docRef = doc(db, "users", id);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 },
      );
    }

    const userData = docSnap.data();
    const canUpdate = canManageUserProfile(
      { email: payload.email, role: payload.role },
      { email: userData.email, role: userData.role },
      "update",
    );

    if (!canUpdate) {
      return NextResponse.json(
        { success: false, error: "You are not allowed to update this profile" },
        { status: 403 },
      );
    }

    if (role !== undefined && payload.role !== SUPER_ADMIN_ROLE) {
      return NextResponse.json(
        { success: false, error: "Only Super Admins can change user roles" },
        { status: 403 },
      );
    }

    // Prevent Super Admin from changing their own role to something else to avoid lockouts
    if (userData.email === payload.email && role && role !== SUPER_ADMIN_ROLE) {
      return NextResponse.json(
        {
          success: false,
          error: "Lockout Prevention: Super Admins cannot demote themselves",
        },
        { status: 400 },
      );
    }

    const updatedData = {};
    if (role !== undefined) updatedData.role = role;
    if (name !== undefined) updatedData.name = name;

    await updateDoc(docRef, updatedData);

    return NextResponse.json({
      success: true,
      user: { id, ...userData, ...updatedData },
    });
  } catch (error) {
    console.error("Update User Error:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 },
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = await params;
    const cookieStore = await cookies();
    const token = cookieStore.get("accessToken")?.value;
    const payload = await verifyAccessToken(token);

    if (!payload) {
      return NextResponse.json(
        { success: false, error: "Unauthorized: authentication required" },
        { status: 401 },
      );
    }

    const docRef = doc(db, "users", id);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 },
      );
    }

    const userData = docSnap.data();
    const canDelete = canManageUserProfile(
      { email: payload.email, role: payload.role },
      { email: userData.email, role: userData.role },
      "delete",
    );

    if (!canDelete) {
      return NextResponse.json(
        { success: false, error: "Admin profiles are protected from deletion" },
        { status: 403 },
      );
    }

    // Prevent Super Admin from deleting themselves
    if (userData.email === payload.email) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Lockout Prevention: Super Admins cannot delete their own accounts",
        },
        { status: 400 },
      );
    }

    await deleteDoc(docRef);

    return NextResponse.json({
      success: true,
      message: "User account deleted successfully",
    });
  } catch (error) {
    console.error("Delete User Error:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 },
    );
  }
}
