import React, { createContext, useContext, useState, useEffect } from 'react';
import axiosInstance from '../api/axios';

const PricingContext = createContext();

export const usePricing = () => {
  const context = useContext(PricingContext);
  if (!context) {
    throw new Error('usePricing must be used within a PricingProvider');
  }
  return context;
};

export const PricingProvider = ({ children }) => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch plans from backend
  const fetchPlans = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get('/api/plans');
      
      // Transform backend data to match frontend format
      const transformedPlans = response.data.map(plan => ({
        id: plan.planId,
        name: plan.name,
        badge : plan.badge,
        price: plan.price,
        active: plan.active,
        description: plan.description,
        features: plan.features,
      }));
      
      setPlans(transformedPlans);
      setLoading(false);
    } catch (err) {
      console.error('Failed to fetch plans', err);
      setLoading(false);
    }
  };

  // Save plans to backend
  const savePlans = async (updatedPlans) => {
    try {
      // Transform frontend data to match backend format
      const backendPlans = updatedPlans.map(plan => ({
        planId: plan.id,
        name: plan.name,
        badge : plan.badge,
        price: Number(plan.price),
        active: plan.active,
        description: plan.description,
        features: plan.features,
      }));

      await axiosInstance.put('/api/plans', backendPlans);
      
      // Update local state
      setPlans(updatedPlans);
      
      return { success: true };
    } catch (err) {
      console.error('Failed to save plans', err);
      return { success: false, error: err.response?.data?.message || err.message };
    }
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  return (
    <PricingContext.Provider value={{ plans, setPlans, savePlans, loading, fetchPlans }}>
      {children}
    </PricingContext.Provider>
  );
};