import React, { useState } from "react";
import API from "../../services/api";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { User, Mail, Lock, Building2 } from "lucide-react";

const RegisterForm = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "RENTER",
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const submitHandler = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      await API.post("/auth/register", {
        ...form,
        name: form.name.trim(),
        email: form.email.trim().toLowerCase()
      });
      toast.success("Account created successfully. Please sign in.");
      navigate("/login");
    } catch (err) {
      toast.error(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={submitHandler} className="space-y-4">
      {/* Role Selection Tabs */}
      <div className="space-y-1.5">
        <label className="block text-xs font-semibold text-[#0F1B2D] dark:text-[#F1F5F9] uppercase tracking-wider">
          Account Type
        </label>
        <div className="grid grid-cols-2 gap-2 p-1 bg-[#F5F8FA] dark:bg-[#0B1220] border border-[#E3E8EE] dark:border-[#1F2A3D] rounded-lg">
          <button
            type="button"
            onClick={() => setForm({ ...form, role: "RENTER" })}
            className={`h-9 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
              form.role === "RENTER"
                ? "bg-white dark:bg-[#111A2B] text-[#1D4ED8] dark:text-[#3B82F6] shadow-sm border border-[#E3E8EE] dark:border-[#1F2A3D]"
                : "text-[#5B6B7F] dark:text-[#94A3B8] hover:text-[#0F1B2D] dark:hover:text-[#F1F5F9]"
            }`}
          >
            I am a Renter
          </button>
          <button
            type="button"
            onClick={() => setForm({ ...form, role: "OWNER" })}
            className={`h-9 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
              form.role === "OWNER"
                ? "bg-white dark:bg-[#111A2B] text-[#1D4ED8] dark:text-[#3B82F6] shadow-sm border border-[#E3E8EE] dark:border-[#1F2A3D]"
                : "text-[#5B6B7F] dark:text-[#94A3B8] hover:text-[#0F1B2D] dark:hover:text-[#F1F5F9]"
            }`}
          >
            I am a Landlord
          </button>
        </div>
      </div>

      {/* Full Name */}
      <div className="space-y-1.5">
        <label className="block text-xs font-semibold text-[#0F1B2D] dark:text-[#F1F5F9] uppercase tracking-wider">
          Full Name
        </label>
        <div className="relative">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-[#5B6B7F] dark:text-[#94A3B8] pointer-events-none">
            <User size={16} strokeWidth={1.75} />
          </span>
          <input
            type="text"
            required
            placeholder="e.g. Rahul Sharma"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full h-11 pl-10 pr-4 bg-white dark:bg-[#0B1220] text-[#0F1B2D] dark:text-[#F1F5F9] placeholder-[#5B6B7F]/60 dark:placeholder-[#94A3B8]/60 border border-[#E3E8EE] dark:border-[#1F2A3D] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1D4ED8]/20 focus:border-[#1D4ED8] dark:focus:ring-[#3B82F6]/30 dark:focus:border-[#3B82F6] transition-colors text-sm"
          />
        </div>
      </div>

      {/* Email */}
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
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="w-full h-11 pl-10 pr-4 bg-white dark:bg-[#0B1220] text-[#0F1B2D] dark:text-[#F1F5F9] placeholder-[#5B6B7F]/60 dark:placeholder-[#94A3B8]/60 border border-[#E3E8EE] dark:border-[#1F2A3D] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1D4ED8]/20 focus:border-[#1D4ED8] dark:focus:ring-[#3B82F6]/30 dark:focus:border-[#3B82F6] transition-colors text-sm"
          />
        </div>
      </div>

      {/* Password */}
      <div className="space-y-1.5">
        <label className="block text-xs font-semibold text-[#0F1B2D] dark:text-[#F1F5F9] uppercase tracking-wider">
          Password
        </label>
        <div className="relative">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-[#5B6B7F] dark:text-[#94A3B8] pointer-events-none">
            <Lock size={16} strokeWidth={1.75} />
          </span>
          <input
            type="password"
            required
            placeholder="At least 6 characters"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            className="w-full h-11 pl-10 pr-4 bg-white dark:bg-[#0B1220] text-[#0F1B2D] dark:text-[#F1F5F9] placeholder-[#5B6B7F]/60 dark:placeholder-[#94A3B8]/60 border border-[#E3E8EE] dark:border-[#1F2A3D] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1D4ED8]/20 focus:border-[#1D4ED8] dark:focus:ring-[#3B82F6]/30 dark:focus:border-[#3B82F6] transition-colors text-sm"
          />
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
          "Create Account"
        )}
      </button>
    </form>
  );
};

export default RegisterForm;
