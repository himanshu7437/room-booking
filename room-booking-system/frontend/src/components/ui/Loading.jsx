// components/ui/Loading.jsx
import React from "react";

export const Loading = () => (
  <div className="flex items-center justify-center p-8">
    <div className="animate-spin">
      <div className="h-8 w-8 border-4 border-yellow-500 border-t-transparent rounded-full" />
    </div>
  </div>
);

/* ---------- Card-style Skeleton for Rooms/Events ---------- */
export const LoadingSkeleton = ({ count = 3, className = "" }) => {
  return (
    <div className={`grid gap-6 ${className}`}>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="bg-[#151515] rounded-2xl overflow-hidden shadow-lg animate-pulse"
        >
          {/* Image placeholder */}
          <div className="h-56 bg-gray-700 w-full"></div>

          {/* Content placeholder */}
          <div className="p-6 space-y-4">
            <div className="h-6 bg-gray-600 rounded w-3/4"></div> {/* Title */}
            <div className="h-4 bg-gray-600 rounded w-full"></div>   {/* Description */}
            <div className="h-4 bg-gray-600 rounded w-1/2"></div>   {/* Short text */}
            <div className="flex gap-2">
              <div className="h-6 w-16 bg-gray-600 rounded-full"></div> {/* Badge */}
              <div className="h-6 w-16 bg-gray-600 rounded-full"></div> {/* Badge */}
            </div>
            <div className="h-10 bg-gray-600 rounded w-full"></div> {/* Button */}
          </div>
        </div>
      ))}
    </div>
  );
};