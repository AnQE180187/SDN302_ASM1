import { prisma } from "@/utils/prisma";
import Link from "next/link";
import SearchFilter from "@/components/SearchFilter";
import { Plus, Package } from "lucide-react";
import { Prisma } from "@prisma/client";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/utils/auth";
import ProductCard from "@/components/ProductCard";

const PAGE_SIZE = 8;

async function getProducts(searchParams: {
  query?: string;
  price?: string;
  page?: string;
}) {
  try {
    const where: Prisma.ProductWhereInput = {
      AND: [
        searchParams.query
          ? {
              OR: [
                { name: { contains: searchParams.query, mode: "insensitive" } },
              ],
            }
          : {},
      ],
    };

    // Add price range filter
    if (searchParams.price) {
      const [min, max] = searchParams.price.split("-").map(Number);
      // Ensure where.AND is an array before using push
      if (!where.AND) {
        where.AND = [];
      } else if (!Array.isArray(where.AND)) {
        where.AND = [where.AND];
      }
      where.AND.push({
        price: {
          gte: min,
          ...(max ? { lte: max } : {}),
        },
      });
    }

    const page = parseInt(searchParams.page || "1", 10);
    const skip = (page - 1) * PAGE_SIZE;

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip,
        take: PAGE_SIZE,
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      }),
      prisma.product.count({ where }),
    ]);
    return { products, total };
  } catch (error) {
    console.error("Error fetching products:", error);
    return { products: [], total: 0 };
  }
}

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ query?: string; price?: string; page?: string }>;
}) {
  const params = await searchParams;
  const { products, total } = await getProducts(params);
  const page = parseInt(params.page || "1", 10);
  const totalPages = Math.ceil(total / PAGE_SIZE);

  // Get the session to check if user is authenticated
  const session = await getServerSession(authOptions);
  const isAuthenticated = !!session;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {" "}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Our Products</h1>
          {isAuthenticated && (
            <Link
              href="/products/add"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
            >
              <Plus className="h-5 w-5 mr-2" />
              Add Product
            </Link>
          )}
        </div>
        <SearchFilter />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.length === 0 ? (
            <div className="col-span-full flex flex-col items-center justify-center py-12 px-4 bg-white rounded-xl shadow-sm">
              <Package className="h-16 w-16 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900">
                No products found
              </h3>
              <p className="mt-1 text-gray-500">
                Try adjusting your search or add a new product.
              </p>
            </div>
          ) : (
            products.map((product) => {
              // Check if current user is the owner of the product
              const isOwner = session?.user?.id === product.userId;

              return (
                <ProductCard
                  key={product.id}
                  product={product}
                  isOwner={isOwner}
                />
              );
            })
          )}{" "}
        </div>
        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-4 mt-10">
            <Link
              href={{
                pathname: "/",
                query: { ...params, page: String(page - 1) },
              }}
              className={`px-4 py-2 rounded border text-sm font-medium ${
                page === 1
                  ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                  : "bg-white text-blue-600 hover:bg-blue-50"
              }`}
              aria-disabled={page === 1}
              tabIndex={page === 1 ? -1 : 0}
            >
              Previous
            </Link>
            <span className="text-gray-700">
              Page {page} of {totalPages}
            </span>
            <Link
              href={{
                pathname: "/",
                query: { ...params, page: String(page + 1) },
              }}
              className={`px-4 py-2 rounded border text-sm font-medium ${
                page === totalPages
                  ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                  : "bg-white text-blue-600 hover:bg-blue-50"
              }`}
              aria-disabled={page === totalPages}
              tabIndex={page === totalPages ? -1 : 0}
            >
              Next
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
