"use client";

import { useSearchParams, usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { Search, Filter, X } from "lucide-react";

export default function SearchFilter() {
  const searchParams = useSearchParams();
  const pathname = usePathname();

  // Controlled state for search and price
  const [searchValue, setSearchValue] = useState("");
  const [priceValue, setPriceValue] = useState("");

  // Sync state with URL params on mount
  useEffect(() => {
    setSearchValue(searchParams.get("query")?.toString() || "");
    setPriceValue(searchParams.get("price")?.toString() || "");
  }, [searchParams]);

  const hasActiveFilters = !!(
    searchParams.get("query") || searchParams.get("price")
  );

  // Clear filter handler
  const handleClear = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setSearchValue("");
    setPriceValue("");
    // Submit form with no params
    const form = e.currentTarget.form;
    if (form) {
      form.query.value = "";
      form.price.value = "";
      form.submit();
    }
  };

  return (
    <div className="w-full max-w-6xl px-4 mb-8 space-y-4">
      <form method="GET" action={pathname} className="flex flex-col gap-4">
        <div className="flex gap-4 flex-wrap items-center">
          <div className="flex-1 min-w-[200px] relative">
            <input
              type="text"
              name="query"
              placeholder="Search products by name..."
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              className="w-full px-4 py-2 pl-10 border border-gray-200 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>
          <select
            name="price"
            onChange={(e) => setPriceValue(e.target.value)}
            value={priceValue}
            className="px-4 py-2 border border-gray-200 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Price Range</option>
            <option value="0-50">$0 - $50</option>
            <option value="50-100">$50 - $100</option>
            <option value="100-200">$100 - $200</option>
            <option value="200+">$200+</option>
          </select>
          <button
            type="submit"
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded hover:bg-blue-700 flex items-center gap-2"
          >
            <Search className="w-4 h-4" />
            Search
          </button>
          {hasActiveFilters && (
            <button
              type="button"
              onClick={handleClear}
              className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 flex items-center gap-2"
            >
              <X className="w-4 h-4" />
              Clear Filters
            </button>
          )}
        </div>
        {hasActiveFilters && (
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Filter className="w-4 h-4" />
            <span>Active Filters:</span>
            {searchParams.get("query") && (
              <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full">
                Search: {searchParams.get("query")}
              </span>
            )}
            {searchParams.get("price") && (
              <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full">
                Price: {searchParams.get("price")}
              </span>
            )}
          </div>
        )}
      </form>
    </div>
  );
}
