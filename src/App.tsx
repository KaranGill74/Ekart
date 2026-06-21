/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from "react";
import { UserProfile, Product, Order, CartItem, ActiveTab, UserRole, OrderStatus } from "./types";
import { INITIAL_USERS, INITIAL_PRODUCTS, INITIAL_ORDERS } from "./data";
import Header from "./components/Header";
import Hero from "./components/Hero";
import ProductsSection from "./components/ProductsSection";
import ProfileTab from "./components/ProfileTab";
import DashboardTab from "./components/DashboardTab";
import LoginSignup from "./components/LoginSignup";
import CartDrawer from "./components/CartDrawer";
import { ShieldCheck, Lock, LogIn, ExternalLink, ShoppingCart } from "lucide-react";
import {
  getRemoteUsers,
  saveRemoteUser,
  deleteRemoteUser,
  getRemoteProducts,
  saveRemoteProduct,
  deleteRemoteProduct,
  getRemoteOrders,
  saveRemoteOrder,
  deleteRemoteOrder
} from "./lib/firebase";

export default function App() {
  // 1. Core database collections stored in LocalStorage for dynamic state saving
  const [users, setUsers] = useState<UserProfile[]>(() => {
    const saved = localStorage.getItem("ekart_db_users");
    return saved ? JSON.parse(saved) : INITIAL_USERS;
  });

  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem("ekart_db_products");
    return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem("ekart_db_orders");
    return saved ? JSON.parse(saved) : INITIAL_ORDERS;
  });

  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => {
    const isSessionActive = localStorage.getItem("ekart_session_active");
    if (isSessionActive === "false") {
      return null;
    }
    const saved = localStorage.getItem("ekart_current_user");
    // Pre-seed authenticated as the Admin "Karan Gill" to match screenshots exactly on load
    if (saved) return JSON.parse(saved);
    const initialAdmin = INITIAL_USERS.find(u => u.role === UserRole.ADMIN) || INITIAL_USERS[0];
    return initialAdmin;
  });

  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem("ekart_current_cart");
    return saved ? JSON.parse(saved) : [];
  });

  // Track Firestore loading and previous products
  const [isDbLoaded, setIsDbLoaded] = useState(false);
  const [prevProducts, setPrevProducts] = useState<Product[]>(products);
  const [prevOrders, setPrevOrders] = useState<Order[]>(orders);
  const [prevUsers, setPrevUsers] = useState<UserProfile[]>(users);

  // 2. Navigational page toggles
  const [activeTab, setActiveTab] = useState<ActiveTab>("home");
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [globalToast, setGlobalToast] = useState<string | null>(null);

  // Load initial data from Firebase Firestore (NoSQL Document Database like MongoDB)
  useEffect(() => {
    async function loadFirestoreData() {
      try {
        const dbUsers = await getRemoteUsers(INITIAL_USERS);
        setUsers(dbUsers);
        setPrevUsers(dbUsers);

        const dbProducts = await getRemoteProducts(INITIAL_PRODUCTS);
        setProducts(dbProducts);
        setPrevProducts(dbProducts);

        const dbOrders = await getRemoteOrders(INITIAL_ORDERS);
        setOrders(dbOrders);
        setPrevOrders(dbOrders);

        // Sync local session profile with remote
        const currentSessionUser = localStorage.getItem("ekart_current_user");
        if (currentSessionUser) {
          const parsed = JSON.parse(currentSessionUser) as UserProfile;
          const found = dbUsers.find(u => u.id === parsed.id || u.email === parsed.email);
          if (found) {
            setCurrentUser(found);
          }
        }
      } catch (err) {
        console.error("Error connecting to database:", err);
      } finally {
        setIsDbLoaded(true);
      }
    }
    loadFirestoreData();
  }, []);

  // Sync state to LocalStorage and Firebase Firestore NoSQL Database
  useEffect(() => {
    localStorage.setItem("ekart_db_users", JSON.stringify(users));
    if (isDbLoaded) {
      // Find deleted users
      const deleted = prevUsers.filter(u => !users.some(curr => curr.id === u.id));
      deleted.forEach((u) => {
        deleteRemoteUser(u.id);
      });
      // Save current users
      users.forEach((u) => {
        saveRemoteUser(u);
      });
      setPrevUsers(users);
    }
  }, [users, isDbLoaded, prevUsers]);

  useEffect(() => {
    localStorage.setItem("ekart_db_products", JSON.stringify(products));
    if (isDbLoaded) {
      // Find deleted products
      const deleted = prevProducts.filter(p => !products.some(curr => curr.id === p.id));
      deleted.forEach((p) => {
        deleteRemoteProduct(p.id);
      });
      // Save current products
      products.forEach((p) => {
        saveRemoteProduct(p);
      });
      setPrevProducts(products);
    }
  }, [products, isDbLoaded, prevProducts]);

  useEffect(() => {
    localStorage.setItem("ekart_db_orders", JSON.stringify(orders));
    if (isDbLoaded) {
      // Find deleted orders
      const deleted = prevOrders.filter(o => !orders.some(curr => curr.id === o.id));
      deleted.forEach((o) => {
        deleteRemoteOrder(o.id);
      });
      // Save current orders
      orders.forEach((o) => {
        saveRemoteOrder(o);
      });
      setPrevOrders(orders);
    }
  }, [orders, isDbLoaded, prevOrders]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem("ekart_current_user", JSON.stringify(currentUser));
      localStorage.setItem("ekart_session_active", "true");
    } else {
      localStorage.removeItem("ekart_current_user");
      localStorage.setItem("ekart_session_active", "false");
    }
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem("ekart_current_cart", JSON.stringify(cart));
  }, [cart]);

  // Toast trigger
  const triggerToast = (msg: string) => {
    setGlobalToast(msg);
    setTimeout(() => setGlobalToast(null), 3000);
  };

  // Add to cart workflow
  const handleAddToCart = (product: Product, quantity: number = 1) => {
    setCart((prev) => {
      const match = prev.find((item) => item.product.id === product.id);
      if (match) {
        triggerToast(`Added ${quantity} more of ${product.brand} to cart!`);
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      triggerToast(`Added ${product.brand} (${quantity} units) to cart!`);
      return [...prev, { product, quantity }];
    });
  };

  // Update Cart quantities
  const handleUpdateCartQuantity = (productId: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.product.id === productId) {
            const nextQty = item.quantity + delta;
            return { ...item, quantity: nextQty };
          }
          return item;
        })
        .filter((item) => item.quantity > 0)
    );
  };

  const handleRemoveCartItem = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
    triggerToast("Item cleared from basket.");
  };

  const handleClearCart = () => {
    setCart([]);
    triggerToast("Cart emptied.");
  };

  // Checkout checkout order trigger with Razorpay gateway
  const handleCheckout = async () => {
    if (!currentUser) {
      setIsCartOpen(false);
      setActiveTab("login");
      triggerToast("Please log in to place orders.");
      return;
    }

    if (cart.length === 0) return;

    // Load Razorpay SDK Script
    triggerToast("Initiating secure Razorpay gateway...");
    const isLoaded = await new Promise<boolean>((resolve) => {
      if ((window as any).Razorpay) {
        resolve(true);
        return;
      }
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.async = true;
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });

    if (!isLoaded) {
      triggerToast("Failed to load Razorpay payment gateway. Please check your internet connection.");
      return;
    }

    // Build unique hexadecimal order ID starting with 6a2d/6a2e matching screenshots
    const randHex = Array.from({ length: 21 }, () =>
      Math.floor(Math.random() * 16).toString(16)
    ).join("");
    const orderId = `6a2d${randHex}`;

    // Sum details
    const subtotal = cart.reduce(
      (acc, item) => acc + item.product.price * item.quantity,
      0
    );
    const estimatedTax = subtotal * 0.05;
    const deliveryCharges = subtotal > 50000 ? 0 : 99;
    const finalAmount = Number((subtotal + estimatedTax + deliveryCharges).toFixed(2));

    const invoiceLines = cart.map((item) => ({
      productId: item.product.id,
      productName: item.product.name,
      price: item.product.price,
      imageUrl: item.product.imageUrl,
      quantity: item.quantity,
    }));

    // Configure Razorpay payment options
    const options = {
      key: ((import.meta as any).env?.VITE_RAZORPAY_KEY_ID as string) || "rzp_test_uNkE8m8nB6gZaN", // Fallback to a functional test key
      amount: Math.round(finalAmount * 100), // Amount in paise
      currency: "INR",
      name: "eKart Electronics",
      description: `Order of ${cart.reduce((s, i) => s + i.quantity, 0)} item(s)`,
      image: "https://cdn-icons-png.flaticon.com/512/1162/1162499.png",
      handler: function (response: any) {
        const paymentId = response.razorpay_payment_id || `rzp_p_${Math.random().toString(36).substring(2, 11)}`;
        
        const newOrder: Order = {
          id: orderId,
          userId: currentUser.id,
          userFirstName: currentUser.firstName,
          userLastName: currentUser.lastName,
          userEmail: currentUser.email,
          items: invoiceLines,
          totalAmount: finalAmount,
          status: OrderStatus.PAID, // Succesfully checked out
          createdAt: new Date().toISOString(),
          paymentId: paymentId,
        };

        // Append to orders
        setOrders((prev) => [newOrder, ...prev]);
        // Reset cart
        setCart([]);
        setIsCartOpen(false);

        // Swap tab to user Profile tab, and trigger Order viewing
        setActiveTab("profile");
        triggerToast(`Payment successful! ID: ${paymentId}. Order placed!`);
      },
      prefill: {
        name: `${currentUser.firstName} ${currentUser.lastName}`,
        email: currentUser.email,
        contact: currentUser.phone || "9999999999",
      },
      notes: {
        address: `${currentUser.address || ""}, ${currentUser.city || ""}, ${currentUser.zipCode || ""}`,
        order_reference: orderId,
      },
      theme: {
        color: "#e1007a", // Premium pink accent color of this app
      },
    };

    try {
      const rzp = new (window as any).Razorpay(options);
      rzp.on("payment.failed", function (resp: any) {
        triggerToast(`Payment failed: ${resp.error.description}`);
      });
      rzp.open();
    } catch (err) {
      console.error("Razorpay initiation error:", err);
      triggerToast("Error launching Razorpay secure window. Try again in a moment.");
    }
  };

  // Logout trigger
  const handleLogout = () => {
    setCurrentUser(null);
    setCart([]);
    setActiveTab("home");
    triggerToast("Logged out successfully.");
  };

  // Handle successful login
  const handleLoginSuccess = (user: UserProfile) => {
    setCurrentUser(user);
    setActiveTab("home");
    triggerToast(`Welcome back, ${user.firstName}!`);
  };

  // Profile data saver
  const handleUpdateProfile = (updated: UserProfile) => {
    setCurrentUser(updated);
    setUsers((prev) => prev.map((u) => (u.id === updated.id ? updated : u)));
  };

  // Calculate cart counts
  const totalCartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  // Filter orders for the logged-in user
  const userFilteredOrders = orders.filter((o) => o.userEmail === currentUser?.email);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between font-sans relative antialiased text-gray-800">
      
      {/* GLOBAL DISMISSABLE FLOATING TOAST NOTIFICATION */}
      {globalToast && (
        <div className="fixed bottom-6 left-6 z-[120] bg-gray-900 border border-gray-800 text-white text-xs font-bold px-5 py-3.5 rounded-2xl shadow-2xl flex items-center gap-3 animate-in fade-in slide-in-from-bottom-2 duration-300">
          <span className="w-2.5 h-2.5 rounded-full bg-[#e1007a] animate-ping" />
          <span>{globalToast}</span>
        </div>
      )}

      {/* HEADER SECTION */}
      <Header
        activeTab={activeTab === "login" ? "home" : activeTab}
        setActiveTab={(tab) => {
          // If trying to access dashboard but NOT admin, lock it!
          if (tab === "dashboard" && currentUser?.role !== UserRole.ADMIN) {
            triggerToast("Access denied: Admin level permissions required.");
            return;
          }
          setActiveTab(tab);
        }}
        currentUser={currentUser}
        onLogout={handleLogout}
        cartCount={totalCartCount}
        onOpenCart={() => {
          if (!currentUser) {
            setActiveTab("login");
            triggerToast("Please log in to access your shopping cart.");
          } else {
            setIsCartOpen(true);
          }
        }}
      />

      {/* PRIMARY VIEWS CONTENT ROUTER BAR */}
      <main className="flex-grow pb-16">
        {activeTab === "home" && (
          <div className="animate-in fade-in duration-300">
            {/* HERO PROMOTIONAL BANNER */}
            <Hero onShopNow={() => {
              setActiveTab("products");
            }} />
          </div>
        )}

        {activeTab === "products" && (
          <div className="animate-in fade-in duration-200">
            <ProductsSection
              products={products}
              onAddToCart={handleAddToCart}
            />
          </div>
        )}

        {activeTab === "profile" && currentUser && (
          <div className="animate-in fade-in duration-200">
            <ProfileTab
              currentUser={currentUser}
              onUpdateProfile={handleUpdateProfile}
              userOrders={userFilteredOrders}
            />
          </div>
        )}

        {/* ADMIN DASHBOARD (Conditionally protected) */}
        {activeTab === "dashboard" && (
          currentUser?.role === UserRole.ADMIN ? (
            <div className="animate-in slide-in-from-bottom-3 duration-250">
              <DashboardTab
                products={products}
                setProducts={setProducts}
                users={users}
                setUsers={setUsers}
                orders={orders}
                setOrders={setOrders}
              />
            </div>
          ) : (
            /* SECURITY LOCKBOARD RESTRICTED MESSAGE FOR NON-ADMINS */
            <div className="max-w-md mx-auto my-16 bg-white p-8 border border-red-150 rounded-2xl shadow-xl text-center space-y-4">
              <div className="w-16 h-16 bg-rose-50 text-[#e1007a] rounded-full flex items-center justify-center mx-auto shadow-inner">
                <Lock className="w-8 h-8" />
              </div>
              <h2 className="text-xl font-extrabold text-gray-900">Dashboard Restricted</h2>
              <p className="text-sm text-gray-500 leading-relaxed">
                You are currently signed in as a standard User account. The EKART management console is fully secured and reserved for registered administrator roles.
              </p>
              <button
                onClick={() => setActiveTab("login")}
                className="mt-6 bg-[#e1007a] hover:bg-[#c20068] text-white text-xs font-bold px-6 py-2.5 rounded-xl shadow-md transition-all active:scale-95 flex items-center gap-1.5 mx-auto"
              >
                <LogIn className="w-4 h-4" />
                Switch to Admin Account
              </button>
            </div>
          )
        )}

        {activeTab === "login" && (
          <div className="animate-in fade-in duration-200">
            <LoginSignup
              onLoginSuccess={handleLoginSuccess}
              allUsers={users}
              setUsers={setUsers}
            />
          </div>
        )}
      </main>

      {/* FLY-OUT CHECKOUT SHOPPING CART PANEL */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cart}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveItem={handleRemoveCartItem}
        onClearCart={handleClearCart}
        onCheckout={handleCheckout}
      />

      {/* COMPACT CLEAN BRUTS/MODERN FOOTER */}
      <footer className="bg-[#0f172a] text-slate-400 py-10 mt-auto font-sans text-xs border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
          
          <div className="space-y-3 text-left">
            <div className="flex items-center space-x-2 text-white">
              <div className="p-1.5 bg-[#e1007a] rounded-lg text-white">
                <ShoppingCart className="w-4 h-4" />
              </div>
              <span className="font-extrabold text-base tracking-tighter text-white">
                EK<span className="text-slate-400">ART</span>
              </span>
            </div>
            <p className="text-slate-500 leading-relaxed">
              Powering Your World with the Best in Electronics. Delivering cutting-edge smart devices worldwide at unmatched value.
            </p>
          </div>

          <div className="text-left space-y-2">
            <h4 className="font-bold text-white uppercase tracking-wider text-xs mb-1">Customer Service</h4>
            <p className="hover:text-white transition-colors cursor-pointer">Help & Support Guides</p>
            <p className="hover:text-white transition-colors cursor-pointer">Return & Exchange Policies</p>
            <p className="hover:text-white transition-colors cursor-pointer">Shipping Schedules</p>
          </div>

          <div className="text-left space-y-2">
            <h4 className="font-bold text-white uppercase tracking-wider text-xs mb-1">Follow Us</h4>
            <p className="hover:text-[#e1007a] transition-colors cursor-pointer">Instagram updates</p>
            <p className="hover:text-blue-400 transition-colors cursor-pointer">Twitter broadcasts</p>
            <p className="hover:text-indigo-400 transition-colors cursor-pointer">Facebook channel</p>
          </div>

          <div className="text-left space-y-3">
            <h4 className="font-bold text-white uppercase tracking-wider text-xs mb-1">Stay in the Loop</h4>
            <p className="text-slate-500 leading-relaxed">Subscribe to get notify about special holiday product pricing.</p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="your.email@domain.com"
                className="bg-slate-800/80 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white max-w-[160px] outline-none focus:border-pink-500"
              />
              <button 
                onClick={() => triggerToast("Successfully subscribed to newsletter.")}
                className="bg-[#e1007a] text-white px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-[#c20068] active:scale-95 transition-all cursor-pointer"
              >
                Join
              </button>
            </div>
          </div>

        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 pt-6 border-t border-slate-800/80 text-center text-slate-600 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p>© 2026 EKART Electronics Inc. Crafted with precision layout.</p>
          <div className="flex gap-3 text-slate-500">
            <span className="hover:text-rose-400 cursor-pointer">Privacy Policy</span>
            <span>•</span>
            <span className="hover:text-rose-400 cursor-pointer">Terms of Service</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
