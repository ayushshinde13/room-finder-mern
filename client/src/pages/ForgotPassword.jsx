import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import API from "../services/api";
import toast from "react-hot-toast";
import { Mail, ArrowLeft, Loader2, KeyRound, CheckCircle2, ArrowRight } from "lucide-react";

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
    <div className="min-h-[80vh] flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md space-y-6 glass-panel p-8 rounded-3xl shadow-xl relative z-10 border border-slate-200/50 dark:border-slate-800/50"
      >
        <div className="text-center">
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.3 }}
            className="mx-auto h-12 w-12 rounded-2xl bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-500 flex items-center justify-center mb-4"
          >
            <KeyRound size={24} className="text-emerald-500" />
          </motion.div>
          
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Forgot Password?
          </h2>
          <p className="mt-1.5 text-sm text-slate-500 dark:text-slate-400">
            Enter your registered email address to receive password reset instructions.
          </p>
        </div>

        {resetData ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-4 pt-2"
          >
            <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-300 flex items-start gap-3">
              <CheckCircle2 size={20} className="text-emerald-500 flex-shrink-0 mt-0.5" />
              <div className="text-xs space-y-1">
                <p className="font-semibold text-sm">Reset link generated!</p>
                <p className="text-slate-600 dark:text-slate-300">
                  We've created a secure password reset token for <strong className="text-emerald-600 dark:text-emerald-400">{email}</strong>.
                </p>
              </div>
            </div>

            <div className="pt-2">
              <Link
                to={resetData.resetUrl}
                className="w-full py-3 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700
                           text-white font-semibold rounded-xl transition-all duration-200
                           shadow-lg shadow-emerald-500/10 hover:shadow-emerald-500/20
                           flex items-center justify-center gap-2 text-sm"
              >
                <span>Proceed to Reset Password</span>
                <ArrowRight size={16} />
              </Link>
            </div>

            <button
              onClick={() => setResetData(null)}
              className="w-full text-xs text-slate-500 dark:text-slate-400 hover:text-emerald-500 transition-colors pt-1 text-center block"
            >
              Try another email address
            </button>
          </motion.div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email Input */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                Email Address
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400 pointer-events-none">
                  <Mail size={18} />
                </span>
                <input
                  type="email"
                  required
                  placeholder="name@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl
                             bg-slate-50 dark:bg-slate-800/50 
                             text-slate-900 dark:text-white 
                             placeholder-slate-400 dark:placeholder-slate-500
                             border border-slate-200 dark:border-slate-800/80
                             focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500
                             transition-all duration-200 text-sm"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700
                         text-white font-semibold rounded-xl transition-all duration-200
                         shadow-lg shadow-emerald-500/10 hover:shadow-emerald-500/20
                         flex items-center justify-center gap-2 text-sm disabled:opacity-50 active:scale-[0.99]"
            >
              {loading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  <span>Generating reset link...</span>
                </>
              ) : (
                "Send Reset Link"
              )}
            </button>
          </form>
        )}

        <div className="text-center pt-2">
          <Link
            to="/login"
            className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-emerald-500 dark:hover:text-emerald-400 transition-colors"
          >
            <ArrowLeft size={14} />
            <span>Back to Sign In</span>
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default ForgotPassword;
