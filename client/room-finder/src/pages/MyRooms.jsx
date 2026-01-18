import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import OwnerRoomCard from "../components/rooms/OwnerRoomCard";
import { motion } from "framer-motion";

const MyRooms = () => {
  const { user, token } = useAuth();
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!token || user?.role !== "OWNER") return;

    const fetchMyRooms = async () => {
      try {
        const response = await fetch("http://localhost:5001/api/rooms/owner", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          const errorData = await response.json();
          console.error("Failed to fetch my rooms:", errorData.message);
          setError(`Failed to fetch your rooms: ${errorData.message}`);
          return;
        }

        const data = await response.json();
        setRooms(data);
      } catch (error) {
        console.error("Failed to fetch my rooms", error);
        setError("Failed to fetch your rooms");
      } finally {
        setLoading(false);
      }
    };

    fetchMyRooms();
  }, [token, user]);

  // Handler for editing a room
  const handleEditRoom = (roomId) => {
    window.location.href = `/edit-room/${roomId}`;
  };

  // Handler for deleting a room
  const handleDeleteRoom = async (roomId) => {
    if (!window.confirm("Are you sure you want to delete this room?")) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:5001/api/rooms/${roomId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        // Remove the room from the local state
        setRooms(rooms.filter(room => room._id !== roomId));
        alert('Room deleted successfully');
      } else {
        const data = await response.json();
        alert(`Failed to delete room: ${data.message}`);
      }
    } catch (error) {
      console.error('Error deleting room:', error);
      alert('An error occurred while deleting the room');
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-400">
        Loading your rooms...
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-950">
        <div className="text-center p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md max-w-md w-full mx-4">
          <h3 className="text-xl font-bold text-red-500 mb-4">Error Loading Rooms</h3>
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

  // Not authorized
  if (!user || user.role !== 'OWNER') {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500">
        Access denied. Owners only.
      </div>
    );
  }

  // Empty state
  const EmptyState = () => (
    <div className="text-center py-12">
      <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">You haven't added any rooms yet</h3>
      <p className="text-gray-500 dark:text-gray-400 mb-6">Start by adding your first rental property</p>
      <Link
        to="/add-room"
        className="inline-block px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors"
      >
        Add Your First Room
      </Link>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-950 py-10 px-6">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-3xl font-bold text-center text-green-500 mb-8"
      >
        My Rooms
      </motion.h1>

      {rooms.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {rooms.map((room) => (
            <OwnerRoomCard 
              key={room._id} 
              room={room} 
              onEdit={handleEditRoom}
              onDelete={handleDeleteRoom}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default MyRooms;