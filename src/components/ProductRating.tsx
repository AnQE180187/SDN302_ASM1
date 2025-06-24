"use client";

import { Star } from "lucide-react";

// No props are currently used, so we can omit the interface entirely

export default function ProductRating() {
  // This is a simplified version - in a real app, you would fetch actual ratings from the database
  const rating = 4; // Mock rating value

  return (
    <div className="flex items-center">
      {[...Array(5)].map((_, index) => (
        <Star
          key={index}
          className={`h-4 w-4 ${
            index < rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
          }`}
        />
      ))}
      <span className="text-xs text-gray-500 ml-1">{rating.toFixed(1)}</span>
    </div>
  );
}
