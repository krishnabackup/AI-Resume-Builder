import React, { useState, useEffect, useMemo } from "react";
import { Check, ToggleLeft, ToggleRight, Pencil, Plus, Trash2, GripVertical, GripHorizontal } from "lucide-react";
import axiosInstance from "../../../api/axios";
import { usePricing } from "../../../context/Pricingcontext";
import toast, { Toaster } from "react-hot-toast";
import { useQuery } from "@tanstack/react-query";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
  rectSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { SortablePlanCard } from "./SortablePlanCard.jsx";

// ─── Constants ────────────────────────────────────────────────────────────────

const generateId = () => Math.random().toString(36).substr(2, 9);

const toLocalPlan = plan => ({
  ...plan,
  features: plan.features.map(f => ({ id: generateId(), text: f })),
});

// ─── SortableFeatureItem ──────────────────────────────────────────────────────

const SortableFeatureItem = ({ id, feature, onChange, onRemove }) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });

  return (
    <li
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className="flex items-center gap-2 bg-white"
    >
      <div {...attributes} {...listeners} className="cursor-grab text-black hover:text-gray-700 p-1 touch-none">
        <GripVertical className="w-5 h-5" />
      </div>
      <input
        type="text"
        value={feature.text ?? ""}
        onChange={e => onChange(e.target.value)}
        className="flex-1 min-w-0 break-words px-2 py-1 text-sm border border-gray-300 rounded focus:border-blue-500 focus:outline-none"
        placeholder="Feature description"
      />
      <button onClick={onRemove} className="p-1 text-red-500 hover:bg-red-50 rounded" title="Remove feature">
        <Trash2 className="w-4 h-4" />
      </button>
    </li>
  );
};

// ─── StatCard ─────────────────────────────────────────────────────────────────

const StatCard = ({ label, children }) => (
  <div className="bg-white p-4 sm:p-6 rounded-xl shadow flex flex-col gap-2">
    <p className="text-xs sm:text-sm text-gray-500">{label}</p>
    <p className="text-xl sm:text-2xl font-bold">{children}</p>
  </div>
);

// ─── PlanCard ─────────────────────────────────────────────────────────────────

