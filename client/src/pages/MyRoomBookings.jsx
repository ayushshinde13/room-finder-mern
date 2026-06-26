import { useEffect, useState } from "react";
import useAuth from "../hooks/useAuth";
import { motion } from "framer-motion";
import { Calendar, MapPin, User, Mail, ShieldAlert, CheckCircle2, AlertCircle, Eye } from "lucide-react";
import toast from "react-hot-toast";

const MyRoomBookings = () => {
  const { user, token } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) return;

    const fetchBookings = async () => {
      try {
        const response = await fetch('http://localhost:5001/api/bookings/owner', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          const data = await response.json();
          setBookings(data);
        } else {
          toast.error('Failed to fetch booking requests');
        }
      } catch (error) {
        console.error('Error fetching booking requests:', error);
        toast.error('Error loading bookings');
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [token]);

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-emerald-500" />
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
          Who Rented My Rooms
        </h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
          Complete database log of tenants who successfully leased or requested your rooms.
        </p>
      </div>

      {bookings.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-16 glass-panel rounded-3xl border border-slate-200/50 dark:border-slate-800/50"
        >
          <User className="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200">
            No Rental Records
          </h3>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-2 max-w-sm mx-auto">
            You don't have any bookings or requests listed for your properties yet.
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

              {/* Right Booking details */}
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
                  
                  {/* Renter detail log box */}
                  <div className="mt-4 p-4 bg-slate-50/50 dark:bg-slate-900/40 rounded-2xl border border-slate-200/20 dark:border-slate-800/20 space-y-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">Renter Contact Details</span>
                    <div className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300">
                      <User size={13} className="text-slate-400" />
                      <span className="font-semibold">{booking.renter?.name}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300">
                      <Mail size={13} className="text-slate-400" />
                      <span>{booking.renter?.email}</span>
                    </div>
                    <div className="text-[9px] font-mono text-slate-400 dark:text-slate-500 pt-1 border-t border-slate-200/10">
                      ID: {booking.renter?._id}
                    </div>
                  </div>
                </div>

                {/* Bottom Timeline details */}
                <div className="mt-6 pt-4 border-t border-slate-200/50 dark:border-slate-800/50 flex items-center justify-between gap-4 text-slate-400 text-xs">
                  <div className="flex items-center gap-1.5">
                    <Calendar size={14} />
                    <span>Requested on {new Date(booking.createdAt).toLocaleDateString()}</span>
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

export default MyRoomBookings;