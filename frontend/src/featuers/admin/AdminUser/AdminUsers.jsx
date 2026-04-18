import React, { useState, useMemo, useCallback, useEffect } from "react";
import {
  Trash2, Check, X, AlertCircle, Search,
  UserCheck, Users, Crown, RefreshCw,
  ChevronLeft, ChevronRight,
} from "lucide-react";
import AdminNavbar from "../AdminNavBar/AdminNavBar";
import axiosInstance from "../../../api/axios";
import toast, { Toaster } from "react-hot-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

// ─── Constants ────────────────────────────────────────────────────────────────

const ITEMS_PER_PAGE = 20;

const ROLE_OPTIONS = [
  { value: "all",     label: "All Roles",     dot: "#6366f1" },
  { value: "admin",   label: "Admin",          dot: "#8b5cf6" },
  { value: "user",    label: "User",           dot: "#3b82f6" },
  { value: "pending", label: "Pending Admin",  dot: "#f59e0b" },
];

const STATUS_OPTIONS = [
  { value: "all",      label: "All Status", dot: "#22c55e" },
  { value: "active",   label: "Active",     dot: "#22c55e" },
  { value: "inactive", label: "Inactive",   dot: "#ee4e32" },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function safeDate(val) {
  if (!val) return "";
  try { return new Date(val).toISOString().split("T")[0]; }
  catch { return ""; }
}

function planOptions(plansData) {
  const names = (plansData || []).map(p => p?.name).filter(Boolean);
  return Array.from(new Set(["Free", ...names]));
}

function filterAndSort(users, { search, roleFilter, planFilter, statusFilter }) {
  const q = search.toLowerCase();
  return users
    .filter(u => {
      if (q && !u.username?.toLowerCase().includes(q) && !u.email?.toLowerCase().includes(q)) return false;
      if (roleFilter === "admin"   && !u.isAdmin) return false;
      if (roleFilter === "user"    && (u.isAdmin || u.adminRequestStatus === "pending")) return false;
      if (roleFilter === "pending" && u.adminRequestStatus !== "pending") return false;
      if (planFilter !== "all"     && (u.plan || "Free").toLowerCase() !== planFilter) return false;
      const active = u.isActive !== false;
      if (statusFilter === "active"   && !active) return false;
      if (statusFilter === "inactive" &&  active) return false;
      return true;
    })
    .sort((a, b) => {
      const aPending = a.adminRequestStatus === "pending";
      const bPending = b.adminRequestStatus === "pending";
      if (aPending !== bPending) return aPending ? -1 : 1;
      return new Date(b.createdAt) - new Date(a.createdAt);
    });
}

// ─── CustomDropdown ───────────────────────────────────────────────────────────

function CustomDropdown({ icon, options, value, onChange }) {
  const [open, setOpen] = useState(false);
  const ref = React.useRef(null);
  const selected = options.find(o => o.value === value);

  useEffect(() => {
    const handler = e => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen(v => !v)}
        className={`flex items-center gap-2 px-3.5 py-2.5 border-2 rounded-xl bg-white transition-all min-w-[148px] text-sm font-medium text-gray-700 ${
          open ? "border-indigo-400 bg-indigo-50" : "border-gray-200 hover:border-indigo-400 hover:bg-indigo-50"
        }`}
      >
        {icon}
        <span className="flex-1 text-left">{selected?.label}</span>
        <svg
          className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
          fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>

      {open && (
        <div className="absolute top-[calc(100%+6px)] left-0 min-w-full bg-white border-2 border-indigo-100 rounded-xl shadow-lg z-50 overflow-hidden">
          {options.map(opt => (
            <button
              key={opt.value}
              type="button"
              onClick={() => { onChange(opt.value); setOpen(false); }}
              className={`flex items-center gap-2.5 w-full px-3.5 py-2.5 text-sm text-left transition-colors whitespace-nowrap ${
                value === opt.value
                  ? "bg-indigo-50 text-indigo-700 font-medium"
                  : "text-gray-700 hover:bg-indigo-50 hover:text-indigo-700"
              }`}
            >
              <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: opt.dot || "#9ca3af" }} />
              <span className="flex-1">{opt.label}</span>
              {value === opt.value && (
                <svg className="w-3.5 h-3.5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path d="m5 12 5 5L20 7" />
                </svg>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── DeleteModal ──────────────────────────────────────────────────────────────

function DeleteModal({ userName, onCancel, onConfirm }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm p-6 text-center">
        <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4 text-red-600">
          <AlertCircle size={24} />
        </div>
        <h2 className="text-xl font-bold mb-2 text-gray-800">Delete {userName}?</h2>
        <p className="text-gray-500 mb-6">
          Are you sure you want to delete{" "}
          <span className="font-semibold text-gray-700">{userName}</span>?{" "}
          This action cannot be undone.
        </p>
        <div className="flex justify-center gap-3">
          <button onClick={onCancel} className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 font-medium">
            Cancel
          </button>
          <button onClick={onConfirm} className="px-4 py-2 text-white bg-red-600 rounded-lg hover:bg-red-700 font-medium">
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── RoleBadge ────────────────────────────────────────────────────────────────

function RoleBadge({ user, onToggle }) {
  if (user.username === "Super Admin") {
    return (
      <span className="px-3 py-1 rounded-full text-xs font-semibold bg-purple-100 text-purple-700 border border-purple-200 inline-block w-max">
        Super Admin
      </span>
    );
  }
  return (
    <>
      <span
        onClick={onToggle}
        title={`Click to switch to ${user.isAdmin ? "User" : "Admin"}`}
        className={`px-3 py-1 rounded-full text-xs font-semibold cursor-pointer transition-all hover:scale-105 active:scale-95 inline-block w-max ${
          user.isAdmin
            ? "bg-purple-100 text-purple-700 border border-purple-200 hover:bg-purple-200"
            : "bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100"
        }`}
      >
        {user.isAdmin ? "Admin" : "User"}
      </span>
      {user.adminRequestStatus === "pending" && (
        <div className="mt-2 text-[10px] font-bold text-amber-600 bg-amber-50 rounded-full px-2 py-1 inline-block border border-amber-200">
          Pending Request
        </div>
      )}
    </>
  );
}

// ─── ActiveToggle ─────────────────────────────────────────────────────────────

function ActiveToggle({ user, onToggle }) {
  if (user.username === "Super Admin") {
    return (
      <span className="px-3 py-1 rounded-full text-xs font-semibold bg-indigo-100 text-indigo-700 border border-indigo-200">
        Primary
      </span>
    );
  }
  return (
    <>
      <button
        onClick={onToggle}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${
          user.isActive ? "bg-indigo-600" : "bg-gray-200"
        }`}
      >
        <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${user.isActive ? "translate-x-6" : "translate-x-1"}`} />
      </button>
      <div className="text-[10px] text-gray-400 mt-1 whitespace-nowrap">
        {user.isActive ? "Active" : "Inactive"}
      </div>
    </>
  );
}

// ─── UserRow (desktop) ────────────────────────────────────────────────────────

function UserRow({ u, onToggleRole, onToggleActive, onApprove, onReject, onDelete }) {
  return (
    <tr className="hover:bg-gray-50">
      <td className="px-6 py-4 flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-lg uppercase shrink-0">
          {u.username ? u.username.charAt(0) : "U"}
        </div>
        <div>
          <p className="font-semibold text-gray-900">{u.username || "No Name"}</p>
          <p className="text-xs text-gray-500">{u.email}</p>
        </div>
      </td>

      <td className="px-6 py-4 text-center">
        <RoleBadge user={u} onToggle={() => onToggleRole(u)} />
      </td>

      <td className="px-6 py-4 text-center">
        <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${
          u.plan === "Pro" ? "bg-amber-100 text-amber-800 border-amber-200" : "bg-gray-100 text-gray-700 border-gray-200"
        }`}>
          {u.plan || "Free"}
        </span>
      </td>

      <td className="px-6 py-4 text-center">
        <ActiveToggle user={u} onToggle={() => onToggleActive(u)} />
      </td>

      <td className="px-6 py-4 text-center text-gray-500">
        {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : "N/A"}
      </td>

      <td className="px-6 py-4">
        <div className="flex justify-center gap-2">
          {u.adminRequestStatus === "pending" && (
            <>
              <button onClick={() => onApprove(u)} title="Approve Admin Request" className="p-2 rounded-lg hover:bg-green-50 text-green-600 transition-colors">
                <Check size={18} />
              </button>
              <button onClick={() => onReject(u)} title="Reject Admin Request" className="p-2 rounded-lg hover:bg-orange-50 text-orange-500 transition-colors">
                <X size={18} />
              </button>
            </>
          )}
          {u.username !== "Super Admin" ? (
            <button onClick={() => onDelete(u._id)} title="Delete User" className="p-2 rounded-lg hover:bg-red-50 text-red-500 transition-colors">
              <Trash2 size={18} />
            </button>
          ) : (
            <span className="text-xs text-slate-400 italic">—</span>
          )}
        </div>
      </td>
    </tr>
  );
}

// ─── UserCard (mobile) ────────────────────────────────────────────────────────

function UserCard({ u, onToggleRole, onToggleActive, onApprove, onReject, onDelete }) {
  return (
    <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 shadow-sm flex flex-col gap-3">
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-lg uppercase shrink-0">
            {u.username ? u.username.charAt(0) : "U"}
          </div>
          <div>
            <p className="font-semibold text-gray-900 text-sm">{u.username || "No Name"}</p>
            <p className="text-xs text-gray-500 break-all">{u.email}</p>
          </div>
        </div>

        <div className="flex flex-col items-end gap-1">
          {u.username === "Super Admin" ? (
            <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-indigo-100 text-indigo-700 border border-indigo-200">
              Primary
            </span>
          ) : (
            <>
              <button
                onClick={() => onToggleActive(u)}
                className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus:outline-none ${
                  u.isActive ? "bg-indigo-600" : "bg-gray-200"
                }`}
              >
                <span className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${u.isActive ? "translate-x-5" : "translate-x-1"}`} />
              </button>
              <span className="text-[10px] text-slate-400 font-medium">{u.isActive ? "Active" : "Inactive"}</span>
            </>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between mt-1 pt-3 border-t border-slate-200 gap-2">
        <div className="flex gap-2 flex-wrap">
          {u.username === "Super Admin" ? (
            <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide border bg-purple-100 text-purple-700 border-purple-200 inline-block w-max">
              Super Admin
            </span>
          ) : (
            <span
              onClick={() => onToggleRole(u)}
              title={`Click to switch to ${u.isAdmin ? "User" : "Admin"}`}
              className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide border cursor-pointer transition-all active:scale-95 inline-block w-max ${
                u.isAdmin ? "bg-purple-100 text-purple-700 border-purple-200" : "bg-blue-50 text-blue-700 border-blue-200"
              }`}
            >
              {u.isAdmin ? "Admin" : "User"}
            </span>
          )}
          <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide border ${
            u.plan === "Pro" ? "bg-amber-100 text-amber-800 border-amber-200" : "bg-gray-100 text-gray-700 border-gray-200"
          }`}>
            {u.plan || "Free"}
          </span>
          {u.adminRequestStatus === "pending" && (
            <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide border bg-amber-50 text-amber-700 border-amber-200 whitespace-nowrap">
              Pending Request
            </span>
          )}
        </div>

        <div className="flex gap-2">
          {u.adminRequestStatus === "pending" && (
            <>
              <button onClick={() => onApprove(u)} className="p-1.5 rounded-lg bg-green-50 text-green-600 hover:bg-green-100 transition-colors" title="Approve">
                <Check size={16} />
              </button>
              <button onClick={() => onReject(u)} className="p-1.5 rounded-lg bg-orange-50 text-orange-500 hover:bg-orange-100 transition-colors" title="Reject">
                <X size={16} />
              </button>
            </>
          )}
          {u.username !== "Super Admin" ? (
            <button onClick={() => onDelete(u._id)} className="p-1.5 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 transition-colors" title="Delete User">
              <Trash2 size={16} />
            </button>
          ) : (
            <span className="text-xs text-slate-400 italic">—</span>
          )}
        </div>
      </div>

      <div className="mt-3 pt-3 border-t border-slate-200">
        <div className="flex justify-between items-center">
          <span className="text-[10px] font-medium text-slate-400 uppercase tracking-wide">Created At</span>
          <span className="text-xs font-medium text-slate-700">
            {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : "N/A"}
          </span>
        </div>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function AdminUsers({ head = "Manage Users" }) {
  const queryClient = useQueryClient();

  // ── Queries ──────────────────────────────────────────────────────────────────

  const { data: users = [], isLoading, isError } = useQuery({
    queryKey: ["adminUsers"],
    queryFn: () => axiosInstance.get("/api/user").then(r => r.data),
    staleTime: 300_000,
  });

  const { data: plansData = [] } = useQuery({
    queryKey: ["plans"],
    queryFn: () => axiosInstance.get("/api/plans").then(r => r.data),
    staleTime: 300_000,
  });

  // ── Filters / Pagination State ────────────────────────────────────────────────

  const [search,       setSearch]       = useState("");
  const [roleFilter,   setRoleFilter]   = useState("all");
  const [planFilter,   setPlanFilter]   = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [page,         setPage]         = useState(1);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  // Reset to page 1 on any filter change
  useEffect(() => { setPage(1); }, [search, roleFilter, planFilter, statusFilter]);

  // ── Derived Data ──────────────────────────────────────────────────────────────

  const dynamicPlanOptions = useMemo(() => {
    const names = planOptions(plansData);
    return [
      { value: "all", label: "All Plans", dot: "#8b5cf6" },
      ...names.map(name => ({
        value: name.toLowerCase(),
        label: name,
        dot: name === "Pro" ? "#f59e0b" : "#9ca3af",
      })),
    ];
  }, [plansData]);

  const filteredUsers = useMemo(
    () => filterAndSort(users, { search, roleFilter, planFilter, statusFilter }),
    [users, search, roleFilter, planFilter, statusFilter]
  );

  const totalPages    = Math.ceil(filteredUsers.length / ITEMS_PER_PAGE);
  const paginatedUsers = useMemo(() => {
    const start = (page - 1) * ITEMS_PER_PAGE;
    return filteredUsers.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredUsers, page]);

  const hasActiveFilters = roleFilter !== "all" || planFilter !== "all" || statusFilter !== "all" || search;

  const userToDelete = deleteConfirmId ? users.find(u => u._id === deleteConfirmId) : null;

  // ── Mutations ─────────────────────────────────────────────────────────────────

  const invalidateUsers = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ["adminUsers"] });
  }, [queryClient]);

  const updateUser = useMutation({
    mutationFn: ({ id, data }) => axiosInstance.put(`/api/user/${id}`, data),
    onSuccess: () => { invalidateUsers(); queryClient.invalidateQueries({ queryKey: ["adminDashboardStats"] }); },
    onError:   err => toast.error(err.response?.data?.message || "Failed to update user"),
  });

  const approveAdmin = useMutation({
    mutationFn: id => axiosInstance.put(`/api/user/approve-admin/${id}`),
    onSuccess: () => { invalidateUsers(); toast.success("Admin request approved"); },
    onError:   err => toast.error(err.response?.data?.message || "Failed to approve admin"),
  });

  const rejectAdmin = useMutation({
    mutationFn: id => axiosInstance.put(`/api/user/reject-admin/${id}`),
    onSuccess: () => { invalidateUsers(); toast.success("Admin request rejected"); },
    onError:   err => toast.error(err.response?.data?.message || "Failed to reject admin"),
  });

  const deleteUser = useMutation({
    mutationFn: id => axiosInstance.delete(`/api/user/${id}`),
    onSuccess: () => {
      invalidateUsers();
      queryClient.invalidateQueries({ queryKey: ["adminDashboardStats"] });
      queryClient.invalidateQueries({ queryKey: ["adminAnalytics"] });
      toast.success("User deleted successfully");
      setDeleteConfirmId(null);
    },
    onError: err => toast.error(err.response?.data?.message || "Failed to delete user"),
  });

  // ── Handlers ──────────────────────────────────────────────────────────────────

  const handleToggleRole = useCallback(user => {
    updateUser.mutate({ id: user._id || user.id, data: { isAdmin: !user.isAdmin } });
  }, [updateUser]);

  const handleToggleActive = useCallback(user => {
    const newStatus = !user.isActive;
    const label = newStatus ? "Activate" : "Deactivate";
    const confirmColor = newStatus ? "bg-green-600 hover:bg-green-700" : "bg-amber-600 hover:bg-amber-700";
    const iconColor = newStatus ? "text-green-600" : "text-amber-600";
    const bgColor = newStatus ? "bg-green-100" : "bg-amber-100";

    toast(t => (
      <div className="flex flex-col gap-3 min-w-[280px]">
        <div className="flex items-start gap-3">
          <div className={`p-2 rounded-lg ${bgColor}`}>
            <AlertCircle className={`w-5 h-5 ${iconColor}`} />
          </div>
          <div>
            <p className="font-semibold text-gray-800 text-sm">{label} User?</p>
            <p className="text-xs text-gray-500 mt-1">
              Are you sure you want to {label.toLowerCase()}{" "}
              <span className="font-medium text-gray-700">{user.username || user.email}</span>?
            </p>
          </div>
        </div>
        <div className="flex gap-2 justify-end mt-1">
          <button
            onClick={() => toast.dismiss(t.id)}
            className="px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => { toast.dismiss(t.id); updateUser.mutate({ id: user._id || user.id, data: { isActive: newStatus } }); }}
            className={`px-4 py-1.5 text-xs font-bold text-white rounded-lg transition-all shadow-sm ${confirmColor}`}
          >
            Confirm
          </button>
        </div>
      </div>
    ), {
      duration: 6000,
      position: "top-center",
      style: {
        background: "#fff", color: "#333", padding: "16px",
        borderRadius: "16px", border: "1px solid #e2e8f0",
        boxShadow: "0 10px 15px -3px rgba(0,0,0,.1),0 4px 6px -2px rgba(0,0,0,.05)",
      },
    });
  }, [updateUser]);

  const handleApprove = useCallback(user => approveAdmin.mutate(user._id || user.id), [approveAdmin]);
  const handleReject  = useCallback(user => rejectAdmin.mutate(user._id || user.id),  [rejectAdmin]);
  const handleDelete  = useCallback(id   => setDeleteConfirmId(id), []);
  const confirmDelete = useCallback(()   => deleteConfirmId && deleteUser.mutate(deleteConfirmId), [deleteConfirmId, deleteUser]);

  const clearFilters = useCallback(() => {
    setSearch(""); setRoleFilter("all"); setPlanFilter("all"); setStatusFilter("all");
  }, []);

  // ── Early returns (after all hooks) ───────────────────────────────────────────

  if (isLoading) return <div className="p-6">Loading users...</div>;
  if (isError)   return <div className="p-6 text-red-500">Failed to fetch users</div>;

  // ── Shared action props ───────────────────────────────────────────────────────

  const actionProps = {
    onToggleRole:   handleToggleRole,
    onToggleActive: handleToggleActive,
    onApprove:      handleApprove,
    onReject:       handleReject,
    onDelete:       handleDelete,
  };

  // ── Render ────────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-slate-50">
      <Toaster />
      <div className="p-4 sm:p-6">
        <h1 className="text-2xl font-bold mb-6 text-gray-800">{head}</h1>

        {/* Search + Filters */}
        <div className="mb-6">
          <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-4">
            <div className="flex-1 min-w-0">
              <div className="relative group">
                <Search className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5 group-hover:text-gray-500 transition-colors" />
                <input
                  type="text"
                  placeholder="Search users..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="w-full pl-10 sm:pl-12 pr-3 sm:pr-4 py-2.5 sm:py-3.5 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 text-sm text-gray-700 bg-white hover:bg-gray-50 hover:border-gray-300 transition-all placeholder:text-gray-400"
                />
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              <CustomDropdown value={roleFilter}   onChange={setRoleFilter}   icon={<UserCheck className="w-4 h-4 text-indigo-500" />} options={ROLE_OPTIONS} />
              <CustomDropdown value={planFilter}   onChange={setPlanFilter}   icon={<Crown     className="w-4 h-4 text-purple-500" />} options={dynamicPlanOptions} />
              <CustomDropdown value={statusFilter} onChange={setStatusFilter} icon={<Users     className="w-4 h-4 text-green-500" />}  options={STATUS_OPTIONS} />

              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="flex items-center gap-2 px-4 sm:px-5 py-2.5 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span className="hidden sm:inline">Clear All</span>
                  <span className="sm:hidden">Clear</span>
                </button>
              )}
            </div>
          </div>

          {hasActiveFilters && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-medium text-gray-500">Active filters:</span>
                {roleFilter   !== "all" && <span className="px-3 py-1 bg-blue-100   text-blue-700   rounded-full text-xs font-medium">Role: {roleFilter}</span>}
                {planFilter   !== "all" && <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">Plan: {planFilter}</span>}
                {statusFilter !== "all" && <span className="px-3 py-1 bg-green-100  text-green-700  rounded-full text-xs font-medium">Status: {statusFilter}</span>}
                {search && (
                  <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium flex items-center gap-1">
                    <Search className="w-3 h-3" />"{search}"
                  </span>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Desktop Table */}
        <div className="hidden md:block bg-white border rounded-xl overflow-x-auto shadow-sm">
          <table className="w-full text-sm min-w-max">
            <thead className="bg-gray-50 text-gray-500">
              <tr>
                <th className="px-6 py-4 text-left">User Details</th>
                <th className="px-6 py-4 text-center">Role</th>
                <th className="px-6 py-4 text-center">Plan</th>
                <th className="px-6 py-4 text-center">Status</th>
                <th className="px-6 py-4 text-center">Created At</th>
                <th className="px-6 py-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {paginatedUsers.map(u => (
                <UserRow key={u._id} u={u} {...actionProps} />
              ))}
              {filteredUsers.length === 0 && (
                <tr>
                  <td colSpan="6" className="px-6 py-8 text-center text-gray-500">No users found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {filteredUsers.length > ITEMS_PER_PAGE && (
          <div className="flex flex-col sm:flex-row justify-between items-center mt-6 p-4 bg-white border border-gray-200 rounded-xl shadow-sm gap-4">
            <span className="text-sm text-gray-500 font-medium">
              Showing {(page - 1) * ITEMS_PER_PAGE + 1} to {Math.min(page * ITEMS_PER_PAGE, filteredUsers.length)} of {filteredUsers.length} users
            </span>
            <div className="flex items-center gap-2">
              <button
                disabled={page === 1}
                onClick={() => setPage(p => p - 1)}
                className="flex items-center gap-1 px-3 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                aria-label="Previous Page"
              >
                <ChevronLeft className="w-4 h-4 text-gray-600" />
                <span className="text-sm font-medium text-gray-700 hidden sm:inline">Prev</span>
              </button>
              <div className="px-4 py-2 bg-indigo-50 border border-indigo-100 rounded-lg text-sm font-bold text-indigo-700">
                Page {page} of {totalPages}
              </div>
              <button
                disabled={page === totalPages}
                onClick={() => setPage(p => p + 1)}
                className="flex items-center gap-1 px-3 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                aria-label="Next Page"
              >
                <span className="text-sm font-medium text-gray-700 hidden sm:inline">Next</span>
                <ChevronRight className="w-4 h-4 text-gray-600" />
              </button>
            </div>
          </div>
        )}

        {/* Mobile Cards */}
        <div className="md:hidden p-4">
          {filteredUsers.length === 0 ? (
            <div className="text-center text-gray-500 py-4">No users found.</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {paginatedUsers.map(u => (
                <UserCard key={u._id} u={u} {...actionProps} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <DeleteModal
          userName={userToDelete?.username || userToDelete?.email || "this user"}
          onCancel={() => setDeleteConfirmId(null)}
          onConfirm={confirmDelete}
        />
      )}
    </div>
  );
}