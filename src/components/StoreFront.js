"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { CONTACT_CONFIG, CURRENCY_CONFIG, DELIVERY_CONFIG } from "@/lib/config";
import { useFeatureSettings } from "@/lib/useFeatureSettings";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  PriceDisplay,
  PriceBadge,
  CheckoutSummary,
} from "@/components/PriceDisplay";
import {
  ShoppingBag,
  Heart,
  X,
  Plus,
  Minus,
  Trash2,
  CheckCircle,
  Truck,
  Scissors,
  MessageCircle,
  Mail,
  ExternalLink,
  Info,
  Loader2,
  Sparkles,
  ShoppingBag as CartIcon,
} from "lucide-react";

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

const YARN_COLORS = [
  { name: "Original", hex: "#E8D5C4" },
  { name: "Sage Green", hex: "#96A288" },
  { name: "Soft Rose", hex: "#E4A0A0" },
  { name: "Cream White", hex: "#F5F0E8" },
  { name: "Cocoa Brown", hex: "#8B6914" },
];

const SIZES = ["S", "M", "L"];
export default function StoreFront({ initialProducts }) {
  const router = useRouter();
  const { user, signOut, fetchOrders, isAdmin } = useAuth();
  const { settings, loading } = useFeatureSettings();
  const [products, setProducts] = useState(initialProducts);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [customYarnColor, setCustomYarnColor] = useState("Original");
  const [customSize, setCustomSize] = useState("M");
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const cards = document.querySelectorAll(".how-card");
    if (!cards.length) return;

    const observer = new IntersectionObserver(
      (entries, observerInstance) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observerInstance.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.2,
      },
    );

    cards.forEach((card) => observer.observe(card));
    return () => observer.disconnect();
  }, []);

  const showLKRPrices = settings?.showLKRPrices ?? true;
  const showContactMethods = settings?.showContactMethods ?? true;
  const allowDeliveryEditing = settings?.allowDeliveryEditing ?? true;
  const maintenanceMode = settings?.maintenanceMode ?? false;

  if (maintenanceMode) {
    return (
      <div className="min-h-screen bg-[#FDFBF7] flex items-center justify-center px-4 py-16">
        <div className="max-w-xl rounded-3xl border border-[var(--color-primary)]/30 bg-white p-8 text-center shadow-sm">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[var(--color-primary)]/15 text-[var(--color-primary)]">
            <Sparkles className="h-7 w-7" />
          </div>
          <h1 className="font-serif text-2xl font-bold text-[var(--color-foreground)]">
            We&apos;re updating the boutique
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-[#4A3728]">
            The storefront is currently in maintenance mode while we refresh our
            handmade collection and order experience.
          </p>
          <p className="mt-4 text-xs font-semibold uppercase tracking-[0.24em] text-[#96A288]">
            Please check back soon.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <main
        className="flex-1"
        style={{
          "--color-foreground": "#2c2523",
          "--color-primary": "#e0a996",
        }}
      >
        {/* 2. HERO SECTION */}
        <section className="relative overflow-hidden border-b border-[#F5EFEB] py-16 sm:py-24 bg-[radial-gradient(circle_at_top_left,_rgba(224,169,150,0.16),_transparent_38%),linear-gradient(135deg,_#fdfbf7_0%,_#fcf5ee_100%)]">
          <div className="hero-ornament" />
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-8">
              {/* Left text column */}
              <div className="space-y-6 text-center lg:col-span-7 lg:text-left sm:space-y-8">
                <div className="boutique-badge inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.24em] text-[#96A288] shadow-[0_10px_30px_-24px_rgba(150,162,136,0.7)]">
                  <Sparkles className="h-3.5 w-3.5" />
                  Slow-made crochet, island crafted
                </div>
                <h1 className="text-4xl font-extrabold leading-tight tracking-tight text-[var(--color-foreground)] font-serif sm:text-5xl lg:text-6xl animate-fade-in-up">
                  <span className="block text-glow text-5xl sm:text-6xl lg:text-7xl">
                    Handmade warmth
                  </span>
                  <span className="block text-[var(--color-foreground)] mt-4">
                    made to wear and treasure.
                  </span>
                </h1>
                <p
                  className="mx-auto max-w-2xl text-base leading-relaxed text-[#4A3728] sm:text-lg lg:mx-0 animate-fade-in-up"
                  style={{ animationDelay: "0.2s" }}
                >
                  Discover heirloom-quality crochet cardigans, soft accessories,
                  and floral keepsakes made to order with thoughtful detailing,
                  rich texture, and a deeply personal finish.
                </p>
                <div className="flex flex-col justify-center gap-4 sm:flex-row lg:justify-start">
                  <Link
                    href="/shop"
                    className="rounded-full bg-gradient-to-r from-[var(--color-primary)] via-[#F0B290] to-[#E4A0A0] px-8 py-4 text-center text-sm font-bold text-[var(--color-foreground)] shadow-[0_24px_40px_-22px_rgba(224,169,150,0.65)] transition-all duration-300 hover:scale-[1.01] hover:shadow-[0_28px_45px_-24px_rgba(224,169,150,0.8)]"
                  >
                    Browse Collection
                  </Link>
                  <a
                    href="https://web.facebook.com/p/Crochet-with-dilru-61553942184584/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 rounded-full border border-[var(--color-primary)] bg-white/90 px-8 py-4 text-center text-sm font-bold text-[var(--color-foreground)] shadow-[0_10px_35px_-24px_rgba(224,169,150,0.5)] transition-all duration-300 hover:bg-[var(--color-primary)]/15 hover:shadow-[0_18px_40px_-24px_rgba(224,169,150,0.7)]"
                  >
                    Request Custom Order
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </div>
              </div>
              {/* Right image column */}
              <div className="flex justify-center lg:col-span-5">
                <div className="relative aspect-square w-full max-w-md overflow-hidden rounded-[2rem] border border-[#efe0d5] bg-[#f8efe8] p-2 shadow-[0_30px_70px_-30px_rgba(44,37,35,0.35)] rotate-1 transition-transform duration-500 ease-out hover:rotate-0 sm:rotate-2">
                  <img
                    src="https://scontent.fcmb3-2.fna.fbcdn.net/v/t39.30808-6/738691661_122259637694131406_2569675746571995115_n.jpg?stp=cp6_dst-jpg_tt6&cstp=mx720x960&ctp=s720x960&_nc_cat=104&_nc_map=urlgen_bucketless&ccb=1-7&_nc_sid=833d8c&_nc_eui2=AeF70V3FRtdzXMlWV9D-jRzgX6QidQ85A-1fpCJ1DzkD7Ufn-tJeqyaKTkKYEWIc_zdrqdGTtFGyHP7ELAT9y0Ga&_nc_ohc=hxLtLdwOwSQQ7kNvwHf0BpO&_nc_oc=AdrwK5vTXDImswMuxTQs5rRTw7W1tDmH9sIKM5G2ciCe8xdC9B5x87Udr_jCCC8TGlB7IhQzbOOATH0-he1kC24B&_nc_zt=23&_nc_ht=scontent.fcmb3-2.fna&_nc_gid=KU8TpWurG-1esLjZ6wZglA&_nc_ss=7d2a8&oh=00_AQDg-VUcrzZvT2ALAbcwpfQMSlX9FXt90_xGXmbPulgI0A&oe=6A5BA457"
                    alt="Handmade crochet stitch detail cardigan"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-4 right-4 py-2.5 px-4 bg-white/95 backdrop-blur-sm rounded-2xl shadow-sm text-xs font-bold text-[var(--color-foreground)] border border-[#FBEFEA] flex items-center gap-1.5">
                    <Heart
                      className="w-3.5 h-3.5 text-[var(--color-primary)]"
                      fill="var(--color-primary)"
                    />
                    Stitched by Hand
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 3. HOW IT WORKS */}
        <section
          id="how-it-works"
          className="bg-primary  py-16 bg-[#FDFBF7]/50 border-b border-[#F5EFEB]"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[var(--color-foreground)] font-serif">
                How It Works
              </h2>
              <p className="mt-3 text-[#4A3728] text-sm sm:text-base">
                Getting your custom handcrafted crochet creations is simple and
                personalized.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-12">
              <div className="how-card boutique-card gradient-card subtle-glow flex flex-col items-center rounded-[1.5rem] p-6 text-center hover-lift reveal-card">
                <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--color-primary)]/18 text-[var(--color-primary)] shadow-[0_18px_40px_-28px_rgba(224,169,150,0.55)]">
                  <Sparkles className="w-7 h-7" />
                </div>
                <h3 className="text-lg font-bold text-[var(--color-foreground)] mb-2 font-serif">
                  1. Pick Your Design
                </h3>
                <p className="text-sm text-[#4A3728] leading-relaxed">
                  Browse our artisanal collection of cozy sweaters, flower
                  bouquets, and accessories, selecting your preferred style.
                </p>
              </div>

              <div className="how-card boutique-card gradient-card subtle-glow flex flex-col items-center rounded-[1.5rem] p-6 text-center hover-lift reveal-card">
                <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#96A288]/18 text-[#96A288] shadow-[0_18px_40px_-28px_rgba(150,162,136,0.45)]">
                  <Scissors className="w-7 h-7" />
                </div>
                <h3 className="text-lg font-bold text-[var(--color-foreground)] mb-2 font-serif">
                  2. Customize Details
                </h3>
                <p className="text-sm text-[#4A3728] leading-relaxed">
                  Specify your favorite color combinations, yarn materials, and
                  size requirements to make it uniquely yours.
                </p>
              </div>

              <div className="how-card boutique-card gradient-card subtle-glow flex flex-col items-center rounded-[1.5rem] p-6 text-center hover-lift reveal-card">
                <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#E4A0A0]/18 text-[#E4A0A0] shadow-[0_18px_40px_-28px_rgba(228,160,160,0.45)]">
                  <Truck className="w-7 h-7" />
                </div>
                <h3 className="text-lg font-bold text-[var(--color-foreground)] mb-2 font-serif">
                  3. Handcrafted Delivery
                </h3>
                <p className="text-sm text-[#4A3728] leading-relaxed">
                  We stitch your order complete with custom care, packing it
                  with love, and deliver islandwide to your doorstep.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 4. FEATURED PRODUCTS (teaser) */}
        <section
          id="shop"
          className="py-16 sm:py-24 bg-[linear-gradient(180deg,_rgba(253,251,247,0.95)_0%,_rgba(248,241,235,0.9)_100%)]"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row justify-between items-center mb-12 gap-4 text-center sm:text-left">
              <div>
                <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[var(--color-foreground)] font-serif">
                  Featured Creations
                </h2>
                <p className="mt-2 text-[#4A3728] text-sm">
                  A preview of our handcrafted collection. Visit the shop to
                  browse and filter all items.
                </p>
              </div>
              <Link
                href="/shop"
                className="py-2.5 px-5 rounded-full bg-gradient-to-r from-[var(--color-primary)] via-[#F0B290] to-[#E4A0A0] text-[var(--color-foreground)] font-semibold text-xs transition-transform duration-300 hover:scale-[1.01] shadow-[0_22px_35px_-22px_rgba(224,169,150,0.72)]"
              >
                View Full Shop →
              </Link>
            </div>

            {products.length === 0 ? (
              <div className="text-center py-20 bg-white border border-[#F5EFEB] rounded-3xl">
                <CartIcon className="w-12 h-12 mx-auto text-[#A0958F] mb-4" />
                <h3 className="text-lg font-semibold text-[var(--color-foreground)] font-serif">
                  The catalog is being refreshed
                </h3>
                <p className="text-sm text-[#4A3728] mt-1 mb-4">
                  Seed the sample collection to preview our latest handmade
                  pieces and custom order options.
                </p>
                <button
                  onClick={async () => {
                    const res = await fetch("/api/seed");
                    const data = await res.json();
                    if (data.success) {
                      router.refresh();
                      window.location.reload();
                    }
                  }}
                  className="py-2.5 px-6 bg-[var(--color-primary)] hover:bg-[#CF9581] text-[var(--color-foreground)] font-semibold rounded-full text-sm"
                >
                  Seed Database Items
                </button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                  {products.slice(0, 4).map((product) => (
                    <div
                      key={product.id}
                      className="group boutique-card flex h-full flex-col overflow-hidden rounded-[1.4rem] transition-all duration-300 hover:-translate-y-1"
                    >
                      {/* Image Container with hover zoom */}
                      <div className="relative aspect-[4/5] overflow-hidden bg-[#F5EFEB]">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                        />
                        {product.customizable && (
                          <span className="absolute top-3 left-3 bg-[#96A288] text-white text-xxs font-bold tracking-wide uppercase px-2.5 py-1 rounded-full shadow-sm">
                            Customizable
                          </span>
                        )}
                      </div>

                      <div className="flex flex-grow flex-col justify-between p-5">
                        <div className="space-y-3">
                          <div className="flex items-start justify-between gap-2">
                            <h3 className="font-bold text-[var(--color-foreground)] group-hover:text-[var(--color-primary)] transition-colors leading-tight text-base font-serif">
                              {product.name}
                            </h3>
                            <PriceBadge
                              price={product.price}
                              showLKRPrices={showLKRPrices}
                            />
                          </div>
                        </div>

                        <button
                          onClick={() => {
                            setSelectedProduct(product);
                            setCustomYarnColor("Original");
                            setCustomSize(
                              product.customizable ? "M" : "Standard",
                            );
                            setQuantity(1);
                          }}
                          className="mt-4 w-full py-2.5 px-4 bg-[#F5EFEB] hover:bg-[var(--color-primary)] hover:text-[var(--color-foreground)] text-[var(--color-foreground)] font-semibold rounded-xl transition-all duration-200 text-xs text-center cursor-pointer"
                        >
                          View Details
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {products.length > 4 && (
                  <div className="text-center mt-10">
                    <Link
                      href="/shop"
                      className="inline-flex py-3 px-8 bg-[#F5EFEB] hover:bg-[var(--color-primary)] text-[var(--color-foreground)] font-semibold rounded-full text-sm transition-colors"
                    >
                      See all {products.length} products
                    </Link>
                  </div>
                )}
              </>
            )}
          </div>
        </section>

        {/* 5. ABOUT SECTION */}
        <section
          id="about"
          className="bg-primary border-t border-b border-[#F5EFEB]  py-16 sm:py-24"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="aspect-4/3 overflow-hidden rounded-[2rem] border border-[#efe0d5] bg-[#f8efe8] p-2 shadow-[0_20px_50px_-24px_rgba(44,37,35,0.28)]">
                <img
                  src="https://scontent.fcmb12-1.fna.fbcdn.net/v/t39.30808-6/735317520_122259637172131406_2006573388631911599_n.jpg?stp=cp6_dst-jpg_tt6&cstp=mx720x960&ctp=s720x960&_nc_cat=108&_nc_map=urlgen_bucketless&ccb=1-7&_nc_sid=833d8c&_nc_eui2=AeFiFKvHil9p0FtylHlRJTq5hyHvSL6e83eHIe9Ivp7zdxNQWLvGDOnTKa1DNbiIyuA5styL_8N5TqXdQhNLuWsK&_nc_ohc=QcFw5nrIhWAQ7kNvwGL1JEC&_nc_oc=Adopb5rQrcKa5lkhjdayVKK_5xkX05vqZClsQyknAiLwQPWDO7VuvgNiviiQNdEv6zedn3calpPPVvBmqI04LG9W&_nc_zt=23&_nc_ht=scontent.fcmb12-1.fna&_nc_gid=ZoOhjj9ooIzlz0HSW1mYiA&_nc_ss=7d2a8&oh=00_AQCNdsPKlnAodSAKUHELEYhahVMLqOSiRUeXybTTeII6vw&oe=6A5BA858"
                  alt="Crochet yarn workspace floral"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="space-y-6">
                <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--color-primary)]">
                  <Heart className="w-3.5 h-3.5" fill="var(--color-primary)" />{" "}
                  Our Story
                </div>
                <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[var(--color-foreground)] font-serif">
                  Every Stitch Tells a Story
                </h2>
                <p className="text-[#4A3728] text-sm sm:text-base leading-relaxed">
                  Welcome to <strong>Crochet with Dilru</strong>. What began as
                  a personal hobby of hand-knitting gifts for family blossomed
                  into a boutique small business. We specialize in slow-fashion
                  apparel, sustainable accessories, and everlasting crochet
                  flower bouquets.
                </p>
                <p className="text-[#4A3728] text-sm sm:text-base leading-relaxed">
                  Every item is made to order by hand in Sri Lanka, using
                  premium selected cotton and acrylic blends. We believe in slow
                  crafts, details, and creating items that can be cherished
                  forever.
                </p>
                <div className="pt-4 border-t border-[#EBE5E0] grid grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-2xl font-bold text-[var(--color-foreground)] font-serif">
                      100%
                    </h4>
                    <p className="text-xs text-[#4A3728]">Handcrafted Items</p>
                  </div>
                  <div>
                    <h4 className="text-2xl font-bold text-[var(--color-foreground)] font-serif">
                      No Waste
                    </h4>
                    <p className="text-xs text-[#4A3728]">
                      Made-to-order production
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 6. INSTAGRAM / COMMUNITY SOCIAL PROOF */}
        <section id="community" className="py-16 bg-[#FDFBF7]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <h2 className="text-3xl font-bold tracking-tight text-[var(--color-foreground)] font-serif">
                Made for Our Community
              </h2>
              <p className="mt-2 text-[#4A3728] text-sm">
                Tag{" "}
                <span className="font-semibold text-[var(--color-primary)]">
                  @crochet_with_dilru
                </span>{" "}
                on social media to get featured!
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="relative aspect-square rounded-2xl overflow-hidden border border-[#F5EFEB] group bg-[#FBEFEA] cursor-pointer">
                <img
                  src="https://scontent.fcmb11-3.fna.fbcdn.net/v/t39.30808-6/742102269_122260366910131406_7102549205013734556_n.jpg?stp=dst-jpg_tt6&cstp=mx720x960&ctp=s720x960&_nc_cat=101&_nc_map=urlgen_bucketless&ccb=1-7&_nc_sid=833d8c&_nc_eui2=AeFOaJC9gSA-sPbptUBoNGc_2p6UHbBSHHbanpQdsFIcdvDSVI5vpU3Zx0JaPCDMM72x_s1DKwGn8fYGH71xqbra&_nc_ohc=73dH-GVxvt0Q7kNvwHlcsJK&_nc_oc=AdpJ4vNIa6JWu3zN9TUh6qvfkx2SZCzDxX43eGAALAAOwhIGLGeIkFsnP8B22nN66szifOi46Q9tfQMDZxi7s4ug&_nc_zt=23&_nc_ht=scontent.fcmb11-3.fna&_nc_gid=N9CskCCb68gUM9fq3IcB0A&_nc_ss=7d2a8&oh=00_AQAuXDgrFCt8aldUdLxJxZoCqNv-VEHYB8quLCfc_pDqSg&oe=6A5BB3B4"
                  alt="Customer feature tote bag"
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-[#2C2523]/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-white text-xs font-semibold">
                  <FacebookIcon className="w-5 h-5 mr-1" /> View Post
                </div>
              </div>
              <div className="relative aspect-square rounded-2xl overflow-hidden border border-[#F5EFEB] group bg-[#FBEFEA] cursor-pointer">
                <img
                  src="https://scontent.fcmb11-3.fna.fbcdn.net/v/t39.30808-6/739243585_122259929936131406_8064892688350052236_n.jpg?stp=dst-jpg_tt6&cstp=mx1536x2048&ctp=s1536x2048&_nc_cat=111&_nc_map=urlgen_bucketless&ccb=1-7&_nc_sid=833d8c&_nc_eui2=AeEyDAyVmfa0dqAr0vxp_4QHmLF25ncUc7GYsXbmdxRzsTfiVjV6uKfY_72-i_RgvVDGxody767gDTsHXfoo_Vcl&_nc_ohc=3JHPOcWKo8cQ7kNvwGQEFUf&_nc_oc=AdpcuZLlaGmKXoLWHi41JfFv5A2fm5DhrK-c8exb_gwmBJpDyL9a3d5QBm5xmOXsUoTlBDctXp14_8uK2SNAXuhI&_nc_zt=23&_nc_ht=scontent.fcmb11-3.fna&_nc_gid=CuEfK6LrJq2w99tRs7pV6w&_nc_ss=7d2a8&oh=00_AQC4fC85pF7gyYowJwJXfPr44BVsIMB9TyiwZPaKZ_Ej3w&oe=6A5BA722"
                  alt="Customer feature flowers"
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-[#2C2523]/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-white text-xs font-semibold">
                  <FacebookIcon className="w-5 h-5 mr-1" /> View Post
                </div>
              </div>
              <div className="relative aspect-square rounded-2xl overflow-hidden border border-[#F5EFEB] group bg-[#FBEFEA] cursor-pointer">
                <img
                  src="https://scontent.fcmb11-3.fna.fbcdn.net/v/t39.30808-6/703110888_122254991342131406_3405810202780959783_n.jpg?stp=dst-jpg_tt6&cstp=mx1170x1557&ctp=s1170x1557&_nc_cat=107&_nc_map=urlgen_bucketless&ccb=1-7&_nc_sid=833d8c&_nc_eui2=AeEV84e2uXU9Vig2apDVFWmrChAXUq8pLmIKEBdSrykuYsQvtjKZVNRjlBMVFZjnCcidgFcw58N4pIGdiV2a-tN8&_nc_ohc=6nV81asfWk0Q7kNvwH9pSiZ&_nc_oc=AdpuC5jFvxxeqmwoHddTy6J2nkR3bMJEE6JyiGa5SmUS--2wbKNgR9VInQTdVsN89pHRrnMHMGMPB_EhSc0uHQwB&_nc_zt=23&_nc_ht=scontent.fcmb11-3.fna&_nc_gid=tYFHvT0rV61kowSePfDhDg&_nc_ss=7d2a8&oh=00_AQBrWOAWSUFgehLEvFZHs6TdxRL9w0RMLUBfnE7TB2MoQw&oe=6A5BA617"
                  alt="Customer feature beanie"
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-[#2C2523]/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-white text-xs font-semibold">
                  <FacebookIcon className="w-5 h-5 mr-1" /> View Post
                </div>
              </div>
              <div className="relative aspect-square rounded-2xl overflow-hidden border border-[#F5EFEB] group bg-[#FBEFEA] cursor-pointer">
                <img
                  src="https://scontent.fcmb12-1.fna.fbcdn.net/v/t39.30808-6/735317520_122259637172131406_2006573388631911599_n.jpg?stp=cp6_dst-jpg_tt6&cstp=mx720x960&ctp=s720x960&_nc_cat=108&_nc_map=urlgen_bucketless&ccb=1-7&_nc_sid=833d8c&_nc_eui2=AeFiFKvHil9p0FtylHlRJTq5hyHvSL6e83eHIe9Ivp7zdxNQWLvGDOnTKa1DNbiIyuA5styL_8N5TqXdQhNLuWsK&_nc_ohc=QcFw5nrIhWAQ7kNvwGL1JEC&_nc_oc=Adopb5rQrcKa5lkhjdayVKK_5xkX05vqZClsQyknAiLwQPWDO7VuvgNiviiQNdEv6zedn3calpPPVvBmqI04LG9W&_nc_zt=23&_nc_ht=scontent.fcmb12-1.fna&_nc_gid=RTf33MuVkq73s9Hb-MQ1kg&_nc_ss=7d2a8&oh=00_AQDT-YAnLu2mtFjcQf5AwVUESovsgxNbbC1wpC5_b049Dw&oe=6A5BA858"
                  alt="Customer feature cardigan"
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-[#2C2523]/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-white text-xs font-semibold">
                  <FacebookIcon className="w-5 h-5 mr-1" /> View Post
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />

      {/* 8. DETAIL MODAL */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#2C2523]/50 backdrop-blur-sm">
          <div className="bg-white border border-[#FBEFEA] w-full max-w-2xl rounded-3xl overflow-hidden shadow-xl max-h-[90vh] flex flex-col sm:flex-row relative">
            <button
              onClick={() => setSelectedProduct(null)}
              className="absolute top-4 right-4 p-2 bg-white/90 rounded-full hover:bg-red-50 text-[var(--color-foreground)] hover:text-red-500 transition-colors z-10 cursor-pointer shadow-sm"
              aria-label="Close details"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Product Image */}
            <div className="w-full sm:w-1/2 aspect-square sm:aspect-auto bg-[#F5EFEB] relative h-64 sm:h-auto">
              <img
                src={selectedProduct.image}
                alt={selectedProduct.name}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Product Info / Customizer */}
            <div className="w-full sm:w-1/2 p-6 overflow-y-auto flex flex-col h-auto max-h-[45vh] sm:max-h-none">
              <span className="text-[#96A288] text-xxs font-bold uppercase tracking-wider mb-1 block">
                {selectedProduct.category}
              </span>
              <h3 className="text-2xl font-bold text-[var(--color-foreground)] mb-2 font-serif leading-tight">
                {selectedProduct.name}
              </h3>
              <div className="flex items-center gap-3 mb-4">
                <PriceDisplay
                  price={selectedProduct.price}
                  size="lg"
                  showLKRPrices={showLKRPrices}
                />
                {selectedProduct.customizable && (
                  <span className="text-xxs text-[#96A288] border border-[#96A288] px-2 py-0.5 rounded-full font-bold">
                    Customizable
                  </span>
                )}
              </div>

              <p className="text-xs text-[#4A3728] leading-relaxed mb-6">
                {selectedProduct.description}
              </p>

              {/* Custom options */}
              {selectedProduct.customizable ? (
                <div className="space-y-5 mb-6 border-t border-[#F5EFEB] pt-4">
                  <div>
                    <label className="block text-xxs font-bold text-[var(--color-foreground)] uppercase tracking-wide mb-2">
                      Color
                    </label>
                    <div className="flex flex-wrap items-center gap-3">
                      {YARN_COLORS.map((color) => (
                        <button
                          key={color.name}
                          type="button"
                          title={color.name}
                          aria-label={color.name}
                          onClick={() => setCustomYarnColor(color.name)}
                          className="cursor-pointer"
                        >
                          <span
                            className={`block w-9 h-9 rounded-full border-2 shadow-sm transition-all ${
                              customYarnColor === color.name
                                ? "border-[var(--color-primary)] ring-2 ring-[var(--color-primary)]/30 scale-110"
                                : "border-white ring-1 ring-[#EBE5E0] hover:ring-[#A0958F] hover:scale-105"
                            }`}
                            style={{ backgroundColor: color.hex }}
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xxs font-bold text-[var(--color-foreground)] uppercase tracking-wide mb-2">
                      Size
                    </label>
                    <div className="flex gap-2">
                      {SIZES.map((size) => (
                        <button
                          key={size}
                          type="button"
                          onClick={() => setCustomSize(size)}
                          className={`w-10 h-10 text-xs font-bold border rounded-xl transition-colors cursor-pointer ${
                            customSize === size
                              ? "border-[var(--color-primary)] bg-[var(--color-primary)] text-[var(--color-foreground)]"
                              : "border-[#EBE5E0] bg-[#FDFBF7] text-[#4A3728] hover:border-[#A0958F]"
                          }`}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-xxs text-[#A0958F] font-semibold italic mb-6 border-t border-[#F5EFEB] pt-4 flex items-center gap-1">
                  <Info className="w-3.5 h-3.5" />
                  Standard size. For custom requests, please contact us.
                </div>
              )}

              {/* Quantity & Add button */}
              <div className="mt-auto border-t border-[#F5EFEB] pt-4 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-[var(--color-foreground)]">
                    Quantity
                  </span>
                  <div className="flex items-center gap-3 border border-[#EBE5E0] rounded-xl px-2 py-1 bg-[#FDFBF7]">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="p-1 text-[#4A3728] hover:text-[var(--color-primary)]"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="text-sm font-bold w-4 text-center text-[var(--color-foreground)]">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="p-1 text-[#4A3728] hover:text-[var(--color-primary)]"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <button
                  onClick={() => {
                    window.dispatchEvent(
                      new CustomEvent("add-to-cart", {
                        detail: {
                          product: selectedProduct,
                          qty: quantity,
                          color: customYarnColor,
                          size: customSize,
                        },
                      }),
                    );
                    setSelectedProduct(null); // Close modal
                  }}
                  className="w-full py-3.5 px-6 bg-[var(--color-primary)] hover:bg-[#CF9581] text-[var(--color-foreground)] font-bold rounded-2xl shadow-sm hover:shadow-md transition-all text-xs cursor-pointer flex items-center justify-center gap-2"
                >
                  <ShoppingBag className="w-4 h-4" />
                  Add to Custom Cart
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
