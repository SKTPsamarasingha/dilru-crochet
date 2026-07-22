import { NextResponse } from "next/server";
import { verifyAccessToken, verifyRefreshToken, signAccessToken } from "@/lib/session";



export async function proxy(request) {
  const { pathname } = request.nextUrl;

  // Protect customer order history
  if (pathname.startsWith("/my-orders")) {
    const accessToken = request.cookies.get("accessToken")?.value;

    if (accessToken) {
      const payload = await verifyAccessToken(accessToken);
      if (payload) {
        return NextResponse.next();
      }
    }

    const refreshToken = request.cookies.get("refreshToken")?.value;
    if (refreshToken) {
      const payload = await verifyRefreshToken(refreshToken);
      if (payload) {
        const newAccessToken = await signAccessToken({
          uid: payload.uid,
          email: payload.email,
          role: payload.role,
          name: payload.name,
        });

        const response = NextResponse.next();
        response.cookies.set("accessToken", newAccessToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          path: "/",
          maxAge: 900,
        });
        return response;
      }
    }

    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Intercept and protect all /admin routes
  if (pathname.startsWith("/admin")) {
    const accessToken = request.cookies.get("accessToken")?.value;

    if (accessToken) {
      const payload = await verifyAccessToken(accessToken);
      if (payload && payload.role !== "USER") {
        return NextResponse.next();
      }
    }

    // Access token is missing or expired, attempt validation using the refresh token
    const refreshToken = request.cookies.get("refreshToken")?.value;
    if (refreshToken) {
      const payload = await verifyRefreshToken(refreshToken);
      
      if (payload && payload.role !== "USER") {
        const newPayload = {
          uid: payload.uid,
          email: payload.email,
          role: payload.role,
          name: payload.name
        };
        
        // Generate a new short-lived access token
        const newAccessToken = await signAccessToken(newPayload);

        // Proceed to admin route and write new access token cookie
        const response = NextResponse.next();
        response.cookies.set("accessToken", newAccessToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          path: "/",
          maxAge: 900 // 15 mins
        });
        return response;
      }
    }

    // If both tokens are invalid or role is not authorized, redirect to login
    const loginUrl = new URL("/admin-login", request.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

// Apply proxy to admin and customer order routes
export const config = {
  matcher: ["/admin/:path*", "/my-orders"],
};
