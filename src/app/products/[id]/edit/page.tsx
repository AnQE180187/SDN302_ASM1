import { prisma } from "@/utils/prisma";
import ProductForm from "@/components/ProductForm";
import { notFound, redirect } from "next/navigation";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/utils/auth";

interface EditProductPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditProductPage({ params }: EditProductPageProps) {
  const { id } = await params;
  
  // Check if user is authenticated
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    redirect("/auth/login?callbackUrl=" + encodeURIComponent(`/products/${id}/edit`));
  }
  
  const product = await prisma.product.findUnique({
    where: {
      id,
    },
  });

  if (!product) {
    notFound();
  }
  
  // Check if the user owns the product
  if (product.userId !== session.user.id) {
    redirect("/"); // Redirect to home if not the owner
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