import React from "react";
import { Link } from "react-router-dom";
import { colors } from "src/common/Colors";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 text-center px-6">
      <h1 className="text-6xl font-bold text-gray-800 mb-4">404</h1>
      <p className="text-xl text-gray-600 mb-6">
        Oops! The page you're looking for doesn't exist.
      </p>

      <Link
        to="/"
        className="px-6 py-3 bg-black text-white rounded-xl hover:opacity-80 transition"
        style={{background: colors.primary}}
      >
        Back to Dashboard
      </Link>
    </div>
  );
}
