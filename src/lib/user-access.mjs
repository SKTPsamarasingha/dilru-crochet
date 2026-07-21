export function canManageUserProfile(
  currentUser,
  targetUser,
  action = "update",
) {
  if (!currentUser || !targetUser) return false;

  const isSelf =
    currentUser.email &&
    targetUser.email &&
    currentUser.email === targetUser.email;
  const isSuperAdmin = currentUser.role === "SUPER_ADMIN";
  const isTargetAdminLike = ["ADMIN", "SUPER_ADMIN", "EDITOR"].includes(
    targetUser.role,
  );

  if (action === "delete") {
    if (!isSuperAdmin) return false;
    return !isTargetAdminLike;
  }

  if (isSuperAdmin) {
    return true;
  }

  return isSelf;
}
