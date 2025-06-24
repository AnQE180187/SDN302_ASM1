"use client";

import { useCart } from "@/contexts/CartContext";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { ShoppingBag, Plus, Minus, Package } from "lucide-react";

export default function CartPage() {  const { data: session } = useSession();
  const { state, updateQuantity } = useCart();
  const { items, total, isLoading } = state;

  if (!session) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-3xl font-bold mb-4 text-gray-900">Your Cart</h1>
            <p className="text-gray-600 mb-6">
              Please log in to view your cart.
            </p>
            <Link
              href="/auth/login"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition duration-300 inline-block"
            >
              Login
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-3xl font-bold mb-4 text-gray-900">Your Cart</h1>
            <p className="text-gray-600">Loading your cart...</p>
          </div>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <ShoppingBag className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <h1 className="text-3xl font-bold mb-4 text-gray-900">
              Your cart is empty
            </h1>
            <p className="text-gray-600 mb-6">
              Looks like you haven&apos;t added anything to your cart yet.
            </p>
            <Link
              href="/"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition duration-300 inline-block"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold mb-8 text-gray-900">Your Cart</h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex flex-col lg:flex-row items-center gap-4 p-6 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition duration-300"
                >
                  <div className="relative w-24 h-24 bg-gray-50 rounded-lg overflow-hidden">
                    <Image
                      src={item.image || "/placeholder.png"}
                      alt={item.name}
                      fill
                      className="object-cover"
                    />
                  </div>                  <div className="flex-grow text-center lg:text-left">
                    <h3 className="font-semibold text-lg text-black">
                      {item.name}
                    </h3>
                    <p className="text-black font-medium mt-1">
                      ${item.price.toFixed(2)}
                    </p>
                  </div>

                  <div className="flex items-center justify-center gap-4 mt-3">
                    <div className="flex items-center border rounded-lg bg-gray-50">
                      <button
                        onClick={() =>
                          updateQuantity(item.id, item.quantity - 1)
                        }
                        className="p-2 hover:bg-gray-100 transition rounded-l-lg text-black"
                        disabled={item.quantity <= 1}
                      >
                        <Minus className="w-4 h-4 text-black" />
                      </button>
                      <span className="px-4 py-2 font-medium text-black">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          updateQuantity(item.id, item.quantity + 1)
                        }
                        className="p-2 hover:bg-gray-100 transition rounded-r-lg text-black"
                      >
                        <Plus className="w-4 h-4 text-black" />
                      </button>
                    </div>
                  </div>                  <div className="text-right">
                    <p className="text-lg font-bold text-black">
                      ${(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
            </div>            {/* Order Summary */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-fit">
              <h2 className="text-xl font-semibold mb-4 text-gray-800">
                Order Summary
              </h2>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span className="text-black">Subtotal</span>
                  <span className="font-medium text-black">
                    ${total.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-black">Shipping</span>
                  <span className="font-medium text-black">Free</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold text-black">Total</span>
                  <span className="font-bold text-blue-600">
                    ${total.toFixed(2)}
                  </span>
                </div>
              </div>

              <Link
                href="/checkout"
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition duration-300 flex items-center justify-center"
              >
                <Package className="mr-2 h-5 w-5" />
                Proceed to Checkout
              </Link>

              <Link
                href="/"
                className="block w-full text-center mt-4 text-gray-600 hover:text-gray-800 transition duration-300"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
