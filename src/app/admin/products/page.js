"use client";

import { useState, useEffect, useRef } from "react";
import {
  Plus,
  Edit3,
  Trash2,
  Loader2,
  X,
  Save,
  AlertCircle,
  Check,
  Scissors,
  Package,
  ImagePlus,
  Upload,
} from "lucide-react";
import AdminSearchFilterBar from "@/components/AdminSearchFilterBar";
import LoginPage from "@/app/(public)/login/page";

export default function AdminProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // Search & Filters
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  // Form Modals
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formLoading, setFormLoading] = useState(false);

  // Form Fields
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("Apparel");
  const [image, setImage] = useState(""); // stored path/URL in DB
  const [imageFile, setImageFile] = useState(null); // new file selected by admin
  const [imagePreview, setImagePreview] = useState(""); // object URL for preview
  const [imageDragging, setImageDragging] = useState(false);
  const imageInputRef = useRef(null);
  const [stock, setStock] = useState("");
  const [customizable, setCustomizable] = useState(true);

  // Fetch products
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/products");
      const data = await res.json();
      console.log(data);
      
      if (data.success) {
        setProducts(data.products);
      } else {
        setError(data.error || "Failed to load products");
      }
    } catch (err) {
      setError("An error occurred while loading products.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void fetchProducts();
    }, 0);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, []);

  const openAddForm = () => {
    setEditingProduct(null);
    setName("");
    setDescription("");
    setPrice("");
    setCategory("Apparel");
    setImage("");
    setImageFile(null);
    setImagePreview("");
    setStock("10");
    setCustomizable(true);
    setError("");
    setIsFormOpen(true);
  };

  const openEditForm = (product) => {
    setEditingProduct(product);
    setName(product.name);
    setDescription(product.description || "");
    setPrice(product.price.toString());
    setCategory(product.category);
    setImage(product.image || "");
    setImageFile(null);
    setImagePreview(product.image || "");
    setStock(product.stock.toString());
    setCustomizable(product.customizable);
    setError("");
    setIsFormOpen(true);
  };

  // Handle image file selection (from input or drag-and-drop)
  const handleImageFile = (file) => {
    if (!file) return;
    const allowed = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    if (!allowed.includes(file.type)) {
      setError("Invalid image type. Use JPEG, PNG, WebP, or GIF.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError("Image must be under 5 MB.");
      return;
    }
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
    setError("");
  };

  const handleImageInputChange = (e) => {
    handleImageFile(e.target.files?.[0] ?? null);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setImageDragging(false);
    handleImageFile(e.dataTransfer.files?.[0] ?? null);
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview("");
    setImage("");
    if (imageInputRef.current) imageInputRef.current.value = "";
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setError("");
    setFormLoading(true);

    if (!name || !price || !category) {
      setError("Please fill out name, price, and category.");
      setFormLoading(false);
      return;
    }

    try {
      // Step 1: Upload new image file if one was selected
      let resolvedImage = image.trim() || undefined;
      if (imageFile) {
        const uploadForm = new FormData();
        uploadForm.append("file", imageFile);
        const uploadRes = await fetch("/api/upload", {
          method: "POST",
          body: uploadForm,
        });
        const uploadData = await uploadRes.json();
        if (!uploadData.success) {
          setError(uploadData.error || "Image upload failed.");
          setFormLoading(false);
          return;
        }
        resolvedImage = uploadData.path;
      }

      // Step 2: Save product with the resolved image path
      const payload = {
        name: name.trim(),
        description: description.trim(),
        price: parseFloat(price),
        category: category.trim(),
        image: resolvedImage,
        stock: parseInt(stock) || 0,
        customizable: !!customizable,
      };

      const url = editingProduct
        ? `/api/products/${editingProduct.id}`
        : "/api/products";
      const method = editingProduct ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.success) {
        setSuccessMsg(
          editingProduct
            ? "Product updated successfully!"
            : "Product created successfully!",
        );
        setIsFormOpen(false);
        fetchProducts();
        setTimeout(() => setSuccessMsg(""), 3000);
      } else {
        setError(data.error || "Failed to save product.");
      }
    } catch (err) {
      setError("An error occurred while saving.");
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async (productId) => {
    if (!confirm("Are you sure you want to delete this product?")) return;

    try {
      const res = await fetch(`/api/products/${productId}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        setSuccessMsg("Product deleted successfully!");
        fetchProducts();
        setTimeout(() => setSuccessMsg(""), 3000);
      } else {
        alert(data.error || "Failed to delete product.");
      }
    } catch (err) {
      alert("An error occurred while deleting.");
    }
  };

  // Filter & Search Logic
  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase());
    const matchesCategory =
      activeCategory === "All" || p.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = ["All", "Apparel", "Decor", "Accessories", "Plushies"];

  return (
    <div className="space-y-6">
      {/* 1. Header Area */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-[#2C2523] font-serif">
            Product Catalog
          </h2>
          <p className="text-xs text-[#A0958F]">
            Create and modify your handcrafted boutique listings.
          </p>
        </div>
        <button
          onClick={openAddForm}
          className="py-2.5 px-5 bg-[#E0A996] hover:bg-[#CF9581] text-[#2C2523] font-semibold rounded-xl text-xs flex items-center gap-2 cursor-pointer transition-colors shadow-xxs"
        >
          <Plus className="w-4 h-4" /> Add Product
        </button>
      </div>

      {/* 2. Success Messages */}
      {successMsg && (
        <div className="flex items-center gap-2.5 p-4 text-xs font-semibold text-green-700 bg-green-50 border border-green-100 rounded-xl">
          <Check className="w-4.5 h-4.5" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* 3. Search and Filtering bar */}
      <AdminSearchFilterBar
        searchValue={search}
        onSearchChange={setSearch}
        placeholder="Search products..."
        summary={`${filteredProducts.length} product${filteredProducts.length === 1 ? "" : "s"}`}
      >
        {categories.map((cat) => (
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
      </AdminSearchFilterBar>

      {/* 4. Products Listing */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white border border-[#FBEFEA] rounded-2xl">
          <Loader2 className="w-8 h-8 animate-spin text-[#E0A996] mb-3" />
          <p className="text-xs text-[#4A3728]">Loading custom inventory...</p>
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="text-center py-16 bg-white border border-[#FBEFEA] rounded-2xl text-[#A0958F] text-xs">
          No products matched your filters.
        </div>
      ) : (
        <div className="bg-white border border-[#FBEFEA] rounded-2xl shadow-xxs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#FDFBF7] text-[#A0958F] text-xxs font-bold uppercase tracking-wider border-b border-[#F5EFEB]">
                  <th className="px-6 py-4">Product</th>
                  <th className="px-6 py-4">Category</th>
                  <th className="px-6 py-4">Price</th>
                  <th className="px-6 py-4">Stock</th>
                  <th className="px-6 py-4">Customizable</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F5EFEB] text-xs text-[#4A3728]">
                {filteredProducts.map((p) => (
                  <tr
                    key={p.id}
                    className="hover:bg-[#FDFBF7]/50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-[#F5EFEB] overflow-hidden flex-shrink-0 border border-[#EBE5E0]">
                          {p.image ? (
                            <img
                              src={p.image}
                              alt={p.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Package className="w-4 h-4 text-[#A0958F]" />
                            </div>
                          )}
                        </div>
                        <div>
                          <div className="font-semibold text-[#2C2523] font-serif">
                            {p.name}
                          </div>
                          {p.description && (
                            <div className="text-xxs text-[#A0958F] line-clamp-1 max-w-[200px]">
                              {p.description}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-[10px] font-bold text-[#96A288] uppercase tracking-wide">
                        {p.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-bold text-[#2C2523]">
                      ${p.price.toFixed(2)}
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-1 text-[#2C2523] font-medium">
                        <Package className="w-3.5 h-3.5 text-[#A0958F]" />
                        {p.stock}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {p.customizable ? (
                        <span className="inline-flex px-2 py-0.5 bg-[#96A288]/10 text-[#96A288] text-[10px] font-bold rounded-full border border-[#96A288]/20">
                          Yes
                        </span>
                      ) : (
                        <span className="inline-flex px-2 py-0.5 bg-gray-50 text-gray-500 text-[10px] font-bold rounded-full border border-gray-100">
                          No
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex gap-1.5 justify-end">
                        <button
                          onClick={() => openEditForm(p)}
                          className="p-1.5 border border-[#EBE5E0] hover:border-[#E0A996] hover:bg-[#E0A996]/10 rounded-lg text-[#4A3728] hover:text-[#2C2523] cursor-pointer transition-colors"
                          title="Edit Item"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(p.id)}
                          className="p-1.5 border border-[#EBE5E0] hover:border-red-400 hover:bg-red-50 rounded-lg text-[#A0958F] hover:text-red-600 cursor-pointer transition-colors"
                          title="Delete Item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 5. ADD / EDIT PRODUCT MODAL DRAWER */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#2C2523]/50 backdrop-blur-sm">
          <div className="bg-white border border-[#FBEFEA] w-full max-w-lg rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-y-auto max-h-[90vh]">
            <button
              onClick={() => setIsFormOpen(false)}
              className="absolute top-4 right-4 p-2 hover:bg-[#F5EFEB] rounded-full text-[#4A3728] cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-[#E0A996]/15 text-[#E0A996] flex items-center justify-center rounded-xl">
                <Scissors className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-[#2C2523] font-serif">
                  {editingProduct
                    ? "Edit Crochet Creation"
                    : "New Crochet Creation"}
                </h3>
                <p className="text-xxs text-[#A0958F]">
                  Specify details and features for this item.
                </p>
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 p-3 mb-4 text-xs text-red-700 bg-red-50 border border-red-100 rounded-xl">
                <AlertCircle className="w-4.5 h-4.5 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-xxs font-bold text-[#2C2523] uppercase mb-1">
                    Product Name
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Cozy Cable Knit Cardigan"
                    className="w-full px-3 py-2.5 bg-[#FDFBF7] border border-[#EBE5E0] text-xs text-[#2C2523] rounded-xl focus:outline-none focus:border-[#E0A996]"
                  />
                </div>

                <div>
                  <label className="block text-xxs font-bold text-[#2C2523] uppercase mb-1">
                    Price ($)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="120.00"
                    className="w-full px-3 py-2.5 bg-[#FDFBF7] border border-[#EBE5E0] text-xs text-[#2C2523] rounded-xl focus:outline-none focus:border-[#E0A996]"
                  />
                </div>

                <div>
                  <label className="block text-xxs font-bold text-[#2C2523] uppercase mb-1">
                    Stock Count
                  </label>
                  <input
                    type="number"
                    required
                    value={stock}
                    onChange={(e) => setStock(e.target.value)}
                    placeholder="5"
                    className="w-full px-3 py-2.5 bg-[#FDFBF7] border border-[#EBE5E0] text-xs text-[#2C2523] rounded-xl focus:outline-none focus:border-[#E0A996]"
                  />
                </div>

                <div>
                  <label className="block text-xxs font-bold text-[#2C2523] uppercase mb-1">
                    Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3 py-2.5 bg-[#FDFBF7] border border-[#EBE5E0] text-xs text-[#2C2523] rounded-xl focus:outline-none focus:border-[#E0A996]"
                  >
                    <option value="Apparel">Apparel</option>
                    <option value="Decor">Decor</option>
                    <option value="Accessories">Accessories</option>
                    <option value="Plushies">Plushies</option>
                  </select>
                </div>

                <div className="flex items-center gap-2 pt-5 pl-2">
                  <input
                    type="checkbox"
                    id="customizable"
                    checked={customizable}
                    onChange={(e) => setCustomizable(e.target.checked)}
                    className="w-4 h-4 border-[#EBE5E0] text-[#E0A996] rounded focus:ring-[#E0A996]"
                  />
                  <label
                    htmlFor="customizable"
                    className="text-xxs font-bold text-[#2C2523] uppercase select-none"
                  >
                    Customizable Item
                  </label>
                </div>

                <div className="col-span-2">
                  <label className="block text-xxs font-bold text-[#2C2523] uppercase mb-1">
                    Product Image
                  </label>

                  {/* Preview or drop zone */}
                  {imagePreview ? (
                    <div className="relative w-full h-44 rounded-xl overflow-hidden border border-[#EBE5E0] bg-[#FDFBF7] group">
                      <img
                        src={imagePreview}
                        alt="Product preview"
                        className="w-full h-full object-cover"
                      />
                      {/* Overlay on hover */}
                      <div className="absolute inset-0 bg-[#2C2523]/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                        <button
                          type="button"
                          onClick={() => imageInputRef.current?.click()}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-white/90 text-[#2C2523] text-[10px] font-bold rounded-lg hover:bg-white transition-colors cursor-pointer"
                        >
                          <Upload className="w-3 h-3" /> Change
                        </button>
                        <button
                          type="button"
                          onClick={removeImage}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-red-500/90 text-white text-[10px] font-bold rounded-lg hover:bg-red-500 transition-colors cursor-pointer"
                        >
                          <X className="w-3 h-3" /> Remove
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div
                      onClick={() => imageInputRef.current?.click()}
                      onDragOver={(e) => { e.preventDefault(); setImageDragging(true); }}
                      onDragLeave={() => setImageDragging(false)}
                      onDrop={handleDrop}
                      className={`w-full h-36 rounded-xl border-2 border-dashed flex flex-col items-center justify-center gap-2 cursor-pointer transition-all ${
                        imageDragging
                          ? "border-[#E0A996] bg-[#E0A996]/10"
                          : "border-[#EBE5E0] bg-[#FDFBF7] hover:border-[#E0A996] hover:bg-[#E0A996]/5"
                      }`}
                    >
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                        imageDragging ? "bg-[#E0A996]/20" : "bg-[#F5EFEB]"
                      }`}>
                        <ImagePlus className={`w-5 h-5 transition-colors ${
                          imageDragging ? "text-[#E0A996]" : "text-[#A0958F]"
                        }`} />
                      </div>
                      <div className="text-center">
                        <p className="text-xs font-semibold text-[#4A3728]">
                          {imageDragging ? "Drop to upload" : "Click or drag image here"}
                        </p>
                        <p className="text-[10px] text-[#A0958F] mt-0.5">JPEG, PNG, WebP, GIF · Max 5 MB</p>
                      </div>
                    </div>
                  )}

                  {/* Hidden file input */}
                  <input
                    ref={imageInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/gif"
                    onChange={handleImageInputChange}
                    className="hidden"
                  />
                </div>

                <div className="col-span-2">
                  <label className="block text-xxs font-bold text-[#2C2523] uppercase mb-1">
                    Description
                  </label>
                  <textarea
                    rows="3"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe material type, stitches used, sizing rules..."
                    className="w-full px-3 py-2.5 bg-[#FDFBF7] border border-[#EBE5E0] text-xs text-[#2C2523] rounded-xl focus:outline-none focus:border-[#E0A996]"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-[#F5EFEB] flex gap-3 justify-end">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="py-2.5 px-5 border border-[#EBE5E0] text-xs font-semibold rounded-xl hover:bg-[#F5EFEB] cursor-pointer transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={formLoading}
                  className="py-2.5 px-6 bg-[#E0A996] text-[#2C2523] font-bold rounded-xl text-xs flex items-center gap-2 cursor-pointer hover:bg-[#CF9581] disabled:opacity-75 disabled:cursor-not-allowed"
                >
                  {formLoading ? (
                    <Loader2 className="w-4.5 h-4.5 animate-spin" />
                  ) : (
                    <>
                      <Save className="w-4 h-4" /> Save
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
