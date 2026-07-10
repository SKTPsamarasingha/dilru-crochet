"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { Heart, Mail, Lock, User, AlertCircle, Loader2 } from "lucide-react";

export default function SignupPage() {
  const router = useRouter();
  const { signUp } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      await signUp(email.trim(), password, name.trim());
      // Successful registration: redirect home
      router.push("/");
      router.refresh();
    } catch (err) {
      console.error("Sign up failed:", err);
      if (
        err.code === "auth/email-already-in-use" ||
        err.message.includes("in-use")
      ) {
        setError("This email is already registered. Try logging in.");
      } else if (err.code === "auth/invalid-email") {
        setError("Please enter a valid email address.");
      } else {
        setError(err.message || "An error occurred during registration.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 bg-[#FDFBF7]">
      <Link
        href="/"
        className="absolute top-8 left-8 flex items-center gap-2 text-sm font-semibold text-[#4A3728] hover:text-[#E0A996] transition-colors"
      >
        ← Back to Store
      </Link>

      <div className="w-full max-w-md p-8 bg-white border border-[#F5EFEB] rounded-3xl shadow-sm">
        <div className="flex flex-col items-center mb-8 text-center">
          <div className="flex items-center justify-center w-12 h-12 mb-3 rounded-full bg-[#F5EFEB]">
            <Heart className="w-6 h-6 text-[#E0A996]" fill="#E0A996" />
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-[#2C2523] font-serif">
            Create Account
          </h2>
          <p className="mt-2 text-sm text-[#4A3728] font-sans">
            Join the Crochet with Dilru family for customized handmade orders.
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
              htmlFor="name"
              className="block text-sm font-medium text-[#2C2523] mb-1.5"
            >
              Full Name
            </label>
            <div className="relative">
              <input
                id="name"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Maya Fernando"
                className="w-full pl-10 pr-4 py-3 bg-[#FDFBF7] border border-[#EBE5E0] text-[#2C2523] placeholder-[#A0958F] rounded-2xl focus:outline-none focus:border-[#E0A996] focus:ring-1 focus:ring-[#E0A996] transition-all text-sm"
              />
              <User className="absolute left-3.5 top-3.5 w-4 h-4 text-[#A0958F]" />
            </div>
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-[#2C2523] mb-1.5"
            >
              Email Address
            </label>
            <div className="relative">
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g. maya@coastalcrochet.com"
                className="w-full pl-10 pr-4 py-3 bg-[#FDFBF7] border border-[#EBE5E0] text-[#2C2523] placeholder-[#A0958F] rounded-2xl focus:outline-none focus:border-[#E0A996] focus:ring-1 focus:ring-[#E0A996] transition-all text-sm"
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
                placeholder="At least 6 characters"
                className="w-full pl-10 pr-4 py-3 bg-[#FDFBF7] border border-[#EBE5E0] text-[#2C2523] placeholder-[#A0958F] rounded-2xl focus:outline-none focus:border-[#E0A996] focus:ring-1 focus:ring-[#E0A996] transition-all text-sm"
              />
              <Lock className="absolute left-3.5 top-3.5 w-4 h-4 text-[#A0958F]" />
            </div>
          </div>

          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium text-[#2C2523] mb-1.5"
            >
              Confirm Password
            </label>
            <div className="relative">
              <input
                id="confirmPassword"
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter password"
                className="w-full pl-10 pr-4 py-3 bg-[#FDFBF7] border border-[#EBE5E0] text-[#2C2523] placeholder-[#A0958F] rounded-2xl focus:outline-none focus:border-[#E0A996] focus:ring-1 focus:ring-[#E0A996] transition-all text-sm"
              />
              <Lock className="absolute left-3.5 top-3.5 w-4 h-4 text-[#A0958F]" />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="flex items-center justify-center w-full py-3.5 px-4 bg-[#E0A996] text-[#2C2523] font-semibold rounded-2xl hover:bg-[#CF9581] active:transform active:scale-[0.98] transition-all duration-200 cursor-pointer disabled:opacity-75 disabled:cursor-not-allowed text-sm shadow-sm"
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin text-[#2C2523]" />
            ) : (
              "Sign Up"
            )}
          </button>
        </form>

        <div className="mt-8 text-center text-sm text-[#4A3728]">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-semibold text-[#E0A996] hover:text-[#CF9581] underline decoration-2 underline-offset-4"
          >
            Log in here
          </Link>
        </div>
      </div>
    </div>
  );
}
