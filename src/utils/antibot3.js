export const loadBannedReferrers = async () => {
  try {
    const response = await fetch("/bannedReferrers.txt");
    const text = await response.text();
    const bannedReferrers = text
      .split("\n")
      .map((referrer) => referrer.trim())
      .filter(Boolean);
    return bannedReferrers;
  } catch (error) {
    console.error("Failed to load banned referrers:", error);
    return [];
  }
};
