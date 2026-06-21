import { Truck, ShieldCheck, Headphones, ArrowRight } from "lucide-react";
// @ts-ignore
import homeIphones from "../assets/images/home_iphones_1782028937141.jpg";

interface HeroProps {
  onShopNow: () => void;
}

export default function Hero({ onShopNow }: HeroProps) {
  return (
    <div id="hero-section" className="w-full bg-white font-sans">
      {/* GRADIENT HERO CONTAINER */}
      <div className="max-w-7xl mx-auto my-6 px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-[#2563eb] via-[#8b5cf6] to-[#e1007a] text-white shadow-2xl p-8 sm:p-12 lg:p-16 flex flex-col lg:flex-row items-center justify-between gap-12 min-h-[460px]">
          
          {/* LEFT SIDE TEXTS */}
          <div className="flex-1 max-w-xl space-y-6 text-left">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight">
              Letest Electronics <br />at Best Prices
            </h1>
            <p className="text-base sm:text-lg text-white/90 font-light leading-relaxed">
              Discover cutting-edge technology with unbeatable deals on smartphones,laptop and more.
            </p>
            <div className="flex flex-wrap items-center gap-4">
              <button
                id="hero-shop-now"
                onClick={onShopNow}
                className="bg-white hover:bg-pink-50 text-[#e1007a] font-bold px-6 py-3 rounded-full transition-all duration-250 shadow-lg hover:shadow-xl active:scale-95 flex items-center gap-1.5"
              >
                Shop Now
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                id="hero-view-deals"
                onClick={onShopNow}
                className="bg-transparent hover:bg-white/10 text-white font-semibold px-6 py-3 rounded-full border border-white/60 hover:border-white transition-all duration-150 active:scale-95"
              >
                View Deals
              </button>
            </div>
          </div>

          {/* RIGHT SIDE IPHONES DISPLAY */}
          <div className="flex-1 w-full max-w-[420px] lg:max-w-none flex justify-center lg:justify-end">
            <div className="relative w-full max-w-[340px] aspect-square rounded-3xl bg-white border border-white/20 p-2 flex items-center justify-center shadow-2xl overflow-hidden hover:shadow-[0_20px_50px_rgba(0,0,0,0.3)] transition-all duration-300 group">
              <img
                src={homeIphones}
                alt="Latest iPhones Showcase"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover rounded-2xl transition-transform duration-500 group-hover:scale-105"
              />
            </div>
          </div>
        </div>
      </div>

      {/* HIGHLIGHT VALUES BAR */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 border-b border-gray-100">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 justify-items-center">
          
          {/* FREE SHIPPING */}
          <div className="flex items-center space-x-4 max-w-xs text-left">
            <div className="p-3.5 bg-blue-50 text-blue-600 rounded-2xl shadow-sm">
              <Truck className="w-6 h-6 stroke-[2]" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 text-base">Free Shipping</h3>
              <p className="text-sm text-gray-500 font-medium">On orders over $50</p>
            </div>
          </div>

          {/* SECURE PAYMENT */}
          <div className="flex items-center space-x-4 max-w-xs text-left">
            <div className="p-3.5 bg-emerald-50 text-emerald-600 rounded-2xl shadow-sm">
              <ShieldCheck className="w-6 h-6 stroke-[2]" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 text-base">Secure Payment</h3>
              <p className="text-sm text-gray-500 font-medium">100% secure transactions</p>
            </div>
          </div>

          {/* 24/7 SUPPORT */}
          <div className="flex items-center space-x-4 max-w-xs text-left">
            <div className="p-3.5 bg-purple-50 text-purple-600 rounded-2xl shadow-sm">
              <Headphones className="w-6 h-6 stroke-[2]" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 text-base">24/7 Support</h3>
              <p className="text-sm text-gray-500 font-medium">Always here to help</p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
