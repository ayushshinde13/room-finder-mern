import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  CheckCircle2,
  Wallet,
  Building,
  ArrowRight,
  Sparkles,
  Loader2,
  User,
  Check
} from "lucide-react";
import API from "../../services/api";
import toast from "react-hot-toast";

const ApproveLeaveModal = ({ isOpen, onClose, booking, onSuccess }) => {
  const [loading, setLoading] = useState(false);

  if (!isOpen || !booking) return null;

  const room = booking.room;
  const rent = room?.rent || 0;
  const refundAmount = Math.round(rent * 0.7);
  const deductionAmount = Math.round(rent * 0.3);

  const handleConfirmApprove = async () => {
    try {
      setLoading(true);
      const { data } = await API.post(`/bookings/${booking._id}/approve-leave`);
      toast.success("Leave request approved! 30% retained in your wallet & room unlocked.");
      if (onSuccess) {
        onSuccess(data.booking);
      }
      onClose();
    } catch (error) {
      console.error("Error approving leave request:", error);
      toast.error(error.response?.data?.message || "Failed to approve leave request");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 pt-24 pb-12 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-slate-950/75 backdrop-blur-sm"
        />

        {/* Modal Dialog */}
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 20 }}
          transition={{ type: "spring", duration: 0.35, bounce: 0.1 }}
          className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200/80 dark:border-slate-800 overflow-hidden z-10 my-auto"
        >
          {/* Header Gradient Top Bar */}
          <div className="h-2 w-full bg-gradient-to-r from-purple-500 via-indigo-500 to-emerald-500" />

          {/* Close Button */}
          <button
            onClick={onClose}
            disabled={loading}
            className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X size={18} />
          </button>

          <div className="p-6 sm:p-7 space-y-6">
            {/* Title & Icon */}
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-purple-500/10 dark:bg-purple-500/20 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0 border border-purple-500/20">
                <CheckCircle2 size={22} />
              </div>
              <div className="space-y-1">
                <h3 className="text-xl font-black tracking-tight text-slate-900 dark:text-white">
                  Approve Vacate Notice
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Settle the lease termination and immediately unlock your room for new listings.
                </p>
              </div>
            </div>

            {/* Tenant & Room Details Card */}
            <div className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 flex items-center gap-3.5 shadow-sm">
              <img
                src={room?.imageUrl || "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=600&q=80"}
                alt={room?.title}
                className="w-16 h-16 rounded-xl object-cover border border-slate-200/40 dark:border-slate-700/50 shrink-0 shadow-inner"
              />
              <div className="min-w-0 flex-1">
                <h4 className="text-sm font-bold text-slate-900 dark:text-white truncate">
                  {room?.title}
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-300 truncate mt-0.5">
                  Tenant: <strong className="text-slate-700 dark:text-slate-200 font-semibold">{booking.renter?.name}</strong> ({booking.renter?.email})
                </p>
                <div className="text-xs font-black text-emerald-600 dark:text-emerald-400 mt-1">
                  Monthly Rent: ₹{rent.toLocaleString("en-IN")}
                </div>
              </div>
            </div>

            {/* Financial Settlement Breakdown */}
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-400">
                <span>Settlement Distribution</span>
                <span>Automatic</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* 30% Retention Card */}
                <div className="p-4 rounded-2xl bg-emerald-500/10 dark:bg-emerald-500/15 border border-emerald-500/25 relative overflow-hidden flex flex-col justify-between">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-emerald-700 dark:text-emerald-300">
                      30% Retained in Your Wallet
                    </span>
                    <span className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-600 dark:text-emerald-300">
                      <Wallet size={14} />
                    </span>
                  </div>
                  <div className="mt-2">
                    <span className="text-2xl font-black text-emerald-900 dark:text-emerald-200">
                      +₹{deductionAmount.toLocaleString("en-IN")}
                    </span>
                    <p className="text-[10px] text-emerald-700/80 dark:text-emerald-300/80 mt-0.5">
                      Earned early vacate fee
                    </p>
                  </div>
                </div>

                {/* 70% Refund to Tenant Card */}
                <div className="p-4 rounded-2xl bg-purple-500/10 dark:bg-purple-500/15 border border-purple-500/25 relative overflow-hidden flex flex-col justify-between">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-purple-700 dark:text-purple-300">
                      70% Tenant Refund
                    </span>
                    <span className="p-1.5 rounded-lg bg-purple-500/20 text-purple-600 dark:text-purple-300">
                      <User size={14} />
                    </span>
                  </div>
                  <div className="mt-2">
                    <span className="text-2xl font-black text-purple-900 dark:text-purple-200">
                      ₹{refundAmount.toLocaleString("en-IN")}
                    </span>
                    <p className="text-[10px] text-purple-700/80 dark:text-purple-300/80 mt-0.5">
                      Refunded to tenant wallet
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Room Availability Callout */}
            <div className="p-3.5 bg-emerald-500/10 dark:bg-emerald-500/15 rounded-2xl border border-emerald-500/25 flex items-start gap-2.5 text-xs text-emerald-800 dark:text-emerald-300">
              <Sparkles size={16} className="text-emerald-500 shrink-0 mt-0.5" />
              <p className="leading-relaxed">
                Approving will immediately unlock this property and mark it available on <strong>Explore Rooms</strong> for other prospective renters to discover.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                disabled={loading}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-300 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 transition-all cursor-pointer"
              >
                Close
              </button>

              <button
                type="button"
                onClick={handleConfirmApprove}
                disabled={loading}
                className="w-full sm:w-auto px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-purple-600 via-indigo-600 to-emerald-600 hover:from-purple-700 hover:to-emerald-700 shadow-md shadow-purple-600/20 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 size={14} className="animate-spin" />
                    <span>Processing Settlement...</span>
                  </>
                ) : (
                  <>
                    <Check size={14} />
                    <span>Approve Leave (Retain 30% & Free Room)</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default ApproveLeaveModal;
