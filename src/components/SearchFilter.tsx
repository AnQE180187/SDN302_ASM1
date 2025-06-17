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
              className="input-field w-full pl-10"
            />
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400 dark:text-gray-500" />
          </div>
          <select
            name="price"
            onChange={(e) => setPriceValue(e.target.value)}
            value={priceValue}
            className="input-field"
          >
            <option value="">Price Range</option>
            <option value="0-50">$0 - $50</option>
            <option value="50-100">$50 - $100</option>
            <option value="100-200">$100 - $200</option>
            <option value="200+">$200+</option>
          </select>
          <button
            type="submit"
            className="btn-primary flex items-center gap-2"
          >
            <Search className="w-4 h-4" />
            Search
          </button>
          {hasActiveFilters && (
            <button
              type="button"
              onClick={handleClear}
              className="px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white flex items-center gap-2 transition-colors duration-200"
            >
              <X className="w-4 h-4" />
              Clear Filters
            </button>
          )}
        </div>
        {hasActiveFilters && (
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
            <Filter className="w-4 h-4" />
            <span>Active Filters:</span>
            {searchParams.get("query") && (
              <span className="px-2 py-1 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 rounded-full">
                Search: {searchParams.get("query")}
              </span>
            )}
            {searchParams.get("price") && (
              <span className="px-2 py-1 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 rounded-full">
                Price: {searchParams.get("price")}
              </span>
            )}
          </div>
        )}
      </form>
    </div>
  );
}
