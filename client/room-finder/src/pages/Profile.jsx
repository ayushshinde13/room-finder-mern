import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import { motion } from "framer-motion";

const Profile = () => {
  const { user, updateUser, logout, loading: authLoading } = useAuth();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });
  const [message, setMessage] = useState("");
  const [coins, setCoins] = useState(0);
  const [discountApplied, setDiscountApplied] = useState(false);
  const [ownerRooms, setOwnerRooms] = useState([]);
  const [roomsLoading, setRoomsLoading] = useState(true);
  const [showAvatarModal, setShowAvatarModal] = useState(false);
  const [selectedAvatar, setSelectedAvatar] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        currentPassword: "",
        newPassword: "",
        confirmNewPassword: "",
      });
      setCoins(user.coins || 0);
      setSelectedAvatar(user.avatar || "");
      
      // Fetch owner's data if user is an owner
      if (user.role === "OWNER") {
        fetchOwnerRooms();
      }
    }
  }, [user]);

  const fetchOwnerRooms = async () => {
    if (!user || user.role !== "OWNER") return;

    try {
      setRoomsLoading(true);
      const roomsResponse = await fetch(`http://localhost:5001/api/rooms/owner`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (roomsResponse.ok) {
        const roomsData = await roomsResponse.json();
        setOwnerRooms(roomsData || []);
      } else {
        console.error("Failed to fetch owner rooms:", roomsResponse.statusText);
      }
    } catch (error) {
      console.error("Error fetching owner rooms:", error);
    } finally {
      setRoomsLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    if (formData.newPassword !== formData.confirmNewPassword) {
      setMessage("New passwords do not match!");
      return;
    }

    try {
      const updatedData = {
        name: formData.name,
        email: formData.email,
      };

      // Only include password in update if provided
      if (formData.newPassword) {
        updatedData.password = formData.newPassword;
      }

      // Include avatar if it has been changed
      if (selectedAvatar && selectedAvatar !== (user.avatar || "")) {
        updatedData.avatar = selectedAvatar;
      }

      const success = await updateUser(updatedData);
      if (success) {
        setMessage("Profile updated successfully!");
      } else {
        setMessage("Failed to update profile");
      }
    } catch (error) {
      setMessage("Error updating profile");
    }
  };

  const handleDeleteAccount = async () => {
    if (!window.confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:5001/api/users/profile`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (response.ok) {
        logout();
        navigate("/");
        alert("Account deleted successfully");
      } else {
        const data = await response.json();
        alert(`Failed to delete account: ${data.message}`);
      }
    } catch (error) {
      console.error("Error deleting account:", error);
      alert("Error deleting account");
    }
  };

  const applyDiscount = () => {
    if (coins >= 10 && !discountApplied) {
      // For demonstration purposes, we'll just show a message
      // In a real app, this would apply the discount to the next booking
      alert(`Applied 10 coins for discount! You have ${coins - 10} coins remaining.`);
      setDiscountApplied(true);
    } else if (discountApplied) {
      alert("Discount already applied!");
    } else {
      alert("Not enough coins to apply discount. You need at least 10 coins.");
    }
  };

  // Handler for editing a room
  const handleEditRoom = (roomId) => {
    window.location.href = `/edit-room/${roomId}`;
  };

  // Handler for deleting a room
  const handleDeleteRoom = async (roomId) => {
    if (!window.confirm('Are you sure you want to delete this room?')) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:5001/api/rooms/${roomId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        // Remove the room from the local state
        setOwnerRooms(ownerRooms.filter(room => room._id !== roomId));
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

  // Handler for avatar click
  const handleAvatarClick = () => {
    setShowAvatarModal(true);
  };

  // Handler for selecting an avatar
  const selectAvatar = async (avatarUrl) => {
    setSelectedAvatar(avatarUrl);
    
    // Update the avatar immediately when selected
    try {
      const success = await updateUser({ avatar: avatarUrl });
      if (success) {
        // Avatar updated successfully
      } else {
        console.error("Failed to update avatar");
      }
    } catch (error) {
      console.error("Error updating avatar:", error);
    }
    
    setShowAvatarModal(false);
  };

  // If auth is still loading, show loading state
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-950">
        <p className="text-gray-500 text-lg">Loading profile...</p>
      </div>
    );
  }

  // If no user is authenticated
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-950">
        <div className="text-center">
          <p className="text-red-500 text-lg mb-4">Access Denied</p>
          <p className="text-gray-600 dark:text-gray-400">Please log in to view your profile</p>
          <button
            onClick={() => navigate('/login')}
            className="mt-4 px-6 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  // Avatar options
  const avatarOptions = [
    "https://randomuser.me/api/portraits/men/32.jpg",
    "https://randomuser.me/api/portraits/men/44.jpg", 
    "https://randomuser.me/api/portraits/men/22.jpg",
    "https://randomuser.me/api/portraits/men/67.jpg",
    "https://randomuser.me/api/portraits/women/32.jpg",
    "https://randomuser.me/api/portraits/women/44.jpg",
    "https://randomuser.me/api/portraits/women/65.jpg",
    "https://randomuser.me/api/portraits/women/12.jpg",
    "https://randomuser.me/api/portraits/men/19.jpg",
    "https://randomuser.me/api/portraits/women/25.jpg",
    "https://randomuser.me/api/portraits/men/56.jpg",
    "https://randomuser.me/api/portraits/women/78.jpg",
  ];

  // For OWNER role, show only basic info and rooms
  if (user.role === "OWNER") {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-950 py-8">
        <div className="max-w-6xl mx-auto px-4">
          {/* Owner Basic Info Section */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white dark:bg-gray-900 rounded-xl shadow p-6 mb-8"
          >
            <div className="flex flex-col items-center mb-6">
              <div 
                className="relative group cursor-pointer"
                onClick={handleAvatarClick}
              >
                <img
                  src={selectedAvatar || user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'User')}`}
                  alt="Avatar"
                  className="w-32 h-32 rounded-full border-4 border-green-500 mb-4 transition-transform duration-200 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <span className="text-white text-xs">Change</span>
                </div>
              </div>
              
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{user?.name}</h2>
              <p className="text-gray-600 dark:text-gray-400 capitalize text-lg">{user?.role}</p>
              <p className="text-gray-500 dark:text-gray-300 mt-1">{user?.email}</p>
            </div>

            <div className="bg-blue-100 dark:bg-blue-900/30 rounded-lg p-4 text-center">
              <h3 className="font-bold text-blue-800 dark:text-blue-200">Reward Coins</h3>
              <p className="text-2xl font-bold text-blue-600 dark:text-blue-400 mt-2">{coins || 0}</p>
              <button
                onClick={applyDiscount}
                disabled={discountApplied || (coins || 0) < 10}
                className={`mt-3 px-4 py-2 rounded-lg font-semibold ${
                  discountApplied || (coins || 0) < 10
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed" 
                    : "bg-green-600 text-white hover:bg-green-700"
                }`}
              >
                {discountApplied ? "Discount Applied" : "Apply 10 Coins Discount"}
              </button>
              <p className="text-xs text-gray-500 mt-2">
                Use 10 coins for ₹100 discount on next booking
              </p>
            </div>
          </motion.div>

          {/* My Rooms Section - Only for Owners */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-white dark:bg-gray-900 rounded-xl shadow p-6"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-green-500">My Rooms</h2>
            </div>
            
            {roomsLoading ? (
              <div className="py-8 text-center">
                <p className="text-gray-500">Loading your rooms...</p>
              </div>
            ) : ownerRooms && Array.isArray(ownerRooms) && ownerRooms.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {ownerRooms.map((room) => (
                  <motion.div
                    key={room._id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3 }}
                    whileHover={{ y: -5 }}
                    className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden border border-gray-200 dark:border-gray-700"
                  >
                    <div className="relative">
                      <img
                        src={room.imageUrl || "https://via.placeholder.com/400x200?text=No+Image"}
                        alt={room.title}
                        className="w-full h-48 object-cover"
                      />
                      <div className="absolute top-3 right-3">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          room.isBooked ? 'bg-red-500 text-white' : 'bg-green-500 text-white'
                        }`}>
                          {room.isBooked ? 'Booked' : 'Available'}
                        </span>
                      </div>
                    </div>
                    
                    <div className="p-4">
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white truncate">{room.title}</h3>
                      <p className="text-gray-600 dark:text-gray-300 text-sm truncate">{room.location}</p>
                      
                      <div className="mt-3 flex justify-between items-center">
                        <div>
                          <p className="text-green-600 font-bold">₹{room.rent}/month</p>
                          <p className="text-gray-500 dark:text-gray-400 text-sm">{room.bhkType}</p>
                        </div>
                        
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleEditRoom(room._id)}
                            className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition-colors"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteRoom(room._id)}
                            className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700 transition-colors"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="py-8 text-center">
                <p className="text-gray-500">No rooms added yet</p>
              </div>
            )}
          </motion.div>
        </div>
        
        {/* Avatar Selection Modal */}
        {showAvatarModal && (
          <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 max-w-md w-full max-h-[80vh] overflow-y-auto"
            >
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 text-center">Select Avatar</h3>
              
              <div className="grid grid-cols-3 gap-4 mb-6">
                {avatarOptions.map((avatar, index) => (
                  <div 
                    key={index}
                    className={`cursor-pointer rounded-full overflow-hidden border-4 ${
                      selectedAvatar === avatar 
                        ? 'border-green-500' 
                        : 'border-transparent hover:border-gray-400'
                    }`}
                    onClick={() => selectAvatar(avatar)}
                  >
                    <img 
                      src={avatar} 
                      alt={`Avatar ${index+1}`} 
                      className="w-full h-auto aspect-square object-cover"
                    />
                  </div>
                ))}
              </div>
              
              <div className="flex justify-center gap-3">
                <button
                  onClick={() => setShowAvatarModal(false)}
                  className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    );
  }

  // For RENTER role, show the profile with similar layout to owner
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-950 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Renter Basic Info Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white dark:bg-gray-900 rounded-xl shadow p-6 mb-8"
        >
          <div className="flex flex-col items-center mb-6">
            <div 
              className="relative group cursor-pointer"
              onClick={handleAvatarClick}
            >
              <img
                src={selectedAvatar || user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'User')}`}
                alt="Avatar"
                className="w-32 h-32 rounded-full border-4 border-green-500 mb-4 transition-transform duration-200 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <span className="text-white text-xs">Change</span>
              </div>
            </div>
            
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{user?.name}</h2>
            <p className="text-gray-600 dark:text-gray-400 capitalize text-lg">{user?.role}</p>
            <p className="text-gray-500 dark:text-gray-300 mt-1">{user?.email}</p>
          </div>

          <div className="bg-blue-100 dark:bg-blue-900/30 rounded-lg p-4 text-center">
            <h3 className="font-bold text-blue-800 dark:text-blue-200">Reward Coins</h3>
            <p className="text-2xl font-bold text-blue-600 dark:text-blue-400 mt-2">{coins || 0}</p>
            <button
              onClick={applyDiscount}
              disabled={discountApplied || (coins || 0) < 10}
              className={`mt-3 px-4 py-2 rounded-lg font-semibold ${
                discountApplied || (coins || 0) < 10
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed" 
                  : "bg-green-600 text-white hover:bg-green-700"
              }`}
            >
              {discountApplied ? "Discount Applied" : "Apply 10 Coins Discount"}
            </button>
            <p className="text-xs text-gray-500 mt-2">
              Use 10 coins for ₹100 discount on next booking
            </p>
          </div>
        </motion.div>

        {/* My Bookings Section - Only for Renters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-white dark:bg-gray-900 rounded-xl shadow p-6"
        >
          <h2 className="text-2xl font-bold text-green-500 mb-6">My Bookings</h2>
          <p className="text-gray-600 dark:text-gray-400">
            Your bookings are available on the <a href="/my-bookings" className="text-green-600 hover:underline">My Bookings</a> page.
          </p>
        </motion.div>
      </div>
      
      {/* Avatar Selection Modal */}
      {showAvatarModal && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 max-w-md w-full max-h-[80vh] overflow-y-auto"
          >
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 text-center">Select Avatar</h3>
            
            <div className="grid grid-cols-3 gap-4 mb-6">
              {avatarOptions.map((avatar, index) => (
                <div 
                  key={index}
                  className={`cursor-pointer rounded-full overflow-hidden border-4 ${
                    selectedAvatar === avatar 
                      ? 'border-green-500' 
                      : 'border-transparent hover:border-gray-400'
                  }`}
                  onClick={() => selectAvatar(avatar)}
                >
                  <img 
                    src={avatar} 
                    alt={`Avatar ${index+1}`} 
                    className="w-full h-auto aspect-square object-cover"
                  />
                </div>
              ))}
            </div>
            
            <div className="flex justify-center gap-3">
              <button
                onClick={() => setShowAvatarModal(false)}
                className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Profile;