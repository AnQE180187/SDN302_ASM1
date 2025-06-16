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
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Our Products</h1>
          {isAuthenticated && (
            <Link
              href="/products/add"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors duration-200"
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
              const isOwner = session?.user?.id === product.userId;

              return (
                <div
                  key={product.id}
                  className="group bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden flex flex-col"
                >
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
                        <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
                          <Package className="h-12 w-12 text-gray-400" />
                        </div>
                      )}
                    </div>
                  </Link>
                  <div className="p-4 flex-1 flex flex-col">
                    <Link href={`/products/${product.id}`} className="block">
                      <div className="flex items-start justify-between gap-2">
                        <h2 className="text-lg font-semibold text-gray-900 line-clamp-2">
                          {product.name}
                        </h2>
                        <p className="text-lg font-bold text-green-600 whitespace-nowrap">
                          ${product.price.toFixed(2)}
                        </p>
                      </div>
                      <p className="text-gray-600 text-sm line-clamp-2 mt-2">
                        {product.description}
                      </p>
                    </Link>

                    {product.user && (
                      <p className="text-xs text-gray-500 mt-2">
                        Added by: {product.user.name || product.user.email}
                      </p>
                    )}

                    {isAuthenticated ? (
                      isOwner ? (
                        <div className="flex gap-2 mt-4">
                          <Link
                            href={`/products/${product.id}/edit`}
                            className="flex-1 inline-flex items-center justify-center px-3 py-1 border border-gray-300 rounded-md shadow-sm text-xs font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
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
                            className="w-full inline-flex items-center justify-center px-3 py-1 border border-gray-300 rounded-md shadow-sm text-xs font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                          >
                            View Details
                          </Link>
                        </div>
                      )
                    ) : (
                      <div className="mt-4">
                        <Link
                          href={`/products/${product.id}`}
                          className="w-full inline-flex items-center justify-center px-3 py-1 border border-gray-300 rounded-md shadow-sm text-xs font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
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

        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-4 mt-10">
            <Link
              href={{
                pathname: "/",
                query: { ...params, page: String(page - 1) },
              }}
              className={`px-4 py-2 rounded border text-sm font-medium ${page === 1
                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                : "bg-white text-green-600 hover:bg-green-50"
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
              className={`px-4 py-2 rounded border text-sm font-medium ${page === totalPages
                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                : "bg-white text-green-600 hover:bg-green-50"
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
