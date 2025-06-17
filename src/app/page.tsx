import { prisma } from "@/utils/prisma";
import Link from "next/link";
import Image from "next/image";
import SearchFilter from "@/components/SearchFilter";
import { Plus, Package, Pencil } from "lucide-react";
import ProductDeleteButton from "@/components/ProductDeleteButton";
import { Prisma } from "@prisma/client";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/utils/auth";

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
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900 dark:to-green-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {" "}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">All Products</h1>
          {isAuthenticated && (
            <Link
              href="/products/add"
              className="btn-primary inline-flex items-center"
            >
              <Plus className="h-5 w-5 mr-2" />
              Add Product
            </Link>
          )}
        </div>
        <SearchFilter />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.length === 0 ? (
            <div className="col-span-full flex flex-col items-center justify-center py-12 px-4 bg-white dark:bg-gray-800 rounded-2xl shadow-xl">
              <Package className="h-16 w-16 text-gray-400 dark:text-gray-500 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                No products found
              </h3>
              <p className="mt-1 text-gray-500 dark:text-gray-400">
                Try adjusting your search or add a new product.
              </p>
            </div>
          ) : (
            products.map((product) => {
              // Check if current user is the owner of the product
              const isOwner = session?.user?.id === product.userId;

              return (
                <div
                  key={product.id}
                  className="group bg-white dark:bg-gray-800 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-200 overflow-hidden flex flex-col"
                >
                  {" "}
                  <Link href={`/products/${product.id}`} className="block">
                    <div className="relative w-full pt-[100%]">
                      {product.image ? (
                        <Image
                          src={product.image}
                          alt={product.name}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-200"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                      ) : (
                        <div className="absolute inset-0 bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                          <Package className="h-12 w-12 text-gray-400 dark:text-gray-500" />
                        </div>
                      )}
                    </div>
                  </Link>
                  <div className="p-6 flex-1 flex flex-col">
                    <Link href={`/products/${product.id}`} className="block">
                      <div className="flex items-start justify-between gap-2">
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-white line-clamp-2">
                          {product.name}
                        </h2>
                        <p className="text-lg font-bold text-green-600 dark:text-green-400 whitespace-nowrap">
                          ${product.price.toFixed(2)}
                        </p>
                      </div>
                      <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-2 mt-2">
                        {product.description}
                      </p>
                    </Link>

                    {product.user && (
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                        Added by: {product.user.name || product.user.email}
                      </p>
                    )}

                    {isAuthenticated ? (
                      isOwner ? (
                        <div className="flex gap-2 mt-4">
                          <Link
                            href={`/products/${product.id}/edit`}
                            className="flex-1 inline-flex items-center justify-center px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-xs font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors duration-200"
                          >
                            <Pencil className="w-4 h-4 mr-1" />
                            Edit
                          </Link>
                          <div className="flex-1">
                            <ProductDeleteButton
                              productId={product.id}
                              userId={product.userId}
                            />
                          </div>
                        </div>
                      ) : (
                        <div className="mt-4">
                          <Link
                            href={`/products/${product.id}`}
                            className="w-full inline-flex items-center justify-center px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-xs font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors duration-200"
                          >
                            View Details
                          </Link>
                        </div>
                      )
                    ) : (
                      <div className="mt-4">
                        <Link
                          href={`/products/${product.id}`}
                          className="w-full inline-flex items-center justify-center px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-xs font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors duration-200"
                        >
                          View Details
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-4 mt-10">
            <Link
              href={{
                pathname: "/",
                query: { ...params, page: String(page - 1) },
              }}
              className={`px-4 py-2 rounded-md border text-sm font-medium transition-colors duration-200 ${page === 1
                  ? "bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed"
                  : "bg-white dark:bg-gray-800 text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/50"
                }`}
              aria-disabled={page === 1}
              tabIndex={page === 1 ? -1 : 0}
            >
              Previous
            </Link>
            <span className="text-gray-700 dark:text-gray-300">
              Page {page} of {totalPages}
            </span>
            <Link
              href={{
                pathname: "/",
                query: { ...params, page: String(page + 1) },
              }}
              className={`px-4 py-2 rounded-md border text-sm font-medium transition-colors duration-200 ${page === totalPages
                  ? "bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed"
                  : "bg-white dark:bg-gray-800 text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/50"
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
