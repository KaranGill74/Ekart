import React, { useState, useEffect } from "react";
import { X, Plus, Minus, ShoppingCart, ShoppingBag, Check } from "lucide-react";
import { Product } from "../types";

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
  onAddToCartWithQty: (product: Product, quantity: number) => void;
}

export default function ProductDetailModal({
  product,
  onClose,
  onAddToCartWithQty,
}: ProductDetailModalProps) {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [purchaseQty, setPurchaseQty] = useState(1);
  const [addedSuccess, setAddedSuccess] = useState(false);

  // Reset states when current product changes
  useEffect(() => {
    setSelectedImageIndex(0);
    setPurchaseQty(1);
    setAddedSuccess(false);
  }, [product]);

  // Lock background scroll when modal/full-screen detail page is open
  useEffect(() => {
    if (product) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }
    return () => {
      document.body.classList.remove("overflow-hidden");
    };
  }, [product]);

  if (!product) return null;

  // Stable category generator for 5 beautiful product images
  const getProductImages = (prod: Product): string[] => {
    if (prod.images && prod.images.length > 0) {
      const list = [...prod.images];
      while (list.length < 5) {
        list.push(prod.imageUrl);
      }
      return list.slice(0, 5);
    }

    const list = [
      prod.imageUrl,
      // Fallback 1
      "https://images.unsplash.com/photo-1468495244123-6c6c332eeece?w=600&auto=format&fit=crop&q=80",
      // Fallback 2
      "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=600&auto=format&fit=crop&q=80",
      // Fallback 3
      "https://images.unsplash.com/photo-1457369804613-52c61a468e7d?w=600&auto=format&fit=crop&q=80",
      // Fallback 4
      "https://images.unsplash.com/photo-1504274066651-8d31a536b11a?w=600&auto=format&fit=crop&q=80",
    ];

    const cat = prod.category.toLowerCase();
    
    if (cat.includes("mobile") || cat.includes("phone")) {
      list[1] = "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&auto=format&fit=crop&q=80";
      list[2] = "https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=600&auto=format&fit=crop&q=80";
      list[3] = "https://images.unsplash.com/photo-1573148195900-7845dcb9b127?w=600&auto=format&fit=crop&q=80";
      list[4] = "https://images.unsplash.com/photo-1565849616244-a69f4c3ef05e?w=600&auto=format&fit=crop&q=80";
    } else if (cat.includes("head") || cat.includes("ear") || cat.includes("audio") || cat.includes("airwave") || cat.includes("airpod")) {
      list[1] = "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=600&auto=format&fit=crop&q=80";
      list[2] = "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=600&auto=format&fit=crop&q=80";
      list[3] = "https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=600&auto=format&fit=crop&q=80";
      list[4] = "https://images.unsplash.com/photo-1524678606370-a47ad25cb82a?w=600&auto=format&fit=crop&q=80";
    } else if (cat.includes("laptop") || cat.includes("book") || cat.includes("computer")) {
      list[1] = "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&auto=format&fit=crop&q=80";
      list[2] = "https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=600&auto=format&fit=crop&q=80";
      list[3] = "https://images.unsplash.com/photo-1484788984921-03950022c9ef?w=600&auto=format&fit=crop&q=80";
      list[4] = "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=600&auto=format&fit=crop&q=80";
    } else if (cat.includes("mouse") || cat.includes("toad")) {
      list[1] = "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=600&auto=format&fit=crop&q=80";
      list[2] = "https://images.unsplash.com/photo-1625842268584-8f32904556a3?w=600&auto=format&fit=crop&q=80";
      list[3] = "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=600&auto=format&fit=crop&q=80";
      list[4] = "https://images.unsplash.com/photo-1628144510860-262174313b6f?w=600&auto=format&fit=crop&q=80";
    } else if (cat.includes("key") || cat.includes("bubble")) {
      list[1] = "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600&auto=format&fit=crop&q=80";
      list[2] = "https://images.unsplash.com/photo-1595225476474-87563907a212?w=600&auto=format&fit=crop&q=80";
      list[3] = "https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=600&auto=format&fit=crop&q=80";
      list[4] = "https://images.unsplash.com/photo-1601445638532-3c6f6c3aa1d6?w=600&auto=format&fit=crop&q=80";
    } else if (cat.includes("moni") || cat.includes("screen") || cat.includes("display")) {
      list[1] = "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=600&auto=format&fit=crop&q=80";
      list[2] = "https://images.unsplash.com/photo-1547082299-de196ea013d6?w=600&auto=format&fit=crop&q=80";
      list[3] = "https://images.unsplash.com/photo-1551645121-d1034da75057?w=600&auto=format&fit=crop&q=80";
      list[4] = "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=600&auto=format&fit=crop&q=80";
    }
    
    return list;
  };

  const images = getProductImages(product);

  const handleQtyDelta = (delta: number) => {
    const nextQty = purchaseQty + delta;
    if (nextQty >= 1 && nextQty <= 99) {
      setPurchaseQty(nextQty);
    }
  };

  const handleAddToCartSubmit = () => {
    onAddToCartWithQty(product, purchaseQty);
    setAddedSuccess(true);
    setTimeout(() => {
      setAddedSuccess(false);
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-[110] flex md:items-center md:justify-center p-0 md:p-4 bg-white md:bg-black/60 md:backdrop-blur-xs overflow-y-auto no-scrollbar">
      {/* Scrollable Backdrop trigger click-off - only on desktop */}
      <div className="hidden md:block absolute inset-0" onClick={onClose} />

      {/* Modal Card / Responsive Full Screen View */}
      <div className="relative w-full min-h-screen md:min-h-0 md:max-w-4xl bg-white md:rounded-3xl overflow-y-auto no-scrollbar md:overflow-hidden md:shadow-2xl md:border md:border-gray-100 flex flex-col md:flex-row animate-in slide-in-from-right md:slide-in-from-none md:zoom-in-95 duration-200">
        
        {/* Mobile Sticky Header (Visible only on mobile/responsive dimensions to make it feel like "another page") */}
        <div className="md:hidden flex items-center justify-between px-5 py-4 bg-white border-b border-gray-100 sticky top-0 z-20">
          <button 
            type="button"
            onClick={onClose} 
            className="flex items-center gap-1 text-sm font-bold text-gray-700 hover:text-[#e1007a] cursor-pointer"
          >
            <span className="text-lg">←</span> Back
          </button>
          <span className="font-extrabold text-xs text-gray-400 tracking-wider uppercase">Product Specifications</span>
          <div className="w-[45px]"></div>
        </div>

        {/* Close Button top-right corner - desktop only */}
        <button
          onClick={onClose}
          className="hidden md:flex absolute top-4 right-4 z-10 p-2 bg-gray-100 hover:bg-[#e1007a] hover:text-white rounded-full text-gray-500 transition-colors duration-150"
        >
          <X className="w-5 h-5" />
        </button>

        {/* LEFT COMPONENT - IMAGES COMPILATION GRID */}
        <div className="w-full md:w-1/2 p-6 md:p-8 bg-gray-50/70 flex flex-col justify-between border-r border-gray-100">
          
          {/* Main Active image viewer container */}
          <div className="w-full aspect-square bg-white rounded-2xl border border-gray-100 p-4 flex items-center justify-center overflow-hidden mb-5 shadow-xs">
            <img
              src={images[selectedImageIndex]}
              alt={`${product.name} active detail view`}
              className="max-h-full max-w-full object-contain mix-blend-multiply transition-all duration-300 transform scale-102"
              referrerPolicy="no-referrer"
            />
          </div>

          {/* Secondary Thumbnail Swapper (5 total slides) */}
          <div className="grid grid-cols-5 gap-2">
            {images.map((imgUrl, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setSelectedImageIndex(idx)}
                className={`w-full aspect-square bg-white rounded-xl border-2 p-1 flex items-center justify-center overflow-hidden transition-all duration-150 relative ${
                  selectedImageIndex === idx
                    ? "border-[#e1007a] shadow-xs"
                    : "border-gray-100 hover:border-pink-300"
                }`}
              >
                <img
                  src={imgUrl}
                  alt={`Spec view thumbnail ${idx + 1}`}
                  className="max-h-full max-w-full object-contain mix-blend-multiply"
                  referrerPolicy="no-referrer"
                />
                
                {/* Visual badge highlight */}
                {selectedImageIndex === idx && (
                  <span className="absolute bottom-0 inset-x-0 h-1 bg-[#e1007a]" />
                )}
              </button>
            ))}
          </div>

        </div>

        {/* RIGHT COMPONENT - SPECIFICATIONS AND PRICING METADATA */}
        <div className="w-full md:w-1/2 p-6 md:p-8 flex flex-col justify-between text-left space-y-6">
          
          <div className="space-y-4">
            
            {/* Category / Brand Row Tagline */}
            <div className="flex items-center gap-2">
              <span className="text-[10px] uppercase font-black tracking-widest text-[#e1007a] bg-pink-50 px-2.5 py-1 rounded-full">
                {product.category}
              </span>
              <span className="text-xs text-gray-400 font-bold uppercase">
                BY {product.brand}
              </span>
            </div>

            {/* Product Title Heading */}
            <h3 className="text-xl md:text-2xl font-extrabold text-gray-900 leading-snug tracking-tight">
              {product.name}
            </h3>

            {/* Standard Cost Listing */}
            <div className="bg-[#fff0f6] border border-pink-100 p-4 rounded-2xl flex items-center justify-between">
              <div>
                <p className="text-[10px] text-[#e1007a] font-bold uppercase tracking-wider">EKART Premium Price</p>
                <span className="text-2xl md:text-3xl font-black font-mono text-gray-900">
                  ₹{product.price}
                </span>
              </div>
              <span className="text-[11px] bg-emerald-100 text-emerald-800 px-3 py-1.5 rounded-xl font-bold uppercase tracking-wide">
                ✔ IN STOCK
              </span>
            </div>

            {/* Core Bullet points or detailed description block */}
            <div className="space-y-2">
              <h4 className="text-xs font-black uppercase text-gray-500 tracking-wider">
                Product Details & Description:
              </h4>
              <p className="text-sm text-gray-600 leading-relaxed bg-gray-50 p-3.5 rounded-xl border border-gray-100 whitespace-pre-line">
                {product.description || "No specific detailed descriptions uploaded for this electronic hardware accessory yet."}
              </p>
            </div>

          </div>

          {/* PURCHASING DOCK FLOOR CONTROLS */}
          <div className="border-t border-gray-100 pt-5 mt-auto">
            
            <div className="flex items-center justify-between gap-4">
              
              {/* Core Quantity controls demanded by the user prompt */}
              <div className="flex flex-col gap-1 text-left">
                <span className="text-[10px] font-black uppercase text-gray-400 tracking-wider">Quantity</span>
                <div className="flex items-center border-2 border-gray-100 bg-gray-50 rounded-xl p-1.5 min-w-[120px]">
                  <button
                    onClick={() => handleQtyDelta(-1)}
                    className="p-1 hover:bg-white text-gray-600 hover:text-[#e1007a] rounded-lg transition-colors cursor-pointer"
                  >
                    <Minus className="w-4 h-4 stroke-[2.5]" />
                  </button>
                  <span className="flex-1 text-center font-mono font-black text-sm text-gray-800">
                    {purchaseQty}
                  </span>
                  <button
                    onClick={() => handleQtyDelta(1)}
                    className="p-1 hover:bg-white text-gray-600 hover:text-[#e1007a] rounded-lg transition-colors cursor-pointer"
                  >
                    <Plus className="w-4 h-4 stroke-[2.5]" />
                  </button>
                </div>
              </div>

              {/* Action purchase trigger button */}
              <div className="flex-1 pt-4">
                <button
                  type="button"
                  onClick={handleAddToCartSubmit}
                  className={`w-full py-4.5 px-6 rounded-xl font-bold uppercase text-xs tracking-wider transition-all duration-200 flex items-center justify-center gap-2 shadow-lg cursor-pointer ${
                    addedSuccess
                      ? "bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-100"
                      : "bg-[#e1007a] hover:bg-[#c20068] text-white shadow-pink-100"
                  }`}
                >
                  {addedSuccess ? (
                    <>
                      <Check className="w-4 h-4 stroke-[3]" />
                      Added {purchaseQty} Unit(s)!
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="w-4 h-4" />
                      Add {purchaseQty} to Cart • ₹{(product.price * purchaseQty).toFixed(0)}
                    </>
                  )}
                </button>
              </div>

            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
