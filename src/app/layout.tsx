import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import MainNavigation from "@/components/MainNavigation";
import { Toaster } from "react-hot-toast";
import NextAuthProvider from "@/components/NextAuthProvider";
import { CartProvider } from "@/contexts/CartContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "E-Shop - Clothing Store",
  description: "A modern e-commerce platform for clothing products",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <NextAuthProvider>
          <CartProvider>
            <MainNavigation />
            <main className="pt-16">{children}</main>
            <Toaster position="top-right" />
          </CartProvider>
        </NextAuthProvider>
      </body>
    </html>
  );
}
