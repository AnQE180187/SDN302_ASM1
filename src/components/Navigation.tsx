"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShoppingCart, Search, LogOut, User } from "lucide-react";
import { useSession, signOut } from "next-auth/react";

export default function Navigation() {
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const isAuthenticated = status === "authenticated";

  const handleLogout = async () => {
    await signOut({ callbackUrl: "/" });
  };

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
                StyleHub
              </span>
            </Link>
          </div>

          <div className="flex-1 max-w-2xl mx-8">
            <div className="relative">
              {" "}
              <input
                type="text"
                placeholder="Search products..."
                className="w-full px-4 py-2 rounded-lg border border-gray-200 text-black focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <Search className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <Link
              href="/"
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                pathname === "/"
                  ? "bg-blue-100 text-blue-700"
                  : "text-gray-600 hover:text-blue-700 hover:bg-blue-50"
              }`}
            >
              All Products
            </Link>

            {isAuthenticated ? (
              <>
                {" "}
                <Link
                  href="/profile"
                  className="px-4 py-2 rounded-lg text-sm font-medium bg-blue-100 text-blue-700 hover:bg-blue-200 transition-colors duration-200 flex items-center space-x-2"
                >
                  <User className="w-4 h-4" />
                  <span>
                    {session.user?.name ? `${session.user.name}` : "My Profile"}
                  </span>
                </Link>{" "}
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 rounded-lg text-sm font-medium text-gray-600 hover:text-red-700 hover:bg-red-50 transition-colors duration-200 flex items-center space-x-2"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/auth/login"
                  className="px-4 py-2 rounded-lg text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 transition-colors duration-200"
                >
                  Login
                </Link>
                <Link
                  href="/auth/register"
                  className="px-4 py-2 rounded-lg text-sm font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors duration-200"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
