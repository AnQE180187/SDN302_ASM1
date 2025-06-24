"use client";

import { useState } from "react";
import { useCart } from "@/contexts/CartContext";
import { useSession } from "next-auth/react";
import { ShoppingCart, Check } from "lucide-react";
import Link from "next/link";

interface AddToCartButtonProps {
  product: {
    id: string;
    name: string;
    price: number;
    image?: string | null;
    userId?: string;
  };
  isOwner?: boolean;
}

export default function AddToCartButton({
  product,
  isOwner,
}: AddToCartButtonProps) {
  const { data: session } = useSession();
  const { addToCart } = useCart();
  const [isAdding, setIsAdding] = useState(false);
  const [justAdded, setJustAdded] = useState(false);

  if (isOwner) {
    return (
      <div className="space-y-2">
        <p className="text-sm text-gray-600 text-center">
          This is your product
        </p>{" "}
        <div className="w-full bg-gray-300 text-gray-600 py-2 px-4 rounded-lg font-semibold text-center cursor-not-allowed">
          Cannot Add Own Product
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="space-y-2">
        <p className="text-sm text-gray-600">Please log in to add to cart</p>{" "}
        <Link
          href="/auth/login"
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-blue-700 transition-all duration-300 flex items-center justify-center shadow-sm hover:shadow-md"
        >
          Login to Purchase
        </Link>
      </div>
    );
  }
  const handleAddToCart = async () => {
    if (isAdding || justAdded) return;

    setIsAdding(true);
    try {
      await addToCart({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image || undefined,
      });
      setJustAdded(true);
      setTimeout(() => setJustAdded(false), 2000);
    } catch (error) {
      console.error("Failed to add to cart:", error);
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
          Available
        </span>
      </div>
      <button
        onClick={handleAddToCart}
        disabled={isAdding || justAdded}
        className={`w-full py-2 px-4 rounded-lg font-semibold flex items-center justify-center shadow-sm transition-all duration-300 hover:shadow-md ${
          justAdded
            ? "bg-green-600 text-white hover:bg-green-700"
            : "bg-blue-600 text-white hover:bg-blue-700 hover:scale-[1.02]"
        }`}
      >
        {isAdding ? (
          "Adding..."
        ) : justAdded ? (
          <>
            <Check className="w-5 h-5 mr-2" />
            Added to Cart
          </>
        ) : (
          <>
            <ShoppingCart className="w-5 h-5 mr-2" />
            Add to Cart
          </>
        )}
      </button>
    </div>
  );
}
