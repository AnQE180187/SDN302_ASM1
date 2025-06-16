"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Pencil, Package, User, Plus } from "lucide-react";
import ProductDeleteButton from "@/components/ProductDeleteButton";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image?: string | null;
  userId: string;
}

interface UserProfile {
  id: string;
  name: string | null;
  email: string;
  createdAt: string;
  updatedAt: string;
  _count: {
    products: number;
  };
  productsStats: {
    totalCount: number;
    totalValue: number;
  };
}

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/login?callbackUrl=/profile");
    }

    if (status === "authenticated") {
      const fetchUserData = async () => {
        try {
          const profileResponse = await fetch("/api/user/profile");
          if (!profileResponse.ok) {
            throw new Error("Failed to fetch user profile");
          }
          const profileData = await profileResponse.json();
          setUserProfile(profileData.data);

          const productsResponse = await fetch("/api/products/user");
          if (!productsResponse.ok) {
            throw new Error("Failed to fetch products");
          }
          const productsData = await productsResponse.json();
          setProducts(productsData.data || []);
        } catch (error) {
          console.error("Error fetching user data:", error);
        } finally {
          setLoading(false);
        }
      };

      fetchUserData();
    }
  }, [status, router]);

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-xl shadow-sm overflow-hidden p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="bg-blue-100 rounded-full p-4 h-fit">
              <User className="h-16 w-16 text-blue-700" />
            </div>

            <div className="flex-1">
              <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900 mb-1">
                  {session.user?.name || "User Profile"}
                </h1>
                <p className="text-gray-600">{session.user?.email}</p>
              </div>

              {userProfile && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <div className="text-sm text-blue-700 font-medium mb-1">
                      Account Created
                    </div>
                    <div className="text-gray-800">
                      {new Date(userProfile.createdAt).toLocaleDateString()}
                    </div>
                  </div>

                  <div className="bg-green-50 p-4 rounded-lg">
                    <div className="text-sm text-green-700 font-medium mb-1">
                      Total Products
                    </div>
                    <div className="text-gray-800 font-semibold text-lg">
                      {userProfile.productsStats.totalCount}
                    </div>
                  </div>

                  <div className="bg-purple-50 p-4 rounded-lg">
                    <div className="text-sm text-purple-700 font-medium mb-1">
                      Total Value
                    </div>
                    <div className="text-gray-800 font-semibold text-lg">
                      ${userProfile.productsStats.totalValue.toFixed(2)}
                    </div>
                  </div>

                  <div className="bg-amber-50 p-4 rounded-lg">
                    <div className="text-sm text-amber-700 font-medium mb-1">
                      Last Updated
                    </div>
                    <div className="text-gray-800">
                      {new Date(userProfile.updatedAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="mb-6 flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-900">My Products</h2>
          <Link
            href="/products/add"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add New Product
          </Link>
        </div>

        {products.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              You haven&apos;t added any products yet
            </h3>
            <p className="text-gray-500 mb-6">
              Start selling by adding your first product
            </p>
            <Link
              href="/products/add"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
            >
              Add Your First Product
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <div
                key={product.id}
                className="group bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden flex flex-col"
              >
                <Link href={`/products/${product.id}`} className="block">
                  <div className="relative w-full pt-[100%]">
                    {product.image ? (
                      <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-200"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                    ) : (
                      <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
                        <Package className="h-12 w-12 text-gray-400" />
                      </div>
                    )}
                  </div>
                </Link>
                <div className="p-4 flex-1 flex flex-col">
                  <Link href={`/products/${product.id}`} className="block">
                    <div className="flex items-start justify-between gap-2">
                      <h2 className="text-lg font-semibold text-gray-900 line-clamp-2">
                        {product.name}
                      </h2>
                      <p className="text-lg font-bold text-blue-600 whitespace-nowrap">
                        ${product.price.toFixed(2)}
                      </p>
                    </div>
                    <p className="text-gray-600 text-sm line-clamp-2 mt-2">
                      {product.description}
                    </p>
                  </Link>

                  <div className="flex gap-2 mt-4">
                    <Link
                      href={`/products/${product.id}/edit`}
                      className="flex-1 inline-flex items-center justify-center px-3 py-1 border border-gray-300 rounded-md shadow-sm text-xs font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      <Pencil className="w-4 h-4 mr-1" />
                      Edit
                    </Link>
                    <div className="flex-1">
                      <ProductDeleteButton
                        productId={product.id}
                        userId={product.userId}
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
