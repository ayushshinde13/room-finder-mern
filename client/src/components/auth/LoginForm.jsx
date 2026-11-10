import React, { useState } from "react";
import API from "../../services/api";
import { useNavigate, Link } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import toast from "react-hot-toast";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";

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
    <form onSubmit={submitHandler} className="space-y-4">
      {/* Email Input */}
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

      {/* Password Input */}
      <div className="space-y-1.5">
        <div className="flex justify-between items-center">
          <label className="block text-xs font-semibold text-[#0F1B2D] dark:text-[#F1F5F9] uppercase tracking-wider">
            Password
          </label>
          <Link
            to="/forgot-password"
            className="text-xs font-medium text-[#1D4ED8] hover:text-[#1E40AF] dark:text-[#3B82F6] dark:hover:text-[#2563EB] hover:underline"
          >
            Forgot password?
          </Link>
        </div>
        <div className="relative">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-[#5B6B7F] dark:text-[#94A3B8] pointer-events-none">
            <Lock size={16} strokeWidth={1.75} />
          </span>
          <input
            type={showPassword ? "text" : "password"}
            required
            placeholder="••••••••"
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

      {/* Solid Primary Submit Button */}
      <button
        type="submit"
        disabled={loading}
        className="w-full h-11 bg-[#1D4ED8] hover:bg-[#1E40AF] dark:bg-[#3B82F6] dark:hover:bg-[#2563EB] text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2 text-sm disabled:opacity-50 cursor-pointer mt-2"
      >
        {loading ? (
          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
        ) : (
          "Sign In"
        )}
      </button>
    </form>
  );
};

export default LoginForm;
