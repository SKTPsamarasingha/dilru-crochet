import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";
import Providers from "@/components/Providers";

const playfair = Playfair_Display({
  variable: "--font-serif",
  subsets: ["latin"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

export const metadata = {
  title: "Crochet with Dilru | Handcrafted Crochet Boutique",
  description: "Premium custom-order crochet cardigans, accessories, and gifts made completely by hand. Stitched with love.",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${playfair.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#FFF8F2] text-[#2B2B2B] font-sans">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

