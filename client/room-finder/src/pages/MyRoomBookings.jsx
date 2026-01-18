import { useEffect, useState } from "react";
import useAuth from "../hooks/useAuth";

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
          alert('Failed to fetch booking requests');
        }
      } catch (error) {
        console.error('Error fetching booking requests:', error);
        alert('Error fetching booking requests');
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [token]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-400">
        Loading room bookings...
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
      <h1 className="text-3xl font-bold text-center text-green-500 mb-8">
        Who Rented My Rooms
      </h1>

      {bookings.length === 0 ? (
        <p className="text-center text-gray-400">
          No bookings for your rooms yet.
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
                    <h4 className="font-semibold text-gray-800 dark:text-gray-200">Renter Details:</h4>
                    <p className="text-gray-700 dark:text-gray-300"><strong>Name:</strong> {booking.renter.name}</p>
                    <p className="text-gray-700 dark:text-gray-300"><strong>Email:</strong> {booking.renter.email}</p>
                    <p className="text-gray-700 dark:text-gray-300"><strong>ID:</strong> {booking.renter._id}</p>
                  </div>
                  
                  <div className="flex flex-wrap gap-4 mt-4">
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Booking Status</p>
                      <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                        booking.status === 'PENDING' 
                          ? 'bg-yellow-100 text-yellow-800' 
                          : booking.status === 'APPROVED'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                      }`}>
                        {booking.status}
                      </span>
                    </div>
                    
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Booking Date</p>
                      <p className="text-gray-700 dark:text-gray-300">{new Date(booking.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyRoomBookings;