import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyAccessToken } from "@/lib/session";
import { authorize } from "@/lib/roles";
import cloudinary from "@/lib/cloudinary";

const MAX_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];

/**
 * Upload a buffer to Cloudinary and return the secure URL.
 * Uses upload_stream wrapped in a Promise so it works with Node buffers.
 */
function uploadToCloudinary(buffer, mimeType) {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: "dilru-crochet/products",
        resource_type: "image",
        // Cloudinary will auto-optimise + convert to WebP for delivery
        transformation: [{ quality: "auto", fetch_format: "auto" }],
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      },
    );
    stream.end(buffer);
  });
}

export async function POST(request) {
  try {
    // Auth check – only admins with manage_products permission
    const cookieStore = await cookies();
    const token = cookieStore.get("accessToken")?.value;
    const payload = await verifyAccessToken(token);

    if (!payload || !(await authorize(payload.role, "manage_products"))) {
      return NextResponse.json(
        { success: false, error: "Unauthorized: Product management permission required" },
        { status: 403 },
      );
    }

    const formData = await request.formData();
    const file = formData.get("file");

    if (!file || typeof file === "string") {
      return NextResponse.json(
        { success: false, error: "No file provided" },
        { status: 400 },
      );
    }

    // Validate MIME type
    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { success: false, error: "Invalid file type. Only JPEG, PNG, WebP, and GIF are allowed." },
        { status: 400 },
      );
    }

    // Validate size
    const buffer = Buffer.from(await file.arrayBuffer());
    if (buffer.byteLength > MAX_SIZE_BYTES) {
      return NextResponse.json(
        { success: false, error: "File too large. Maximum size is 5 MB." },
        { status: 400 },
      );
    }

    // Upload to Cloudinary
    const result = await uploadToCloudinary(buffer, file.type);

    // result.secure_url is the permanent HTTPS CDN URL stored in Firestore
    return NextResponse.json({ success: true, path: result.secure_url });
  } catch (error) {
    console.error("Upload Error:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 },
    );
  }
}
