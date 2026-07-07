import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { verifyAccessToken } from "@/lib/session";
import AdminLayoutClient from "@/components/AdminLayoutClient";

export const dynamic = "force-dynamic";

export default async function AdminLayout({ children }) {
  const cookieStore = await cookies();
  const token = cookieStore.get("accessToken")?.value;
  let user = null;

  if (token) {
    user = await verifyAccessToken(token);
  }

  const ALLOWED_ADMIN_ROLES = ["SUPER_ADMIN", "ADMIN", "EDITOR"];
  if (!user || !ALLOWED_ADMIN_ROLES.includes(user.role)) {
    redirect("/login");
  }

  return (
    <AdminLayoutClient>
      {children}
    </AdminLayoutClient>
  );
}
