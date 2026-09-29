"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  Coffee,
  Utensils,
  Pizza,
  MapPin,
  Phone,
  Clock,
  ExternalLink,
  ShoppingBag,
  Cake,
  Leaf,
  Star,
  MessageCircle,
  Navigation,
  ChevronDown,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Contact + ordering                                                 */
/* ------------------------------------------------------------------ */

const PHONE_DISPLAY = "082 768 0786";
const PHONE_TEL = "tel:+27827680786";
const WHATSAPP_URL =
  "https://wa.me/27827680786?text=" +
  encodeURIComponent("Hi SOHO CAFE, I'd like to place an order.");
// Replace these two with SOHO CAFE's exact store pages once you have them.
const UBER_EATS_URL = "https://www.ubereats.com/za/search?q=Soho%20Cafe";
const MR_D_URL = "https://www.mrd.com/";

/* ------------------------------------------------------------------ */
/*  Locations                                                          */
/* ------------------------------------------------------------------ */

type LocationId = "umhlanga" | "sandton";

interface HoursRow {
  label: string;
  days: number[]; // 0 = Sunday
  open: string; // "HH:MM"
  close: string;
}

interface StoreLocation {
  id: LocationId;
  name: string;
  street: string;
  addressLines: string[];
  mapsQuery: string;
  note: string;
  hours: HoursRow[];
}

// Operating hours are placeholders: confirm with each store before launch.
const LOCATIONS: StoreLocation[] = [
  {
    id: "umhlanga",
    name: "Umhlanga Rocks",
    street: "Marine Drive",
    addressLines: ["30 Marine Drive, Shop no 1", "Umhlanga Rocks, Durban, 4319"],
    mapsQuery: "SOHO CAFE, 30 Marine Drive, Umhlanga Rocks, Durban, 4319",
    note: "A short walk from the promenade and the lighthouse.",
    hours: [
      { label: "Monday to Thursday", days: [1, 2, 3, 4], open: "07:00", close: "21:00" },
      { label: "Friday", days: [5], open: "07:00", close: "22:00" },
      { label: "Saturday", days: [6], open: "07:30", close: "22:00" },
      { label: "Sunday", days: [0], open: "07:30", close: "21:00" },
    ],
  },
  {
    id: "sandton",
    name: "Sandton",
    street: "Corlett Drive",
    addressLines: ["3 Corlett Drive", "Illovo, Sandton"],
    mapsQuery: "SOHO CAFE, 3 Corlett Drive, Illovo, Sandton",
    note: "On Corlett Drive in Illovo, with street parking close by.",
    hours: [
      { label: "Monday to Friday", days: [1, 2, 3, 4, 5], open: "06:30", close: "21:00" },
      { label: "Saturday", days: [6], open: "07:30", close: "22:00" },
      { label: "Sunday", days: [0], open: "07:30", close: "20:00" },
    ],
  },
];

const toMinutes = (hhmm: string) => {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
};

/** Current day + minutes in South African time, computed only on the client. */
function useSastClock() {
  const [now, setNow] = useState<{ day: number; minutes: number } | null>(null);

  useEffect(() => {
    const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const tick = () => {
      const parts = new Intl.DateTimeFormat("en-GB", {
        timeZone: "Africa/Johannesburg",
        weekday: "short",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      }).formatToParts(new Date());
      const get = (type: string) => parts.find((p) => p.type === type)?.value ?? "0";
      const hour = parseInt(get("hour"), 10) % 24;
      setNow({ day: weekdays.indexOf(get("weekday")), minutes: hour * 60 + parseInt(get("minute"), 10) });
    };
    tick();
    const id = window.setInterval(tick, 60_000);
    return () => window.clearInterval(id);
  }, []);

  return now;
}

/* ------------------------------------------------------------------ */
/*  Menu                                                               */
/* ------------------------------------------------------------------ */

type CategoryId = "coffee" | "breakfast" | "pizza" | "bakery";

interface MenuItem {
  name: string;
  note?: string;
  prices: (number | null)[]; // one entry per size; null = not offered in that size
}

interface MenuGroup {
  title: string;
  sizes?: string[];
  footnote?: string;
  items: MenuItem[];
}

interface MenuCategory {
  id: CategoryId;
  label: string;
  icon: LucideIcon;
  intro: string;
  groups: MenuGroup[];
}

const formatPrices = (prices: (number | null)[]) => prices.map((p) => (p === null ? "–" : p)).join(" / ");

