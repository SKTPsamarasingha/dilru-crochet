import { db } from "@/lib/firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";

/**
 * API Route: /api/admin/settings
 * GET - Fetch current settings
 * POST - Update settings
 */

export async function GET(request) {
  try {
    const settingsDoc = await getDoc(doc(db, "admin", "settings"));

    if (!settingsDoc.exists()) {
      // Return defaults if not set
      return Response.json({
        showLKRPrices: true,
        allowDeliveryEditing: true,
        showContactMethods: true,
        maintenanceMode: false,
      });
    }

    return Response.json(settingsDoc.data());
  } catch (error) {
    console.error("Settings fetch error:", error);
    return Response.json(
      { error: "Failed to fetch settings" },
      { status: 500 },
    );
  }
}

export async function POST(request) {
  try {
    const body = await request.json();

    // Validate required fields
    if (typeof body.showLKRPrices !== "boolean") {
      return Response.json(
        { error: "showLKRPrices must be a boolean" },
        { status: 400 },
      );
    }

    if (typeof body.allowDeliveryEditing !== "boolean") {
      return Response.json(
        { error: "allowDeliveryEditing must be a boolean" },
        { status: 400 },
      );
    }

    if (typeof body.showContactMethods !== "boolean") {
      return Response.json(
        { error: "showContactMethods must be a boolean" },
        { status: 400 },
      );
    }

    if (typeof body.maintenanceMode !== "boolean") {
      return Response.json(
        { error: "maintenanceMode must be a boolean" },
        { status: 400 },
      );
    }

    // Save to Firestore
    await setDoc(doc(db, "admin", "settings"), {
      showLKRPrices: body.showLKRPrices,
      allowDeliveryEditing: body.allowDeliveryEditing,
      showContactMethods: body.showContactMethods,
      maintenanceMode: body.maintenanceMode,
      updatedAt: new Date().toISOString(),
    });

    return Response.json({
      success: true,
      message: "Settings updated successfully",
    });
  } catch (error) {
    console.error("Settings update error:", error);
    return Response.json(
      { error: "Failed to update settings" },
      { status: 500 },
    );
  }
}
