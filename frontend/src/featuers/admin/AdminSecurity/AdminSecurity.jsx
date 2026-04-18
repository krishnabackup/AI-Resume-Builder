import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { X, Eye, EyeOff, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import axios from "../../../api/axios";

export default function AdminSecurity() {
    const navigate = useNavigate();

    const [form, setForm] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
    });

    const [show, setShow] = useState({
        current: false,
        new: false,
        confirm: false,
    });

    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const updatePassword = async () => {
        if (loading) return;

        if (!form.currentPassword || !form.newPassword || !form.confirmPassword) {
            toast.error("All fields are required");
            return;
        }


        if (form.newPassword !== form.confirmPassword) {
            toast.error("Passwords do not match");
            return;
        }

        try {
            setLoading(true);
            const res = await axios.put("/api/auth/change-password", {
                oldPassword: form.currentPassword,
                newPassword: form.newPassword,
            });
            console.log("Password change response:", res.data);
            toast.success(res.data?.message || "Password updated successfully");
            setForm({ currentPassword: "", newPassword: "", confirmPassword: "" });

            // Redirect to login after successful password change due to cookie clearing
            setTimeout(() => {
                navigate("/login");
            }, 2000);
        } catch (err) {
            console.error(err);
            toast.error(err?.response?.data?.message || "Something went wrong. Try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full min-h-[calc(100vh-64px)] bg-slate-50 flex items-center justify-center px-4 py-8">
            <div className="w-full max-w-xl bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-slate-100">

                {/* HEADER */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900">
                            Change Password
                        </h1>
                        <p className="text-slate-500 text-sm mt-1">
                            Ensure your account is using a long, random password to stay secure.
                        </p>
                    </div>

                    <button
                        onClick={() => navigate(-1)}
                        className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-full transition-colors"
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* FORM */}
                <div className="space-y-6">
                    <PasswordField
                        label="Current Password"
                        name="currentPassword"
                        value={form.currentPassword}
                        onChange={handleChange}
                        show={show.current}
                        toggle={() => setShow({ ...show, current: !show.current })}
                        autoFocus
                    />

                    <PasswordField
                        label="New Password"
                        name="newPassword"
                        value={form.newPassword}
                        onChange={handleChange}
                        show={show.new}
                        toggle={() => setShow({ ...show, new: !show.new })}
                    />

                    <PasswordField
                        label="Confirm New Password"
                        name="confirmPassword"
                        value={form.confirmPassword}
                        onChange={handleChange}
                        show={show.confirm}
                        toggle={() => setShow({ ...show, confirm: !show.confirm })}
                    />
                </div>

                {/* ACTIONS */}
                <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 mt-10">
                    <button
                        onClick={() => navigate(-1)}
                        className="h-12 px-6 rounded-xl border border-slate-200 text-slate-600 font-semibold hover:bg-slate-50 transition-colors w-full sm:w-auto"
                    >
                        Cancel
                    </button>

                    <button
                        onClick={updatePassword}
                        disabled={loading}
                        className="h-12 px-8 rounded-xl flex items-center justify-center gap-2 bg-indigo-600 text-white font-semibold hover:bg-indigo-700 active:scale-[0.98] transition-all w-full sm:w-auto shadow-lg shadow-indigo-100 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {loading && <Loader2 className="animate-spin" size={18} />}
                        Update Password
                    </button>
                </div>

            </div>
        </div>
    );
}

/* PASSWORD FIELD COMPONENT */
const PasswordField = ({
    label,
    name,
    value,
    onChange,
    show,
    toggle,
    hint,
    autoFocus,
}) => {
    return (
        <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
                {label}
            </label>

            <div className="relative">
                <input
                    type={show ? "text" : "password"}
                    name={name}
                    value={value}
                    onChange={onChange}
                    autoFocus={autoFocus}
                    placeholder={`Enter your ${label.toLowerCase()}`}
                    className="
            w-full
            h-12
            px-4
            pr-12
            bg-slate-50/50
            border
            border-slate-200
            rounded-xl
            outline-none
            transition-all
            focus:bg-white
            focus:border-indigo-500
            focus:ring-4
            focus:ring-indigo-500/10
          "
                />

                <button
                    type="button"
                    onClick={toggle}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                >
                    {show ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
            </div>

            {hint && <p className="text-xs text-slate-400 mt-2 ml-1">{hint}</p>}
        </div>
    );
};
