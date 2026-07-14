import Link from "next/link";
import { Heart, MessageCircle, Mail } from "lucide-react";
import { CONTACT_CONFIG } from "@/lib/config";

export default function Footer() {
  return (
    <footer className="relative overflow-hidden bg-gradient-to-br from-[#241d1a] via-[#2c2523] to-[#3a2d28] text-[#FDFBF7] shadow-[inset_0_24px_80px_-40px_rgba(0,0,0,0.45)]">
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_top_left,_rgba(224,169,150,0.12),_transparent_22%),radial-gradient(circle_at_bottom_right,_rgba(255,255,255,0.08),_transparent_20%)]" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-14 sm:py-16">
        <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-[1.2fr_0.8fr_0.8fr_0.9fr]">
          <div className="space-y-5">
            <div className="flex items-center gap-3">
              <Heart className="h-7 w-7 text-[#E0A996]" fill="#E0A996" />
              <span className="text-4xl font-extrabold tracking-tight text-[#FDFBF7] sm:text-5xl font-serif drop-shadow-[0_20px_35px_rgba(224,169,150,0.35)]">
                Crochet with Dilru
              </span>
            </div>
            <p className="max-w-md text-sm leading-relaxed text-[#d7c5bb]">
              Handcrafted crochet apparel, accessories, and floral keepsakes
              made to order with care, comfort, and a personal finish.
            </p>
            <div className="flex flex-wrap gap-2 text-xs font-semibold text-[#FDFBF7]">
              <span className="rounded-full border border-[#4A3728] px-3 py-1">
                Made to order
              </span>
              <span className="rounded-full border border-[#4A3728] px-3 py-1">
                Premium yarns
              </span>
              <span className="rounded-full border border-[#4A3728] px-3 py-1">
                Island delivery
              </span>
            </div>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-semibold uppercase tracking-[0.32em] text-[#E0A996] font-serif">
              Shop
            </h4>
            <ul className="space-y-2 text-sm text-[#d7c5bb]">
              <li>
                <Link
                  href="/shop"
                  className="transition-colors hover:text-white"
                >
                  Apparel
                </Link>
              </li>
              <li>
                <Link
                  href="/shop"
                  className="transition-colors hover:text-white"
                >
                  Decor & bouquets
                </Link>
              </li>
              <li>
                <Link
                  href="/shop"
                  className="transition-colors hover:text-white"
                >
                  Accessories
                </Link>
              </li>
              <li>
                <Link
                  href="/shop"
                  className="transition-colors hover:text-white"
                >
                  Custom orders
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-semibold uppercase tracking-[0.32em] text-[#E0A996] font-serif">
              Helpful info
            </h4>
            <ul className="space-y-2 text-sm text-[#d7c5bb]">
              <li>
                <a
                  href="#how-it-works"
                  className="transition-colors hover:text-white"
                >
                  Ordering process
                </a>
              </li>
              <li>
                <a href="#about" className="transition-colors hover:text-white">
                  Materials & care
                </a>
              </li>
              <li>
                <a
                  href="#community"
                  className="transition-colors hover:text-white"
                >
                  Community stories
                </a>
              </li>
            </ul>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-4 sm:p-5 shadow-[0_20px_60px_-30px_rgba(224,169,150,0.65)] backdrop-blur-xl">
            <h4 className="mb-4 text-sm font-semibold uppercase tracking-[0.32em] text-[#E0A996] font-serif">
              Contact us
            </h4>
            <p className="mb-4 text-sm leading-relaxed text-[#d7c5bb]">
              Reach out for bespoke designs, corporate gifting, or special
              occasion pieces.
            </p>
            <div className="flex flex-wrap gap-2">
           
              {CONTACT_CONFIG.facebook.enabled && (
                <a
                  href={CONTACT_CONFIG.facebook.getMessengerLink()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-[#4A3728] text-[#FDFBF7] transition-colors hover:bg-[#E0A996] hover:text-[#2C2523]"
                  aria-label="Messenger"
                >
                  <MessageCircle className="h-4 w-4" />
                </a>
              )}
              {CONTACT_CONFIG.email.enabled && (
                <a
                  href={`mailto:${CONTACT_CONFIG.facebook}`}
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-[#4A3728] text-[#FDFBF7] transition-colors hover:bg-[#E0A996] hover:text-[#2C2523]"
                  aria-label="Facebook"
                >
                  <FacebookIcon className="h-4 w-4" />
                </a>
              )}
              {CONTACT_CONFIG.instagram.enabled && (
                <a
                  href={CONTACT_CONFIG.instagram.profileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-[#4A3728] text-[#FDFBF7] transition-colors hover:bg-[#E0A996] hover:text-[#2C2523]"
                  aria-label="Instagram"
                >
                  <InstagramIcon className="h-4 w-4" />
                </a>
              )}
            </div>
          </div>
        </div>

        <div className="mt-10 border-t border-white/10 pt-6 text-sm text-[#c4b8ae] md:flex md:items-center md:justify-between">
          <p>
            © {new Date().getFullYear()} Crochet with Dilru. Crafted by hand for
            everyday luxury.
          </p>
          <p>Open for custom orders and boutique collaborations.</p>
        </div>
      </div>
    </footer>
  );
}
function FacebookIcon({ className = "w-5 h-5" }) {
  return (
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
}

function InstagramIcon({ className = "w-5 h-5" }) {
  return (
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
}