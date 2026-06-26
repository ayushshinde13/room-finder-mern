import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import API from "../services/api";
import toast from "react-hot-toast";
import { ArrowLeft, Building, IndianRupee, MapPin, Image, FileText, Save, X, Loader2 } from "lucide-react";

const EditRoom = () => {
  const { roomId } = useParams();
  const { user, token, loading } = useAuth();
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    title: "",
    bhkType: "",
    rent: "",
    location: "",
    description: "",
    imageUrl: ""
  });
  const [loadingForm, setLoadingForm] = useState(true);

  useEffect(() => {
    if (loading) return;
    
    if (!user || user.role !== "OWNER") {
      navigate("/login");
      return;
    }

    const fetchRoomDetails = async () => {
      try {
        const { data: roomData } = await API.get(`/rooms/${roomId}`);
        
        if (roomData.owner._id !== user._id && roomData.owner !== user._id) {
          toast.error("You are not authorized to edit this room");
          navigate("/my-rooms");
          return;
        }
        
        setFormData({
          title: roomData.title,
          bhkType: roomData.bhkType,
          rent: roomData.rent,
          location: roomData.location,
          description: roomData.description || "",
          imageUrl: roomData.imageUrl
        });
      } catch (error) {
        toast.error("An error occurred while fetching room details");
      } finally {
        setLoadingForm(false);
      }
    };

    fetchRoomDetails();
  }, [user, token, loading, roomId, navigate]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setSubmitting(true);
      await API.put(`/rooms/${roomId}`, formData);
      toast.success("Room updated successfully!");
      navigate("/my-rooms");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update room");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading || loadingForm) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-emerald-500" />
      </div>
    );
  }

  if (!user || user.role !== "OWNER") {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <p className="text-red-500 font-bold">Access denied. Owners only.</p>
      </div>
    );
  }

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
            Edit Property Listing
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-xs mt-0.5">
            Modify details and descriptions for your room listing.
          </p>
        </div>
      </div>

      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-200/50 dark:border-slate-800/80 shadow-md">
        <form onSubmit={handleSubmit} className="space-y-5">
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
                name="title"
                value={formData.title}
                onChange={handleChange}
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
                name="bhkType"
                value={formData.bhkType}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800/30 border border-slate-200 dark:border-slate-800/80 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-slate-800 dark:text-white text-sm cursor-pointer"
                required
              >
                <option value="">Select BHK Arrangement</option>
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
                  name="rent"
                  value={formData.rent}
                  onChange={handleChange}
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
                name="location"
                value={formData.location}
                onChange={handleChange}
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
                name="imageUrl"
                value={formData.imageUrl}
                onChange={handleChange}
                placeholder="e.g. https://images.unsplash.com/photo-..."
                className="w-full pl-9 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800/30 border border-slate-200 dark:border-slate-800/80 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-slate-800 dark:text-white placeholder-slate-400 text-sm"
                required
              />
            </div>
          </div>

          {/* Description */}
          <div className="space-y-1">
            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Description / Notes
            </label>
            <div className="relative">
              <span className="absolute top-3 left-3 text-slate-400 pointer-events-none">
                <FileText size={16} />
              </span>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Details about power backup, wifi, water facility, security deposit..."
                rows="4"
                className="w-full pl-9 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800/30 border border-slate-200 dark:border-slate-800/80 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-slate-800 dark:text-white placeholder-slate-400 text-sm"
              />
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-semibold rounded-xl transition-all duration-200 shadow-lg shadow-emerald-500/10 flex items-center justify-center gap-1.5 text-sm disabled:opacity-50"
            >
              {submitting ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  <span>Saving Updates...</span>
                </>
              ) : (
                <>
                  <Save size={16} />
                  <span>Save Changes</span>
                </>
              )}
            </button>
            <button
              type="button"
              onClick={() => navigate("/my-rooms")}
              className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-semibold rounded-xl transition-all duration-200 text-sm flex items-center justify-center gap-1.5"
            >
              <X size={16} />
              <span>Cancel</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditRoom;