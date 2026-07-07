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

    if (!payload || !(await authorize(payload.role, "manage_products"))) {
      return NextResponse.json(
        { success: false, error: "Unauthorized: Insufficient privileges" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { name, description, price, image, category, stock, customizable } = body;

    const docRef = doc(db, "products", id);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      return NextResponse.json(
        { success: false, error: "Product not found" },
        { status: 404 }
      );
    }

    const updatedData = {};
    if (name !== undefined) updatedData.name = name;
    if (description !== undefined) updatedData.description = description;
    if (price !== undefined) updatedData.price = parseFloat(price);
    if (image !== undefined) updatedData.image = image;
    if (category !== undefined) updatedData.category = category;
    if (stock !== undefined) updatedData.stock = parseInt(stock);
    if (customizable !== undefined) updatedData.customizable = !!customizable;

    await updateDoc(docRef, updatedData);

    return NextResponse.json({ 
      success: true, 
      product: { id, ...docSnap.data(), ...updatedData } 
    });
  } catch (error) {
    console.error("Update Product Error:", error);
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

    if (!payload || !(await authorize(payload.role, "delete_products"))) {
      return NextResponse.json(
        { success: false, error: "Unauthorized: Delete products permission required" },
        { status: 403 }
      );
    }

    const docRef = doc(db, "products", id);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      return NextResponse.json(
        { success: false, error: "Product not found" },
        { status: 404 }
      );
    }

    await deleteDoc(docRef);

    return NextResponse.json({ 
      success: true, 
      message: "Product deleted successfully" 
    });
  } catch (error) {
    console.error("Delete Product Error:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
