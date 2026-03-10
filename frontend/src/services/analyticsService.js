import axiosInstance from "../api/axios";

export const fetchTopPages = async () => {
  const response = await axiosInstance.get("/api/admin/top-pages");
  return response.data || [];
};

export const sendPageView = async ({ page, route }) => {
  const response = await axiosInstance.post("/api/analytics/page-view", {
    page,
    route,
  });

  return response.data;
};
