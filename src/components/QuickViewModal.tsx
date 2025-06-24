"use client";

import Image from "next/image";
import { X, ShoppingBag } from "lucide-react";
import AddToCartButton from "./AddToCartButton";

interface QuickViewModalProps {
  product: {
    id: string;
    name: string;
    description: string;
    price: number;
    image?: string | null;
    userId: string;
  };
  isOpen: boolean;
  onClose: () => void;
  isOwner?: boolean;
}

export default function QuickViewModal({
  product,
  isOpen,
  onClose,
  isOwner,
}: QuickViewModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-auto flex bg-black bg-opacity-50">
      <div className="relative p-6 bg-white w-full max-w-3xl m-auto rounded-lg">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
        >
          <X className="h-6 w-6" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="relative aspect-square w-full rounded-lg bg-gray-100">
            {product.image ? (
              <Image
                src={product.image}
                alt={product.name}
                fill
                className="object-cover rounded-lg"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <ShoppingBag className="h-16 w-16 text-gray-400" />
              </div>
            )}
          </div>

          <div>
            {" "}
            <h2 className="text-xl font-bold text-gray-900 mb-2">
              {product.name}
            </h2>
            <p className="text-2xl font-bold text-blue-600 mb-4">
              ${product.price.toFixed(2)}
            </p>
            <p className="text-gray-600 mb-6">{product.description}</p>
            <div className="space-y-3">
              <AddToCartButton product={product} isOwner={isOwner} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
