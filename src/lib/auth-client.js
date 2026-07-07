import { auth } from "./firebase";
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut as firebaseSignOut,
  updateProfile
} from "firebase/auth";

/**
 * Register a user via Firebase Auth and establish a secure JWT cookie session.
 */
export async function clientSignUp(email, password, name) {
  // 1. Register user on Firebase Auth
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  const user = userCredential.user;

  // 2. Update Firebase Auth display name profile
  if (name) {
    await updateProfile(user, { displayName: name });
  }

  // 3. Establish backend JWT and Firestore user record
  const res = await fetch("/api/auth/session", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      uid: user.uid,
      email: user.email,
      name: name || user.displayName || "Customer"
    })
  });

  const data = await res.json();
  if (!data.success) {
    throw new Error(data.error || "Session creation failed on server.");
  }

  return data.user;
}

/**
 * Sign in a user via Firebase Auth and establish a secure JWT cookie session.
 */
export async function clientSignIn(email, password) {
  // 1. Sign in via Firebase Auth
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  const user = userCredential.user;

  // 2. Fetch/create backend JWT and fetch Firestore role mapping
  const res = await fetch("/api/auth/session", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      uid: user.uid,
      email: user.email,
      name: user.displayName || "Customer"
    })
  });

  const data = await res.json();
  if (!data.success) {
    throw new Error(data.error || "Session validation failed on server.");
  }

  return data.user;
}

/**
 * Clear client and server session cookies and sign out of Firebase Auth.
 */
export async function clientSignOut() {
  try {
    // 1. Sign out on Firebase Client
    await firebaseSignOut(auth);
  } catch (err) {
    console.warn("Firebase Auth signout warn:", err);
  }

  // 2. Delete cookies server-side
  const res = await fetch("/api/auth/logout", {
    method: "POST"
  });

  const data = await res.json();
  return data.success;
}
