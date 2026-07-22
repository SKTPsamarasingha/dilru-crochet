"use client";

import { useState, Suspense } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Shield, Mail, Lock, AlertCircle, Loader2 } from "lucide-react";

function AdminLoginForm() {
  const router = useRouter();
  const { signIn, signOut } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const user = await signIn(email.trim(), password);
      // Wait, we need to check if they have admin access, 
      // but for now we check against ADMIN_ROLES or custom roles.
      // We will update this later when dynamic roles are fully in place.
      if (user.role === "USER") {
        await signOut();
        setError("Access Denied: You do not have admin privileges.");
      } else {
        router.push("/admin");
        router.refresh();
      }
    } catch (err) {
      console.error("Sign in failed:", err);
      if (
        err.code === "auth/invalid-credential" ||
        err.message?.includes("credential")
      ) {
        setError("Invalid email or password. Please try again.");
      } else if (err.code === "auth/user-not-found") {
        setError("No account found with this email.");
      } else if (err.code === "auth/wrong-password") {
        setError("Incorrect password.");
      } else {
        setError(err.message || "Login failed. Please check your credentials.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md p-8 bg-white border border-[#EBE5E0] rounded-3xl shadow-sm">
      <div className="flex flex-col items-center mb-8 text-center">
        <div className="flex items-center justify-center w-12 h-12 mb-3 rounded-full bg-[#EBE5E0]">
          <Shield className="w-6 h-6 text-[#2C2523]" />
        </div>
        <h2 className="text-3xl font-bold tracking-tight text-[#2C2523] font-serif">
          Admin Portal
        </h2>
        <p className="mt-2 text-sm text-[#4A3728] font-sans">
          Log in to access the Dilru Crochet dashboard.
        </p>
      </div>

      {error && (
        <div className="flex items-center gap-3 p-4 mb-6 text-sm text-red-700 bg-red-50 border border-red-100 rounded-2xl">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-[#2C2523] mb-1.5"
          >
            Admin Email
          </label>
          <div className="relative">
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@dilrucrochet.com"
              className="w-full pl-10 pr-4 py-3 bg-[#FDFBF7] border border-[#EBE5E0] text-[#2C2523] placeholder-[#A0958F] rounded-2xl focus:outline-none focus:border-[#2C2523] focus:ring-1 focus:ring-[#2C2523] transition-all text-sm"
            />
            <Mail className="absolute left-3.5 top-3.5 w-4 h-4 text-[#A0958F]" />
          </div>
        </div>

        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium text-[#2C2523] mb-1.5"
          >
            Password
          </label>
          <div className="relative">
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full pl-10 pr-4 py-3 bg-[#FDFBF7] border border-[#EBE5E0] text-[#2C2523] placeholder-[#A0958F] rounded-2xl focus:outline-none focus:border-[#2C2523] focus:ring-1 focus:ring-[#2C2523] transition-all text-sm"
            />
            <Lock className="absolute left-3.5 top-3.5 w-4 h-4 text-[#A0958F]" />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="flex items-center justify-center w-full py-3.5 px-4 bg-[#2C2523] text-white font-semibold rounded-2xl hover:bg-[#1A1615] active:transform active:scale-[0.98] transition-all duration-200 cursor-pointer disabled:opacity-75 disabled:cursor-not-allowed text-sm shadow-sm"
        >
          {loading ? (
            <Loader2 className="w-5 h-5 animate-spin text-white" />
          ) : (
            "Login to Dashboard"
          )}
        </button>
      </form>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 bg-[#FDFBF7]">
      <Suspense
        fallback={
          <div className="flex items-center justify-center min-h-[300px]">
            <Loader2 className="w-8 h-8 animate-spin text-[#2C2523]" />
          </div>
        }
      >
        <AdminLoginForm />
      </Suspense>
    </div>
  );
}
