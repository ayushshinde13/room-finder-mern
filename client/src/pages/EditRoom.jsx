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
        <div className="w-8 h-8 border-2 border-[#1D4ED8] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user || user.role !== "OWNER") {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <p className="text-[#B91C1C] font-semibold">Access denied. Landlords only.</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
      <div className="flex items-center gap-3 mb-8">
        <button
          onClick={() => navigate("/my-rooms")}
          className="p-2.5 bg-white dark:bg-[#111A2B] hover:bg-[#F5F8FA] dark:hover:bg-[#1F2A3D] border border-[#E3E8EE] dark:border-[#1F2A3D] text-[#5B6B7F] dark:text-[#94A3B8] rounded-lg transition-colors cursor-pointer"
          aria-label="Go Back"
        >
          <ArrowLeft size={18} />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-[#0F1B2D] dark:text-[#F1F5F9]">
            Edit Property Listing
          </h1>
          <p className="text-[#5B6B7F] dark:text-[#94A3B8] text-sm mt-0.5">
            Modify details and descriptions for your room listing.
          </p>
        </div>
      </div>

      <div className="bg-white dark:bg-[#111A2B] border border-[#E3E8EE] dark:border-[#1F2A3D] rounded-xl p-6 sm:p-8 shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Title */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-[#5B6B7F] dark:text-[#94A3B8] uppercase tracking-wider">
              Room Title
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-[#5B6B7F] dark:text-[#94A3B8] pointer-events-none">
                <Building size={16} />
              </span>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g. Spacious 2BHK Near Metro Station"
                className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-[#0B1220] border border-[#E3E8EE] dark:border-[#1F2A3D] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1D4ED8] focus:border-[#1D4ED8] text-[#0F1B2D] dark:text-[#F1F5F9] placeholder-[#5B6B7F]/60 dark:placeholder-[#94A3B8]/60 text-sm"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* BHK Type */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-[#5B6B7F] dark:text-[#94A3B8] uppercase tracking-wider">
                BHK arrangement
              </label>
              <select
                name="bhkType"
                value={formData.bhkType}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 bg-white dark:bg-[#0B1220] border border-[#E3E8EE] dark:border-[#1F2A3D] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1D4ED8] focus:border-[#1D4ED8] text-[#0F1B2D] dark:text-[#F1F5F9] text-sm cursor-pointer"
                required
              >
                <option value="">Select BHK Arrangement</option>
                <option value="1BHK">1 BHK</option>
                <option value="2BHK">2 BHK</option>
                <option value="3BHK">3 BHK</option>
              </select>
            </div>

            {/* Monthly Rent */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-[#5B6B7F] dark:text-[#94A3B8] uppercase tracking-wider">
                Monthly Rent (₹)
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-[#5B6B7F] dark:text-[#94A3B8] pointer-events-none">
                  <IndianRupee size={16} />
                </span>
                <input
                  type="number"
                  name="rent"
                  value={formData.rent}
                  onChange={handleChange}
                  placeholder="8500"
                  className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-[#0B1220] border border-[#E3E8EE] dark:border-[#1F2A3D] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1D4ED8] focus:border-[#1D4ED8] text-[#0F1B2D] dark:text-[#F1F5F9] placeholder-[#5B6B7F]/60 dark:placeholder-[#94A3B8]/60 text-sm"
                  required
                />
              </div>
            </div>
          </div>

          {/* Location */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-[#5B6B7F] dark:text-[#94A3B8] uppercase tracking-wider">
              Location / Address
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-[#5B6B7F] dark:text-[#94A3B8] pointer-events-none">
                <MapPin size={16} />
              </span>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="e.g. Sector 62, Noida, UP"
                className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-[#0B1220] border border-[#E3E8EE] dark:border-[#1F2A3D] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1D4ED8] focus:border-[#1D4ED8] text-[#0F1B2D] dark:text-[#F1F5F9] placeholder-[#5B6B7F]/60 dark:placeholder-[#94A3B8]/60 text-sm"
                required
              />
            </div>
          </div>

          {/* Image URL */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-[#5B6B7F] dark:text-[#94A3B8] uppercase tracking-wider">
              Property Image URL
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-[#5B6B7F] dark:text-[#94A3B8] pointer-events-none">
                <Image size={16} />
              </span>
              <input
                type="url"
                name="imageUrl"
                value={formData.imageUrl}
                onChange={handleChange}
                placeholder="e.g. https://images.unsplash.com/photo-..."
                className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-[#0B1220] border border-[#E3E8EE] dark:border-[#1F2A3D] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1D4ED8] focus:border-[#1D4ED8] text-[#0F1B2D] dark:text-[#F1F5F9] placeholder-[#5B6B7F]/60 dark:placeholder-[#94A3B8]/60 text-sm"
                required
              />
            </div>
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-[#5B6B7F] dark:text-[#94A3B8] uppercase tracking-wider">
              Description / Notes
            </label>
            <div className="relative">
              <span className="absolute top-3 left-3.5 text-[#5B6B7F] dark:text-[#94A3B8] pointer-events-none">
                <FileText size={16} />
              </span>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Details about power backup, wifi, water facility, security deposit..."
                rows="4"
                className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-[#0B1220] border border-[#E3E8EE] dark:border-[#1F2A3D] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1D4ED8] focus:border-[#1D4ED8] text-[#0F1B2D] dark:text-[#F1F5F9] placeholder-[#5B6B7F]/60 dark:placeholder-[#94A3B8]/60 text-sm resize-none"
              />
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 h-11 bg-[#1D4ED8] hover:bg-[#1E40AF] text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2 text-sm disabled:opacity-50 cursor-pointer"
            >
              {submitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
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
              className="flex-1 h-11 bg-white dark:bg-[#111A2B] hover:bg-[#F5F8FA] dark:hover:bg-[#1F2A3D] border border-[#E3E8EE] dark:border-[#1F2A3D] text-[#0F1B2D] dark:text-[#F1F5F9] font-medium rounded-lg transition-colors text-sm flex items-center justify-center gap-2 cursor-pointer"
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