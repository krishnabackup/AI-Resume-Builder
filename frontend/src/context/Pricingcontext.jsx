import React, { createContext, useContext, useCallback } from 'react';
import axiosInstance from '../api/axios';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

const PricingContext = createContext();

export const usePricing = () => {
  const context = useContext(PricingContext);
  if (!context) {
    throw new Error('usePricing must be used within a PricingProvider');
  }
  return context;
};

export const PricingProvider = ({ children }) => {
  const queryClient = useQueryClient();

  // Fetch plans from backend with caching
  const { 
    data: plans = [], 
    isLoading: loading,
    refetch: fetchPlans 
  } = useQuery({
    queryKey: ['plans'],
    queryFn: async () => {
      console.log('Fetching plans from /api/plans');
      const response = await axiosInstance.get('/api/plans');
      
      // Transform backend data to match frontend format
      return response.data.map(plan => ({
        id: plan.planId,
        name: plan.name,
        badge: plan.badge,
        price: plan.price,
        active: plan.active,
        order: plan.order,
        description: plan.description,
        features: plan.features,
      }));
    },
    staleTime: 300000, // 5 minutes fresh
    cacheTime: 600000, // 10 minutes cache
  });

  // Save plans mutation
  const savePlansMutation = useMutation({
    mutationFn: async (updatedPlans) => {
      // Transform frontend data to match backend format
      const backendPlans = updatedPlans.map(plan => ({
        planId: plan.id,
        name: plan.name,
        badge: plan.badge,
        price: Number(plan.price),
        active: plan.active,
        order: plan.order,
        description: plan.description,
        features: plan.features,
      }));

      await axiosInstance.put('/api/plans', backendPlans);
      return { success: true };
    },
    onSuccess: () => {
      // Invalidate the plans query to trigger a refetch
      queryClient.invalidateQueries({ queryKey: ['plans'] });
    }
  });

  const savePlans = useCallback(async (updatedPlans) => {
    try {
      return await savePlansMutation.mutateAsync(updatedPlans);
    } catch (err) {
      console.error('Failed to save plans', err);
      return { success: false, error: err.response?.data?.message || err.message };
    }
  }, [savePlansMutation]);

  return (
    <PricingContext.Provider value={{ plans, savePlans, loading, fetchPlans }}>
      {children}
    </PricingContext.Provider>
  );
};