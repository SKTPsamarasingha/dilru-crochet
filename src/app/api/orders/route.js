import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { db } from "@/lib/firebase";
import { collection, getDocs, addDoc, query, where } from "firebase/firestore";
import { verifyAccessToken } from "@/lib/session";



export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("accessToken")?.value;
    const payload = await verifyAccessToken(token);

    if (!payload) {
      return NextResponse.json(
        { success: false, error: "Unauthorized: Log in to retrieve orders" },
        { status: 401 }
      );
    }

    const ordersCol = collection(db, "orders");
    let snapshot;

    if (payload.role !== "USER") {
      snapshot = await getDocs(ordersCol);
    } else {
      const q = query(ordersCol, where("userId", "==", payload.uid));
      snapshot = await getDocs(q);
    }

    const ordersList = snapshot.docs.map((docSnap) => ({
      id: docSnap.id,
      ...docSnap.data()
    }));

    // Sort by creation time (newest first)
    ordersList.sort((a, b) => {
      const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return dateB - dateA;
    });

    return NextResponse.json({ success: true, orders: ordersList });
  } catch (error) {
    console.error("Fetch Orders Error:", error);
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

    if (!payload) {
      return NextResponse.json(
        { success: false, error: "Unauthorized: Please log in to complete checkout" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { items, total } = body;

    if (!items || items.length === 0 || total === undefined) {
      return NextResponse.json(
        { success: false, error: "Missing order details (items or total)" },
        { status: 400 }
      );
    }

    const newOrder = {
      userId: payload.uid,
      userEmail: payload.email,
      userName: payload.name || "Customer",
      items: items.map((item) => ({
        productId: item.productId,
        name: item.name,
        quantity: parseInt(item.quantity) || 1,
        price: parseFloat(item.price),
        yarnColor: item.yarnColor || null,
        size: item.size || null,
      })),
      total: parseFloat(total),
      status: "PENDING",
      createdAt: new Date().toISOString()
    };

    const docRef = await addDoc(collection(db, "orders"), newOrder);

    return NextResponse.json({
      success: true,
      order: { id: docRef.id, ...newOrder }
    });
  } catch (error) {
    console.error("Create Order Error:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
