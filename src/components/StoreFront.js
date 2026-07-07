"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
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
  ExternalLink,
  Info,
  Loader2,
  Sparkles,
  ShoppingBag as CartIcon
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
  const [products, setProducts] = useState(initialProducts);
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [customYarnColor, setCustomYarnColor] = useState("Original");
  const [customSize, setCustomSize] = useState("M");
  const [quantity, setQuantity] = useState(1);
  
  // Checkout states
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [checkoutSuccess, setCheckoutSuccess] = useState(false);
  const [latestOrderId, setLatestOrderId] = useState("");

  // Sync products if server props change
  useEffect(() => {
    setProducts(initialProducts);
  }, [initialProducts]);

  // Load cart from localStorage
  useEffect(() => {
    const savedCart = localStorage.getItem("dilru_cart");
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (e) {
        console.error("Failed to parse cart");
      }
    }
  }, []);

  // Save cart to localStorage
  const saveCart = (newCart) => {
    setCart(newCart);
    localStorage.setItem("dilru_cart", JSON.stringify(newCart));
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
    setSelectedProduct(null); // Close modal if open
  };

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
      // Redirect to login with callback back to home
      router.push("/login?callbackUrl=/");
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
        saveCart([]);
        fetchOrders();
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

  return (
    <div className="flex flex-col min-h-screen">
      {/* 1. HEADER */}
      <header className="sticky top-0 z-40 w-full bg-[#FDFBF7]/90 backdrop-blur-md border-b border-[#F5EFEB]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <Heart className="w-6 h-6 text-[#E0A996] transition-transform group-hover:scale-110" fill="#E0A996" />
            <span className="text-xl sm:text-2xl font-bold tracking-tight text-[#2C2523] font-serif">
              Crochet with Dilru
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-[#4A3728]">
            <Link href="/shop" className="hover:text-[#E0A996] transition-colors">Shop Collection</Link>
            <a href="#how-it-works" className="hover:text-[#E0A996] transition-colors">How It Works</a>
            <a href="#about" className="hover:text-[#E0A996] transition-colors">Our Story</a>
            <a href="#community" className="hover:text-[#E0A996] transition-colors">Community</a>
          </nav>

          <div className="flex items-center gap-4">
            {/* User Account / Navigation */}
            {user ? (
              <div className="flex items-center gap-3 text-sm">
                <span className="hidden sm:inline-block text-[#4A3728]">
                  Hello, <strong className="text-[#2C2523]">{user.name}</strong>
                </span>
                <Link
                  href="/my-orders"
                  className="py-2 px-3.5 bg-[#F5EFEB] hover:bg-[#EBE5E0] text-[#2C2523] font-semibold rounded-full transition-colors text-xs"
                >
                  My Orders
                </Link>
                {isAdmin && (
                  <Link
                    href="/admin"
                    className="py-2 px-3.5 bg-[#96A288] hover:bg-[#818D74] text-white font-semibold rounded-full transition-colors text-xs"
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

            {/* Cart Trigger */}
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

      <main className="flex-1">
        {/* 2. HERO SECTION */}
        <section className="relative overflow-hidden py-16 sm:py-24 bg-[#FDFBF7] border-b border-[#F5EFEB]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
              {/* Left text column */}
              <div className="lg:col-span-7 space-y-6 sm:space-y-8 text-center lg:text-left">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#F5EFEB] rounded-full text-xs font-semibold text-[#96A288] tracking-wide">
                  <Sparkles className="w-3.5 h-3.5" />
                  100% Handcrafted Premium Crochet
                </div>
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[#2C2523] leading-tight font-serif">
                  Handcrafted with Love, <br className="hidden sm:inline" />Stitched for You.
                </h1>
                <p className="max-w-2xl mx-auto lg:mx-0 text-base sm:text-lg text-[#4A3728] leading-relaxed">
                  Premium custom-order crochet cardigans, accessories, and bouquets made completely by hand. Every piece is unique, tailored to your choice of colors and sizes.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                  <Link
                    href="/shop"
                    className="py-4 px-8 bg-[#E0A996] hover:bg-[#CF9581] text-[#2C2523] font-bold rounded-full transition-all duration-300 text-center shadow-sm hover:shadow-md"
                  >
                    Browse Collection
                  </Link>
                  <a
                    href="https://web.facebook.com/p/Crochet-with-dilru-61553942184584/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 py-4 px-8 border-2 border-[#E0A996] text-[#2C2523] hover:bg-[#E0A996]/10 font-bold rounded-full transition-all duration-300 text-center"
                  >
                    Request Custom Order
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </div>
              {/* Right image column */}
              <div className="lg:col-span-5 flex justify-center">
                <div className="relative w-full max-w-md aspect-square rounded-3xl overflow-hidden border-8 border-white shadow-xl rotate-1 sm:rotate-2 hover:rotate-0 transition-transform duration-500 ease-out">
                  <img
                    src="https://images.unsplash.com/photo-1618220179428-22790b461013?q=80&w=600&auto=format&fit=crop"
                    alt="Handmade crochet stitch detail cardigan"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-4 right-4 py-2.5 px-4 bg-white/95 backdrop-blur-sm rounded-2xl shadow-sm text-xs font-bold text-[#2C2523] border border-[#FBEFEA] flex items-center gap-1.5">
                    <Heart className="w-3.5 h-3.5 text-[#E0A996]" fill="#E0A996" />
                    Stitched by Hand
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 3. HOW IT WORKS */}
        <section id="how-it-works" className="py-16 bg-[#FDFBF7]/50 border-b border-[#F5EFEB]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#2C2523] font-serif">
                How It Works
              </h2>
              <p className="mt-3 text-[#4A3728] text-sm sm:text-base">
                Getting your custom handcrafted crochet creations is simple and personalized.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-12">
              <div className="flex flex-col items-center text-center p-6 bg-[#FDFBF7] border border-[#F5EFEB] rounded-3xl shadow-xxs hover-lift">
                <div className="w-14 h-14 bg-[#E0A996]/15 text-[#E0A996] flex items-center justify-center rounded-2xl mb-5">
                  <Sparkles className="w-7 h-7" />
                </div>
                <h3 className="text-lg font-bold text-[#2C2523] mb-2 font-serif">1. Pick Your Design</h3>
                <p className="text-sm text-[#4A3728] leading-relaxed">
                  Browse our artisanal collection of cozy sweaters, flower bouquets, and accessories, selecting your preferred style.
                </p>
              </div>

              <div className="flex flex-col items-center text-center p-6 bg-[#FDFBF7] border border-[#F5EFEB] rounded-3xl shadow-xxs hover-lift">
                <div className="w-14 h-14 bg-[#96A288]/15 text-[#96A288] flex items-center justify-center rounded-2xl mb-5">
                  <Scissors className="w-7 h-7" />
                </div>
                <h3 className="text-lg font-bold text-[#2C2523] mb-2 font-serif">2. Customize Details</h3>
                <p className="text-sm text-[#4A3728] leading-relaxed">
                  Specify your favorite color combinations, yarn materials, and size requirements to make it uniquely yours.
                </p>
              </div>

              <div className="flex flex-col items-center text-center p-6 bg-[#FDFBF7] border border-[#F5EFEB] rounded-3xl shadow-xxs hover-lift">
                <div className="w-14 h-14 bg-[#E4A0A0]/15 text-[#E4A0A0] flex items-center justify-center rounded-2xl mb-5">
                  <Truck className="w-7 h-7" />
                </div>
                <h3 className="text-lg font-bold text-[#2C2523] mb-2 font-serif">3. Handcrafted Delivery</h3>
                <p className="text-sm text-[#4A3728] leading-relaxed">
                  We stitch your order complete with custom care, packing it with love, and deliver islandwide to your doorstep.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 4. FEATURED PRODUCTS (teaser) */}
        <section id="shop" className="py-16 sm:py-24 bg-[#FDFBF7]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row justify-between items-center mb-12 gap-4 text-center sm:text-left">
              <div>
                <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#2C2523] font-serif">
                  Featured Creations
                </h2>
                <p className="mt-2 text-[#4A3728] text-sm">
                  A preview of our handcrafted collection. Visit the shop to browse and filter all items.
                </p>
              </div>
              <Link
                href="/shop"
                className="py-2.5 px-5 bg-[#E0A996] hover:bg-[#CF9581] text-[#2C2523] font-semibold rounded-full text-xs transition-colors shadow-xxs"
              >
                View Full Shop →
              </Link>
            </div>

            {products.length === 0 ? (
              <div className="text-center py-20 bg-white border border-[#F5EFEB] rounded-3xl">
                <CartIcon className="w-12 h-12 mx-auto text-[#A0958F] mb-4" />
                <h3 className="text-lg font-semibold text-[#2C2523] font-serif">No products loaded</h3>
                <p className="text-sm text-[#4A3728] mt-1 mb-4">Please trigger seeding to populate the items.</p>
                <button
                  onClick={async () => {
                    const res = await fetch("/api/seed");
                    const data = await res.json();
                    if (data.success) {
                      router.refresh();
                      window.location.reload();
                    }
                  }}
                  className="py-2.5 px-6 bg-[#E0A996] hover:bg-[#CF9581] text-[#2C2523] font-semibold rounded-full text-sm"
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
                    className="group bg-white border border-[#FBEFEA] rounded-2xl overflow-hidden shadow-xxs hover:shadow-md transition-all duration-300 flex flex-col h-full"
                  >
                    {/* Image Container with hover zoom */}
                    <div className="relative aspect-square overflow-hidden bg-[#F5EFEB]">
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

                    <div className="p-5 flex flex-col flex-grow">
                      <div className="flex justify-between items-start mb-2 gap-2">
                        <h3 className="font-bold text-[#2C2523] group-hover:text-[#E0A996] transition-colors leading-tight text-base font-serif">
                          {product.name}
                        </h3>
                        <span className="font-bold text-[#2C2523] whitespace-nowrap text-sm bg-[#F5EFEB] py-0.5 px-2 rounded-lg">
                          ${product.price.toFixed(2)}
                        </span>
                      </div>
                      <p className="text-xs text-[#4A3728] line-clamp-2 mb-4 leading-relaxed flex-grow">
                        {product.description}
                      </p>
                      
                      <button
                        onClick={() => {
                          setSelectedProduct(product);
                          setCustomYarnColor("Original");
                          setCustomSize(product.customizable ? "M" : "Standard");
                          setQuantity(1);
                        }}
                        className="w-full py-2.5 px-4 bg-[#F5EFEB] hover:bg-[#E0A996] hover:text-[#2C2523] text-[#2C2523] font-semibold rounded-xl transition-all duration-200 text-xs text-center cursor-pointer"
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
                    className="inline-flex py-3 px-8 bg-[#F5EFEB] hover:bg-[#E0A996] text-[#2C2523] font-semibold rounded-full text-sm transition-colors"
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
        <section id="about" className="py-16 sm:py-24 bg-[#F5EFEB]/40 border-t border-b border-[#F5EFEB]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="aspect-4/3 rounded-3xl overflow-hidden shadow-md">
                <img
                  src="https://images.unsplash.com/photo-1526047932273-341f2a7631f9?q=80&w=600&auto=format&fit=crop"
                  alt="Crochet yarn workspace floral"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="space-y-6">
                <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#E0A996]">
                  <Heart className="w-3.5 h-3.5" fill="#E0A996" /> Our Story
                </div>
                <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#2C2523] font-serif">
                  Every Stitch Tells a Story
                </h2>
                <p className="text-[#4A3728] text-sm sm:text-base leading-relaxed">
                  Welcome to <strong>Crochet with Dilru</strong>. What began as a personal hobby of hand-knitting gifts for family blossomed into a boutique small business. We specialize in slow-fashion apparel, sustainable accessories, and everlasting crochet flower bouquets.
                </p>
                <p className="text-[#4A3728] text-sm sm:text-base leading-relaxed">
                  Every item is made to order by hand in Sri Lanka, using premium selected cotton and acrylic blends. We believe in slow crafts, details, and creating items that can be cherished forever.
                </p>
                <div className="pt-4 border-t border-[#EBE5E0] grid grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-2xl font-bold text-[#2C2523] font-serif">100%</h4>
                    <p className="text-xs text-[#4A3728]">Handcrafted Items</p>
                  </div>
                  <div>
                    <h4 className="text-2xl font-bold text-[#2C2523] font-serif">No Waste</h4>
                    <p className="text-xs text-[#4A3728]">Made-to-order production</p>
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
              <h2 className="text-3xl font-bold tracking-tight text-[#2C2523] font-serif">
                Made for Our Community
              </h2>
              <p className="mt-2 text-[#4A3728] text-sm">
                Tag <span className="font-semibold text-[#E0A996]">@crochet_with_dilru</span> on social media to get featured!
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="relative aspect-square rounded-2xl overflow-hidden border border-[#F5EFEB] group bg-[#FBEFEA] cursor-pointer">
                <img
                  src="https://images.unsplash.com/photo-1544816155-12df9643f363?q=80&w=600&auto=format&fit=crop"
                  alt="Customer feature tote bag"
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-[#2C2523]/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-white text-xs font-semibold">
                  <FacebookIcon className="w-5 h-5 mr-1" /> View Post
                </div>
              </div>
              <div className="relative aspect-square rounded-2xl overflow-hidden border border-[#F5EFEB] group bg-[#FBEFEA] cursor-pointer">
                <img
                  src="https://images.unsplash.com/photo-1596436889106-be35e843f974?q=80&w=600&auto=format&fit=crop"
                  alt="Customer feature flowers"
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-[#2C2523]/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-white text-xs font-semibold">
                  <FacebookIcon className="w-5 h-5 mr-1" /> View Post
                </div>
              </div>
              <div className="relative aspect-square rounded-2xl overflow-hidden border border-[#F5EFEB] group bg-[#FBEFEA] cursor-pointer">
                <img
                  src="https://images.unsplash.com/photo-1584992236310-6edddc085ff8?q=80&w=600&auto=format&fit=crop"
                  alt="Customer feature beanie"
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-[#2C2523]/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-white text-xs font-semibold">
                  <FacebookIcon className="w-5 h-5 mr-1" /> View Post
                </div>
              </div>
              <div className="relative aspect-square rounded-2xl overflow-hidden border border-[#F5EFEB] group bg-[#FBEFEA] cursor-pointer">
                <img
                  src="https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?q=80&w=600&auto=format&fit=crop"
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

      {/* 7. FOOTER */}
      <footer className="bg-[#2C2523] text-[#FDFBF7] py-12 border-t border-[#4A3728]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Heart className="w-5 h-5 text-[#E0A996]" fill="#E0A996" />
                <span className="font-bold text-lg tracking-tight font-serif">Crochet with Dilru</span>
              </div>
              <p className="text-xs text-[#A0958F] leading-relaxed">
                Handcrafted premium boutique creations made to order. Tailored with care in Sri Lanka.
              </p>
            </div>
            
            <div>
              <h4 className="font-bold text-sm text-[#E0A996] mb-4 font-serif uppercase tracking-wide">Shop</h4>
              <ul className="space-y-2 text-xs text-[#A0958F]">
                <li><Link href="/shop" className="hover:text-white transition-colors">Apparel</Link></li>
                <li><Link href="/shop" className="hover:text-white transition-colors">Decorations</Link></li>
                <li><Link href="/shop" className="hover:text-white transition-colors">Accessories</Link></li>
                <li><Link href="/shop" className="hover:text-white transition-colors">Custom orders</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-sm text-[#E0A996] mb-4 font-serif uppercase tracking-wide">Information</h4>
              <ul className="space-y-2 text-xs text-[#A0958F]">
                <li><a href="#how-it-works" className="hover:text-white transition-colors">Ordering Process</a></li>
                <li><a href="#about" className="hover:text-white transition-colors">Materials & Care</a></li>
                <li><a href="#how-it-works" className="hover:text-white transition-colors">Delivery Options</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-sm text-[#E0A996] mb-4 font-serif uppercase tracking-wide">Contact Us</h4>
              <p className="text-xs text-[#A0958F] leading-relaxed mb-4">
                Message us on Facebook or WhatsApp for custom designs, corporate gifts, or special orders.
              </p>
              <div className="flex gap-4">
                <a
                  href="https://web.facebook.com/p/Crochet-with-dilru-61553942184584/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 bg-[#4A3728] hover:bg-[#E0A996] hover:text-[#2C2523] rounded-full transition-colors text-[#FDFBF7]"
                  aria-label="Facebook Page"
                >
                  <FacebookIcon className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>
          
          <div className="mt-8 pt-8 border-t border-[#4A3728] text-center text-xxs text-[#A0958F]">
            © {new Date().getFullYear()} Crochet with Dilru. All rights reserved. Handcrafted by Dilru.
          </div>
        </div>
      </footer>

      {/* 8. DETAIL MODAL */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#2C2523]/50 backdrop-blur-sm">
          <div className="bg-white border border-[#FBEFEA] w-full max-w-2xl rounded-3xl overflow-hidden shadow-xl max-h-[90vh] flex flex-col sm:flex-row relative">
            <button
              onClick={() => setSelectedProduct(null)}
              className="absolute top-4 right-4 p-2 bg-white/90 rounded-full hover:bg-red-50 text-[#2C2523] hover:text-red-500 transition-colors z-10 cursor-pointer shadow-sm"
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
              <h3 className="text-2xl font-bold text-[#2C2523] mb-2 font-serif leading-tight">
                {selectedProduct.name}
              </h3>
              <div className="flex items-center gap-3 mb-4">
                <span className="text-xl font-bold text-[#2C2523] bg-[#F5EFEB] py-0.5 px-2.5 rounded-lg">
                  ${selectedProduct.price.toFixed(2)}
                </span>
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
                    <label className="block text-xxs font-bold text-[#2C2523] uppercase tracking-wide mb-2">
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
                                ? "border-[#E0A996] ring-2 ring-[#E0A996]/30 scale-110"
                                : "border-white ring-1 ring-[#EBE5E0] hover:ring-[#A0958F] hover:scale-105"
                            }`}
                            style={{ backgroundColor: color.hex }}
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xxs font-bold text-[#2C2523] uppercase tracking-wide mb-2">
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
                              ? "border-[#E0A996] bg-[#E0A996] text-[#2C2523]"
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
                  <span className="text-xs font-semibold text-[#2C2523]">Quantity</span>
                  <div className="flex items-center gap-3 border border-[#EBE5E0] rounded-xl px-2 py-1 bg-[#FDFBF7]">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="p-1 text-[#4A3728] hover:text-[#E0A996]"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="text-sm font-bold w-4 text-center text-[#2C2523]">{quantity}</span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="p-1 text-[#4A3728] hover:text-[#E0A996]"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <button
                  onClick={() => addToCart(selectedProduct, quantity, customYarnColor, customSize)}
                  className="w-full py-3.5 px-6 bg-[#E0A996] hover:bg-[#CF9581] text-[#2C2523] font-bold rounded-2xl shadow-sm hover:shadow-md transition-all text-xs cursor-pointer flex items-center justify-center gap-2"
                >
                  <ShoppingBag className="w-4 h-4" />
                  Add to Custom Cart
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 9. SLIDE-OUT CART DRAWER */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-[#2C2523]/40 backdrop-blur-xxs">
          <div
            className="fixed inset-0 cursor-pointer"
            onClick={() => setIsCartOpen(false)}
          />
          <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col border-l border-[#F5EFEB]">
            <div className="p-6 border-b border-[#F5EFEB] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-5.5 h-5.5 text-[#2C2523]" />
                <h3 className="text-lg font-bold text-[#2C2523] font-serif">Shopping Bag</h3>
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

            {/* Cart Items List */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {cart.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center text-[#A0958F]">
                  <ShoppingBag className="w-12 h-12 mb-3 text-[#EBE5E0]" />
                  <p className="text-sm font-semibold font-serif">Your shopping bag is empty</p>
                  <p className="text-xs mt-1">Stitch your dream designs from our catalog.</p>
                </div>
              ) : (
                cart.map((item) => (
                  <div
                    key={item.cartItemId}
                    className="flex gap-4 border-b border-[#FBEFEA] pb-4 last:border-b-0"
                  >
                    <div className="w-20 h-20 bg-[#F5EFEB] rounded-xl overflow-hidden flex-shrink-0">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
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
                          <span className="text-xs font-bold w-4 text-center text-[#2C2523]">{item.quantity}</span>
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
                  <span className="text-lg font-bold text-[#2C2523]">${getCartTotal().toFixed(2)}</span>
                </div>
                <p className="text-xxs text-[#A0958F]">
                  Taxes and shipping calculated at checkout. Every order is hand-packaged with personalized care instructions.
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

      {/* 10. CHECKOUT SUCCESS MODAL */}
      {checkoutSuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#2C2523]/50 backdrop-blur-sm">
          <div className="bg-white border border-[#FBEFEA] w-full max-w-md rounded-3xl p-8 text-center shadow-xl space-y-6">
            <div className="w-16 h-16 bg-[#96A288]/15 text-[#96A288] flex items-center justify-center rounded-full mx-auto">
              <CheckCircle className="w-10 h-10" />
            </div>
            <div className="space-y-2">
              <h3 className="text-2xl font-bold text-[#2C2523] font-serif">Order Received!</h3>
              <p className="text-sm text-[#4A3728] leading-relaxed">
                Thank you for your order! Your request has been queued. We will start hand-stitching your items soon.
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
              className="w-full py-3.5 px-6 bg-[#F5EFEB] hover:bg-[#EBE5E0] text-[#2C2523] font-bold rounded-2xl transition-colors text-xs cursor-pointer"
            >
              Continue Shopping
            </button>
            <Link
              href="/my-orders"
              onClick={() => {
                setCheckoutSuccess(false);
                setIsCartOpen(false);
              }}
              className="block w-full py-3.5 px-6 bg-[#E0A996] hover:bg-[#CF9581] text-[#2C2523] font-bold rounded-2xl transition-colors text-xs text-center"
            >
              View My Orders
            </Link>
          </div>
        </div>
      )}

      {/* 11. FLOATING CHAT BUBBLE */}
      <a
        href="https://web.facebook.com/p/Crochet-with-dilru-61553942184584/"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-40 bg-[#96A288] text-white py-3 px-5 rounded-full flex items-center gap-2 shadow-lg hover:bg-[#818D74] transition-all duration-300 chat-bubble-pulse group hover:scale-105"
      >
        <MessageCircle className="w-5 h-5 fill-white" />
        <span className="text-xs font-bold tracking-wide uppercase">Chat for Custom Orders</span>
      </a>
    </div>
  );
}
