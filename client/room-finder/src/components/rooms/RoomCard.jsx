import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, X } from "lucide-react";
import useAuth from "../../hooks/useAuth";

const RoomCard = ({ room }) => {
  const [open, setOpen] = useState(false);
  const [bookingStatus, setBookingStatus] = useState('available'); // available, pending, booked
  const { user, token } = useAuth();

  // Function to handle room booking
  const handleBookRoom = async (e) => {
    e.stopPropagation(); // Prevent triggering the image click event
    
    if (!user) {
      alert('Please log in to book a room');
      window.location.href = '/login';
      return;
    }

    if (user.role === 'OWNER') {
      alert('Owners cannot book rooms');
      return;
    }

    if (room.isBooked) {
      alert('This room is already booked');
      return;
    }

    try {
      setBookingStatus('pending');

      const response = await fetch('http://localhost:5001/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ roomId: room._id })
      });

      const data = await response.json();

      if (response.ok) {
        // Proceed to payment
        initiatePayment(room, data._id);
      } else {
        alert(`Failed to book room: ${data.message}`);
        setBookingStatus('available');
      }
    } catch (error) {
      console.error('Error booking room:', error);
      alert('An error occurred while booking the room');
      setBookingStatus('available');
    }
  };

  // Function to initiate payment for booking
  const initiatePayment = async (room, bookingId) => {
    try {
      const response = await fetch('http://localhost:5001/api/payments/initiate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          roomId: room._id,
          bookingId: bookingId,
          amount: room.rent, // Using rent as payment amount for simplicity
        })
      });

      const paymentData = await response.json();

      if (response.ok) {
        alert('Payment processed successfully! Your booking request is pending owner approval.');
        setBookingStatus('pending');
      } else {
        alert(`Payment failed: ${paymentData.message}`);
        setBookingStatus('available');
      }
    } catch (error) {
      console.error('Error initiating payment:', error);
      alert('An error occurred during payment processing');
      setBookingStatus('available');
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
                   transition overflow-hidden cursor-default"  // Changed from cursor-pointer to cursor-default
      >
        {/* Image */}
        <div className="relative overflow-hidden">
          <motion.img
            src={room.imageUrl || room.image}
            alt={room.title}
            className="h-48 w-full object-cover rounded-t-xl cursor-zoom-in"  // Changed cursor to zoom-in to indicate it's clickable
            whileHover={{ scale: 1.15 }}
            transition={{ duration: 0.4 }}
            onClick={(e) => {
              e.stopPropagation(); // Prevent triggering the card click event
              setOpen(true);
            }}  // Added direct click handler to the image
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

        {/* Book Now button for renters */}
        {!room.isBooked && user && user.role === 'RENTER' && (
          <div className="p-4 pt-0">
            <button
              onClick={handleBookRoom}
              disabled={bookingStatus === 'pending'}
              className={`w-full py-2 rounded-lg font-semibold transition-colors ${
                bookingStatus === 'pending'
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-green-600 hover:bg-green-700 text-white'
              }`}
            >
              {bookingStatus === 'pending' ? 'Pending Approval...' : 'Book Now'}
            </button>
            {bookingStatus === 'pending' && (
              <p className="text-xs text-gray-500 text-center mt-1">
                Awaiting owner approval
              </p>
            )}
          </div>
        )}
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

export default RoomCard;