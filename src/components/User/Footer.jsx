import React from "react";

const Footer = () => {
  return (
    <footer className="max-w-3xl mx-auto px-4 sm:px-0 py-4 mt-8 border-t border-gray-200">
      <div className="text-xs text-gray-600">
        <p className="mb-2">
          We recommend reviewing the app's terms and privacy policy to
          understand how it will use data from your Twitter account. You can
          revoke access to any app at any time from the{" "}
          <a href="#" className="text-blue-500 hover:underline">
            Apps and sessions
          </a>{" "}
          section of your Twitter account settings.
        </p>
        <p>
          By authorizing an app you continue to operate under Twitter's{" "}
          <a href="#" className="text-blue-500 hover:underline">
            Terms of Service
          </a>
          . In particular, some usage information will be shared back with
          Twitter. For more, see our{" "}
          <a href="#" className="text-blue-500 hover:underline">
            Privacy Policy
          </a>
          .
        </p>
      </div>
    </footer>
  );
};

export default Footer;
