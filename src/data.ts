import { UserRole, UserProfile, Product, Order, OrderStatus, SalesHistoryPoint } from "./types";

export const INITIAL_USERS: UserProfile[] = [
  {
    id: "user-1",
    firstName: "Karan",
    lastName: "Gill",
    email: "gillkarangill23@gmail.com",
    phone: "09056897413",
    address: "jahangir",
    city: "Ludhiana District",
    zipCode: "141421",
    role: UserRole.ADMIN,
    avatarUrl: "https://images.unsplash.com/photo-1628157582853-a796fa650a6a?w=150&auto=format&fit=crop&q=80",
  },
  {
    id: "user-2",
    firstName: "Gill",
    lastName: "Karan",
    email: "gillkarangill23+1@gmail.com",
    phone: "9876543210",
    address: "Model Town",
    city: "Ludhiana",
    zipCode: "141001",
    role: UserRole.USER,
    avatarUrl: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80",
  }
];

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: "prod-1",
    name: "Apple iPhone 16 Plus 256 GB: 5G Mobile Phone with Camera Control, A18 Chip and a Big Boost in Battery Life. Works with AirPods; Teal",
    price: 89900,
    brand: "Apple",
    category: "Mobile",
    description: "Cutting-edge smartphone with Apple Silicon A18 chip, responsive camera button, upgraded dual-camera array with physical zoom slider, and long-lasting runtime.",
    imageUrl: "https://images.unsplash.com/photo-1621761191319-c6fb62004040?w=400&auto=format&fit=crop&q=80",
    createdAt: "2026-06-11T10:00:00.000Z"
  },
  {
    id: "prod-2",
    name: "Samsung Galaxy S26 Ultra 5G (Cobalt Violet, 12GB RAM, 256GB Storage) with Built-in Privacy Display, AI Phone, Photo Assist, Creative Studio, 200MP Camera, 5000mAh Battery and Snapdragon 8 Elite Gen 5",
    price: 139999,
    brand: "Samsung",
    category: "Mobile",
    description: "High-end flagship phone with an embedded S-Pen, gorgeous anti-reflective screen, multi-layered real-time security, 100x zoom capability, and state-of-the-art Android software.",
    imageUrl: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=400&auto=format&fit=crop&q=80",
    createdAt: "2026-06-12T11:00:00.000Z"
  },
  {
    id: "prod-3",
    name: "Noise Airwave Max 4 Wireless Over Ear Headphones with 70H Playtime, ENC, 40mm Driver, Low Latency(up to 40ms), Dual Pairing, BT v5.4 (Tropical Teal)",
    price: 1999,
    brand: "Noise",
    category: "Headphones",
    description: "Full-sized comfortable headphones with modern wireless standards, active background cancellation filters, 70 hour duration on a single charge, and dual connect option.",
    imageUrl: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&auto=format&fit=crop&q=80",
    createdAt: "2026-06-13T12:00:00.000Z"
  },
  {
    id: "prod-4",
    name: "HP Smartchoice Omnibook 5 OLED (Previously Pavilion), Snapdragon X Processor (16GB LPDDR5x,1TB SSD) 2K OLED,16\"/40.6cm, Win11, M365(1yr)*Office24, Glacier Silver, fb0001QU,Next-Gen AI Laptop",
    price: 68323,
    brand: "HP",
    category: "Laptop",
    description: "Premium modern desktop substitute powered by the efficient Snapdragon X ARM processor, with breathtaking high resolution screen, generous battery, and rapid workspace wake.",
    imageUrl: "https://images.unsplash.com/photo-1496181130204-7552cc14b1e0?w=400&auto=format&fit=crop&q=80",
    createdAt: "2026-06-14T09:30:00.000Z"
  },
  {
    id: "prod-5",
    name: "vivo X300 Ultra 5G (Eclipse Black, 16GB RAM, 512GB Storage) with No Cost EMI/Additional Exchange Offers",
    price: 159999,
    brand: "vivo",
    category: "Mobile",
    description: "Professional imaging-focused smartphone with Zeiss collaboration optics, large 1-inch sensor, 200MP optical zoom camera, raw format capture support, and dynamic gaming processors.",
    imageUrl: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=400&auto=format&fit=crop&q=80",
    createdAt: "2026-06-14T15:00:00.000Z"
  },
  {
    id: "prod-6",
    name: "Boat Airdopes 219, 4Mics ENx, 40H Battery, Best in Segment for Calling, Stream Ad Free Music via App Support, Bluetooth Earbuds, TWS Ear Buds Wireless Earphones with mic (Ivory Mist)",
    price: 899,
    brand: "Boat",
    category: "Headphones",
    description: "Extremely compact completely wireless monitors featuring noise-isolated microphones for outstanding telephony clarity, and direct audio preset controllers.",
    imageUrl: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=400&auto=format&fit=crop&q=80",
    createdAt: "2026-06-15T10:00:00.000Z"
  },
  {
    id: "prod-7",
    name: "Boat Rockerz 255 Pro+, 60HRS Battery, Bluetooth Neckband with Fast Charge, IPX7, Magnetic Earbuds",
    price: 1099,
    brand: "Boat",
    category: "Headphones",
    description: "Reliable companion neckband with magnetized earbuds preventing cables tangles, water resistant shell for workouts, and outstanding deep acoustic bass boost.",
    imageUrl: "https://images.unsplash.com/photo-1613040809024-b4ef7ba99bc3?w=400&auto=format&fit=crop&q=80",
    createdAt: "2026-06-15T11:00:00.000Z"
  },
  {
    id: "prod-8",
    name: "Portronics Toad 8 Transparent Wireless Mouse, Dual Mode, Rechargeable, Silent Clicks, Ergonomic",
    price: 500,
    brand: "Portronics",
    category: "Mouse",
    description: "Stunning aesthetic desktop mouse showing internal hardware layout, silent microswitches, high DPI tracking, and long rechargeable runtimes.",
    imageUrl: "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=400&auto=format&fit=crop&q=80",
    createdAt: "2026-06-16T12:00:00.000Z"
  },
  {
    id: "prod-9",
    name: "Portronics Bubble 3.0 Wireless Keyboard, Multi Device Connection, Slim, Ergonomic, Shortcut Keys",
    price: 999,
    brand: "Portronics",
    category: "Keyboard",
    description: "Sleek keyboard designed for fast switching across tablets, laptops, and mobiles. Smooth scissor switches for low-noise writing.",
    imageUrl: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=400&auto=format&fit=crop&q=80",
    createdAt: "2026-06-16T14:00:00.000Z"
  },
  {
    id: "prod-10",
    name: "ZEBRONICS Zeb-V19Hd 18.5 Inch LED Monitor with HDMI, VGA, HD Resolution",
    price: 2400,
    brand: "ZEBRONICS",
    category: "Monitor",
    description: "Affordable utility screen equipped with legacy and digital input jacks, perfect for basic workspace displays and security setups.",
    imageUrl: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=400&auto=format&fit=crop&q=80",
    createdAt: "2026-06-17T09:00:00.000Z"
  },
  {
    id: "prod-11",
    name: "Sony WH-1000XM5 Premium Noise Cancelling Headphones",
    price: 29999,
    brand: "Sony",
    category: "Headphones",
    description: "Industry-leading premium sound quality with custom noise cancelling processors, advanced smart sensing, and ultra-comfortable ear cushions.",
    imageUrl: "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=400&auto=format&fit=crop&q=80",
    createdAt: "2026-06-17T11:00:00.000Z"
  },
  {
    id: "prod-12",
    name: "OnePlus 12 5G (Flowy Emerald, 16GB RAM, 512GB Storage) with Hasselblad Camera and 100W SuperVOOC Charge",
    price: 64999,
    brand: "OnePlus",
    category: "Mobile",
    description: "Equipped with Snapdragon 8 Gen 3, Hasselblad mobile camera system for hyper-realistic colors, and ultra-fast 100W flash charging support.",
    imageUrl: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&auto=format&fit=crop&q=80",
    createdAt: "2026-06-18T10:00:00.000Z"
  },
  {
    id: "prod-13",
    name: "Logitech MX Master 3S Wireless Performance Ergonomic Mouse - Ultra-fast Scrolling, 8K DPI Tracking, Quiet Clicks (Graphite)",
    price: 10995,
    brand: "Logitech",
    category: "Mouse",
    description: "Precision engineered performance mouse featuring MagSpeed scroll wheel, ultra-quiet clicks, and multi-device connection flow across computers.",
    imageUrl: "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=400&auto=format&fit=crop&q=80",
    createdAt: "2026-06-18T12:00:00.000Z"
  },
  {
    id: "prod-14",
    name: "Dell XPS 16 9640 Core Ultra 7 (32GB LPDDR5X, 1TB SSD) NVIDIA RTX 4060, 16.3\" UHD+ OLED Touchscreen Windows 11 Laptop",
    price: 249999,
    brand: "Dell",
    category: "Laptop",
    description: "High performance visual workspace boasting dynamic InfinityEdge OLED display panel, crafted in sleek aerospace aluminum shell with glowing haptic trackpad.",
    imageUrl: "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=400&auto=format&fit=crop&q=80",
    createdAt: "2026-06-19T09:00:00.000Z"
  },
  {
    id: "prod-15",
    name: "Keychron K2 V2 Hot-swappable Bluetooth Wireless Mechanical Keyboard with RGB Backlight, Gateron G-Pro Red Switches",
    price: 8499,
    brand: "Keychron",
    category: "Keyboard",
    description: "Premium tactile typing experience with highly-customizable keys, gorgeous aluminum body frame, dual Mac/Windows support, and lasting battery.",
    imageUrl: "https://images.unsplash.com/photo-1595225476474-87563907a212?w=400&auto=format&fit=crop&q=80",
    createdAt: "2026-06-19T10:30:00.000Z"
  },
  {
    id: "prod-16",
    name: "ASUS ROG Swift OLED PG27AQDM 27\" 1440p Gaming Monitor, 240Hz, 0.03ms Response Time, Anti-Glare Micro-texture Coating",
    price: 88990,
    brand: "ASUS",
    category: "Monitor",
    description: "Breathtaking gaming monitor featuring a professional OLED matrix, super-charged refresh rates, premium heatsink thermal management, and rich HDR contrast.",
    imageUrl: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=400&auto=format&fit=crop&q=80",
    createdAt: "2026-06-20T11:00:00.000Z"
  },
  {
    id: "prod-17",
    name: "Apple AirPods Pro (2nd Generation) with USB-C Charging, Active Noise Cancellation and Adaptive Transparency",
    price: 24900,
    brand: "Apple",
    category: "Headphones",
    description: "Smart sound powered by the improved H2 audio processor, customizable listening profiles, intelligent spatial acoustics, and safe dust/water resistance.",
    imageUrl: "https://images.unsplash.com/photo-1588449668338-d1516882e471?w=400&auto=format&fit=crop&q=80",
    createdAt: "2026-06-20T14:00:00.000Z"
  },
  {
    id: "prod-18",
    name: "Google Pixel 9 Pro XL 5G (Obsidian, 16GB RAM, 256GB Storage) AI Built-in with Triple Camera Array and Geminis Pro Access",
    price: 124999,
    brand: "Google",
    category: "Mobile",
    description: "Pure stock Android feel reinforced by Google's proprietary Tensor G4 processing unit, highly capable optical zooming lenses, and comprehensive photo restoration features.",
    imageUrl: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&auto=format&fit=crop&q=80",
    createdAt: "2026-06-21T08:00:00.000Z"
  },
  {
    id: "prod-19",
    name: "Razer DeathAdder V3 Pro Ultra-lightweight Wireless Ergonomic Gaming Mouse, 63g, 30K DPI Optical Sensor",
    price: 13499,
    brand: "Razer",
    category: "Mouse",
    description: "Created in cooperation with top esports professionals. Feathery hand weight paired with highly-reliable optical microswitches and zero lagging radio signals.",
    imageUrl: "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=400&auto=format&fit=crop&q=80",
    createdAt: "2026-06-21T09:30:00.000Z"
  },
  {
    id: "prod-20",
    name: "Sennheiser Momentum 4 Wireless Headsets with Adaptive ANC and Extraordinary 60H Playtime (Denim Edition)",
    price: 27990,
    brand: "Sennheiser",
    category: "Headphones",
    description: "Exceptional dynamic acoustics delivering absolute clarity, alongside extremely long play duration, comfortable headband cushion, and smart voice capture.",
    imageUrl: "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=400&auto=format&fit=crop&q=80",
    createdAt: "2026-06-22T10:00:00.000Z"
  },
  {
    id: "prod-21",
    name: "LG UltraGear QD-OLED 45\" Curved Ultrawide Monitor, 240Hz, 800R Deep Curvature, VESA DisplayHDR True Black 400",
    price: 145000,
    brand: "LG",
    category: "Monitor",
    description: "Massive ultra-panoramic monitor providing outstanding immersion, superb depth of colors, high speed processing, and dual screen split viewing options.",
    imageUrl: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=400&auto=format&fit=crop&q=80",
    createdAt: "2026-06-22T12:00:00.000Z"
  },
  {
    id: "prod-22",
    name: "Apple MacBook Pro 16 Inch (M3 Max Chip, 36GB Unified Memory, 1TB SSD) - Space Black Studio Workstation",
    price: 349900,
    brand: "Apple",
    category: "Laptop",
    description: "The ultimate notebook for professionals. Immersive 120Hz Liquid Retina XDR screen, studio-grade multiple microphones and rich sounding spatial speakers.",
    imageUrl: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&auto=format&fit=crop&q=80",
    createdAt: "2026-06-23T09:00:00.000Z"
  },
  {
    id: "prod-23",
    name: "Logitech MX Keys S Wireless Premium Keyboard, Comfortable Tactile Feedback, Smart Illumination, USB-C (Pale Gray)",
    price: 12995,
    brand: "Logitech",
    category: "Keyboard",
    description: "Spherically-dished keycaps matching natural finger rest profiles, smart proximity backlights, and fluid custom macrowriting setups.",
    imageUrl: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=400&auto=format&fit=crop&q=80",
    createdAt: "2026-06-23T11:00:00.000Z"
  },
  {
    id: "prod-24",
    name: "Nothing Phone (2a) Plus 5G (Grey, 12GB RAM, 256GB Storage) Unique Transparency Glyph Interface Core Design",
    price: 29999,
    brand: "Nothing",
    category: "Mobile",
    description: "Symmetric bezel screens housing signature glowing Glyph indicators, custom-designed icons on top of dynamic Android modifications, and dual cameras.",
    imageUrl: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=400&auto=format&fit=crop&q=80",
    createdAt: "2026-06-24T10:00:00.000Z"
  },
  {
    id: "prod-25",
    name: "Corsair K70 PRO RGB Mechanical Wired Gaming Keyboard with Cherry MX Speed Switches and Double-shot PBT Keycaps",
    price: 15499,
    brand: "Corsair",
    category: "Keyboard",
    description: "High speed input tracking using advanced hyper-processing engines, real leather wrist cushion, dedicated multimedia dialing knob, and glowing lights.",
    imageUrl: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=400&auto=format&fit=crop&q=80",
    createdAt: "2026-06-24T14:30:00.000Z"
  },
  {
    id: "prod-26",
    name: "SteelSeries Aerox 3 Wireless Ultra-lightweight Gaming Mouse, Water-resistant IP54, 200 Hour Battery Life",
    price: 8999,
    brand: "SteelSeries",
    category: "Mouse",
    description: "Shatterproof durable chassis weight optimized with unique honeycombed shells, completely protected from external liquid splashes or dry dust build-up.",
    imageUrl: "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=400&auto=format&fit=crop&q=80",
    createdAt: "2026-06-25T09:00:00.000Z"
  },
  {
    id: "prod-27",
    name: "Lenovo Legion Pro 5 Gen 9 AMD Ryzen 7 (16GB DDR5, 1TB SSD) RTX 4070, 16\" WQXGA 240Hz High Refresh IPS Laptop",
    price: 164999,
    brand: "Lenovo",
    category: "Laptop",
    description: "State of the art high frame processing power optimized using smart AI chips, featuring full keyboard controls, massive air cooling pipes, and heavy gaming power.",
    imageUrl: "https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=400&auto=format&fit=crop&q=80",
    createdAt: "2026-06-25T11:00:00.000Z"
  },
  {
    id: "prod-28",
    name: "BenQ MOBIUZ EX2710Q 27\" QHD IPS HDR400 Gaming Monitor, 165Hz, TreVolo Built-in Speakers and Subwoofer",
    price: 25499,
    brand: "BenQ",
    category: "Monitor",
    description: "Incredible image quality optimized with dynamic auto-brightness, featuring premium built-in sound speakers with a mini sub-woofer for rich audio tracks.",
    imageUrl: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=400&auto=format&fit=crop&q=80",
    createdAt: "2026-06-26T10:00:00.000Z"
  }
];

