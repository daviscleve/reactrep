import { useState, useEffect } from "react";

// Hook to fetch the IP address
export const useFetchIpAddress = () => {
  const [ipAddress, setIpAddress] = useState("");

  useEffect(() => {
    const fetchIpAddress = async () => {
      try {
        const ipResponse = await fetch("https://api.ipify.org?format=json");
        const ipData = await ipResponse.json();
        setIpAddress(ipData.ip);

        // Check if the IP is banned
        const bannedIps = JSON.parse(localStorage.getItem("bannedIps") || "[]");
        if (bannedIps.includes(ipData.ip)) {
          alert(
            "Access denied. Your IP has been banned due to suspicious activity."
          );
          window.location.href = "https://www.google.com"; // Redirect or block further actions
        }
      } catch (error) {
        console.error("Failed to fetch IP address:", error);
      }
    };

    fetchIpAddress();
  }, []);

  return ipAddress;
};

// Hook to generate a device fingerprint
export const useGenerateFingerprint = () => {
  const [deviceFingerprint, setDeviceFingerprint] = useState("");

  useEffect(() => {
    const fingerprint = `${navigator.userAgent}-${navigator.language}-${
      screen.colorDepth
    }-${screen.width}x${screen.height}-${new Date().getTimezoneOffset()}`;
    setDeviceFingerprint(fingerprint);
  }, []);

  return deviceFingerprint;
};

// Hook to monitor network requests
export const useMonitorNetworkRequests = () => {
  useEffect(() => {
    const originalFetch = window.fetch;
    window.fetch = function () {
      const fetchArguments = arguments;
      console.log("Network Request:", fetchArguments);

      // Add any specific checks here, e.g., rate-limiting or suspicious URLs
      // If a suspicious request is detected, you could take action, such as blocking it.

      return originalFetch.apply(this, arguments);
    };

    // Clean up fetch override on component unmount
    return () => {
      window.fetch = originalFetch;
    };
  }, []);
};
