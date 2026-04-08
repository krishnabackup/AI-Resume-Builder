import { useState, useEffect, useCallback } from 'react';
import axiosInstance from '../api/axios';
import toast from 'react-hot-toast';

export const useDashboardData = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [summaryData, setSummaryData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      const [userRes, summaryRes] = await Promise.all([
        axiosInstance.get("/api/user/dashboard"),
        axiosInstance.get("/api/dashboard/summary", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
        })
      ]);
      setDashboardData(userRes.data);
      setSummaryData(summaryRes.data);
      setError(null);
    } catch (err) {
      console.error("Dashboard fetch failed", err);
      setError("Failed to load dashboard data. Please try again later.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  return {
    dashboardData,
    summaryData,
    loading,
    error,
    refetch: fetchDashboardData
  };
};

export const useAdminRequest = () => {
  const [requestLoading, setRequestLoading] = useState(false);

  const handleRequestAdmin = async (onSuccess) => {
    try {
      setRequestLoading(true);
      const res = await axiosInstance.post("/api/user/request-admin");
      toast.success(res.data?.message || "Admin request submitted");
      if (onSuccess) onSuccess();
      return true;
    } catch (err) {
      console.error(err);
      toast.error(err?.response?.data?.message || "Failed to submit request");
      return false;
    } finally {
      setRequestLoading(false);
    }
  };

  return {
    requestLoading,
    handleRequestAdmin
  };
};
