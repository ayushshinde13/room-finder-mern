import React, { useState, useEffect } from "react";
import useAuth from "../hooks/useAuth";
import { 
  Calendar, 
  MapPin, 
  User, 
  Mail, 
  ShieldAlert, 
  CheckCircle2, 
  AlertCircle, 
  XCircle, 
  Check, 
  X, 
  Receipt, 
  Clock 
} from "lucide-react";
import toast from "react-hot-toast";
import API from "../services/api";
import PaymentReceiptModal from "../components/payment/PaymentReceiptModal";
import ApproveLeaveModal from "../components/common/ApproveLeaveModal";
import Badge from "../components/ui/Badge";

const BookingRequests = () => {
  const { user, token } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [receiptBookingId, setReceiptBookingId] = useState(null);
  const [approveModalBooking, setApproveModalBooking] = useState(null);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      setError(null);
      const { data } = await API.get("/bookings/owner");
      setBookings(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error fetching booking requests:", err);
      setError(err.response?.data?.message || "Failed to fetch booking requests");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!token || user?.role !== "OWNER") return;
    fetchBookings();
  }, [token, user]);

  const updateBookingStatus = async (bookingId, status) => {
    try {
      const { data } = await API.put(`/bookings/${bookingId}`, { status });
      if (status === "REJECTED") {
        setBookings(bookings.filter((b) => b._id !== bookingId));
      } else {
        setBookings(
          bookings.map((b) => (b._id === bookingId ? { ...b, status: data.status } : b))
        );
      }
      toast.success(`Booking ${status.toLowerCase()} successfully`);
    } catch (err) {
      toast.error(err.response?.data?.message || `Failed to update booking`);
    }
  };

  const handleApproveSuccess = (updatedBooking) => {
    setBookings(bookings.map((b) => (b._id === updatedBooking._id ? updatedBooking : b)));
  };

  const handleRejectLeave = async (bookingId) => {
    if (!window.confirm("Reject tenant's request to vacate the room?")) {
      return;
    }

    try {
      const { data } = await API.post(`/bookings/${bookingId}/reject-leave`);
      setBookings(
        bookings.map((b) => (b._id === bookingId ? data.booking : b))
      );
      toast.success("Leave request rejected");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to reject leave request");
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#1D4ED8] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center p-4">
        <div className="bg-white dark:bg-[#111A2B] border border-red-200 dark:border-red-900/40 p-8 rounded-xl text-center max-w-md w-full space-y-4">
          <AlertCircle className="w-10 h-10 text-[#B91C1C] mx-auto" strokeWidth={1.5} />
          <h3 className="text-base font-bold text-[#0F1B2D] dark:text-[#F1F5F9]">
            Error Loading Requests
          </h3>
          <p className="text-xs text-[#5B6B7F] dark:text-[#94A3B8]">{error}</p>
          <button
            onClick={fetchBookings}
            className="h-9 px-4 bg-white dark:bg-[#111A2B] border border-[#E3E8EE] dark:border-[#1F2A3D] text-xs font-medium rounded-lg text-[#0F1B2D] dark:text-[#F1F5F9] hover:bg-[#F5F8FA]"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!user || user.role !== "OWNER") {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <p className="text-[#B91C1C] font-semibold text-sm">Access denied. Landlords only.</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 py-4 sm:py-6 text-left">
      <div className="space-y-1">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#0F1B2D] dark:text-[#F1F5F9]">
          Tenant Requests & Leases
        </h1>
        <p className="text-xs sm:text-sm text-[#5B6B7F] dark:text-[#94A3B8]">
          Review incoming tenancy applications and manage vacate requests for your properties.
        </p>
      </div>

      {bookings.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-[#111A2B] border border-[#E3E8EE] dark:border-[#1F2A3D] rounded-xl space-y-3 p-8">
          <Calendar className="w-10 h-10 text-[#5B6B7F] dark:text-[#94A3B8] mx-auto" strokeWidth={1.5} />
          <h3 className="text-base font-bold text-[#0F1B2D] dark:text-[#F1F5F9]">
            No pending tenant requests
          </h3>
          <p className="text-xs text-[#5B6B7F] dark:text-[#94A3B8] max-w-sm mx-auto leading-relaxed">
            When renters enquire or request to book your properties, their applications will appear here.
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

                {/* Right Request Details */}
                <div className="md:w-2/3 flex flex-col justify-between space-y-3">
                  <div className="space-y-2.5">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <h3 className="text-base sm:text-lg font-bold text-[#0F1B2D] dark:text-[#F1F5F9]">
                        {booking.room?.title}
                      </h3>

                      {booking.status === "PENDING" && (
                        <Badge variant="warning" size="sm">
                          Pending Decision
                        </Badge>
                      )}
                      {booking.status === "APPROVED" && (
                        <Badge variant="primary" size="sm">
                          Approved • Awaiting Payment
                        </Badge>
                      )}
                      {booking.status === "BOOKED" && (
                        <Badge variant="verified" size="sm">
                          <CheckCircle2 size={11} strokeWidth={2} />
                          <span>Paid & Occupied</span>
                        </Badge>
                      )}
                      {booking.status === "LEAVE_REQUESTED" && (
                        <Badge variant="warning" size="sm">
                          Vacate Requested
                        </Badge>
                      )}
                      {booking.status === "VACATED" && (
                        <Badge variant="neutral" size="sm">
                          Vacated
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

                    {/* Status Banners */}
                    {booking.status === "APPROVED" && (
                      <div className="p-3 bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800/40 rounded-lg text-xs text-[#1D4ED8] dark:text-blue-300 flex items-center gap-2">
                        <Clock size={14} strokeWidth={1.75} className="shrink-0" />
                        <span>Application approved. Awaiting tenant payment confirmation.</span>
                      </div>
                    )}

                    {booking.status === "BOOKED" && (
                      <div className="p-3 bg-[#DCFCE7]/70 dark:bg-emerald-950/30 border border-[#BBF7D0] dark:border-emerald-800/40 rounded-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
                        <div className="flex items-center gap-2 text-[#15803D] dark:text-emerald-300 font-medium">
                          <CheckCircle2 size={14} strokeWidth={2} className="shrink-0" />
                          <span>Rent paid and verified. Unit is currently occupied.</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => setReceiptBookingId(booking._id)}
                          className="h-8 px-3 bg-white dark:bg-[#111A2B] border border-[#E3E8EE] dark:border-[#1F2A3D] text-[#0F1B2D] dark:text-[#F1F5F9] rounded-lg text-xs font-medium hover:bg-[#F5F8FA] transition-colors inline-flex items-center gap-1.5 cursor-pointer shrink-0"
                        >
                          <Receipt size={13} strokeWidth={1.75} />
                          <span>View Receipt</span>
                        </button>
                      </div>
                    )}

                    {/* Vacate Request Notice */}
                    {booking.status === "LEAVE_REQUESTED" && (
                      <div className="p-3.5 bg-purple-50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-800/40 rounded-lg space-y-2 text-xs text-purple-900 dark:text-purple-300">
                        <div className="flex items-center gap-1.5 font-bold">
                          <AlertCircle size={15} strokeWidth={1.75} />
                          <span>Tenant Vacate Notice</span>
                        </div>
                        <p className="text-[#5B6B7F] dark:text-[#94A3B8]">
                          Tenant <strong>{booking.renter?.name}</strong> has submitted notice to vacate. Upon approval:
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                          <div className="p-2 rounded bg-white dark:bg-[#111A2B] border border-[#E3E8EE] dark:border-[#1F2A3D] text-[#0F1B2D] dark:text-[#F1F5F9]">
                            Retained in Owner Wallet (30%): <strong>₹{deductionEst.toLocaleString("en-IN")}</strong>
                          </div>
                          <div className="p-2 rounded bg-white dark:bg-[#111A2B] border border-[#E3E8EE] dark:border-[#1F2A3D] text-[#0F1B2D] dark:text-[#F1F5F9]">
                            Refund to Tenant Wallet (70%): <strong>₹{refundEst.toLocaleString("en-IN")}</strong>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Tenant Details */}
                    <div className="p-3 bg-[#F5F8FA] dark:bg-[#0B1220] rounded-lg border border-[#E3E8EE] dark:border-[#1F2A3D] space-y-1 text-xs">
                      <span className="text-[10px] font-semibold uppercase tracking-wider text-[#5B6B7F] dark:text-[#94A3B8] block">
                        Tenant Information
                      </span>
                      <div className="flex items-center gap-2 text-[#0F1B2D] dark:text-[#F1F5F9]">
                        <User size={13} strokeWidth={1.75} className="text-[#5B6B7F] dark:text-[#94A3B8]" />
                        <span className="font-medium">{booking.renter?.name || "Renter"}</span>
                      </div>
                      <div className="flex items-center gap-2 text-[#5B6B7F] dark:text-[#94A3B8]">
                        <Mail size={13} strokeWidth={1.75} />
                        <span className="break-all">{booking.renter?.email}</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions Bar */}
                  <div className="pt-3 border-t border-[#E3E8EE] dark:border-[#1F2A3D] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                    <span className="text-[#5B6B7F] dark:text-[#94A3B8] flex items-center gap-1.5">
                      <Calendar size={13} strokeWidth={1.75} />
                      <span>Received {new Date(booking.createdAt).toLocaleDateString()}</span>
                    </span>

                    <div className="flex flex-wrap items-center gap-2">
                      {booking.status === "PENDING" && (
                        <div className="flex gap-2 w-full sm:w-auto">
                          <button
                            type="button"
                            onClick={() => updateBookingStatus(booking._id, "APPROVED")}
                            className="flex-1 sm:flex-initial h-9 px-4 bg-[#1D4ED8] hover:bg-[#1E40AF] text-white rounded-lg text-xs font-medium transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                          >
                            <Check size={14} strokeWidth={1.75} />
                            <span>Approve</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => updateBookingStatus(booking._id, "REJECTED")}
                            className="flex-1 sm:flex-initial h-9 px-4 border border-[#E3E8EE] dark:border-[#1F2A3D] text-[#5B6B7F] hover:text-[#0F1B2D] rounded-lg text-xs font-medium transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                          >
                            <X size={14} strokeWidth={1.75} />
                            <span>Decline</span>
                          </button>
                        </div>
                      )}

                      {booking.status === "LEAVE_REQUESTED" && (
                        <div className="flex gap-2 w-full sm:w-auto">
                          <button
                            type="button"
                            onClick={() => setApproveModalBooking(booking)}
                            className="h-9 px-4 bg-[#0F766E] hover:bg-[#115E59] text-white rounded-lg text-xs font-medium transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                          >
                            <Check size={14} strokeWidth={1.75} />
                            <span>Approve Vacate (Retain 30%)</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => handleRejectLeave(booking._id)}
                            className="h-9 px-3.5 border border-[#E3E8EE] dark:border-[#1F2A3D] text-[#5B6B7F] hover:text-[#0F1B2D] rounded-lg text-xs font-medium transition-colors cursor-pointer"
                          >
                            <X size={14} strokeWidth={1.75} />
                            <span>Decline</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Approve Leave Modal Dialog */}
      {approveModalBooking && (
        <ApproveLeaveModal
          isOpen={Boolean(approveModalBooking)}
          onClose={() => setApproveModalBooking(null)}
          booking={approveModalBooking}
          onSuccess={handleApproveSuccess}
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

export default BookingRequests;
