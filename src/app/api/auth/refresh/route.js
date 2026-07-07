import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyRefreshToken, signAccessToken, signRefreshToken } from "@/lib/session";
import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";

export async function POST() {
  try {
    const cookieStore = await cookies();
    const refreshToken = cookieStore.get("refreshToken")?.value;

    if (!refreshToken) {
      return NextResponse.json(
        { success: false, error: "Refresh token missing" },
        { status: 401 }
      );
    }

    const payload = await verifyRefreshToken(refreshToken);
    if (!payload) {
      return NextResponse.json(
        { success: false, error: "Invalid refresh token" },
        { status: 401 }
      );
    }

    // Query Firestore to ensure role and user information is up-to-date and user exists
    const userDocRef = doc(db, "users", payload.uid);
    const userSnap = await getDoc(userDocRef);
    let role = payload.role;
    let name = payload.name;
    
    if (userSnap.exists()) {
      const userData = userSnap.data();
      role = userData.role || "USER";
      name = userData.name || name;
    }

    const newPayload = {
      uid: payload.uid,
      email: payload.email,
      role,
      name
    };

    // Sign new access and refresh tokens (sliding session)
    const newAccessToken = await signAccessToken(newPayload);
    const newRefreshToken = await signRefreshToken(newPayload);

    const response = NextResponse.json({
      success: true,
      user: newPayload
    });

    response.cookies.set("accessToken", newAccessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 900 // 15 mins
    });

    response.cookies.set("refreshToken", newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7 // 7 days
    });

    return response;
  } catch (error) {
    console.error("Refresh Token API Error:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
