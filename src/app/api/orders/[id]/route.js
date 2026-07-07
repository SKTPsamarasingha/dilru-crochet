import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { db } from "@/lib/firebase";
import { doc, updateDoc, deleteDoc, getDoc } from "firebase/firestore";
import { verifyAccessToken } from "@/lib/session";
import { authorize } from "@/lib/roles";

export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    const cookieStore = await cookies();
    const token = cookieStore.get("accessToken")?.value;
    const payload = await verifyAccessToken(token);

    if (!payload || !(await authorize(payload.role, "manage_orders"))) {
      return NextResponse.json(
        { success: false, error: "Unauthorized: Insufficient privileges" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { status } = body;

    if (!status) {
      return NextResponse.json(
        { success: false, error: "Status field is required" },
        { status: 400 }
      );
    }

    const docRef = doc(db, "orders", id);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      return NextResponse.json(
        { success: false, error: "Order not found" },
        { status: 404 }
      );
    }

    await updateDoc(docRef, { status });

    return NextResponse.json({ 
      success: true, 
      order: { id, ...docSnap.data(), status } 
    });
  } catch (error) {
    console.error("Update Order Error:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = await params;
    const cookieStore = await cookies();
    const token = cookieStore.get("accessToken")?.value;
    const payload = await verifyAccessToken(token);

    if (!payload || !(await authorize(payload.role, "delete_orders"))) {
      return NextResponse.json(
        { success: false, error: "Unauthorized: Delete orders permission required" },
        { status: 403 }
      );
    }

    const docRef = doc(db, "orders", id);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      return NextResponse.json(
        { success: false, error: "Order not found" },
        { status: 404 }
      );
    }

    await deleteDoc(docRef);

    return NextResponse.json({ 
      success: true, 
      message: "Order deleted successfully" 
    });
  } catch (error) {
    console.error("Delete Order Error:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
