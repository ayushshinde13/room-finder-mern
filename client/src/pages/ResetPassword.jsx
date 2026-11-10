import React, { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import API from "../services/api";
import toast from "react-hot-toast";
import { Lock, Eye, EyeOff, CheckCircle2, ArrowRight } from "lucide-react";

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!password || password.length < 6) {
      toast.error("Password must be at least 6 characters long");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      setLoading(true);
      await API.post(`/auth/reset-password/${token}`, { password });
      setIsSuccess(true);
      toast.success("Password reset successful!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Password reset failed. The link may have expired.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[75vh] flex flex-col items-center justify-center py-10 px-4">
      <div className="w-full max-w-md bg-white dark:bg-[#111A2B] border border-[#E3E8EE] dark:border-[#1F2A3D] rounded-xl shadow-[0_1px_2px_rgba(0,0,0,0.04)] p-6 sm:p-8 space-y-6 text-left">
        <div className="space-y-1.5">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#1D4ED8] dark:text-[#3B82F6]">
            Security
          </span>
          <h1 className="text-2xl font-bold tracking-tight text-[#0F1B2D] dark:text-[#F1F5F9]">
            Set new password
          </h1>
          <p className="text-xs text-[#5B6B7F] dark:text-[#94A3B8]">
            Create a secure new password for your RoomFinder account.
          </p>
        </div>

        {isSuccess ? (
          <div className="space-y-4 pt-1">
            <div className="p-4 rounded-lg bg-[#DCFCE7] dark:bg-emerald-950/60 border border-[#BBF7D0] dark:border-emerald-800/40 text-[#15803D] dark:text-emerald-300 flex items-start gap-3">
              <CheckCircle2 size={18} strokeWidth={2} className="shrink-0 mt-0.5" />
              <div className="text-xs space-y-1">
                <p className="font-semibold text-sm">Password updated</p>
                <p className="text-[#0F1B2D] dark:text-[#F1F5F9]">
                  Your password has been successfully reset. You can now sign in with your new credentials.
                </p>
              </div>
            </div>

            <button
              onClick={() => navigate("/login")}
              className="w-full h-11 bg-[#1D4ED8] hover:bg-[#1E40AF] dark:bg-[#3B82F6] dark:hover:bg-[#2563EB] text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2 text-sm cursor-pointer"
            >
              <span>Go to Sign In</span>
              <ArrowRight size={15} strokeWidth={1.75} />
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-[#0F1B2D] dark:text-[#F1F5F9] uppercase tracking-wider">
                New Password
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-[#5B6B7F] dark:text-[#94A3B8] pointer-events-none">
                  <Lock size={16} strokeWidth={1.75} />
                </span>
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="At least 6 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full h-11 pl-10 pr-11 bg-white dark:bg-[#0B1220] text-[#0F1B2D] dark:text-[#F1F5F9] placeholder-[#5B6B7F]/60 dark:placeholder-[#94A3B8]/60 border border-[#E3E8EE] dark:border-[#1F2A3D] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1D4ED8]/20 focus:border-[#1D4ED8] dark:focus:ring-[#3B82F6]/30 dark:focus:border-[#3B82F6] transition-colors text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-[#5B6B7F] dark:text-[#94A3B8] hover:text-[#0F1B2D] dark:hover:text-[#F1F5F9] transition-colors cursor-pointer"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={16} strokeWidth={1.75} /> : <Eye size={16} strokeWidth={1.75} />}
                </button>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-[#0F1B2D] dark:text-[#F1F5F9] uppercase tracking-wider">
                Confirm New Password
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-[#5B6B7F] dark:text-[#94A3B8] pointer-events-none">
                  <Lock size={16} strokeWidth={1.75} />
                </span>
                <input
                  type="password"
                  required
                  placeholder="Re-enter password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full h-11 pl-10 pr-4 bg-white dark:bg-[#0B1220] text-[#0F1B2D] dark:text-[#F1F5F9] placeholder-[#5B6B7F]/60 dark:placeholder-[#94A3B8]/60 border border-[#E3E8EE] dark:border-[#1F2A3D] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1D4ED8]/20 focus:border-[#1D4ED8] dark:focus:ring-[#3B82F6]/30 dark:focus:border-[#3B82F6] transition-colors text-sm"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full h-11 bg-[#1D4ED8] hover:bg-[#1E40AF] dark:bg-[#3B82F6] dark:hover:bg-[#2563EB] text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2 text-sm disabled:opacity-50 cursor-pointer mt-2"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                "Reset Password"
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ResetPassword;
