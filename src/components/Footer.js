"use client";

import { useState } from "react";
import Link from "next/link";
import { Heart, MessageCircle, Mail, Send, Sparkles } from "lucide-react";
import { CONTACT_CONFIG } from "@/lib/config";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail("");
      setTimeout(() => setSubscribed(false), 5000);
    }
  };

  const FacebookIcon = ({ className = "w-5 h-5" }) => (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  );

  const InstagramIcon = ({ className = "w-5 h-5" }) => (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3" y="3" width="18" height="18" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.5" y2="6.5" />
    </svg>
  );

  return (
    <footer className="relative overflow-hidden bg-gradient-to-b from-[#FFFDFB] to-beige text-foreground border-t border-beige/60">
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_top_left,_rgba(216,167,177,0.08),_transparent_30%),radial-gradient(circle_at_bottom_right,_rgba(168,195,160,0.06),_transparent_35%)]" />
      
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-[1.3fr_0.8fr_0.8fr_1.1fr]">
          {/* Brand Col */}
          <div className="space-y-6">
            <div className="flex items-center gap-2.5">
              <Heart className="h-6 w-6 text-primary" fill="currentColor" />
              <span className="text-2xl font-bold tracking-tight text-foreground font-serif">
                Crochet with Dilru
              </span>
            </div>
            <p className="max-w-sm text-sm leading-relaxed text-espresso-light/85">
              Handcrafted crochet apparel, accessories, and floral keepsakes made to order with patience, premium yarns, and a deeply personal touch.
            </p>
            <div className="flex flex-wrap gap-2 text-xxs font-extrabold uppercase tracking-wider text-espresso-light">
              <span className="rounded-full bg-background border border-primary/20 px-3.5 py-1.5 shadow-sm">
                Made to order
              </span>
              <span className="rounded-full bg-background border border-primary/20 px-3.5 py-1.5 shadow-sm">
                Premium cotton
              </span>
              <span className="rounded-full bg-background border border-primary/20 px-3.5 py-1.5 shadow-sm">
                Sri Lanka Shipping
              </span>
            </div>
          </div>

          {/* Shop links */}
          <div>
            <h4 className="mb-5 text-xs font-bold uppercase tracking-[0.2em] text-primary font-serif">
              Shop Collection
            </h4>
            <ul className="space-y-3.5 text-sm font-medium text-espresso-light">
              <li>
                <Link href="/shop" className="transition-colors hover:text-primary">
                  Cozy Apparel
                </Link>
              </li>
              <li>
                <Link href="/shop" className="transition-colors hover:text-primary">
                  Home Decor & Bouquets
                </Link>
              </li>
              <li>
                <Link href="/shop" className="transition-colors hover:text-primary">
                  Wearable Accessories
                </Link>
              </li>
              <li>
                <Link href="/shop" className="transition-colors hover:text-primary">
                  Bespoke Orders
                </Link>
              </li>
            </ul>
          </div>

          {/* Help Links */}
          <div>
            <h4 className="mb-5 text-xs font-bold uppercase tracking-[0.2em] text-primary font-serif">
              Artisanal Guide
            </h4>
            <ul className="space-y-3.5 text-sm font-medium text-espresso-light">
              <li>
                <a href="/#how-it-works" className="transition-colors hover:text-primary">
                  How It Works
                </a>
              </li>
              <li>
                <a href="/#about" className="transition-colors hover:text-primary">
                  Materials & Care
                </a>
              </li>
              <li>
                <a href="/#community" className="transition-colors hover:text-primary">
                  Community Gallery
                </a>
              </li>
              <li>
                <Link href="/return-policy" className="transition-colors hover:text-primary">
                  Boutique Returns
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter / Contact */}
          <div className="space-y-6">
            <div>
              <h4 className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-primary font-serif">
                Join our newsletter
              </h4>
              <p className="text-xs text-espresso-light/85 leading-relaxed mb-4">
                Subscribe to receive seasonal releases, care tutorials, and custom order openings.
              </p>

              {subscribed ? (
                <div className="p-3.5 bg-accent/15 text-foreground rounded-2xl border border-accent/20 flex items-center gap-2 text-xs font-semibold">
                  <Sparkles className="w-4 h-4 text-accent animate-spin" />
                  <span>Thank you! Stitched to our newsletter.</span>
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="relative flex max-w-sm">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter email address"
                    className="w-full px-4 py-3 bg-background border border-beige text-xs text-foreground placeholder-espresso-light/50 rounded-2xl focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all"
                  />
                  <button
                    type="submit"
                    className="absolute right-1.5 top-1.5 p-2 bg-primary hover:bg-primary-hover text-foreground rounded-xl transition-all cursor-pointer hover:scale-102 active:scale-98"
                    aria-label="Subscribe"
                  >
                    <Send className="w-3.5 h-3.5 text-foreground" />
                  </button>
                </form>
              )}
            </div>

            <div className="pt-2">
              <h5 className="mb-3 text-xxs font-extrabold uppercase tracking-wider text-espresso-light">
                Connect with Dilru
              </h5>
              <div className="flex gap-2.5">
                {CONTACT_CONFIG.facebook.enabled && (
                  <a
                    href={CONTACT_CONFIG.facebook.getMessengerLink()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-background border border-beige text-espresso-light transition-all duration-300 hover:bg-primary hover:text-foreground hover:scale-105"
                    aria-label="Messenger"
                  >
                    <MessageCircle className="h-4.5 w-4.5" />
                  </a>
                )}
                {CONTACT_CONFIG.facebook.enabled && (
                  <a
                    href={CONTACT_CONFIG.facebook.profileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-background border border-beige text-espresso-light transition-all duration-300 hover:bg-primary hover:text-foreground hover:scale-105"
                    aria-label="Facebook"
                  >
                    <FacebookIcon className="h-4.5 w-4.5" />
                  </a>
                )}
                {CONTACT_CONFIG.instagram.enabled && (
                  <a
                    href={CONTACT_CONFIG.instagram.profileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-background border border-beige text-espresso-light transition-all duration-300 hover:bg-primary hover:text-foreground hover:scale-105"
                    aria-label="Instagram"
                  >
                    <InstagramIcon className="h-4.5 w-4.5" />
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Footer bottom */}
        <div className="mt-14 pt-8 border-t border-beige/60 text-xs text-espresso-light/75 md:flex md:items-center md:justify-between space-y-4 md:space-y-0">
          <p>
            © {new Date().getFullYear()} Crochet with Dilru. Made with patience, care, and love. All rights reserved.
          </p>
          <div className="flex gap-6">
            <Link href="/return-policy" className="hover:text-primary transition-colors">
              Return Policy
            </Link>
            <a href="https://web.facebook.com/p/Crochet-with-dilru-61553942184584/" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors inline-flex items-center gap-0.5">
              Request Custom Quote
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
