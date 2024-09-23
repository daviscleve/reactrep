import React from "react";

const Unauthorized = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">
          Unauthorized Access
        </h1>
        <p className="text-gray-600 mb-6">
          Please login first to access this page.
        </p>
        <a
          href="/admin-login"
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
        >
          Go to Login
        </a>
      </div>
    </div>
  );
};

export default Unauthorized;