const MENU: MenuCategory[] = [
  {
    id: "coffee",
    label: "Specialty Coffee & Drinks",
    icon: Coffee,
    intro: "Espresso, lattes, iced freezos, fresh-pressed juices and smoothies.",
    groups: [
      {
        title: "Espresso bar",
        sizes: ["Sng", "Dbl"],
        items: [
          { name: "Espresso", prices: [28, 30] },
          { name: "Cortado", prices: [null, 34] },
          { name: "Magic", prices: [null, 36] },
          { name: "Flat White", prices: [null, 38] },
          { name: "Café Cubano", prices: [null, 40] },
          { name: "Café Bombón", prices: [null, 40] },
        ],
      },
      {
        title: "Coffee & lattes",
        sizes: ["Short", "Tall"],
        items: [
          { name: "Americano", prices: [32, 35] },
          { name: "Cappuccino", prices: [37, 42] },
          { name: "Latte", prices: [null, 40] },
          { name: "Mochaccino", prices: [null, 45] },
          { name: "White Mochaccino", prices: [null, 45] },
          { name: "Red Cappuccino", prices: [37, 42] },
          { name: "Hot Chocolate", prices: [40, 45] },
          { name: "White Hot Chocolate", prices: [40, 45] },
          { name: "Dirty Chai", prices: [null, 50] },
          { name: "Chai Latte", prices: [null, 45] },
          { name: "Dirty Caribbean", prices: [null, 55] },
          { name: "Caribbean", prices: [null, 50] },
          { name: "Vietnamese Latte", prices: [null, 55] },
          { name: "Lotus Latte", prices: [null, 55] },
          { name: "Karak Latte", prices: [null, 50] },
          { name: "Baby Chino", prices: [12] },
        ],
      },
      {
        title: "Iced",
        items: [
          { name: "Coffee Freezo", prices: [52] },
          { name: "Mocha Freezo", prices: [56] },
          { name: "Iced Latte", prices: [45] },
          { name: "Iced Karak", prices: [48] },
          { name: "Aero Mint Freezo", prices: [52] },
          { name: "Mango Freezo", prices: [50] },
          { name: "Lemon Mint Freezo", prices: [50] },
          { name: "Vietnamese Coffee", note: "Over ice or crushed", prices: [50] },
          { name: "Iced Caramel Macchiato", prices: [50] },
          { name: "Iced Peach Tea", prices: [50] },
          { name: "Iced Rooibos Tea", prices: [50] },
          { name: "Soft Drinks", prices: [30] },
          { name: "Water 440ml", note: "Still or sparkling", prices: [25] },
        ],
      },
      {
        title: "Raw juices & smoothies",
        items: [
          { name: "Fresh Orange", prices: [50] },
          { name: "Daily Greens", prices: [55] },
          { name: "Orange, Pineapple & Carrot", prices: [55] },
          { name: "ABC with Lemon & Ginger", prices: [57] },
          { name: "Peanut Butter Smoothie", prices: [58] },
          { name: "Berry Blast Smoothie", prices: [56] },
          { name: "Date & Nut Smoothie", prices: [58] },
        ],
      },
      {
        title: "Tea & extras",
        items: [
          { name: "Pot of Tea", note: "Ceylon, rooibos or green tea", prices: [30] },
          { name: "Almond or Oat Milk", note: "250ml / 350ml", prices: [12, 16] },
          { name: "Espresso Shot", prices: [10] },
          { name: "Flavoured Syrup", prices: [15] },
          { name: "Cream", prices: [10] },
        ],
      },
    ],
  },
  {
    id: "breakfast",
    label: "All-Day Breakfast",
    icon: Utensils,
    intro: "Served from open to close, because breakfast shouldn't have a cut-off time.",
    // Placeholder dishes: replace with the real breakfast menu.
    groups: [
      {
        title: "Breakfast",
        items: [
          { name: "SOHO Big Breakfast", note: "Eggs, beef bacon, halloumi, mushrooms, sourdough", prices: [135] },
          { name: "Shakshuka", note: "Baked eggs, spiced tomato, feta, ciabatta", prices: [98] },
          { name: "Avo & Feta Smash", note: "Sourdough, whipped feta, chilli, poached egg", prices: [92] },
        ],
      },
      {
        title: "Eggs & sweet",
        items: [
          { name: "Pastrami Benedict", note: "Beef pastrami, poached eggs, hollandaise", prices: [115] },
          { name: "Buttermilk Flapjacks", note: "Berries, mascarpone, maple syrup", prices: [85] },
          { name: "Croissant Scramble", note: "Soft eggs, chives, cheddar", prices: [88] },
        ],
      },
    ],
  },
  {
    id: "pizza",
    label: "Neapolitan Pizza & Pasta",
    icon: Pizza,
    intro: "Authentic woodfired Italian pizza, available from 11am, Tuesday to Sunday.",
    groups: [
      {
        title: "Classics",
        items: [
          { name: "Focaccia", note: "Garlic, fresh herbs, EVOO", prices: [95] },
          { name: "Traditional Margherita", note: "Mozzarella, San Marzano-type tomato sauce, fresh basil, EVOO", prices: [125] },
          { name: "Italian Margherita", note: "Fior di latte, San Marzano-type tomato sauce, fresh basil, EVOO", prices: [125] },
          { name: "Chillie Margherita", note: "Fior di latte, tomato sauce, fresh basil, fresh green chillie, EVOO", prices: [135] },
        ],
      },
      {
        title: "Toppings",
        items: [
          { name: "Vegetarian", note: "Red onion, mushrooms, green peppers, mozzarella, EVOO", prices: [145] },
          { name: "Diavola", note: "Cured pepperoni, black olives, green peppers, mozzarella, EVOO", prices: [155] },
          { name: "Il Pollo", note: "Roasted chicken, red onion, green peppers, mozzarella, EVOO", prices: [165] },
          { name: "El Carne", note: "Grilled steak, green peppers, mushrooms, mozzarella, EVOO, mayo drizzle", prices: [185] },
          { name: "Gamberetti", note: "Prawns, chillies, red onion, avocado, mozzarella, EVOO", prices: [220] },
        ],
      },
      {
        title: "Pasta",
        footnote: "Add prawns +50",
        items: [
          { name: "Creamy Mushroom Pasta", note: "Penne, chicken, creamy mushroom sauce", prices: [135] },
          { name: "Creamy Pasta Pomodoro", note: "Penne, chicken, creamy tomato sauce, green peppers, mushrooms", prices: [135] },
        ],
      },
    ],
  },
  {
    id: "bakery",
    label: "Artisanal Bakery & Desserts",
    icon: Cake,
    intro: "Baked every morning.",
    // Placeholder items: replace with the real bakery counter.
    groups: [
      {
        title: "Bakery",
        items: [
          { name: "Almond Croissant", prices: [42] },
          { name: "Pistachio Cruffin", prices: [48] },
          { name: "Cinnamon Scroll", prices: [38] },
        ],
      },
      {
        title: "Desserts",
        items: [
          { name: "Basque Cheesecake", prices: [65] },
          { name: "Tiramisu", prices: [62] },
          { name: "Lemon Tart", prices: [48] },
        ],
      },
    ],
  },
];

