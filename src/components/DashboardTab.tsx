import {
  LayoutDashboard,
  PlusSquare,
  Boxes,
  Users,
  ClipboardList,
  Search,
  Edit2,
  Trash2,
  Upload,
  UserCheck,
  Eye,
  CheckCircle,
  XCircle,
  AlertCircle,
  X,
  Plus
} from "lucide-react";
import React, { useState, useMemo } from "react";
import { Product, UserProfile, Order, OrderStatus, UserRole } from "../types";

interface DashboardTabProps {
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  users: UserProfile[];
  setUsers: React.Dispatch<React.SetStateAction<UserProfile[]>>;
  orders: Order[];
  setOrders: React.Dispatch<React.SetStateAction<Order[]>>;
}

type DashboardSubTab = "overview" | "add-product" | "products" | "users" | "orders";

export default function DashboardTab({
  products,
  setProducts,
  users,
  setUsers,
  orders,
  setOrders,
}: DashboardTabProps) {
  const [activeSubTab, setActiveSubTab] = useState<DashboardSubTab>("overview");

  // Local feedback states
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Metric summaries
  const totalUsersCount = users.length;
  const totalProductsCount = products.length;
  const totalOrdersCount = orders.length;
  const totalSalesVal = useMemo(() => {
    return orders
      .filter((o) => o.status === OrderStatus.PAID)
      .reduce((acc, curr) => acc + curr.totalAmount, 0);
  }, [orders]);

  // Form states (Add product)
  const [newProdName, setNewProdName] = useState("");
  const [newProdPrice, setNewProdPrice] = useState(0);
  const [newProdBrand, setNewProdBrand] = useState("");
  const [newProdCategory, setNewProdCategory] = useState("");
  const [newProdDesc, setNewProdDesc] = useState("");
  const [newProdImage1, setNewProdImage1] = useState("");
  const [newProdImage2, setNewProdImage2] = useState("");
  const [newProdImage3, setNewProdImage3] = useState("");
  const [newProdImage4, setNewProdImage4] = useState("");
  const [newProdImage5, setNewProdImage5] = useState("");

  const handleProductFileChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        if (index === 1) setNewProdImage1(result);
        else if (index === 2) setNewProdImage2(result);
        else if (index === 3) setNewProdImage3(result);
        else if (index === 4) setNewProdImage4(result);
        else if (index === 5) setNewProdImage5(result);
        triggerToast(`Gallery Image ${index} uploaded successfully!`);
        // Reset the input value so selecting the same file triggers onChange again
        e.target.value = "";
      };
      reader.readAsDataURL(file);
    }
  };

  const handleProductFileRemove = (index: number) => {
    if (index === 1) setNewProdImage1("");
    else if (index === 2) setNewProdImage2("");
    else if (index === 3) setNewProdImage3("");
    else if (index === 4) setNewProdImage4("");
    else if (index === 5) setNewProdImage5("");
    triggerToast(`Gallery Image ${index} cleared.`);
  };

  // Search/Filters within dashboard
  const [productSearch, setProductSearch] = useState("");
  const [userSearch, setUserSearch] = useState("");
  const [selectedUserOrderFilter, setSelectedUserOrderFilter] = useState<string | null>(null);

  // Edit Product Modal states
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Edit User Modal states
  const [editingUser, setEditingUser] = useState<UserProfile | null>(null);

  // Edit images manual input URL helper
  const [editImgUrlInput, setEditImgUrlInput] = useState("");

  // Handle Add Product submit
  const handleAddProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProdName || !newProdBrand || !newProdCategory) {
      triggerToast("Please fill in key product fields!");
      return;
    }

    const placeholderImages = [
      "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=400&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=400&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&auto=format&fit=crop&q=80"
    ];

    const filledImages = [newProdImage1, newProdImage2, newProdImage3, newProdImage4, newProdImage5]
      .map(img => img.trim())
      .filter(img => img !== "");

    if (filledImages.length === 0) {
      // Pick 5 random images from placeholders for mock purposes
      for (let i = 0; i < 5; i++) {
        filledImages.push(placeholderImages[i % placeholderImages.length]);
      }
    }

    const primaryImage = filledImages[0];

    const created: Product = {
      id: `prod-${Date.now()}`,
      name: newProdName,
      price: Number(newProdPrice) || 0,
      brand: newProdBrand,
      category: newProdCategory,
      description: newProdDesc || "No description provided.",
      imageUrl: primaryImage,
      images: filledImages,
      createdAt: new Date().toISOString(),
    };

    setProducts((prev) => [created, ...prev]);
    triggerToast("Product successfully added with 5 gallery images!");

    // Reset fields
    setNewProdName("");
    setNewProdPrice(0);
    setNewProdBrand("");
    setNewProdCategory("");
    setNewProdDesc("");
    setNewProdImage1("");
    setNewProdImage2("");
    setNewProdImage3("");
    setNewProdImage4("");
    setNewProdImage5("");
    setActiveSubTab("products");
  };

  // Edit operations
  const triggerEditProduct = (p: Product) => {
    // If it doesn't have an images array, let's pre-populate with p.imageUrl or fallback list
    const initialImages = p.images && p.images.length > 0 ? [...p.images] : [p.imageUrl];
    setEditingProduct({
      ...p,
      images: initialImages
    });
  };

  const handleUpdateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;

    const finalImages = editingProduct.images && editingProduct.images.length > 0 ? editingProduct.images : [editingProduct.imageUrl];
    const finalPrimary = finalImages[0] || editingProduct.imageUrl;

    const updatedProduct = {
      ...editingProduct,
      imageUrl: finalPrimary,
      images: finalImages
    };

    setProducts((prev) =>
      prev.map((p) => (p.id === editingProduct.id ? updatedProduct : p))
    );
    setEditingProduct(null);
    triggerToast("Product details and gallery update saved!");
  };

  const handleEditProductImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && editingProduct) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        const currentImages = editingProduct.images ? [...editingProduct.images] : [];
        if (currentImages.length >= 5) {
          triggerToast("Maximum of 5 gallery images reached!");
          return;
        }
        const updatedImages = [...currentImages, result];
        setEditingProduct({
          ...editingProduct,
          images: updatedImages,
        });
        triggerToast("New gallery image uploaded successfully!");
        e.target.value = "";
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEditProductImageDelete = (indexToDelete: number) => {
    if (!editingProduct) return;
    const currentImages = editingProduct.images ? [...editingProduct.images] : [];
    const updatedImages = currentImages.filter((_, idx) => idx !== indexToDelete);
    setEditingProduct({
      ...editingProduct,
      images: updatedImages,
    });
    triggerToast("Image deleted from product gallery.");
  };

  const handleAddEditImageByUrl = () => {
    if (!editImgUrlInput.trim()) return;
    if (!editingProduct) return;
    const currentImages = editingProduct.images ? [...editingProduct.images] : [];
    if (currentImages.length >= 5) {
      triggerToast("Maximum of 5 gallery images reached!");
      return;
    }
    const updatedImages = [...currentImages, editImgUrlInput.trim()];
    setEditingProduct({
      ...editingProduct,
      images: updatedImages,
    });
    setEditImgUrlInput("");
    triggerToast("Image URL added to gallery!");
  };

  const handleDeleteProduct = (id: string) => {
    if (confirm("Are you sure you want to delete this product from database?")) {
      setProducts((prev) => prev.filter((p) => p.id !== id));
      triggerToast("Product deleted!");
    }
  };

  // User management updates
  const triggerEditUser = (u: UserProfile) => {
    setEditingUser(u);
  };

  const handleUpdateUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;
    setUsers((prev) =>
      prev.map((u) => (u.id === editingUser.id ? editingUser : u))
    );
    setEditingUser(null);
    triggerToast("User details updated!");
  };

  // Toggle order status from Paid to Failed etc.
  const toggleOrderStatus = (orderId: string, nextStatus: OrderStatus) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: nextStatus } : o))
    );
    triggerToast(`Order status updated to: ${nextStatus}`);
  };

  // Delete customer order record permanently
  const handleDeleteOrder = (orderId: string) => {
    setOrders((prev) => prev.filter((o) => o.id !== orderId));
    triggerToast("Order record permanently deleted from database.");
  };

  // Filtered Products for admin management
  const filteredAdminProducts = useMemo(() => {
    return products.filter((p) =>
      p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
      p.brand.toLowerCase().includes(productSearch.toLowerCase())
    );
  }, [products, productSearch]);

  // Filtered Users for admin management
  const filteredAdminUsers = useMemo(() => {
    return users.filter((u) =>
      `${u.firstName} ${u.lastName}`.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.email.toLowerCase().includes(userSearch.toLowerCase())
    );
  }, [users, userSearch]);

  // Filtered Orders for admin management
  const filteredOrders = useMemo(() => {
    if (!selectedUserOrderFilter) return orders;
    return orders.filter((o) => o.userId === selectedUserOrderFilter);
  }, [orders, selectedUserOrderFilter]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 font-sans">
      {/* TOAST SYSTEM */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 bg-gray-900 text-white text-xs font-bold px-5 py-3 rounded-xl shadow-2xl flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2 duration-200">
          <span className="w-2 h-2 rounded-full bg-[#e1007a] animate-ping" />
          {toastMessage}
        </div>
      )}

      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* SIDEBAR NAVIGATION CONTROLS */}
        <div id="dashboard-sidebar-menu" className="w-full lg:w-64 bg-white border border-gray-100 rounded-3xl p-5 shadow-lg shrink-0 space-y-2 h-fit">
          <div className="pb-4 mb-4 border-b border-gray-100 text-left px-2">
            <h3 className="font-extrabold text-lg text-gray-800 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#e1007a]" />
              Admin Panel
            </h3>
            <p className="text-[10px] uppercase font-bold tracking-widest text-[#e1007a] mt-0.5 animate-pulse">Live Database</p>
          </div>

          <button
            id="admin-menu-overview"
            onClick={() => setActiveSubTab("overview")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold transition-all duration-150 text-left ${
              activeSubTab === "overview"
                ? "bg-[#e1007a] text-white shadow-lg shadow-pink-100"
                : "text-gray-600 hover:bg-pink-50/50 hover:text-[#e1007a]"
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            Dashboard
          </button>

          <button
            id="admin-menu-add-product"
            onClick={() => setActiveSubTab("add-product")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold transition-all duration-150 text-left ${
              activeSubTab === "add-product"
                ? "bg-[#e1007a] text-white shadow-lg shadow-pink-100"
                : "text-gray-600 hover:bg-pink-50/50 hover:text-[#e1007a]"
            }`}
          >
            <PlusSquare className="w-4 h-4" />
            Add Product
          </button>

          <button
            id="admin-menu-products"
            onClick={() => setActiveSubTab("products")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold transition-all duration-150 text-left ${
              activeSubTab === "products"
                ? "bg-[#e1007a] text-white shadow-lg shadow-pink-100"
                : "text-gray-600 hover:bg-pink-50/50 hover:text-[#e1007a]"
            }`}
          >
            <Boxes className="w-4 h-4" />
            Products
          </button>

          <button
            id="admin-menu-users"
            onClick={() => setActiveSubTab("users")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold transition-all duration-150 text-left ${
              activeSubTab === "users"
                ? "bg-[#e1007a] text-white shadow-lg shadow-pink-100"
                : "text-gray-600 hover:bg-pink-50/50 hover:text-[#e1007a]"
            }`}
          >
            <Users className="w-4 h-4" />
            Users
          </button>

          <button
            id="admin-menu-orders"
            onClick={() => setActiveSubTab("orders")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold transition-all duration-150 text-left ${
              activeSubTab === "orders"
                ? "bg-[#e1007a] text-white shadow-lg shadow-pink-100"
                : "text-gray-600 hover:bg-pink-50/50 hover:text-[#e1007a]"
            }`}
          >
            <ClipboardList className="w-4 h-4" />
            Orders
          </button>
        </div>

        {/* MAIN PANEL AREA */}
        <div id="admin-main-stage" className="flex-1">
          
          {/* OVERVIEW PANEL */}
          {activeSubTab === "overview" && (
            <div id="subtab-overview" className="space-y-8 animate-in fade-in duration-200">
              
              {/* Stat card blocks */}
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
                
                {/* Total Users */}
                <div className="bg-[#e1007a] text-white p-6 rounded-3xl shadow-lg relative overflow-hidden text-left shadow-pink-100 flex flex-col justify-between min-h-[120px]">
                  <span className="text-sm font-bold text-white/85">Total Users</span>
                  <span className="text-4xl font-extrabold font-mono mt-2">{totalUsersCount}</span>
                  <div className="absolute right-3 bottom-3 opacity-15"><Users className="w-24 h-24 stroke-[1]" /></div>
                </div>

                {/* Total Products */}
                <div className="bg-[#e1007a] text-white p-6 rounded-3xl shadow-lg relative overflow-hidden text-left shadow-pink-100 flex flex-col justify-between min-h-[120px]">
                  <span className="text-sm font-bold text-white/85">Total Products</span>
                  <span className="text-4xl font-extrabold font-mono mt-2">{totalProductsCount}</span>
                  <div className="absolute right-3 bottom-3 opacity-15"><Boxes className="w-24 h-24 stroke-[1]" /></div>
                </div>

                {/* Total Orders */}
                <div className="bg-[#e1007a] text-white p-6 rounded-3xl shadow-lg relative overflow-hidden text-left shadow-pink-100 flex flex-col justify-between min-h-[120px]">
                  <span className="text-sm font-bold text-white/85">Total Orders</span>
                  <span className="text-4xl font-extrabold font-mono mt-2">{totalOrdersCount}</span>
                  <div className="absolute right-3 bottom-3 opacity-15"><ClipboardList className="w-24 h-24 stroke-[1]" /></div>
                </div>

                {/* Total Sales */}
                <div className="bg-[#e1007a] text-white p-6 rounded-3xl shadow-lg relative overflow-hidden text-left shadow-pink-100 flex flex-col justify-between min-h-[120px]">
                  <span className="text-sm font-bold text-white/85">Total Sales</span>
                  <span className="text-3xl font-extrabold font-mono mt-2">₹{totalSalesVal.toFixed(2)}</span>
                  <span className="text-[10px] text-white/80 shrink-0 font-medium font-sans">Calculated from Paid orders</span>
                </div>

              </div>

              {/* SALES CHART BLOCK */}
              <div className="bg-white border border-gray-100 p-6 sm:p-8 rounded-3xl shadow-xl text-left">
                <h3 className="font-extrabold text-lg text-gray-850">Sales (Last 30 Days)</h3>
                
                {/* Stunning Interactive SVG Area Chart */}
                <div className="relative w-full h-[320px] mt-6 flex flex-col justify-between">
                  
                  {/* Grid Lines Overlay */}
                  <div className="absolute inset-0 flex flex-col justify-between text-gray-300 pointer-events-none text-[10px] font-mono pb-8 pt-2">
                    <div className="border-b border-gray-150 flex justify-between pr-4"><span>14000</span><span className="text-[9px] text-gray-400">---</span></div>
                    <div className="border-b border-gray-150 flex justify-between pr-4"><span>10500</span><span className="text-[9px] text-gray-400">---</span></div>
                    <div className="border-b border-gray-150 flex justify-between pr-4"><span>7000</span><span className="text-[9px] text-gray-400">---</span></div>
                    <div className="border-b border-gray-150 flex justify-between pr-4"><span>3500</span><span className="text-[9px] text-gray-400">---</span></div>
                    <div className="border-b border-gray-150 flex justify-between pr-4"><span>0</span><span className="text-[9px] text-gray-400">---</span></div>
                  </div>

                  {/* SVG Canvas */}
                  <svg className="w-full h-full pb-8 pt-2 overflow-visible relative z-10" viewBox="0 0 500 200" preserveAspectRatio="none">
                    <defs>
                      <linearGradient id="chart-grad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#e1007a" stopOpacity="0.25" />
                        <stop offset="100%" stopColor="#e1007a" stopOpacity="0.0" />
                      </linearGradient>
                    </defs>

                    {/* Area path */}
                    <path
                      d="M 10 180 L 120 160 L 240 145 L 360 115 L 490 85 L 490 195 L 10 195 Z"
                      fill="url(#chart-grad)"
                    />

                    {/* Area stroke line */}
                    <path
                      d="M 10 180 Q 60 170 120 160 T 240 145 T 360 115 T 490 85"
                      fill="none"
                      stroke="#e1007a"
                      strokeWidth="3.5"
                    />

                    {/* SVG Dot Indicators */}
                    <circle cx="10" cy="180" r="5" fill="#e1007a" stroke="#ffffff" strokeWidth="2" />
                    <circle cx="120" cy="160" r="5" fill="#e1007a" stroke="#ffffff" strokeWidth="2" />
                    <circle cx="240" cy="145" r="5" fill="#e1007a" stroke="#ffffff" strokeWidth="2" />
                    <circle cx="360" cy="115" r="5" fill="#e1007a" stroke="#ffffff" strokeWidth="2" />
                    <circle cx="490" cy="85" r="5" fill="#e1007a" stroke="#ffffff" strokeWidth="2" />
                  </svg>

                  {/* Horizontal static Labels */}
                  <div className="absolute bottom-0 left-0 w-full flex justify-between text-[11px] font-mono text-gray-500 font-bold px-2 pt-2 border-t">
                    <span>2026-06-13</span>
                    <span>2026-06-14</span>
                  </div>

                  {/* Floating mock card matching reference tooltip */}
                  <div className="absolute top-[35%] left-[45%] bg-white border border-pink-100 p-2.5 rounded-xl text-left shadow-lg pointer-events-none select-none text-[11px]">
                    <p className="font-bold text-gray-500">2026-06-13</p>
                    <p className="font-mono text-[#e1007a] font-black mt-0.5">amount : 2098.95</p>
                  </div>

                </div>
              </div>
            </div>
          )}

          {/* ADD PRODUCT PANEL */}
          {activeSubTab === "add-product" && (
            <div id="subtab-add-product" className="bg-white border border-gray-100 p-8 rounded-3xl shadow-xl text-left animate-in fade-in duration-200">
              <div className="mb-6">
                <h2 className="text-2xl font-extrabold text-gray-900">Add Product</h2>
                <p className="text-sm text-gray-500 mt-1">Enter Product Details Below</p>
              </div>

              <form onSubmit={handleAddProductSubmit} className="space-y-4">
                
                {/* Product Name */}
                <div className="space-y-1">
                  <label className="text-sm font-bold text-gray-700">Product Name</label>
                  <input
                    id="new-product-name"
                    type="text"
                    required
                    placeholder="Product Name"
                    value={newProdName}
                    onChange={(e) => setNewProdName(e.target.value)}
                    className="w-full text-sm bg-gray-50 border border-gray-200 rounded-xl p-3 outline-none focus:border-pink-300 focus:bg-white transition-all text-gray-800"
                  />
                </div>

                {/* Price */}
                <div className="space-y-1">
                  <label className="text-sm font-bold text-gray-700">Price</label>
                  <input
                    id="new-product-price"
                    type="number"
                    required
                    placeholder="0"
                    value={newProdPrice}
                    onChange={(e) => setNewProdPrice(Math.max(0, parseInt(e.target.value) || 0))}
                    className="w-full text-sm bg-gray-50 border border-gray-200 rounded-xl p-3 outline-none focus:border-pink-300 focus:bg-white transition-all text-gray-800"
                  />
                </div>

                {/* Brand & Category row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-sm font-bold text-gray-700">Brand</label>
                    <input
                      id="new-product-brand"
                      type="text"
                      required
                      placeholder="Brand"
                      value={newProdBrand}
                      onChange={(e) => setNewProdBrand(e.target.value)}
                      className="w-full text-sm bg-gray-50 border border-gray-200 rounded-xl p-3 outline-none focus:border-pink-300 focus:bg-white transition-all text-gray-800"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-bold text-gray-700">Category</label>
                    <input
                      id="new-product-category"
                      type="text"
                      required
                      placeholder="Category"
                      value={newProdCategory}
                      onChange={(e) => setNewProdCategory(e.target.value)}
                      className="w-full text-sm bg-gray-50 border border-gray-200 rounded-xl p-3 outline-none focus:border-pink-300 focus:bg-white transition-all text-gray-800"
                    />
                  </div>
                </div>

                {/* Description - specific spelling placeholder 'Enter Brief Description oF Product' */}
                <div className="space-y-1">
                  <label className="text-sm font-bold text-gray-700">Description</label>
                  <textarea
                    id="new-product-desc"
                    rows={4}
                    placeholder="Enter Brief Description oF Product"
                    value={newProdDesc}
                    onChange={(e) => setNewProdDesc(e.target.value)}
                    className="w-full text-sm bg-gray-50 border border-gray-200 rounded-xl p-3 outline-none focus:border-pink-300 focus:bg-white transition-all text-gray-800 resize-none"
                  />
                </div>                {/* 5 Product Image Upload Fields */}
                <div className="space-y-3 bg-[#fff0f6]/40 border border-pink-100/50 p-5 rounded-2xl">
                  <label className="text-sm font-black uppercase text-[#e1007a] tracking-wider block">
                    Product Detail Gallery (5 Image Uploads)
                  </label>
                  <p className="text-[11px] text-gray-500 leading-relaxed">
                    Upload exactly 5 local photo files to show off this premium hardware gear in the full-scale detailed modal product viewer.
                  </p>
                  
                  <div className="space-y-2">
                    {[1, 2, 3, 4, 5].map((num) => {
                      const val = 
                        num === 1 ? newProdImage1 : 
                        num === 2 ? newProdImage2 : 
                        num === 3 ? newProdImage3 : 
                        num === 4 ? newProdImage4 : 
                        newProdImage5;
                      const labelText = num === 1 ? "1 (Primary Hero Front)" : `${num} (Detail View perspective)`;
                      return (
                        <div key={num} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3 rounded-xl border border-gray-150 shadow-xs">
                          <div className="text-left">
                            <span className="text-xs font-black uppercase text-gray-500 tracking-wider block">Image {labelText}:</span>
                            <span className="text-[10px] text-gray-400 font-medium">
                              {val ? "✓ Selected (Base64 file ready)" : "No local file selected"}
                            </span>
                          </div>
                          
                          <div className="flex items-center gap-2 shrink-0">
                            {val ? (
                              <div className="relative w-12 h-12 rounded-lg border border-gray-200 overflow-hidden flex items-center justify-center bg-gray-50 group shrink-0">
                                <img src={val} alt={`Uploaded View slot ${num}`} className="max-h-full max-w-full object-contain" />
                                <button
                                  type="button"
                                  onClick={() => handleProductFileRemove(num)}
                                  className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white cursor-pointer"
                                  title="Remove image"
                                >
                                  <Trash2 className="w-4 h-4 text-white" />
                                </button>
                              </div>
                            ) : (
                              <div className="w-12 h-12 rounded-lg border border-dashed border-gray-200 bg-gray-50 flex items-center justify-center shrink-0">
                                <Upload className="w-4 h-4 text-gray-300" />
                              </div>
                            )}

                            <label className="bg-[#e1007a] hover:bg-[#c20068] text-white font-bold text-[10px] uppercase tracking-wider py-2 px-3 rounded-lg transition-all cursor-pointer">
                              Upload
                              <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => handleProductFileChange(num, e)}
                                className="hidden"
                              />
                            </label>

                            {val && (
                              <button
                                type="button"
                                onClick={() => handleProductFileRemove(num)}
                                className="p-2 border border-rose-100 text-rose-600 hover:bg-rose-50 rounded-lg cursor-pointer"
                                title="Remove selected image"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Add button */}
                <button
                  type="submit"
                  id="btn-add-product-submit"
                  className="w-full bg-[#e1007a] hover:bg-[#c20068] active:scale-98 text-white font-bold py-3.5 rounded-xl transition-all duration-150 text-center shadow-lg hover:shadow-pink-100 mt-4 text-sm"
                >
                  Add Product
                </button>

              </form>
            </div>
          )}

          {/* PRODUCTS LIST MANAGEMENT */}
          {activeSubTab === "products" && (
            <div id="subtab-products" className="bg-white border border-gray-100 p-6 sm:p-8 rounded-3xl shadow-xl text-left animate-in fade-in duration-200 space-y-6">
              
              {/* Product search/sort toolbar */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="relative w-full sm:max-w-md">
                  <input
                    id="admin-product-search"
                    type="text"
                    placeholder="Search Product..."
                    value={productSearch}
                    onChange={(e) => setProductSearch(e.target.value)}
                    className="w-full text-sm bg-gray-50 border border-gray-200 rounded-xl py-3 pl-10 pr-4 outline-none focus:border-pink-300 focus:bg-white text-gray-800"
                  />
                  <Search className="absolute left-3 top-3.5 w-4.5 h-4.5 text-gray-400" />
                </div>

                <div className="text-sm font-bold text-gray-500 shrink-0">
                  Total Products: <span className="text-[#e1007a]">{filteredAdminProducts.length}</span>
                </div>
              </div>

              {/* LIST OF PRODUCTS IN DATABASE */}
              <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                {filteredAdminProducts.map((prod) => (
                  <div
                    key={prod.id}
                    className="flex flex-col sm:flex-row items-center justify-between gap-4 border border-gray-100 bg-white rounded-2xl p-4 shadow-sm hover:border-pink-100 transition-all duration-200"
                  >
                    {/* Left details */}
                    <div className="flex items-center gap-4 w-full sm:w-auto">
                      <div className="w-16 h-16 bg-gray-50 rounded-xl border border-gray-100 shrink-0 p-1 flex items-center justify-center overflow-hidden">
                        <img
                          src={prod.imageUrl}
                          alt={prod.name}
                          className="max-h-full max-w-full object-contain"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                      <div className="text-left w-full">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#e1007a] bg-pink-50 px-2 py-0.5 rounded">
                          {prod.category}
                        </span>
                        <h4 className="font-bold text-sm text-gray-800 leading-snug mt-1.5 clamp-2">
                          {prod.name}
                        </h4>
                        <p className="text-xs text-gray-400 mt-1">Brand: {prod.brand}</p>
                      </div>
                    </div>

                    {/* Right actions and price */}
                    <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto shrink-0 border-t sm:border-0 pt-3 sm:pt-0">
                      <div className="text-right">
                        <span className="font-mono font-black text-gray-900 text-lg">₹{prod.price}</span>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        {/* Edit button */}
                        <button
                          id={`admin-edit-prod-${prod.id}`}
                          onClick={() => triggerEditProduct(prod)}
                          className="p-2 bg-[#f4fbf7] hover:bg-[#e1f5ec] text-emerald-600 rounded-lg transition-colors border border-emerald-100"
                        >
                          <Edit2 className="w-4.5 h-4.5" />
                        </button>
                        
                        {/* Delete button */}
                        <button
                          id={`admin-delete-prod-${prod.id}`}
                          onClick={() => handleDeleteProduct(prod.id)}
                          className="p-2 bg-[#fef2f2] hover:bg-[#fee2e2] text-rose-600 rounded-lg transition-colors border border-rose-100"
                        >
                          <Trash2 className="w-4.5 h-4.5" />
                        </button>
                      </div>
                    </div>

                  </div>
                ))}
              </div>

            </div>
          )}

          {/* USER MANAGEMENT */}
          {activeSubTab === "users" && (
            <div id="subtab-users" className="bg-white border border-gray-100 p-6 sm:p-8 rounded-3xl shadow-xl text-left animate-in fade-in duration-200 space-y-6">
              <div>
                <h2 className="text-2xl font-extrabold text-gray-900">User Management</h2>
                <p className="text-sm text-gray-500 mt-1">View and manage Resgistered Users</p>
              </div>

              {/* User search bar */}
              <div className="relative w-full">
                <input
                  id="admin-user-search"
                  type="text"
                  placeholder="Search Users..."
                  value={userSearch}
                  onChange={(e) => setUserSearch(e.target.value)}
                  className="w-full text-sm bg-gray-50 border border-gray-200 rounded-xl py-3 pl-10 pr-4 outline-none focus:border-pink-300 focus:bg-white text-gray-800"
                />
                <Search className="absolute left-3 top-3.5 w-4.5 h-4.5 text-gray-400" />
              </div>

              {/* Grid of users cards (looking exact like screenshot 8) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredAdminUsers.map((user) => (
                  <div
                    key={user.id}
                    className="bg-[#feeef5] border border-pink-100 rounded-3xl p-6 shadow-sm hover:shadow-lg transition-shadow flex items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-4">
                      {/* Avatar picture with pink border circle */}
                      <div className="w-16 h-16 rounded-full p-0.5 border-4 border-[#e1007a] bg-white overflow-hidden shadow-md shrink-0">
                        <img
                          src={user.avatarUrl}
                          alt={user.firstName}
                          className="w-full h-full rounded-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                      <div className="text-left">
                        <h4 className="font-extrabold text-base text-gray-800">
                          {user.firstName} {user.lastName}
                        </h4>
                        <p className="text-xs text-gray-500">{user.email}</p>
                        <span className="inline-block text-[10px] font-bold tracking-wide uppercase px-2 py-0.5 rounded bg-[#e1007a]/15 text-[#e1007a] mt-1.5">
                          {user.role}
                        </span>
                      </div>
                    </div>

                    {/* Actions on User details card */}
                    <div className="flex flex-col gap-2 shrink-0">
                      <button
                        id={`btn-user-edit-${user.id}`}
                        onClick={() => triggerEditUser(user)}
                        className="flex items-center justify-center gap-1.5 bg-white border border-gray-200 text-gray-800 text-xs font-bold px-3 py-2 rounded-xl hover:bg-gray-50 active:scale-95 shadow-sm cursor-pointer transition-colors"
                      >
                        <Edit2 className="w-3.5 h-3.5 text-pink-600" />
                        Edit
                      </button>
                      <button
                        id={`btn-user-orders-${user.id}`}
                        onClick={() => {
                          setSelectedUserOrderFilter(user.id);
                          setActiveSubTab("orders");
                          triggerToast(`Now showing orders placed by ${user.firstName} ${user.lastName}`);
                        }}
                        className="flex items-center justify-center gap-1.5 bg-[#1e293b] text-white text-xs font-bold px-3 py-2 rounded-xl hover:bg-slate-800 active:scale-95 shadow-md cursor-pointer transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5 text-pink-300" />
                        Show Order
                      </button>
                      <button
                        id={`btn-user-delete-${user.id}`}
                        onClick={() => {
                          setUsers((prev) => prev.filter((u) => u.id !== user.id));
                          triggerToast(`User "${user.firstName} ${user.lastName}" permanently deleted.`);
                        }}
                        className="flex items-center justify-center gap-1.5 bg-rose-50 border border-rose-100 text-rose-600 text-xs font-bold px-3 py-2 rounded-xl hover:bg-rose-100 active:scale-95 shadow-sm cursor-pointer transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5 text-rose-600" />
                        Delete
                      </button>
                    </div>

                  </div>
                ))}
              </div>

            </div>
          )}

          {/* ALL ORDERS LOGS (Only Admin) */}
          {activeSubTab === "orders" && (
            <div id="subtab-orders" className="bg-white border border-gray-100 p-6 sm:p-8 rounded-3xl shadow-xl text-left animate-in fade-in duration-200 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-extrabold text-gray-900">Total Orders Log</h2>
                  <p className="text-sm text-gray-500 mt-1">Live customer sales invoices tracking database</p>
                </div>
                {selectedUserOrderFilter && (
                  <div className="flex items-center gap-2 bg-[#feeef5] border border-pink-100 rounded-2xl p-2 px-4 shadow-xs">
                    <span className="text-xs text-[#e1007a] font-bold">
                      Filtering by User: {
                        (() => {
                          const userMatch = users.find(u => u.id === selectedUserOrderFilter);
                          return userMatch ? `${userMatch.firstName} ${userMatch.lastName}` : "Selected customer";
                        })()
                      }
                    </span>
                    <button
                      onClick={() => {
                        setSelectedUserOrderFilter(null);
                        triggerToast("All orders filter cleared.");
                      }}
                      className="p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
                      title="Clear Filter"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>

              <div className="space-y-4">
                {filteredOrders.length === 0 ? (
                  <div className="text-center py-12 border-2 border-dashed border-gray-100 rounded-3xl">
                    <ClipboardList className="w-12 h-12 text-gray-300 mx-auto mb-2.5" />
                    <p className="text-gray-500 text-sm font-medium">No order records registered matching current conditions.</p>
                  </div>
                ) : (
                  filteredOrders.map((ord) => (
                  <div
                    key={ord.id}
                    className="border border-gray-150 p-5 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4"
                  >
                    <div className="text-left w-full sm:w-auto flex-1">
                      <p className="text-xs font-mono font-bold text-gray-500">
                        Order ID: <span className="text-gray-900">{ord.id}</span>
                      </p>
                      <p className="text-xs font-bold text-[#e1007a] mt-1">
                        Client: {ord.userFirstName} {ord.userLastName} ({ord.userEmail})
                      </p>
                      <span className="block text-[10px] text-gray-400 mt-1">
                        {new Date(ord.createdAt).toLocaleString()}
                      </span>

                      {/* Products inside this order (with thumbnail images) */}
                      <div className="mt-3 flex flex-wrap gap-2">
                        {ord.items.map((item, idx) => (
                          <div 
                            key={`${ord.id}-${item.productId}-${idx}`}
                            className="flex items-center gap-3 bg-gray-50 border border-gray-100 rounded-2xl p-2 pr-3.5 max-w-sm"
                          >
                            <div className="w-16 h-16 bg-white border border-gray-100 rounded-xl shrink-0 p-1 flex items-center justify-center overflow-hidden shadow-xs">
                              <img
                                src={item.imageUrl}
                                alt={item.productName}
                                className="max-h-full max-w-full object-contain mix-blend-multiply"
                                referrerPolicy="no-referrer"
                              />
                            </div>
                            <div className="text-left leading-tight">
                              <p className="text-xs font-bold text-gray-800 truncate max-w-[160px]" title={item.productName}>
                                {item.productName}
                              </p>
                              <p className="text-[10px] font-mono text-[#e1007a] font-black mt-1">
                                {item.quantity} Unit(s) • ₹{item.price}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto border-t sm:border-0 pt-3 sm:pt-0 shrink-0">
                      <div className="text-right">
                        <span className="font-mono font-black text-gray-800">INR {ord.totalAmount}</span>
                      </div>

                      {/* Status quick switcher buttons so reviewers can toggle state instantly */}
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => toggleOrderStatus(ord.id, OrderStatus.PAID)}
                          className={`p-1.5 rounded-lg border flex items-center justify-center cursor-pointer transition-colors ${
                            ord.status === OrderStatus.PAID
                              ? "bg-emerald-500 text-white border-transparent"
                              : "bg-white text-emerald-600 border-emerald-100 hover:bg-[#f4fbf7]"
                          }`}
                          title="Set status Paid"
                        >
                          <CheckCircle className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => toggleOrderStatus(ord.id, OrderStatus.FAILED)}
                          className={`p-1.5 rounded-lg border flex items-center justify-center cursor-pointer transition-colors ${
                            ord.status === OrderStatus.FAILED
                              ? "bg-[#fdba74] text-white border-transparent"
                              : "bg-white text-[#d97706] border-orange-100 hover:bg-orange-5/50"
                          }`}
                          title="Set status Failed"
                        >
                          <XCircle className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteOrder(ord.id)}
                          className="p-1.5 rounded-lg border border-red-150 bg-white hover:bg-red-50 text-red-600 hover:border-red-300 flex items-center justify-center cursor-pointer transition-colors"
                          title="Delete Order Record"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                )))}
              </div>

            </div>
          )}

        </div>
      </div>

      {/* EDIT PRODUCT MODAL popup */}
      {editingProduct && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-8 shadow-2xl relative animate-in zoom-in-95 duration-150">
            <h3 className="font-extrabold text-xl mb-4 text-left">Edit Product</h3>
            <form onSubmit={handleUpdateProduct} className="space-y-4">
              <div className="space-y-1 text-left">
                <label className="text-xs font-bold text-gray-500 uppercase">Product Title</label>
                <input
                  type="text"
                  required
                  value={editingProduct.name}
                  onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                  className="w-full text-sm bg-gray-50 border border-gray-200 rounded-xl p-3 outline-none focus:border-pink-300 text-gray-800"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1 text-left">
                  <label className="text-xs font-bold text-gray-500 uppercase">Price (₹)</label>
                  <input
                    type="number"
                    required
                    value={editingProduct.price}
                    onChange={(e) => setEditingProduct({ ...editingProduct, price: Math.max(0, parseInt(e.target.value) || 0) })}
                    className="w-full text-sm bg-gray-50 border border-gray-200 rounded-xl p-3 outline-none focus:border-pink-300 text-gray-800 font-mono"
                  />
                </div>
                <div className="space-y-1 text-left">
                  <label className="text-xs font-bold text-gray-500 uppercase">Category</label>
                  <input
                    type="text"
                    required
                    value={editingProduct.category}
                    onChange={(e) => setEditingProduct({ ...editingProduct, category: e.target.value })}
                    className="w-full text-sm bg-gray-50 border border-gray-200 rounded-xl p-3 outline-none focus:border-pink-300 text-gray-800"
                  />
                </div>
              </div>

              <div className="space-y-1 text-left">
                <label className="text-xs font-bold text-gray-500 uppercase">Brand</label>
                <input
                  type="text"
                  required
                  value={editingProduct.brand}
                  onChange={(e) => setEditingProduct({ ...editingProduct, brand: e.target.value })}
                  className="w-full text-sm bg-gray-50 border border-gray-200 rounded-xl p-3 outline-none focus:border-pink-300 text-gray-800"
                />
              </div>

              <div className="space-y-1 text-left">
                <label className="text-xs font-bold text-gray-500 uppercase">Description</label>
                <textarea
                  rows={3}
                  value={editingProduct.description}
                  onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                  className="w-full text-sm bg-gray-50 border border-gray-200 rounded-xl p-3 outline-none focus:border-pink-300 text-gray-800 resize-none"
                />
              </div>

              {/* EDIT PRODUCT GALLERY IMAGES SECTION */}
              <div className="space-y-2 text-left border-t border-slate-100 pt-4">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-gray-500 uppercase block">Product Gallery Images ({(editingProduct.images || []).length}/5)</label>
                  <span className="text-[10px] text-gray-400">Main is first image</span>
                </div>
                
                {/* Image thumbnails grid with remove overlay */}
                <div className="grid grid-cols-5 gap-2.5">
                  {(editingProduct.images || []).map((imgUrl, idx) => (
                    <div 
                      key={idx} 
                      className="group relative aspect-square bg-slate-50 border border-slate-200 rounded-xl overflow-hidden shadow-xs hover:border-rose-300 transition-colors"
                    >
                      <img 
                        src={imgUrl} 
                        alt={`Gallery ${idx + 1}`} 
                        className="w-full h-full object-contain p-1 mix-blend-multiply"
                        referrerPolicy="no-referrer"
                      />
                      {/* Delete button overlay on hover */}
                      <button
                        type="button"
                        onClick={() => handleEditProductImageDelete(idx)}
                        className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity duration-150 rounded-xl cursor-pointer"
                        title="Delete Image"
                      >
                        <Trash2 className="w-5 h-5 text-rose-300" />
                      </button>
                      <span className="absolute bottom-1 right-1 bg-gray-900/80 text-[8px] font-bold text-white px-1.5 py-0.5 rounded-md">
                        {idx === 0 ? "Main" : idx + 1}
                      </span>
                    </div>
                  ))}

                  {/* Empty slots placeholders showing that they can add */}
                  {Array.from({ length: Math.max(0, 5 - (editingProduct.images || []).length) }).map((_, placeholderIdx) => (
                    <div 
                      key={`placeholder-${placeholderIdx}`} 
                      className="aspect-square bg-slate-50 border-2 border-dashed border-slate-200 rounded-xl flex items-center justify-center text-slate-300"
                    >
                      <Plus className="w-5 h-5" />
                    </div>
                  ))}
                </div>

                {/* File Upload and URL upload row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  {/* File Upload Trigger */}
                  <div className="relative">
                    <label 
                      className={`flex items-center justify-center gap-1.5 border border-gray-200 bg-white hover:bg-slate-50 font-bold text-xs text-slate-700 py-3 rounded-xl shadow-xs cursor-pointer transition-all active:scale-95 text-center ${
                        (editingProduct.images || []).length >= 5 ? "opacity-50 pointer-events-none" : ""
                      }`}
                    >
                      <Upload className="w-3.5 h-3.5 text-[#e1007a]" />
                      Upload Photo File
                      <input 
                        type="file"
                        accept="image/*"
                        onChange={handleEditProductImageUpload}
                        className="hidden"
                        disabled={(editingProduct.images || []).length >= 5}
                      />
                    </label>
                  </div>

                  {/* Manual URL Input */}
                  <div className="flex gap-2">
                    <input 
                      type="text"
                      placeholder="Add Image URL..."
                      value={editImgUrlInput}
                      onChange={(e) => setEditImgUrlInput(e.target.value)}
                      disabled={(editingProduct.images || []).length >= 5}
                      className="flex-1 text-xs bg-gray-50 border border-gray-200 rounded-xl px-3 outline-none focus:border-pink-300 text-gray-800 disabled:opacity-50"
                    />
                    <button
                      type="button"
                      onClick={handleAddEditImageByUrl}
                      disabled={(editingProduct.images || []).length >= 5}
                      className="px-3 bg-slate-800 hover:bg-slate-900 border border-slate-700 text-white font-bold rounded-xl text-xs active:scale-95 disabled:bg-slate-200 disabled:border-transparent transition-all cursor-pointer"
                    >
                      Add
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setEditingProduct(null)}
                  className="px-5 py-2.5 border rounded-xl text-xs font-bold text-gray-600 hover:bg-gray-50 active:scale-95"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-[#e1007a] hover:bg-[#c20068] text-white text-xs font-bold rounded-xl active:scale-95 shadow-md"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT USER ROLE/PROFILE MODAL popup */}
      {editingUser && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-8 shadow-2xl relative animate-in zoom-in-95 duration-150">
            <h3 className="font-extrabold text-xl mb-4 text-left">Edit User Profile / Role</h3>
            <form onSubmit={handleUpdateUser} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1 text-left">
                  <label className="text-xs font-bold text-gray-500 uppercase">First Name</label>
                  <input
                    type="text"
                    required
                    value={editingUser.firstName}
                    onChange={(e) => setEditingUser({ ...editingUser, firstName: e.target.value })}
                    className="w-full text-sm bg-gray-50 border border-gray-200 rounded-xl p-3 outline-none focus:border-pink-300 text-gray-800"
                  />
                </div>
                <div className="space-y-1 text-left">
                  <label className="text-xs font-bold text-gray-500 uppercase">Last Name</label>
                  <input
                    type="text"
                    required
                    value={editingUser.lastName}
                    onChange={(e) => setEditingUser({ ...editingUser, lastName: e.target.value })}
                    className="w-full text-sm bg-gray-50 border border-gray-200 rounded-xl p-3 outline-none focus:border-pink-300 text-gray-800"
                  />
                </div>
              </div>

              {/* Editable Roles switcher to demo both admin and standard user views instantly */}
              <div className="space-y-1.5 text-left">
                <label className="text-xs font-bold text-gray-500 uppercase">Security Role Assignment</label>
                <select
                  value={editingUser.role}
                  onChange={(e) => setEditingUser({ ...editingUser, role: e.target.value as UserRole })}
                  className="w-full text-sm bg-gray-50 border border-gray-200 rounded-xl p-3 outline-none focus:border-pink-300 text-gray-800"
                >
                  <option value={UserRole.ADMIN}>Admin - Full Console Access</option>
                  <option value={UserRole.USER}>User - Restricted (No Admin Dashboard Option)</option>
                </select>
                <p className="text-[10px] text-gray-400 font-medium">Changing user roles allows you to test the protected menu toggles immediately on authentication logout/re-login.</p>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setEditingUser(null)}
                  className="px-5 py-2.5 border rounded-xl text-xs font-bold text-gray-600 hover:bg-gray-50 active:scale-95"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-[#e1007a] hover:bg-[#c20068] text-white text-xs font-bold rounded-xl active:scale-95 shadow-md"
                >
                  Update Account
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
