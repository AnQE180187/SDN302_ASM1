import { prisma } from "@/utils/prisma";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Pencil, ArrowLeft, ShoppingBag, Check } from "lucide-react";
import ProductDeleteButton from "@/components/ProductDeleteButton";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/utils/auth";
import AddToCartButton from "@/components/AddToCartButton";

interface ProductDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function ProductDetailPage({
  params,
}: ProductDetailPageProps) {
  const { id } = await params;
  const session = await getServerSession(authOptions);

  const product = await prisma.product.findUnique({
    where: {
      id,
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });

  if (!product) {
    notFound();
  }

  // Check if current user is the owner of the product
  const isOwner = session?.user?.id === product.userId;

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6">
            <Link
              href="/"
              className="inline-flex items-center text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Products
            </Link>
          </div>

          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-2">
              {/* Image Section with gradient overlay */}
              <div className="relative aspect-square w-full bg-gradient-to-br from-blue-50 to-white p-6">
                {product.image ? (
                  <div className="relative w-full h-full rounded-lg overflow-hidden shadow-xl transform transition-transform duration-300 hover:scale-105">
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                  </div>
                ) : (
                  <div className="w-full h-full bg-white rounded-lg flex items-center justify-center shadow-inner">
                    <ShoppingBag className="w-20 h-20 text-blue-300" />
                  </div>
                )}
              </div>

              <div className="flex flex-col p-8">
                <div className="flex-1">
                  <div className="flex flex-col space-y-4">
                    <h1 className="text-3xl font-bold text-gray-900">
                      {product.name}
                    </h1>

                    <div className="flex items-center space-x-2">
                      <span className="text-3xl font-bold text-blue-600">
                        ${product.price.toFixed(2)}
                      </span>
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                        <Check className="w-4 h-4 mr-1" />
                        In Stock
                      </span>
                    </div>

                    <div className="border-t border-b border-gray-100 py-4 my-4">
                      <p className="text-gray-600 leading-relaxed">
                        {product.description}
                      </p>
                    </div>

                    {product.user && (
                      <div className="flex items-center space-x-2 text-sm text-gray-500">
                        <span>Seller:</span>
                        <span className="font-medium text-gray-900">
                          {product.user.name || product.user.email}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-gray-100">
                  {isOwner ? (
                    <div className="flex gap-4">
                      <Link
                        href={`/products/${product.id}/edit`}
                        className="flex-1 inline-flex items-center justify-center px-6 py-3 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 hover:border-gray-400 transition-colors duration-200"
                      >
                        <Pencil className="w-4 h-4 mr-2" />
                        Edit Product
                      </Link>
                      <div className="flex-1">
                        <ProductDeleteButton
                          productId={product.id}
                          userId={product.userId}
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <AddToCartButton product={product} isOwner={isOwner} />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
