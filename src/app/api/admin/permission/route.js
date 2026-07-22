import { db } from "@/lib/firebase"; // Adjust path to your firebase config
import { doc, getDoc } from "firebase/firestore";

export async function GET(request) {
  try {
    // Fetches strictly the rolePermissions document
    const permDoc = await getDoc(doc(db, "settings", "rolePermissions"));

    if (!permDoc.exists()) {
      return Response.json(
        { error: "Permissions not configured" },
        { status: 404 },
      );
    }
    console.log(permDoc.data());

    // Sends back the ADMIN, EDITOR, and SUPER_ADMIN arrays directly
    return Response.json(permDoc.data());
  } catch (error) {
    console.error("Permission fetch error:", error);
    return Response.json(
      { error: "Failed to fetch permissions" },
      { status: 500 },
    );
  }
}
