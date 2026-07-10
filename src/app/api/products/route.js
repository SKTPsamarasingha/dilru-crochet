import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { db } from "@/lib/firebase";
import { collection, getDocs, addDoc } from "firebase/firestore";
import { verifyAccessToken } from "@/lib/session";
import { authorize } from "@/lib/roles";

function isPlaceholderProduct(product) {
  const haystack =
    `${product.name || ""} ${product.description || ""}`.toLowerCase();
  return ["test", "placeholder", "sample", "dummy"].some((term) =>
    haystack.includes(term),
  );
}

export async function GET() {
  try {
    const productsCol = collection(db, "products");
    const snapshot = await getDocs(productsCol);
    const productsList = snapshot.docs
      .map((docSnap) => ({
        id: docSnap.id,
        ...docSnap.data(),
      }))
      .filter((product) => !isPlaceholderProduct(product));

    // Sort products logically (e.g. by creation time, default to ID name)
    productsList.sort((a, b) => {
      const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return dateB - dateA; // newest first
    });

    return NextResponse.json({ success: true, products: productsList });
  } catch (error) {
    console.error("Fetch Products Error:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 },
    );
  }
}

export async function POST(request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("accessToken")?.value;
    const payload = await verifyAccessToken(token);

    if (!payload || !(await authorize(payload.role, "manage_products"))) {
      return NextResponse.json(
        {
          success: false,
          error: "Unauthorized: Product management permission required",
        },
        { status: 403 },
      );
    }

    const body = await request.json();
    const { name, description, price, image, category, stock, customizable } =
      body;

    if (!name || price === undefined || !category) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing required fields (name, price, category)",
        },
        { status: 400 },
      );
    }

    const newProduct = {
      name,
      description: description || "",
      price: parseFloat(price),
      image:
        image ||
        "https://images.unsplash.com/photo-1618220179428-22790b461013?q=80&w=600",
      category,
      stock: parseInt(stock) || 0,
      customizable: !!customizable,
      createdAt: new Date().toISOString(),
    };

    const docRef = await addDoc(collection(db, "products"), newProduct);

    return NextResponse.json({
      success: true,
      product: { id: docRef.id, ...newProduct },
    });
  } catch (error) {
    console.error("Create Product Error:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 },
    );
  }
}
