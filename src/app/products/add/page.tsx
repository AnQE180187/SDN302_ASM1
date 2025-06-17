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
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900 dark:to-green-950 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
            Add New Product
          </h1>
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
            <ProductForm mode="add" />
          </div>
        </div>
      </div>
    </div>
  );
}
