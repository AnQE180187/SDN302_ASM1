// Redesigned UI with updated color palette and layout
import { prisma } from "@/utils/prisma";
import Link from "next/link";
import Image from "next/image";
import SearchFilter from "@/components/SearchFilter";
import { Plus, Package, Pencil } from "lucide-react";
import ProductDeleteButton from "@/components/ProductDeleteButton";
import { Product, Prisma } from "@prisma/client";

const PAGE_SIZE = 8;

async function getProducts(searchParams: { query?: string; price?: string; page?: string }) {
  try {
    const where: Prisma.ProductWhereInput = {
      AND: [
        searchParams.query
          ? {
            OR: [
              { name: { contains: searchParams.query, mode: 'insensitive' } },
            ],
          }
          : {},
      ],
    };

    if (searchParams.price) {
      const [min, max] = searchParams.price.split('-').map(Number);
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

    const page = parseInt(searchParams.page || '1', 10);
    const skip = (page - 1) * PAGE_SIZE;

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip,
        take: PAGE_SIZE,
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
  const page = parseInt(params.page || '1', 10);
  const totalPages = Math.ceil(total / PAGE_SIZE);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-white">
      <div className="max-w-7xl mx-auto px-6 py-14">
        <div className="flex justify-between items-center mb-10">
          <h1 className="text-4xl font-bold text-indigo-800">Clothing Collection</h1>
          <Link
            href="/products/add"
            className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium rounded-full shadow-md text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:opacity-90 focus:ring-4 focus:outline-none focus:ring-indigo-300"
          >
            <Plus className="w-5 h-5" />
            Add Product
          </Link>
        </div>

        <SearchFilter />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 mt-8">
          {products.length === 0 ? (
            <div className="col-span-full flex flex-col items-center justify-center py-16 px-6 bg-white rounded-xl shadow-md">
              <Package className="h-20 w-20 text-indigo-400 mb-5" />
              <h3 className="text-xl font-semibold text-indigo-900">
                No Products Found
              </h3>
              <p className="mt-2 text-gray-500 text-sm">
                Try another search or add a new product.
              </p>
            </div>
          ) : (
            products.map((product: Product) => (
              <Link
                href={`/products/${product.id}`}
                key={product.id}
                className="group bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden flex flex-col"
              >
                <div className="relative w-full pt-[100%]">
                  {product.image ? (
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-indigo-50 flex items-center justify-center">
                      <Package className="h-12 w-12 text-indigo-300" />
                    </div>
                  )}
                </div>
                <div className="p-5 flex-1 flex flex-col">
                  <div className="flex items-start justify-between gap-2">
                    <h2 className="text-lg font-semibold text-indigo-900 line-clamp-2">
                      {product.name}
                    </h2>
                    <p className="text-lg font-bold text-purple-600 whitespace-nowrap">
                      ${product.price.toFixed(2)}
                    </p>
                  </div>
                  <p className="text-gray-600 text-sm line-clamp-2 mt-3">
                    {product.description}
                  </p>
                  <div className="flex gap-3 mt-5">
                    <Link
                      href={`/products/${product.id}/edit`}
                      className="flex-1 inline-flex items-center justify-center px-3 py-1.5 text-xs font-medium text-indigo-700 bg-indigo-100 rounded-full hover:bg-indigo-200"
                    >
                      <Pencil className="w-4 h-4 mr-1" /> Edit
                    </Link>
                    <ProductDeleteButton productId={product.id} />
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>

        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-6 mt-12">
            <Link
              href={{ pathname: "/", query: { ...params, page: String(page - 1) } }}
              className={`px-4 py-2 rounded-full text-sm font-medium transition ${page === 1 ? "bg-gray-200 text-gray-400 cursor-not-allowed" : "bg-white text-indigo-700 border hover:bg-indigo-50"}`}
              aria-disabled={page === 1}
              tabIndex={page === 1 ? -1 : 0}
            >
              Previous
            </Link>
            <span className="text-gray-700 text-sm">
              Page {page} of {totalPages}
            </span>
            <Link
              href={{ pathname: "/", query: { ...params, page: String(page + 1) } }}
              className={`px-4 py-2 rounded-full text-sm font-medium transition ${page === totalPages ? "bg-gray-200 text-gray-400 cursor-not-allowed" : "bg-white text-indigo-700 border hover:bg-indigo-50"}`}
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
