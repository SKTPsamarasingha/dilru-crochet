import { NextResponse } from "next/server";

export async function POST() {
  const response = NextResponse.json({
    success: true,
    message: "Logged out successfully"
  });

  // Clear session cookies by deleting them
  response.cookies.set("accessToken", "", { path: "/", maxAge: 0 });
  response.cookies.set("refreshToken", "", { path: "/", maxAge: 0 });

  return response;
}
