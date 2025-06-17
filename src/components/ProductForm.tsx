"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import Image from "next/image";
import { useSession } from "next-auth/react";

interface ProductFormProps {
  product?: {
    id: string;
    name: string;
    description: string;
    price: number;
    image?: string | null;
    userId?: string;
  };
  mode: "add" | "edit";
}

export default function ProductForm({ product, mode }: ProductFormProps) {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(
    product?.image || null
  );

  // Check if user is authenticated
  useEffect(() => {
    if (status === "unauthenticated") {
      toast.error("You must be logged in to manage products");
      router.push("/auth/login");
    }

    // For edit mode, check if the user owns the product
    if (
      mode === "edit" &&
      status === "authenticated" &&
      product?.userId &&
      product.userId !== session?.user?.id
    ) {
      toast.error("You can only edit your own products");
      router.push("/");
    }
  }, [status, router, mode, product, session]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Double-check authentication
    if (!session) {
      toast.error("You must be logged in to manage products");
      return;
    }

    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get("name"),
      description: formData.get("description"),
      price: parseFloat(formData.get("price") as string),
      image: imagePreview,
    };

    try {
      const response = await fetch(
        mode === "add" ? "/api/products" : `/api/products/${product?.id}`,
        {
          method: mode === "add" ? "POST" : "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Something went wrong");
      }

      toast.success(
        mode === "add"
          ? "Product added successfully"
          : "Product updated successfully"
      );
      router.push("/");
      router.refresh();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="form-group">
        <label htmlFor="name" className="form-label">
          Product Name
        </label>
        <input
          type="text"
          name="name"
          id="name"
          required
          defaultValue={product?.name}
          className="input-field w-full"
        />
      </div>

      <div className="form-group">
        <label htmlFor="description" className="form-label">
          Description
        </label>
        <textarea
          name="description"
          id="description"
          required
          rows={4}
          defaultValue={product?.description}
          className="input-field w-full"
        />
      </div>

      <div className="form-group">
        <label htmlFor="price" className="form-label">
          Price
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <span className="text-gray-500 dark:text-gray-400">$</span>
          </div>
          <input
            type="number"
            name="price"
            id="price"
            required
            min="0"
            step="0.01"
            defaultValue={product?.price}
            className="input-field w-full pl-7"
          />
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="image" className="form-label">
          Product Image
        </label>
        <div className="flex items-center space-x-4">
          <input
            type="file"
            name="image"
            id="image"
            accept="image/*"
            onChange={handleImageChange}
            className="block w-full text-sm text-gray-600 dark:text-gray-300
              file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0
              file:text-sm file:font-medium file:bg-green-50 file:text-green-700
              dark:file:bg-green-900 dark:file:text-green-300
              hover:file:bg-green-100 dark:hover:file:bg-green-800
              transition-colors duration-200"
          />
          {imagePreview && (
            <div className="relative w-20 h-20">
              <Image
                width={48}
                height={48}
                src={imagePreview}
                alt="Preview"
                className="w-full h-full object-cover rounded-md"
              />
              <button
                type="button"
                onClick={() => setImagePreview(null)}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors duration-200"
              >
                ×
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-end space-x-4">
        <button
          type="button"
          onClick={() => router.back()}
          className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300
            bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600
            rounded-md hover:bg-gray-50 dark:hover:bg-gray-600
            focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500
            transition-colors duration-200"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="btn-primary px-4 py-2 text-sm font-medium flex items-center"
        >
          {loading ? (
            <span className="flex items-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Saving...
            </span>
          ) : mode === "add" ? (
            "Add Product"
          ) : (
            "Update Product"
          )}
        </button>
      </div>
    </form>
  );
}
