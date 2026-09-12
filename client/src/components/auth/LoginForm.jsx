import { useState } from "react";
import API from "../../services/api";
import { useNavigate, Link } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import toast from "react-hot-toast";
import { Mail, Lock, Loader2, Eye, EyeOff } from "lucide-react";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const submitHandler = async (e) => {
    e.preventDefault();

    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail || !password) {
      toast.error("Please fill in all fields");
      return;
    }

    try {
      setLoading(true);
      const { data } = await API.post("/auth/login", { 
        email: cleanEmail, 
        password 
      });

      login(data);
      toast.success(`Welcome back, ${data.user?.name || "User"}!`);
      
      // Navigate to explore for renters or my-rooms for owners, or profile as fallback
      if (data.user?.role === "OWNER") {
        navigate("/my-rooms");
      } else {
        navigate("/explore");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed. Please check your credentials.");
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

      {/* Password Input */}
      <div className="space-y-1.5">
        <div className="flex justify-between items-center">
          <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
            Password
          </label>
          <Link
            to="/forgot-password"
            className="text-xs font-medium text-emerald-600 dark:text-emerald-400 hover:text-emerald-500 dark:hover:text-emerald-300 transition-colors"
          >
            Forgot password?
          </Link>
        </div>
        <div className="relative">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400 pointer-events-none">
            <Lock size={18} />
          </span>
          <input
            type={showPassword ? "text" : "password"}
            required
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full pl-10 pr-11 py-3 rounded-xl
                       bg-slate-50 dark:bg-slate-800/50 
                       text-slate-900 dark:text-white 
                       placeholder-slate-400 dark:placeholder-slate-500
                       border border-slate-200 dark:border-slate-800/80
                       focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500
                       transition-all duration-200 text-sm"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
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
            <span>Signing in...</span>
          </>
        ) : (
          "Sign In"
        )}
      </button>
    </form>
  );
};

export default LoginForm;