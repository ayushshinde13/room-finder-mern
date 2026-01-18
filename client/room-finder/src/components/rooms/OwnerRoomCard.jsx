import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Edit3, Trash2, X } from "lucide-react";

const OwnerRoomCard = ({ room, onEdit, onDelete }) => {
  const [open, setOpen] = useState(false);

  // Function to handle room deletion
  const handleDelete = () => {
    if (onDelete) {
      onDelete(room._id);
    }
  };

  return (
    <>
      {/* Room Card */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        whileHover={{ scale: 1.03 }}
        className="bg-white dark:bg-gray-900
                   rounded-xl shadow hover:shadow-lg
                   transition overflow-hidden cursor-default" // Changed to cursor-default since we're not opening zoom on click
      >
        {/* Image */}
        <div className="relative overflow-hidden">
          <img
            src={room.imageUrl || room.image}
            alt={room.title}
            className="h-48 w-full object-cover rounded-t-xl cursor-pointer"
            onClick={() => setOpen(true)} // Open zoom when image is clicked
          />
          
          {/* Status badge */}
          {room.isBooked && (
            <div className="absolute top-3 right-3 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold">
              BOOKED
            </div>
          )}
          {!room.isBooked && room.isBooked !== undefined && (
            <div className="absolute top-3 right-3 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-bold">
              AVAILABLE
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4 space-y-1">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 truncate">
            {room.title}
          </h3>

          <p className="text-gray-500 dark:text-gray-400">
            {room.bhkType || room.type}
          </p>

          {/* 📍 Location */}
          <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400 truncate">
            <MapPin size={16} />
            <span>{room.location}</span>
          </div>

          <p className="text-green-600 font-bold mt-2">
            ₹{room.rent || room.price}/month
          </p>
        </div>

        {/* Owner Actions */}
        <div className="border-t border-gray-200 dark:border-gray-700 p-3 flex justify-between bg-gray-50 dark:bg-gray-800">
          <button
            onClick={() => onEdit && onEdit(room._id)}
            className="flex items-center gap-1 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
          >
            <Edit3 size={16} />
            <span>Edit</span>
          </button>
          <button
            onClick={handleDelete}
            className="flex items-center gap-1 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
          >
            <Trash2 size={16} />
            <span>Delete</span>
          </button>
        </div>
      </motion.div>

      {/* Fullscreen Image Preview */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50
                       bg-black/80 flex items-center justify-center p-4"
            onClick={() => setOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.85 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.3 }}
              className="space-y-4 max-w-4xl w-full relative"
              onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside the modal content
            >
              <button
                onClick={() => setOpen(false)}
                className="absolute top-4 right-4 bg-black/50 text-white rounded-full p-2 z-10 hover:bg-black/70 transition-colors"
              >
                <X size={24} />
              </button>
              
              <motion.img
                src={room.imageUrl || room.image}
                alt={room.title}
                className="w-full h-[70vh] object-contain rounded-xl shadow-2xl"
              />

              {/* Location and details under image */}
              <div className="flex flex-wrap justify-center items-center gap-4 text-white bg-black/30 p-4 rounded-lg backdrop-blur-sm">
                <div className="flex items-center gap-1">
                  <MapPin size={18} />
                  <span className="text-lg">{room.location}</span>
                </div>
                <div className="text-lg font-bold">₹{room.rent || room.price}/month</div>
                <div className="text-lg">{room.bhkType || room.type}</div>
                <div className="font-semibold">{room.title}</div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default OwnerRoomCard;