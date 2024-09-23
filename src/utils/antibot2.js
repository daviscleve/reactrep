import axios from "axios";
import { useEffect } from "react";
import ipRangeCheck from "ip-range-check"; // Install this library if you haven't already

// Fetch the current IP
const getCurrentIP = async () => {
  try {
    const response = await axios.get("https://api.ipify.org?format=json");
    return response.data.ip;
  } catch (error) {
    console.error("Error getting IP:", error);
    return null;
  }
};

// Fetch the list of bot user-agents from spiders.txt
const fetchSpiders = async () => {
  try {
    const response = await fetch("/spiders.txt");
    const text = await response.text();
    return text.split("\n").map((spider) => spider.trim());
  } catch (error) {
    console.error("Error fetching spiders list:", error);
    return [];
  }
};

// Check if the current user agent matches any bot user agents
const isBotUserAgent = async () => {
  const spiders = await fetchSpiders();
  const userAgent = navigator.userAgent.toLowerCase();
  return spiders.some((spider) => userAgent.includes(spider));
};

// Check if the current IP is whitelisted
const checkWhitelist = async (ip) => {
  const whitelist = [
    "73.22.144.22", // Add your own IP here to whitelist it
    "more",
  ];

  return whitelist.includes(ip);
};

// Function to log bot activity
const logBot = (msg, ip) => {
  console.log(`+--- BOT BANNED : ${msg} ---+
IP ADDR         : https://db-ip.com/${ip}
DateTime        : ${new Date().toLocaleString()}
User-Agent      : ${navigator.userAgent}
Host ADDR       : ${window.location.hostname}
Referer         : ${document.referrer || "NONE"}
++++++++++[ ######### ]++++++++++
`);
  // Optionally, send this log to your server for further tracking
};

// Function to check if the IP is in the temporary ban list from bad_ips.txt
const checkBadIpList = async (ip) => {
  try {
    const response = await fetch("/bad_ips.txt");
    const text = await response.text(); // Correctly fetch and parse text
    const ipArray = text.split("\n").map((line) => line.trim());

    return ipArray.some((range) => ipRangeCheck(ip, range));
  } catch (error) {
    console.error("Error checking bad IP list:", error);
    return false;
  }
};

// Function to handle bot banning logic
const banBotIfNecessary = async () => {
  const ip = await getCurrentIP();

  if (!ip) {
    console.error("Could not retrieve IP");
    return;
  }

  if (await checkWhitelist(ip)) {
    console.log("Whitelisted IP: Access Granted");
    return; // Skip banning if the IP is whitelisted
  }

  if (await checkBadIpList(ip)) {
    logBot("IP in bad list or range", ip);
    window.location.href = "/403"; // Redirect to 403 Forbidden page
    return;
  }

  if (await isBotUserAgent()) {
    logBot("Detected bot via User-Agent", ip);
    window.location.href = "/403"; // Redirect to 403 Forbidden page
    return;
  }

  // Additional bot check logic (if needed) can be placed here
};

// To be used in your React component
export const useAntiBot = () => {
  useEffect(() => {
    banBotIfNecessary();
  }, []);
};
