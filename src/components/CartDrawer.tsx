import { X, Trash2, ShoppingBag, Plus, Minus, CreditCard } from "lucide-react";
import { CartItem, Product, Order, OrderStatus } from "../types";

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQuantity: (productId: string, delta: number) => void;
  onRemoveItem: (productId: string) => void;
  onClearCart: () => void;
  onCheckout: () => void;
}

export default function CartDrawer({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onCheckout,
}: CartDrawerProps) {
  if (!isOpen) return null;

  // Calculate prices
  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.product.price * item.quantity,
    0
  );
  
  // Custom margin dynamic fee/tax structure matching reference screenshots:
  // e.g., ₹139999 + dynamic charges = INR 146998.95
  // That is approximately 5% additional fee
  const estimatedTax = subtotal * 0.05;
  const deliveryCharges = subtotal > 50000 ? 0 : 99;
  const finalTotalAmount = subtotal > 0 ? (subtotal + estimatedTax + deliveryCharges) : 0;

  return (
    <div className="fixed inset-0 z-[100] overflow-hidden font-sans">
      
      {/* BACKGROUND BACKDROP OVERLAY */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-xs transition-opacity" 
        onClick={onClose}
      />

      {/* DRAWER CONTAINER */}
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col">
          
          {/* DRAWER HEADER */}
          <div className="px-6 py-5 bg-[#fff0f6] border-b border-pink-100 flex items-center justify-between">
            <h3 className="font-extrabold text-lg text-gray-900 flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-[#e1007a]" />
              Your Electronic Cart ({cartItems.length})
            </h3>
            <button
              onClick={onClose}
              className="p-1.5 hover:bg-white rounded-full text-gray-500 hover:text-[#e1007a] transition-all"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* DRAWER BODY (Items List) */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {cartItems.length > 0 ? (
              <div className="space-y-4">
                <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                  <span className="text-xs text-gray-400 font-bold uppercase tracking-wider">Shopping List</span>
                  <button
                    onClick={onClearCart}
                    className="text-xs font-bold text-rose-500 hover:text-rose-700 hover:underline flex items-center gap-1"
                  >
                    Clear All
                  </button>
                </div>

                <div className="space-y-4">
                  {cartItems.map((item) => (
                    <div
                      key={item.product.id}
                      className="flex items-center gap-4 bg-gray-50 p-3.5 rounded-2xl border border-gray-100"
                    >
                      {/* Product thumbnail image */}
                      <div className="w-16 h-16 bg-white rounded-xl border border-gray-200 flex items-center justify-center p-1 overflow-hidden shrink-0">
                        <img
                          src={item.product.imageUrl}
                          alt={item.product.name}
                          className="max-h-full max-w-full object-contain"
                          referrerPolicy="no-referrer"
                        />
                      </div>

                      {/* Info row */}
                      <div className="flex-1 text-left min-w-0">
                        <h4 className="text-xs font-bold text-gray-800 leading-tight line-clamp-2">
                          {item.product.name}
                        </h4>
                        
                        <div className="flex items-center justify-between mt-2.5">
                          <span className="font-mono text-xs font-black text-[#e1007a]">
                            ₹{item.product.price}
                          </span>

                          {/* Multiplier controls */}
                          <div className="flex items-center border border-gray-200 bg-white rounded-lg px-1.5 py-0.5">
                            <button
                              onClick={() => onUpdateQuantity(item.product.id, -1)}
                              className="text-gray-500 hover:text-[#e1007a] p-1 transition-all"
                            >
                              <Minus className="w-3 h-3 stroke-[2.5]" />
                            </button>
                            <span className="text-xs font-bold text-gray-800 px-2 font-mono">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => onUpdateQuantity(item.product.id, 1)}
                              className="text-gray-500 hover:text-[#e1007a] p-1 transition-all"
                            >
                              <Plus className="w-3 h-3 stroke-[2.5]" />
                            </button>
                          </div>

                        </div>
                      </div>

                      {/* Trash bin delete trigger */}
                      <button
                        onClick={() => onRemoveItem(item.product.id)}
                        className="text-gray-400 hover:text-rose-600 transition-colors self-start p-1"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>

                    </div>
                  ))}
                </div>
              </div>
            ) : (
              /* EMPTY CART FEEDBACK BACKGROUND */
              <div className="h-full flex flex-col items-center justify-center text-center py-12 space-y-4">
                <div className="w-20 h-20 bg-pink-50 rounded-full flex items-center justify-center text-[#e1007a]/40 shadow-inner">
                  <ShoppingBag className="w-10 h-10 stroke-[1.5]" />
                </div>
                <div>
                  <h4 className="font-extrabold text-base text-gray-800">Your Basket is Empty</h4>
                  <p className="text-xs text-gray-400 mt-1 max-w-[240px] leading-relaxed mx-auto">
                    Fill it up with premium cut-edge smartphones, headphones, gaming mice, or high resolution displays!
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="bg-[#e1007a] hover:bg-[#c20068] text-white text-xs font-bold px-6 py-2.5 rounded-xl transition-all shadow-md active:scale-95"
                >
                  Continue Shopping
                </button>
              </div>
            )}
          </div>

          {/* CHECKOUT PRICING TICKET */}
          {cartItems.length > 0 && (
            <div className="border-t border-gray-150 p-6 bg-gray-50 text-left space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs font-medium text-gray-500">
                  <span>Subtotal</span>
                  <span className="font-mono text-gray-800 font-bold">₹{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center text-xs font-medium text-gray-500">
                  <span>Estimated Taxes (5%)</span>
                  <span className="font-mono text-gray-800 font-bold">₹{estimatedTax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center text-xs font-medium text-gray-500">
                  <span>Delivery Charges</span>
                  <span className="font-mono text-gray-800 font-bold">
                    {deliveryCharges === 0 ? "FREE" : `₹${deliveryCharges}`}
                  </span>
                </div>
                <div className="border-t border-dashed my-2 pt-2 flex justify-between items-center text-sm font-extrabold text-gray-900">
                  <span>Final Total</span>
                  <span className="font-mono text-lg text-[#e1007a]">
                    INR {finalTotalAmount.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* PLACE ORDER ACTION */}
              <button
                id="btn-drawer-checkout"
                onClick={onCheckout}
                className="w-full bg-[#e1007a] hover:bg-[#c20068] active:scale-95 text-white font-bold py-3.5 rounded-xl transition-all duration-150 flex items-center justify-center gap-2 shadow-lg text-sm"
              >
                <CreditCard className="w-4 h-4 stroke-[2.5]" />
                Place Order
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
