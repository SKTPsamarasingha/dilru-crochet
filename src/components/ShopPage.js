"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import {
  ShoppingBag,
  Heart,
  X,
  Plus,
  Minus,
  Trash2,
  CheckCircle,
  Search,
  SlidersHorizontal,
  Info,
  Loader2,
  ArrowLeft,
  Eye,
  Sparkles,
} from "lucide-react";

const CATEGORIES = ["All", "Apparel", "Decor", "Accessories", "Plushies"];
const SORT_OPTIONS = [
  { value: "newest", label: "Newest" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "name-asc", label: "Name: A–Z" },
];

const YARN_COLORS = [
  { name: "Original", hex: "#E8D5C4" },
  { name: "Sage Green", hex: "#96A288" },
  { name: "Soft Rose", hex: "#E4A0A0" },
  { name: "Cream White", hex: "#F5F0E8" },
  { name: "Cocoa Brown", hex: "#8B6914" },
];

const SIZES = ["S", "M", "L"];

const PriceBadge = ({ price, showLKRPrices }) => (
  <span className="font-bold text-[#2C2523] whitespace-nowrap text-sm bg-[#F5EFEB] py-0.5 px-2 rounded-lg">
    ${price.toFixed(2)}
  </span>
);

const PriceDisplay = ({ price, size = "md", showLKRPrices }) => (
  <span className={`${size === "lg" ? "text-xl" : "text-sm"} font-bold text-[#2C2523] bg-[#F5EFEB] py-0.5 px-2.5 rounded-lg`}>
    ${price.toFixed(2)}
  </span>
);

