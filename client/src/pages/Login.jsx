import { motion } from "framer-motion";
import LoginForm from "../components/auth/LoginForm";
import { Link } from "react-router-dom";
import { Sparkles } from "lucide-react";

const Login = () => {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md space-y-8 glass-panel p-8 rounded-3xl shadow-xl relative z-10 border border-slate-200/50 dark:border-slate-800/50"
      >
        <div className="text-center">
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.3 }}
            className="mx-auto h-12 w-12 rounded-2xl bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-500 flex items-center justify-center mb-4"
          >
            <Sparkles size={24} className="fill-emerald-500/10" />
          </motion.div>
          
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Welcome back
          </h2>
          <p className="mt-1.5 text-sm text-slate-500 dark:text-slate-400">
            Sign in to your account to browse rooms
          </p>
        </div>

        <LoginForm />

        <div className="text-center text-sm text-slate-500 dark:text-slate-400 pt-2">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="font-medium text-emerald-600 hover:text-emerald-500 dark:text-emerald-400 dark:hover:text-emerald-300 transition-colors"
          >
            Create one free
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;

