"use client";

import { Trash2 } from "lucide-react";
import { useSession } from "next-auth/react";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";

export default function ProductDeleteButton({
  productId,
  userId,
}: {
  productId: string;
  userId: string;
}) {
  const { data: session } = useSession();
  const router = useRouter();

  // Check if the current user is the owner of the product
  const isOwner = session?.user?.id === userId;

  const handleDelete = async () => {
    if (!session) {
      toast.error("You must be logged in to delete products");
      return;
    }

    if (!isOwner) {
      toast.error("You can only delete your own products");
      return;
    }

    if (confirm("Are you sure you want to delete this product?")) {
      try {
        const response = await fetch(`/api/products/${productId}`, {
          method: "DELETE",
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Failed to delete product");
        }

        toast.success("Product deleted successfully");
        router.push("/");
        router.refresh();
      } catch (error) {
        if (error instanceof Error) {
          toast.error(error.message);
        } else {
          toast.error("An error occurred while deleting the product");
        }
      }
    }
  };

  // Only render the button if the user is authenticated and is the owner
  if (!session || !isOwner) {
    return null;
  }

  return (
    <button
      type="button"
      onClick={handleDelete}
      className="inline-flex items-center justify-center px-3 py-1 border border-transparent rounded-md shadow-sm text-xs font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 w-full transition-colors duration-200"
    >
      <Trash2 className="w-4 h-4 mr-1" />
      Delete
    </button>
  );
}