export const INITIAL_ORDERS: Order[] = [
  {
    id: "6a2d214b6d54d6e785cfa743",
    userId: "user-1",
    userFirstName: "Karan",
    userLastName: "Gill",
    userEmail: "gillkarangill23@gmail.com",
    items: [
      {
        productId: "prod-2",
        productName: "Samsung Galaxy S26 Ultra 5G (Cobalt Violet, 12GB RAM, 256GB Storage) with Built-in Privacy Display...",
        price: 139999,
        imageUrl: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=400&auto=format&fit=crop&q=80",
        quantity: 1
      }
    ],
    totalAmount: 146998.95,
    status: OrderStatus.FAILED,
    createdAt: "2026-06-13T10:30:22.000Z"
  },
  {
    id: "6a2d21956d54d6e785cfa7d1",
    userId: "user-1",
    userFirstName: "Karan",
    userLastName: "Gill",
    userEmail: "gillkarangill23@gmail.com",
    items: [
      {
        productId: "prod-3",
        productName: "Noise Airwave Max 4 Wireless Over Ear Headphones with 70H Playtime, ENC, 40mm Driver...",
        price: 1999,
        imageUrl: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&auto=format&fit=crop&q=80",
        quantity: 1
      }
    ],
    totalAmount: 2098.95,
    status: OrderStatus.PAID,
    createdAt: "2026-06-13T15:24:10.000Z"
  },
  {
    id: "6a2e540abaa15a64e042050d",
    userId: "user-1",
    userFirstName: "Karan",
    userLastName: "Gill",
    userEmail: "gillkarangill23@gmail.com",
    items: [
      {
        productId: "prod-3",
        productName: "Noise Airwave Max 4 Wireless Over Ear Headphones with 70H Playtime, ENC, 40mm Driver...",
        price: 1999,
        imageUrl: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&auto=format&fit=crop&q=80",
        quantity: 1
      }
    ],
    totalAmount: 2098.95,
    status: OrderStatus.PAID,
    createdAt: "2026-06-14T08:12:45.000Z"
  }
];

export const SALES_HISTORY_MOCK: SalesHistoryPoint[] = [
  { date: "2026-06-11", amount: 1000 },
  { date: "2026-06-12", amount: 4500 },
  { date: "2026-06-13", amount: 2098.95 },
  { date: "2026-06-14", amount: 12593.70 },
];
