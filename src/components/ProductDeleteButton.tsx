"use client";

import { Trash2 } from "lucide-react";

export default function ProductDeleteButton({ productId }: { productId: string }) {
  const handleDelete = async () => {
    if (confirm("Are you sure you want to delete this product?")) {
      await fetch(`/api/products/${productId}`, { method: "DELETE" });
      window.location.reload();
    }
  };

  return (
    <button
      type="button"
      onClick={handleDelete}
      className="inline-flex items-center justify-center px-3 py-1 border border-transparent rounded-md shadow-sm text-xs font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 w-full"
    >
      <Trash2 className="w-4 h-4 mr-1" />
      Delete
    </button>
  );
} 