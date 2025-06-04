import { prisma } from "@/utils/prisma";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Pencil, Trash2, ArrowLeft } from "lucide-react";

interface ProductDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  const { id } = await params;
  const product = await prisma.product.findUnique({
    where: {
      id,
    },
  });

  if (!product) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6">
            <Link
              href="/"
              className="inline-flex items-center text-sm font-medium text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Products
            </Link>
          </div>

          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="relative aspect-square">
              {product.image ? (
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-cover rounded-lg"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              ) : (
                <div className="w-full h-full bg-gray-100 rounded-lg flex items-center justify-center">
                  <span className="text-gray-400">No image available</span>
                </div>
              )}
            </div>

            <div className="flex flex-col">
              <div className="flex-1">
                <h1 className="text-2xl font-bold text-gray-900 mb-2">
                  {product.name}
                </h1>
                <p className="text-3xl font-bold text-blue-600 mb-4">
                  ${product.price.toFixed(2)}
                </p>
                <p className="text-gray-600 mb-6">{product.description}</p>
              </div>

              <div className="flex gap-2">
                <Link
                  href={`/products/${product.id}/edit`}
                  className="flex-1 inline-flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <Pencil className="w-4 h-4 mr-2" />
                  Edit Product
                </Link>
                <button
                  onClick={async () => {
                    if (confirm('Are you sure you want to delete this product?')) {
                      try {
                        const response = await fetch(`/api/products/${product.id}`, {
                          method: 'DELETE',
                        });
                        if (response.ok) {
                          window.location.href = '/';
                        }
                      } catch (error) {
                        console.error('Error deleting product:', error);
                      }
                    }
                  }}
                  className="flex-1 inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete Product
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
