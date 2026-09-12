import { useEffect, useState } from "react";
import useAuth from "../hooks/useAuth";
import { motion } from "framer-motion";
import {
  Calendar,
  MapPin,
  User,
  Mail,
  ShieldAlert,
  CheckCircle2,
  XCircle,
  CreditCard,
  Receipt,
  AlertCircle,
  Sparkles,
  Lock
} from "lucide-react";
import toast from "react-hot-toast";
import API from "../services/api";
import PaymentModal from "../components/payment/PaymentModal";
import PaymentReceiptModal from "../components/payment/PaymentReceiptModal";
import LeaveRoomModal from "../components/common/LeaveRoomModal";

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
      const { data } = await API.get('/bookings/my');
      setBookings(Array.isArray(data) ? data.filter(b => b.status !== 'REJECTED' && b.status !== 'CANCELLED') : []);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      toast.error('Error loading bookings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!token) return;
    fetchBookings();
  }, [token]);

  const cancelBooking = async (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this booking request?')) {
      return;
    }

    try {
      await API.put(`/bookings/${bookingId}`, { status: 'CANCELLED' });
      setBookings(bookings.filter(booking => booking._id !== bookingId));
      toast.success('Booking request cancelled and removed');
    } catch (error) {
      console.error('Error cancelling booking:', error);
      toast.error(error.response?.data?.message || 'An error occurred while cancelling');
    }
  };

  const handleLeaveSuccess = (updatedBooking) => {
    setBookings(bookings.map(b => b._id === updatedBooking._id ? updatedBooking : b));
  };

  const handlePaymentSuccess = () => {
    fetchBookings();
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-emerald-500" />
      </div>
    );
  }

  if (!user || user.role !== 'RENTER') {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center text-red-500 font-bold flex items-center gap-2">
          <ShieldAlert size={20} />
          <span>Access denied. Renters only.</span>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          My Bookings
        </h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
          Review status of your rental contracts, complete payments, vacate rooms, and download receipts.
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
            No Active Bookings
          </h3>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-2 max-w-sm mx-auto">
            You haven't requested to book any rooms yet. Explore listings to make a booking.
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

                {/* Right Booking Details */}
                <div className="md:w-2/3 flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <h3 className="text-lg font-bold text-slate-900 dark:text-white leading-tight">
                        {booking.room?.title}
                      </h3>
                      
                      {/* Status Badge */}
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold shadow-sm tracking-wider uppercase ${
                        booking.status === 'PENDING' 
                          ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20' 
                          : booking.status === 'APPROVED'
                            ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20'
                            : booking.status === 'BOOKED'
                              ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                              : booking.status === 'LEAVE_REQUESTED'
                                ? 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20'
                                : booking.status === 'VACATED'
                                  ? 'bg-slate-700/10 text-slate-700 dark:text-slate-300 border border-slate-500/20'
                                  : booking.status === 'CANCELLED'
                                    ? 'bg-slate-100 text-slate-500 dark:bg-slate-850 dark:text-slate-400 border border-slate-200/20 dark:border-slate-800/25'
                                    : 'bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20'
                      }`}>
                        {booking.status === 'APPROVED' 
                          ? 'APPROVED • PAYMENT PENDING' 
                          : booking.status === 'BOOKED' 
                            ? 'PAID & OCCUPIED' 
                            : booking.status === 'LEAVE_REQUESTED'
                              ? 'VACATE REQUESTED • PENDING APPROVAL'
                              : booking.status === 'VACATED'
                                ? 'ROOM VACATED • 70% REFUNDED'
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

                    {/* Payment Required Callout for Approved Bookings */}
                    {booking.status === 'APPROVED' && (
                      <div className="p-3.5 bg-blue-500/10 border border-blue-500/20 rounded-2xl flex items-start gap-3">
                        <Sparkles className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
                        <div className="text-xs space-y-1">
                          <p className="font-bold text-blue-900 dark:text-blue-200">
                            Owner Approved Your Request!
                          </p>
                          <p className="text-blue-700/80 dark:text-blue-300/80">
                            Complete the rent payment to lock your reservation. Without payment, the room remains unbooked.
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Confirmed Banner for Booked */}
                    {booking.status === 'BOOKED' && (
                      <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
                        <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-300 font-semibold">
                          <CheckCircle2 size={16} className="text-emerald-500 shrink-0" />
                          <span>Active Tenancy: Room confirmed and locked for you.</span>
                        </div>
                        <button
                          onClick={() => setReceiptBookingId(booking._id)}
                          className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-600 text-white rounded-lg font-bold text-[11px] shadow-sm hover:bg-emerald-700 transition-colors shrink-0"
                        >
                          <Receipt size={12} />
                          <span>View Receipt</span>
                        </button>
                      </div>
                    )}

                    {/* Vacate Requested Banner */}
                    {booking.status === 'LEAVE_REQUESTED' && (
                      <div className="p-3.5 bg-purple-500/10 border border-purple-500/20 rounded-2xl space-y-1.5 text-xs text-purple-800 dark:text-purple-300">
                        <div className="flex items-center gap-2 font-bold text-purple-900 dark:text-purple-200">
                          <AlertCircle size={16} className="text-purple-500 shrink-0" />
                          <span>Leave Request Sent to Owner</span>
                        </div>
                        <p className="text-purple-700/90 dark:text-purple-300/90 leading-relaxed">
                          Your request to vacate this room is waiting for owner approval. Once approved:
                        </p>
                        <ul className="list-disc list-inside text-[11px] space-y-0.5 text-purple-700 dark:text-purple-300 font-medium">
                          <li>70% Refund (<strong className="font-bold">₹{refundEst.toLocaleString('en-IN')}</strong>) will be credited directly to your Wallet.</li>
                          <li>30% Early Vacate Fee (<strong className="font-bold">₹{deductionEst.toLocaleString('en-IN')}</strong>) is retained by the Owner.</li>
                        </ul>
                      </div>
                    )}

                    {/* Vacated Banner */}
                    {booking.status === 'VACATED' && (
                      <div className="p-3.5 bg-emerald-500/10 dark:bg-emerald-500/15 border border-emerald-500/20 dark:border-emerald-500/30 rounded-2xl space-y-1 text-xs">
                        <div className="flex items-center gap-2 font-bold text-emerald-800 dark:text-emerald-300">
                          <CheckCircle2 size={16} className="text-emerald-500 shrink-0" />
                          <span>Lease Terminated & Room Vacated</span>
                        </div>
                        <p className="text-emerald-700/90 dark:text-emerald-200/90 text-[11px] leading-relaxed">
                          70% Refund of <strong className="font-bold text-emerald-900 dark:text-emerald-100">₹{refundEst.toLocaleString('en-IN')}</strong> was credited to your wallet (30% retained by owner: <strong className="font-bold text-emerald-900 dark:text-emerald-100">₹{deductionEst.toLocaleString('en-IN')}</strong>).
                        </p>
                      </div>
                    )}
                    
                    {/* Owner Contact Details */}
                    <div className="p-3.5 bg-slate-50/50 dark:bg-slate-900/40 rounded-2xl border border-slate-200/20 dark:border-slate-800/20 space-y-1.5">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Owner Contact Details</span>
                      <div className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300">
                        <User size={13} className="text-slate-400" />
                        <span className="font-semibold">{booking.owner?.name}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300">
                        <Mail size={13} className="text-slate-400" />
                        <span>{booking.owner?.email}</span>
                      </div>
                    </div>
                  </div>

                  {/* Bottom Milestones / Actions */}
                  <div className="mt-5 pt-4 border-t border-slate-200/50 dark:border-slate-800/50 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div className="flex items-center gap-1.5 text-xs text-slate-400">
                      <Calendar size={14} />
                      <span>Requested on {new Date(booking.createdAt).toLocaleDateString()}</span>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      {/* Pay & Book button for APPROVED */}
                      {booking.status === 'APPROVED' && (
                        <button
                          onClick={() => setPayingBooking(booking)}
                          className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-600/20 active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer"
                        >
                          <CreditCard size={14} />
                          <span>Pay ₹{booking.room?.rent?.toLocaleString("en-IN")} & Book</span>
                        </button>
                      )}

                      {/* Request to Leave Room for BOOKED */}
                      {booking.status === 'BOOKED' && (
                        <button
                          onClick={() => setLeaveModalBooking(booking)}
                          className="px-4 py-2 bg-gradient-to-r from-rose-500 to-amber-600 hover:from-rose-600 hover:to-amber-700 text-white rounded-xl text-xs font-bold shadow-md shadow-rose-500/20 active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer"
                        >
                          <span>🚪 Request to Leave / Vacate</span>
                        </button>
                      )}

                      {/* Pending notification */}
                      {booking.status === 'PENDING' && (
                        <div className="inline-flex items-center gap-1 text-xs text-amber-500 font-semibold px-2.5 py-1 rounded-xl bg-amber-500/10 border border-amber-500/20">
                          <Lock size={12} />
                          <span>Awaiting Owner Approval</span>
                        </div>
                      )}
                      
                      {/* Cancel action */}
                      {(booking.status === 'PENDING' || booking.status === 'APPROVED') && (
                        <button
                          onClick={() => cancelBooking(booking._id)}
                          className="px-3.5 py-2 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white rounded-xl text-xs font-bold transition-all"
                        >
                          Cancel Request
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Leave Room Modal Dialog */}
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