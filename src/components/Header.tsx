import { ShoppingCart, Menu, X, LogOut, LayoutDashboard, User } from "lucide-react";
import { useState } from "react";
import { UserProfile, UserRole, ActiveTab } from "../types";

interface HeaderProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  currentUser: UserProfile | null;
  onLogout: () => void;
  cartCount: number;
  onOpenCart: () => void;
}

export default function Header({
  activeTab,
  setActiveTab,
  currentUser,
  onLogout,
  cartCount,
  onOpenCart,
}: HeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isAdmin = currentUser?.role === UserRole.ADMIN;

  const navItems = [
    { id: "home", label: "Home" },
    { id: "products", label: "Products" },
  ];

  const handleTabClick = (tabId: ActiveTab) => {
    setActiveTab(tabId);
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-[#fff0f6] border-b border-pink-100 shadow-sm px-4 lg:px-8 py-3 transition-all duration-300">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* LOGO */}
        <div 
          id="ekart-logo"
          onClick={() => handleTabClick("home")} 
          className="flex items-center space-x-2 cursor-pointer select-none group"
        >
          <div className="relative p-2 bg-[#e1007a] rounded-lg text-white group-hover:scale-105 transition-transform duration-200 shadow-md">
            <ShoppingCart className="w-6 h-6 stroke-[2.5]" />
          </div>
          <span className="text-2xl font-black tracking-tighter text-[#e1007a] font-sans flex items-center">
            EK<span className="text-gray-800">ART</span>
          </span>
        </div>

        {/* DESKTOP NAV */}
        <nav className="hidden md:flex items-center space-x-8 font-sans">
          {navItems.map((item) => (
            <button
              key={item.id}
              id={`nav-${item.id}`}
              onClick={() => handleTabClick(item.id as ActiveTab)}
              className={`text-base font-semibold px-1 py-1 transition-all relative ${
                activeTab === item.id
                  ? "text-[#e1007a] font-bold"
                  : "text-gray-700 hover:text-[#e1007a]"
              }`}
            >
              {item.label}
              {activeTab === item.id && (
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#e1007a] rounded-full" />
              )}
            </button>
          ))}

          {currentUser && (
            <button
              id="nav-profile"
              onClick={() => handleTabClick("profile")}
              className={`text-base font-semibold px-1 py-1 transition-all relative flex items-center gap-1.5 ${
                activeTab === "profile"
                  ? "text-[#e1007a] font-bold"
                  : "text-gray-700 hover:text-[#e1007a]"
              }`}
            >
              <User className="w-4 h-4" />
              Hello, {currentUser.firstName}
              {activeTab === "profile" && (
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#e1007a] rounded-full" />
              )}
            </button>
          )}

          {/* DASHBOARD TAB (Only shown for Admin role) */}
          {isAdmin && (
            <button
              id="nav-dashboard"
              onClick={() => handleTabClick("dashboard")}
              className={`text-base font-semibold px-1 py-1 transition-all relative flex items-center gap-1.5 ${
                activeTab === "dashboard"
                  ? "text-[#e1007a] font-bold"
                  : "text-gray-700 hover:text-[#e1007a]"
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              Dashboard
              {activeTab === "dashboard" && (
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#e1007a] rounded-full" />
              )}
            </button>
          )}
        </nav>

        {/* RIGHT ACTION BUTTONS */}
        <div className="flex items-center space-x-4">
          {/* CART ICON WITH BADGE */}
          <button
            id="cart-btn"
            onClick={onOpenCart}
            className="relative p-2.5 text-gray-700 hover:text-[#e1007a] hover:bg-pink-50 rounded-full transition-all duration-200"
          >
            <ShoppingCart className="w-6 h-6 stroke-[2]" />
            {cartCount > 0 && (
              <span id="cart-badge" className="absolute -top-1 -right-1 bg-[#e1007a] text-white text-[10px] font-bold px-2 py-0.5 rounded-full min-w-[20px] text-center border-2 border-white animate-pulse">
                {cartCount}
              </span>
            )}
          </button>

          {/* LOGOUT BUTTON */}
          {currentUser ? (
            <button
              id="logout-btn"
              onClick={onLogout}
              className="hidden md:flex items-center gap-2 bg-[#e1007a] hover:bg-[#c20068] active:scale-95 text-white text-sm font-bold px-5 py-2 rounded-lg transition-all duration-150 shadow-md hover:shadow-pink-200"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          ) : (
            <button
              id="login-btn"
              onClick={() => handleTabClick("login")}
              className="hidden md:block bg-[#e1007a] hover:bg-[#c20068] active:scale-95 text-white text-sm font-bold px-5 py-2 rounded-lg transition-all duration-150 shadow-md hover:shadow-pink-200"
            >
              Login
            </button>
          )}

          {/* MOBILE MENU TOGGLE */}
          <button
            id="mobile-menu-toggle"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 text-gray-700 hover:text-[#e1007a] hover:bg-pink-50 rounded-lg transition-colors"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* MOBILE NAV DRAWER */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-white border-b border-pink-100 shadow-xl py-4 px-6 flex flex-col space-y-4 animate-in fade-in slide-in-from-top-3 duration-200 z-50">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleTabClick(item.id as ActiveTab)}
              className={`text-left text-base font-semibold py-2 px-3 rounded-lg transition-all ${
                activeTab === item.id
                  ? "bg-pink-50 text-[#e1007a] font-bold"
                  : "text-gray-700 hover:bg-gray-50 hover:text-[#e1007a]"
              }`}
            >
              {item.label}
            </button>
          ))}

          {currentUser && (
            <button
              onClick={() => handleTabClick("profile")}
              className={`text-left text-base font-semibold py-2 px-3 rounded-lg transition-all flex items-center gap-2 ${
                activeTab === "profile"
                  ? "bg-pink-50 text-[#e1007a] font-bold"
                  : "text-gray-700 hover:bg-gray-50 hover:text-[#e1007a]"
              }`}
            >
              <User className="w-4 h-4 text-[#e1007a]" />
              Hello, {currentUser.firstName}
            </button>
          )}

          {isAdmin && (
            <button
              onClick={() => handleTabClick("dashboard")}
              className={`text-left text-base font-semibold py-2 px-3 rounded-lg transition-all flex items-center gap-2 ${
                activeTab === "dashboard"
                  ? "bg-pink-50 text-[#e1007a] font-bold"
                  : "text-gray-700 hover:bg-gray-50 text-[#e1007a]"
              }`}
            >
              <LayoutDashboard className="w-4 h-4 text-[#e1007a]" />
              Dashboard
            </button>
          )}

          {currentUser ? (
            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                onLogout();
              }}
              className="flex items-center justify-center gap-2 bg-[#e1007a] hover:bg-[#c20068] text-white font-bold p-3 rounded-lg transition-colors shadow-md"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          ) : (
            <button
              onClick={() => handleTabClick("login")}
              className="flex items-center justify-center gap-2 bg-[#e1007a] hover:bg-[#c20068] text-white font-bold p-3 rounded-lg transition-colors shadow-md"
            >
              Login
            </button>
          )}
        </div>
      )}
    </header>
  );
}
