"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  motion,
  useScroll,
  useTransform,
  AnimatePresence,
} from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import { CONTACT_CONFIG } from "@/lib/config";
import { useFeatureSettings } from "@/lib/useFeatureSettings";
import { PriceDisplay, PriceBadge } from "@/components/PriceDisplay";
import {
  ShoppingBag,
  Heart,
  X,
  Plus,
  Minus,
  Trash2,
  CheckCircle,
  Info,
  Loader2,
  Sparkles,
  ArrowRight,
  Eye,
} from "lucide-react";

// ─── Image constants ─────────────────────────────────────────────────────────
const IMG_HERO = "/hero.jpg";

const IMG_COMMUNITY ="/kit.png"
const IMG_CARDIGAN ="/t.png"
const IMG_TOTE ="/bag.png"
const IMG_FLOWERS ="/flowers.png"
const IMG_BEANIE ="/hat.png"

// ─── Customization options ───────────────────────────────────────────────────
const YARN_COLORS = [
  { name: "Original", hex: "#E8D5C4" },
  { name: "Sage Green", hex: "#96A288" },
  { name: "Soft Rose", hex: "#E4A0A0" },
  { name: "Cream White", hex: "#F5F0E8" },
  { name: "Cocoa Brown", hex: "#8B6914" },
];
const SIZES = ["S", "M", "L"];

// ─── Marquee trust pills ─────────────────────────────────────────────────────
const MARQUEE_ITEMS = [
  "✦ Handmade in Sri Lanka",
  "✦ Made to Order",
  "✦ Premium Yarn",
  "✦ Custom Sizes",
  "✦ Islandwide Delivery",
  "✦ 100% Handcrafted",
  "✦ Slow Fashion",
  "✦ Made with Love",
  "✦ Handmade in Sri Lanka",
  "✦ Made to Order",
  "✦ Premium Yarn",
  "✦ Custom Sizes",
  "✦ Islandwide Delivery",
  "✦ 100% Handcrafted",
];

// ─── Process steps ───────────────────────────────────────────────────────────
const PROCESS = [
  {
    n: "01",
    title: "Browse",
    body: "Explore our curated boutique — cardigans, florals, accessories and more.",
    color: "#D8A7B1",
  },
  {
    n: "02",
    title: "Customize",
    body: "Choose your yarn color, size, and any personal details to make it yours.",
    color: "#A8C3A0",
  },
  {
    n: "03",
    title: "We Craft",
    body: "Every stitch is placed by hand with premium yarn and years of artisan skill.",
    color: "#D8A7B1",
  },
  {
    n: "04",
    title: "Delivered",
    body: "Wrapped with care and shipped to your door, islandwide.",
    color: "#A8C3A0",
  },
];

// ─── Fade-up animation variant ───────────────────────────────────────────────
const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, delay: i * 0.1, ease: "easeOut" },
  }),
};

