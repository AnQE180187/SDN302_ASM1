import { prisma } from "@/utils/prisma";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Pencil, ArrowLeft } from "lucide-react";
import ProductDeleteButton from "@/components/ProductDeleteButton";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/utils/auth";

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
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900 dark:to-green-950 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6">
            <Link
              href="/"
              className="inline-flex items-center text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 transition-colors duration-200"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Products
            </Link>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden p-8">
            <div className="relative aspect-square w-full max-w-lg mx-auto mb-8">
              {product.image ? (
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-cover rounded-xl"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              ) : (
                <div className="w-full h-full bg-gray-100 dark:bg-gray-700 rounded-xl flex items-center justify-center">
                  <span className="text-gray-400 dark:text-gray-500">No image available</span>
                </div>
              )}
            </div>

            <div className="flex flex-col">
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">
                  {product.name}
                </h1>
                <p className="text-4xl font-bold text-green-600 dark:text-green-400 mb-4">
                  ${product.price.toFixed(2)}
                </p>
                <p className="text-gray-600 dark:text-gray-300 text-lg mb-6">
                  {product.description}
                </p>

                {product.user && (
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                    Added by: {product.user.name || product.user.email}
                  </p>
                )}
              </div>

              {isOwner && (
                <div className="flex gap-4">
                  <Link
                    href={`/products/${product.id}/edit`}
                    className="flex-1 inline-flex items-center justify-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors duration-200"
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
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
