import ProductForm from "@/components/ProductForm";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/utils/auth";
import { redirect } from "next/navigation";

export default async function AddProductPage() {
  // Check if user is authenticated
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect("/auth/login?callbackUrl=/products/add");
  }
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-2xl font-bold text-gray-900 mb-8">
            Add New Product
          </h1>
          <div className="bg-white rounded-xl shadow-sm p-6">
            <ProductForm mode="add" />
          </div>
        </div>
      </div>
    </div>
  );
}
