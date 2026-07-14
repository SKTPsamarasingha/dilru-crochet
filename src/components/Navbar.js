"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import {
  ShoppingBag,
  Heart,
  X,
  Plus,
  Minus,
  Trash2,
  CheckCircle,
  MessageCircle,
  Facebook,
  ExternalLink,
  Loader2,
  Sparkles
} from "lucide-react";

import { useAuth } from "@/context/AuthContext";

export default function Navbar() {
  const router = useRouter();
  const { user, signOut } = useAuth();
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [checkoutSuccess, setCheckoutSuccess] = useState(false);
  const [latestOrderId, setLatestOrderId] = useState("");

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

  return (
    <>
      <header className="sticky top-0 z-40 w-full bg-[#FDFBF7]/90 backdrop-blur-md border-b border-[#F5EFEB]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <Heart
              className="w-6 h-6 text-[#E0A996] transition-transform group-hover:scale-110"
              fill="#E0A996"
            />
            <span className="text-xl sm:text-2xl font-bold tracking-tight text-[#2C2523] font-serif">
              Crochet with Dilru
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-[#4A3728]">
            <Link
              href="/shop"
              className="hover:text-[#E0A996] transition-colors"
            >
              Shop
            </Link>
            <Link
              href="/how-it-works"
              className="hover:text-[#E0A996] transition-colors"
            >
              How It Works
            </Link>
            <Link
              href="/our-story"
              className="hover:text-[#E0A996] transition-colors"
            >
              Our Story
            </Link>
            <Link
              href="/community"
              className="hover:text-[#E0A996] transition-colors"
            >
              Community
            </Link>
            <Link
              href="/my-orders"
              className="hover:text-[#E0A996] transition-colors"
            >
              My Orders
            </Link>
          </nav>

          <div className="flex items-center gap-4">
            {user ? (
              <div className="flex items-center gap-3 text-sm">
              
                {["SUPER_ADMIN", "ADMIN", "EDITOR"].includes(user.role) && (
                  <Link
                    href="/admin"
                    className="py-2 px-3.5 bg-[#96A288] hover:bg-[#818D74] text-white font-semibold rounded-full transition-colors text-xs shadow-xxs"
                  >
                    Admin panel
                  </Link>
                )}
                <button
                  onClick={handleSignOut}
                  className="text-xs font-semibold text-[#4A3728] hover:text-red-600 cursor-pointer underline underline-offset-4"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                className="text-sm font-semibold text-[#4A3728] hover:text-[#E0A996] transition-colors"
              >
                Log In
              </Link>
            )}

            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2.5 bg-[#F5EFEB] hover:bg-[#EBE5E0] rounded-full text-[#2C2523] transition-colors cursor-pointer"
              aria-label="Open Cart"
            >
              <ShoppingBag className="w-5.5 h-5.5" />
              {getCartCount() > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center bg-[#E0A996] text-[#2C2523] text-xxs font-bold rounded-full border-2 border-[#FDFBF7]">
                  {getCartCount()}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* CART DRAWER */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-[#2C2523]/40 backdrop-blur-xxs">
          <div
            className="fixed inset-0 cursor-pointer animate-fade-in"
            onClick={() => setIsCartOpen(false)}
          />
          <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col border-l border-[#F5EFEB]">
            <div className="p-6 border-b border-[#F5EFEB] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-5.5 h-5.5 text-[#2C2523]" />
                <h3 className="text-lg font-bold text-[#2C2523] font-serif">
                  Shopping Bag
                </h3>
                <span className="py-0.5 px-2 bg-[#F5EFEB] rounded-full text-xxs font-bold text-[#4A3728]">
                  {getCartCount()}
                </span>
              </div>
              <button
                onClick={() => setIsCartOpen(false)}
                className="p-2 hover:bg-[#F5EFEB] rounded-full text-[#4A3728] transition-colors cursor-pointer"
                aria-label="Close Cart"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {cart.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center text-[#A0958F]">
                  <ShoppingBag className="w-12 h-12 mb-3 text-[#EBE5E0]" />
                  <p className="text-sm font-semibold font-serif">
                    Your shopping bag is empty
                  </p>
                  <p className="text-xs mt-1">
                    Stitch your dream designs from our catalog.
                  </p>
                </div>
              ) : (
                cart.map((item) => (
                  <div
                    key={item.cartItemId}
                    className="flex gap-4 border-b border-[#FBEFEA] pb-4 last:border-b-0"
                  >
                    <div className="w-20 h-20 bg-[#F5EFEB] rounded-xl overflow-hidden flex-shrink-0">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-grow">
                      <div className="flex justify-between items-start mb-1 gap-2">
                        <h4 className="text-sm font-bold text-[#2C2523] font-serif leading-tight">
                          {item.name}
                        </h4>
                        <span className="text-sm font-semibold text-[#2C2523] whitespace-nowrap">
                          ${(item.price * item.quantity).toFixed(2)}
                        </span>
                      </div>

                      {item.customizable && (
                        <div className="flex flex-wrap gap-1.5 mb-3">
                          <span className="text-xxs bg-[#E0A996]/10 text-[#2C2523] px-1.5 py-0.5 rounded font-semibold border border-[#E0A996]/20">
                            Color: {item.yarnColor}
                          </span>
                          <span className="text-xxs bg-[#96A288]/10 text-[#96A288] px-1.5 py-0.5 rounded font-semibold border border-[#96A288]/20">
                            Size: {item.size}
                          </span>
                        </div>
                      )}

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5 border border-[#EBE5E0] rounded-lg px-1.5 py-0.5 bg-[#FDFBF7]">
                          <button
                            onClick={() => updateCartQty(item.cartItemId, -1)}
                            className="p-0.5 text-[#4A3728] hover:text-[#E0A996]"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="text-xs font-bold w-4 text-center text-[#2C2523]">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateCartQty(item.cartItemId, 1)}
                            className="p-0.5 text-[#4A3728] hover:text-[#E0A996]"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        <button
                          onClick={() => removeCartItem(item.cartItemId)}
                          className="text-[#A0958F] hover:text-red-500 transition-colors p-1"
                          aria-label="Remove item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Cart Footer */}
            {cart.length > 0 && (
              <div className="p-6 border-t border-[#F5EFEB] bg-[#FDFBF7] space-y-4">
                <div className="flex justify-between items-center text-sm font-semibold text-[#4A3728]">
                  <span>Subtotal</span>
                  <span className="text-lg font-bold text-[#2C2523]">
                    ${getCartTotal().toFixed(2)}
                  </span>
                </div>
                <p className="text-xxs text-[#A0958F]">
                  Taxes and shipping calculated at checkout. Every order is
                  hand-packaged with personalized care.
                </p>

                <button
                  onClick={handleCheckout}
                  disabled={isCheckingOut}
                  className="w-full py-4 px-6 bg-[#E0A996] hover:bg-[#CF9581] text-[#2C2523] font-bold rounded-2xl shadow-sm hover:shadow-md transition-all text-xs cursor-pointer flex items-center justify-center gap-2"
                >
                  {isCheckingOut ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      {user ? "Place Handcrafted Order" : "Log In to Order"}
                      <CheckCircle className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* CHECKOUT SUCCESS MODAL */}
      {checkoutSuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#2C2523]/50 backdrop-blur-sm">
          <div className="bg-white border border-[#FBEFEA] w-full max-w-md rounded-3xl p-8 text-center shadow-xl space-y-6">
            <div className="w-16 h-16 bg-[#96A288]/15 text-[#96A288] flex items-center justify-center rounded-full mx-auto animate-bounce">
              <CheckCircle className="w-10 h-10" />
            </div>
            <div className="space-y-2">
              <h3 className="text-2xl font-bold text-[#2C2523] font-serif">
                Order Received!
              </h3>
              <p className="text-sm text-[#4A3728] leading-relaxed">
                Thank you! Your order request has been received. We will begin
                crafting your items soon.
              </p>
              <div className="p-3 bg-[#F5EFEB] rounded-xl font-mono text-xs text-[#2C2523] mt-2">
                Order ID: {latestOrderId}
              </div>
            </div>
            <button
              onClick={() => {
                setCheckoutSuccess(false);
                setIsCartOpen(false);
              }}
              className="w-full py-3.5 px-6 bg-[#E0A996] hover:bg-[#CF9581] text-[#2C2523] font-bold rounded-2xl transition-colors text-xs cursor-pointer"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      )}

      {/* FLOATING CHAT BUBBLE */}
      <a
        href="https://web.facebook.com/p/Crochet-with-dilru-61553942184584/"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-40 bg-[#96A288] text-white py-3 px-5 rounded-full flex items-center gap-2 shadow-lg hover:bg-[#818D74] transition-all duration-300 chat-bubble-pulse group hover:scale-105"
      >
        <MessageCircle className="w-5 h-5 fill-white" />
        <span className="text-xs font-bold tracking-wide uppercase">
          Chat for Custom Orders
        </span>
      </a>
    </>
  );
}
