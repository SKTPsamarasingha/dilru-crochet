"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShoppingBag,
  Heart,
  X,
  Plus,
  Minus,
  Trash2,
  CheckCircle,
  MessageCircle,
  Loader2,
  Menu,
  Sparkles,
} from "lucide-react";

import { useAuth } from "@/context/AuthContext";

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const { user, signOut } = useAuth();
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [checkoutSuccess, setCheckoutSuccess] = useState(false);
  const [latestOrderId, setLatestOrderId] = useState("");
  const [scrolled, setScrolled] = useState(false);

  // Scroll handler for transparent sticky header
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Sync cart with localStorage
  const syncCart = () => {
    const savedCart = localStorage.getItem("dilru_cart");
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (e) {
        console.error("Failed to parse cart", e);
      }
    }
  };

  const saveCart = (newCart) => {
    setCart(newCart);
    localStorage.setItem("dilru_cart", JSON.stringify(newCart));
    // Trigger sync event for any other components
    window.dispatchEvent(new Event("sync-cart"));
  };

  const addToCart = (product, qty, color, size) => {
    const cartItemId = `${product.id}-${color}-${size}`;
    const existingItemIndex = cart.findIndex((item) => item.cartItemId === cartItemId);

    let newCart = [...cart];
    if (existingItemIndex > -1) {
      newCart[existingItemIndex].quantity += qty;
    } else {
      newCart.push({
        cartItemId,
        productId: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        customizable: product.customizable,
        yarnColor: color,
        size: size,
        quantity: qty
      });
    }

    saveCart(newCart);
    setIsCartOpen(true);
  };

  useEffect(() => {
    syncCart();

    // Custom events listeners for global communication
    const handleSync = () => syncCart();
    const handleAdd = (e) => {
      const { product, qty, color, size } = e.detail;
      addToCart(product, qty, color, size);
    };
    const handleOpen = () => setIsCartOpen(true);

    window.addEventListener("sync-cart", handleSync);
    window.addEventListener("add-to-cart", handleAdd);
    window.addEventListener("open-cart", handleOpen);

    return () => {
      window.removeEventListener("sync-cart", handleSync);
      window.removeEventListener("add-to-cart", handleAdd);
      window.removeEventListener("open-cart", handleOpen);
    };
  }, []);

  const updateCartQty = (cartItemId, change) => {
    const newCart = cart
      .map((item) => {
        if (item.cartItemId === cartItemId) {
          const newQty = item.quantity + change;
          return { ...item, quantity: newQty };
        }
        return item;
      })
      .filter((item) => item.quantity > 0);

    saveCart(newCart);
  };

  const removeCartItem = (cartItemId) => {
    const newCart = cart.filter((item) => item.cartItemId !== cartItemId);
    saveCart(newCart);
  };

  const getCartTotal = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const getCartCount = () => {
    return cart.reduce((count, item) => count + item.quantity, 0);
  };

  const handleCheckout = async () => {
    if (!user) {
      router.push("/login?callbackUrl=" + window.location.pathname);
      return;
    }

    setIsCheckingOut(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: cart,
          total: getCartTotal()
        })
      });

      const data = await res.json();
      if (data.success) {
        setLatestOrderId(data.order.id);
        setCheckoutSuccess(true);
        saveCart([]); // Clear cart
      } else {
        alert(data.error || "Checkout failed. Please try again.");
      }
    } catch (error) {
      console.error("Checkout error:", error);
      alert("An error occurred during checkout. Please try again.");
    } finally {
      setIsCheckingOut(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    router.refresh();
  };

  const isActive = (path) => pathname === path;

  return (
    <>
      <header
        className={`sticky top-0 z-40 w-full transition-all duration-300 bg-background/90 backdrop-blur-md shadow-[0_4px_30px_rgba(43,43,43,0.02)] py-4`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <Heart
              className="w-5.5 h-5.5 text-primary transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6"
              fill="currentColor"
            />
            <span className="text-xl sm:text-2xl font-bold tracking-tight text-foreground font-serif transition-colors duration-300 group-hover:text-primary">
              Crochet with Dilru
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-semibold">
            {[
              { href: "/shop", label: "Shop" },
              { href: "/how-it-works", label: "How It Works" },
              { href: "/our-story", label: "Our Story" },
              { href: "/community", label: "Community" },
              { href: "/my-orders", label: "My Orders" },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`hover:text-primary transition-all duration-300 relative py-1 text-sm font-semibold ${
                  isActive(link.href)
                    ? "text-primary font-bold"
                    : "text-espresso-light"
                }`}
              >
                {link.label}
                {isActive(link.href) && (
                  <motion.span
                    layoutId="activeNavIndicator"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
              </Link>
            ))}
          </nav>

          {/* Right Action Menu */}
          <div className="flex items-center gap-4">
            {user ? (
              <div className="hidden sm:flex items-center gap-3 text-sm">
                {["SUPER_ADMIN", "ADMIN", "EDITOR"].includes(user.role) && (
                  <Link
                    href="/admin"
                    className="py-2 px-4 bg-accent hover:bg-accent-hover text-foreground font-bold rounded-full transition-all text-xs shadow-sm hover:shadow active:scale-[0.98]"
                  >
                    Admin Panel
                  </Link>
                )}
                <button
                  onClick={handleSignOut}
                  className="text-xs font-semibold text-espresso-light hover:text-red-500 cursor-pointer underline decoration-dotted underline-offset-4 transition-colors"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                className="hidden sm:inline-block text-sm font-semibold text-espresso-light hover:text-primary transition-colors"
              >
                Log In
              </Link>
            )}

            {/* Shopping Cart Trigger */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-3 bg-beige hover:bg-primary/20 rounded-full text-foreground transition-all duration-300 cursor-pointer hover:scale-105 active:scale-95"
              aria-label="Open Cart"
            >
              <ShoppingBag className="w-5 h-5" />
              <AnimatePresence>
                {getCartCount() > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center bg-primary text-foreground text-xxs font-extrabold rounded-full border-2 border-background shadow-sm"
                  >
                    {getCartCount()}
                  </motion.span>
                )}
              </AnimatePresence>
            </button>

            {/* Hamburger Mobile Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="md:hidden p-2 text-foreground hover:text-primary transition-colors cursor-pointer"
              aria-label="Open Menu"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </header>

      {/* MOBILE SLIDE-OUT MENU */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <div className="fixed inset-0 z-50 md:hidden flex">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-espresso/50 backdrop-blur-xs cursor-pointer"
            />

            {/* Slide menu panel */}
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 220 }}
              className="relative w-4/5 max-w-xs bg-background h-full shadow-2xl flex flex-col justify-between p-6 border-r border-beige"
            >
              <div className="space-y-8">
                <div className="flex items-center justify-between">
                  <Link
                    href="/"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center gap-2"
                  >
                    <Heart
                      className="w-5 h-5 text-primary"
                      fill="currentColor"
                    />
                    <span className="text-lg font-bold font-serif text-foreground">
                      Dilru Crochet
                    </span>
                  </Link>
                  <button
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="p-2 hover:bg-beige rounded-full text-foreground transition-colors cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <nav className="flex flex-col gap-4">
                  {[
                    { href: "/shop", label: "Shop" },
                    { href: "/how-it-works", label: "How It Works" },
                    { href: "/our-story", label: "Our Story" },
                    { href: "/community", label: "Community" },
                    { href: "/my-orders", label: "My Orders" },
                  ].map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`py-2 px-3 text-sm font-semibold rounded-xl transition-all ${
                        isActive(link.href)
                          ? "bg-beige text-primary font-bold"
                          : "text-espresso-light hover:bg-beige/40"
                      }`}
                    >
                      {link.label}
                    </Link>
                  ))}
                </nav>
              </div>

              <div className="pt-6 border-t border-beige space-y-4">
                {user ? (
                  <div className="space-y-3">
                    <p className="text-xs text-espresso-light font-medium px-3">
                      Logged in as{" "}
                      <strong className="text-foreground">{user.name}</strong>
                    </p>
                    {["SUPER_ADMIN", "ADMIN", "EDITOR"].includes(user.role) && (
                      <Link
                        href="/admin"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="block w-full py-2.5 text-center bg-accent hover:bg-accent-hover text-foreground font-bold rounded-xl text-xs transition-colors"
                      >
                        Admin Panel
                      </Link>
                    )}
                    <button
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                        handleSignOut();
                      }}
                      className="block w-full py-2.5 text-center border border-primary text-foreground font-bold rounded-xl text-xs transition-colors cursor-pointer"
                    >
                      Sign Out
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Link
                      href="/login"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="block w-full py-3 text-center bg-primary hover:bg-primary-hover text-foreground font-bold rounded-xl text-xs transition-colors"
                    >
                      Log In
                    </Link>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* SHOPPING BAG CART DRAWER */}
      <AnimatePresence>
        {isCartOpen && (
          <div className="fixed inset-0 z-50 flex justify-end">
            {/* Backdrop overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCartOpen(false)}
              className="fixed inset-0 bg-espresso/50 backdrop-blur-xs cursor-pointer"
            />

            {/* Cart Drawer Panel */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 220 }}
              className="relative w-full max-w-md bg-background h-full shadow-2xl flex flex-col border-l border-beige"
            >
              {/* Header */}
              <div className="p-6 border-b border-beige flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5 text-foreground" />
                  <h3 className="text-lg font-bold text-foreground font-serif">
                    Shopping Bag
                  </h3>
                  <span className="py-0.5 px-2 bg-beige rounded-full text-xxs font-extrabold text-espresso-light">
                    {getCartCount()}
                  </span>
                </div>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="p-2 hover:bg-beige rounded-full text-espresso-light hover:text-foreground transition-colors cursor-pointer"
                  aria-label="Close Cart"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Items scroll area */}
              <div className="flex-grow overflow-y-auto p-6 space-y-6">
                {cart.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-center text-espresso-light space-y-4">
                    <div className="p-4 bg-beige rounded-full">
                      <ShoppingBag className="w-10 h-10 text-espresso-light/60" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold font-serif text-foreground">
                        Your shopping bag is empty
                      </p>
                      <p className="text-xs mt-1 text-espresso-light/80">
                        Explore our handcrafted designs to find your perfect
                        pieces.
                      </p>
                    </div>
                    <Link
                      href="/shop"
                      onClick={() => setIsCartOpen(false)}
                      className="py-2.5 px-6 bg-primary hover:bg-primary-hover text-foreground font-bold rounded-xl text-xs shadow-sm transition-all cursor-pointer hover:scale-102 active:scale-98"
                    >
                      Shop Collection
                    </Link>
                  </div>
                ) : (
                  cart.map((item) => (
                    <motion.div
                      layout
                      key={item.cartItemId}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="flex gap-4 border-b border-beige/40 pb-4 last:border-b-0 last:pb-0"
                    >
                      <div className="w-20 h-20 bg-beige rounded-2xl overflow-hidden flex-shrink-0 border border-beige/35">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                        />
                      </div>
                      <div className="flex-grow flex flex-col justify-between py-0.5">
                        <div>
                          <div className="flex justify-between items-start gap-2">
                            <h4 className="text-sm font-bold text-foreground font-serif leading-snug">
                              {item.name}
                            </h4>
                            <span className="text-sm font-bold text-foreground whitespace-nowrap">
                              ${(item.price * item.quantity).toFixed(2)}
                            </span>
                          </div>

                          {item.customizable && (
                            <div className="flex flex-wrap gap-1.5 mt-1.5">
                              <span className="text-xxs bg-primary/10 text-foreground px-2 py-0.5 rounded-full font-semibold border border-primary/20">
                                Color: {item.yarnColor}
                              </span>
                              <span className="text-xxs bg-accent/15 text-foreground px-2 py-0.5 rounded-full font-semibold border border-accent/20">
                                Size: {item.size}
                              </span>
                            </div>
                          )}
                        </div>

                        <div className="flex items-center justify-between mt-2.5">
                          {/* Quantity selectors */}
                          <div className="flex items-center gap-2 border border-beige rounded-xl px-2 py-1 bg-background/50">
                            <button
                              onClick={() => updateCartQty(item.cartItemId, -1)}
                              className="p-0.5 text-espresso-light hover:text-primary transition-colors"
                              aria-label="Decrease quantity"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="text-xs font-bold w-4 text-center text-foreground">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateCartQty(item.cartItemId, 1)}
                              className="p-0.5 text-espresso-light hover:text-primary transition-colors"
                              aria-label="Increase quantity"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>

                          {/* Remove button */}
                          <button
                            onClick={() => removeCartItem(item.cartItemId)}
                            className="text-espresso-light/60 hover:text-red-500 transition-colors p-1.5 hover:bg-red-50 rounded-lg cursor-pointer"
                            aria-label="Remove item"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>

              {/* Drawer Footer Summary */}
              {cart.length > 0 && (
                <div className="p-6 border-t border-beige bg-[#FFFDFB] space-y-4 shadow-[0_-8px_30px_rgba(43,43,43,0.02)]">
                  {/* Coupon & Shipping Promo */}
                  <div className="p-3 bg-beige/30 border border-beige/60 rounded-xl text-xxs text-espresso-light font-medium flex items-center gap-2">
                    <Sparkles className="w-3.5 h-3.5 text-primary flex-shrink-0" />
                    <span>
                      Free shipping included on orders with customized
                      cardigans.
                    </span>
                  </div>

                  <div className="flex justify-between items-center text-sm font-semibold text-espresso-light">
                    <span>Subtotal</span>
                    <span className="text-lg font-bold text-foreground">
                      ${getCartTotal().toFixed(2)}
                    </span>
                  </div>
                  <p className="text-xxs text-espresso-light/70 leading-normal">
                    Custom order items are hand-stitched. Standard processing
                    takes 3–5 days. Delivery charges calculated at checkout.
                  </p>

                  <button
                    onClick={handleCheckout}
                    disabled={isCheckingOut}
                    className="w-full py-4 px-6 bg-primary hover:bg-primary-hover text-foreground font-bold rounded-2xl shadow-sm hover:shadow transition-all text-xs cursor-pointer flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-75 disabled:cursor-not-allowed"
                  >
                    {isCheckingOut ? (
                      <Loader2 className="w-4 h-4 animate-spin text-foreground" />
                    ) : (
                      <>
                        {user ? "Place Handcrafted Order" : "Log In to Order"}
                        <CheckCircle className="w-4 h-4 text-foreground" />
                      </>
                    )}
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* CHECKOUT SUCCESS MODAL */}
      <AnimatePresence>
        {checkoutSuccess && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-espresso/50 backdrop-blur-xs"
            />

            {/* Modal Card */}
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative bg-background border border-beige w-full max-w-md rounded-3xl p-8 text-center shadow-xl space-y-6 z-10"
            >
              <div className="w-16 h-16 bg-accent/20 text-accent flex items-center justify-center rounded-full mx-auto shadow-sm">
                <CheckCircle className="w-9 h-9" />
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-bold text-foreground font-serif">
                  Order Received!
                </h3>
                <p className="text-sm text-espresso-light leading-relaxed">
                  Thank you! Your custom order has been successfully queued. Our
                  artisans will start crafting it shortly.
                </p>
                <div className="p-3 bg-beige/40 rounded-2xl font-mono text-xs text-foreground mt-2 border border-beige/30">
                  Order ID: {latestOrderId}
                </div>
              </div>
              <button
                onClick={() => {
                  setCheckoutSuccess(false);
                  setIsCartOpen(false);
                }}
                className="w-full py-3.5 px-6 bg-beige hover:bg-primary/20 text-foreground font-bold rounded-2xl transition-all duration-300 text-xs cursor-pointer hover:scale-102 active:scale-98"
              >
                Continue Shopping
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* FLOATING CHAT BUBBLE */}
      <a
        href="https://web.facebook.com/p/Crochet-with-dilru-61553942184584/"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-40 bg-accent hover:bg-accent-hover text-foreground py-3 px-5.5 rounded-full flex items-center gap-2 shadow-lg hover:shadow-xl transition-all duration-300 chat-bubble-pulse hover:scale-105 active:scale-95"
      >
        <MessageCircle className="w-5 h-5 fill-foreground text-accent" />
        <span className="text-xs font-extrabold tracking-wider uppercase text-foreground">
          Chat for Custom Orders
        </span>
      </a>
    </>
  );
}
