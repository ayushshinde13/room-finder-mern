import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, X, Bed, Sparkles, Loader2, Send, User, Mail, MessageSquare } from "lucide-react";
import { useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import API from "../../services/api";
import toast from "react-hot-toast";

const RoomCard = ({ room }) => {
  const [open, setOpen] = useState(false);
  const [requestLoading, setRequestLoading] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  // Function to submit standard booking / enquiry request
  const handleRequestBooking = async (e) => {
    e.stopPropagation();
    
    if (!user) {
      toast.error('Please log in to enquire and request this room');
      navigate('/login');
      return;
    }

    if (user.role === 'OWNER') {
      toast.error('Owners cannot book or enquire on rooms');
      return;
    }

    if (room.isBooked) {
      toast.error('This room is already booked');
      return;
    }

    try {
      setRequestLoading(true);
      await API.post('/bookings', { roomId: room._id });
      toast.success(
        `Enquiry sent to ${room.owner?.name || 'the owner'}! Once approved, you can complete payment in My Bookings to confirm.`
      );
      navigate('/my-bookings');
    } catch (error) {
      console.error('Error booking room:', error);
      toast.error(error.response?.data?.message || 'Failed to submit booking request');
    } finally {
      setRequestLoading(false);
    }
  };

  const ownerName = room.owner?.name || "Property Owner";
  const ownerEmail = room.owner?.email || "";
  const ownerAvatar = room.owner?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(ownerName)}&background=10b981&color=fff&bold=true`;

  return (
    <>
      {/* Room Card */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        whileHover={{ y: -6 }}
        onClick={() => setOpen(true)}
        className="glass-panel rounded-3xl overflow-hidden shadow-sm hover:shadow-xl hover:shadow-emerald-500/5 border border-slate-200/50 dark:border-slate-800/80 transition-all duration-300 flex flex-col h-full group cursor-pointer"
      >
        {/* Image Area */}
        <div className="relative overflow-hidden aspect-[4/3] w-full">
          <img
            src={room.imageUrl || room.image || "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=600&q=80"}
            alt={room.title}
            className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
          />

          {/* Status badge */}
          <div className="absolute top-3 right-3">
            {room.isBooked ? (
              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold bg-red-500 text-white shadow-sm">
                OCCUPIED
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500 text-white shadow-sm">
                <Sparkles size={8} className="fill-white" /> AVAILABLE
              </span>
            )}
          </div>
        </div>

        {/* Content Area */}
        <div className="p-5 flex-1 flex flex-col justify-between">
          <div className="space-y-2.5">
            <div className="flex items-center justify-between gap-2">
              <span className="inline-flex items-center gap-1 text-[10px] font-bold tracking-wider text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 dark:bg-emerald-500/20 px-2 py-0.5 rounded-md uppercase">
                <Bed size={10} /> {room.bhkType || room.type || "Apartment"}
              </span>
            </div>
            
            <h3 className="text-base font-bold text-slate-900 dark:text-white leading-tight group-hover:text-emerald-500 dark:group-hover:text-emerald-400 transition-colors line-clamp-1">
              {room.title}
            </h3>

            {/* Location */}
            <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
              <MapPin size={14} className="text-slate-400 dark:text-slate-500 shrink-0" />
              <span className="truncate">{room.location}</span>
            </div>

            {/* Owner Profile Badge on Card */}
            {room.owner && (
              <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/50 dark:border-slate-800/60 mt-2">
                <img
                  src={ownerAvatar}
                  alt={ownerName}
                  className="w-6 h-6 rounded-full object-cover border border-emerald-500/40 shrink-0"
                />
                <div className="truncate text-left">
                  <span className="text-[9px] uppercase font-bold text-slate-400 block leading-tight">Landlord</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200 text-xs truncate block leading-tight">
                    {ownerName}
                  </span>
                </div>
              </div>
            )}
          </div>

          <div className="pt-4 mt-4 border-t border-slate-200/50 dark:border-slate-800/50 flex items-center justify-between gap-3">
            <div>
              <span className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 uppercase block leading-none">Monthly Rent</span>
              <span className="text-base font-extrabold text-slate-900 dark:text-white mt-1 block">
                ₹{room.rent || room.price}
              </span>
            </div>

            {/* Enquiry Request Action for Renters */}
            {!room.isBooked && user && user.role === 'RENTER' && (
              <button
                onClick={handleRequestBooking}
                disabled={requestLoading}
                className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-emerald-500/10 flex items-center gap-1.5 cursor-pointer active:scale-95 disabled:opacity-50"
                title="Send enquiry & request booking to landlord"
              >
                {requestLoading ? (
                  <>
                    <Loader2 size={13} className="animate-spin" />
                    <span>Sending...</span>
                  </>
                ) : (
                  <>
                    <MessageSquare size={13} />
                    <span>Enquire & Book</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </motion.div>

      {/* Fullscreen Image Preview */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/90 dark:bg-black/95 flex flex-col items-center justify-center pt-24 pb-8 px-4 sm:px-6 backdrop-blur-md overflow-y-auto"
            onClick={() => setOpen(false)}
          >
            <button
              onClick={() => setOpen(false)}
              className="fixed top-24 right-6 z-50 p-2.5 bg-white/20 hover:bg-white/30 text-white rounded-full transition-all duration-200 backdrop-blur-md hover:scale-110 shadow-lg"
              aria-label="Close Preview"
            >
              <X size={20} />
            </button>

            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="relative max-w-4xl w-full flex flex-col gap-4 my-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={room.imageUrl || room.image}
                alt={room.title}
                className="w-full max-h-[55vh] object-contain rounded-2xl shadow-2xl border border-white/10"
              />

              {/* Bottom metadata banner */}
              <div className="bg-slate-900/95 backdrop-blur-md p-5 rounded-2xl border border-slate-700/80 text-white flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 shadow-2xl">
                <div>
                  <h4 className="font-bold text-lg text-white">{room.title}</h4>
                  <div className="flex items-center gap-1.5 text-slate-300 text-xs mt-1">
                    <MapPin size={14} className="text-emerald-400" />
                    <span>{room.location}</span>
                  </div>

                  {room.owner && (
                    <div className="flex items-center gap-2 text-xs text-slate-300 mt-2">
                      <User size={12} className="text-emerald-400" />
                      <span>Landlord: <strong>{ownerName}</strong> ({ownerEmail})</span>
                    </div>
                  )}
                </div>
                
                <div className="flex items-center gap-6">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-semibold">BHK type</span>
                    <span className="text-sm font-bold block mt-0.5 text-white">{room.bhkType || room.type}</span>
                  </div>
                  <div className="border-l border-slate-700/60 pl-6">
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-semibold">Monthly rent</span>
                    <span className="text-base font-extrabold text-emerald-400 block mt-0.5">₹{room.rent || room.price}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default RoomCard;