import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import OwnerRoomCard from "../components/rooms/OwnerRoomCard";
import API from "../services/api";
import toast from "react-hot-toast";
import { Plus, Building2, AlertCircle, RefreshCw } from "lucide-react";
import Button from "../components/ui/Button";

const MyRooms = () => {
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchMyRooms = async () => {
    try {
      setLoading(true);
      setError(null);
      const { data } = await API.get("/rooms/owner");
      setRooms(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to fetch my rooms", err);
      setError("Failed to fetch your properties. Please retry.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!token || user?.role !== "OWNER") return;
    fetchMyRooms();
  }, [token, user]);

  const handleEditRoom = (roomId) => {
    navigate(`/edit-room/${roomId}`);
  };

  const handleDeleteRoom = async (roomId) => {
    if (!window.confirm("Are you sure you want to delete this property listing?")) {
      return;
    }

    try {
      await API.delete(`/rooms/${roomId}`);
      setRooms(rooms.filter((room) => room._id !== roomId));
      toast.success("Property removed successfully");
    } catch (err) {
      toast.error("Failed to delete property");
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#1D4ED8] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center p-4">
        <div className="bg-white dark:bg-[#111A2B] border border-red-200 dark:border-red-900/40 p-8 rounded-xl text-center max-w-md w-full space-y-4">
          <AlertCircle className="w-10 h-10 text-[#B91C1C] mx-auto" strokeWidth={1.5} />
          <h3 className="text-base font-bold text-[#0F1B2D] dark:text-[#F1F5F9]">
            Unable to load properties
          </h3>
          <p className="text-xs text-[#5B6B7F] dark:text-[#94A3B8]">{error}</p>
          <Button variant="secondary" size="sm" onClick={fetchMyRooms} className="w-full">
            <RefreshCw size={13} strokeWidth={1.75} />
            <span>Retry</span>
          </Button>
        </div>
      </div>
    );
  }

  if (!user || user.role !== "OWNER") {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <p className="text-[#B91C1C] font-semibold text-sm">Access denied. Landlords only.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 py-4 sm:py-6 text-left">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#0F1B2D] dark:text-[#F1F5F9]">
            My Listed Properties
          </h1>
          <p className="text-xs sm:text-sm text-[#5B6B7F] dark:text-[#94A3B8]">
            Manage, edit status, or add new residential properties to your portfolio.
          </p>
        </div>

        <Link to="/add-room" className="w-full sm:w-auto">
          <button
            type="button"
            className="w-full sm:w-auto h-10 px-4 bg-[#1D4ED8] hover:bg-[#1E40AF] dark:bg-[#3B82F6] dark:hover:bg-[#2563EB] text-white text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Plus size={15} strokeWidth={1.75} />
            <span>List New Property</span>
          </button>
        </Link>
      </div>

      {rooms.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-[#111A2B] border border-[#E3E8EE] dark:border-[#1F2A3D] rounded-xl space-y-4 max-w-lg mx-auto p-8">
          <Building2 className="w-10 h-10 text-[#5B6B7F] dark:text-[#94A3B8] mx-auto" strokeWidth={1.5} />
          <h3 className="text-base font-bold text-[#0F1B2D] dark:text-[#F1F5F9]">
            No rental properties listed yet
          </h3>
          <p className="text-xs text-[#5B6B7F] dark:text-[#94A3B8] leading-relaxed">
            Create your first verified property listing to receive tenant booking requests with zero brokerage fees.
          </p>
          <Link to="/add-room" className="inline-block pt-1">
            <Button variant="primary" size="md">
              <Plus size={15} strokeWidth={1.75} />
              <span>List Your First Property</span>
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
