import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import OwnerRoomCard from "../components/rooms/OwnerRoomCard";
import { motion } from "framer-motion";
import API from "../services/api";
import toast from "react-hot-toast";
import { Plus, Building2, AlertCircle, RefreshCw } from "lucide-react";

const MyRooms = () => {
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!token || user?.role !== "OWNER") return;

    const fetchMyRooms = async () => {
      try {
        const { data } = await API.get("/rooms/owner");
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

  const handleEditRoom = (roomId) => {
    navigate(`/edit-room/${roomId}`);
  };

  const handleDeleteRoom = async (roomId) => {
    if (!window.confirm("Are you sure you want to delete this room?")) {
      return;
    }

    try {
      await API.delete(`/rooms/${roomId}`);
      setRooms(rooms.filter(room => room._id !== roomId));
      toast.success('Room deleted successfully');
    } catch (error) {
      console.error('Error deleting room:', error);
      toast.error('An error occurred while deleting the room');
    }
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-emerald-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center p-4">
        <div className="glass-panel p-8 rounded-3xl border border-red-500/20 text-center max-w-md w-full shadow-lg">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Error Loading Rooms</h3>
          <p className="text-slate-500 dark:text-slate-400 text-sm mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5"
          >
            <RefreshCw size={14} />
            <span>Retry Connection</span>
          </button>
        </div>
      </div>
    );
  }

  if (!user || user.role !== 'OWNER') {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <p className="text-red-500 font-bold">Access denied. Owners only.</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            My listed properties
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
            Manage, edit status, or add new properties to your rent portfolio.
          </p>
        </div>
        
        <button
          onClick={() => navigate("/add-room")}
          className="w-full sm:w-auto px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-emerald-500/10 flex items-center justify-center gap-1.5"
        >
          <Plus size={16} />
          <span>Add New Room</span>
        </button>
      </div>

      {rooms.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-16 glass-panel rounded-3xl border border-slate-200/50 dark:border-slate-800/50 max-w-2xl mx-auto"
        >
          <Building2 className="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200">
            No Rental Rooms Listed
          </h3>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-2 max-w-sm mx-auto mb-6">
            You haven't listed any rooms yet. Click the button below to add your first property listing.
          </p>
          <button
            onClick={() => navigate("/add-room")}
            className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-500/10 inline-flex items-center gap-1.5"
          >
            <Plus size={16} />
            <span>List Your First Room</span>
          </button>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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