import { useEffect, useState } from "react";
import useAuth from "../hooks/useAuth";
import { motion } from "framer-motion";
import { Calendar, MapPin, User, Mail, ShieldAlert, Sparkles, CheckCircle2, AlertCircle, XCircle } from "lucide-react";
import toast from "react-hot-toast";

const MyBookings = () => {
  const { user, token } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) return;

    const fetchBookings = async () => {
      try {
        const response = await fetch('http://localhost:5001/api/bookings/my', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          const data = await response.json();
          setBookings(data);
        } else {
          toast.error('Failed to fetch bookings');
        }
      } catch (error) {
        console.error('Error fetching bookings:', error);
        toast.error('Error loading bookings');
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [token]);

  const cancelBooking = async (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:5001/api/bookings/${bookingId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: 'CANCELLED' })
      });

      const data = await response.json();

      if (response.ok) {
        setBookings(bookings.map(booking => 
          booking._id === bookingId ? { ...booking, status: data.status } : booking
        ));
        toast.success('Booking cancelled successfully');
      } else {
        toast.error(`Failed to cancel booking: ${data.message}`);
      }
    } catch (error) {
      console.error('Error cancelling booking:', error);
      toast.error('An error occurred while cancelling');
    }
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
          Review status of your rental contracts, payments, and owner approvals.
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
          {bookings.map((booking) => (
            <motion.div
              key={booking._id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-panel p-6 rounded-3xl border border-slate-200/50 dark:border-slate-800/80 shadow-sm flex flex-col md:flex-row gap-6"
            >
              {/* Left Room Image */}
              <div className="md:w-1/3 aspect-[4/3] rounded-2xl overflow-hidden border border-slate-200/20 dark:border-slate-800/20">
                <img
                  src={booking.room?.imageUrl || "https://via.placeholder.com/400x300?text=Listing+Image"}
                  alt={booking.room?.title}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Right Booking Details */}
              <div className="md:w-2/3 flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white leading-tight">
                      {booking.room?.title}
                    </h3>
                    
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold shadow-sm tracking-wider uppercase ${
                      booking.status === 'PENDING' 
                        ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20' 
                        : booking.status === 'APPROVED'
                          ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                          : booking.status === 'CANCELLED'
                            ? 'bg-slate-100 text-slate-500 dark:bg-slate-850 dark:text-slate-400 border border-slate-200/20 dark:border-slate-800/25'
                            : 'bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20'
                    }`}>
                      {booking.status}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                    <MapPin size={14} className="text-slate-400" />
                    <span>{booking.room?.location}</span>
                  </div>

                  <div className="text-base font-extrabold text-emerald-600 dark:text-emerald-400 pt-1">
                    ₹{booking.room?.rent}/month
                  </div>
                  
                  {/* Owner Card Details */}
                  <div className="mt-4 p-4 bg-slate-50/50 dark:bg-slate-900/40 rounded-2xl border border-slate-200/20 dark:border-slate-800/20 space-y-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">Owner Contact Details</span>
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
                <div className="mt-6 pt-4 border-t border-slate-200/50 dark:border-slate-800/50 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="flex items-center gap-1.5 text-xs text-slate-400">
                    <Calendar size={14} />
                    <span>Requested on {new Date(booking.createdAt).toLocaleDateString()}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    {booking.status === 'APPROVED' && (
                      <div className="inline-flex items-center gap-1 text-xs text-emerald-500 font-bold px-2 py-1 rounded bg-emerald-500/10">
                        <CheckCircle2 size={14} />
                        <span>Booking Confirmed</span>
                      </div>
                    )}
                    
                    {booking.status === 'CANCELLED' && (
                      <div className="inline-flex items-center gap-1 text-xs text-slate-400 font-bold px-2 py-1 rounded bg-slate-100 dark:bg-slate-850">
                        <XCircle size={14} />
                        <span>Contract Cancelled</span>
                      </div>
                    )}

                    {(booking.status === 'PENDING' || booking.status === 'APPROVED') && (
                      <button
                        onClick={() => cancelBooking(booking._id)}
                        className="px-4 py-2 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white rounded-xl text-xs font-bold transition-all"
                      >
                        Cancel Booking
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyBookings;