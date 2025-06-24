"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";
import {
  Package,
  Calendar,
  AlertCircle,
  Check,
  ChevronRight,
} from "lucide-react";

interface OrderItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image?: string | null;
}

interface Order {
  id: string;
  totalAmount: number;
  status: string;
  createdAt: string;
  items: OrderItem[];
}

// Helper function to format date
function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);
}

// Status badge component
function StatusBadge({ status }: { status: string }) {
  let bgColor = "bg-gray-100";
  let textColor = "text-gray-800";
  let icon = <AlertCircle className="w-4 h-4 mr-1" />;

  switch (status.toUpperCase()) {
    case "PAID":
      bgColor = "bg-green-100";
      textColor = "text-green-800";
      icon = <Check className="w-4 h-4 mr-1" />;
      break;
    case "SHIPPED":
      bgColor = "bg-blue-100";
      textColor = "text-blue-800";
      icon = <Package className="w-4 h-4 mr-1" />;
      break;
    case "DELIVERED":
      bgColor = "bg-purple-100";
      textColor = "text-purple-800";
      icon = <Check className="w-4 h-4 mr-1" />;
      break;
    case "CANCELLED":
      bgColor = "bg-red-100";
      textColor = "text-red-800";
      icon = <AlertCircle className="w-4 h-4 mr-1" />;
      break;
  }

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${bgColor} ${textColor}`}
    >
      {icon}
      {status}
    </span>
  );
}

export default function OrdersPage() {
  const { data: session } = useSession();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);

  useEffect(() => {
    if (session?.user) {
      fetchOrders();
    } else {
      setIsLoading(false);
    }
  }, [session]);

  const fetchOrders = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/orders");

      if (!response.ok) {
        throw new Error("Failed to fetch orders");
      }

      const data = await response.json();
      setOrders(data);
      setError(null);
    } catch (error) {
      console.error("Error fetching orders:", error);
      setError("Failed to load orders. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const toggleOrderDetails = (orderId: string) => {
    if (expandedOrderId === orderId) {
      setExpandedOrderId(null);
    } else {
      setExpandedOrderId(orderId);
    }
  };

  if (!session) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-3xl font-bold mb-4 text-gray-900">
              Your Orders
            </h1>
            <p className="text-gray-600 mb-6">
              Please log in to view your orders.
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
            <h1 className="text-3xl font-bold mb-4 text-gray-900">
              Your Orders
            </h1>
            <p className="text-gray-600">Loading your orders...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <AlertCircle className="w-16 h-16 mx-auto text-red-500 mb-4" />
            <h1 className="text-3xl font-bold mb-4 text-gray-900">Error</h1>
            <p className="text-gray-600 mb-6">{error}</p>
            <button
              onClick={fetchOrders}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition duration-300"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <Package className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <h1 className="text-3xl font-bold mb-4 text-gray-900">
              No orders yet
            </h1>
            <p className="text-gray-600 mb-6">
              You haven&apos;t placed any orders yet.
            </p>
            <Link
              href="/"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition duration-300 inline-block"
            >
              Start Shopping
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
          <h1 className="text-3xl font-bold mb-8 text-gray-900">Your Orders</h1>

          <div className="space-y-6">
            {orders.map((order) => (
              <div
                key={order.id}
                className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
              >
                {/* Order header */}
                <div
                  className="p-6 cursor-pointer hover:bg-gray-50 transition-colors"
                  onClick={() => toggleOrderDetails(order.id)}
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <h3 className="text-lg font-semibold text-gray-800">
                          Order #{order.id.substring(0, 8)}
                        </h3>
                        <StatusBadge status={order.status} />
                      </div>

                      <div className="flex flex-wrap gap-x-6 gap-y-1 text-sm text-gray-500">
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 mr-1 text-gray-400" />
                          {formatDate(order.createdAt)}
                        </div>
                        <div className="flex items-center">
                          <Package className="w-4 h-4 mr-1 text-gray-400" />
                          {order.items.length}{" "}
                          {order.items.length === 1 ? "item" : "items"}
                        </div>
                        <div className="font-medium text-blue-600">
                          ${order.totalAmount.toFixed(2)}
                        </div>
                      </div>
                    </div>

                    <ChevronRight
                      className={`w-5 h-5 text-gray-400 transform transition-transform duration-200 ${
                        expandedOrderId === order.id ? "rotate-90" : ""
                      }`}
                    />
                  </div>
                </div>

                {/* Order details (expanded view) */}
                {expandedOrderId === order.id && (
                  <div className="border-t border-gray-100">
                    <div className="p-6 space-y-4">
                      <h4 className="font-medium text-gray-700">Order Items</h4>

                      <div className="space-y-4">
                        {order.items.map((item) => (
                          <div
                            key={item.id}
                            className="flex items-center gap-4"
                          >
                            <div className="relative w-16 h-16 bg-gray-50 rounded-lg overflow-hidden">
                              <Image
                                src={item.image || "/placeholder.png"}
                                alt={item.name}
                                fill
                                className="object-cover"
                              />
                            </div>

                            <div className="flex-grow">
                              <h5 className="font-medium text-gray-800">
                                {item.name}
                              </h5>
                              <p className="text-sm text-gray-600">
                                ${item.price.toFixed(2)} × {item.quantity}
                              </p>
                            </div>

                            <div className="text-right">
                              <span className="font-semibold">
                                ${(item.price * item.quantity).toFixed(2)}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="border-t pt-4 mt-4">
                        <div className="flex justify-between font-medium">
                          <span>Total</span>
                          <span className="font-bold text-blue-600">
                            ${order.totalAmount.toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="mt-8 text-center">
            <Link
              href="/"
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