/* ------------------------------------------------------------------ */
/*  Reviews (placeholders: replace with real Google reviews)           */
/* ------------------------------------------------------------------ */

const REVIEWS = [
  {
    quote: "The Spanish latte is the best I've had in Umhlanga, and it's such a relief that everything on the menu is halaal.",
    name: "Aisha M.",
    where: "Umhlanga Rocks",
  },
  {
    quote: "Proper Neapolitan pizza. Soft, leopard-spotted crust and the chicken tikka one is a must.",
    name: "Tariq S.",
    where: "Sandton",
  },
  {
    quote: "Came for breakfast at 3pm and nobody blinked. Beautiful space, all that green tile and hanging plants.",
    name: "Lerato N.",
    where: "Sandton",
  },
];

/* ------------------------------------------------------------------ */
/*  Ambient hero pieces                                                */
/* ------------------------------------------------------------------ */

const VINES = [
  { left: "6%", length: 210, delay: 0, flip: false, hideOnMobile: true },
  { left: "17%", length: 140, delay: 1.2, flip: true, hideOnMobile: true },
  { left: "44%", length: 180, delay: 0.6, flip: false, hideOnMobile: false },
  { left: "71%", length: 240, delay: 1.8, flip: true, hideOnMobile: false },
  { left: "88%", length: 160, delay: 0.9, flip: false, hideOnMobile: false },
];

const MOTES = [
  { left: "4%", size: 14, duration: 19, delay: 0 },
  { left: "13%", size: 10, duration: 23, delay: 5 },
  { left: "24%", size: 16, duration: 21, delay: 9 },
  { left: "36%", size: 11, duration: 25, delay: 2 },
  { left: "52%", size: 13, duration: 20, delay: 12 },
  { left: "63%", size: 9, duration: 26, delay: 7 },
  { left: "77%", size: 15, duration: 22, delay: 3 },
  { left: "90%", size: 12, duration: 24, delay: 10 },
];

