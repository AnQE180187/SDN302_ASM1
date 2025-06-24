"use client";

import { useState } from "react";
import { useCart } from "@/contexts/CartContext";
import { useSession } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";
import { ShoppingBag, CreditCard, Check, ShieldCheck } from "lucide-react";

interface PaymentInfo {
  cardNumber: string;
  cardHolder: string;
  expiryDate: string;
  cvv: string;
}

export default function CheckoutPage() {
  const { data: session } = useSession();
  const { state, clearCart } = useCart();
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [orderId, setOrderId] = useState("");
  const [paymentInfo, setPaymentInfo] = useState<PaymentInfo>({
    cardNumber: "",
    cardHolder: "",
    expiryDate: "",
    cvv: "",
  });

  if (!session) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-3xl font-bold mb-4 text-gray-900">Checkout</h1>
            <p className="text-gray-600 mb-6">
              Please log in to proceed with checkout.
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

  if (state.items.length === 0 && !orderSuccess) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <ShoppingBag className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <h1 className="text-3xl font-bold mb-4 text-gray-900">
              Your cart is empty
            </h1>
            <p className="text-gray-600 mb-6">
              Add some products before checkout!
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

  if (orderSuccess) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <div className="mb-6">
              <div className="w-20 h-20 mx-auto bg-green-100 rounded-full flex items-center justify-center">
                <Check className="w-10 h-10 text-green-500" />
              </div>
            </div>
            <h1 className="text-3xl font-bold mb-4 text-gray-900">
              Order Successful!
            </h1>
            <p className="text-gray-600 mb-6">
              Your order #{orderId} has been placed successfully.
            </p>
            <Link
              href="/orders"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition duration-300 inline-block"
            >
              View Orders
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPaymentInfo((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (response.ok) {
        setOrderId(data.orderId);
        setOrderSuccess(true);
        clearCart();
      } else {
        throw new Error(data.error || "Failed to create order");
      }
    } catch (error) {
      console.error("Checkout error:", error);
      alert("Failed to process order. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold mb-8 text-gray-900">Checkout</h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Order Details */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
                <h2 className="text-2xl font-semibold mb-6 text-gray-800">
                  Order Summary
                </h2>
                <div className="space-y-4">
                  {state.items.map((item) => (
                    <div
                      key={item.id}
                      className="flex flex-col sm:flex-row items-center gap-4 py-4 border-b last:border-0"
                    >
                      <div className="relative w-24 h-24 bg-gray-50 rounded-lg overflow-hidden">
                        <Image
                          src={item.image || "/placeholder.png"}
                          alt={item.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-grow text-center sm:text-left mt-2 sm:mt-0">
                        <h3 className="font-medium text-black text-lg">{item.name}</h3>
                        <p className="text-black mt-1">
                          ${item.price.toFixed(2)} × {item.quantity}
                        </p>
                      </div>
                      <p className="font-semibold text-black text-lg">
                        ${(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Payment Information */}
              <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
                <h2 className="text-2xl font-semibold mb-6 text-gray-800">
                  Payment Information
                </h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="block text-base font-medium text-black mb-2">
                      Card Number
                    </label>
                    <input
                      type="text"
                      name="cardNumber"
                      value={paymentInfo.cardNumber}
                      onChange={handleInputChange}
                      placeholder="1234 5678 9012 3456"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg text-black placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-base font-medium text-black mb-2">
                      Card Holder Name
                    </label>
                    <input
                      type="text"
                      name="cardHolder"
                      value={paymentInfo.cardHolder}
                      onChange={handleInputChange}
                      placeholder="John Doe"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg text-black placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-base font-medium text-black mb-2">
                        Expiry Date
                      </label>
                      <input
                        type="text"
                        name="expiryDate"
                        value={paymentInfo.expiryDate}
                        onChange={handleInputChange}
                        placeholder="MM/YY"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg text-black placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-base font-medium text-black mb-2">
                        CVV
                      </label>
                      <input
                        type="text"
                        name="cvv"
                        value={paymentInfo.cvv}
                        onChange={handleInputChange}
                        placeholder="123"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg text-black placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>
                  </div>
                  <button
                    type="submit"
                    disabled={isProcessing}
                    className="w-full bg-blue-600 text-white py-4 rounded-lg font-medium hover:bg-blue-700 transition duration-300 disabled:bg-blue-400 flex items-center justify-center mt-6 text-lg"
                  >
                    {isProcessing ? (
                      "Processing..."
                    ) : (
                      <>
                        <CreditCard className="mr-2 h-5 w-5" />
                        Place Order
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>

            {/* Order Total */}
            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 h-fit">
              <h2 className="text-2xl font-semibold mb-6 text-gray-800">
                Order Total
              </h2>
              <div className="space-y-4 mb-6">
                <div className="flex justify-between items-center">
                  <span className="text-black text-base">Subtotal</span>
                  <span className="font-medium text-black text-base">
                    ${state.total.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-black text-base">Shipping</span>
                  <span className="font-medium text-black text-base">Free</span>
                </div>
                <div className="border-t pt-4 mt-4">
                  <div className="flex justify-between items-center mt-2">
                    <span className="font-semibold text-black text-lg">Total</span>
                    <span className="font-bold text-blue-600 text-xl">
                      ${state.total.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
              <div className="text-sm flex items-center border-t pt-5 mt-5">
                <ShieldCheck className="w-6 h-6 mr-2 text-green-600" />
                <span className="text-black">
                  Your payment information is secure
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
