// components/ui/NotFound.jsx
import { Link } from "react-router-dom";
import { XCircle } from "lucide-react";

export const NotFoundPage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#0c0c0c] text-white px-6 text-center space-y-8">
      
      <XCircle className="w-20 h-20 text-yellow-500" />
      
      <h1 className="text-6xl font-bold">404</h1>
      
      <h2 className="text-3xl font-semibold">Page Not Found</h2>
      
      <p className="text-gray-400 max-w-xl">
        The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
      </p>
      
      <Link
        to="/"
        className="px-8 py-3 bg-gradient-to-r from-yellow-400 to-amber-500 text-black font-semibold rounded-lg hover:opacity-90 transition"
      >
        Go Back Home
      </Link>
      
    </div>
  );
};