function HangingVine({ length, flip }: { length: number; flip: boolean }) {
  const leafCount = Math.floor((length - 30) / 24);
  const bend = flip ? -9 : 9;
  return (
    <svg width="64" height={length + 24} viewBox={`0 0 64 ${length + 24}`} aria-hidden="true">
      {/* matte black pot sitting on the iron shelf */}
      <path d="M18 0 H46 L42 20 H22 Z" fill="#1C1C1C" />
      <path
        d={`M32 18 C ${32 + bend} ${length * 0.35}, ${32 - bend} ${length * 0.7}, 32 ${length + 20}`}
        stroke="#4A6B5D"
        strokeWidth="1.6"
        fill="none"
      />
      {Array.from({ length: leafCount }, (_, i) => {
        const y = 34 + i * 24;
        const side = i % 2 === 0 ? 1 : -1;
        const cx = 32 + side * 9;
        return (
          <ellipse
            key={i}
            cx={cx}
            cy={y}
            rx={9 - (i / leafCount) * 3}
            ry={4.5 - (i / leafCount) * 1.2}
            fill={i % 3 === 0 ? "#709080" : "#4A6B5D"}
            transform={`rotate(${side * 32} ${cx} ${y})`}
          />
        );
      })}
    </svg>
  );
}

function LeafMote({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
      <path d="M3 21 C3 10 10 3 21 3 C21 14 14 21 3 21 Z" fill="#709080" />
      <path d="M3 21 L15 9" stroke="#E2E8E4" strokeWidth="1" />
    </svg>
  );
}

