import React from "react";
import LoginForm from "../components/auth/LoginForm";
import { Link } from "react-router-dom";

const Login = () => {
  return (
    <div className="min-h-[75vh] flex flex-col items-center justify-center py-10 px-4">
      <div className="w-full max-w-md bg-white dark:bg-[#111A2B] border border-[#E3E8EE] dark:border-[#1F2A3D] rounded-xl shadow-[0_1px_2px_rgba(0,0,0,0.04)] p-6 sm:p-8 space-y-6 text-left">
        <div className="space-y-1.5">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#1D4ED8] dark:text-[#3B82F6]">
            RoomFinder Account
          </span>
          <h1 className="text-2xl font-bold tracking-tight text-[#0F1B2D] dark:text-[#F1F5F9]">
            Sign in to your account
          </h1>
          <p className="text-xs text-[#5B6B7F] dark:text-[#94A3B8]">
            Access your bookings, saved listings, and rental receipts.
          </p>
        </div>

        <LoginForm />

        <div className="text-center text-xs text-[#5B6B7F] dark:text-[#94A3B8] pt-2 border-t border-[#E3E8EE] dark:border-[#1F2A3D]">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="font-medium text-[#1D4ED8] hover:text-[#1E40AF] dark:text-[#3B82F6] dark:hover:text-[#2563EB] hover:underline"
          >
            Create an account
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
