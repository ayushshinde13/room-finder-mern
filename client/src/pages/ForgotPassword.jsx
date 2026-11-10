import React, { useState } from "react";
import { Link } from "react-router-dom";
import API from "../services/api";
import toast from "react-hot-toast";
import { Mail, ArrowLeft, ArrowRight, CheckCircle2 } from "lucide-react";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [resetData, setResetData] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const cleanEmail = email.trim();
    if (!cleanEmail) {
      toast.error("Please enter your registered email address");
      return;
    }

    try {
      setLoading(true);
      const { data } = await API.post("/auth/forgot-password", { email: cleanEmail });
      setResetData(data);
      toast.success("Password reset link generated!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to process request. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[75vh] flex flex-col items-center justify-center py-10 px-4">
      <div className="w-full max-w-md bg-white dark:bg-[#111A2B] border border-[#E3E8EE] dark:border-[#1F2A3D] rounded-xl shadow-[0_1px_2px_rgba(0,0,0,0.04)] p-6 sm:p-8 space-y-6 text-left">
        <div className="space-y-1.5">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#1D4ED8] dark:text-[#3B82F6]">
            Account Recovery
          </span>
          <h1 className="text-2xl font-bold tracking-tight text-[#0F1B2D] dark:text-[#F1F5F9]">
            Forgot your password?
          </h1>
          <p className="text-xs text-[#5B6B7F] dark:text-[#94A3B8]">
            Enter your registered email address to receive password reset instructions.
          </p>
        </div>

        {resetData ? (
          <div className="space-y-4 pt-1">
            <div className="p-4 rounded-lg bg-[#DCFCE7] dark:bg-emerald-950/60 border border-[#BBF7D0] dark:border-emerald-800/40 text-[#15803D] dark:text-emerald-300 flex items-start gap-3">
              <CheckCircle2 size={18} strokeWidth={2} className="shrink-0 mt-0.5" />
              <div className="text-xs space-y-1">
                <p className="font-semibold text-sm">Reset link generated</p>
                <p className="text-[#0F1B2D] dark:text-[#F1F5F9]">
                  A secure password reset link was created for <strong>{email}</strong>.
                </p>
              </div>
            </div>

            <Link
              to={resetData.resetUrl}
              className="w-full h-11 bg-[#1D4ED8] hover:bg-[#1E40AF] dark:bg-[#3B82F6] dark:hover:bg-[#2563EB] text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2 text-sm"
            >
              <span>Proceed to Reset Password</span>
              <ArrowRight size={15} strokeWidth={1.75} />
            </Link>

            <button
              type="button"
              onClick={() => setResetData(null)}
              className="w-full text-xs text-[#5B6B7F] dark:text-[#94A3B8] hover:text-[#0F1B2D] dark:hover:text-[#F1F5F9] transition-colors pt-1 text-center block cursor-pointer"
            >
              Try another email address
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-[#0F1B2D] dark:text-[#F1F5F9] uppercase tracking-wider">
                Email Address
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-[#5B6B7F] dark:text-[#94A3B8] pointer-events-none">
                  <Mail size={16} strokeWidth={1.75} />
                </span>
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
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
                "Send Reset Link"
              )}
            </button>
          </form>
        )}

        <div className="text-center pt-2 border-t border-[#E3E8EE] dark:border-[#1F2A3D]">
          <Link
            to="/login"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-[#5B6B7F] dark:text-[#94A3B8] hover:text-[#0F1B2D] dark:hover:text-[#F1F5F9] transition-colors"
          >
            <ArrowLeft size={14} strokeWidth={1.75} />
            <span>Back to Sign In</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
