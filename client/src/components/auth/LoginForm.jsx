import { useState } from "react";
import API from "../../services/api";
import { useNavigate, Link } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import toast from "react-hot-toast";
import { Mail, Lock, Loader2 } from "lucide-react";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      const { data } = await API.post("/auth/login", { email, password });
      login(data);
      toast.success("Login successful");
      navigate("/profile");
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={submitHandler} className="space-y-5">
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

      {/* Password Input */}
      <div className="space-y-1.5">
        <div className="flex justify-between items-center">
          <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
            Password
          </label>
        </div>
        <div className="relative">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400 pointer-events-none">
            <Lock size={18} />
          </span>
          <input
            type="password"
            required
            placeholder="••••••••"
            onChange={(e) => setPassword(e.target.value)}
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
                   flex items-center justify-center gap-2 text-sm disabled:opacity-50"
      >
        {loading ? (
          <>
            <Loader2 size={16} className="animate-spin" />
            <span>Logging in...</span>
          </>
        ) : (
          "Sign In"
        )}
      </button>
    </form>
  );
};

export default LoginForm;