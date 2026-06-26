import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import { motion, AnimatePresence } from "framer-motion";
import API from "../services/api";
import toast from "react-hot-toast";
import OwnerRoomCard from "../components/rooms/OwnerRoomCard";
import { 
  Coins, 
  Wallet, 
  User as UserIcon, 
  Mail, 
  Lock, 
  Trash2, 
  Camera, 
  Sparkles, 
  ArrowRight,
  Settings,
  CreditCard,
  LogOut,
  X,
  Check,
  Smile
} from "lucide-react";

const Profile = () => {
  const { user, updateUser, logout, loading: authLoading } = useAuth();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });
  const [coins, setCoins] = useState(0);
  const [discountApplied, setDiscountApplied] = useState(false);
  const [ownerRooms, setOwnerRooms] = useState([]);
  const [roomsLoading, setRoomsLoading] = useState(true);
  const [showAvatarModal, setShowAvatarModal] = useState(false);
  const [selectedAvatar, setSelectedAvatar] = useState("");
  const [activeTab, setActiveTab] = useState("profile"); // profile, wallet, rooms (owner)
  const [avatarTab, setAvatarTab] = useState("people");
  const [previewAvatar, setPreviewAvatar] = useState(null);
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
      
      if (user.role === "OWNER") {
        fetchOwnerRooms();
      }
    }
  }, [user]);

  const fetchOwnerRooms = async () => {
    if (!user || user.role !== "OWNER") return;

    try {
      setRoomsLoading(true);
      const { data: roomsData } = await API.get("/rooms/owner");
      setOwnerRooms(roomsData || []);
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

    if (formData.newPassword && formData.newPassword !== formData.confirmNewPassword) {
      toast.error("New passwords do not match!");
      return;
    }

    try {
      const updatedData = {
        name: formData.name,
        email: formData.email,
      };

      if (formData.newPassword) {
        updatedData.password = formData.newPassword;
      }

      if (selectedAvatar && selectedAvatar !== (user.avatar || "")) {
        updatedData.avatar = selectedAvatar;
      }

      const success = await updateUser(updatedData);
      if (success) {
        toast.success("Profile updated successfully!");
        setFormData(prev => ({
          ...prev,
          currentPassword: "",
          newPassword: "",
          confirmNewPassword: ""
        }));
      } else {
        toast.error("Failed to update profile");
      }
    } catch (error) {
      toast.error("Error updating profile");
    }
  };

  const handleDeleteAccount = async () => {
    if (!window.confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
      return;
    }

    try {
      await API.delete("/users/profile");
      logout();
      navigate("/");
      toast.success("Account deleted successfully");
    } catch (error) {
      toast.error("Error deleting account");
    }
  };

  const applyDiscount = () => {
    if (coins >= 10 && !discountApplied) {
      toast.success(`Applied 10 coins for discount! You have ${coins - 10} coins remaining.`);
      setDiscountApplied(true);
    } else if (discountApplied) {
      toast.error("Discount already applied!");
    } else {
      toast.error("Not enough coins to apply discount. You need at least 10 coins.");
    }
  };

  const handleEditRoom = (roomId) => {
    navigate(`/edit-room/${roomId}`);
  };

  const handleDeleteRoom = async (roomId) => {
    if (!window.confirm('Are you sure you want to delete this room?')) {
      return;
    }

    try {
      await API.delete(`/rooms/${roomId}`);
      setOwnerRooms(ownerRooms.filter(room => room._id !== roomId));
      toast.success('Room deleted successfully');
    } catch (error) {
      toast.error('An error occurred while deleting the room');
    }
  };

  const selectAvatar = async (avatarUrl) => {
    setSelectedAvatar(avatarUrl);
    try {
      await updateUser({ avatar: avatarUrl });
      toast.success("Avatar updated!");
    } catch (error) {
      console.error("Error updating avatar:", error);
    }
    setShowAvatarModal(false);
  };

  if (authLoading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-emerald-500" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center space-y-4">
          <p className="text-red-500 text-lg font-bold">Access Denied</p>
          <p className="text-slate-500">Please log in to view your profile dashboard.</p>
          <button
            onClick={() => navigate('/login')}
            className="px-6 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-xl font-semibold shadow-md"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }



  const avatarCategories = {
    people: [
      "https://ui-avatars.com/api/?name=Felix&background=6366f1&color=fff&size=128&bold=true&rounded=true",
      "https://ui-avatars.com/api/?name=Aneka&background=ec4899&color=fff&size=128&bold=true&rounded=true",
      "https://ui-avatars.com/api/?name=Rocky&background=8b5cf6&color=fff&size=128&bold=true&rounded=true",
      "https://ui-avatars.com/api/?name=Luna&background=10b981&color=fff&size=128&bold=true&rounded=true",
      "https://ui-avatars.com/api/?name=Max&background=f59e0b&color=fff&size=128&bold=true&rounded=true",
      "https://ui-avatars.com/api/?name=Zara&background=06b6d4&color=fff&size=128&bold=true&rounded=true",
      "https://ui-avatars.com/api/?name=Noah&background=ef4444&color=fff&size=128&bold=true&rounded=true",
      "https://ui-avatars.com/api/?name=Mia&background=f97316&color=fff&size=128&bold=true&rounded=true",
      "https://ui-avatars.com/api/?name=Liam&background=14b8a6&color=fff&size=128&bold=true&rounded=true",
      "https://ui-avatars.com/api/?name=Aria&background=a855f7&color=fff&size=128&bold=true&rounded=true",
      "https://ui-avatars.com/api/?name=Ethan&background=0ea5e9&color=fff&size=128&bold=true&rounded=true",
      "https://ui-avatars.com/api/?name=Chloe&background=d946ef&color=fff&size=128&bold=true&rounded=true",
    ],
    fun: [
      "https://ui-avatars.com/api/?name=🤖&background=3b82f6&color=fff&size=128&bold=true&rounded=true",
      "https://ui-avatars.com/api/?name=👾&background=8b5cf6&color=fff&size=128&bold=true&rounded=true",
      "https://ui-avatars.com/api/?name=🦊&background=f97316&color=fff&size=128&bold=true&rounded=true",
      "https://ui-avatars.com/api/?name=🐼&background=6b7280&color=fff&size=128&bold=true&rounded=true",
      "https://ui-avatars.com/api/?name=🦁&background=f59e0b&color=fff&size=128&bold=true&rounded=true",
      "https://ui-avatars.com/api/?name=🐯&background=ef4444&color=fff&size=128&bold=true&rounded=true",
      "https://ui-avatars.com/api/?name=🐸&background=10b981&color=fff&size=128&bold=true&rounded=true",
      "https://ui-avatars.com/api/?name=🐧&background=0ea5e9&color=fff&size=128&bold=true&rounded=true",
      "https://ui-avatars.com/api/?name=🦄&background=ec4899&color=fff&size=128&bold=true&rounded=true",
      "https://ui-avatars.com/api/?name=🐉&background=a855f7&color=fff&size=128&bold=true&rounded=true",
      "https://ui-avatars.com/api/?name=🦅&background=06b6d4&color=fff&size=128&bold=true&rounded=true",
      "https://ui-avatars.com/api/?name=🐺&background=64748b&color=fff&size=128&bold=true&rounded=true",
    ],
    shapes: [
      "https://ui-avatars.com/api/?name=AX&background=1d4ed8&color=fff&size=128&bold=true&rounded=false",
      "https://ui-avatars.com/api/?name=BZ&background=7c3aed&color=fff&size=128&bold=true&rounded=false",
      "https://ui-avatars.com/api/?name=CY&background=be123c&color=fff&size=128&bold=true&rounded=false",
      "https://ui-avatars.com/api/?name=DW&background=047857&color=fff&size=128&bold=true&rounded=false",
      "https://ui-avatars.com/api/?name=EV&background=b45309&color=fff&size=128&bold=true&rounded=false",
      "https://ui-avatars.com/api/?name=FU&background=0369a1&color=fff&size=128&bold=true&rounded=false",
      "https://ui-avatars.com/api/?name=GT&background=9d174d&color=fff&size=128&bold=true&rounded=false",
      "https://ui-avatars.com/api/?name=HS&background=065f46&color=fff&size=128&bold=true&rounded=false",
      "https://ui-avatars.com/api/?name=IR&background=4c1d95&color=fff&size=128&bold=true&rounded=false",
      "https://ui-avatars.com/api/?name=JQ&background=831843&color=fff&size=128&bold=true&rounded=false",
      "https://ui-avatars.com/api/?name=KP&background=134e4a&color=fff&size=128&bold=true&rounded=false",
      "https://ui-avatars.com/api/?name=LO&background=1e3a5f&color=fff&size=128&bold=true&rounded=false",
    ],
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      {/* Profile Header Card */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-panel p-6 rounded-3xl border border-slate-200/50 dark:border-slate-800/80 mb-8 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6"
      >
        <div className="flex flex-col md:flex-row items-center gap-6">
          <div 
            className="relative group cursor-pointer"
            onClick={() => setShowAvatarModal(true)}
          >
            <img
              src={selectedAvatar || user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'User')}&background=10b981&color=fff`}
              alt="Avatar"
              className="w-24 h-24 rounded-2xl border-4 border-emerald-500/20 shadow-md object-cover transition-transform duration-200 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/60 rounded-2xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <Camera size={20} className="text-white" />
            </div>
          </div>
          
          <div className="text-center md:text-left space-y-1">
            <div className="flex flex-col sm:flex-row items-center gap-2">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{user?.name}</h2>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 uppercase">
                {user?.role}
              </span>
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400">{user?.email}</p>
          </div>
        </div>

        {/* Tab Controls */}
        <div className="flex gap-2 bg-slate-100/50 dark:bg-slate-900/50 p-1.5 rounded-2xl border border-slate-200/20 dark:border-slate-800/20">
          <button
            onClick={() => setActiveTab("profile")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all duration-200 ${
              activeTab === "profile"
                ? "bg-white dark:bg-slate-800 text-emerald-600 dark:text-emerald-400 shadow-sm"
                : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
            }`}
          >
            Settings
          </button>
          
          <button
            onClick={() => setActiveTab("wallet")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all duration-200 ${
              activeTab === "wallet"
                ? "bg-white dark:bg-slate-800 text-emerald-600 dark:text-emerald-400 shadow-sm"
                : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
            }`}
          >
            Wallet
          </button>

          {user.role === "OWNER" && (
            <button
              onClick={() => setActiveTab("rooms")}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all duration-200 ${
                activeTab === "rooms"
                  ? "bg-white dark:bg-slate-800 text-emerald-600 dark:text-emerald-400 shadow-sm"
                  : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
              }`}
            >
              My Rooms
            </button>
          )}
        </div>
      </motion.div>

      {/* Main Tab Contents */}
      <div className="grid grid-cols-1 gap-8">
        {activeTab === "profile" && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-8"
          >
            {/* Settings Form */}
            <div className="lg:col-span-2 glass-panel p-6 sm:p-8 rounded-3xl border border-slate-200/50 dark:border-slate-800/80 shadow-sm space-y-6">
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Settings size={18} className="text-emerald-500" />
                  Account Details
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Update your contact details or password.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                      Your Name
                    </label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400 pointer-events-none">
                        <UserIcon size={16} />
                      </span>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800/30 border border-slate-200 dark:border-slate-800/80 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-slate-800 dark:text-white text-sm"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                      Email Address
                    </label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400 pointer-events-none">
                        <Mail size={16} />
                      </span>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800/30 border border-slate-200 dark:border-slate-800/80 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-slate-800 dark:text-white text-sm"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-200/50 dark:border-slate-800/50 space-y-4">
                  <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">Change Password (optional)</h4>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                        New Password
                      </label>
                      <div className="relative">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400 pointer-events-none">
                          <Lock size={16} />
                        </span>
                        <input
                          type="password"
                          name="newPassword"
                          placeholder="••••••••"
                          value={formData.newPassword}
                          onChange={handleChange}
                          className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800/30 border border-slate-200 dark:border-slate-800/80 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-slate-800 dark:text-white text-sm"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                        Confirm Password
                      </label>
                      <div className="relative">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400 pointer-events-none">
                          <Lock size={16} />
                        </span>
                        <input
                          type="password"
                          name="confirmNewPassword"
                          placeholder="••••••••"
                          value={formData.confirmNewPassword}
                          onChange={handleChange}
                          className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800/30 border border-slate-200 dark:border-slate-800/80 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-slate-800 dark:text-white text-sm"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-4 flex justify-end">
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-semibold rounded-xl text-xs transition-all shadow-md shadow-emerald-500/10 flex items-center gap-1.5"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </div>

            {/* Danger Zone */}
            <div className="glass-panel p-6 rounded-3xl border border-slate-200/50 dark:border-slate-800/80 shadow-sm flex flex-col justify-between gap-6">
              <div>
                <h3 className="text-lg font-bold text-red-500 flex items-center gap-2">
                  <Trash2 size={18} />
                  Danger Zone
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Once deleted, your account data cannot be recovered.
                </p>
              </div>

              <div className="p-4 bg-red-500/5 dark:bg-red-500/10 border border-red-500/25 rounded-2xl">
                <span className="text-xs text-red-600 dark:text-red-400 font-semibold block">Deactivate Account</span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 block mt-1">
                  This deletes all room lists, booking history, and active payments.
                </span>
                <button
                  onClick={handleDeleteAccount}
                  className="mt-4 w-full py-2 bg-red-500 hover:bg-red-600 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-red-500/10"
                >
                  Delete My Account
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === "wallet" && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-xl mx-auto w-full"
          >
            {/* Coins / Wallet Card */}
            <div className="glass-panel p-8 rounded-3xl border border-slate-200/50 dark:border-slate-800/80 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 dark:bg-emerald-500/20 rounded-full blur-2xl pointer-events-none" />
              
              <div className="flex items-center gap-4">
                <span className="p-3.5 bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-500 rounded-2xl flex items-center justify-center">
                  <Wallet size={24} />
                </span>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">Active Balance</h3>
                  <p className="text-xs text-slate-500">Earn coins by completing booking agreements</p>
                </div>
              </div>

              <div className="my-8 flex items-baseline gap-2">
                <Coins size={36} className="text-emerald-500" />
                <span className="text-4xl font-extrabold tracking-tight text-slate-950 dark:text-white">{coins}</span>
                <span className="text-slate-500 dark:text-slate-400 text-sm font-semibold">Coins</span>
              </div>

              <div className="p-4 bg-slate-100/50 dark:bg-slate-900/50 border border-slate-200/30 dark:border-slate-800/30 rounded-2xl space-y-4">
                <div>
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200">Redeem Discount Voucher</span>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 block mt-1">
                    Exchange 10 coins for a ₹100 instant rental discount on bookings.
                  </span>
                </div>
                
                <button
                  onClick={applyDiscount}
                  disabled={discountApplied || coins < 10}
                  className={`w-full py-3 rounded-xl text-xs font-bold transition-all duration-200 flex items-center justify-center gap-1.5 ${
                    discountApplied || coins < 10
                      ? "bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed"
                      : "bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white shadow-md shadow-emerald-500/10"
                  }`}
                >
                  <Sparkles size={14} className={discountApplied ? "text-slate-400" : "fill-white/20"} />
                  {discountApplied ? "Discount Already Applied" : "Apply 10 Coins Voucher"}
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === "rooms" && user.role === "OWNER" && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="flex justify-between items-center px-2">
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Active Listed Rooms</h3>
                <p className="text-xs text-slate-500">Edit, activate, or remove your properties.</p>
              </div>
              
              <button
                onClick={() => navigate("/add-room")}
                className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white rounded-xl text-xs font-bold shadow-sm transition-all"
              >
                Add New Room
              </button>
            </div>

            {roomsLoading ? (
              <div className="py-12 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-emerald-500 mx-auto" />
              </div>
            ) : ownerRooms && ownerRooms.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {ownerRooms.map((room) => (
                  <OwnerRoomCard
                    key={room._id}
                    room={room}
                    onEdit={handleEditRoom}
                    onDelete={handleDeleteRoom}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-16 glass-panel rounded-3xl border border-slate-200/50 dark:border-slate-800/80">
                <p className="text-slate-500 text-sm font-semibold">No listed properties found.</p>
                <button
                  onClick={() => navigate("/add-room")}
                  className="mt-4 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-xs font-bold"
                >
                  Create Your First Listing
                </button>
              </div>
            )}
          </motion.div>
        )}
      </div>

      {/* Avatar Selection Modal */}
      <AnimatePresence>
        {showAvatarModal && (
          <div
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setShowAvatarModal(false)}
          >
            <motion.div
              initial={{ scale: 0.92, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.92, opacity: 0, y: 20 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col overflow-hidden"
              onClick={e => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-3">
                  <span className="p-2 bg-emerald-500/10 rounded-xl">
                    <Smile size={18} className="text-emerald-500" />
                  </span>
                  <div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white">Choose Your Avatar</h3>
                    <p className="text-xs text-slate-400 mt-0.5">Click an avatar to preview, then confirm</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowAvatarModal(false)}
                  className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Live Preview + Category Tabs */}
              <div className="px-6 py-4 flex items-center gap-4">
                <motion.img
                  key={previewAvatar || selectedAvatar}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  src={previewAvatar || selectedAvatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'User')}&background=10b981&color=fff`}
                  alt="Preview"
                  className="w-16 h-16 rounded-2xl border-4 border-emerald-500/30 shadow-lg object-cover flex-shrink-0 bg-slate-100"
                />
                <div className="flex-1">
                  <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-2 uppercase tracking-wider">Category</p>
                  <div className="flex gap-1.5 flex-wrap">
                    {[{key:"people",label:"👤 People"},{key:"fun",label:"🤖 Fun"},{key:"shapes",label:"🔷 Abstract"}].map(tab => (
                      <button
                        key={tab.key}
                        onClick={() => setAvatarTab(tab.key)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all duration-200 ${
                          avatarTab === tab.key
                            ? "bg-emerald-500 text-white shadow-md shadow-emerald-500/20"
                            : "bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
                        }`}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Avatar Grid */}
              <div className="px-6 pb-4 overflow-y-auto flex-1">
                <motion.div
                  key={avatarTab}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.15 }}
                  className="grid grid-cols-4 gap-3"
                >
                  {avatarCategories[avatarTab].map((avatar, index) => (
                    <motion.div
                      key={avatar}
                      whileHover={{ scale: 1.08 }}
                      whileTap={{ scale: 0.95 }}
                      className={`cursor-pointer rounded-2xl overflow-hidden border-2 aspect-square relative group ${
                        selectedAvatar === avatar
                          ? "border-emerald-500 shadow-lg shadow-emerald-500/20"
                          : "border-slate-200 dark:border-slate-700 hover:border-emerald-300 dark:hover:border-emerald-600"
                      }`}
                      onClick={() => setPreviewAvatar(avatar)}
                      onDoubleClick={() => selectAvatar(avatar)}
                    >
                      <img
                        src={avatar}
                        alt={`Avatar ${index + 1}`}
                        className="w-full h-full object-cover bg-slate-50"
                      />
                      {selectedAvatar === avatar && (
                        <div className="absolute top-1 right-1 bg-emerald-500 rounded-full p-0.5">
                          <Check size={10} className="text-white" strokeWidth={3} />
                        </div>
                      )}
                    </motion.div>
                  ))}
                </motion.div>
              </div>

              {/* Confirm Footer */}
              <div className="px-6 py-4 border-t border-slate-100 dark:border-slate-800 flex gap-3">
                <button
                  onClick={() => { setPreviewAvatar(null); setShowAvatarModal(false); }}
                  className="flex-1 py-2.5 rounded-xl text-xs font-bold border border-slate-200 dark:border-slate-700 text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  disabled={!previewAvatar && !selectedAvatar}
                  onClick={() => {
                    if (previewAvatar) selectAvatar(previewAvatar);
                    else setShowAvatarModal(false);
                  }}
                  className="flex-1 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white shadow-md shadow-emerald-500/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Check size={14} />
                  Use this Avatar
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Profile;