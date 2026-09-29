import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "SOHO CAFE | Specialty Coffee, All Day Breakfast & Neapolitan Pizza",
  description:
    "SOHO CAFE is a 100% halaal certified coffee bar serving specialty coffee, all-day breakfast and woodfired Neapolitan pizza on Marine Drive, Umhlanga Rocks and Corlett Drive, Sandton.",
  keywords: [
    "SOHO CAFE",
    "halaal cafe Umhlanga",
    "halaal restaurant Sandton",
    "specialty coffee Umhlanga",
    "all day breakfast Durban",
    "Neapolitan pizza Umhlanga",
    "woodfired pizza Sandton",
    "Illovo coffee shop",
  ],
  openGraph: {
    title: "SOHO CAFE | Specialty Coffee, All Day Breakfast & Neapolitan Pizza",
    description:
      "100% halaal certified. Specialty coffee, all-day breakfast and woodfired Neapolitan pizza in Umhlanga Rocks and Sandton.",
    type: "website",
    locale: "en_ZA",
    siteName: "SOHO CAFE",
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#1C1C1C",
  width: "device-width",
  initialScale: 1,
};

const tailwindConfig = `
tailwind.config = {
  theme: {
    extend: {
      colors: {
        sage: "#8DA493",
        sagedeep: "#709080",
        tile: "#E2E8E4",
        charcoal: "#1C1C1C",
        wood: "#D0B49F",
        forest: "#4A6B5D",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        display: ["Outfit", "system-ui", "sans-serif"],
      },
    },
  },
};
`;

const ambientCss = `
html { scroll-behavior: smooth; }
body { background: #E2E8E4; }

/* Metro subway tile textures */
.tile-light {
  background-color: #E2E8E4;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='84' height='42'%3E%3Cg fill='none' stroke='%23c5d0c9' stroke-width='1.4'%3E%3Cpath d='M0 0.7H84M0 21.7H84M0.7 0V21M42.7 21V42'/%3E%3C/g%3E%3C/svg%3E");
}
.tile-sage {
  background-color: #8DA493;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='84' height='42'%3E%3Cg fill='none' stroke='%23a3b7a8' stroke-width='1.6'%3E%3Cpath d='M0 0.8H84M0 21.8H84M0.8 0V21M42.8 21V42'/%3E%3C/g%3E%3C/svg%3E");
}

/* Warm back-lit halo signage */
.halo-text {
  color: #FFF6EA;
  text-shadow: 0 0 10px rgba(255, 214, 160, 0.55), 0 0 28px rgba(255, 190, 120, 0.35);
}
.halo-ring {
  box-shadow: 0 0 0 1px rgba(255, 220, 180, 0.15), 0 0 40px 6px rgba(255, 196, 130, 0.35), 0 0 120px 20px rgba(255, 180, 110, 0.18);
}

/* Rising coffee vapour */
@keyframes steam-rise {
  0%   { transform: translateY(14px) scaleX(0.9); opacity: 0; }
  20%  { opacity: 0.85; }
  60%  { transform: translateY(-26px) scaleX(1.25); opacity: 0.5; }
  100% { transform: translateY(-64px) scaleX(1.6); opacity: 0; }
}
.steam {
  transform-box: fill-box;
  transform-origin: center bottom;
  animation: steam-rise 4.8s ease-out infinite;
  filter: blur(2.5px);
}

@media (prefers-reduced-motion: reduce) {
  html { scroll-behavior: auto; }
  .steam { animation: none; opacity: 0.45; }
}

:focus-visible { outline: 2px solid #4A6B5D; outline-offset: 3px; border-radius: 6px; }
`;

const structuredData = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "SOHO CAFE",
  telephone: "+27827680786",
  department: [
    {
      "@type": "CafeOrCoffeeShop",
      name: "SOHO CAFE Umhlanga Rocks",
      servesCuisine: ["Coffee", "Breakfast", "Pizza", "Halaal"],
      telephone: "+27827680786",
      address: {
        "@type": "PostalAddress",
        streetAddress: "Shop 1, 30 Marine Drive",
        addressLocality: "Umhlanga Rocks",
        addressRegion: "KwaZulu-Natal",
        postalCode: "4319",
        addressCountry: "ZA",
      },
    },
    {
      "@type": "CafeOrCoffeeShop",
      name: "SOHO CAFE Sandton",
      servesCuisine: ["Coffee", "Breakfast", "Pizza", "Halaal"],
      telephone: "+27827680786",
      address: {
        "@type": "PostalAddress",
        streetAddress: "3 Corlett Drive, Illovo",
        addressLocality: "Sandton",
        addressRegion: "Gauteng",
        addressCountry: "ZA",
      },
    },
  ],
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en-ZA" suppressHydrationWarning>
      <head>
        <script src="https://cdn.tailwindcss.com"></script>
        <script dangerouslySetInnerHTML={{ __html: tailwindConfig }} />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&family=Outfit:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <style dangerouslySetInnerHTML={{ __html: ambientCss }} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </head>
      <body className="font-sans text-charcoal antialiased" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
