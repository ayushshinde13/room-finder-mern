import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";

const EditRoom = () => {
  const { roomId } = useParams();
  const { user, token, loading } = useAuth();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    title: "",
    bhkType: "",
    rent: "",
    location: "",
    description: "",
    imageUrl: ""
  });
  const [loadingForm, setLoadingForm] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (loading) return;
    
    if (!user || user.role !== "OWNER") {
      navigate("/login");
      return;
    }

    const fetchRoomDetails = async () => {
      try {
        const response = await fetch(`http://localhost:5001/api/rooms/${roomId}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          const roomData = await response.json();
          
          // Check if the user owns this room
          if (roomData.owner._id !== user._id && roomData.owner !== user._id) {
            setMessage("You are not authorized to edit this room");
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
        } else {
          const errorData = await response.json();
          setMessage(errorData.message || "Failed to fetch room details");
        }
      } catch (error) {
        setMessage("An error occurred while fetching room details");
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
      const response = await fetch(`http://localhost:5001/api/rooms/${roomId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        const updatedRoom = await response.json();
        setMessage("Room updated successfully!");
        // Redirect to My Rooms after a short delay
        setTimeout(() => {
          navigate("/my-rooms");
        }, 1500);
      } else {
        const errorData = await response.json();
        setMessage(errorData.message || "Failed to update room");
      }
    } catch (error) {
      setMessage("An error occurred while updating the room");
    }
  };

  if (loading || loadingForm) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-950">
        <p className="text-gray-500">Loading room details...</p>
      </div>
    );
  }

  if (!user || user.role !== "OWNER") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-950">
        <p className="text-red-500">Access denied. Owners only.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-950 py-12">
      <div className="max-w-3xl mx-auto bg-white dark:bg-gray-900 rounded-xl shadow p-6 md:p-8">
        <h1 className="text-3xl font-bold text-center text-green-500 mb-8">Edit Room</h1>

        {message && (
          <div className={`p-3 rounded-lg mb-6 text-center ${
            message.includes("successfully") ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
          }`}>
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-gray-700 dark:text-gray-300 mb-2">Title *</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-800 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-gray-700 dark:text-gray-300 mb-2">BHK Type *</label>
            <select
              name="bhkType"
              value={formData.bhkType}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-800 dark:text-white"
            >
              <option value="">Select BHK Type</option>
              <option value="1BHK">1BHK</option>
              <option value="2BHK">2BHK</option>
              <option value="3BHK">3BHK</option>
            </select>
          </div>

          <div>
            <label className="block text-gray-700 dark:text-gray-300 mb-2">Rent (per month) *</label>
            <input
              type="number"
              name="rent"
              value={formData.rent}
              onChange={handleChange}
              required
              min="0"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-800 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-gray-700 dark:text-gray-300 mb-2">Location *</label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-800 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-gray-700 dark:text-gray-300 mb-2">Image URL *</label>
            <input
              type="text"
              name="imageUrl"
              value={formData.imageUrl}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-800 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-gray-700 dark:text-gray-300 mb-2">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="4"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-800 dark:text-white"
            ></textarea>
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              className="flex-1 px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors"
            >
              Update Room
            </button>
            <button
              type="button"
              onClick={() => navigate("/my-rooms")}
              className="flex-1 px-6 py-3 bg-gray-600 text-white rounded-lg font-semibold hover:bg-gray-700 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditRoom;