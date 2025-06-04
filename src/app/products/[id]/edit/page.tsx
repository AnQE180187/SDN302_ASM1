import { prisma } from "@/utils/prisma";
import ProductForm from "@/components/ProductForm";
import { notFound } from "next/navigation";

interface EditProductPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditProductPage({ params }: EditProductPageProps) {
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
        <div className="max-w-2xl mx-auto">
          <h1 className="text-2xl font-bold text-gray-900 mb-8">Edit Product</h1>
          <div className="bg-white rounded-xl shadow-sm p-6">
            <ProductForm mode="edit" product={product} />
          </div>
        </div>
      </div>
    </div>
  );
} 