import { sendPageView } from "../services/analyticsService";

export const trackPageView = async (pageName, route) => {
  if (!pageName || !route) {
    return;
  }

  try {
    await sendPageView({ page: pageName, route });
  } catch (error) {
    // Keep tracking failures silent so normal page navigation is unaffected.
    console.error("Page view tracking failed:", error?.message || error);
  }
};
