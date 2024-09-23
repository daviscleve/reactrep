export const loadUserAgents = async (filePath) => {
  try {
    const response = await fetch(filePath);
    const text = await response.text();
    const userAgents = text
      .split("\n")
      .map((agent) => agent.trim())
      .filter(Boolean);
    return userAgents;
  } catch (error) {
    console.error(`Failed to load user agents from ${filePath}:`, error);
    return [];
  }
};
