import { useEffect, useState } from "react";
import useAuth from "../hooks/useAuth";

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
          alert('Failed to fetch bookings');
        }
      } catch (error) {
        console.error('Error fetching bookings:', error);
        alert('Error fetching bookings');
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [token]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-400">
        Loading your bookings...
      </div>
    );
  }

  if (!user || user.role !== 'RENTER') {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500">
        Access denied. Renters only.
      </div>
    );
  }

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
        // Update the booking in the local state
        setBookings(bookings.map(booking => 
          booking._id === bookingId ? { ...booking, status: data.status } : booking
        ));
        alert('Booking cancelled successfully');
      } else {
        alert(`Failed to cancel booking: ${data.message}`);
      }
    } catch (error) {
      console.error('Error cancelling booking:', error);
      alert('An error occurred while cancelling the booking');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-950 py-10 px-6">
      <h1 className="text-3xl font-bold text-center text-green-500 mb-8">
        My Bookings
      </h1>

      {bookings.length === 0 ? (
        <p className="text-center text-gray-400">
          You haven't made any booking requests yet.
        </p>
      ) : (
        <div className="max-w-4xl mx-auto space-y-6">
          {bookings.map((booking) => (
            <div key={booking._id} className="bg-white dark:bg-gray-900 rounded-xl shadow p-6">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="md:w-1/3">
                  <img
                    src={booking.room.imageUrl}
                    alt={booking.room.title}
                    className="w-full h-48 object-cover rounded-lg"
                  />
                </div>
                <div className="md:w-2/3 space-y-3">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                    {booking.room.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">{booking.room.location}</p>
                  <p className="text-green-600 font-bold">₹{booking.room.rent}/month</p>
                  
                  <div className="mt-4">
                    <h4 className="font-semibold text-gray-800 dark:text-gray-200">Owner Details:</h4>
                    <p className="text-gray-700 dark:text-gray-300"><strong>Name:</strong> {booking.owner.name}</p>
                    <p className="text-gray-700 dark:text-gray-300"><strong>Email:</strong> {booking.owner.email}</p>
                  </div>
                  
                  <div className="flex items-center gap-2 mt-2">
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                      booking.status === 'PENDING' 
                        ? 'bg-yellow-100 text-yellow-800' 
                        : booking.status === 'APPROVED'
                          ? 'bg-green-100 text-green-800'
                          : booking.status === 'CANCELLED'
                            ? 'bg-gray-100 text-gray-800'
                            : 'bg-red-100 text-red-800'
                    }`}>
                      {booking.status}
                    </span>
                    <span className="text-gray-500 text-sm">Booked on: {new Date(booking.createdAt).toLocaleDateString()}</span>
                  </div>
                  
                  {booking.status === 'APPROVED' && (
                    <div className="mt-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <p className="text-green-700 dark:text-green-300 font-medium">✓ Booking Confirmed!</p>
                      <p className="text-green-600 dark:text-green-400 text-sm">Payment processed successfully</p>
                    </div>
                  )}
                  
                  {(booking.status === 'PENDING' || booking.status === 'APPROVED') && (
                    <div className="mt-4">
                      <button
                        onClick={() => cancelBooking(booking._id)}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                      >
                        Cancel Booking
                      </button>
                    </div>
                  )}
                  
                  {booking.status === 'CANCELLED' && (
                    <div className="mt-3 p-3 bg-gray-100 dark:bg-gray-800 rounded-lg">
                      <p className="text-gray-700 dark:text-gray-300 font-medium">Booking Cancelled</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyBookings;