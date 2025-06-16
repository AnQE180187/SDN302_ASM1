"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShoppingCart, LogOut, User } from "lucide-react";
import { useSession, signOut } from "next-auth/react";

export default function Navigation() {
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const isAuthenticated = status === "authenticated";

  const handleLogout = async () => {
    await signOut({ callbackUrl: "/" });
  };

  return (
    <nav className="bg-white shadow-sm fixed top-0 left-0 right-0 z-50 border-b border-green-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center shadow-inner">
              <ShoppingCart className="w-5 h-5 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-green-600 to-green-400 bg-clip-text text-transparent">
              GreenCart
            </span>
          </Link>

          {/* Nav links */}
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${pathname === "/"
                ? "bg-green-100 text-green-700 font-semibold"
                : "text-gray-600 hover:text-green-700 hover:bg-green-50"
                }`}
            >
              All Products
            </Link>

            {isAuthenticated ? (
              <>
                <Link
                  href="/profile"
                  className="px-4 py-2 rounded-lg text-sm font-medium text-green-700 bg-green-100 hover:bg-green-200 transition-all duration-200 flex items-center gap-2"
                >
                  <User className="w-4 h-4" />
                  <span>{session.user?.name || "My Profile"}</span>
                </Link>

                <button
                  onClick={handleLogout}
                  className="px-4 py-2 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-all duration-200 flex items-center gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/auth/login"
                  className="px-4 py-2 rounded-lg text-sm font-medium bg-green-600 text-white hover:bg-green-700 transition-all duration-200"
                >
                  Login
                </Link>
                <Link
                  href="/auth/register"
                  className="px-4 py-2 rounded-lg text-sm font-medium bg-green-100 text-green-800 hover:bg-green-200 transition-all duration-200"
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
