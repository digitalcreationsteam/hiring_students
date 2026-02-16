// src/ui/components/LoadingScreen.tsx
import React from "react";

export default function LoadingScreen() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-violet-50 to-indigo-100">
      <div className="text-center">
        {/* Spinner */}
        <div className="relative mx-auto mb-6">
          <div className="animate-spin rounded-full h-20 w-20 border-t-4 border-b-4 border-violet-600"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div className="h-10 w-10 bg-violet-100 rounded-full"></div>
          </div>
        </div>

        {/* Text */}
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Loading Your Profile
        </h2>
        <p className="text-gray-600 mb-4">Please wait a moment...</p>

        {/* Progress dots */}
        <div className="flex justify-center space-x-2">
          <div className="w-3 h-3 bg-violet-600 rounded-full animate-bounce"></div>
          <div
            className="w-3 h-3 bg-violet-600 rounded-full animate-bounce"
            style={{ animationDelay: "0.1s" }}
          ></div>
          <div
            className="w-3 h-3 bg-violet-600 rounded-full animate-bounce"
            style={{ animationDelay: "0.2s" }}
          ></div>
        </div>
      </div>
    </div>
  );
}