export default function ShopPage({ initialProducts = [] }) {
  const router = useRouter();
  const { user, fetchOrders } = useAuth();

  const [products, setProducts] = useState(initialProducts);
  const [loading, setLoading] = useState(!initialProducts.length);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [sortBy, setSortBy] = useState("newest");
  const [customizableOnly, setCustomizableOnly] = useState(false);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [wishlist, setWishlist] = useState([]);

  const [cart, setCart] = useState(() => {
    if (typeof window === "undefined") return [];

    try {
      const savedCart = localStorage.getItem("dilru_cart");
      return savedCart ? JSON.parse(savedCart) : [];
    } catch {
      return [];
    }
  });
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [customYarnColor, setCustomYarnColor] = useState("Original");
  const [customSize, setCustomSize] = useState("M");
  const [quantity, setQuantity] = useState(1);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [checkoutSuccess, setCheckoutSuccess] = useState(false);
  const [latestOrderId, setLatestOrderId] = useState("");

  useEffect(() => {
    if (initialProducts.length) return;

    let active = true;
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/products");
        const data = await res.json();
        if (active && data.success) setProducts(data.products);
      } catch (e) {
        console.error("Failed to load products:", e);
      } finally {
        if (active) setLoading(false);
      }
    };

    const timeoutId = window.setTimeout(() => {
      void fetchProducts();
    }, 0);

    return () => {
      active = false;
      window.clearTimeout(timeoutId);
    };
  }, [initialProducts]);

  const saveCart = (newCart) => {
    setCart(newCart);
    localStorage.setItem("dilru_cart", JSON.stringify(newCart));
    window.dispatchEvent(new Event("sync-cart"));
  };

  const filteredProducts = useMemo(() => {
    let result = products.filter((p) => {
      const q = search.toLowerCase();
      const matchesSearch =
        p.name?.toLowerCase().includes(q) ||
        p.description?.toLowerCase().includes(q) ||
        p.category?.toLowerCase().includes(q);
      const matchesCategory =
        activeCategory === "All" || p.category === activeCategory;
      const matchesCustomizable = !customizableOnly || p.customizable;
      const matchesStock = !inStockOnly || (p.stock ?? 0) > 0;
      return (
        matchesSearch && matchesCategory && matchesCustomizable && matchesStock
      );
    });

    result = [...result].sort((a, b) => {
      switch (sortBy) {
        case "price-asc":
          return (a.price || 0) - (b.price || 0);
        case "price-desc":
          return (b.price || 0) - (a.price || 0);
        case "name-asc":
          return (a.name || "").localeCompare(b.name || "");
        default: {
          const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
          const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
          return dateB - dateA;
        }
      }
    });

    return result;
  }, [products, search, activeCategory, sortBy, customizableOnly, inStockOnly]);

  const addToCart = (product, qty, color, size) => {
    const cartItemId = `${product.id}-${color}-${size}`;
    const existingIndex = cart.findIndex(
      (item) => item.cartItemId === cartItemId,
    );
    let newCart = [...cart];
    if (existingIndex > -1) {
      newCart[existingIndex].quantity += qty;
    } else {
      newCart.push({
        cartItemId,
        productId: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        customizable: product.customizable,
        yarnColor: color,
        size,
        quantity: qty,
      });
    }
    saveCart(newCart);
    setIsCartOpen(true);
    setSelectedProduct(null);
  };

  const updateCartQty = (cartItemId, change) => {
    saveCart(
      cart
        .map((item) =>
          item.cartItemId === cartItemId
            ? { ...item, quantity: item.quantity + change }
            : item,
        )
        .filter((item) => item.quantity > 0),
    );
  };

  const removeCartItem = (cartItemId) => {
    saveCart(cart.filter((item) => item.cartItemId !== cartItemId));
  };

  const getCartTotal = () =>
    cart.reduce((t, item) => t + item.price * item.quantity, 0);
  const getCartCount = () => cart.reduce((c, item) => c + item.quantity, 0);

  const handleCheckout = async () => {
    if (!user) {
      router.push("/login?callbackUrl=/shop");
      return;
    }
    setIsCheckingOut(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: cart, total: getCartTotal() }),
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
    } catch {
      alert("An error occurred during checkout. Please try again.");
    } finally {
      setIsCheckingOut(false);
    }
  };

  const openProduct = (product) => {
    setSelectedProduct(product);
    setCustomYarnColor("Original");
    setCustomSize(product.customizable ? "M" : "Standard");
    setQuantity(1);
  };

  const toggleWishlist = (productId, e) => {
    e.stopPropagation();
    e.preventDefault();
    if (wishlist.includes(productId)) {
      setWishlist(wishlist.filter((id) => id !== productId));
    } else {
      setWishlist([...wishlist, productId]);
    }
  };

  const clearFilters = () => {
    setSearch("");
    setActiveCategory("All");
    setSortBy("newest");
    setCustomizableOnly(false);
    setInStockOnly(false);
  };

  const hasActiveFilters =
    search ||
    activeCategory !== "All" ||
    customizableOnly ||
    inStockOnly ||
    sortBy !== "newest";

  return (
    <div className="flex flex-col min-h-screen bg-[#FDFBF7]">
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-12 space-y-10">
        <div className="section-shell rounded-[2rem] p-6 sm:p-8 bg-[#FCFAF7] border border-[#EBE5E0]/40">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div className="space-y-2">
              <Link
                href="/"
                className="mb-2 inline-flex items-center gap-1.5 text-xs font-bold text-[#A0958F]/60 hover:text-[#E0A996] transition-colors uppercase tracking-wider"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                Back to Home
              </Link>
              <div className="boutique-badge inline-flex items-center rounded-full px-3 py-1 text-[10px] font-extrabold uppercase tracking-[0.24em] text-[#96A288]">
                Small-batch handmade pieces
              </div>
              <h1 className="text-3xl font-bold text-[#2C2523] font-serif sm:text-4xl">
                Shop Collection
              </h1>
              <p className="text-sm leading-relaxed text-[#A0958F]">
                Browse a curated selection of handmade crochet pieces, from cozy cardigans to elegant floral gifts.
              </p>
            </div>
            <span className="self-start rounded-full bg-[#F5EFEB] px-4 py-2 text-xs font-bold text-[#2C2523] sm:self-auto">
              {filteredProducts.length} of {products.length} items
            </span>
          </div>
        </div>

        <div className="section-shell space-y-5 rounded-[2rem] p-6 sm:p-8 bg-[#FCFAF7] border border-[#EBE5E0]/40 shadow-sm">
          <div className="flex flex-col lg:flex-row gap-4 justify-between">
            <div className="relative flex-1 max-w-md">
              <input
                type="text"
                placeholder="Search products..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-[#FDFBF7] border border-[#EBE5E0] text-xs text-[#2C2523] placeholder-[#A0958F]/50 rounded-2xl focus:outline-none focus:border-[#E0A996] transition-all shadow-sm"
              />
              <Search className="absolute left-3.5 top-3.5 w-4 h-4 text-[#A0958F]/60" />
            </div>

            <div className="flex items-center gap-3">
              <SlidersHorizontal className="w-4 h-4 text-[#A0958F]/60 flex-shrink-0" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="py-3 px-4 bg-[#FDFBF7] border border-[#EBE5E0] text-xs text-[#2C2523] rounded-2xl focus:outline-none focus:border-[#E0A996] cursor-pointer shadow-sm font-medium"
              >
                {SORT_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    Sort by: {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex flex-wrap gap-2.5">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`py-2 px-4 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeCategory === cat
                    ? "bg-[#E0A996] text-[#2C2523] shadow-sm"
                    : "bg-[#FDFBF7] border border-[#EBE5E0] text-[#A0958F] hover:border-[#E0A996]/45"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-5 pt-3 border-t border-[#EBE5E0]/40">
            <label className="flex items-center gap-2 cursor-pointer text-xs text-[#A0958F] select-none font-medium">
              <input
                type="checkbox"
                checked={customizableOnly}
                onChange={(e) => setCustomizableOnly(e.target.checked)}
                className="w-4.5 h-4.5 rounded border-[#EBE5E0] text-[#E0A996] focus:ring-[#E0A996] bg-[#FDFBF7]"
              />
              <span>Customizable Only</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer text-xs text-[#A0958F] select-none font-medium">
              <input
                type="checkbox"
                checked={inStockOnly}
                onChange={(e) => setInStockOnly(e.target.checked)}
                className="w-4.5 h-4.5 rounded border-[#EBE5E0] text-[#E0A996] focus:ring-[#E0A996] bg-[#FDFBF7]"
              />
              <span>In Stock Only</span>
            </label>
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="text-xs font-bold text-[#E0A996] hover:text-[#CF9581] underline underline-offset-4 cursor-pointer ml-auto transition-colors"
              >
                Clear Filters
              </button>
            )}
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-24">
            <Loader2 className="w-9 h-9 animate-spin text-[#E0A996] mb-3" />
            <p className="text-sm font-semibold text-[#A0958F]">Loading collection...</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-24 bg-[#FCFAF7] border border-[#EBE5E0]/45 rounded-3xl max-w-xl mx-auto space-y-5 shadow-sm">
            <div className="p-4 bg-[#F5EFEB] rounded-full w-16 h-16 mx-auto">
              <ShoppingBag className="w-8 h-8 text-[#A0958F]/60" />
            </div>
            <h3 className="text-lg font-bold text-[#2C2523] font-serif">
              No products found
            </h3>
            <p className="text-sm text-[#A0958F] max-w-sm mx-auto px-4">
              Try adjusting your filters or search terms to explore other creations.
            </p>
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="py-3 px-6 bg-[#E0A996] hover:bg-[#CF9581] text-[#2C2523] font-bold rounded-xl text-xs cursor-pointer shadow-sm hover:scale-102 transition-all"
              >
                Clear All Filters
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {filteredProducts.map((product) => (
              <motion.div
                layout
                key={product.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="group flex flex-col relative bg-[#FDFBF7] border border-[#EBE5E0]/40 rounded-[2rem] overflow-hidden hover:shadow-xl hover:-translate-y-1.5 transition-all duration-500 shadow-sm"
              >
                <div className="relative aspect-[4/5] overflow-hidden bg-[#F5EFEB] border-b border-[#EBE5E0]/35">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-106"
                  />
                  
                  {product.customizable && (
                    <span className="absolute top-4 left-4 bg-[#96A288] text-white text-[10px] font-extrabold tracking-wide uppercase px-3 py-1 rounded-full shadow-sm">
                      Customizable
                    </span>
                  )}
                  
                  {(product.stock ?? 0) === 0 && (
                    <span className="absolute top-4 right-4 bg-red-50 text-red-600 text-[10px] font-extrabold tracking-wide uppercase px-3 py-1 rounded-full border border-red-100 shadow-sm">
                      Out of Stock
                    </span>
                  )}

                  <button
                    onClick={(e) => toggleWishlist(product.id, e)}
                    className="absolute top-4 right-4 p-2.5 bg-[#FDFBF7]/90 hover:bg-[#FDFBF7] rounded-full text-[#A0958F] hover:text-red-500 shadow-sm hover:scale-110 active:scale-90 transition-all duration-300 z-10 cursor-pointer"
                    aria-label="Add to Wishlist"
                  >
                    <Heart
                      className="w-4 h-4"
                      fill={wishlist.includes(product.id) ? "#EF4444" : "none"}
                      stroke={wishlist.includes(product.id) ? "#EF4444" : "currentColor"}
                    />
                  </button>

                  <div className="absolute inset-0 bg-[#2C2523]/20 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all duration-300 backdrop-blur-[2px]">
                    <button
                      onClick={() => openProduct(product)}
                      disabled={(product.stock ?? 0) === 0}
                      className="flex items-center gap-1.5 py-3 px-5 bg-[#FDFBF7]/95 hover:bg-[#E0A996] hover:text-[#2C2523] text-[#2C2523] font-bold rounded-2xl shadow-md text-xs hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      Quick View
                    </button>
                  </div>
                </div>

                <div className="flex flex-grow flex-col justify-between p-5 space-y-4">
                  <div className="space-y-2.5">
                    <span className="text-[10px] font-bold text-[#96A288] uppercase tracking-wider block">
                      {product.category}
                    </span>
                    <div className="flex items-start justify-between gap-3">
                      <h3 className="font-bold text-[#2C2523] group-hover:text-[#E0A996] transition-colors leading-snug text-base font-serif">
                        {product.name}
                      </h3>
                      <PriceBadge
                        price={product.price}
                        showLKRPrices={true}
                      />
                    </div>
                  </div>

                  <button
                    onClick={() => openProduct(product)}
                    disabled={(product.stock ?? 0) === 0}
                    className="w-full py-3 px-4 bg-[#F5EFEB] hover:bg-[#E0A996] hover:text-[#2C2523] text-[#2C2523] font-bold rounded-xl transition-all duration-300 text-xs text-center cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                  >
                    {(product.stock ?? 0) === 0 ? "Out of Stock" : "View Details"}
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </main>

      <AnimatePresence>
        {selectedProduct && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedProduct(null)}
              className="fixed inset-0 bg-[#2C2523]/50 backdrop-blur-sm cursor-pointer"
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 15 }}
              transition={{ type: "spring", damping: 25, stiffness: 220 }}
              className="bg-[#FDFBF7] border border-[#EBE5E0] w-full max-w-2xl rounded-[2rem] overflow-hidden shadow-2xl max-h-[90vh] flex flex-col md:flex-row relative z-10"
            >
              <button
                onClick={() => setSelectedProduct(null)}
                className="absolute top-4 right-4 p-2.5 bg-[#FDFBF7]/95 rounded-full hover:bg-red-50 text-[#2C2523] hover:text-red-500 transition-colors z-20 cursor-pointer shadow-sm border border-[#EBE5E0]/40"
                aria-label="Close details"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="w-full md:w-1/2 aspect-square md:aspect-auto bg-[#F5EFEB] relative h-64 md:h-auto border-r border-[#EBE5E0]/35">
                <img
                  src={selectedProduct.image}
                  alt={selectedProduct.name}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="w-full md:w-1/2 p-7 overflow-y-auto flex flex-col justify-between max-h-[50vh] md:max-h-none">
                <div className="space-y-4">
                  <span className="text-[#96A288] text-[10px] font-extrabold uppercase tracking-wider mb-1 block">
                    {selectedProduct.category}
                  </span>
                  <h3 className="text-2xl font-bold text-[#2C2523] font-serif leading-tight">
                    {selectedProduct.name}
                  </h3>
                  
                  <div className="flex items-center gap-3">
                    <PriceDisplay
                      price={selectedProduct.price}
                      size="lg"
                      showLKRPrices={true}
                    />
                    {selectedProduct.customizable && (
                      <span className="text-[10px] text-[#96A288] border border-[#96A288]/40 px-2.5 py-0.5 rounded-full font-bold uppercase">
                        Customizable
                      </span>
                    )}
                  </div>

                  <p className="text-xs leading-relaxed text-[#A0958F]/90">
                    {selectedProduct.description}
                  </p>

                  {selectedProduct.customizable ? (
                    <div className="space-y-4 border-t border-[#EBE5E0]/45 pt-4">
                      <div>
                        <label className="block text-[10px] font-bold text-[#2C2523] uppercase tracking-wide mb-2">
                          Select Yarn Color
                        </label>
                        <div className="flex flex-wrap items-center gap-2.5">
                          {YARN_COLORS.map((color) => (
                            <button
                              key={color.name}
                              type="button"
                              title={color.name}
                              aria-label={color.name}
                              onClick={() => setCustomYarnColor(color.name)}
                              className="cursor-pointer group relative"
                            >
                              <span
                                className={`block w-8.5 h-8.5 rounded-full border-2 shadow-sm transition-all duration-300 ${
                                  customYarnColor === color.name
                                    ? "border-[#E0A996] ring-2 ring-[#E0A996]/30 scale-108"
                                    : "border-white ring-1 ring-[#EBE5E0] hover:ring-[#E0A996]/40 group-hover:scale-104"
                                }`}
                                style={{ backgroundColor: color.hex }}
                              />
                            </button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-[#2C2523] uppercase tracking-wide mb-2">
                          Select Size
                        </label>
                        <div className="flex gap-2">
                          {SIZES.map((size) => (
                            <button
                              key={size}
                              type="button"
                              onClick={() => setCustomSize(size)}
                              className={`w-10 h-10 text-xs font-bold border rounded-xl transition-all duration-300 cursor-pointer ${
                                customSize === size
                                  ? "border-[#E0A996] bg-[#E0A996] text-[#2C2523] shadow-sm scale-102"
                                  : "border-[#EBE5E0] bg-[#FDFBF7] text-[#A0958F] hover:border-[#E0A996]/50"
                              }`}
                            >
                              {size}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-[10px] text-[#A0958F]/70 font-semibold italic border-t border-[#EBE5E0]/45 pt-4 flex items-center gap-1">
                      <Info className="w-3.5 h-3.5 text-[#E0A996]" />
                      Standard size. Contact us for custom sizing requests.
                    </div>
                  )}
                </div>

                <div className="border-t border-[#EBE5E0]/45 pt-4 mt-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#2C2523]">
                      Quantity
                    </span>
                    <div className="flex items-center gap-3 border border-[#EBE5E0] rounded-xl px-2.5 py-1 bg-[#FDFBF7]/50">
                      <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="p-1 text-[#A0958F] hover:text-[#E0A996] transition-colors cursor-pointer"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="text-xs font-extrabold w-4 text-center text-[#2C2523]">
                        {quantity}
                      </span>
                      <button
                        onClick={() => setQuantity(quantity + 1)}
                        className="p-1 text-[#A0958F] hover:text-[#E0A996] transition-colors cursor-pointer"
                        aria-label="Increase quantity"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>

                  <button
                    onClick={() =>
                      addToCart(
                        selectedProduct,
                        quantity,
                        customYarnColor,
                        customSize,
                      )
                    }
                    className="w-full py-4 px-6 bg-[#E0A996] hover:bg-[#CF9581] text-[#2C2523] font-bold rounded-2xl shadow-sm hover:shadow hover:scale-[1.01] active:scale-[0.99] transition-all text-xs cursor-pointer flex items-center justify-center gap-2"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    Add to Cart
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isCartOpen && (
          <div className="fixed inset-0 z-50 flex justify-end">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCartOpen(false)}
              className="fixed inset-0 bg-[#2C2523]/50 backdrop-blur-sm cursor-pointer"
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 220 }}
              className="relative w-full max-w-md bg-[#FDFBF7] h-full shadow-2xl flex flex-col border-l border-[#EBE5E0]"
            >
              <div className="p-6 border-b border-[#EBE5E0] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5 text-[#2C2523]" />
                  <h3 className="text-lg font-bold text-[#2C2523] font-serif">
                    Shopping Bag
                  </h3>
                  <span className="py-0.5 px-2 bg-[#F5EFEB] rounded-full text-xxs font-extrabold text-[#A0958F]">
                    {getCartCount()}
                  </span>
                </div>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="p-2 hover:bg-[#F5EFEB] rounded-full text-[#A0958F] hover:text-[#2C2523] transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {cart.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-center text-[#A0958F] space-y-4">
                    <div className="p-4 bg-[#F5EFEB] rounded-full">
                      <ShoppingBag className="w-10 h-10 text-[#A0958F]/60" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold font-serif text-[#2C2523]">
                        Your shopping bag is empty
                      </p>
                      <p className="text-xs mt-1 text-[#A0958F]/80">
                        Explore our handcrafted designs to find your perfect pieces.
                      </p>
                    </div>
                    <button
                      onClick={() => setIsCartOpen(false)}
                      className="py-2.5 px-6 bg-[#E0A996] hover:bg-[#CF9581] text-[#2C2523] font-bold rounded-xl text-xs shadow-sm transition-all cursor-pointer hover:scale-102 active:scale-98"
                    >
                      Shop Collection
                    </button>
                  </div>
                ) : (
                  cart.map((item) => (
                    <motion.div
                      layout
                      key={item.cartItemId}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="flex gap-4 border-b border-[#EBE5E0]/40 pb-4 last:border-b-0 last:pb-0"
                    >
                      <div className="w-20 h-20 bg-[#F5EFEB] rounded-2xl overflow-hidden flex-shrink-0 border border-[#EBE5E0]/35">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-grow flex flex-col justify-between py-0.5">
                        <div>
                          <div className="flex justify-between items-start gap-2">
                            <h4 className="text-sm font-bold text-[#2C2523] font-serif leading-snug">
                              {item.name}
                            </h4>
                            <span className="text-sm font-bold text-[#2C2523] whitespace-nowrap">
                              ${(item.price * item.quantity).toFixed(2)}
                            </span>
                          </div>
                          {item.customizable && (
                            <div className="flex flex-wrap gap-1.5 mt-1.5">
                              <span className="text-xxs bg-[#E0A996]/10 text-[#2C2523] px-2 py-0.5 rounded-full font-semibold border border-[#E0A996]/20">
                                Color: {item.yarnColor}
                              </span>
                              <span className="text-xxs bg-[#96A288]/15 text-[#2C2523] px-2 py-0.5 rounded-full font-semibold border border-[#96A288]/20">
                                Size: {item.size}
                              </span>
                            </div>
                          )}
                        </div>

                        <div className="flex items-center justify-between mt-2.5">
                          <div className="flex items-center gap-2 border border-[#EBE5E0] rounded-xl px-2 py-1 bg-[#FDFBF7]/50">
                            <button
                              onClick={() => updateCartQty(item.cartItemId, -1)}
                              className="p-0.5 text-[#A0958F] hover:text-[#E0A996] transition-colors"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="text-xs font-bold w-4 text-center text-[#2C2523]">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateCartQty(item.cartItemId, 1)}
                              className="p-0.5 text-[#A0958F] hover:text-[#E0A996] transition-colors"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                          <button
                            onClick={() => removeCartItem(item.cartItemId)}
                            className="text-[#A0958F]/60 hover:text-red-500 transition-colors p-1.5 hover:bg-red-50 rounded-lg cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>

              {cart.length > 0 && (
                <div className="p-6 border-t border-[#EBE5E0] bg-[#FFFDFB] space-y-4 shadow-[0_-8px_30px_rgba(43,43,43,0.02)]">
                  <div className="p-3 bg-[#F5EFEB]/30 border border-[#EBE5E0]/60 rounded-xl text-xxs text-[#A0958F] font-medium flex items-center gap-2">
                    <Sparkles className="w-3.5 h-3.5 text-[#E0A996] flex-shrink-0" />
                    <span>Free shipping included on orders with customized cardigans.</span>
                  </div>

                  <div className="flex justify-between items-center text-sm font-semibold text-[#A0958F]">
                    <span>Subtotal</span>
                    <span className="text-lg font-bold text-[#2C2523]">
                      ${getCartTotal().toFixed(2)}
                    </span>
                  </div>
                  <p className="text-xxs text-[#A0958F]/70 leading-normal">
                    Custom order items are hand-stitched. Standard processing takes 3–5 days. Delivery charges calculated at checkout.
                  </p>

                  <button
                    onClick={handleCheckout}
                    disabled={isCheckingOut}
                    className="w-full py-4 px-6 bg-[#E0A996] hover:bg-[#CF9581] text-[#2C2523] font-bold rounded-2xl shadow-sm hover:shadow transition-all text-xs cursor-pointer flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-75"
                  >
                    {isCheckingOut ? (
                      <Loader2 className="w-4 h-4 animate-spin text-[#2C2523]" />
                    ) : (
                      <>
                        {user ? "Place Handcrafted Order" : "Log In to Order"}
                        <CheckCircle className="w-4 h-4 text-[#2C2523]" />
                      </>
                    )}
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {checkoutSuccess && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-[#2C2523]/50 backdrop-blur-sm"
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative bg-[#FDFBF7] border border-[#EBE5E0] w-full max-w-md rounded-3xl p-8 text-center shadow-xl space-y-6 z-10"
            >
              <div className="w-16 h-16 bg-[#96A288]/20 text-[#96A288] flex items-center justify-center rounded-full mx-auto shadow-sm">
                <CheckCircle className="w-9 h-9" />
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-bold text-[#2C2523] font-serif">
                  Order Received!
                </h3>
                <p className="text-sm text-[#A0958F] leading-relaxed">
                  Thank you! Your handcrafted order is queued. Stitched with love.
                </p>
                <div className="p-3 bg-[#F5EFEB]/40 rounded-2xl font-mono text-xs text-[#2C2523] mt-2 border border-[#EBE5E0]/30">
                  Order ID: {latestOrderId}
                </div>
              </div>
              <button
                onClick={() => {
                  setCheckoutSuccess(false);
                  setIsCartOpen(false);
                }}
                className="w-full py-3.5 bg-[#F5EFEB] hover:bg-[#E0A996]/20 text-[#2C2523] font-bold rounded-2xl text-xs cursor-pointer transition-colors"
              >
                Continue Shopping
              </button>
              <Link
                href="/my-orders"
                onClick={() => {
                  setCheckoutSuccess(false);
                  setIsCartOpen(false);
                }}
                className="block w-full py-3.5 bg-[#E0A996] hover:bg-[#CF9581] text-[#2C2523] font-bold rounded-2xl text-xs text-center transition-colors shadow-sm"
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
