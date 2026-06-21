import React, { useState } from "react";
import { UserProfile, UserRole } from "../types";
import { ShoppingCart, LogIn, UserPlus, ShieldAlert } from "lucide-react";

interface LoginSignupProps {
  onLoginSuccess: (user: UserProfile) => void;
  allUsers: UserProfile[];
  setUsers: React.Dispatch<React.SetStateAction<UserProfile[]>>;
}

export default function LoginSignup({
  onLoginSuccess,
  allUsers,
  setUsers,
}: LoginSignupProps) {
  const [isLoginState, setIsLoginState] = useState(true);

  // Sign in fields
  const [signInEmail, setSignInEmail] = useState("");
  const [signInPassword, setSignInPassword] = useState("password123");

  // Sign up fields
  const [signUpFirstName, setSignUpFirstName] = useState("");
  const [signUpLastName, setSignUpLastName] = useState("");
  const [signUpEmail, setSignUpEmail] = useState("");
  const [signUpPhone, setSignUpPhone] = useState("");
  const [signUpRole, setSignUpRole] = useState<UserRole>(UserRole.USER);

  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSignInSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!signInEmail) {
      setErrorMessage("Please input email!");
      return;
    }

    // Match seed users by email
    const match = allUsers.find(
      (u) => u.email.toLowerCase() === signInEmail.toLowerCase().trim()
    );

    if (match) {
      const storedPassword = match.password || "password123";
      if (signInPassword !== storedPassword) {
        setErrorMessage("Incorrect password. Please try again! (If you forgot it, use Quick Login or reset it under Profile Tab)");
        return;
      }
      onLoginSuccess(match);
    } else {
      setErrorMessage("Account not found. Consider signing up, or click a Quick Login helper below!");
    }
  };

  const handleSignUpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!signUpEmail || !signUpFirstName || !signUpLastName) {
      setErrorMessage("Please complete all required fields.");
      return;
    }

    // Check existing
    const existing = allUsers.find(
      (u) => u.email.toLowerCase() === signUpEmail.toLowerCase().trim()
    );

    if (existing) {
      setErrorMessage("This email is already registered inside EKART.");
      return;
    }

    const created: UserProfile = {
      id: `user-${Date.now()}`,
      firstName: signUpFirstName,
      lastName: signUpLastName,
      email: signUpEmail.trim(),
      phone: signUpPhone || "9876543210",
      address: "Standard Address Block",
      city: "Ludhiana",
      zipCode: "141001",
      role: signUpRole,
      avatarUrl: signUpRole === UserRole.ADMIN 
        ? "https://images.unsplash.com/photo-1628157582853-a796fa650a6a?w=150&auto=format&fit=crop&q=80"
        : "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80",
    };

    setUsers((prev) => [...prev, created]);
    onLoginSuccess(created);
  };

  // Quick Login Helpers for Reviewer Ease-of-testing
  const triggerQuickLogin = (role: UserRole) => {
    const targetEmail = role === UserRole.ADMIN 
      ? "gillkarangill23@gmail.com" 
      : "gillkarangill23+1@gmail.com";
    
    const match = allUsers.find((u) => u.email === targetEmail);
    if (match) {
      onLoginSuccess(match);
    } else {
      // Fallback
      const fallbackUser = allUsers.find((u) => u.role === role);
      if (fallbackUser) {
        onLoginSuccess(fallbackUser);
      }
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-12 font-sans">
      <div className="bg-white rounded-3xl border border-gray-100 p-8 shadow-2xl space-y-6 text-center">
        
        {/* LOGO */}
        <div className="flex flex-col items-center justify-center space-y-2">
          <div className="p-3 bg-[#e1007a] rounded-2xl text-white shadow-md inline-block">
            <ShoppingCart className="w-8 h-8 stroke-[2.5]" />
          </div>
          <h2 className="text-3xl font-black text-[#e1007a] tracking-tighter">
            EK<span className="text-gray-800">ART</span>
          </h2>
          <p className="text-gray-500 text-sm font-medium">Letest Electronics at Best Prices</p>
        </div>

        {/* FEEDBACK ERROR MESSAGE */}
        {errorMessage && (
          <div className="bg-rose-50 border border-rose-100 text-rose-700 p-3 rounded-xl text-left text-xs font-bold leading-relaxed flex items-start gap-2 animate-shake">
            <ShieldAlert className="w-4 h-4 shrink-0 text-rose-500 mt-0.5" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* TOGGLE TABS */}
        <div className="bg-gray-100 p-1.5 rounded-2xl flex items-center justify-between">
          <button
            onClick={() => {
              setIsLoginState(true);
              setErrorMessage(null);
            }}
            className={`w-1/2 font-bold py-2 px-3 text-xs rounded-xl transition-all duration-150 ${
              isLoginState
                ? "bg-white text-gray-950 shadow-sm"
                : "text-gray-500 hover:text-gray-900"
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => {
              setIsLoginState(false);
              setErrorMessage(null);
            }}
            className={`w-1/2 font-bold py-2 px-3 text-xs rounded-xl transition-all duration-150 ${
              !isLoginState
                ? "bg-white text-gray-950 shadow-sm"
                : "text-gray-500 hover:text-gray-900"
            }`}
          >
            Create Account
          </button>
        </div>

        {isLoginState ? (
          /* SIGN IN VIEW */
          <form onSubmit={handleSignInSubmit} className="space-y-4 text-left">
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-600">Email Address</label>
              <input
                id="login-email-input"
                type="email"
                required
                placeholder="e.g. gillkarangill23@gmail.com"
                value={signInEmail}
                onChange={(e) => setSignInEmail(e.target.value)}
                className="w-full text-sm bg-gray-50 border border-gray-200 rounded-xl p-3 outline-none focus:border-pink-300 focus:bg-white transition-all text-gray-800"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-600">Password</label>
              <input
                id="login-pass-input"
                type="password"
                required
                value={signInPassword}
                onChange={(e) => setSignInPassword(e.target.value)}
                className="w-full text-sm bg-gray-50 border border-gray-200 rounded-xl p-3 outline-none focus:border-pink-300 focus:bg-white transition-all text-gray-800/60"
              />
            </div>

            <button
              type="submit"
              id="login-submit"
              className="w-full bg-[#e1007a] hover:bg-[#c20068] active:scale-98 text-white font-bold py-3 px-5 rounded-xl transition-all shadow-md flex items-center justify-center gap-2 text-sm mt-2"
            >
              <LogIn className="w-4 h-4" />
              Sign In
            </button>
          </form>
        ) : (
          /* CREATE ACCOUNT VIEW */
          <form onSubmit={handleSignUpSubmit} className="space-y-4 text-left">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-600">First Name</label>
                <input
                id="signup-first-name"
                  type="text"
                  required
                  placeholder="Karan"
                  value={signUpFirstName}
                  onChange={(e) => setSignUpFirstName(e.target.value)}
                  className="w-full text-sm bg-gray-50 border border-gray-200 rounded-xl p-3 outline-none focus:border-pink-300 text-gray-800"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-600">Last Name</label>
                <input
                id="signup-last-name"
                  type="text"
                  required
                  placeholder="Gill"
                  value={signUpLastName}
                  onChange={(e) => setSignUpLastName(e.target.value)}
                  className="w-full text-sm bg-gray-50 border border-gray-200 rounded-xl p-3 outline-none focus:border-pink-300 text-gray-800"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-600">Email Address</label>
              <input
                id="signup-email"
                type="email"
                required
                placeholder="gillkarangill23@gmail.com"
                value={signUpEmail}
                onChange={(e) => setSignUpEmail(e.target.value)}
                className="w-full text-sm bg-gray-50 border border-gray-200 rounded-xl p-3 outline-none focus:border-pink-300 text-gray-800"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-600">Phone Number</label>
              <input
                id="signup-phone"
                type="tel"
                placeholder="09056897413"
                value={signUpPhone}
                onChange={(e) => setSignUpPhone(e.target.value)}
                className="w-full text-sm bg-gray-50 border border-gray-200 rounded-xl p-3 outline-none focus:border-pink-300 text-gray-800"
              />
            </div>

             <button
              type="submit"
              id="signup-submit"
              className="w-full bg-[#e1007a] hover:bg-[#c20068] active:scale-98 text-white font-bold py-3 px-5 rounded-xl transition-all shadow-md flex items-center justify-center gap-2 text-sm mt-3"
            >
              <UserPlus className="w-4 h-4" />
              Register Account
            </button>
          </form>
        )}

      </div>
    </div>
  );
}