function SteamingCup() {
  return (
    <svg viewBox="0 0 240 250" className="w-full h-auto" role="img" aria-label="A steaming SOHO CAFE latte">
      {/* vapour */}
      <g fill="none" stroke="#F4F6F4" strokeWidth="7" strokeLinecap="round">
        <path className="steam" style={{ animationDelay: "0s" }} d="M92 96 C78 80 104 68 92 50 C84 38 98 28 94 16" />
        <path className="steam" style={{ animationDelay: "1.6s" }} d="M120 100 C106 82 134 70 120 50 C110 36 126 24 122 10" />
        <path className="steam" style={{ animationDelay: "3.1s" }} d="M148 96 C136 80 160 68 148 50 C140 38 154 28 150 16" />
      </g>
      {/* saucer */}
      <ellipse cx="120" cy="222" rx="104" ry="16" fill="#D0B49F" />
      <ellipse cx="120" cy="218" rx="70" ry="9" fill="#BFA18A" />
      {/* handle */}
      <path d="M184 142 C220 140 222 186 182 188" stroke="#2A2A2A" strokeWidth="13" fill="none" strokeLinecap="round" />
      {/* body */}
      <path d="M50 118 H190 V156 C190 200 160 214 120 214 C80 214 50 200 50 156 Z" fill="#2A2A2A" />
      <path d="M50 150 H190" stroke="#709080" strokeWidth="4" />
      {/* crema + latte art */}
      <ellipse cx="120" cy="118" rx="70" ry="13" fill="#7A4E32" />
      <path d="M120 111 C106 106 102 120 120 126 C138 120 134 106 120 111 Z" fill="#EADCC8" />
      <path d="M120 126 V111" stroke="#7A4E32" strokeWidth="1.5" />
      <text x="120" y="186" textAnchor="middle" fontFamily="Outfit, sans-serif" fontSize="15" letterSpacing="4" fill="#8DA493">
        SOHO
      </text>
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

export default function Home() {
  const reduceMotion = useReducedMotion();
  const clock = useSastClock();
  const [activeCategory, setActiveCategory] = useState<CategoryId>("coffee");
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeLocation, setActiveLocation] = useState<LocationId>("umhlanga");

  const category = MENU.find((c) => c.id === activeCategory) ?? MENU[0];
  const location = LOCATIONS.find((l) => l.id === activeLocation) ?? LOCATIONS[0];

  const todayRow = clock ? location.hours.find((h) => h.days.includes(clock.day)) : undefined;
  const isOpen =
    clock && todayRow
      ? clock.minutes >= toMinutes(todayRow.open) && clock.minutes < toMinutes(todayRow.close)
      : null;

  const mapsDirections = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(location.mapsQuery)}`;
  const mapsEmbed = `https://www.google.com/maps?q=${encodeURIComponent(location.mapsQuery)}&output=embed`;

  const orderChannels = [
    { label: "Order on Uber Eats", href: UBER_EATS_URL, icon: ShoppingBag, note: "Delivery to your door" },
    { label: "Order on Mr D", href: MR_D_URL, icon: ShoppingBag, note: "Delivery to your door" },
    { label: "Order on WhatsApp", href: WHATSAPP_URL, icon: MessageCircle, note: `Collection via ${PHONE_DISPLAY}` },
  ];

  return (
    <main className="relative overflow-x-hidden pb-24 md:pb-0">
      {/* ------------------------------ Nav ------------------------------ */}
      <header className="fixed inset-x-0 top-0 z-40 border-b border-charcoal/10 bg-tile/80 backdrop-blur-md">
        <nav className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3">
          <a href="#top" className="flex items-center gap-3" aria-label="SOHO CAFE home">
            <img src="/soho-mark.png" alt="" className="h-10 w-auto" />
            <span className="font-display text-lg font-semibold tracking-wide">SOHO CAFE</span>
          </a>
          <div className="hidden items-center gap-7 text-sm font-medium text-charcoal/75 md:flex">
            <a href="#menu" onClick={() => setMenuOpen(true)} className="hover:text-forest">Menu</a>
            <a href="#order" className="hover:text-forest">Order</a>
            <a href="#locations" className="hover:text-forest">Locations</a>
            <a href="#reviews" className="hover:text-forest">Reviews</a>
          </div>
          <a
            href={PHONE_TEL}
            className="flex items-center gap-2 rounded-full bg-charcoal px-4 py-2 text-sm font-medium text-tile hover:bg-forest"
          >
            <Phone className="h-4 w-4" />
            <span className="hidden sm:inline">{PHONE_DISPLAY}</span>
            <span className="sm:hidden">Call</span>
          </a>
        </nav>
      </header>

      {/* ------------------------------ Hero ----------------------------- */}
      <section id="top" className="tile-light relative isolate min-h-[92vh] overflow-hidden pt-16">
        {/* black iron shelf */}
        <div className="absolute inset-x-0 top-[88px] z-10" aria-hidden="true">
          <div className="h-[6px] w-full bg-charcoal shadow-[0_6px_14px_rgba(0,0,0,0.18)]" />
          <div className="absolute left-[12%] top-0 h-24 w-[3px] -translate-y-full bg-charcoal" />
          <div className="absolute right-[12%] top-0 h-24 w-[3px] -translate-y-full bg-charcoal" />
          {VINES.map((v, i) => (
            <motion.div
              key={i}
              className={`absolute -top-[18px] ${v.hideOnMobile ? "hidden md:block" : ""}`}
              style={{ left: v.left, transformOrigin: "50% 0%" }}
              animate={reduceMotion ? undefined : { rotate: [-2.2, 2.2, -2.2] }}
              transition={{ duration: 7 + v.delay, repeat: Infinity, ease: "easeInOut", delay: v.delay }}
            >
              <div className="origin-top scale-[0.6] md:scale-100">
                <HangingVine length={v.length} flip={v.flip} />
              </div>
            </motion.div>
          ))}
        </div>

        {/* floating leaf motes */}
        {!reduceMotion && (
          <div className="pointer-events-none absolute inset-0 -z-10" aria-hidden="true">
            {MOTES.map((m, i) => (
              <motion.div
                key={i}
                className="absolute bottom-0"
                style={{ left: m.left }}
                initial={{ y: 40, opacity: 0 }}
                animate={{ y: [40, -760], x: [0, 26, -18, 12], rotate: [0, 120, 260], opacity: [0, 0.55, 0.55, 0] }}
                transition={{ duration: m.duration, repeat: Infinity, delay: m.delay, ease: "linear" }}
              >
                <LeafMote size={m.size} />
              </motion.div>
            ))}
          </div>
        )}

        <div className="mx-auto grid max-w-6xl items-center gap-12 px-5 pb-20 pt-20 md:pt-60 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <img src="/soho-logo.png" alt="SOHO CAFE" className="mb-6 h-24 w-auto sm:mb-8 sm:h-32" />
            <p className="inline-flex items-center gap-2 rounded-full border border-forest/25 bg-white/60 px-3 py-1 text-sm font-medium text-forest">
              <Leaf className="h-4 w-4" />
              100% Halaal Certified
            </p>
            <h1 className="mt-6 font-display text-5xl font-semibold leading-[1.02] tracking-tight text-charcoal sm:text-6xl lg:text-7xl">
              Coffee in the morning. Pizza from the fire.
            </h1>
            <p className="mt-6 max-w-lg text-lg leading-relaxed text-charcoal/70">
              Specialty coffee, breakfast served all day and woodfired Neapolitan pizza, on Marine Drive in
              Umhlanga Rocks and Corlett Drive in Sandton.
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <a
                href="#menu"
                onClick={() => setMenuOpen(true)}
                className="rounded-full bg-charcoal px-6 py-3 font-medium text-tile hover:bg-forest"
              >
                See the menu
              </a>
              <a
                href="#order"
                className="flex items-center gap-2 rounded-full border border-charcoal/20 bg-white/70 px-6 py-3 font-medium hover:border-forest hover:text-forest"
              >
                <ShoppingBag className="h-4 w-4" />
                Order now
              </a>
            </div>
          </div>

          {/* halo sign + steaming cup */}
          <div className="relative mx-auto w-full max-w-sm">
            <div className="halo-ring tile-sage relative aspect-square overflow-hidden rounded-full border-[10px] border-charcoal">
              <div className="absolute inset-0 bg-gradient-to-b from-charcoal/0 via-charcoal/5 to-charcoal/40" />
              <div className="absolute inset-x-10 bottom-8 top-10">
                <SteamingCup />
              </div>
            </div>
            <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 rounded-full bg-charcoal px-5 py-2 shadow-lg">
              <span className="halo-text font-display text-sm tracking-[0.3em]">SOHO CAFE</span>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------------- Core offerings strip --------------------- */}
      <section className="border-y border-charcoal/10 bg-white">
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-px bg-charcoal/10 md:grid-cols-4">
          {[
            { icon: Leaf, title: "100% Halaal", text: "Certified across both kitchens" },
            { icon: Coffee, title: "Specialty coffee", text: "Pulled by trained baristas" },
            { icon: Utensils, title: "All-day breakfast", text: "Open to close, every day" },
            { icon: Pizza, title: "Woodfired pizza", text: "Neapolitan, 90 seconds in the oven" },
          ].map(({ icon: Icon, title, text }) => (
            <div key={title} className="flex items-start gap-3 bg-white px-5 py-6">
              <Icon className="mt-0.5 h-5 w-5 shrink-0 text-sagedeep" />
              <div>
                <p className="font-display font-semibold">{title}</p>
                <p className="text-sm text-charcoal/60">{text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ------------------------------ Menu ----------------------------- */}
      <section id="menu" className="scroll-mt-20 bg-tile py-16">
        <div className="mx-auto max-w-6xl px-5">
          <div className="flex flex-col gap-5 rounded-3xl bg-white p-6 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:p-8">
            <div>
              <h2 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">The menu</h2>
              <p className="mt-2 max-w-xl text-sm text-charcoal/60">
                Coffee, freezos, fresh juices, all-day breakfast, woodfired pizza, pasta and desserts. 100% halaal,
                prices in rand.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setMenuOpen((open) => !open)}
              aria-expanded={menuOpen}
              aria-controls="menu-content"
              className="flex shrink-0 items-center gap-2 self-start rounded-full bg-charcoal px-6 py-3 font-medium text-tile hover:bg-forest sm:self-auto"
            >
              {menuOpen ? "Hide menu" : "Show menu"}
              <ChevronDown className={`h-4 w-4 transition-transform duration-300 ${menuOpen ? "rotate-180" : ""}`} />
            </button>
          </div>

          <AnimatePresence initial={false}>
            {menuOpen && (
              <motion.div
                id="menu-content"
                key="menu-content"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
                className="overflow-hidden"
              >

          <div role="tablist" aria-label="Menu sections" className="mt-8 flex gap-2 overflow-x-auto pb-2">
            {MENU.map(({ id, label, icon: Icon }) => {
              const active = id === activeCategory;
              return (
                <button
                  key={id}
                  role="tab"
                  aria-selected={active}
                  aria-controls="menu-panel"
                  onClick={() => setActiveCategory(id)}
                  className={`relative flex shrink-0 items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium transition-colors ${
                    active ? "text-tile" : "text-charcoal/70 hover:text-charcoal"
                  }`}
                >
                  {active && (
                    <motion.span
                      layoutId="menu-tab-pill"
                      className="absolute inset-0 rounded-full bg-charcoal"
                      transition={{ type: "spring", stiffness: 420, damping: 34 }}
                    />
                  )}
                  <Icon className="relative h-4 w-4" />
                  <span className="relative whitespace-nowrap">{label}</span>
                </button>
              );
            })}
          </div>

          <div id="menu-panel" role="tabpanel" className="mt-6 rounded-3xl bg-white p-6 shadow-sm sm:p-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.22 }}
              >
                <p className="text-sm text-charcoal/60">{category.intro}</p>
                <div className="mt-6 gap-x-10 sm:columns-2 lg:columns-3">
                  {category.groups.map((group) => (
                    <div key={group.title} className="mb-7 break-inside-avoid">
                      <div className="flex items-baseline justify-between border-b-2 border-charcoal pb-1.5">
                        <h3 className="font-display text-base font-semibold">{group.title}</h3>
                        {group.sizes && (
                          <span className="text-xs text-charcoal/50">{group.sizes.join(" / ")}</span>
                        )}
                      </div>
                      <ul className="divide-y divide-charcoal/[0.07]">
                        {group.items.map((item) => (
                          <li key={item.name} className="py-1.5">
                            <div className="flex items-baseline justify-between gap-4">
                              <span className="text-[15px] font-medium">{item.name}</span>
                              <span className="shrink-0 font-display text-sm font-semibold tabular-nums text-forest">
                                {formatPrices(item.prices)}
                              </span>
                            </div>
                            {item.note && (
                              <p className="text-xs leading-snug text-charcoal/55">{item.note}</p>
                            )}
                          </li>
                        ))}
                      </ul>
                      {group.footnote && <p className="mt-2 text-xs font-medium text-forest">{group.footnote}</p>}
                    </div>
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>
            <p className="mt-2 border-t border-charcoal/10 pt-4 text-xs text-charcoal/50">
              We take every precaution for guests with food allergies or special diets, but we can&apos;t guarantee
              any item is free from all allergens. Please ask your server.
            </p>
          </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* ------------------------ Order / delivery ----------------------- */}
      <section id="order" className="scroll-mt-20 bg-charcoal py-20 text-tile">
        <div className="mx-auto max-w-6xl px-5">
          <div className="flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-lg">
              <h2 className="font-display text-4xl font-semibold tracking-tight">Order in or pick up</h2>
              <p className="mt-4 text-tile/65">
                Get delivery through Uber Eats or Mr D, or send us a WhatsApp to order for collection from either store.
              </p>
            </div>
            <a href={PHONE_TEL} className="flex items-center gap-2 text-wood hover:text-tile">
              <Phone className="h-4 w-4" />
              Prefer to call? {PHONE_DISPLAY}
            </a>
          </div>

          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {orderChannels.map(({ label, href, icon: Icon, note }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center justify-between rounded-2xl border border-tile/15 bg-white/[0.04] px-6 py-5 hover:border-sage hover:bg-white/[0.08]"
              >
                <span className="flex items-center gap-4">
                  <span className="grid h-11 w-11 place-items-center rounded-full bg-sage/20 text-sage">
                    <Icon className="h-5 w-5" />
                  </span>
                  <span>
                    <span className="block font-display text-lg font-medium">{label}</span>
                    <span className="block text-sm text-tile/55">{note}</span>
                  </span>
                </span>
                <ExternalLink className="h-4 w-4 text-tile/40 group-hover:text-sage" />
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------------------- Locations -------------------------- */}
      <section id="locations" className="tile-light scroll-mt-20 py-24">
        <div className="mx-auto max-w-6xl px-5">
          <h2 className="font-display text-4xl font-semibold tracking-tight sm:text-5xl">Visit us</h2>

          <div
            role="radiogroup"
            aria-label="Choose a store"
            className="mt-8 grid w-full grid-cols-2 gap-1 rounded-2xl border border-charcoal/10 bg-white p-1.5 shadow-sm sm:w-[460px]"
          >
            {LOCATIONS.map((loc) => {
              const active = loc.id === activeLocation;
              return (
                <button
                  key={loc.id}
                  role="radio"
                  aria-checked={active}
                  onClick={() => setActiveLocation(loc.id)}
                  className={`relative rounded-xl px-3 py-3 text-center transition-colors sm:px-5 ${
                    active ? "text-tile" : "text-charcoal hover:bg-tile/60"
                  }`}
                >
                  {active && (
                    <motion.span
                      layoutId="location-pill"
                      className="absolute inset-0 rounded-xl bg-forest shadow-[0_6px_16px_rgba(74,107,93,0.35)]"
                      transition={{ type: "spring", stiffness: 420, damping: 34 }}
                    />
                  )}
                  <span className="relative block truncate font-display text-[15px] font-semibold leading-tight sm:text-base">
                    {loc.name}
                  </span>
                  <span
                    className={`relative mt-0.5 block truncate text-xs ${active ? "text-tile/70" : "text-charcoal/50"}`}
                  >
                    {loc.street}
                  </span>
                </button>
              );
            })}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={location.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.28 }}
              className="mt-8 grid overflow-hidden rounded-3xl border border-charcoal/10 bg-white shadow-sm lg:grid-cols-2"
            >
              <div className="p-8 sm:p-10">
                <div className="flex flex-wrap items-center gap-3">
                  <h3 className="font-display text-3xl font-semibold">{location.name}</h3>
                  {isOpen !== null && (
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ${
                        isOpen ? "bg-sage/25 text-forest" : "bg-charcoal/10 text-charcoal/70"
                      }`}
                    >
                      <span className={`h-1.5 w-1.5 rounded-full ${isOpen ? "bg-forest" : "bg-charcoal/50"}`} />
                      {isOpen ? `Open now until ${todayRow?.close}` : "Closed right now"}
                    </span>
                  )}
                </div>

                <div className="mt-6 flex items-start gap-3 text-charcoal/80">
                  <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-sagedeep" />
                  <address className="not-italic leading-relaxed">
                    {location.addressLines.map((line) => (
                      <span key={line} className="block">{line}</span>
                    ))}
                    <span className="mt-1 block text-sm text-charcoal/55">{location.note}</span>
                  </address>
                </div>

                <div className="mt-6 flex items-start gap-3">
                  <Clock className="mt-0.5 h-5 w-5 shrink-0 text-sagedeep" />
                  <dl className="w-full max-w-sm text-sm">
                    {location.hours.map((row) => {
                      const isToday = clock ? row.days.includes(clock.day) : false;
                      return (
                        <div
                          key={row.label}
                          className={`flex justify-between rounded-lg px-3 py-2 ${
                            isToday ? "bg-tile font-medium text-charcoal" : "text-charcoal/65"
                          }`}
                        >
                          <dt>{row.label}{isToday && " (today)"}</dt>
                          <dd>{row.open} to {row.close}</dd>
                        </div>
                      );
                    })}
                  </dl>
                </div>

                <div className="mt-8 flex flex-wrap gap-3">
                  <a
                    href={mapsDirections}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 rounded-full bg-charcoal px-5 py-3 text-sm font-medium text-tile hover:bg-forest"
                  >
                    <Navigation className="h-4 w-4" />
                    Get directions
                  </a>
                  <a
                    href={PHONE_TEL}
                    className="flex items-center gap-2 rounded-full border border-charcoal/20 px-5 py-3 text-sm font-medium hover:border-forest hover:text-forest"
                  >
                    <Phone className="h-4 w-4" />
                    Call {PHONE_DISPLAY}
                  </a>
                </div>
              </div>

              <div className="relative min-h-[320px] bg-tile">
                <iframe
                  key={location.id}
                  title={`Map of SOHO CAFE ${location.name}`}
                  src={mapsEmbed}
                  className="absolute inset-0 h-full w-full grayscale-[35%]"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* ----------------------------- Reviews --------------------------- */}
      <section id="reviews" className="scroll-mt-20 bg-white py-24">
        <div className="mx-auto max-w-6xl px-5">
          <h2 className="font-display text-4xl font-semibold tracking-tight sm:text-5xl">What regulars say</h2>
          <div className="mt-12 grid gap-10 md:grid-cols-3">
            {REVIEWS.map((r) => (
              <figure key={r.name} className="border-l-2 border-sage pl-6">
                <div className="flex gap-0.5 text-wood" aria-label="5 out of 5 stars">
                  {Array.from({ length: 5 }, (_, i) => (
                    <Star key={i} className="h-4 w-4 fill-current" />
                  ))}
                </div>
                <blockquote className="mt-4 text-lg leading-relaxed text-charcoal/85">{r.quote}</blockquote>
                <figcaption className="mt-4 text-sm text-charcoal/55">
                  {r.name}, {r.where}
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* ----------------------------- Footer ---------------------------- */}
      <footer className="bg-charcoal py-14 text-tile/70">
        <div className="mx-auto grid max-w-6xl gap-10 px-5 md:grid-cols-3">
          <div>
            <img src="/soho-logo-light.png" alt="SOHO CAFE" className="h-24 w-auto" />
            <p className="mt-3 text-sm">100% halaal certified. Specialty coffee, all-day breakfast and woodfired Neapolitan pizza.</p>
          </div>
          {LOCATIONS.map((loc) => (
            <div key={loc.id} className="text-sm">
              <p className="font-display text-base font-medium text-tile">{loc.name}</p>
              {loc.addressLines.map((line) => (
                <p key={line}>{line}</p>
              ))}
              <a href={PHONE_TEL} className="mt-2 inline-block hover:text-sage">{PHONE_DISPLAY}</a>
            </div>
          ))}
        </div>
        <p className="mx-auto mt-12 max-w-6xl px-5 text-xs text-tile/40">
          © {new Date().getFullYear()} SOHO CAFE. All rights reserved.
        </p>
      </footer>

      {/* ---------------------- Mobile order bar ------------------------- */}
      <div className="fixed inset-x-3 bottom-3 z-40 grid grid-cols-3 gap-2 rounded-2xl bg-charcoal/95 p-2 shadow-2xl backdrop-blur md:hidden">
        <a href={UBER_EATS_URL} target="_blank" rel="noopener noreferrer" className="rounded-xl py-2.5 text-center text-xs font-medium text-tile hover:bg-white/10">
          Uber Eats
        </a>
        <a href={MR_D_URL} target="_blank" rel="noopener noreferrer" className="rounded-xl py-2.5 text-center text-xs font-medium text-tile hover:bg-white/10">
          Mr D
        </a>
        <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-1.5 rounded-xl bg-sage py-2.5 text-xs font-semibold text-charcoal">
          <MessageCircle className="h-3.5 w-3.5" />
          WhatsApp
        </a>
      </div>
    </main>
  );
}
