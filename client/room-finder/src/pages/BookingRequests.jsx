import { useState, useEffect } from "react";
import useAuth from "../hooks/useAuth";
import { motion } from "framer-motion";

const BookingRequests = () => {
  const { user, token } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!token || user?.role !== "OWNER") return;

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
          const errorData = await response.json();
          setError(errorData.message || "Failed to fetch booking requests");
        }
      } catch (error) {
        console.error('Error fetching booking requests:', error);
        setError("Network error. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [token, user]);

  const updateBookingStatus = async (bookingId, status) => {
    try {
      const response = await fetch(`http://localhost:5001/api/bookings/${bookingId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status })
      });

      const data = await response.json();

      if (response.ok) {
        // Update the booking in the local state
        setBookings(bookings.map(booking => 
          booking._id === bookingId ? { ...booking, status: data.status } : booking
        ));
        
        alert(`Booking ${status.toLowerCase()} successfully`);
      } else {
        alert(`Failed to ${status.toLowerCase()} booking: ${data.message}`);
      }
    } catch (error) {
      console.error(`Error ${status.toLowerCase()}ing booking:`, error);
      alert(`Error ${status.toLowerCase()}ing booking`);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-400">
        Loading booking requests...
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-950">
        <div className="text-center p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md max-w-md w-full mx-4">
          <h3 className="text-xl font-bold text-red-500 mb-4">Error Loading Booking Requests</h3>
          <p className="text-gray-700 dark:text-gray-300 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!user || user.role !== 'OWNER') {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500">
        Access denied. Owners only.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-950 py-10 px-6">
      <motion.h1 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-3xl font-bold text-center text-green-500 mb-8"
      >
        Booking Requests
      </motion.h1>

      {bookings.length === 0 ? (
        <div className="text-center py-12">
          <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">No booking requests yet</h3>
          <p className="text-gray-500 dark:text-gray-400">When renters request to book your rooms, they will appear here</p>
        </div>
      ) : (
        <div className="max-w-6xl mx-auto space-y-6">
          {bookings.map((booking) => (
            <motion.div
              key={booking._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-white dark:bg-gray-900 rounded-xl shadow p-6"
            >
              <div className="flex flex-col md:flex-row gap-6">
                <div className="md:w-1/3">
                  <img
                    src={booking.room?.imageUrl}
                    alt={booking.room?.title}
                    className="w-full h-48 object-cover rounded-lg"
                  />
                </div>
                <div className="md:w-2/3 space-y-3">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                    {booking.room?.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">{booking.room?.location}</p>
                  <p className="text-green-600 font-bold">₹{booking.room?.rent}/month</p>
                  
                  <div className="mt-4">
                    <h4 className="font-semibold text-gray-800 dark:text-gray-200">Renter Details:</h4>
                    <p className="text-gray-700 dark:text-gray-300"><strong>Name:</strong> {booking.renter.name}</p>
                    <p className="text-gray-700 dark:text-gray-300"><strong>Email:</strong> {booking.renter.email}</p>
                  </div>
                  
                  <div className="flex items-center gap-2 mt-2">
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                      booking.status === 'PENDING' 
                        ? 'bg-yellow-100 text-yellow-800' 
                        : booking.status === 'APPROVED'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                    }`}>
                      {booking.status}
                    </span>
                    <span className="text-gray-500 text-sm">Requested on: {new Date(booking.createdAt).toLocaleDateString()}</span>
                  </div>
                  
                  {booking.status === 'PENDING' && (
                    <div className="flex gap-3 mt-4">
                      <button
                        onClick={() => updateBookingStatus(booking._id, 'APPROVED')}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => updateBookingStatus(booking._id, 'REJECTED')}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                      >
                        Reject
                      </button>
                    </div>
                  )}
                  
                  {booking.status === 'APPROVED' && (
                    <div className="mt-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <p className="text-green-700 dark:text-green-300 font-medium">✓ Booking Approved!</p>
                      <p className="text-green-600 dark:text-green-400 text-sm">Room is now marked as booked</p>
                    </div>
                  )}
                  
                  {booking.status === 'REJECTED' && (
                    <div className="mt-3 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                      <p className="text-red-700 dark:text-red-300 font-medium">✗ Booking Rejected</p>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BookingRequests;