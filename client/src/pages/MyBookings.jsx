import React, { useEffect, useState } from "react";
import useAuth from "../hooks/useAuth";
import {
  Calendar,
  MapPin,
  User,
  Mail,
  ShieldAlert,
  CheckCircle2,
  Receipt,
  AlertCircle,
  CreditCard,
  Lock
} from "lucide-react";
import toast from "react-hot-toast";
import API from "../services/api";
import PaymentModal from "../components/payment/PaymentModal";
import PaymentReceiptModal from "../components/payment/PaymentReceiptModal";
import LeaveRoomModal from "../components/common/LeaveRoomModal";
import Badge from "../components/ui/Badge";

const MyBookings = () => {
  const { user, token } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal states
  const [payingBooking, setPayingBooking] = useState(null);
  const [receiptBookingId, setReceiptBookingId] = useState(null);
  const [leaveModalBooking, setLeaveModalBooking] = useState(null);

  const fetchBookings = async () => {
    try {
      const { data } = await API.get("/bookings/my");
      setBookings(
        Array.isArray(data)
          ? data.filter((b) => b.status !== "REJECTED" && b.status !== "CANCELLED")
          : []
      );
    } catch (error) {
      console.error("Error fetching bookings:", error);
      toast.error("Error loading bookings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!token) return;
    fetchBookings();
  }, [token]);

  const cancelBooking = async (bookingId) => {
    if (!window.confirm("Are you sure you want to cancel this booking request?")) {
      return;
    }

    try {
      await API.put(`/bookings/${bookingId}`, { status: "CANCELLED" });
      setBookings(bookings.filter((booking) => booking._id !== bookingId));
      toast.success("Booking request cancelled");
    } catch (error) {
      toast.error(error.response?.data?.message || "An error occurred while cancelling");
    }
  };

  const handleLeaveSuccess = (updatedBooking) => {
    setBookings(bookings.map((b) => (b._id === updatedBooking._id ? updatedBooking : b)));
  };

  const handlePaymentSuccess = () => {
    fetchBookings();
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#1D4ED8] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user || user.role !== "RENTER") {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <div className="text-center text-[#B91C1C] font-semibold flex items-center gap-2">
          <ShieldAlert size={18} />
          <span>Access denied. Renters only.</span>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 py-4 sm:py-6 text-left">
      <div className="space-y-1">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#0F1B2D] dark:text-[#F1F5F9]">
          My Bookings & Contracts
        </h1>
        <p className="text-xs sm:text-sm text-[#5B6B7F] dark:text-[#94A3B8]">
          Review your rental requests, complete payments, vacate units, and download tax invoices.
        </p>
      </div>

      {bookings.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-[#111A2B] border border-[#E3E8EE] dark:border-[#1F2A3D] rounded-xl space-y-3">
          <Calendar className="w-10 h-10 text-[#5B6B7F] dark:text-[#94A3B8] mx-auto" strokeWidth={1.5} />
          <h3 className="text-base font-bold text-[#0F1B2D] dark:text-[#F1F5F9]">
            No active bookings found
          </h3>
          <p className="text-xs text-[#5B6B7F] dark:text-[#94A3B8] max-w-sm mx-auto leading-relaxed">
            You haven't requested to book any rooms yet. Browse available listings to enquire.
          </p>
        </div>
      ) : (
        <div className="space-y-5">
          {bookings.map((booking) => {
            const rent = Number(booking.room?.rent || 0);
            const refundEst = booking.refundAmount || Math.round(rent * 0.7);
            const deductionEst = booking.deductionAmount || Math.round(rent * 0.3);

            return (
              <div
                key={booking._id}
                className="bg-white dark:bg-[#111A2B] border border-[#E3E8EE] dark:border-[#1F2A3D] rounded-xl p-4 sm:p-6 shadow-[0_1px_2px_rgba(0,0,0,0.04)] flex flex-col md:flex-row gap-5"
              >
                {/* Left Room Image */}
                <div className="md:w-1/3 aspect-[16/10] sm:aspect-[4/3] rounded-lg overflow-hidden border border-[#E3E8EE] dark:border-[#1F2A3D] shrink-0 bg-[#F5F8FA] dark:bg-[#0B1220]">
                  <img
                    src={
                      booking.room?.imageUrl ||
                      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=600&q=80"
                    }
                    alt={booking.room?.title}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Right Details */}
                <div className="md:w-2/3 flex flex-col justify-between space-y-3">
                  <div className="space-y-2.5">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <h3 className="text-base sm:text-lg font-bold text-[#0F1B2D] dark:text-[#F1F5F9]">
                        {booking.room?.title}
                      </h3>

                      {booking.status === "PENDING" && (
                        <Badge variant="warning" size="sm">
                          Pending Owner Approval
                        </Badge>
                      )}
                      {booking.status === "APPROVED" && (
                        <Badge variant="primary" size="sm">
                          Approved • Payment Pending
                        </Badge>
                      )}
                      {booking.status === "BOOKED" && (
                        <Badge variant="verified" size="sm">
                          <CheckCircle2 size={11} strokeWidth={2} />
                          <span>Paid & Confirmed</span>
                        </Badge>
                      )}
                      {booking.status === "LEAVE_REQUESTED" && (
                        <Badge variant="warning" size="sm">
                          Vacate Requested
                        </Badge>
                      )}
                      {booking.status === "VACATED" && (
                        <Badge variant="neutral" size="sm">
                          Vacated & Settled
                        </Badge>
                      )}
                    </div>

                    <div className="flex items-center gap-1.5 text-xs text-[#5B6B7F] dark:text-[#94A3B8]">
                      <MapPin size={13} strokeWidth={1.75} className="shrink-0" />
                      <span>{booking.room?.location} • {booking.room?.bhkType}</span>
                    </div>

                    <div className="text-base font-bold text-[#0F1B2D] dark:text-[#F1F5F9]">
                      ₹{rent.toLocaleString("en-IN")}<span className="text-xs font-normal text-[#5B6B7F] dark:text-[#94A3B8]">/month</span>
                    </div>

                    {/* Approved Alert */}
                    {booking.status === "APPROVED" && (
                      <div className="p-3 bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800/40 rounded-lg text-xs space-y-1 text-[#1D4ED8] dark:text-blue-300">
                        <p className="font-semibold">Owner Approved Your Request</p>
                        <p className="text-[#5B6B7F] dark:text-[#94A3B8]">
                          Complete payment to finalize your reservation. The room is held until payment is confirmed.
                        </p>
                      </div>
                    )}

                    {/* Confirmed Banner for Booked */}
                    {booking.status === "BOOKED" && (
                      <div className="p-3 bg-[#DCFCE7]/70 dark:bg-emerald-950/30 border border-[#BBF7D0] dark:border-emerald-800/40 rounded-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
                        <div className="flex items-center gap-2 text-[#15803D] dark:text-emerald-300 font-medium">
                          <CheckCircle2 size={15} strokeWidth={2} className="shrink-0" />
                          <span>Active Tenancy: Room confirmed for you.</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => setReceiptBookingId(booking._id)}
                          className="h-8 px-3 bg-white dark:bg-[#111A2B] border border-[#E3E8EE] dark:border-[#1F2A3D] text-[#0F1B2D] dark:text-[#F1F5F9] rounded-lg text-xs font-medium hover:bg-[#F5F8FA] transition-colors inline-flex items-center gap-1.5 cursor-pointer w-full sm:w-auto justify-center"
                        >
                          <Receipt size={13} strokeWidth={1.75} />
                          <span>View Official Receipt</span>
                        </button>
                      </div>
                    )}

                    {/* Vacate Requested Banner */}
                    {booking.status === "LEAVE_REQUESTED" && (
                      <div className="p-3 bg-purple-50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-800/40 rounded-lg space-y-1 text-xs text-purple-900 dark:text-purple-300">
                        <p className="font-semibold flex items-center gap-1.5">
                          <AlertCircle size={14} strokeWidth={1.75} />
                          <span>Vacate Notice Submitted</span>
                        </p>
                        <p className="text-[#5B6B7F] dark:text-[#94A3B8]">
                          Waiting for owner approval. 70% (₹{refundEst.toLocaleString("en-IN")}) will be credited to your wallet, and 30% (₹{deductionEst.toLocaleString("en-IN")}) retained by the owner.
                        </p>
                      </div>
                    )}

                    {/* Vacated Banner */}
                    {booking.status === "VACATED" && (
                      <div className="p-3 bg-[#F5F8FA] dark:bg-[#0B1220] border border-[#E3E8EE] dark:border-[#1F2A3D] rounded-lg text-xs text-[#5B6B7F] dark:text-[#94A3B8]">
                        Lease completed. 70% refund (₹{refundEst.toLocaleString("en-IN")}) returned to your wallet.
                      </div>
                    )}

                    {/* Landlord Contact Info */}
                    <div className="p-3 bg-[#F5F8FA] dark:bg-[#0B1220] rounded-lg border border-[#E3E8EE] dark:border-[#1F2A3D] space-y-1 text-xs">
                      <span className="text-[10px] font-semibold uppercase tracking-wider text-[#5B6B7F] dark:text-[#94A3B8] block">
                        Landlord Information
                      </span>
                      <div className="flex items-center gap-2 text-[#0F1B2D] dark:text-[#F1F5F9]">
                        <User size={13} strokeWidth={1.75} className="text-[#5B6B7F] dark:text-[#94A3B8]" />
                        <span className="font-medium">{booking.owner?.name || "Landlord"}</span>
                      </div>
                      <div className="flex items-center gap-2 text-[#5B6B7F] dark:text-[#94A3B8]">
                        <Mail size={13} strokeWidth={1.75} />
                        <span className="break-all">{booking.owner?.email}</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions Bar */}
                  <div className="pt-3 border-t border-[#E3E8EE] dark:border-[#1F2A3D] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                    <span className="text-[#5B6B7F] dark:text-[#94A3B8] flex items-center gap-1.5">
                      <Calendar size={13} strokeWidth={1.75} />
                      <span>Requested {new Date(booking.createdAt).toLocaleDateString()}</span>
                    </span>

                    <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
                      {booking.status === "APPROVED" && (
                        <button
                          type="button"
                          onClick={() => setPayingBooking(booking)}
                          className="w-full sm:w-auto h-9 px-4 bg-[#1D4ED8] hover:bg-[#1E40AF] text-white rounded-lg font-medium text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          <CreditCard size={14} strokeWidth={1.75} />
                          <span>Pay ₹{rent.toLocaleString("en-IN")} & Confirm</span>
                        </button>
                      )}

                      {booking.status === "BOOKED" && (
                        <button
                          type="button"
                          onClick={() => setLeaveModalBooking(booking)}
                          className="w-full sm:w-auto h-9 px-4 bg-white dark:bg-[#111A2B] text-[#B91C1C] border border-[#B91C1C] hover:bg-red-50 dark:hover:bg-red-950/20 rounded-lg font-medium text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          <span>Request to Vacate</span>
                        </button>
                      )}

                      {booking.status === "PENDING" && (
                        <span className="inline-flex items-center gap-1.5 text-xs text-amber-800 dark:text-amber-300 font-medium px-2.5 py-1 rounded bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/40">
                          <Lock size={12} strokeWidth={1.75} />
                          <span>Awaiting Owner Review</span>
                        </span>
                      )}

                      {(booking.status === "PENDING" || booking.status === "APPROVED") && (
                        <button
                          type="button"
                          onClick={() => cancelBooking(booking._id)}
                          className="w-full sm:w-auto h-9 px-3 text-[#B91C1C] hover:bg-red-50 dark:hover:bg-red-950/20 rounded-lg text-xs font-medium transition-colors cursor-pointer"
                        >
                          Cancel Request
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Leave Room Modal */}
      {leaveModalBooking && (
        <LeaveRoomModal
          isOpen={Boolean(leaveModalBooking)}
          onClose={() => setLeaveModalBooking(null)}
          booking={leaveModalBooking}
          onSuccess={handleLeaveSuccess}
        />
      )}

      {/* Payment Checkout Modal */}
      {payingBooking && (
        <PaymentModal
          isOpen={Boolean(payingBooking)}
          onClose={() => setPayingBooking(null)}
          booking={payingBooking}
          room={payingBooking.room}
          onPaymentSuccess={handlePaymentSuccess}
        />
      )}

      {/* Payment Receipt Modal */}
      {receiptBookingId && (
        <PaymentReceiptModal
          isOpen={Boolean(receiptBookingId)}
          onClose={() => setReceiptBookingId(null)}
          bookingId={receiptBookingId}
        />
      )}
    </div>
  );
};

export default MyBookings;
