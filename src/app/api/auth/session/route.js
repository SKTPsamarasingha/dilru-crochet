import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { db } from "@/lib/firebase";
import { collection, query, where, getDocs, doc, setDoc, updateDoc } from "firebase/firestore";
import { signAccessToken, signRefreshToken, verifyAccessToken } from "@/lib/session";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("accessToken")?.value;
    const payload = await verifyAccessToken(token);

    if (!payload) {
      return NextResponse.json({ success: true, user: null });
    }

    return NextResponse.json({
      success: true,
      user: {
        uid: payload.uid,
        email: payload.email,
        name: payload.name,
        role: payload.role,
      },
    });
  } catch (error) {
    console.error("Session GET Error:", error);
    return NextResponse.json({ success: true, user: null });
  }
}

export async function POST(request) {
  try {
    const { uid, email, name } = await request.json();

    if (!uid || !email) {
      return NextResponse.json(
        { success: false, error: "UID and Email are required" },
        { status: 400 }
      );
    }

    // 1. Query Firestore for user by email
    const usersCol = collection(db, "users");
    const q = query(usersCol, where("email", "==", email));
    const querySnapshot = await getDocs(q);

    let userRole = "USER";
    let userName = name || "Customer";
    let docId = null;

    if (!querySnapshot.empty) {
      // User exists (either seeded or registered before)
      const userDoc = querySnapshot.docs[0];
      const userData = userDoc.data();
      userRole = userData.role || "USER";
      userName = userData.name || userName;
      docId = userDoc.id;

      // If uid was not set (seeded user), update it now
      if (!userData.uid) {
        await updateDoc(doc(db, "users", docId), {
          uid: uid,
          name: userName
        });
      }
    } else {
      // Auto-grant SUPER_ADMIN role to admin@dilrucrochet.com
      userRole = email.toLowerCase() === "admin@dilrucrochet.com" ? "SUPER_ADMIN" : "USER";
      docId = uid; // Use UID as the document ID for new users

      await setDoc(doc(db, "users", docId), {
        uid,
        email: email.toLowerCase(),
        name: userName,
        role: userRole,
        createdAt: new Date().toISOString()
      });
    }

    const payload = { uid, email: email.toLowerCase(), role: userRole, name: userName };

    // 2. Sign tokens
    const accessToken = await signAccessToken(payload);
    const refreshToken = await signRefreshToken(payload);

    // 3. Prepare response with cookies
    const response = NextResponse.json({
      success: true,
      user: {
        uid,
        email,
        name: userName,
        role: userRole
      }
    });

    // Set Access Token (15 minutes)
    response.cookies.set("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 900 // 15 mins
    });

    // Set Refresh Token (7 days)
    response.cookies.set("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7 // 7 days
    });

    return response;
  } catch (error) {
    console.error("Session API Error:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
