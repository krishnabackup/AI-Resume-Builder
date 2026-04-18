import { useMemo, useState } from "react";
import { AlertTriangle, Loader2, Trash2, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "../../../api/axios";

const STORAGE_KEYS_TO_CLEAR = ["token", "isAdmin"];

const DangerZone = ({ userId }) => {
  const navigate = useNavigate();
  const [showConfirm, setShowConfirm] = useState(false);
  const [confirmText, setConfirmText] = useState("");
  const [deleting, setDeleting] = useState(false);

  const canSubmit = useMemo(
    () => confirmText.trim().toUpperCase() === "DELETE" && !!userId,
    [confirmText, userId]
  );

  const clearAuthState = () => {
    STORAGE_KEYS_TO_CLEAR.forEach((key) => {
      localStorage.removeItem(key);
      sessionStorage.removeItem(key);
    });
  };

  const handleDelete = async () => {
    if (!canSubmit || deleting) return;

    try {
      setDeleting(true);
      await axios.delete(`/api/user/${userId}`);

      toast.success("Your account has been deleted.");
      clearAuthState();
      navigate("/register", { replace: true });
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to delete account");
    } finally {
      setDeleting(false);
      setShowConfirm(false);
      setConfirmText("");
    }
  };

  return (
    <>
      <section className="rounded-2xl border border-rose-200 bg-rose-50/70 p-5 sm:p-6">
        <div className="flex items-start gap-3">
          <div className="rounded-full bg-rose-100 p-2 text-rose-600">
            <AlertTriangle size={18} />
          </div>
          <div className="flex-1">
            <h3 className="text-base sm:text-lg font-semibold text-rose-700">Danger Zone</h3>
            <p className="mt-1 text-sm text-rose-700/90">
              Deleting your account permanently removes your profile access. This action cannot be undone.
            </p>
            <button
              type="button"
              onClick={() => setShowConfirm(true)}
              disabled={!userId}
              className="mt-4 inline-flex items-center gap-2 rounded-xl bg-rose-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-rose-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Trash2 size={16} />
              Delete My Account
            </button>
            {!userId && (
              <p className="mt-2 text-xs text-rose-700/70">Loading account information...</p>
            )}
          </div>
        </div>
      </section>

      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="w-full max-w-md rounded-2xl border border-rose-200 bg-white p-6 shadow-2xl">
            <div className="mb-4 flex items-center justify-between">
              <h4 className="text-lg font-semibold text-slate-900">Confirm Account Deletion</h4>
              <button
                type="button"
                onClick={() => {
                  if (deleting) return;
                  setShowConfirm(false);
                  setConfirmText("");
                }}
                className="text-slate-400 transition hover:text-slate-600"
              >
                <X size={20} />
              </button>
            </div>

            <p className="text-sm text-slate-600">
              Type <span className="font-semibold text-rose-600">DELETE</span> to confirm.
            </p>

            <input
              type="text"
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              placeholder="Type DELETE"
              className="mt-3 h-11 w-full rounded-xl border border-slate-300 px-3 text-sm outline-none focus:border-rose-500 focus:ring-2 focus:ring-rose-200"
            />

            <div className="mt-5 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => {
                  if (deleting) return;
                  setShowConfirm(false);
                  setConfirmText("");
                }}
                className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDelete}
                disabled={!canSubmit || deleting}
                className="inline-flex items-center gap-2 rounded-xl bg-rose-600 px-4 py-2 text-sm font-medium text-white hover:bg-rose-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {deleting && <Loader2 size={15} className="animate-spin" />}
                Delete Forever
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default DangerZone;