import { useState, useEffect } from 'react';

const useApiMetrics = (endpoint = null, method = null) => {
  const [metrics, setMetrics] = useState({
    totalRequests: 0,
    successRequests: 0,
    errorRequests: 0,
    avgResponseTime: 0,
    minResponseTime: 0,
    maxResponseTime: 0,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchMetrics = async (filters = {}) => {
    setLoading(true);
    setError(null);
    
    try {
      const queryParams = new URLSearchParams();
      
      if (endpoint) queryParams.append('endpoint', endpoint);
      if (method) queryParams.append('method', method);
      if (filters.startDate) queryParams.append('startDate', filters.startDate);
      if (filters.endDate) queryParams.append('endDate', filters.endDate);
      if (filters.userId) queryParams.append('user_id', filters.userId);
      
      const response = await fetch(`/api/admin/metrics/stats?${queryParams}`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch metrics: ${response.status}`);
      }
      
      const data = await response.json();
      setMetrics(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMetrics();
  }, [endpoint, method]);

  return {
    metrics,
    loading,
    error,
    refetch: fetchMetrics,
  };
};

export default useApiMetrics;
