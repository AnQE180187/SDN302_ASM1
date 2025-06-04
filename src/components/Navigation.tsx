"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShoppingCart, Plus, Search } from "lucide-react";

export default function Navigation() {
  const pathname = usePathname();

  return (
    <nav className="bg-white shadow-md fixed top-0 left-0 right-0 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                <ShoppingCart className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
                Shopping Site
              </span>
            </Link>
          </div>

          <div className="flex-1 max-w-2xl mx-8">
            {/* <div className="relative">
              <input
                type="text"
                placeholder="Search products..."
                className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <Search className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
            </div> */}
          </div>

          <div className="flex items-center space-x-4">
            {/* <Link
              href="/"
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${pathname === "/"
                  ? "bg-blue-100 text-blue-700"
                  : "text-gray-600 hover:text-blue-700 hover:bg-blue-50"
                }`}
            >
              All Products
            </Link> */}
            {/* <Link
              href="/products/add"
              className="px-4 py-2 rounded-lg text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 transition-colors duration-200 flex items-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>Add Product</span>
            </Link> */}
          </div>
        </div>
      </div>
    </nav>
  );
}