const PlanCard = ({
  plan, sensors, editingPricePlanId, setEditingPricePlanId,
  onToggle, onUpdatePrice, onUpdateField,
  onAddFeature, onFeatureChange, onRemoveFeature,
  onDragEnd, onRemovePlan,
}) => (
  <SortablePlanCard key={plan.id} plan={plan}>
    {({ attributes, listeners }) => (
      <div className="relative rounded-2xl border border-gray-200 bg-white p-4 sm:p-6 shadow h-full flex flex-col min-w-0">
        {/* Drag Handle */}
        <div
          {...attributes}
          {...listeners}
          className="absolute -top-3 left-1/2 -translate-x-1/2 cursor-grab bg-white border border-gray-200 rounded-full p-1 shadow-sm hover:shadow-md"
        >
          <GripHorizontal className="w-4 h-4 text-gray-500" />
        </div>

        {/* Plan Name + Toggle + Delete */}
        <div className="flex items-center justify-between mb-3 sm:mb-4">
          <input
            type="text"
            value={plan.name ?? ""}
            onChange={e => onUpdateField(plan.id, "name", e.target.value)}
            className="text-lg sm:text-xl font-semibold text-gray-900 bg-transparent border border-dashed border-transparent hover:border-gray-300 focus:border-blue-500 focus:outline-none rounded w-full min-w-0 break-words px-1.5 py-0.5"
          />
          <div className="flex items-center gap-1">
            <button onClick={() => onToggle(plan.id)}>
              {plan.active
                ? <ToggleRight className="text-green-500 w-6 h-6" />
                : <ToggleLeft  className="text-gray-400 w-6 h-6" />}
            </button>
            <button
              onClick={() => onRemovePlan(plan.id)}
              className="p-1 text-red-500 hover:bg-red-50 rounded transition-colors"
              title="Delete Plan"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Badge */}
        <div className="flex flex-wrap gap-2 items-center">
          <h3>Badge Tag :</h3>
          <input
            type="text"
            value={plan.badge ?? ""}
            onChange={e => onUpdateField(plan.id, "badge", e.target.value)}
            className="text-lg sm:text-xl font-medium text-gray-800 bg-transparent border border-dashed border-transparent hover:border-gray-300 focus:border-blue-500 focus:outline-none rounded w-full min-w-0 break-words px-1.5 py-0.5"
          />
        </div>

        {/* Description */}
        <textarea
          value={plan.description ?? ""}
          onChange={e => onUpdateField(plan.id, "description", e.target.value)}
          className="text-sm text-gray-500 bg-transparent border border-dashed border-transparent hover:border-gray-300 focus:border-blue-500 focus:outline-none rounded w-full resize-none break-words px-1.5 py-1"
          rows={2}
        />

        {/* Price */}
        <div className="mt-4">
          <label className="text-sm text-gray-600">Monthly Price (₹)</label>
          <div className="flex items-center gap-2 mt-1">
            <input
              type="number"
              value={plan.price ?? ""}
              disabled={!plan.active || editingPricePlanId !== plan.id}
              onChange={e => onUpdatePrice(plan.id, e.target.value)}
              className={`w-full px-3 py-2 rounded-lg border border-gray-300 text-gray-900 ${
                editingPricePlanId === plan.id ? "bg-white" : "bg-gray-50"
              }`}
            />
            <button
              onClick={() => setEditingPricePlanId(editingPricePlanId === plan.id ? null : plan.id)}
              className="p-1 hover:bg-gray-100 rounded transition-colors"
              title={editingPricePlanId === plan.id ? "Save Price" : "Edit Price"}
            >
              {editingPricePlanId === plan.id
                ? <Check  className="w-4 h-4 text-green-600" />
                : <Pencil className="w-4 h-4 text-gray-400" />}
            </button>
          </div>
        </div>

        {/* Features DnD */}
        <div className="mt-5 flex-1">
          <label className="text-sm text-gray-600 mb-2 block">Features</label>
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={e => onDragEnd(e, plan.id)}
          >
            <SortableContext items={plan.features.map(f => f.id)} strategy={verticalListSortingStrategy}>
              <ul className="space-y-2">
                {plan.features.map(feature => (
                  <SortableFeatureItem
                    key={feature.id}
                    id={feature.id}
                    feature={feature}
                    onChange={val => onFeatureChange(plan.id, feature.id, val)}
                    onRemove={() => onRemoveFeature(plan.id, feature.id)}
                  />
                ))}
              </ul>
            </SortableContext>
          </DndContext>

          <button
            onClick={() => onAddFeature(plan.id)}
            className="mt-3 flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 font-medium"
          >
            <Plus className="w-4 h-4" /> Add Feature
          </button>
        </div>

        {/* Active Badge */}
        <div className="mt-6">
          <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
            plan.active ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
          }`}>
            {plan.active ? "Active" : "Disabled"}
          </span>
        </div>
      </div>
    )}
  </SortablePlanCard>
);

// ─── PaidUsersTable ───────────────────────────────────────────────────────────

const formatDate = date =>
  date ? new Date(date).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }) : "N/A";

const PlanBadge = ({ plan }) => (
  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 border border-amber-200">
    {plan}
  </span>
);

const StatusBadge = ({ isActive, small = false }) => (
  <span className={`px-2 py-${small ? "0.5" : "1"} rounded${small ? "" : ""} text-${small ? "[10px]" : "xs"} font-${small ? "bold uppercase tracking-wide border" : "medium"} ${
    isActive
      ? `bg-green-100 text-green-700${small ? " border-green-200" : ""}`
      : `bg-red-100 text-red-700${small ? " border-red-200" : ""}`
  }`}>
    {isActive ? "Active" : "Inactive"}
  </span>
);

const PaidUsersTable = ({ paidUsers, loading }) => (
  <div className="bg-white border rounded-xl shadow-sm mb-10 overflow-hidden">
    <div className="px-6 py-4 border-b border-gray-100">
      <h2 className="text-lg font-semibold text-gray-900">Paid Users</h2>
    </div>

    {/* Desktop */}
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
            <tr><td colSpan="5" className="px-6 py-8 text-center text-gray-500">Loading paid users...</td></tr>
          ) : paidUsers.length === 0 ? (
            <tr><td colSpan="5" className="px-6 py-8 text-center text-gray-500">No paid users found.</td></tr>
          ) : paidUsers.map(user => (
            <tr key={user._id} className="hover:bg-gray-50">
              <td className="px-6 py-4 font-medium text-gray-900">{user.username || "User"}</td>
              <td className="px-6 py-4 text-gray-600">{user.email}</td>
              <td className="px-6 py-4 text-center"><PlanBadge plan={user.plan} /></td>
              <td className="px-6 py-4 text-center"><StatusBadge isActive={user.isActive} /></td>
              <td className="px-6 py-4 text-center text-gray-500">{formatDate(user.createdAt)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>

    {/* Mobile */}
    <div className="md:hidden p-4">
      {loading ? (
        <div className="text-center text-gray-500 py-4">Loading paid users...</div>
      ) : paidUsers.length === 0 ? (
        <div className="text-center text-gray-500 py-4">No paid users found.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {paidUsers.map(user => (
            <div key={user._id} className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex flex-col gap-3 shadow-sm">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-gray-900">{user.username || "User"}</h3>
                  <p className="text-xs text-gray-500 break-all">{user.email}</p>
                </div>
                <StatusBadge isActive={user.isActive} small />
              </div>
              <div className="flex items-center justify-between pt-3 border-t border-slate-200 mt-auto">
                <PlanBadge plan={user.plan} />
                <span className="text-xs text-gray-400">{formatDate(user.createdAt)}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  </div>
);

// ─── Main Component ───────────────────────────────────────────────────────────

const AdminSubscription = () => {
  const { plans, savePlans, fetchPlans, loading: plansLoading } = usePricing();

  const [localPlans,          setLocalPlans]          = useState([]);
  const [saving,              setSaving]              = useState(false);
  const [editingPricePlanId,  setEditingPricePlanId]  = useState(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  // ── Queries ───────────────────────────────────────────────────────────────

  const { data: allUsers = [], isLoading: usersLoading } = useQuery({
    queryKey: ["adminUsers"],
    queryFn: () => axiosInstance.get("/api/user").then(r => r.data),
    staleTime: 300_000,
  });

  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ["adminDashboardStats"],
    queryFn: () => axiosInstance.get("/api/admin/dashboard-stat").then(r => r.data),
    staleTime: 300_000,
  });

  const loading = (usersLoading && allUsers.length === 0) || (statsLoading && !stats?.revenue) || plansLoading;

  // ── Effects ───────────────────────────────────────────────────────────────

  useEffect(() => { fetchPlans(); }, []);

  useEffect(() => {
    if (plans.length > 0) setLocalPlans(plans.map(toLocalPlan));
  }, [plans]);

  // ── Derived data ──────────────────────────────────────────────────────────

  const { paidUsers, freeUsersCount } = useMemo(() => {
    if (!allUsers.length || !plans.length) return { paidUsers: [], freeUsersCount: 0 };

    const paidPlanNames = plans
      .filter(p => p.price > 0 && p.name !== "Free")
      .map(p => p.name.toLowerCase());

    return {
      paidUsers:      allUsers.filter(u => u.plan && paidPlanNames.includes(u.plan.toLowerCase())),
      freeUsersCount: allUsers.filter(u => u.plan === "Free" && u.isAdmin === false).length,
    };
  }, [allUsers, plans]);

  // ── Plan handlers ─────────────────────────────────────────────────────────

  const togglePlan = id =>
    setLocalPlans(prev => prev.map(p => p.id === id ? { ...p, active: !p.active } : p));

  const updatePrice = (id, value) =>
    setLocalPlans(prev => prev.map(p => p.id === id ? { ...p, price: value } : p));

  const updatePlanField = (id, field, value) =>
    setLocalPlans(prev => prev.map(p => p.id === id ? { ...p, [field]: value } : p));

  const handleAddPlan = () =>
    setLocalPlans(prev => [
      ...prev,
      {
        id: Date.now(),
        name: "New Plan",
        price: 0,
        active: true,
        description: "Plan description",
        order: prev.length + 1,
        features: [{ id: generateId(), text: "New Feature" }],
      },
    ]);

  const handleRemovePlan = planId => {
    toast(t => (
      <div className="flex flex-col gap-3">
        <p className="font-semibold text-gray-800 text-sm">Are you sure you want to delete this plan?</p>
        <div className="flex justify-end gap-2 mt-1">
          <button
            className="px-3 py-1.5 text-xs font-medium bg-gray-100 hover:bg-gray-200 rounded-md text-gray-700 transition"
            onClick={() => toast.dismiss(t.id)}
          >
            Cancel
          </button>
          <button
            className="px-3 py-1.5 text-xs font-medium bg-red-500 hover:bg-red-600 text-white rounded-md transition"
            onClick={() => {
              setLocalPlans(prev =>
                prev.filter(p => p.id !== planId).map((p, i) => ({ ...p, order: i + 1 }))
              );
              toast.dismiss(t.id);
            }}
          >
            Delete
          </button>
        </div>
      </div>
    ), { duration: 5000, position: "top-center" });
  };

  // ── Feature handlers ──────────────────────────────────────────────────────

  const updateFeatures = (planId, updater) =>
    setLocalPlans(prev =>
      prev.map(p => p.id === planId ? { ...p, features: updater(p.features) } : p)
    );

  const handleFeatureChange = (planId, featureId, newValue) =>
    updateFeatures(planId, features => features.map(f => f.id === featureId ? { ...f, text: newValue } : f));

  const handleAddFeature = planId =>
    updateFeatures(planId, features => [...features, { id: generateId(), text: "New Feature" }]);

  const handleRemoveFeature = (planId, featureId) =>
    updateFeatures(planId, features => features.filter(f => f.id !== featureId));

  // ── DnD handlers ──────────────────────────────────────────────────────────

  const handleDragEnd = (event, planId) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    updateFeatures(planId, features => {
      const oldIndex = features.findIndex(f => f.id === active.id);
      const newIndex = features.findIndex(f => f.id === over.id);
      return arrayMove(features, oldIndex, newIndex);
    });
  };

  const handlePlanDragEnd = ({ active, over }) => {
    if (!over || active.id === over.id) return;
    setLocalPlans(prev => {
      const oldIndex = prev.findIndex(p => p.id === active.id);
      const newIndex = prev.findIndex(p => p.id === over.id);
      return arrayMove(prev, oldIndex, newIndex).map((p, i) => ({ ...p, order: i + 1 }));
    });
  };

  // ── Save ──────────────────────────────────────────────────────────────────

  const handleSaveChanges = async () => {
    setSaving(true);
    const plansToSave = localPlans.map(p => ({ ...p, features: p.features.map(f => f.text) }));
    const result = await savePlans(plansToSave);
    setSaving(false);

    if (result.success) {
      toast.success("Pricing changes saved successfully! The changes will now be visible on the pricing page.");
      await fetchPlans();
    } else {
      toast.error("Failed to save changes: " + result.error);
    }
  };

  // ── Shared plan card props ────────────────────────────────────────────────

  const planCardProps = {
    sensors,
    editingPricePlanId,
    setEditingPricePlanId,
    onToggle:        togglePlan,
    onUpdatePrice:   updatePrice,
    onUpdateField:   updatePlanField,
    onAddFeature:    handleAddFeature,
    onFeatureChange: handleFeatureChange,
    onRemoveFeature: handleRemoveFeature,
    onDragEnd:       handleDragEnd,
    onRemovePlan:    handleRemovePlan,
  };

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-6 overflow-x-hidden">
      <Toaster position="top-right" />

      {/* Header */}
      <div className="mb-6 sm:mb-10">
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">Subscription Management</h1>
        <p className="text-sm sm:text-base text-slate-600 mt-1 sm:mt-2">
          Admin can enable, disable and update pricing for subscription plans
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6 mb-6 sm:mb-10">
        <StatCard label="Total Revenue">
          ₹{stats?.revenue?.total?.toLocaleString() || 0}
          {stats?.revenue?.change !== 0 && (
            <span className={`text-xs sm:text-sm ml-2 ${stats?.revenue?.change >= 0 ? "text-green-500" : "text-red-500"}`}>
              {stats?.revenue?.change > 0 ? "+" : ""}{stats?.revenue?.change}%
            </span>
          )}
        </StatCard>
        <StatCard label="Active Subscribers">
          {paidUsers.length} <span className="text-gray-400 text-xs sm:text-sm">(Pro)</span>
        </StatCard>
        <StatCard label="Free Users">
          {freeUsersCount.toLocaleString()}
          <span className="text-gray-400 text-xs sm:text-sm ml-2">(Leads)</span>
        </StatCard>
      </div>

      {/* Plans Grid */}
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handlePlanDragEnd}>
        <SortableContext items={localPlans.map(p => p.id)} strategy={rectSortingStrategy}>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
            {localPlans.map(plan => (
              <PlanCard key={plan.id} plan={plan} {...planCardProps} />
            ))}

            {/* Add Plan */}
            <div
              onClick={handleAddPlan}
              className="rounded-2xl border-2 border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100 p-4 sm:p-6 shadow h-full flex flex-col items-center justify-center cursor-pointer transition-colors min-h-[300px]"
            >
              <div className="flex flex-col items-center justify-center opacity-60">
                <Plus className="w-10 h-10 text-gray-500 mb-2" />
                <span className="text-gray-600 font-medium text-lg">Add New Plan</span>
              </div>
            </div>
          </div>
        </SortableContext>
      </DndContext>

      {/* Save */}
      <div className="mt-12 flex justify-end">
        <button
          onClick={handleSaveChanges}
          disabled={saving}
          className="px-6 py-3 rounded-xl bg-blue-600 text-white font-medium hover:bg-blue-700 mb-10 disabled:bg-gray-400"
        >
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </div>

      {/* Paid Users */}
      <PaidUsersTable paidUsers={paidUsers} loading={loading} />
    </div>
  );
};

export default AdminSubscription;