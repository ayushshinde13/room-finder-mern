import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import useAuth from "../hooks/useAuth";
import toast from "react-hot-toast";
import { Building, MapPin, Image, IndianRupee, ArrowLeft, Plus } from "lucide-react";

const AddRoom = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [room, setRoom] = useState({
    title: "",
    type: "1BHK",
    price: "",
    location: "",
    image: "",
  });

  const submitHandler = async (e) => {
    e.preventDefault();
    
    if (!room.title || !room.type || !room.price || !room.location || !room.image) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      setLoading(true);
      await API.post("/rooms", {
        title: room.title.trim(),
        bhkType: room.type,
        rent: Number(room.price),
        location: room.location.trim(),
        imageUrl: room.image.trim(),
      });

      toast.success("Property listed successfully");
      navigate("/my-rooms");
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message;
      toast.error(`Failed to list property: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 py-4 sm:py-6 text-left">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => navigate("/my-rooms")}
          className="p-2 border border-[#E3E8EE] dark:border-[#1F2A3D] rounded-lg text-[#5B6B7F] hover:text-[#0F1B2D] dark:text-[#94A3B8] dark:hover:text-[#F1F5F9] hover:bg-[#F5F8FA] transition-colors cursor-pointer"
          aria-label="Go Back"
        >
          <ArrowLeft size={16} strokeWidth={1.75} />
        </button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#0F1B2D] dark:text-[#F1F5F9]">
            List a New Property
          </h1>
          <p className="text-xs text-[#5B6B7F] dark:text-[#94A3B8] mt-0.5">
            Add a residential rental unit to your landlord portfolio.
          </p>
        </div>
      </div>

      <div className="bg-white dark:bg-[#111A2B] border border-[#E3E8EE] dark:border-[#1F2A3D] rounded-xl p-6 sm:p-8 shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
        <form onSubmit={submitHandler} className="space-y-4">
          {/* Title */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-[#0F1B2D] dark:text-[#F1F5F9] uppercase tracking-wider">
              Property Title
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-[#5B6B7F] dark:text-[#94A3B8] pointer-events-none">
                <Building size={16} strokeWidth={1.75} />
              </span>
              <input
                type="text"
                required
                value={room.title}
                onChange={(e) => setRoom({ ...room, title: e.target.value })}
                placeholder="e.g. Furnished 2BHK Near Metro Station"
                className="w-full h-11 pl-10 pr-4 bg-white dark:bg-[#0B1220] text-[#0F1B2D] dark:text-[#F1F5F9] placeholder-[#5B6B7F]/60 dark:placeholder-[#94A3B8]/60 border border-[#E3E8EE] dark:border-[#1F2A3D] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1D4ED8]/20 focus:border-[#1D4ED8] dark:focus:ring-[#3B82F6]/30 dark:focus:border-[#3B82F6] transition-colors text-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* BHK Type */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-[#0F1B2D] dark:text-[#F1F5F9] uppercase tracking-wider">
                Unit Arrangement
              </label>
              <select
                value={room.type}
                onChange={(e) => setRoom({ ...room, type: e.target.value })}
                className="w-full h-11 px-3 bg-white dark:bg-[#0B1220] text-[#0F1B2D] dark:text-[#F1F5F9] border border-[#E3E8EE] dark:border-[#1F2A3D] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1D4ED8]/20 focus:border-[#1D4ED8] dark:focus:ring-[#3B82F6]/30 dark:focus:border-[#3B82F6] transition-colors text-sm cursor-pointer"
              >
                <option value="1BHK">1 BHK</option>
                <option value="2BHK">2 BHK</option>
                <option value="3BHK">3 BHK</option>
              </select>
            </div>

            {/* Monthly Rent */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-[#0F1B2D] dark:text-[#F1F5F9] uppercase tracking-wider">
                Monthly Rent (₹)
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-[#5B6B7F] dark:text-[#94A3B8] pointer-events-none">
                  <IndianRupee size={16} strokeWidth={1.75} />
                </span>
                <input
                  type="number"
                  required
                  min="0"
                  value={room.price}
                  onChange={(e) => setRoom({ ...room, price: e.target.value })}
                  placeholder="12000"
                  className="w-full h-11 pl-10 pr-4 bg-white dark:bg-[#0B1220] text-[#0F1B2D] dark:text-[#F1F5F9] placeholder-[#5B6B7F]/60 dark:placeholder-[#94A3B8]/60 border border-[#E3E8EE] dark:border-[#1F2A3D] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1D4ED8]/20 focus:border-[#1D4ED8] dark:focus:ring-[#3B82F6]/30 dark:focus:border-[#3B82F6] transition-colors text-sm"
                />
              </div>
            </div>
          </div>

          {/* Location */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-[#0F1B2D] dark:text-[#F1F5F9] uppercase tracking-wider">
              Address / Area
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-[#5B6B7F] dark:text-[#94A3B8] pointer-events-none">
                <MapPin size={16} strokeWidth={1.75} />
              </span>
              <input
                type="text"
                required
                value={room.location}
                onChange={(e) => setRoom({ ...room, location: e.target.value })}
                placeholder="e.g. Indiranagar, Bengaluru, Karnataka"
                className="w-full h-11 pl-10 pr-4 bg-white dark:bg-[#0B1220] text-[#0F1B2D] dark:text-[#F1F5F9] placeholder-[#5B6B7F]/60 dark:placeholder-[#94A3B8]/60 border border-[#E3E8EE] dark:border-[#1F2A3D] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1D4ED8]/20 focus:border-[#1D4ED8] dark:focus:ring-[#3B82F6]/30 dark:focus:border-[#3B82F6] transition-colors text-sm"
              />
            </div>
          </div>

          {/* Image URL */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-[#0F1B2D] dark:text-[#F1F5F9] uppercase tracking-wider">
              Verified Photo URL
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-[#5B6B7F] dark:text-[#94A3B8] pointer-events-none">
                <Image size={16} strokeWidth={1.75} />
              </span>
              <input
                type="url"
                required
                value={room.image}
                onChange={(e) => setRoom({ ...room, image: e.target.value })}
                placeholder="https://images.unsplash.com/photo-..."
                className="w-full h-11 pl-10 pr-4 bg-white dark:bg-[#0B1220] text-[#0F1B2D] dark:text-[#F1F5F9] placeholder-[#5B6B7F]/60 dark:placeholder-[#94A3B8]/60 border border-[#E3E8EE] dark:border-[#1F2A3D] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1D4ED8]/20 focus:border-[#1D4ED8] dark:focus:ring-[#3B82F6]/30 dark:focus:border-[#3B82F6] transition-colors text-sm"
              />
            </div>
          </div>

          {/* Solid Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full h-11 bg-[#1D4ED8] hover:bg-[#1E40AF] dark:bg-[#3B82F6] dark:hover:bg-[#2563EB] text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2 text-sm disabled:opacity-50 cursor-pointer mt-4"
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <Plus size={16} strokeWidth={1.75} />
                <span>Publish Listing</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddRoom;
