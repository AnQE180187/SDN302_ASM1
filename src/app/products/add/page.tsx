import ProductForm from "@/components/ProductForm";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/utils/auth";
import { redirect } from "next/navigation";

export default async function AddProductPage() {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect("/auth/login?callbackUrl=/products/add");
  }

  return (
    <div className="min-h-screen bg-green-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-extrabold text-green-800 mb-8">
            Add New Product
          </h1>
          <div className="bg-white rounded-xl shadow-sm p-6 border border-green-100">
            <ProductForm mode="add" />
          </div>
        </div>
      </div>
    </div>
  );
}
