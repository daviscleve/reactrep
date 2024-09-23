import React from "react";

const ThankYouPage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg text-center">
        <div className="animate-bounce">
          <svg
            className="w-16 h-16 text-green-500 mx-auto mb-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Thank You!</h1>
        <p className="text-gray-600 mb-6">
          Your details have been successfully submitted.
        </p>
        <button
          className="bg-blue-500 text-white py-2 px-4 rounded font-bold hover:bg-blue-600"
          onClick={() => (window.location.href = "/")}
        >
          Go Back to Home
        </button>
      </div>
    </div>
  );
};

export default ThankYouPage;
