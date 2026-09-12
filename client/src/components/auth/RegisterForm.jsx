import { useState } from "react";
import API from "../../services/api";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { User, Mail, Lock, UserCheck, Loader2 } from "lucide-react";

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
      toast.success("Registered successfully. Login now.");
      navigate("/login");
    } catch (err) {
      toast.error(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={submitHandler} className="space-y-4">
      {/* Full Name */}
      <div className="space-y-1">
        <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
          Full Name
        </label>
        <div className="relative">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400 pointer-events-none">
            <User size={18} />
          </span>
          <input
            type="text"
            required
            placeholder="John Doe"
            onChange={(e) => setForm({ ...form, name: e.target.value })}
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

      {/* Email */}
      <div className="space-y-1">
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
            onChange={(e) => setForm({ ...form, email: e.target.value })}
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

      {/* Password */}
      <div className="space-y-1">
        <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
          Password
        </label>
        <div className="relative">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400 pointer-events-none">
            <Lock size={18} />
          </span>
          <input
            type="password"
            required
            placeholder="••••••••"
            onChange={(e) => setForm({ ...form, password: e.target.value })}
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

      {/* Role */}
      <div className="space-y-1">
        <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
          I want to be a
        </label>
        <div className="relative">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400 pointer-events-none">
            <UserCheck size={18} />
          </span>
          <select
            onChange={(e) => setForm({ ...form, role: e.target.value })}
            className="w-full pl-10 pr-4 py-3 rounded-xl
                       bg-slate-50 dark:bg-slate-800/50 
                       text-slate-900 dark:text-white 
                       border border-slate-200 dark:border-slate-800/80
                       focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500
                       transition-all duration-200 text-sm appearance-none cursor-pointer"
          >
            <option value="RENTER">Renter (Looking for rooms)</option>
            <option value="OWNER">Owner (Want to list rooms)</option>
          </select>
        </div>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={loading}
        className="w-full mt-2 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700
                   text-white font-semibold rounded-xl transition-all duration-200
                   shadow-lg shadow-emerald-500/10 hover:shadow-emerald-500/20
                   flex items-center justify-center gap-2 text-sm disabled:opacity-50"
      >
        {loading ? (
          <>
            <Loader2 size={16} className="animate-spin" />
            <span>Registering...</span>
          </>
        ) : (
          "Create Account"
        )}
      </button>
    </form>
  );
};

export default RegisterForm;