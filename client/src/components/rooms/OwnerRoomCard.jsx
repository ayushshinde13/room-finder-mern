import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Edit3, Trash2, X, Bed, Maximize2, Sparkles } from "lucide-react";

const OwnerRoomCard = ({ room, onEdit, onDelete }) => {
  const [open, setOpen] = useState(false);

  const handleDelete = (e) => {
    e.stopPropagation();
    if (onDelete) {
      onDelete(room._id);
    }
  };

  return (
    <>
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
            src={room.imageUrl || room.image}
            alt={room.title}
            className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
          />

          {/* Status badge */}
          <div className="absolute top-3 right-3">
            {room.isBooked ? (
              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold bg-red-500 text-white shadow-sm">
                BOOKED
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
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 text-[10px] font-bold tracking-wider text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 dark:bg-emerald-500/20 px-2 py-0.5 rounded-md uppercase">
                <Bed size={10} /> {room.bhkType || room.type || "Apartment"}
              </span>
            </div>
            
            <h3 className="text-base font-bold text-slate-900 dark:text-white leading-tight group-hover:text-emerald-500 dark:group-hover:text-emerald-400 transition-colors line-clamp-1">
              {room.title}
            </h3>

            {/* Location */}
            <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
              <MapPin size={14} className="text-slate-400 dark:text-slate-500" />
              <span className="truncate">{room.location}</span>
            </div>
          </div>

          <div className="pt-4 mt-4 border-t border-slate-200/50 dark:border-slate-800/50 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 uppercase block leading-none">Monthly Rent</span>
                <span className="text-base font-extrabold text-slate-900 dark:text-white mt-1 block">
                  ₹{room.rent || room.price}
                </span>
              </div>
            </div>

            {/* Owner Actions */}
            <div className="flex items-center gap-2 pt-2 border-t border-slate-200/20 dark:border-slate-800/20">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit && onEdit(room._id);
                }}
                className="flex-1 py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold transition-all flex items-center justify-center gap-1.5"
              >
                <Edit3 size={13} />
                <span>Edit</span>
              </button>
              
              <button
                onClick={handleDelete}
                className="py-2 px-3 rounded-xl bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5"
              >
                <Trash2 size={13} />
                <span>Delete</span>
              </button>
            </div>
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
            {/* Close button positioned below navbar */}
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

export default OwnerRoomCard;