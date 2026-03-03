import React, { useState, useEffect } from "react";
import { Pencil, Trash2, Check, X, AlertCircle, Search, Filter, UserCheck, Users, Crown, RefreshCw } from "lucide-react";
import AdminNavbar from "../AdminNavBar/AdminNavBar";
import axiosInstance from "../../../api/axios";
import toast, { Toaster } from "react-hot-toast";

export default function AdminUsers({ head = "Manage Users" }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");

  // Filter States
  const [roleFilter, setRoleFilter] = useState("all");
  const [planFilter, setPlanFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  // Edit Modal State
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [editFormData, setEditFormData] = useState({
    username: "",
    email: "",
    isAdmin: false,
    createdAt: "",
    plan: "Free",
  });

  // Delete Confirmation State
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axiosInstance.get("/api/user");
      setUsers(response.data);
      setLoading(false);
    } catch (err) {
      setError("Failed to fetch users");
      setLoading(false);
      console.error(err);
      toast.error("Failed to load users");
    }
  };

  /* ================= HANDLERS ================= */

  const handleEditClick = (user) => {
    setEditingUser(user);
    // Format date to YYYY-MM-DD for input[type="date"]
    // Handle cases where createdAt might be missing or invalid
    let dateStr = "";
    if (user.createdAt) {
      try {
        dateStr = new Date(user.createdAt).toISOString().split("T")[0]
      } catch (e) {
        console.error("Invalid date", user.createdAt);
      }
    }

    setEditFormData({
      username: user.username || "",
      email: user.email || "",
      isAdmin: user.isAdmin || false,
      createdAt: dateStr,
      plan: user.plan || "Free",
    });
    setIsEditModalOpen(true);
  };

  const handleEditChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEditFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleRoleChange = (e) => {
    setEditFormData((prev) => ({
      ...prev,
      isAdmin: e.target.value === "true"
    }))
  }

  const handleUpdateUser = async (e) => {
    e.preventDefault();
    if (!editingUser) return;

    try {
      const response = await axiosInstance.put(
        `/api/user/${editingUser._id}`,
        editFormData
      );

      setUsers((prev) =>
        prev.map((u) => (u._id === editingUser._id ? response.data.user : u))
      );
      setIsEditModalOpen(false);
      setEditingUser(null);
      toast.success("User updated successfully");
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to update user");
    }
  };

  const handleToggleActive = async (user) => {
    const newStatus = !user.isActive;
    try {
      // Optimistic update
      setUsers(prev => prev.map(u => u._id === user._id ? { ...u, isActive: newStatus } : u));

      await axiosInstance.put(`/api/user/${user._id}`,
        { isActive: newStatus }
      );

      toast.success(`${user.username || user.email} ${newStatus ? 'activated' : 'deactivated'} successfully`);
    } catch (err) {
      console.error(err);
      // Revert optimistic update
      setUsers(prev => prev.map(u => u._id === user._id ? { ...u, isActive: user.isActive } : u));
      toast.error(`Failed to update ${user.username || user.email}'s status`);
    }
  }

  const handleToggleRole = async (user) => {
    const newIsAdmin = !user.isAdmin;
    try {
      // Optimistic update
      setUsers(prev => prev.map(u => u._id === user._id ? { ...u, isAdmin: newIsAdmin } : u));

      await axiosInstance.put(`/api/user/${user._id}`, {
        isAdmin: newIsAdmin
      });

      toast.success(`${user.username || user.email} is now an ${newIsAdmin ? 'Admin' : 'User'}`);
    } catch (err) {
      console.error(err);
      // Revert optimistic update
      setUsers(prev => prev.map(u => u._id === user._id ? { ...u, isAdmin: user.isAdmin } : u));
      toast.error(`Failed to update ${user.username || user.email}'s role`);
    }
  }

  const handleApproveAdmin = async (user) => {
    try {
      setUsers(prev => prev.map(u => u._id === user._id ? { ...u, isAdmin: true, adminRequestStatus: 'approved' } : u));
      await axiosInstance.put(`/api/user/approve-admin/${user._id}`);
      toast.success(`${user.username || user.email} admin request approved`);
    } catch (err) {
      console.error(err);
      fetchUsers(); // revert optimistic update
      toast.error(`Failed to approve admin request for ${user.username || user.email}`);
    }
  };

  const handleRejectAdmin = async (user) => {
    try {
      setUsers(prev => prev.map(u => u._id === user._id ? { ...u, adminRequestStatus: 'rejected' } : u));
      await axiosInstance.put(`/api/user/reject-admin/${user._id}`);
      toast.success(`${user.username || user.email} admin request rejected`);
    } catch (err) {
      console.error(err);
      fetchUsers(); // revert optimistic update
      toast.error(`Failed to reject admin request for ${user.username || user.email}`);
    }
  };

  const handleDeleteClick = (id) => {
    setDeleteConfirmId(id);
  };

  const confirmDelete = async () => {
    if (!deleteConfirmId) return;
    const userToDelete = users.find(u => u._id === deleteConfirmId);
    const userName = userToDelete?.username || userToDelete?.email || "User";

    try {
      await axiosInstance.delete(`/api/user/${deleteConfirmId}`);
      setUsers((prev) => prev.filter((u) => u._id !== deleteConfirmId));
      setDeleteConfirmId(null);
      toast.success(`${userName} deleted successfully`);
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || `Failed to delete ${userName}`);
    }
  };

  if (loading) return <div className="p-6">Loading users...</div>;
  if (error) return <div className="p-6 text-red-500">{error}</div>;

  const filteredUsers = users.filter((u) => {
    // Search filter
    const matchesSearch = u.username?.toLowerCase().includes(search.toLowerCase()) ||
      u.email?.toLowerCase().includes(search.toLowerCase());

    // Role filter
    const matchesRole = roleFilter === "all" ||
      (roleFilter === "admin" && u.isAdmin) ||
      (roleFilter === "user" && !u.isAdmin && u.adminRequestStatus !== 'pending') ||
      (roleFilter === "pending" && u.adminRequestStatus === 'pending');

    // Plan filter
    const matchesPlan = planFilter === "all" ||
      (planFilter === "free" && (!u.plan || u.plan.toLowerCase() === "free")) ||
      (planFilter === "pro" && u.plan?.toLowerCase() === "pro");

    // Status filter
    const matchesStatus = statusFilter === "all" ||
      (statusFilter === "active" && u.isActive) ||
      (statusFilter === "inactive" && !u.isActive);

    return matchesSearch && matchesRole && matchesPlan && matchesStatus;
  }).sort((a, b) => {
    if (a.adminRequestStatus === 'pending' && b.adminRequestStatus !== 'pending') return -1;
    if (a.adminRequestStatus !== 'pending' && b.adminRequestStatus === 'pending') return 1;
    return 0;
  });

  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-6">
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6 text-gray-800">{head}</h1>

        {/* Modern Search and Filter Box */}
        <div className="mb-6">
          {/* Search Bar and Filters Row */}
          <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-4">
            {/* Search Bar */}
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

            {/* Filter Pills/Cards */}
            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              {/* Role Filter */}
              <div className="relative group">
                <div className="flex items-center gap-2 px-3 sm:px-4 py-2.5 border-2 border-gray-200 rounded-xl bg-white hover:border-blue-400 hover:bg-blue-50 transition-colors">
                  <UserCheck className="w-4 h-4 text-gray-500 group-hover:text-blue-600 transition-colors" />
                  <select
                    value={roleFilter}
                    onChange={(e) => setRoleFilter(e.target.value)}
                    className="bg-transparent focus:outline-none text-sm font-medium text-gray-700 cursor-pointer pr-1 sm:pr-2"
                  >
                    <option value="all">All Roles</option>
                    <option value="admin">Admin</option>
                    <option value="user">User</option>
                    <option value="pending">Pending Admin</option>
                  </select>
                </div>
              </div>

              {/* Plan Filter */}
              <div className="relative group">
                <div className="flex items-center gap-2 px-3 sm:px-4 py-2.5 border-2 border-gray-200 rounded-xl bg-white hover:border-purple-400 hover:bg-purple-50 transition-colors">
                  <Crown className="w-4 h-4 text-gray-500 group-hover:text-purple-600 transition-colors" />
                  <select
                    value={planFilter}
                    onChange={(e) => setPlanFilter(e.target.value)}
                    className="bg-transparent focus:outline-none text-sm font-medium text-gray-700 cursor-pointer pr-1 sm:pr-2"
                  >
                    <option value="all">All Plans</option>
                    <option value="free">Free</option>
                    <option value="pro">Pro</option>
                  </select>
                </div>
              </div>

              {/* Status Filter */}
              <div className="relative group">
                <div className="flex items-center gap-2 px-3 sm:px-4 py-2.5 border-2 border-gray-200 rounded-xl bg-white hover:border-green-400 hover:bg-green-50 transition-colors">
                  <Users className="w-4 h-4 text-gray-500 group-hover:text-green-600 transition-colors" />
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="bg-transparent focus:outline-none text-sm font-medium text-gray-700 cursor-pointer pr-1 sm:pr-2"
                  >
                    <option value="all">All Status</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>

              {/* Clear Filters Button */}
              {(roleFilter !== "all" || planFilter !== "all" || statusFilter !== "all" || search) && (
                <button
                  onClick={() => {
                    setRoleFilter("all");
                    setPlanFilter("all");
                    setStatusFilter("all");
                    setSearch("");
                  }}
                  className="flex items-center gap-2 px-4 sm:px-5 py-2.5 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span className="hidden sm:inline">Clear All</span>
                  <span className="sm:hidden">Clear</span>
                </button>
              )}
            </div>
          </div>

          {/* Active Filters Summary */}
          {(roleFilter !== "all" || planFilter !== "all" || statusFilter !== "all" || search) && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-medium text-gray-500">Active filters:</span>
                {roleFilter !== "all" && (
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                    Role: {roleFilter}
                  </span>
                )}
                {planFilter !== "all" && (
                  <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">
                    Plan: {planFilter}
                  </span>
                )}
                {statusFilter !== "all" && (
                  <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                    Status: {statusFilter}
                  </span>
                )}
                {search && (
                  <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium flex items-center gap-1">
                    <Search className="w-3 h-3" />
                    "{search}"
                  </span>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="hidden md:block bg-white border rounded-xl overflow-hidden shadow-sm">

          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-500">
              <tr>
                <th className="px-6 py-4 text-left">User Details</th>
                <th className="px-6 py-4 text-center">Role</th>
                <th className="px-6 py-4 text-center">Plan</th>
                <th className="px-6 py-4 text-center">Status</th>
                {/* <th className="px-6 py-4 text-center">User ID</th> */}
                <th className="px-6 py-4 text-center">Created At</th>
                <th className="px-6 py-4 text-center">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y">
              {filteredUsers.map((u) => (
                <tr key={u._id} className="hover:bg-gray-50">
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
                    {u.username === "Super Admin" ? (
                      <span className="px-3 py-1 rounded-full text-xs font-semibold bg-purple-100 text-purple-700 border border-purple-200 whitespace-nowrap" style={{ display: 'inline-block', width: 'max-content' }}>
                        Super Admin
                      </span>
                    ) : (
                      <span
                        onClick={() => handleToggleRole(u)}
                        title={`Click to switch to ${u.isAdmin ? 'User' : 'Admin'}`}
                        className={`px-3 py-1 rounded-full text-xs font-semibold cursor-pointer transition-all hover:scale-105 active:scale-95 whitespace-nowrap ${u.isAdmin
                          ? "bg-purple-100 text-purple-700 border border-purple-200 hover:bg-purple-200"
                          : "bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100"
                          }`}
                        style={{ display: 'inline-block', width: 'max-content' }}
                      >
                        {u.isAdmin ? "Admin" : "User"}
                      </span>
                    )}
                    {u.adminRequestStatus === 'pending' && (
                      <div className="mt-2 text-[10px] font-bold text-amber-600 bg-amber-50 rounded-full px-2 py-1 inline-block border border-amber-200">
                        Pending Request
                      </div>
                    )}
                  </td>

                  <td className="px-6 py-4 text-center">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold border ${u.plan === "Pro"
                        ? "bg-amber-100 text-amber-800 border-amber-200"
                        : "bg-gray-100 text-gray-700 border-gray-200"
                        }`}
                    >
                      {u.plan || "Free"}
                    </span>
                  </td>

                  <td className="px-6 py-4 text-center">
                    {u.username === "Super Admin" ? (
                      <div className="flex flex-col items-center gap-1">
                        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-indigo-100 text-indigo-700 border border-indigo-200">
                          Primary
                        </span>
                      </div>
                    ) : (
                      <>
                        <button
                          onClick={() => handleToggleActive(u)}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${u.isActive ? 'bg-indigo-600' : 'bg-gray-200'
                            }`}
                        >
                          <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${u.isActive ? 'translate-x-6' : 'translate-x-1'
                            }`} />
                        </button>
                        <div className="text-[10px] text-gray-400 mt-1 whitespace-nowrap">
                          {u.isActive ? 'Active' : 'Inactive'}
                        </div>
                      </>
                    )}
                  </td>

                  <td className="px-6 py-4 text-center text-gray-500">
                    {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : "N/A"}
                  </td>

                  <td className="px-6 py-4">
                    <div className="flex justify-center gap-2">
                      {u.adminRequestStatus === 'pending' && (
                        <>
                          <button
                            onClick={() => handleApproveAdmin(u)}
                            title="Approve Admin Request"
                            className="p-2 rounded-lg hover:bg-green-50 text-green-600 transition-colors"
                          >
                            <Check size={18} />
                          </button>
                          <button
                            onClick={() => handleRejectAdmin(u)}
                            title="Reject Admin Request"
                            className="p-2 rounded-lg hover:bg-orange-50 text-orange-500 transition-colors"
                          >
                            <X size={18} />
                          </button>
                        </>
                      )}
                      {u.username !== "Super Admin" && (
                        <button
                          onClick={() => handleDeleteClick(u._id)}
                          title="Delete User"
                          className="p-2 rounded-lg hover:bg-red-50 text-red-500 transition-colors"
                        >
                          <Trash2 size={18} />
                        </button>
                      )}
                      {u.username === "Super Admin" && (
                        <span className="text-xs text-slate-400 italic">—</span>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {filteredUsers.length === 0 && (
                <tr>
                  <td colSpan="7" className="px-6 py-8 text-center text-gray-500">
                    No users found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile Card Grid */}
        <div className="md:hidden p-4">
          {filteredUsers.length === 0 ? (
            <div className="text-center text-gray-500 py-4">No users found.</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {filteredUsers.map((u) => (
                <div key={u._id} className="bg-slate-50 border border-slate-200 rounded-xl p-4 shadow-sm flex flex-col gap-3">
                  {/* Row 1: User Info + Active Toggle */}
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

                    {/* Active Toggle (Top Right) */}
                    <div className="flex flex-col items-end gap-1">
                      {u.username === "Super Admin" ? (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-indigo-100 text-indigo-700 border border-indigo-200">
                          Primary
                        </span>
                      ) : (
                        <>
                          <button
                            onClick={() => handleToggleActive(u)}
                            className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus:outline-none ${u.isActive ? 'bg-indigo-600' : 'bg-gray-200'}`}
                          >
                            <span className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${u.isActive ? 'translate-x-5' : 'translate-x-1'}`} />
                          </button>
                          <span className="text-[10px] text-slate-400 font-medium">{u.isActive ? 'Active' : 'Inactive'}</span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Row 2: Badges + Delete Button */}
                  <div className="flex items-center justify-between mt-1 pt-3 border-t border-slate-200">
                    <div className="flex gap-2">
                      {u.username === "Super Admin" ? (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide border bg-purple-100 text-purple-700 border-purple-200 whitespace-nowrap" style={{ display: 'inline-block', width: 'max-content' }}>
                          Super Admin
                        </span>
                      ) : (
                        <span
                          onClick={() => handleToggleRole(u)}
                          title={`Click to switch to ${u.isAdmin ? 'User' : 'Admin'}`}
                          className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide border cursor-pointer transition-all active:scale-95 whitespace-nowrap ${u.isAdmin
                            ? "bg-purple-100 text-purple-700 border-purple-200"
                            : "bg-blue-50 text-blue-700 border-blue-200"
                            }`}
                          style={{ display: 'inline-block', width: 'max-content' }}
                        >
                          {u.isAdmin ? "Admin" : "User"}
                        </span>
                      )}
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide border ${u.plan === "Pro"
                          ? "bg-amber-100 text-amber-800 border-amber-200"
                          : "bg-gray-100 text-gray-700 border-gray-200"
                          }`}
                      >
                        {u.plan || "Free"}
                      </span>
                    </div>

                    {/* Action Buttons (Bottom Right) */}
                    <div className="flex gap-2">
                      {u.adminRequestStatus === 'pending' && (
                        <>
                          <button
                            onClick={() => handleApproveAdmin(u)}
                            className="p-1.5 rounded-lg bg-green-50 text-green-600 hover:bg-green-100 transition-colors"
                            title="Approve"
                          >
                            <Check size={16} />
                          </button>
                          <button
                            onClick={() => handleRejectAdmin(u)}
                            className="p-1.5 rounded-lg bg-orange-50 text-orange-500 hover:bg-orange-100 transition-colors"
                            title="Reject"
                          >
                            <X size={16} />
                          </button>
                        </>
                      )}
                      {u.username !== "Super Admin" ? (
                        <button
                          onClick={() => handleDeleteClick(u._id)}
                          className="p-1.5 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 transition-colors"
                          title="Delete User"
                        >
                          <Trash2 size={16} />
                        </button>
                      ) : (
                        <span className="text-xs text-slate-400 italic">—</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

      {/* DELETE CONFIRMATION MODAL */}
      {
        deleteConfirmId && (() => {
          const userToDelete = users.find(u => u._id === deleteConfirmId);
          const userName = userToDelete?.username || userToDelete?.email || "this user";
          return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
              <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm p-6 text-center transform transition-all">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4 text-red-600">
                  <AlertCircle size={24} />
                </div>
                <h2 className="text-xl font-bold mb-2 text-gray-800">Delete {userName}?</h2>
                <p className="text-gray-500 mb-6">
                  Are you sure you want to delete <span className="font-semibold text-gray-700">{userName}</span>? This action cannot be undone.
                </p>
                <div className="flex justify-center gap-3">
                  <button
                    onClick={() => setDeleteConfirmId(null)}
                    className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={confirmDelete}
                    className="px-4 py-2 text-white bg-red-600 rounded-lg hover:bg-red-700 font-medium"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          );
        })()
      }
    </div >
  );
}
