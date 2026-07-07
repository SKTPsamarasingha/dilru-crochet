import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { db } from "@/lib/firebase";
import { collection, getDocs, addDoc, doc, setDoc, query, where } from "firebase/firestore";
import { verifyAccessToken } from "@/lib/session";

const SUPER_ADMIN_ROLE = "SUPER_ADMIN";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("accessToken")?.value;
    const payload = await verifyAccessToken(token);

    if (!payload || payload.role !== SUPER_ADMIN_ROLE) {
      return NextResponse.json(
        { success: false, error: "Unauthorized: Super Admin access required" },
        { status: 403 }
      );
    }

    const usersCol = collection(db, "users");
    const snapshot = await getDocs(usersCol);
    const usersList = snapshot.docs.map((docSnap) => ({
      id: docSnap.id,
      ...docSnap.data()
    }));

    // Sort users alphabetically by name
    usersList.sort((a, b) => (a.name || "").localeCompare(b.name || ""));

    return NextResponse.json({ success: true, users: usersList });
  } catch (error) {
    console.error("List Users Error:", error);
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

    if (!payload || payload.role !== SUPER_ADMIN_ROLE) {
      return NextResponse.json(
        { success: false, error: "Unauthorized: Super Admin access required" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { email, name, role } = body;

    if (!email || !name || !role) {
      return NextResponse.json(
        { success: false, error: "Missing required fields (email, name, role)" },
        { status: 400 }
      );
    }

    // Check if user already exists
    const usersCol = collection(db, "users");
    const q = query(usersCol, where("email", "==", email.toLowerCase().trim()));
    const existingSnap = await getDocs(q);

    if (!existingSnap.empty) {
      return NextResponse.json(
        { success: false, error: "A user with this email address already exists" },
        { status: 409 }
      );
    }

    // Pre-create user mapped role. It maps uid upon signup.
    const docId = `user-pre-${Date.now()}`;
    const newUser = {
      email: email.toLowerCase().trim(),
      name: name.trim(),
      role: role.trim(),
      uid: null, // Mapped when user registers via Firebase
      createdAt: new Date().toISOString()
    };

    await setDoc(doc(db, "users", docId), newUser);

    return NextResponse.json({ 
      success: true, 
      user: { id: docId, ...newUser } 
    });
  } catch (error) {
    console.error("Create User Error:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
