import React, { useState, useEffect } from "react";
import { Check, ToggleLeft, ToggleRight, Pencil, Plus, Trash2, GripVertical } from "lucide-react";
import axiosInstance from "../../../api/axios";
import { usePricing } from "../../../context/Pricingcontext";
import toast, { Toaster } from 'react-hot-toast';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

// Helper to generate unique IDs
const generateId = () => Math.random().toString(36).substr(2, 9);

const SortableFeatureItem = ({ id, feature, onChange, onRemove }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <li ref={setNodeRef} style={style} className="flex items-center gap-2 bg-white">
      <div
        {...attributes}
        {...listeners}
        className="cursor-grab text-black hover:text-gray-700 p-1 touch-none"
      >
        <GripVertical className="w-5 h-5" />
      </div>
      <input
        type="text"
        value={feature.text}
        onChange={(e) => onChange(e.target.value)}
        className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded focus:border-blue-500 focus:outline-none"
        placeholder="Feature description"
      />
      <button
        onClick={onRemove}
        className="p-1 text-red-500 hover:bg-red-50 rounded"
        title="Remove feature"
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </li>
  );
};

const AdminSubscription = () => {
  const { plans, savePlans, fetchPlans } = usePricing();
  const [localPlans, setLocalPlans] = useState([]);
  const [paidUsers, setPaidUsers] = useState([]);
  const [freeUsersCount, setFreeUsersCount] = useState(0);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    fetchData();
    fetchPlans();
  }, []);

  // Sync localPlans with plans from context when fetched
  useEffect(() => {
    if (plans.length > 0) {
      setLocalPlans(
        plans.map(plan => ({
          ...plan,
          features: plan.features.map(f => ({ id: generateId(), text: f }))
        }))
      );
    }
  }, [plans]);

  const fetchData = async () => {
    try {
      setLoading(true);

      // Fetch all users
      const usersResponse = await axiosInstance.get("/api/user");
      const allUsers = usersResponse.data;

      // Filter users
      const pro = allUsers.filter(user => user.plan === "Pro" || user.plan === "Premium" || user.plan === "Ultra Pro");
      const free = allUsers.filter(user => !user.plan || user.plan === "Free");

      setPaidUsers(pro);
      setFreeUsersCount(free.length);

      // Fetch stats for revenue
      const statsResponse = await axiosInstance.get("/api/user/dashboard-stat");
      setStats(statsResponse.data);

      setLoading(false);
    } catch (err) {
      console.error("Failed to fetch data", err);
      setLoading(false);
    }
  };

  const togglePlan = (id) => {
    setLocalPlans((prev) =>
      prev.map((plan) =>
        plan.id === id ? { ...plan, active: !plan.active } : plan
      )
    );
  };

  const updatePrice = (id, value) => {
    setLocalPlans((prev) =>
      prev.map((plan) => (plan.id === id ? { ...plan, price: value } : plan))
    );
  };

  const handleFeatureChange = (planId, featureId, newValue) => {
    setLocalPlans((prev) =>
      prev.map((plan) => {
        if (plan.id === planId) {
          const newFeatures = plan.features.map(f =>
            f.id === featureId ? { ...f, text: newValue } : f
          );
          return { ...plan, features: newFeatures };
        }
        return plan;
      })
    );
  };

  const handleAddFeature = (planId) => {
    setLocalPlans((prev) =>
      prev.map((plan) => {
        if (plan.id === planId) {
          return {
            ...plan,
            features: [...plan.features, { id: generateId(), text: "New Feature" }]
          };
        }
        return plan;
      })
    );
  };

  const handleRemoveFeature = (planId, featureId) => {
    setLocalPlans((prev) =>
      prev.map((plan) => {
        if (plan.id === planId) {
          const newFeatures = plan.features.filter((f) => f.id !== featureId);
          return { ...plan, features: newFeatures };
        }
        return plan;
      })
    );
  };

  const handleDragEnd = (event, planId) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      setLocalPlans((prev) =>
        prev.map(plan => {
          if (plan.id === planId) {
            const oldIndex = plan.features.findIndex(f => f.id === active.id);
            const newIndex = plan.features.findIndex(f => f.id === over.id);
            return {
              ...plan,
              features: arrayMove(plan.features, oldIndex, newIndex)
            };
          }
          return plan;
        })
      );
    }
  };

  const handleSaveChanges = async () => {
    setSaving(true);
    // Convert back to string array for backend
    const plansToSave = localPlans.map(plan => ({
      ...plan,
      features: plan.features.map(f => f.text)
    }));

    const result = await savePlans(plansToSave);
    setSaving(false);

    if (result.success) {
      toast.success('Pricing changes saved successfully! The changes will now be visible on the pricing page.');
      await fetchPlans();
    } else {
      toast.error('Failed to save changes: ' + result.error);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-6">
      <Toaster position="top-right" />
      {/* Header */}
      <div className="mb-6 sm:mb-10">
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
          Subscription Management
        </h1>
        <p className="text-sm sm:text-base text-slate-600 mt-1 sm:mt-2">
          Admin can enable, disable and update pricing for subscription plans
        </p>
      </div>

      {/* Stats / Dashboard */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-6 mb-6 sm:mb-10">
        <div className="bg-white p-4 sm:p-6 rounded-xl shadow flex flex-col gap-2">
          <p className="text-xs sm:text-sm text-gray-500">Total Revenue</p>
          <p className="text-xl sm:text-2xl font-bold">
            ₹{stats?.revenue?.total?.toLocaleString() || 0}
            {stats?.revenue?.change !== 0 && (
              <span className={`text-xs sm:text-sm ml-2 ${stats?.revenue?.change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                {stats?.revenue?.change > 0 ? '+' : ''}{stats?.revenue?.change}%
              </span>
            )}
          </p>
        </div>
        <div className="bg-white p-4 sm:p-6 rounded-xl shadow flex flex-col gap-2">
          <p className="text-xs sm:text-sm text-gray-500">Active Subscribers</p>
          <p className="text-xl sm:text-2xl font-bold">
            {paidUsers.length} <span className="text-gray-400 text-xs sm:text-sm">(Pro)</span>
          </p>
        </div>
        <div className="bg-white p-4 sm:p-6 rounded-xl shadow flex flex-col gap-2">
          <p className="text-xs sm:text-sm text-gray-500">Free Users</p>
          <p className="text-xl sm:text-2xl font-bold">
            {freeUsersCount.toLocaleString()}
            <span className="text-gray-400 text-xs sm:text-sm ml-2">(Leads)</span>
          </p>
        </div>
      </div>

      {/* Plans */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {localPlans.map((plan) => (
          <div
            key={plan.id}
            className="rounded-2xl border border-gray-200 bg-white p-4 sm:p-6 shadow h-full flex flex-col"
          >
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
                {plan.name}
              </h2>
              <button onClick={() => togglePlan(plan.id)}>
                {plan.active ? (
                  <ToggleRight className="text-green-500" />
                ) : (
                  <ToggleLeft className="text-gray-400" />
                )}
              </button>
            </div>

            <p className="text-sm text-gray-500">{plan.description}</p>

            {/* Price Control */}
            <div className="mt-4">
              <label className="text-sm text-gray-600">Monthly Price (₹)</label>
              <div className="flex items-center gap-2 mt-1">
                <input
                  type="number"
                  value={plan.price}
                  disabled={!plan.active}
                  onChange={(e) => updatePrice(plan.id, e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 bg-gray-50 text-gray-900"
                />
                <Pencil className="w-4 h-4 text-gray-400" />
              </div>
            </div>

            {/* Features with Drag and Drop */}
            <div className="mt-5 flex-1">
              <label className="text-sm text-gray-600 mb-2 block">Features</label>
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={(e) => handleDragEnd(e, plan.id)}
              >
                <SortableContext
                  items={plan.features.map(f => f.id)}
                  strategy={verticalListSortingStrategy}
                >
                  <ul className="space-y-2">
                    {plan.features.map((feature) => (
                      <SortableFeatureItem
                        key={feature.id}
                        id={feature.id}
                        feature={feature}
                        onChange={(val) => handleFeatureChange(plan.id, feature.id, val)}
                        onRemove={() => handleRemoveFeature(plan.id, feature.id)}
                      />
                    ))}
                  </ul>
                </SortableContext>
              </DndContext>

              <button
                onClick={() => handleAddFeature(plan.id)}
                className="mt-3 flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                <Plus className="w-4 h-4" /> Add Feature
              </button>
            </div>

            <div className="mt-6">
              <span
                className={`inline-block px-3 py-1 rounded-full text-xs font-medium 
                  ${plan.active
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                  }`}
              >
                {plan.active ? "Active" : "Disabled"}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Save Button */}
      <div className="mt-12 flex justify-end">
        <button
          onClick={handleSaveChanges}
          disabled={saving}
          className="px-6 py-3 rounded-xl bg-blue-600 text-white font-medium hover:bg-blue-700 mb-10 disabled:bg-gray-400"
        >
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      {/* Paid Users Section */}
      <div className="bg-white border rounded-xl shadow-sm mb-10 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900">Paid Users</h2>
        </div>

        {/* Desktop Table View */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-500">
              <tr>
                <th className="px-6 py-4 text-left">User</th>
                <th className="px-6 py-4 text-left">Email</th>
                <th className="px-6 py-4 text-center">Plan</th>
                <th className="px-6 py-4 text-center">Status</th>
                <th className="px-6 py-4 text-center">Joined Date</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {loading ? (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center text-gray-500">
                    Loading paid users...
                  </td>
                </tr>
              ) : paidUsers.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center text-gray-500">
                    No paid users found.
                  </td>
                </tr>
              ) : (
                paidUsers.map((user) => (
                  <tr key={user._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium text-gray-900">
                      {user.username || "User"}
                    </td>
                    <td className="px-6 py-4 text-gray-600">{user.email}</td>
                    <td className="px-6 py-4 text-center">
                      <span className="px-3 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 border border-amber-200">
                        {user.plan}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium ${user.isActive
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                          }`}
                      >
                        {user.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center text-gray-500">
                      {user.createdAt
                        ? new Date(user.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
                        : "N/A"}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile Card Grid View */}
        <div className="md:hidden p-4">
          {loading ? (
            <div className="text-center text-gray-500 py-4">Loading paid users...</div>
          ) : paidUsers.length === 0 ? (
            <div className="text-center text-gray-500 py-4">No paid users found.</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {paidUsers.map((user) => (
                <div
                  key={user._id}
                  className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex flex-col gap-3 shadow-sm"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {user.username || "User"}
                      </h3>
                      <p className="text-xs text-gray-500 break-all">{user.email}</p>
                    </div>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide border ${user.isActive
                        ? "bg-green-100 text-green-700 border-green-200"
                        : "bg-red-100 text-red-700 border-red-200"
                        }`}
                    >
                      {user.isActive ? "Active" : "Inactive"}
                    </span>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-slate-200 mt-auto">
                    <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 border border-amber-200">
                      {user.plan}
                    </span>
                    <span className="text-xs text-gray-400">
                      {user.createdAt
                        ? new Date(user.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
                        : "N/A"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminSubscription;