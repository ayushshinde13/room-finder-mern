import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import useAuth from "../hooks/useAuth";
import toast from "react-hot-toast";
import { PlusCircle, Building, MapPin, Image, IndianRupee, ArrowLeft, Loader2 } from "lucide-react";

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
      toast.error("Please fill in all fields");
      return;
    }

    try {
      setLoading(true);
      await API.post("/rooms", {
        title: room.title,
        bhkType: room.type,
        rent: Number(room.price),
        location: room.location,
        imageUrl: room.image,
      });

      toast.success("Room added successfully");
      navigate("/my-rooms");
    } catch (err) {
      console.error("Error adding room:", err.response?.data || err.message);
      const errorMessage = err.response?.data?.message || err.message;
      toast.error(`Failed to add room: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="flex items-center gap-3 mb-8">
        <button
          onClick={() => navigate("/my-rooms")}
          className="p-2 hover:bg-slate-100 dark:hover:bg-slate-900 border border-slate-200/50 dark:border-slate-800/50 text-slate-500 rounded-xl transition-colors"
          aria-label="Go Back"
        >
          <ArrowLeft size={18} />
        </button>
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">
            List a New Room
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-xs mt-0.5">
            Add a new property to your landlord portfolio.
          </p>
        </div>
      </div>

      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-200/50 dark:border-slate-800/80 shadow-md">
        <form onSubmit={submitHandler} className="space-y-5">
          {/* Title */}
          <div className="space-y-1">
            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Room Title
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400 pointer-events-none">
                <Building size={16} />
              </span>
              <input
                type="text"
                value={room.title}
                onChange={(e) => setRoom({ ...room, title: e.target.value })}
                placeholder="e.g. Spacious 2BHK Near Metro Station"
                className="w-full pl-9 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800/30 border border-slate-200 dark:border-slate-800/80 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-slate-800 dark:text-white placeholder-slate-400 text-sm"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* BHK Type */}
            <div className="space-y-1">
              <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                BHK arrangement
              </label>
              <select
                value={room.type}
                onChange={(e) => setRoom({ ...room, type: e.target.value })}
                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800/30 border border-slate-200 dark:border-slate-800/80 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-slate-800 dark:text-white text-sm cursor-pointer appearance-none"
              >
                <option value="1BHK">1 BHK</option>
                <option value="2BHK">2 BHK</option>
                <option value="3BHK">3 BHK</option>
              </select>
            </div>

            {/* Monthly Rent */}
            <div className="space-y-1">
              <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Monthly Rent (₹)
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400 pointer-events-none">
                  <IndianRupee size={16} />
                </span>
                <input
                  type="number"
                  value={room.price}
                  onChange={(e) => setRoom({ ...room, price: e.target.value })}
                  placeholder="8500"
                  className="w-full pl-9 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800/30 border border-slate-200 dark:border-slate-800/80 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-slate-800 dark:text-white placeholder-slate-400 text-sm"
                  required
                />
              </div>
            </div>
          </div>

          {/* Location */}
          <div className="space-y-1">
            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Location / Address
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400 pointer-events-none">
                <MapPin size={16} />
              </span>
              <input
                type="text"
                value={room.location}
                onChange={(e) => setRoom({ ...room, location: e.target.value })}
                placeholder="e.g. Sector 62, Noida, UP"
                className="w-full pl-9 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800/30 border border-slate-200 dark:border-slate-800/80 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-slate-800 dark:text-white placeholder-slate-400 text-sm"
                required
              />
            </div>
          </div>

          {/* Image URL */}
          <div className="space-y-1">
            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Property Image URL
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400 pointer-events-none">
                <Image size={16} />
              </span>
              <input
                type="url"
                value={room.image}
                onChange={(e) => setRoom({ ...room, image: e.target.value })}
                placeholder="e.g. https://images.unsplash.com/photo-..."
                className="w-full pl-9 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800/30 border border-slate-200 dark:border-slate-800/80 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-slate-800 dark:text-white placeholder-slate-400 text-sm"
                required
              />
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full mt-4 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-semibold rounded-xl transition-all duration-200 shadow-lg shadow-emerald-500/10 flex items-center justify-center gap-1.5 text-sm disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                <span>Creating Listing...</span>
              </>
            ) : (
              <>
                <PlusCircle size={16} />
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