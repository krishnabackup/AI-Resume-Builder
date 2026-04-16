import axiosInstance from "../api/axios";

const appendFilters = (params, filters = {}) => {
  if (filters.range) params.append("range", filters.range);
  if (filters.startDate) params.append("startDate", filters.startDate);
  if (filters.endDate) params.append("endDate", filters.endDate);
};

export const fetchAdminAnalytics = async (filters = {}) => {
  const params = new URLSearchParams();
  appendFilters(params, filters);

  const response = await axiosInstance.get(`/api/admin/analytics-stat?${params.toString()}`);
  return response.data;
};

export const fetchTopPages = async (filters = {}) => {
  const params = new URLSearchParams();
  appendFilters(params, filters);

  const response = await axiosInstance.get(`/api/admin/top-pages?${params.toString()}`);
  return response.data || [];
};

export const sendPageView = async ({ page, route }) => {
  const response = await axiosInstance.post("/api/analytics/page-view", {
    page,
    route,
  });

  return response.data;
};
