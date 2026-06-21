import { Search, SlidersHorizontal, ArrowUpDown, Plus, HelpCircle, Eye, X } from "lucide-react";
import { useState, useMemo } from "react";
import { Product } from "../types";
import ProductDetailModal from "./ProductDetailModal";

interface ProductsSectionProps {
  products: Product[];
  onAddToCart: (product: Product, quantity?: number) => void;
}

export default function ProductsSection({ products, onAddToCart }: ProductsSectionProps) {
  // Mobile filter popup state
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Detail Modal selection
  const [activeDetailProduct, setActiveDetailProduct] = useState<Product | null>(null);

  // Search state
  const [searchQuery, setSearchQuery] = useState("");
  
  // Category state
  const [selectedCategory, setSelectedCategory] = useState("All");
  
  // Brand state
  const [selectedBrand, setSelectedBrand] = useState("All");
  
  // Price range state
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(999999);
  const [priceSlider, setPriceSlider] = useState(999999);

  // Sorting state
  const [sortBy, setSortBy] = useState("default");

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Compute all unique categories and brands dynamically to support customized inserts
  const categories = useMemo(() => {
    const list = new Set(products.map((p) => p.category));
    return ["All", ...Array.from(list)];
  }, [products]);

  const brands = useMemo(() => {
    const list = new Set(products.map((p) => p.brand));
    return ["All", ...Array.from(list)];
  }, [products]);

  // Reset function
  const handleResetFilters = () => {
    setSearchQuery("");
    setSelectedCategory("All");
    setSelectedBrand("All");
    setMinPrice(0);
    setMaxPrice(999999);
    setPriceSlider(999999);
    setSortBy("default");
    setCurrentPage(1);
  };

  // Filtered and sorted products
  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        // Search matches Name, Brand, or Category
        const matchesSearch =
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.category.toLowerCase().includes(searchQuery.toLowerCase());

        // Category matches
        const matchesCategory =
          selectedCategory === "All" || p.category === selectedCategory;

        // Brand matches
        const matchesBrand =
          selectedBrand === "All" || p.brand === selectedBrand;

        // Price matches
        const actualMax = Math.min(maxPrice, priceSlider);
        const matchesPrice = p.price >= minPrice && p.price <= actualMax;

        return matchesSearch && matchesCategory && matchesBrand && matchesPrice;
      })
      .sort((a, b) => {
        if (sortBy === "price-low") return a.price - b.price;
        if (sortBy === "price-high") return b.price - a.price;
        return 0; // default order based on index
      });
  }, [products, searchQuery, selectedCategory, selectedBrand, minPrice, maxPrice, priceSlider, sortBy]);

  // Pagination calculations
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage) || 1;
  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredProducts.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredProducts, currentPage]);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      document.getElementById("products-catalog-anchor")?.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div id="products-catalog-anchor" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 font-sans">
      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* LEFT SIDE FILTERS BAR */}
        <div id="filters-sidebar" className="hidden lg:block w-full lg:w-72 bg-white border border-gray-100 rounded-3xl p-6 shadow-xl space-y-6 h-fit shrink-0 relative">
          <div className="flex items-center justify-between border-b pb-4">
            <h3 className="font-bold text-xl text-gray-900 flex items-center gap-2">
              <SlidersHorizontal className="w-5 h-5 text-[#e1007a]" />
              Filter Options
            </h3>
          </div>

          {/* Search bar */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700">Search Products</label>
            <div className="relative">
              <input
                id="search-input"
                type="text"
                placeholder="Search Products..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full text-sm bg-gray-50 border border-gray-200 rounded-xl py-3 pl-10 pr-4 outline-none focus:border-pink-300 focus:bg-white transition-all text-gray-800"
              />
              <Search className="absolute left-3.5 top-3.5 w-4 h-4 text-gray-400" />
            </div>
          </div>

          {/* Category selection */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wider">Category</h4>
            <div className="space-y-2 max-h-[160px] overflow-y-auto pr-2 custom-scrollbar">
              {categories.map((cat) => (
                <label key={cat} className="flex items-center space-x-3 cursor-pointer text-sm text-gray-700 hover:text-[#e1007a] transition-all">
                  <input
                    type="radio"
                    name="category"
                    checked={selectedCategory === cat}
                    onChange={() => {
                      setSelectedCategory(cat);
                      setCurrentPage(1);
                    }}
                    className="w-4 h-4 text-[#e1007a] focus:ring-[#e1007a] border-gray-300 rounded cursor-pointer"
                  />
                  <span>{cat}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Brand select */}
          <div className="space-y-2">
            <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wider">Brand</h4>
            <select
              id="brand-select"
              value={selectedBrand}
              onChange={(e) => {
                setSelectedBrand(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full text-sm bg-gray-50 border border-gray-200 rounded-xl p-3 outline-none focus:border-pink-300 focus:bg-white transition-all text-gray-800"
            >
              <option value="All">All Brands</option>
              {brands.filter(b => b !== "All").map((brand) => (
                <option key={brand} value={brand}>
                  {brand}
                </option>
              ))}
            </select>
          </div>

          {/* Price Range */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wider">Price Range</h4>
              <span className="text-xs font-mono font-bold text-[#e1007a]">
                ₹{minPrice} - ₹{Math.min(maxPrice, priceSlider)}
              </span>
            </div>
            
            {/* Input fields */}
            <div className="flex items-center space-x-2">
              <input
                id="min-price-input"
                type="number"
                placeholder="Min"
                value={minPrice}
                onChange={(e) => {
                  setMinPrice(Math.max(0, parseInt(e.target.value) || 0));
                  setCurrentPage(1);
                }}
                className="w-1/2 text-center text-sm bg-gray-50 border border-gray-200 rounded-xl p-2.5 outline-none focus:border-pink-300 focus:bg-white text-gray-800"
              />
              <span className="text-gray-400 font-bold">-</span>
              <input
                id="max-price-input"
                type="number"
                placeholder="Max"
                value={maxPrice}
                onChange={(e) => {
                  setMaxPrice(Math.max(0, parseInt(e.target.value) || 0));
                  setCurrentPage(1);
                }}
                className="w-1/2 text-center text-sm bg-gray-50 border border-gray-200 rounded-xl p-2.5 outline-none focus:border-pink-300 focus:bg-white text-gray-800"
              />
            </div>

            {/* Slider control */}
            <div className="space-y-1">
              <input
                id="price-range-slider"
                type="range"
                min="0"
                max="200000"
                step="500"
                value={priceSlider > 200000 ? 200000 : priceSlider}
                onChange={(e) => {
                  const val = parseInt(e.target.value);
                  setPriceSlider(val === 200000 ? 999999 : val);
                  setCurrentPage(1);
                }}
                className="w-full accent-[#e1007a] cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-gray-400 font-mono">
                <span>₹0</span>
                <span>₹100k</span>
                <span>₹200k+</span>
              </div>
            </div>
          </div>

          {/* RESET BUTTON */}
          <button
            id="reset-filters-btn"
            onClick={handleResetFilters}
            className="w-full bg-[#e1007a] hover:bg-[#c20068] active:scale-98 text-white font-bold py-3.5 rounded-xl transition-all duration-150 text-center shadow-md hover:shadow-pink-100 flex items-center justify-center gap-1.5 cursor-pointer text-sm"
          >
            Reset Filters
          </button>
        </div>

        {/* RIGHT MAIN CATALOG GRID */}
        <div className="flex-1 space-y-6">

          {/* Mobile Only Search Bar with Filter Icon */}
          <div className="block lg:hidden">
            <div className="relative">
              <input
                id="mobile-search-input"
                type="text"
                placeholder="Search Products..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full text-sm bg-white border border-gray-200 rounded-2xl py-3.5 pl-11 pr-14 outline-none focus:border-[#e1007a] focus:bg-white transition-all text-gray-800 shadow-xs"
              />
              <Search className="absolute left-4 top-4 w-4 h-4 text-gray-400" />
              <button
                type="button"
                id="mobile-filter-btn"
                onClick={() => setIsMobileFilterOpen(true)}
                className="absolute right-2 top-2 p-2 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 active:scale-95 transition-all cursor-pointer flex items-center justify-center"
                title="Filters"
              >
                <SlidersHorizontal className="w-4 h-4 text-[#e1007a]" />
              </button>
            </div>
          </div>
          
          {/* Header toolbar */}
          <div className="hidden sm:flex flex-col sm:flex-row items-center justify-between gap-4 bg-gray-50/50 p-4 rounded-2xl border border-gray-100">
            <p className="text-sm font-medium text-gray-500">
              Showing <span className="font-bold text-gray-800">{filteredProducts.length}</span> items in{" "}
              <span className="font-bold text-[#e1007a]">{selectedCategory}</span> Category
            </p>

            {/* Sort Dropdown (hidden on mobile responsive) */}
            <div className="flex items-center space-x-2 shrink-0">
              <ArrowUpDown className="w-4 h-4 text-gray-400" />
              <select
                id="sort-select"
                value={sortBy}
                onChange={(e) => {
                  setSortBy(e.target.value);
                  setCurrentPage(1);
                }}
                className="text-sm bg-white border border-gray-200 rounded-xl p-2 pr-8 outline-none focus:border-pink-300 text-gray-700 min-w-[150px]"
              >
                <option value="default">Sort By Default</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
            </div>
          </div>

          {/* PRODUCTS CARDS GRID (Responsive layout matching screenshots) */}
          {paginatedProducts.length > 0 ? (
            <div className="flex overflow-x-auto pb-4 gap-3 snap-x scroll-smooth no-scrollbar sm:pb-0 sm:overflow-x-visible sm:grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
              {paginatedProducts.map((product) => (
                <div
                  key={product.id}
                  id={`product-card-${product.id}`}
                  className="min-w-[190px] w-[190px] shrink-0 snap-start bg-white border border-gray-100 rounded-2xl p-3 shadow-xs hover:shadow-lg hover:border-pink-100 transition-all duration-300 flex flex-col justify-between group h-fit sm:h-full sm:min-w-0 sm:w-auto sm:shrink"
                >
                  <div>
                    {/* Image frame (Clickable) */}
                    <div 
                      onClick={() => setActiveDetailProduct(product)}
                      className="relative w-full aspect-square rounded-xl overflow-hidden bg-gray-50 mb-2.5 flex items-center justify-center border border-gray-50 group-hover:scale-102 transition-transform duration-300 p-1.5 cursor-pointer hover:opacity-95"
                      title="Click to view details & images"
                    >
                      <img
                        src={product.imageUrl}
                        alt={product.name}
                        referrerPolicy="no-referrer"
                        className="max-h-full max-w-full object-contain mix-blend-multiply"
                      />
                      <span className="absolute top-1.5 left-1.5 text-[8px] font-bold uppercase py-0.5 px-2 bg-gray-900/10 text-gray-700 rounded-full">
                        {product.brand}
                      </span>
                    </div>

                    {/* Meta info */}
                    <span className="text-[9px] font-bold text-[#e1007a]/80 bg-pink-50 rounded px-1.5 py-0.5 uppercase tracking-wide">
                      {product.category}
                    </span>

                    {/* Title (Clickable) */}
                    <h4 
                      onClick={() => setActiveDetailProduct(product)}
                      className="font-semibold text-xs text-gray-800 mt-1 hover:text-[#e1007a] transition-colors line-clamp-2 min-h-[34px] leading-snug cursor-pointer"
                      title="Click to view details & images"
                    >
                      {product.name}
                    </h4>
                  </div>

                  {/* Pricing and Action footer */}
                  <div className="mt-2.5 pt-2 border-t border-gray-50 flex flex-col space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-sm sm:text-base font-bold font-mono text-gray-900">
                        ₹{product.price}
                      </span>
                      
                      {/* Specs trigger badge */}
                      <button
                        onClick={() => setActiveDetailProduct(product)}
                        className="text-[9px] text-[#e1007a] hover:underline font-bold uppercase flex items-center gap-0.5 cursor-pointer"
                      >
                        <Eye className="w-3 h-3 text-[#e1007a]" />
                        Specs
                      </button>
                    </div>

                    <div className="grid grid-cols-5 gap-1 pt-1">
                      <button
                        id={`add-to-cart-${product.id}`}
                        onClick={() => onAddToCart(product, 1)}
                        className="col-span-3 bg-[#e1007a] hover:bg-[#c20068] active:scale-95 text-white font-bold text-[10px] py-1.5 rounded-xl transition-all duration-150 shadow-xs hover:shadow-pink-100 flex items-center justify-center gap-0.5 cursor-pointer uppercase tracking-wider"
                      >
                        <Plus className="w-2.5 h-2.5 stroke-[3]" />
                        Add
                      </button>
                      <button
                        onClick={() => setActiveDetailProduct(product)}
                        className="col-span-2 bg-slate-100 hover:bg-slate-200 active:scale-95 text-slate-700 font-bold text-[10px] py-1.5 rounded-xl transition-all duration-150 flex items-center justify-center gap-0.5 cursor-pointer uppercase tracking-wider"
                      >
                        View
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* EMPTY STATE */
            <div className="bg-white border border-dashed border-gray-200 rounded-3xl p-12 text-center max-w-lg mx-auto my-12 shadow-sm">
              <div className="w-16 h-16 bg-gray-50 text-gray-400 rounded-full flex items-center justify-center mx-auto mb-4">
                <HelpCircle className="w-8 h-8" />
              </div>
              <h3 className="font-bold text-lg text-gray-800">No Electronics Found</h3>
              <p className="text-sm text-gray-500 mt-1.5">
                We couldn't find matches for your current search string, brand selections, or specified price ranges. Check back or reset parameters.
              </p>
              <button
                onClick={handleResetFilters}
                className="mt-6 bg-gray-100 hover:bg-gray-200 active:scale-95 text-gray-700 text-sm font-bold px-6 py-2.5 rounded-xl transition-all"
              >
                Reset Filter Panel
              </button>
            </div>
          )}

          {/* PAGINATION PANEL */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-1.5 pt-8 flex-wrap">
              <button
                id="pagination-prev"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-2.5 sm:px-4 py-2.5 border rounded-xl text-xs sm:text-sm font-bold transition-all hover:bg-gray-50 active:scale-95 disabled:opacity-50 disabled:pointer-events-none text-gray-600 border-gray-200 cursor-pointer"
              >
                ← Prev
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  id={`pagination-page-${p}`}
                  onClick={() => handlePageChange(p)}
                  className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl text-xs sm:text-sm font-bold transition-all active:scale-95 cursor-pointer ${
                    currentPage === p
                      ? "bg-[#e1007a] text-white border-0 shadow-md"
                      : "border border-gray-200 text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  {p}
                </button>
              ))}

              <button
                id="pagination-next"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-2.5 sm:px-4 py-2.5 border rounded-xl text-xs sm:text-sm font-bold transition-all hover:bg-gray-50 active:scale-95 disabled:opacity-50 disabled:pointer-events-none text-gray-600 border-gray-200 cursor-pointer"
              >
                Next →
              </button>
            </div>
          )}

          {/* MOUNT DETAILED SPECS MODAL WITH 5 IMAGE PORTFOLIO */}
          <ProductDetailModal
            product={activeDetailProduct}
            onClose={() => setActiveDetailProduct(null)}
            onAddToCartWithQty={onAddToCart}
          />

          {/* MOBILE FILTER POPUP MODAL */}
          {isMobileFilterOpen && (
            <div className="fixed inset-0 z-50 bg-black/65 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
              <div className="bg-white rounded-3xl w-full max-w-md p-6 shadow-2xl relative animate-in zoom-in-95 duration-150 flex flex-col max-h-[85vh]">
                
                {/* Modal Header */}
                <div className="flex items-center justify-between border-b pb-4 mb-4 shrink-0">
                  <h3 className="font-extrabold text-lg text-gray-900 flex items-center gap-2">
                    <SlidersHorizontal className="w-4 h-4 text-[#e1007a]" />
                    Filter Options
                  </h3>
                  <button
                    onClick={() => setIsMobileFilterOpen(false)}
                    className="p-1 px-2.5 rounded-xl border border-gray-205 hover:bg-gray-50 active:scale-95 text-gray-400 hover:text-gray-600 transition-all font-mono text-sm cursor-pointer"
                  >
                    ✕
                  </button>
                </div>

                {/* Modal Scrollable Contents */}
                <div className="overflow-y-auto space-y-5 pr-1 no-scrollbar flex-1 py-1">
                  
                  {/* Category selection */}
                  <div className="space-y-2 text-left">
                    <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Category</h4>
                    <div className="grid grid-cols-2 gap-2 max-h-[140px] overflow-y-auto pr-1 no-scrollbar">
                      {categories.map((cat) => (
                        <label 
                          key={cat} 
                          className={`flex items-center space-x-2.5 p-2 rounded-xl border transition-all text-xs cursor-pointer ${
                            selectedCategory === cat 
                              ? "bg-pink-50/50 border-pink-200 text-[#e1007a] font-bold" 
                              : "border-gray-200 text-gray-700 hover:bg-gray-50"
                          }`}
                        >
                          <input
                            type="radio"
                            name="mobile-category"
                            checked={selectedCategory === cat}
                            onChange={() => {
                              setSelectedCategory(cat);
                              setCurrentPage(1);
                            }}
                            className="w-3.5 h-3.5 text-[#e1509a] focus:ring-[#e1007a] border-gray-300 rounded cursor-pointer"
                          />
                          <span className="truncate">{cat}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Brand select */}
                  <div className="space-y-2 text-left">
                    <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Brand</h4>
                    <select
                      id="mobile-brand-select"
                      value={selectedBrand}
                      onChange={(e) => {
                        setSelectedBrand(e.target.value);
                        setCurrentPage(1);
                      }}
                      className="w-full text-xs bg-gray-50 border border-gray-200 rounded-xl p-3 outline-none focus:border-pink-300 text-gray-800 cursor-pointer"
                    >
                      <option value="All">All Brands</option>
                      {brands.filter(b => b !== "All").map((brand) => (
                        <option key={brand} value={brand}>
                          {brand}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Price Range */}
                  <div className="space-y-3 text-left">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Price Range</h4>
                      <span className="text-xs font-mono font-bold text-[#e1007a]">
                        ₹{minPrice} - ₹{Math.min(maxPrice, priceSlider)}
                      </span>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <input
                        id="mobile-min-price"
                        type="number"
                        placeholder="Min"
                        value={minPrice}
                        onChange={(e) => {
                          setMinPrice(Math.max(0, parseInt(e.target.value) || 0));
                          setCurrentPage(1);
                        }}
                        className="w-1/2 text-center text-xs bg-gray-50 border border-gray-200 rounded-xl p-2.5 outline-none focus:border-pink-300 text-gray-800"
                      />
                      <span className="text-gray-400 font-bold">-</span>
                      <input
                        id="mobile-max-price"
                        type="number"
                        placeholder="Max"
                        value={maxPrice}
                        onChange={(e) => {
                          setMaxPrice(Math.max(0, parseInt(e.target.value) || 0));
                          setCurrentPage(1);
                        }}
                        className="w-1/2 text-center text-xs bg-gray-50 border border-gray-200 rounded-xl p-2.5 outline-none focus:border-pink-300 text-gray-800"
                      />
                    </div>

                    <div className="space-y-1">
                      <input
                        id="mobile-price-slider"
                        type="range"
                        min="0"
                        max="200000"
                        step="500"
                        value={priceSlider > 200000 ? 200000 : priceSlider}
                        onChange={(e) => {
                          const val = parseInt(e.target.value);
                          setPriceSlider(val === 200000 ? 999999 : val);
                          setCurrentPage(1);
                        }}
                        className="w-full accent-[#e1007a] cursor-pointer"
                      />
                      <div className="flex justify-between text-[9px] text-gray-400 font-mono">
                        <span>₹0</span>
                        <span>₹100k</span>
                        <span>₹200k+</span>
                      </div>
                    </div>
                  </div>



                </div>

                {/* Modal Actions Footer */}
                <div className="border-t border-slate-100 pt-4 mt-4 grid grid-cols-2 gap-3 shrink-0">
                  <button
                    type="button"
                    onClick={() => {
                      handleResetFilters();
                    }}
                    className="py-3 border border-gray-200 rounded-xl text-xs font-bold text-gray-600 hover:bg-gray-50 active:scale-95 transition-all cursor-pointer"
                  >
                    Reset All
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsMobileFilterOpen(false)}
                    className="py-3 bg-[#e1007a] hover:bg-[#c20068] text-white font-bold rounded-xl text-xs active:scale-95 transition-all cursor-pointer shadow-md"
                  >
                    Apply Filters
                  </button>
                </div>

              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
