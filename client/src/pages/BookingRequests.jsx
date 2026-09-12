import { useState, useEffect } from "react";
import useAuth from "../hooks/useAuth";
import { motion } from "framer-motion";
import { Calendar, MapPin, User, Mail, ShieldAlert, CheckCircle2, AlertCircle, XCircle, Check, X, Receipt, Clock, Sparkles } from "lucide-react";
import toast from "react-hot-toast";
import API from "../services/api";
import PaymentReceiptModal from "../components/payment/PaymentReceiptModal";
import ApproveLeaveModal from "../components/common/ApproveLeaveModal";

const BookingRequests = () => {
  const { user, token } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [receiptBookingId, setReceiptBookingId] = useState(null);
  const [approveModalBooking, setApproveModalBooking] = useState(null);

  const fetchBookings = async () => {
    try {
      const { data } = await API.get('/bookings/owner');
      setBookings(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching booking requests:', error);
      setError(error.response?.data?.message || "Failed to fetch booking requests");
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
      if (status === 'REJECTED') {
        setBookings(bookings.filter(booking => booking._id !== bookingId));
      } else {
        setBookings(bookings.map(booking => 
          booking._id === bookingId ? { ...booking, status: data.status } : booking
        ));
      }
      toast.success(`Booking ${status.toLowerCase()} successfully`);
    } catch (error) {
      console.error(`Error ${status.toLowerCase()}ing booking:`, error);
      toast.error(error.response?.data?.message || `Failed to ${status.toLowerCase()} booking`);
    }
  };

  const handleApproveSuccess = (updatedBooking) => {
    setBookings(bookings.map(b => b._id === updatedBooking._id ? updatedBooking : b));
  };

  const handleRejectLeave = async (bookingId) => {
    if (!window.confirm("Reject tenant's request to vacate the room?")) {
      return;
    }

    try {
      const { data } = await API.post(`/bookings/${bookingId}/reject-leave`);
      setBookings(bookings.map(booking => 
        booking._id === bookingId ? data.booking : booking
      ));
      toast.success('Leave request rejected.');
    } catch (error) {
      console.error('Error rejecting leave request:', error);
      toast.error(error.response?.data?.message || 'Failed to reject leave request');
    }
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-emerald-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center p-4">
        <div className="glass-panel p-8 rounded-3xl border border-red-500/20 text-center max-w-md w-full shadow-lg">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Error Loading Booking Requests</h3>
          <p className="text-slate-500 dark:text-slate-400 text-sm mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-xl text-xs font-bold transition-all"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!user || user.role !== 'OWNER') {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center text-red-500 font-bold flex items-center gap-2">
          <ShieldAlert size={20} />
          <span>Access denied. Owners only.</span>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          Booking Requests
        </h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
          Review, approve, or reject rental requests, handle tenant vacate notices, and track payments.
        </p>
      </div>

      {bookings.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-16 glass-panel rounded-3xl border border-slate-200/50 dark:border-slate-800/50"
        >
          <Calendar className="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200">
            No Pending Requests
          </h3>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-2 max-w-sm mx-auto">
            When renters submit requests to book or vacate your listed properties, they will show up here.
          </p>
        </motion.div>
      ) : (
        <div className="space-y-6">
          {bookings.map((booking) => {
            const rent = booking.room?.rent || 0;
            const refundEst = booking.refundAmount || Math.round(rent * 0.7);
            const deductionEst = booking.deductionAmount || Math.round(rent * 0.3);

            return (
              <motion.div
                key={booking._id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-panel p-6 rounded-3xl border border-slate-200/50 dark:border-slate-800/80 shadow-sm flex flex-col md:flex-row gap-6"
              >
                {/* Left Room Image */}
                <div className="md:w-1/3 aspect-[4/3] rounded-2xl overflow-hidden border border-slate-200/20 dark:border-slate-800/20">
                  <img
                    src={booking.room?.imageUrl || "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=600&q=80"}
                    alt={booking.room?.title}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Right Request Details */}
                <div className="md:w-2/3 flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <h3 className="text-lg font-bold text-slate-900 dark:text-white leading-tight">
                        {booking.room?.title}
                      </h3>
                      
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold shadow-sm tracking-wider uppercase ${
                        booking.status === 'PENDING' 
                          ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20' 
                          : booking.status === 'APPROVED'
                            ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20'
                            : booking.status === 'BOOKED'
                              ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                              : booking.status === 'LEAVE_REQUESTED'
                                ? 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20 animate-pulse'
                                : booking.status === 'VACATED'
                                  ? 'bg-slate-700/10 text-slate-700 dark:text-slate-300 border border-slate-500/20'
                                  : 'bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20'
                      }`}>
                        {booking.status === 'APPROVED' 
                          ? 'APPROVED (PAYMENT PENDING)' 
                          : booking.status === 'BOOKED' 
                            ? 'PAID & OCCUPIED' 
                            : booking.status === 'LEAVE_REQUESTED'
                              ? '🚪 TENANT VACATE REQUEST'
                              : booking.status === 'VACATED'
                                ? 'VACATED (30% RETAINED)'
                                : booking.status}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                      <MapPin size={14} className="text-slate-400" />
                      <span>{booking.room?.location} • {booking.room?.bhkType}</span>
                    </div>

                    <div className="text-base font-extrabold text-emerald-600 dark:text-emerald-400">
                      ₹{booking.room?.rent?.toLocaleString("en-IN")}/month
                    </div>

                    {/* Status Banner */}
                    {booking.status === 'APPROVED' && (
                      <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-2xl flex items-center gap-2 text-xs text-blue-700 dark:text-blue-300">
                        <Clock size={15} className="shrink-0" />
                        <span>Approved! Awaiting tenant to submit rent payment to lock property.</span>
                      </div>
                    )}

                    {booking.status === 'BOOKED' && (
                      <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-center justify-between gap-2 text-xs">
                        <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-300 font-semibold">
                          <CheckCircle2 size={15} className="shrink-0 text-emerald-500" />
                          <span>Rent paid! Room is currently occupied by this tenant.</span>
                        </div>
                        <button
                          onClick={() => setReceiptBookingId(booking._id)}
                          className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-600 text-white rounded-lg font-bold text-[11px] shadow-sm hover:bg-emerald-700 transition-colors"
                        >
                          <Receipt size={12} />
                          <span>Receipt</span>
                        </button>
                      </div>
                    )}

                    {/* Leave Request Alert Box for Owner */}
                    {booking.status === 'LEAVE_REQUESTED' && (
                      <div className="p-4 bg-purple-500/10 border border-purple-500/30 rounded-2xl space-y-2 text-xs">
                        <div className="flex items-center gap-2 font-bold text-purple-900 dark:text-purple-200">
                          <AlertCircle size={16} className="text-purple-500 shrink-0" />
                          <span>Tenant requested to leave & vacate this room</span>
                        </div>
                        <p className="text-purple-800/90 dark:text-purple-300/90">
                          Renter <strong className="font-semibold">{booking.renter?.name}</strong> has submitted a vacate notice. Review and approve the termination:
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 font-mono text-[11px]">
                          <div className="p-2 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-900 dark:text-purple-200">
                            💰 Retained in Owner Wallet (30%): <strong>₹{deductionEst.toLocaleString('en-IN')}</strong>
                          </div>
                          <div className="p-2 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-900 dark:text-purple-200">
                            💳 Refund to Tenant Wallet (70%): <strong>₹{refundEst.toLocaleString('en-IN')}</strong>
                          </div>
                        </div>
                        <p className="text-[11px] text-purple-700 dark:text-purple-400 font-sans italic">
                          * Approving will immediately unlock this room so new renters can explore and book it.
                        </p>
                      </div>
                    )}

                    {/* Vacated Banner */}
                    {booking.status === 'VACATED' && (
                      <div className="p-3.5 bg-emerald-500/10 dark:bg-emerald-500/15 border border-emerald-500/20 dark:border-emerald-500/30 rounded-2xl space-y-1 text-xs">
                        <div className="flex items-center gap-2 font-bold text-emerald-800 dark:text-emerald-300">
                          <CheckCircle2 size={16} className="text-emerald-500 shrink-0" />
                          <span>Room Vacated & Available on Explore</span>
                        </div>
                        <p className="text-emerald-700/90 dark:text-emerald-200/90 text-[11px] leading-relaxed">
                          Settlement complete: 30% retention fee (<strong className="font-bold text-emerald-900 dark:text-emerald-100">₹{deductionEst.toLocaleString('en-IN')}</strong>) kept in your wallet. 70% refund (<strong className="font-bold text-emerald-900 dark:text-emerald-100">₹{refundEst.toLocaleString('en-IN')}</strong>) sent to tenant.
                        </p>
                      </div>
                    )}
                    
                    {/* Renter Contact details */}
                    <div className="p-3.5 bg-slate-50/50 dark:bg-slate-900/40 rounded-2xl border border-slate-200/20 dark:border-slate-800/20 space-y-1.5">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Tenant Details</span>
                      <div className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300">
                        <User size={13} className="text-slate-400" />
                        <span className="font-semibold">{booking.renter?.name}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300">
                        <Mail size={13} className="text-slate-400" />
                        <span>{booking.renter?.email}</span>
                      </div>
                    </div>
                  </div>

                  {/* Bottom Actions */}
                  <div className="mt-5 pt-4 border-t border-slate-200/50 dark:border-slate-800/50 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div className="flex items-center gap-1.5 text-xs text-slate-400">
                      <Calendar size={14} />
                      <span>Submitted on {new Date(booking.createdAt).toLocaleDateString()}</span>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      {booking.status === 'PENDING' && (
                        <div className="flex gap-2">
                          <button
                            onClick={() => updateBookingStatus(booking._id, 'APPROVED')}
                            className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-emerald-500/5 flex items-center gap-1.5 cursor-pointer"
                          >
                            <Check size={14} />
                            <span>Approve Request</span>
                          </button>
                          <button
                            onClick={() => updateBookingStatus(booking._id, 'REJECTED')}
                            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                          >
                            <X size={14} />
                            <span>Reject</span>
                          </button>
                        </div>
                      )}

                      {/* LEAVE_REQUESTED Actions for Owner */}
                      {booking.status === 'LEAVE_REQUESTED' && (
                        <div className="flex gap-2">
                          <button
                            onClick={() => setApproveModalBooking(booking)}
                            className="px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-purple-600/20 flex items-center gap-1.5 cursor-pointer active:scale-95"
                          >
                            <Check size={14} />
                            <span>Approve Leave (Retain 30% & Free Room)</span>
                          </button>
                          <button
                            onClick={() => handleRejectLeave(booking._id)}
                            className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                          >
                            <X size={14} />
                            <span>Decline</span>
                          </button>
                        </div>
                      )}
                      
                      {booking.status === 'APPROVED' && (
                        <div className="inline-flex items-center gap-1 text-xs text-blue-500 font-bold px-2.5 py-1 rounded bg-blue-500/10 border border-blue-500/20">
                          <Clock size={13} />
                          <span>Awaiting Tenant Payment</span>
                        </div>
                      )}
                      
                      {booking.status === 'REJECTED' && (
                        <div className="inline-flex items-center gap-1 text-xs text-red-500 font-bold px-2.5 py-1 rounded bg-red-500/10 border border-red-500/20">
                          <XCircle size={14} />
                          <span>Rejected Request</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
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