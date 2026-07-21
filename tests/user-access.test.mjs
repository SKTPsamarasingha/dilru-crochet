import test from "node:test";
import assert from "node:assert/strict";
import { canManageUserProfile } from "../src/lib/user-access.mjs";

test("allows admins to update their own profile", () => {
  const currentUser = { email: "admin@example.com", role: "ADMIN" };
  const targetUser = {
    email: "admin@example.com",
    role: "ADMIN",
    name: "Admin User",
  };

  assert.equal(canManageUserProfile(currentUser, targetUser, "update"), true);
});

test("blocks deletion of admin profiles even for super admins", () => {
  const currentUser = { email: "super@example.com", role: "SUPER_ADMIN" };
  const targetUser = {
    email: "admin@example.com",
    role: "ADMIN",
    name: "Admin User",
  };

  assert.equal(canManageUserProfile(currentUser, targetUser, "delete"), false);
});

test("allows super admins to delete regular user profiles", () => {
  const currentUser = { email: "super@example.com", role: "SUPER_ADMIN" };
  const targetUser = {
    email: "customer@example.com",
    role: "USER",
    name: "Customer User",
  };

  assert.equal(canManageUserProfile(currentUser, targetUser, "delete"), true);
});