// ─── Main Component ───────────────────────────────────────────────────────────
export default function StoreFront({ initialProducts }) {
  const router = useRouter();
  const { user, fetchOrders } = useAuth();
  const { settings } = useFeatureSettings();

  const [products, setProducts] = useState(initialProducts);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [customYarnColor, setCustomYarnColor] = useState("Original");
  const [customSize, setCustomSize] = useState("M");
  const [quantity, setQuantity] = useState(1);
  const [wishlist, setWishlist] = useState([]);
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [checkoutSuccess, setCheckoutSuccess] = useState(false);
  const [latestOrderId, setLatestOrderId] = useState("");

  const showLKRPrices = settings?.showLKRPrices ?? true;
  const maintenanceMode = settings?.maintenanceMode ?? false;

  // Parallax on hero
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "25%"]);

  // Sync cart from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem("dilru_cart");
      if (saved) setCart(JSON.parse(saved));
    } catch {}

    const onSync = () => {
      try {
        const saved = localStorage.getItem("dilru_cart");
        if (saved) setCart(JSON.parse(saved));
      } catch {}
    };
    const onAdd = (e) => {
      const { product, qty, color, size } = e.detail;
      setCart((prev) => {
        const id = `${product.id}-${color}-${size}`;
        const exists = prev.findIndex((i) => i.cartItemId === id);
        let next = [...prev];
        if (exists > -1) next[exists].quantity += qty;
        else
          next.push({
            cartItemId: id,
            productId: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            customizable: product.customizable,
            yarnColor: color,
            size,
            quantity: qty,
          });
        localStorage.setItem("dilru_cart", JSON.stringify(next));
        window.dispatchEvent(new Event("sync-cart"));
        return next;
      });
      setIsCartOpen(true);
    };
    const onOpenCart = () => setIsCartOpen(true);

    window.addEventListener("sync-cart", onSync);
    window.addEventListener("add-to-cart", onAdd);
    window.addEventListener("open-cart", onOpenCart);
    return () => {
      window.removeEventListener("sync-cart", onSync);
      window.removeEventListener("add-to-cart", onAdd);
      window.removeEventListener("open-cart", onOpenCart);
    };
  }, []);

  const saveCart = (newCart) => {
    setCart(newCart);
    localStorage.setItem("dilru_cart", JSON.stringify(newCart));
    window.dispatchEvent(new Event("sync-cart"));
  };

  const toggleWishlist = (productId, e) => {
    e.stopPropagation();
    e.preventDefault();
    setWishlist((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId],
    );
  };

  const openProduct = (product) => {
    setSelectedProduct(product);
    setCustomYarnColor("Original");
    setCustomSize(product.customizable ? "M" : "Standard");
    setQuantity(1);
  };

  const addToCartFromModal = () => {
    if (!selectedProduct) return;
    const id = `${selectedProduct.id}-${customYarnColor}-${customSize}`;
    const exists = cart.findIndex((i) => i.cartItemId === id);
    let next = [...cart];
    if (exists > -1) next[exists].quantity += quantity;
    else
      next.push({
        cartItemId: id,
        productId: selectedProduct.id,
        name: selectedProduct.name,
        price: selectedProduct.price,
        image: selectedProduct.image,
        customizable: selectedProduct.customizable,
        yarnColor: customYarnColor,
        size: customSize,
        quantity,
      });
    saveCart(next);
    setSelectedProduct(null);
    setIsCartOpen(true);
  };

  const updateQty = (cartItemId, change) => {
    saveCart(
      cart
        .map((i) =>
          i.cartItemId === cartItemId
            ? { ...i, quantity: i.quantity + change }
            : i,
        )
        .filter((i) => i.quantity > 0),
    );
  };
  const removeItem = (cartItemId) =>
    saveCart(cart.filter((i) => i.cartItemId !== cartItemId));
  const cartTotal = cart.reduce((t, i) => t + i.price * i.quantity, 0);
  const cartCount = cart.reduce((c, i) => c + i.quantity, 0);

  const handleCheckout = async () => {
    if (!user) {
      router.push("/login?callbackUrl=/");
      return;
    }
    setIsCheckingOut(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: cart, total: cartTotal }),
      });
      const data = await res.json();
      if (data.success) {
        setLatestOrderId(data.order.id);
        setCheckoutSuccess(true);
        saveCart([]);
        fetchOrders();
      } else alert(data.error || "Checkout failed.");
    } catch {
      alert("An error occurred.");
    } finally {
      setIsCheckingOut(false);
    }
  };

  // ── Maintenance mode ──────────────────────────────────────────────────────
  if (maintenanceMode) {
    return (
      <div className="min-h-screen bg-[#FFF8F2] flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="max-w-md rounded-3xl border border-[#D8A7B1]/30 bg-white p-10 text-center shadow-sm"
        >
          <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-[#D8A7B1]/15">
            <Sparkles className="h-7 w-7 text-[#D8A7B1]" />
          </div>
          <h1 className="font-serif text-2xl font-bold text-[#2B2B2B]">
            We're updating the boutique
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-[#5A5A5A]">
            The storefront is in maintenance mode while we refresh our handmade
            collection.
          </p>
          <p className="mt-4 text-xs font-bold uppercase tracking-[0.24em] text-[#A8C3A0]">
            Please check back soon.
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#FFF8F2] overflow-x-hidden">
      <main className="flex-1">
        {/* ═══════════════════════════════════════════════════════════
            1. CINEMATIC HERO
        ═══════════════════════════════════════════════════════════ */}
        <section
          ref={heroRef}
          className="relative h-screen min-h-[640px] max-h-[900px] flex items-end overflow-hidden"
        >
          {/* Parallax background image */}
          <motion.div
            style={{ y: heroY }}
            className="absolute inset-0 scale-110"
          >
            <img
              src={IMG_HERO}
              alt="Handmade crochet cardigan"
              className="w-full h-full object-cover object-top"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#1A1108]/90 via-[#2C2523]/30 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#1A1108]/60 via-transparent to-transparent" />
          </motion.div>

          {/* Floating badge top-right */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="absolute top-8 right-8 hidden sm:flex flex-col items-end gap-2"
          >
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl px-4 py-2.5">
              <div className="w-2 h-2 rounded-full bg-[#A8C3A0] animate-pulse" />
              <span className="text-white/90 text-xs font-semibold tracking-wide">
                Accepting Custom Orders
              </span>
            </div>
          </motion.div>

          {/* Hero copy */}
          <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 pb-16 sm:pb-24 w-full">
            <motion.p
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="text-[10px] uppercase tracking-[0.4em] text-[#D8A7B1] font-bold mb-5"
            >
              Crochet with Dilru — Sri Lanka
            </motion.p>

            <motion.h1
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.9,
                delay: 0.2,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="font-serif text-5xl sm:text-7xl lg:text-8xl font-bold text-white leading-[0.9] tracking-tighter max-w-3xl"
            >
              Wear something
              <br />
              <span className="text-[#D8A7B1]">made</span>{" "}
              <span className="italic font-light">just</span>
              <br />
              for you.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.4 }}
              className="mt-7 text-white/70 text-sm sm:text-base max-w-md leading-7"
            >
              Handcrafted crochet cardigans, accessories, and floral keepsakes —
              made to order, one stitch at a time.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.55 }}
              className="mt-10 flex flex-wrap gap-4"
            >
              <Link
                href="/shop"
                className="inline-flex items-center gap-2.5 rounded-2xl bg-[#D8A7B1] hover:bg-[#C596A0] text-[#2B2B2B] font-bold px-8 py-4 text-sm transition-all hover:scale-105 active:scale-95 shadow-xl"
              >
                Browse Collection <ArrowRight className="w-4 h-4" />
              </Link>
              <a
                href={
                  CONTACT_CONFIG?.whatsappUrl ||
                  "https://web.facebook.com/p/Crochet-with-dilru-61553942184584/"
                }
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-2xl border border-white/30 text-white hover:bg-white/10 backdrop-blur-sm font-bold px-8 py-4 text-sm transition-all"
              >
                Custom Order
              </a>
            </motion.div>

            {/* Scroll indicator */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 1.2 }}
              className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
            >
              <div className="w-px h-12 bg-gradient-to-b from-white/0 via-white/50 to-white/0 animate-pulse" />
              <span className="text-white/40 text-[10px] uppercase tracking-[0.3em]">
                Scroll
              </span>
            </motion.div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════
            2. MARQUEE TRUST BAR
        ═══════════════════════════════════════════════════════════ */}
        <div className="bg-[#2B2B2B] py-4 overflow-hidden">
          <div className="flex w-max animate-[marquee_30s_linear_infinite] gap-0">
            {MARQUEE_ITEMS.map((item, i) => (
              <span
                key={i}
                className="whitespace-nowrap text-xs font-semibold text-white/60 tracking-widest px-8 uppercase"
              >
                {item}
              </span>
            ))}
          </div>
        </div>

        {/* ═══════════════════════════════════════════════════════════
            3. EDITORIAL PRODUCT GRID
        ═══════════════════════════════════════════════════════════ */}
        <section className="py-24 sm:py-32 bg-[#FFF8F2]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Section header */}
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-16"
            >
              <div className="space-y-2">
                <span className="text-[10px] uppercase tracking-[0.35em] font-bold text-[#A8C3A0]">
                  The Collection
                </span>
                <h2 className="text-4xl sm:text-5xl font-bold text-[#2B2B2B] font-serif leading-none">
                  Featured
                  <br />
                  Creations
                </h2>
              </div>
              <div className="flex flex-col gap-2 sm:items-end">
                <p className="text-sm text-[#5A5A5A] max-w-xs leading-relaxed">
                  Small-batch, made to order. Every piece handcrafted with
                  premium yarn.
                </p>
                <Link
                  href="/shop"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-[#D8A7B1] hover:text-[#C596A0] transition-colors"
                >
                  View full shop <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </motion.div>

            {/* Products Section */}
            {products.length === 0 ? (
              <div className="text-center py-24 bg-white border border-[#F4E8D5]/60 rounded-3xl max-w-lg mx-auto space-y-6 shadow-sm">
                <div className="p-4 bg-[#F4E8D5] rounded-full w-16 h-16 mx-auto flex items-center justify-center">
                  <ShoppingBag className="w-8 h-8 text-[#5A5A5A]/60" />
                </div>
                <h3 className="text-lg font-bold text-[#2B2B2B] font-serif">
                  The catalog is being refreshed
                </h3>
                <button
                  onClick={async () => {
                    const r = await fetch("/api/seed");
                    const d = await r.json();
                    if (d.success) {
                      router.refresh();
                      window.location.reload();
                    }
                  }}
                  className="py-3 px-6 bg-[#D8A7B1] hover:bg-[#C596A0] text-[#2B2B2B] font-bold rounded-xl text-xs cursor-pointer transition-all hover:scale-105"
                >
                  Seed Database Items
                </button>
              </div>
            ) : (
              <div className="space-y-12">
                {/* Row 2: Three equal cards / Rest of the products */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {products.slice(1).map((product, idx) => (
                    <motion.div
                      key={product.id}
                      variants={fadeUp}
                      initial="hidden"
                      whileInView="visible"
                      viewport={{ once: true }}
                      custom={0.1 * (idx % 3)}
                      className="group relative rounded-[2rem] overflow-hidden border border-[#F4E8D5]/50 bg-white shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-500 flex flex-col"
                    >
                      <div className="relative overflow-hidden bg-[#F4E8D5] aspect-square">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                        {product.customizable && (
                          <span className="absolute top-4 left-4 bg-[#A8C3A0] text-white text-[10px] font-extrabold uppercase tracking-wide px-3 py-1 rounded-full shadow-sm">
                            Customizable
                          </span>
                        )}
                        {(product.stock ?? 0) === 0 && (
                          <span className="absolute top-4 right-14 bg-white/90 text-red-500 text-[10px] font-extrabold uppercase px-3 py-1 rounded-full border border-red-100">
                            Sold Out
                          </span>
                        )}
                        <button
                          onClick={(e) => toggleWishlist(product.id, e)}
                          className="absolute top-4 right-4 p-2.5 bg-white/90 hover:bg-white rounded-full text-[#5A5A5A] hover:text-red-500 shadow-sm hover:scale-110 active:scale-90 transition-all z-10 cursor-pointer"
                          aria-label="Add to wishlist"
                        >
                          <Heart
                            className="w-4 h-4"
                            fill={
                              wishlist.includes(product.id) ? "#EF4444" : "none"
                            }
                            stroke={
                              wishlist.includes(product.id)
                                ? "#EF4444"
                                : "currentColor"
                            }
                          />
                        </button>
                        <div className="absolute inset-0 bg-[#2B2B2B]/20 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all duration-400 backdrop-blur-[1px]">
                          <button
                            onClick={() => openProduct(product)}
                            disabled={(product.stock ?? 0) === 0}
                            className="flex items-center gap-1.5 py-3 px-5 bg-white/95 hover:bg-[#D8A7B1] text-[#2B2B2B] font-bold rounded-2xl shadow-md text-xs hover:scale-105 active:scale-95 transition-all cursor-pointer disabled:opacity-50"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            Quick View
                          </button>
                        </div>
                      </div>
                      <div className="p-5 space-y-3 flex-1">
                        <span className="text-[10px] font-bold text-[#A8C3A0] uppercase tracking-wider">
                          {product.category}
                        </span>
                        <div className="flex items-start justify-between gap-2">
                          <h3 className="font-bold text-[#2B2B2B] font-serif text-base leading-snug group-hover:text-[#D8A7B1] transition-colors">
                            {product.name}
                          </h3>
                          <PriceBadge
                            price={product.price}
                            showLKRPrices={showLKRPrices}
                          />
                        </div>
                        <button
                          onClick={() => openProduct(product)}
                          disabled={(product.stock ?? 0) === 0}
                          className="w-full py-3 bg-[#F4E8D5] hover:bg-[#D8A7B1] text-[#2B2B2B] font-bold rounded-xl text-xs transition-all cursor-pointer disabled:opacity-50"
                        >
                          {(product.stock ?? 0) === 0
                            ? "Out of Stock"
                            : "View Details"}
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* View All Button when collection exceeds the layout */}
                {products.length > 5 && (
                  <motion.div
                    variants={fadeUp}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    className="text-center mt-12"
                  >
                    <Link
                      href="/shop"
                      className="inline-flex items-center gap-2 py-4 px-10 border-2 border-[#D8A7B1]/50 hover:bg-[#D8A7B1] hover:text-[#2B2B2B] text-[#2B2B2B] font-bold rounded-full text-sm transition-all hover:scale-105 hover:border-[#D8A7B1]"
                    >
                      See all {products.length} handmade pieces{" "}
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </motion.div>
                )}
              </div>
            )}
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════
            4. BRAND STORY — IMAGE + TEXT SPLIT
        ═══════════════════════════════════════════════════════════ */}
        <section className="bg-[#2B2B2B] py-24 sm:py-32 overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
              {/* Image mosaic */}
              <motion.div
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="relative"
              >
                <div className="grid grid-cols-2 gap-3">
                  <div className="group rounded-[1.8rem] overflow-hidden aspect-[3/4] row-span-2 border border-white/10 shadow-2xl">
                    <img
                      src={IMG_BEANIE}
                      alt="Crochet beanie"
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  </div>
                  <div className="group rounded-[1.8rem] overflow-hidden aspect-square border border-white/10 shadow-2xl">
                    <img
                      src={IMG_FLOWERS}
                      alt="Crochet flowers"
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  </div>
                  <div className="group rounded-[1.8rem] overflow-hidden aspect-square border border-white/10 shadow-2xl">
                    <img
                      src={IMG_TOTE}
                      alt="Crochet tote"
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  </div>
                </div>
                {/* Floating tag */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.4, type: "spring", stiffness: 200 }}
                  className="absolute -bottom-4 -right-4 bg-[#D8A7B1] rounded-2xl px-5 py-3 shadow-xl"
                >
                  <p className="text-[#2B2B2B] text-xs font-extrabold uppercase tracking-wide">
                    Stitched by Hand
                  </p>
                  <p className="text-[#2B2B2B]/70 text-[10px] font-medium mt-0.5">
                    Est. 2023 · Sri Lanka
                  </p>
                </motion.div>
              </motion.div>

              {/* Text */}
              <motion.div
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={0.2}
                className="space-y-7"
              >
                <span className="text-[10px] uppercase tracking-[0.4em] font-bold text-[#D8A7B1]">
                  Our Story
                </span>
                <h2 className="text-4xl sm:text-5xl font-bold text-white font-serif leading-snug">
                  Slow-made.
                  <br />
                  <span className="text-[#D8A7B1]">Soul-filled.</span>
                </h2>
                <p className="text-white/60 text-sm leading-8 max-w-md">
                  Crochet with Dilru was born from a quiet love of slow craft —
                  the meditative rhythm of a hook, the warmth of premium yarn,
                  and the joy of making something genuinely beautiful by hand.
                  Every piece starts with intention and ends as an heirloom.
                </p>

                {/* Stats row */}
                <div className="grid grid-cols-3 gap-4 pt-4 border-t border-white/10">
                  {[
                    { n: "500+", l: "Happy Customers" },
                    { n: "100%", l: "Handcrafted" },
                    { n: "3+", l: "Years of Craft" },
                  ].map((stat) => (
                    <div key={stat.l} className="text-center">
                      <p className="text-3xl font-bold text-white font-serif">
                        {stat.n}
                      </p>
                      <p className="text-[10px] text-white/40 uppercase tracking-wide font-semibold mt-1">
                        {stat.l}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="flex flex-wrap gap-4 pt-2">
                  <Link
                    href="/our-story"
                    className="inline-flex items-center gap-2 rounded-2xl bg-[#D8A7B1] hover:bg-[#C596A0] text-[#2B2B2B] font-bold px-7 py-3.5 text-sm transition-all hover:scale-105 active:scale-95 shadow-md"
                  >
                    Read Our Story <ArrowRight className="w-4 h-4" />
                  </Link>
                  <Link
                    href="/how-it-works"
                    className="inline-flex items-center gap-2 rounded-2xl border border-white/20 text-white hover:bg-white/10 font-bold px-7 py-3.5 text-sm transition-all"
                  >
                    How It Works
                  </Link>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════
            5. PROCESS — HORIZONTAL NUMBERED FLOW
        ═══════════════════════════════════════════════════════════ */}
        <section className="py-24 sm:py-32 bg-[#FFF8F2] border-y border-[#F4E8D5]/60">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="text-center mb-20"
            >
              <span className="text-[10px] uppercase tracking-[0.35em] font-bold text-[#D8A7B1] mb-3 block">
                Simple Process
              </span>
              <h2 className="text-4xl sm:text-5xl font-bold text-[#2B2B2B] font-serif leading-none">
                How It Works
              </h2>
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-0 relative">
              {/* Connector line */}
              <div className="hidden lg:block absolute top-[2.5rem] left-[12.5%] right-[12.5%] h-px bg-gradient-to-r from-transparent via-[#D8A7B1]/40 to-transparent" />

              {PROCESS.map((step, i) => (
                <motion.div
                  key={step.n}
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  custom={i}
                  className="flex flex-col items-center text-center px-6 py-10 group"
                >
                  {/* Number circle */}
                  <div className="relative mb-6">
                    <div
                      className="w-16 h-16 rounded-full flex items-center justify-center text-xl font-black font-serif border-2 bg-white shadow-sm group-hover:shadow-md transition-shadow duration-400"
                      style={{ borderColor: step.color, color: step.color }}
                    >
                      {step.n}
                    </div>
                    {i < PROCESS.length - 1 && (
                      <div className="hidden sm:block lg:hidden absolute top-1/2 left-full w-full h-px -translate-y-1/2 bg-[#F4E8D5]" />
                    )}
                  </div>
                  <h3 className="font-bold text-[#2B2B2B] font-serif text-lg mb-3">
                    {step.title}
                  </h3>
                  <p className="text-sm text-[#5A5A5A] leading-6 max-w-xs">
                    {step.body}
                  </p>
                </motion.div>
              ))}
            </div>

            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="text-center mt-10"
            >
              <Link
                href="/how-it-works"
                className="inline-flex items-center gap-2 text-sm font-bold text-[#D8A7B1] hover:text-[#C596A0] transition-colors"
              >
                Learn more about our process <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════
            6. COMMUNITY PHOTO MOSAIC
        ═══════════════════════════════════════════════════════════ */}
        <section className="py-24 sm:py-32 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-14"
            >
              <div>
                <span className="text-[10px] uppercase tracking-[0.35em] font-bold text-[#A8C3A0] mb-3 block">
                  Community
                </span>
                <h2 className="text-4xl sm:text-5xl font-bold text-[#2B2B2B] font-serif leading-none">
                  Worn with
                  <br />
                  Love
                </h2>
              </div>
              <p className="text-sm text-[#5A5A5A] max-w-xs leading-relaxed">
                Tag{" "}
                <span className="font-bold text-[#D8A7B1]">
                  @crochet_with_dilru
                </span>{" "}
                on Facebook to get featured in our community gallery.
              </p>
            </motion.div>

            {/* Mosaic grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                {
                  src: IMG_TOTE,
                  span: "sm:col-span-2 sm:row-span-2",
                  aspect: "aspect-square",
                },
                { src: IMG_FLOWERS, span: "", aspect: "aspect-square" },
                { src: IMG_BEANIE, span: "", aspect: "aspect-square" },
                { src: IMG_CARDIGAN, span: "", aspect: "aspect-square" },
                { src: IMG_COMMUNITY, span: "", aspect: "aspect-square" },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  custom={i * 0.08}
                  className={`group relative ${item.span} ${item.aspect} rounded-[1.5rem] overflow-hidden border border-[#F4E8D5] shadow-sm`}
                >
                  <img
                    src={item.src}
                    alt={`Community post ${i + 1}`}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-[#2B2B2B]/0 group-hover:bg-[#2B2B2B]/30 transition-all duration-400" />
                </motion.div>
              ))}
            </div>

            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="text-center mt-12"
            >
              <Link
                href="/community"
                className="inline-flex items-center gap-2 py-3.5 px-8 rounded-full border border-[#D8A7B1]/40 hover:bg-[#D8A7B1]/10 text-[#2B2B2B] font-bold text-sm transition-all hover:scale-105"
              >
                Visit Community <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════
            7. DARK FULL-WIDTH CTA BANNER
        ═══════════════════════════════════════════════════════════ */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0">
            <img
              src={IMG_COMMUNITY}
              alt="CTA background"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-[#1A1108]/80 backdrop-blur-sm" />
          </div>
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="relative z-10 max-w-3xl mx-auto text-center px-6 py-28 sm:py-36"
          >
            <span className="text-[10px] uppercase tracking-[0.4em] font-bold text-[#D8A7B1] mb-4 block">
              Ready for something special?
            </span>
            <h2 className="text-4xl sm:text-6xl font-bold text-white font-serif leading-tight mb-6">
              Your perfect piece
              <br />
              is waiting to be made.
            </h2>
            <p className="text-white/60 text-sm leading-7 mb-10 max-w-lg mx-auto">
              Every order is a collaboration. Tell us your vision — size, color,
              occasion — and we'll handcraft something beautiful just for you.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/shop"
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#D8A7B1] hover:bg-[#C596A0] text-[#2B2B2B] font-bold px-10 py-4 text-sm transition-all hover:scale-105 active:scale-95 shadow-xl"
              >
                Shop the Collection <ArrowRight className="w-4 h-4" />
              </Link>
              <a
                href="https://web.facebook.com/p/Crochet-with-dilru-61553942184584/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center rounded-2xl border border-white/30 text-white hover:bg-white/10 font-bold px-10 py-4 text-sm transition-all"
              >
                Message on Facebook
              </a>
            </div>
          </motion.div>
        </section>
      </main>

      {/* ═══════════════════════════════════════════════════════════
          PRODUCT DETAIL MODAL
      ═══════════════════════════════════════════════════════════ */}
      <AnimatePresence>
        {selectedProduct && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedProduct(null)}
              className="fixed inset-0 bg-[#2B2B2B]/60 backdrop-blur-sm cursor-pointer"
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 15 }}
              transition={{ type: "spring", damping: 25, stiffness: 220 }}
              className="bg-[#FFF8F2] border border-[#F4E8D5] w-full max-w-2xl rounded-[2rem] overflow-hidden shadow-2xl max-h-[90vh] flex flex-col md:flex-row relative z-10"
            >
              <button
                onClick={() => setSelectedProduct(null)}
                className="absolute top-4 right-4 p-2.5 bg-white/90 rounded-full hover:bg-red-50 text-[#2B2B2B] hover:text-red-500 transition-colors z-20 cursor-pointer shadow-sm border border-[#F4E8D5]/50"
                aria-label="Close"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="w-full md:w-1/2 aspect-square md:aspect-auto bg-[#F4E8D5] h-64 md:h-auto border-r border-[#F4E8D5]/40">
                <img
                  src={selectedProduct.image}
                  alt={selectedProduct.name}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="w-full md:w-1/2 p-7 overflow-y-auto flex flex-col justify-between max-h-[50vh] md:max-h-none">
                <div className="space-y-4">
                  <span className="text-[#A8C3A0] text-[10px] font-extrabold uppercase tracking-wider block">
                    {selectedProduct.category}
                  </span>
                  <h3 className="text-2xl font-bold text-[#2B2B2B] font-serif leading-tight">
                    {selectedProduct.name}
                  </h3>
                  <div className="flex items-center gap-3">
                    <PriceDisplay
                      price={selectedProduct.price}
                      size="lg"
                      showLKRPrices={showLKRPrices}
                    />
                    {selectedProduct.customizable && (
                      <span className="text-[10px] text-[#A8C3A0] border border-[#A8C3A0]/40 px-2.5 py-0.5 rounded-full font-bold uppercase">
                        Customizable
                      </span>
                    )}
                  </div>
                  <p className="text-xs leading-relaxed text-[#5A5A5A]">
                    {selectedProduct.description}
                  </p>

                  {selectedProduct.customizable ? (
                    <div className="space-y-4 border-t border-[#F4E8D5] pt-4">
                      <div>
                        <label className="block text-[10px] font-bold text-[#2B2B2B] uppercase tracking-wide mb-2.5">
                          Yarn Color
                        </label>
                        <div className="flex flex-wrap gap-2.5">
                          {YARN_COLORS.map((c) => (
                            <button
                              key={c.name}
                              type="button"
                              title={c.name}
                              onClick={() => setCustomYarnColor(c.name)}
                              className="cursor-pointer"
                            >
                              <span
                                className={`block w-8 h-8 rounded-full border-2 shadow-sm transition-all duration-300 ${customYarnColor === c.name ? "border-[#D8A7B1] ring-2 ring-[#D8A7B1]/30 scale-110" : "border-white ring-1 ring-[#F4E8D5] hover:scale-105"}`}
                                style={{ backgroundColor: c.hex }}
                              />
                            </button>
                          ))}
                        </div>
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-[#2B2B2B] uppercase tracking-wide mb-2.5">
                          Size
                        </label>
                        <div className="flex gap-2">
                          {SIZES.map((s) => (
                            <button
                              key={s}
                              type="button"
                              onClick={() => setCustomSize(s)}
                              className={`w-10 h-10 text-xs font-bold border rounded-xl transition-all cursor-pointer ${customSize === s ? "border-[#D8A7B1] bg-[#D8A7B1] text-[#2B2B2B] scale-102" : "border-[#F4E8D5] text-[#5A5A5A] hover:border-[#D8A7B1]/50"}`}
                            >
                              {s}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-[10px] text-[#5A5A5A]/70 font-semibold italic border-t border-[#F4E8D5] pt-4 flex items-center gap-1.5">
                      <Info className="w-3.5 h-3.5 text-[#D8A7B1]" />
                      Standard size. Contact us for custom sizing requests.
                    </div>
                  )}
                </div>

                <div className="border-t border-[#F4E8D5] pt-5 mt-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#2B2B2B]">
                      Quantity
                    </span>
                    <div className="flex items-center gap-3 border border-[#F4E8D5] rounded-xl px-3 py-1.5 bg-white/50">
                      <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="p-0.5 text-[#5A5A5A] hover:text-[#D8A7B1] cursor-pointer transition-colors"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="text-xs font-extrabold w-4 text-center text-[#2B2B2B]">
                        {quantity}
                      </span>
                      <button
                        onClick={() => setQuantity(quantity + 1)}
                        className="p-0.5 text-[#5A5A5A] hover:text-[#D8A7B1] cursor-pointer transition-colors"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                  <button
                    onClick={addToCartFromModal}
                    className="w-full py-4 px-6 bg-[#D8A7B1] hover:bg-[#C596A0] text-[#2B2B2B] font-bold rounded-2xl shadow-sm hover:shadow hover:scale-[1.01] active:scale-[0.99] transition-all text-xs cursor-pointer flex items-center justify-center gap-2"
                  >
                    <ShoppingBag className="w-4 h-4" /> Add to Cart
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ═══════════════════════════════════════════════════════════
          CART DRAWER
      ═══════════════════════════════════════════════════════════ */}
      <AnimatePresence>
        {isCartOpen && (
          <div className="fixed inset-0 z-50 flex justify-end">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCartOpen(false)}
              className="fixed inset-0 bg-[#2B2B2B]/50 backdrop-blur-sm cursor-pointer"
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 220 }}
              className="relative w-full max-w-md bg-[#FFF8F2] h-full shadow-2xl flex flex-col border-l border-[#F4E8D5]"
            >
              {/* Header */}
              <div className="p-6 border-b border-[#F4E8D5] flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <ShoppingBag className="w-5 h-5 text-[#2B2B2B]" />
                  <h3 className="text-lg font-bold text-[#2B2B2B] font-serif">
                    Shopping Bag
                  </h3>
                  <span className="py-0.5 px-2 bg-[#F4E8D5] rounded-full text-[10px] font-extrabold text-[#5A5A5A]">
                    {cartCount}
                  </span>
                </div>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="p-2 hover:bg-[#F4E8D5] rounded-full text-[#5A5A5A] hover:text-[#2B2B2B] transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Items */}
              <div className="flex-1 overflow-y-auto p-6 space-y-5">
                {cart.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
                    <div className="p-4 bg-[#F4E8D5] rounded-full">
                      <ShoppingBag className="w-10 h-10 text-[#5A5A5A]/50" />
                    </div>
                    <p className="text-sm font-bold text-[#2B2B2B] font-serif">
                      Your bag is empty
                    </p>
                    <p className="text-xs text-[#5A5A5A]">
                      Explore our collection and find your perfect handmade
                      piece.
                    </p>
                    <button
                      onClick={() => setIsCartOpen(false)}
                      className="py-2.5 px-6 bg-[#D8A7B1] hover:bg-[#C596A0] text-[#2B2B2B] font-bold rounded-xl text-xs cursor-pointer transition-all hover:scale-105"
                    >
                      Shop Now
                    </button>
                  </div>
                ) : (
                  <AnimatePresence>
                    {cart.map((item) => (
                      <motion.div
                        key={item.cartItemId}
                        layout
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="flex gap-4 border-b border-[#F4E8D5]/60 pb-5 last:border-0 last:pb-0"
                      >
                        <div className="w-20 h-20 bg-[#F4E8D5] rounded-2xl overflow-hidden flex-shrink-0 border border-[#F4E8D5]/50">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-grow flex flex-col justify-between py-0.5">
                          <div>
                            <div className="flex justify-between items-start gap-2">
                              <h4 className="text-sm font-bold text-[#2B2B2B] font-serif leading-snug">
                                {item.name}
                              </h4>
                              <span className="text-sm font-bold text-[#2B2B2B] whitespace-nowrap">
                                ${(item.price * item.quantity).toFixed(2)}
                              </span>
                            </div>
                            {item.customizable && (
                              <div className="flex flex-wrap gap-1.5 mt-1.5">
                                <span className="text-[10px] bg-[#D8A7B1]/10 text-[#2B2B2B] px-2 py-0.5 rounded-full font-semibold border border-[#D8A7B1]/20">
                                  Color: {item.yarnColor}
                                </span>
                                <span className="text-[10px] bg-[#A8C3A0]/10 text-[#2B2B2B] px-2 py-0.5 rounded-full font-semibold border border-[#A8C3A0]/20">
                                  Size: {item.size}
                                </span>
                              </div>
                            )}
                          </div>
                          <div className="flex items-center justify-between mt-2.5">
                            <div className="flex items-center gap-2 border border-[#F4E8D5] rounded-xl px-2 py-1 bg-white/50">
                              <button
                                onClick={() => updateQty(item.cartItemId, -1)}
                                className="p-0.5 text-[#5A5A5A] hover:text-[#D8A7B1]"
                              >
                                <Minus className="w-3 h-3" />
                              </button>
                              <span className="text-xs font-bold w-4 text-center text-[#2B2B2B]">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => updateQty(item.cartItemId, 1)}
                                className="p-0.5 text-[#5A5A5A] hover:text-[#D8A7B1]"
                              >
                                <Plus className="w-3 h-3" />
                              </button>
                            </div>
                            <button
                              onClick={() => removeItem(item.cartItemId)}
                              className="text-[#5A5A5A]/60 hover:text-red-500 p-1.5 hover:bg-red-50 rounded-lg cursor-pointer transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                )}
              </div>

              {/* Footer */}
              {cart.length > 0 && (
                <div className="p-6 border-t border-[#F4E8D5] bg-white/60 space-y-4">
                  <div className="flex justify-between items-center text-sm font-semibold text-[#5A5A5A]">
                    <span>Subtotal</span>
                    <span className="text-xl font-bold text-[#2B2B2B]">
                      ${cartTotal.toFixed(2)}
                    </span>
                  </div>
                  <p className="text-[10px] text-[#5A5A5A]/70 leading-normal">
                    Custom orders are hand-stitched. Processing takes 3–5 days.
                    Delivery charges at checkout.
                  </p>
                  <button
                    onClick={handleCheckout}
                    disabled={isCheckingOut}
                    className="w-full py-4 px-6 bg-[#D8A7B1] hover:bg-[#C596A0] text-[#2B2B2B] font-bold rounded-2xl text-xs cursor-pointer flex items-center justify-center gap-2 transition-all hover:scale-[1.01] disabled:opacity-75"
                  >
                    {isCheckingOut ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <>
                        {user ? "Place Order" : "Log In to Order"}{" "}
                        <CheckCircle className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ═══════════════════════════════════════════════════════════
          CHECKOUT SUCCESS
      ═══════════════════════════════════════════════════════════ */}
      <AnimatePresence>
        {checkoutSuccess && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-[#2B2B2B]/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative bg-[#FFF8F2] border border-[#F4E8D5] w-full max-w-md rounded-3xl p-8 text-center shadow-2xl z-10 space-y-5"
            >
              <div className="w-16 h-16 bg-[#A8C3A0]/20 flex items-center justify-center rounded-full mx-auto">
                <CheckCircle className="w-9 h-9 text-[#A8C3A0]" />
              </div>
              <h3 className="text-2xl font-bold text-[#2B2B2B] font-serif">
                Order Received!
              </h3>
              <p className="text-sm text-[#5A5A5A]">
                Thank you! Your handcrafted order is queued. Stitched with love.
              </p>
              <div className="p-3 bg-[#F4E8D5]/50 rounded-2xl font-mono text-xs text-[#2B2B2B] border border-[#F4E8D5]">
                Order ID: {latestOrderId}
              </div>
              <button
                onClick={() => {
                  setCheckoutSuccess(false);
                  setIsCartOpen(false);
                }}
                className="w-full py-3.5 bg-[#F4E8D5] hover:bg-[#D8A7B1]/20 text-[#2B2B2B] font-bold rounded-2xl text-xs cursor-pointer transition-colors"
              >
                Continue Shopping
              </button>
              <Link
                href="/my-orders"
                onClick={() => {
                  setCheckoutSuccess(false);
                  setIsCartOpen(false);
                }}
                className="block w-full py-3.5 bg-[#D8A7B1] hover:bg-[#C596A0] text-[#2B2B2B] font-bold rounded-2xl text-xs text-center transition-colors shadow-sm"
              >
                View My Orders
              </Link>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
