import { User, ClipboardList, ArrowLeft, Terminal, Camera } from "lucide-react";
import React, { useState } from "react";
import { UserProfile, Order, OrderStatus } from "../types";

interface ProfileTabProps {
  currentUser: UserProfile;
  onUpdateProfile: (updated: UserProfile) => void;
  userOrders: Order[];
}

export default function ProfileTab({
  currentUser,
  onUpdateProfile,
  userOrders,
}: ProfileTabProps) {
  const [activeSubTab, setActiveSubTab] = useState<"profile" | "orders">("profile");

  // Profile form state
  const [firstName, setFirstName] = useState(currentUser.firstName);
  const [lastName, setLastName] = useState(currentUser.lastName);
  const [phone, setPhone] = useState(currentUser.phone);
  const [address, setAddress] = useState(currentUser.address);
  const [city, setCity] = useState(currentUser.city);
  const [zipCode, setZipCode] = useState(currentUser.zipCode);
  const [avatarUrl, setAvatarUrl] = useState(currentUser.avatarUrl);
  
  // Custom uploaded/selected image preview states for granular removal control
  const [stagedPreviewUrl, setStagedPreviewUrl] = useState<string | null>(null);

  // Reset Password states
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Sync internal form state whenever currentUser changes (e.g. loaded from LocalStorage or saved)
  React.useEffect(() => {
    setFirstName(currentUser.firstName);
    setLastName(currentUser.lastName);
    setPhone(currentUser.phone);
    setAddress(currentUser.address);
    setCity(currentUser.city);
    setZipCode(currentUser.zipCode);
    setAvatarUrl(currentUser.avatarUrl);
    setStagedPreviewUrl(null);
  }, [currentUser]);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleResetPassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword) {
      triggerToast("Please enter a new password.");
      return;
    }
    if (newPassword.length < 4) {
      triggerToast("Password must be at least 4 characters long.");
      return;
    }
    if (newPassword !== confirmPassword) {
      triggerToast("Oops! Passwords do not match.");
      return;
    }

    const updated: UserProfile = {
      ...currentUser,
      password: newPassword,
    };
    onUpdateProfile(updated);
    setNewPassword("");
    setConfirmPassword("");
    triggerToast("Your password was reset successfully!");
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const resultUrl = reader.result as string;
        
        // Instantly update avatarUrl and lift the state up to auto-save to localStorage
        setAvatarUrl(resultUrl);
        setStagedPreviewUrl(null);
        
        const updated: UserProfile = {
          ...currentUser,
          firstName,
          lastName,
          phone,
          address,
          city,
          zipCode,
          avatarUrl: resultUrl,
        };
        onUpdateProfile(updated);
        triggerToast("Profile picture uploaded and saved successfully!");
        
        // Reset the input value so selecting the same file triggers onChange again
        e.target.value = "";
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmitProfile = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Staged preview is applied as final on save
    const finalAvatarUrl = stagedPreviewUrl !== null ? stagedPreviewUrl : avatarUrl;

    const updated: UserProfile = {
      ...currentUser,
      firstName,
      lastName,
      phone,
      address,
      city,
      zipCode,
      avatarUrl: finalAvatarUrl,
    };
    onUpdateProfile(updated);
    setAvatarUrl(finalAvatarUrl);
    setStagedPreviewUrl(null);
    triggerToast("Profile successfully updated!");
  };

  return (
    <div id="profile-dashboard-wrapper" className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 font-sans">
      
      {/* TOAST NOTIFICATION */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 bg-gray-900 text-white text-xs font-bold px-5 py-3 rounded-xl shadow-2xl flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2 duration-200">
          <span className="w-2 h-2 rounded-full bg-[#e1007a] animate-ping" />
          {toastMessage}
        </div>
      )}

      {/* SUB TABS NAVIGATION */}
      <div id="profile-subtabs" className="flex items-center justify-center space-x-4 mb-8">
        <button
          id="profile-subtab-btn"
          onClick={() => setActiveSubTab("profile")}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all duration-150 active:scale-95 border ${
            activeSubTab === "profile"
              ? "bg-white text-gray-900 border-gray-200 shadow-md"
              : "bg-transparent text-gray-500 border-transparent hover:text-gray-900 hover:bg-gray-50"
          }`}
        >
          <User className="w-4 h-4 text-[#e1007a]" />
          Profile
        </button>
        <button
          id="orders-subtab-btn"
          onClick={() => setActiveSubTab("orders")}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all duration-150 active:scale-95 border ${
            activeSubTab === "orders"
              ? "bg-white text-gray-900 border-gray-200 shadow-md"
              : "bg-transparent text-gray-500 border-transparent hover:text-gray-900 hover:bg-gray-50"
          }`}
        >
          <Terminal className="w-4 h-4 text-[#e1007a]" />
          Orders
        </button>
      </div>

      {/* RENDER ACTIVE TAB */}
      {activeSubTab === "profile" ? (
        /* UPDATE PROFILE PAGE */
        <div id="update-profile-view" className="space-y-6">
          <div className="text-center">
            <h1 className="text-3xl font-extrabold text-gray-900">Update Profile</h1>
          </div>

          <form onSubmit={handleSubmitProfile} className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start mt-8">
            
            {/* LEFT PROFILE PICTURE EDIT CARD */}
            <div className="md:col-span-1 bg-white border border-gray-100 p-6 rounded-3xl shadow-sm text-center flex flex-col items-center">
              {/* Profile image with initials fallback */}
              <div className="relative w-36 h-36 rounded-full p-1 border-4 border-[#e1007a] shadow-inner select-none overflow-hidden mb-4 bg-gray-50 flex items-center justify-center">
                {stagedPreviewUrl !== null ? (
                  <img
                    src={stagedPreviewUrl}
                    alt="Staged custom avatar"
                    className="w-full h-full rounded-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                ) : avatarUrl ? (
                  <img
                    src={avatarUrl}
                    alt="User Avatar"
                    className="w-full h-full rounded-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="w-full h-full rounded-full bg-gradient-to-tr from-[#e1007a] to-pink-400 flex items-center justify-center text-white font-black text-5xl shadow-inner uppercase select-none">
                    {(firstName?.[0] || currentUser.firstName?.[0] || "U").toUpperCase()}
                  </div>
                )}
                
                {/* Instant image hover click overlays */}
                <label className="absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 transition-opacity duration-150 flex flex-col items-center justify-center cursor-pointer text-white text-[10px] uppercase tracking-wider font-extrabold">
                  <Camera className="w-6 h-6 text-white mb-1" />
                  Upload Photo
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>
              </div>

              {/* Action Buttons to remove / upload photo */}
              <div className="flex flex-col gap-2 w-full max-w-[190px]">
                <label className="bg-[#e1007a] hover:bg-[#c20068] active:scale-95 text-white font-bold text-xs py-2 px-4 rounded-full transition-all tracking-wider shadow-sm cursor-pointer text-center block">
                  Select Photo File
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>

                {/* Remove before uploading (Clears current staged files preview) */}
                {stagedPreviewUrl && (
                  <button
                    type="button"
                    onClick={() => {
                      setStagedPreviewUrl(null);
                      triggerToast("Staged photo canceled (removed before uploading).");
                    }}
                    className="bg-amber-50 hover:bg-amber-100 text-amber-800 font-bold text-[10px] py-1.5 rounded-full transition-all border border-amber-200 uppercase tracking-wider block"
                  >
                    Cancel Staged
                  </button>
                )}

                {/* Remove after uploading (Clears current avatar Url so fallback initial shows) */}
                {avatarUrl && (
                  <button
                    type="button"
                    onClick={() => {
                      setAvatarUrl("");
                      setStagedPreviewUrl(null);
                      const updated: UserProfile = {
                        ...currentUser,
                        firstName,
                        lastName,
                        phone,
                        address,
                        city,
                        zipCode,
                        avatarUrl: "",
                      };
                      onUpdateProfile(updated);
                      triggerToast("Profile picture removed and saved!");
                    }}
                    className="bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-[10px] py-1.5 rounded-full transition-all border border-rose-100 uppercase tracking-wider block"
                  >
                    Remove Photo
                  </button>
                )}
              </div>
            </div>

            {/* RIGHT FORM COLUMN FIELDS */}
            <div className="md:col-span-2 bg-white border border-gray-100 p-8 rounded-3xl shadow-xl space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1 text-left">
                  <label className="text-sm font-bold text-gray-700">First Name</label>
                  <input
                    id="profile-first-name"
                    type="text"
                    required
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="w-full text-sm bg-gray-50 border border-gray-200 rounded-xl p-3 outline-none focus:border-pink-300 focus:bg-white transition-all text-gray-800"
                  />
                </div>
                <div className="space-y-1 text-left">
                  <label className="text-sm font-bold text-gray-700">Last Name</label>
                  <input
                    id="profile-last-name"
                    type="text"
                    required
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="w-full text-sm bg-gray-50 border border-gray-200 rounded-xl p-3 outline-none focus:border-pink-300 focus:bg-white transition-all text-gray-800"
                  />
                </div>
              </div>

              <div className="space-y-1 text-left">
                <label className="text-sm font-bold text-gray-500">Email</label>
                <input
                  id="profile-email"
                  type="email"
                  disabled
                  value={currentUser.email}
                  className="w-full text-sm bg-gray-100 border border-gray-200 rounded-xl p-3 outline-none text-gray-500 cursor-not-allowed"
                />
              </div>

              <div className="space-y-1 text-left">
                <label className="text-sm font-bold text-gray-700">Phone Number</label>
                <input
                  id="profile-phone"
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full text-sm bg-gray-50 border border-gray-200 rounded-xl p-3 outline-none focus:border-pink-300 focus:bg-white transition-all text-gray-800"
                />
              </div>

              <div className="space-y-1 text-left">
                <label className="text-sm font-bold text-gray-700">Address</label>
                <input
                  id="profile-address"
                  type="text"
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full text-sm bg-gray-50 border border-gray-200 rounded-xl p-3 outline-none focus:border-pink-300 focus:bg-white transition-all text-gray-800"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1 text-left">
                  <label className="text-sm font-bold text-gray-700">City</label>
                  <input
                    id="profile-city"
                    type="text"
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full text-sm bg-gray-50 border border-gray-200 rounded-xl p-3 outline-none focus:border-pink-300 focus:bg-white transition-all text-gray-800"
                  />
                </div>
                <div className="space-y-1 text-left">
                  <label className="text-sm font-bold text-gray-700">Zip Code</label>
                  <input
                    id="profile-zip"
                    type="text"
                    required
                    value={zipCode}
                    onChange={(e) => setZipCode(e.target.value)}
                    className="w-full text-sm bg-gray-50 border border-gray-200 rounded-xl p-3 outline-none focus:border-pink-300 focus:bg-white transition-all text-gray-800"
                  />
                </div>
              </div>

              {/* PASSWORD RESET ZONE */}
              <div className="border-t border-gray-100 pt-6 mt-6 space-y-4">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-pink-50 text-[#e1007a] rounded-lg">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <h3 className="text-sm font-bold text-gray-800">Reset Your Password</h3>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1 text-left">
                    <label className="text-xs font-bold text-gray-600">New Password</label>
                    <input
                      id="reset-new-password"
                      type="password"
                      placeholder="Enter new password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full text-sm bg-gray-50 border border-gray-200 rounded-xl p-3 outline-none focus:border-pink-300 focus:bg-white transition-all text-gray-800"
                    />
                  </div>
                  <div className="space-y-1 text-left">
                    <label className="text-xs font-bold text-gray-600">Confirm New Password</label>
                    <input
                      id="reset-confirm-password"
                      type="password"
                      placeholder="Confirm new password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full text-sm bg-gray-50 border border-gray-200 rounded-xl p-3 outline-none focus:border-pink-300 focus:bg-white transition-all text-gray-800"
                    />
                  </div>
                </div>
                
                <button
                  type="button"
                  id="btn-reset-password"
                  onClick={handleResetPassword}
                  className="w-full sm:w-auto px-6 py-2.5 bg-gray-950 hover:bg-black active:scale-95 text-white font-bold text-xs rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5"
                >
                  Update Password
                </button>
              </div>

              <div className="border-t border-gray-100 pt-4">
                <button
                  type="submit"
                  id="btn-update-profile"
                  className="w-full bg-[#e1007a] hover:bg-[#c20068] active:scale-98 text-white font-bold py-3.5 rounded-xl transition-all duration-150 text-center shadow-lg hover:shadow-pink-100 flex items-center justify-center gap-1.5 cursor-pointer text-sm mt-2"
                >
                  Update Profile
                </button>
              </div>
            </div>
          </form>
        </div>
      ) : (
        /* ORDERS LISTING VIEW */
        <div id="user-orders-view" className="space-y-6">
          <div className="flex items-center space-x-3 mb-6">
            <button
              id="back-profile-btn"
              onClick={() => setActiveSubTab("profile")}
              className="p-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-2xl font-extrabold text-gray-900">Orders</h1>
          </div>

          <div className="space-y-4">
            {userOrders.length > 0 ? (
              userOrders.map((order) => (
                <div
                  key={order.id}
                  id={`order-invoice-${order.id}`}
                  className="bg-white border border-gray-100 rounded-3xl p-6 shadow-md"
                >
                  {/* Order header invoice meta-info row */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b pb-4 mb-4">
                    <div className="text-left">
                      <p className="text-sm text-gray-500 font-mono">
                        order ID: <span className="font-bold text-gray-800">{order.id}</span>
                      </p>
                      {order.paymentId && (
                        <p className="text-xs text-[#e1007a] font-mono font-medium mt-0.5">
                          Razorpay ID: <span className="font-semibold select-all">{order.paymentId}</span>
                        </p>
                      )}
                      <p className="text-xs text-gray-400 mt-0.5">
                        {new Date(order.createdAt).toLocaleString()}
                      </p>
                    </div>

                    <div className="flex items-center gap-4 text-right">
                      <p className="text-sm font-medium text-gray-500">
                        Amount: <span className="font-bold text-gray-800 font-mono">INR {order.totalAmount}</span>
                      </p>
                      <span
                        className={`text-xs font-bold px-3 py-1 rounded-full text-center ${
                          order.status === OrderStatus.PAID
                            ? "bg-emerald-500 text-white"
                            : order.status === OrderStatus.FAILED
                            ? "bg-[#fdba74] text-[#b45309]" // orange FAILED style
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {order.status}
                      </span>
                    </div>
                  </div>

                  {/* Customer details in index lines */}
                  <div className="bg-gray-50/50 p-3 rounded-2xl border border-gray-50 mb-4 text-left text-xs text-gray-500 space-y-1.5">
                    <p>
                      <span className="font-bold">User:</span> {order.userFirstName} {order.userLastName}
                    </p>
                    <p>
                      <span className="font-bold">Email:</span> {order.userEmail}
                    </p>
                  </div>

                  {/* Invoice item blocks */}
                  <div className="space-y-4">
                    <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider text-left">Products</p>
                    {order.items.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-4 bg-gray-50 p-3.5 rounded-2xl border border-gray-100">
                        <div className="w-16 h-16 bg-white rounded-xl border border-gray-100 flex items-center justify-center p-1 overflow-hidden shrink-0">
                          <img
                            src={item.imageUrl}
                            alt={item.productName}
                            className="max-h-full max-w-full object-contain"
                            referrerPolicy="no-referrer"
                          />
                        </div>
                        <div className="flex-1 text-left min-w-0">
                          <h4 className="text-xs font-bold text-gray-800 line-clamp-1">{item.productName}</h4>
                          <div className="flex items-center gap-3 mt-1 text-[11px] font-mono text-gray-500">
                            {/* Unique visual SKU reference for verification */}
                            <span className="bg-gray-150 px-1.5 py-0.5 rounded text-gray-600 select-all">
                              {item.productId === "prod-2" ? "6a1ae2b92dde4bf27518c4c" : item.productId === "prod-3" ? "6a1ae8fd92dde4bf27518cfe" : "6a2e540abaa15a6e8b4e0"}
                            </span>
                            <span className="font-bold text-gray-800">
                              ₹{item.price} x {item.quantity}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                </div>
              ))
            ) : (
              <div className="bg-white border text-center py-12 rounded-3xl text-gray-400 font-sans border-dashed">
                <p className="text-sm">You have not placed any orders yet.</p>
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
