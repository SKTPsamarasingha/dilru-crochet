"use client";

import { useState, useEffect, useMemo } from "react";
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
  Search,
  SlidersHorizontal,
  Info,
  Loader2,
  ArrowLeft,
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

export default function ShopPage({ initialProducts = [] }) {
  const router = useRouter();
  const { user, signOut, fetchOrders, isAdmin } = useAuth();

  const [products, setProducts] = useState(initialProducts);
  const [loading, setLoading] = useState(!initialProducts.length);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [sortBy, setSortBy] = useState("newest");
  const [customizableOnly, setCustomizableOnly] = useState(false);
  const [inStockOnly, setInStockOnly] = useState(false);

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
      {/* Header */}
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

          <div className="flex items-center gap-4">
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
                    Admin
                  </Link>
                )}
                <button
                  onClick={async () => {
                    await signOut();
                    router.refresh();
                  }}
                  className="text-xs font-semibold text-[#4A3728] hover:text-red-600 cursor-pointer underline underline-offset-4"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <Link
                href="/login?callbackUrl=/shop"
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

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        {/* Page title */}
        <div className="section-shell rounded-[2rem] p-5 sm:p-6">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <Link
                href="/"
                className="mb-3 inline-flex items-center gap-1.5 text-xs font-semibold text-[#A0958F] transition-colors hover:text-[#E0A996]"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                Back to Home
              </Link>
              <div className="boutique-badge mb-3 inline-flex items-center rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.24em] text-[#96A288]">
                Small-batch handmade pieces
              </div>
              <h1 className="text-3xl font-bold text-[#2C2523] font-serif sm:text-4xl">
                Shop Collection
              </h1>
              <p className="mt-2 text-sm leading-relaxed text-[#4A3728]">
                Browse a curated selection of handmade crochet pieces, from cozy
                layers to elegant floral gifts.
              </p>
            </div>
            <span className="self-start rounded-full bg-[#F5EFEB] px-4 py-2 text-xs font-semibold text-[#4A3728] sm:self-auto">
              {filteredProducts.length} of {products.length} items
            </span>
          </div>
        </div>

        {/* Filters bar */}
        <div className="section-shell space-y-4 rounded-[1.6rem] p-4 sm:p-5">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="relative flex-1 max-w-md">
              <input
                type="text"
                placeholder="Search products..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 bg-[#FDFBF7] border border-[#EBE5E0] text-sm text-[#2C2523] placeholder-[#A0958F] rounded-xl focus:outline-none focus:border-[#E0A996] transition-all"
              />
              <Search className="absolute left-3 top-3 w-4 h-4 text-[#A0958F]" />
            </div>

            <div className="flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-[#A0958F] flex-shrink-0" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="py-2.5 px-3 bg-[#FDFBF7] border border-[#EBE5E0] text-xs text-[#2C2523] rounded-xl focus:outline-none focus:border-[#E0A996] cursor-pointer"
              >
                {SORT_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`py-1.5 px-3.5 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                  activeCategory === cat
                    ? "bg-[#E0A996] text-[#2C2523]"
                    : "bg-[#FDFBF7] border border-[#EBE5E0] text-[#4A3728] hover:border-[#A0958F]"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-4 pt-1 border-t border-[#F5EFEB]">
            <label className="flex items-center gap-2 cursor-pointer text-xs text-[#4A3728]">
              <input
                type="checkbox"
                checked={customizableOnly}
                onChange={(e) => setCustomizableOnly(e.target.checked)}
                className="w-4 h-4 rounded border-[#EBE5E0] text-[#E0A996] focus:ring-[#E0A996]"
              />
              <span className="font-semibold">Customizable only</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer text-xs text-[#4A3728]">
              <input
                type="checkbox"
                checked={inStockOnly}
                onChange={(e) => setInStockOnly(e.target.checked)}
                className="w-4 h-4 rounded border-[#EBE5E0] text-[#E0A996] focus:ring-[#E0A996]"
              />
              <span className="font-semibold">In stock only</span>
            </label>
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="text-xs font-semibold text-[#E0A996] hover:text-[#CF9581] underline underline-offset-2 cursor-pointer ml-auto"
              >
                Clear filters
              </button>
            )}
          </div>
        </div>

        {/* Product grid */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24">
            <Loader2 className="w-8 h-8 animate-spin text-[#E0A996] mb-3" />
            <p className="text-sm text-[#4A3728]">Loading collection...</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-20 bg-white border border-[#FBEFEA] rounded-2xl">
            <ShoppingBag className="w-12 h-12 mx-auto text-[#A0958F] mb-4" />
            <h3 className="text-lg font-semibold text-[#2C2523] font-serif">
              No products found
            </h3>
            <p className="text-sm text-[#4A3728] mt-1 mb-4">
              Try adjusting your filters or search term.
            </p>
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="py-2.5 px-6 bg-[#E0A996] hover:bg-[#CF9581] text-[#2C2523] font-semibold rounded-xl text-sm cursor-pointer"
              >
                Clear All Filters
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className="group boutique-card flex flex-col overflow-hidden rounded-[1.4rem] transition-all duration-300 hover:-translate-y-1"
              >
                <div className="relative aspect-square overflow-hidden bg-[#F5EFEB]">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  {product.customizable && (
                    <span className="absolute top-3 left-3 bg-[#96A288] text-white text-xxs font-bold uppercase px-2.5 py-1 rounded-full">
                      Customizable
                    </span>
                  )}
                  {(product.stock ?? 0) === 0 && (
                    <span className="absolute top-3 right-3 bg-red-50 text-red-700 text-xxs font-bold px-2.5 py-1 rounded-full border border-red-100">
                      Out of Stock
                    </span>
                  )}
                </div>
                <div className="p-5 flex flex-col flex-grow">
                  <span className="text-[10px] font-bold text-[#96A288] uppercase tracking-wide mb-1">
                    {product.category}
                  </span>
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
                    onClick={() => openProduct(product)}
                    disabled={(product.stock ?? 0) === 0}
                    className="w-full py-2.5 px-4 bg-[#F5EFEB] hover:bg-[#E0A996] hover:text-[#2C2523] text-[#2C2523] font-semibold rounded-xl transition-all text-xs cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {(product.stock ?? 0) === 0
                      ? "Out of Stock"
                      : "View Details"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Product detail modal */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#2C2523]/50 backdrop-blur-sm">
          <div className="bg-white border border-[#FBEFEA] w-full max-w-2xl rounded-3xl overflow-hidden shadow-xl max-h-[90vh] flex flex-col sm:flex-row relative">
            <button
              onClick={() => setSelectedProduct(null)}
              className="absolute top-4 right-4 p-2 bg-white/90 rounded-full hover:bg-red-50 text-[#2C2523] hover:text-red-500 transition-colors z-10 cursor-pointer shadow-sm"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="w-full sm:w-1/2 aspect-square sm:aspect-auto bg-[#F5EFEB] relative h-64 sm:h-auto">
              <img
                src={selectedProduct.image}
                alt={selectedProduct.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="w-full sm:w-1/2 p-6 overflow-y-auto flex flex-col">
              <span className="text-[#96A288] text-xxs font-bold uppercase tracking-wider mb-1">
                {selectedProduct.category}
              </span>
              <h3 className="text-2xl font-bold text-[#2C2523] mb-2 font-serif">
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
                  Standard size. Contact us for custom requests.
                </div>
              )}

              <div className="mt-auto border-t border-[#F5EFEB] pt-4 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-[#2C2523]">
                    Quantity
                  </span>
                  <div className="flex items-center gap-3 border border-[#EBE5E0] rounded-xl px-2 py-1 bg-[#FDFBF7]">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="p-1 text-[#4A3728]"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="text-sm font-bold w-4 text-center">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="p-1 text-[#4A3728]"
                    >
                      <Plus className="w-3.5 h-3.5" />
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
                  className="w-full py-3.5 px-6 bg-[#E0A996] hover:bg-[#CF9581] text-[#2C2523] font-bold rounded-2xl text-xs cursor-pointer flex items-center justify-center gap-2"
                >
                  <ShoppingBag className="w-4 h-4" />
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Cart drawer */}
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
                <h3 className="text-lg font-bold text-[#2C2523] font-serif">
                  Shopping Bag
                </h3>
                <span className="py-0.5 px-2 bg-[#F5EFEB] rounded-full text-xxs font-bold">
                  {getCartCount()}
                </span>
              </div>
              <button
                onClick={() => setIsCartOpen(false)}
                className="p-2 hover:bg-[#F5EFEB] rounded-full cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {cart.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center text-[#A0958F]">
                  <ShoppingBag className="w-12 h-12 mb-3 text-[#EBE5E0]" />
                  <p className="text-sm font-semibold font-serif">
                    Your bag is empty
                  </p>
                </div>
              ) : (
                cart.map((item) => (
                  <div
                    key={item.cartItemId}
                    className="flex gap-4 border-b border-[#FBEFEA] pb-4"
                  >
                    <div className="w-20 h-20 bg-[#F5EFEB] rounded-xl overflow-hidden flex-shrink-0">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-grow">
                      <div className="flex justify-between items-start mb-1">
                        <h4 className="text-sm font-bold text-[#2C2523] font-serif">
                          {item.name}
                        </h4>
                        <span className="text-sm font-semibold">
                          ${(item.price * item.quantity).toFixed(2)}
                        </span>
                      </div>
                      {item.customizable && (
                        <div className="flex flex-wrap gap-1.5 mb-3 text-xxs">
                          <span className="bg-[#E0A996]/10 px-1.5 py-0.5 rounded border border-[#E0A996]/20">
                            {item.yarnColor}
                          </span>
                          <span className="bg-[#96A288]/10 px-1.5 py-0.5 rounded border border-[#96A288]/20">
                            {item.size}
                          </span>
                        </div>
                      )}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 border border-[#EBE5E0] rounded-lg px-1.5 py-0.5">
                          <button
                            onClick={() => updateCartQty(item.cartItemId, -1)}
                            className="p-0.5"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="text-xs font-bold w-4 text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateCartQty(item.cartItemId, 1)}
                            className="p-0.5"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                        <button
                          onClick={() => removeCartItem(item.cartItemId)}
                          className="text-[#A0958F] hover:text-red-500 p-1"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
            {cart.length > 0 && (
              <div className="p-6 border-t border-[#F5EFEB] bg-[#FDFBF7] space-y-4">
                <div className="flex justify-between text-sm font-semibold">
                  <span>Subtotal</span>
                  <span className="text-lg font-bold">
                    ${getCartTotal().toFixed(2)}
                  </span>
                </div>
                <button
                  onClick={handleCheckout}
                  disabled={isCheckingOut}
                  className="w-full py-4 bg-[#E0A996] hover:bg-[#CF9581] text-[#2C2523] font-bold rounded-2xl text-xs cursor-pointer flex items-center justify-center gap-2 disabled:opacity-75"
                >
                  {isCheckingOut ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      {user ? "Place Order" : "Log In to Order"}
                      <CheckCircle className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Checkout success */}
      {checkoutSuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#2C2523]/50 backdrop-blur-sm">
          <div className="bg-white border border-[#FBEFEA] w-full max-w-md rounded-3xl p-8 text-center shadow-xl space-y-6">
            <div className="w-16 h-16 bg-[#96A288]/15 text-[#96A288] flex items-center justify-center rounded-full mx-auto">
              <CheckCircle className="w-10 h-10" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-[#2C2523] font-serif">
                Order Received!
              </h3>
              <p className="text-sm text-[#4A3728] mt-2">
                Your handcrafted order is queued.
              </p>
              <div className="p-3 bg-[#F5EFEB] rounded-xl font-mono text-xs mt-3">
                Order ID: {latestOrderId}
              </div>
            </div>
            <button
              onClick={() => {
                setCheckoutSuccess(false);
                setIsCartOpen(false);
              }}
              className="w-full py-3.5 bg-[#F5EFEB] hover:bg-[#EBE5E0] text-[#2C2523] font-bold rounded-2xl text-xs cursor-pointer"
            >
              Continue Shopping
            </button>
            <Link
              href="/my-orders"
              onClick={() => {
                setCheckoutSuccess(false);
                setIsCartOpen(false);
              }}
              className="block w-full py-3.5 bg-[#E0A996] hover:bg-[#CF9581] text-[#2C2523] font-bold rounded-2xl text-xs text-center"
            >
              View My Orders
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
