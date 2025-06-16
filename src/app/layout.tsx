import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navigation from "@/components/Navigation";
import { Toaster } from "react-hot-toast";
import NextAuthProvider from "@/components/NextAuthProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Clothing Store",
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
          <Navigation />
          <main className="pt-16">{children}</main>
          <Toaster position="top-right" />
        </NextAuthProvider>
      </body>
    </html>
  );
}
