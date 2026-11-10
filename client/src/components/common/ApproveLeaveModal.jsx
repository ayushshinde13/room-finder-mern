import React, { useState } from "react";
import {
  X,
  CheckCircle2,
  Wallet,
  Building,
  ArrowRight,
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
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 overflow-y-auto">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/60"
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-lg bg-white dark:bg-[#111A2B] rounded-xl shadow-xl border border-[#E3E8EE] dark:border-[#1F2A3D] overflow-hidden z-10 my-auto max-h-[92vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          disabled={loading}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-[#5B6B7F] dark:text-[#94A3B8] hover:text-[#0F1B2D] dark:hover:text-[#F1F5F9] hover:bg-[#F5F8FA] dark:hover:bg-[#1F2A3D] transition-colors cursor-pointer"
        >
          <X size={18} />
        </button>

        <div className="p-6 sm:p-7 space-y-5">
          {/* Title & Icon */}
          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-950/40 text-[#1D4ED8] dark:text-blue-400 flex items-center justify-center shrink-0 border border-blue-200 dark:border-blue-900/50">
              <CheckCircle2 size={20} />
            </div>
            <div className="space-y-0.5">
              <h3 className="text-lg font-bold text-[#0F1B2D] dark:text-[#F1F5F9]">
                Approve Vacate Notice
              </h3>
              <p className="text-xs text-[#5B6B7F] dark:text-[#94A3B8]">
                Settle the lease termination and immediately make your room available for new tenants.
              </p>
            </div>
          </div>

          {/* Tenant & Room Details Card */}
          <div className="p-4 rounded-lg bg-[#F5F8FA] dark:bg-[#0B1220] border border-[#E3E8EE] dark:border-[#1F2A3D] flex items-center gap-3.5">
            <img
              src={room?.imageUrl || "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=600&q=80"}
              alt={room?.title}
              className="w-16 h-12 rounded-md object-cover border border-[#E3E8EE] dark:border-[#1F2A3D] shrink-0"
            />
            <div className="min-w-0 flex-1">
              <h4 className="text-sm font-semibold text-[#0F1B2D] dark:text-[#F1F5F9] truncate">
                {room?.title}
              </h4>
              <p className="text-xs text-[#5B6B7F] dark:text-[#94A3B8] truncate mt-0.5">
                Tenant: <strong className="text-[#0F1B2D] dark:text-[#F1F5F9] font-medium">{booking.renter?.name}</strong> ({booking.renter?.email})
              </p>
              <div className="text-xs font-bold text-[#0F1B2D] dark:text-[#F1F5F9] mt-0.5">
                Rent: ₹{rent.toLocaleString("en-IN")}<span className="font-normal text-[#5B6B7F] dark:text-[#94A3B8]">/month</span>
              </div>
            </div>
          </div>

          {/* Financial Settlement Breakdown */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-[#5B6B7F] dark:text-[#94A3B8]">
              <span>Settlement Distribution</span>
              <span>Automatic</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* 30% Retention Card */}
              <div className="p-4 rounded-lg bg-[#F5F8FA] dark:bg-[#0B1220] border border-[#E3E8EE] dark:border-[#1F2A3D] flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-[#0F1B2D] dark:text-[#F1F5F9]">
                    30% Retained in Wallet
                  </span>
                  <Wallet size={16} className="text-[#15803D]" />
                </div>
                <div className="mt-2">
                  <span className="text-xl font-bold text-[#15803D]">
                    +₹{deductionAmount.toLocaleString("en-IN")}
                  </span>
                  <p className="text-[11px] text-[#5B6B7F] dark:text-[#94A3B8] mt-0.5">
                    Earned early vacate fee
                  </p>
                </div>
              </div>

              {/* 70% Refund to Tenant Card */}
              <div className="p-4 rounded-lg bg-[#F5F8FA] dark:bg-[#0B1220] border border-[#E3E8EE] dark:border-[#1F2A3D] flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-[#0F1B2D] dark:text-[#F1F5F9]">
                    70% Tenant Refund
                  </span>
                  <User size={16} className="text-[#1D4ED8]" />
                </div>
                <div className="mt-2">
                  <span className="text-xl font-bold text-[#1D4ED8]">
                    ₹{refundAmount.toLocaleString("en-IN")}
                  </span>
                  <p className="text-[11px] text-[#5B6B7F] dark:text-[#94A3B8] mt-0.5">
                    Refunded to tenant wallet
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Room Availability Callout */}
          <div className="p-3 bg-[#F5F8FA] dark:bg-[#0B1220] rounded-lg border border-[#E3E8EE] dark:border-[#1F2A3D] flex items-start gap-2.5 text-xs text-[#5B6B7F] dark:text-[#94A3B8]">
            <Check size={16} className="text-[#15803D] shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              Approving will immediately unlock this property and mark it available on <strong>Explore Rooms</strong> for other prospective renters.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-end gap-2.5 pt-1">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="w-full sm:w-auto h-10 px-5 rounded-lg text-xs font-medium text-[#0F1B2D] dark:text-[#F1F5F9] bg-white dark:bg-[#111A2B] border border-[#E3E8EE] dark:border-[#1F2A3D] hover:bg-[#F5F8FA] dark:hover:bg-[#1F2A3D] transition-colors cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={handleConfirmApprove}
              disabled={loading}
              className="w-full sm:w-auto h-10 px-5 rounded-lg text-xs font-semibold text-white bg-[#1D4ED8] hover:bg-[#1E40AF] transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 size={14} className="animate-spin" />
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <Check size={14} />
                  <span>Approve Leave & Free Room</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApproveLeaveModal;
