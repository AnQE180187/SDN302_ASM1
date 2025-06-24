"use client";

import Link from "next/link";
import Image from "next/image";
import { ShoppingBag, Check } from "lucide-react";
import AddToCartButton from "./AddToCartButton";

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    description: string;
    price: number;
    image?: string | null;
    userId: string;
    createdAt: Date;
    updatedAt: Date;
    user?: {
      id: string;
      name?: string | null;
      email: string;
    };
  };
  isOwner?: boolean;
}

export default function ProductCard({ product, isOwner }: ProductCardProps) {
  return (
    <div className="group bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-300">
      <div className="relative aspect-square w-full">
        {/* Product Image */}
        {product.image ? (
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="w-full h-full bg-gray-100 flex items-center justify-center">
            <ShoppingBag className="h-12 w-12 text-gray-400" />
          </div>
        )}

        {/* In Stock Indicator */}
        <div className="absolute top-2 right-2">
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <Check className="w-3 h-3 mr-1" />
            In Stock
          </span>
        </div>
      </div>

      <div className="p-4">
        <h3 className="font-semibold text-gray-800 mb-1 truncate">
          {product.name}
        </h3>
        <p className="text-gray-600 text-sm mb-2 line-clamp-2">
          {product.description}
        </p>
        <div className="flex justify-between items-center mb-4">
          <span className="font-bold text-blue-600">
            ${product.price.toFixed(2)}
          </span>
        </div>

        {/* Action buttons - View Details first, then Add to Cart */}
        <div className="space-y-2">
          {/* View Details Button */}
          <Link
            href={`/products/${product.id}`}
            className="block w-full text-center py-2 px-4 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg font-medium transition-colors duration-200"
          >
            View Details
          </Link>

          {/* Add to Cart Button - BELOW View Details as required */}
          <div>
            <AddToCartButton product={product} isOwner={isOwner} />
          </div>
        </div>
      </div>
    </div>
  );
}
