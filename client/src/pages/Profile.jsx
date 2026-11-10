import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import API from "../services/api";
import toast from "react-hot-toast";
import OwnerRoomCard from "../components/rooms/OwnerRoomCard";
import PaymentReceiptModal from "../components/payment/PaymentReceiptModal";
import { 
  Coins, 
  Wallet, 
  User as UserIcon, 
  Mail, 
  Lock, 
  Trash2, 
  Camera, 
  ArrowRight,
  Settings,
  CreditCard,
  LogOut,
  X,
  Check,
  Smile,
  IndianRupee,
  Receipt,
  ArrowUpRight,
  Building,
  Calendar,
  Copy,
  Clock
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
  
  // Wallet & Payment stats
  const [paymentsList, setPaymentsList] = useState([]);
  const [totalEarnings, setTotalEarnings] = useState(0);
  const [totalSpent, setTotalSpent] = useState(0);
  const [totalRefunded, setTotalRefunded] = useState(0);
  const [walletBalance, setWalletBalance] = useState(0);
  const [walletLoading, setWalletLoading] = useState(false);
  const [selectedReceiptBookingId, setSelectedReceiptBookingId] = useState(null);
  const [copiedTxn, setCopiedTxn] = useState(null);

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
      fetchWalletData();
    }
  }, [user]);

  const fetchWalletData = async () => {
    if (!user) return;
    try {
      setWalletLoading(true);
      if (user.role === "OWNER") {
        const { data } = await API.get("/payments/owner");
        setPaymentsList(data.payments || []);
        setTotalEarnings(data.totalEarnings || 0);
        setTotalRefunded(data.totalRefunded || 0);
      } else {
        const { data } = await API.get("/payments");
        setPaymentsList(data.payments || []);
        setTotalSpent(data.totalSpent || 0);
        setTotalRefunded(data.totalRefunded || 0);
        setWalletBalance(data.walletBalance || 0);
      }
    } catch (error) {
      console.error("Error fetching wallet transactions:", error);
    } finally {
      setWalletLoading(false);
    }
  };

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
        <div className="w-8 h-8 border-2 border-[#1D4ED8] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center space-y-4">
          <p className="text-[#B91C1C] text-lg font-bold">Access Denied</p>
          <p className="text-[#5B6B7F] dark:text-[#94A3B8]">Please log in to view your profile dashboard.</p>
          <button
            onClick={() => navigate('/login')}
            className="h-10 px-5 bg-[#1D4ED8] hover:bg-[#1E40AF] text-white rounded-lg font-medium text-sm transition-colors cursor-pointer"
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
      <div className="bg-white dark:bg-[#111A2B] p-6 rounded-xl border border-[#E3E8EE] dark:border-[#1F2A3D] mb-8 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex flex-col md:flex-row items-center gap-6">
          <div 
            className="relative group cursor-pointer"
            onClick={() => setShowAvatarModal(true)}
          >
            <img
              src={selectedAvatar || user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'User')}&background=1d4ed8&color=fff`}
              alt="Avatar"
              className="w-20 h-20 rounded-xl border border-[#E3E8EE] dark:border-[#1F2A3D] object-cover transition-transform duration-200 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/60 rounded-xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <Camera size={18} className="text-white" />
            </div>
          </div>
          
          <div className="text-center md:text-left space-y-1">
            <div className="flex flex-col sm:flex-row items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-bold text-[#0F1B2D] dark:text-[#F1F5F9]">{user?.name}</h2>
              <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold tracking-wide bg-blue-50 text-[#1D4ED8] dark:bg-blue-950/40 dark:text-blue-300 border border-blue-200 dark:border-blue-900/60 uppercase">
                {user?.role === 'OWNER' ? 'Landlord' : 'Renter'}
              </span>
            </div>
            <p className="text-sm text-[#5B6B7F] dark:text-[#94A3B8]">{user?.email}</p>
          </div>
        </div>

        {/* Tab Controls */}
        <div className="flex gap-2 bg-[#F5F8FA] dark:bg-[#0B1220] p-1 rounded-lg border border-[#E3E8EE] dark:border-[#1F2A3D] w-full sm:w-auto justify-center">
          <button
            onClick={() => setActiveTab("profile")}
            className={`px-4 py-2 rounded-md text-xs font-semibold transition-colors cursor-pointer ${
              activeTab === "profile"
                ? "bg-white dark:bg-[#111A2B] text-[#0F1B2D] dark:text-[#F1F5F9] shadow-sm border border-[#E3E8EE] dark:border-[#1F2A3D]"
                : "text-[#5B6B7F] dark:text-[#94A3B8] hover:text-[#0F1B2D] dark:hover:text-[#F1F5F9]"
            }`}
          >
            Settings
          </button>
          
          <button
            onClick={() => setActiveTab("wallet")}
            className={`px-4 py-2 rounded-md text-xs font-semibold transition-colors cursor-pointer ${
              activeTab === "wallet"
                ? "bg-white dark:bg-[#111A2B] text-[#0F1B2D] dark:text-[#F1F5F9] shadow-sm border border-[#E3E8EE] dark:border-[#1F2A3D]"
                : "text-[#5B6B7F] dark:text-[#94A3B8] hover:text-[#0F1B2D] dark:hover:text-[#F1F5F9]"
            }`}
          >
            Wallet & History
          </button>

          {user.role === "OWNER" && (
            <button
              onClick={() => setActiveTab("rooms")}
              className={`px-4 py-2 rounded-md text-xs font-semibold transition-colors cursor-pointer ${
                activeTab === "rooms"
                  ? "bg-white dark:bg-[#111A2B] text-[#0F1B2D] dark:text-[#F1F5F9] shadow-sm border border-[#E3E8EE] dark:border-[#1F2A3D]"
                  : "text-[#5B6B7F] dark:text-[#94A3B8] hover:text-[#0F1B2D] dark:hover:text-[#F1F5F9]"
              }`}
            >
              My Rooms
            </button>
          )}
        </div>
      </div>

      {/* Main Tab Contents */}
      <div className="grid grid-cols-1 gap-8">
        {activeTab === "profile" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column: Account Details & Password Security */}
            <div className="lg:col-span-2 space-y-6">
              {/* Account Details Form */}
              <div className="bg-white dark:bg-[#111A2B] p-6 sm:p-8 rounded-xl border border-[#E3E8EE] dark:border-[#1F2A3D] shadow-sm space-y-6">
                <div>
                  <h3 className="text-base font-bold text-[#0F1B2D] dark:text-[#F1F5F9] flex items-center gap-2">
                    <Settings size={18} className="text-[#1D4ED8]" />
                    Account Details
                  </h3>
                  <p className="text-xs text-[#5B6B7F] dark:text-[#94A3B8] mt-1">
                    Update your public profile name and contact email.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="block text-xs font-semibold text-[#5B6B7F] dark:text-[#94A3B8] uppercase tracking-wider">
                        Your Name
                      </label>
                      <div className="relative">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-[#5B6B7F] dark:text-[#94A3B8] pointer-events-none">
                          <UserIcon size={16} />
                        </span>
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-[#0B1220] border border-[#E3E8EE] dark:border-[#1F2A3D] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1D4ED8] focus:border-[#1D4ED8] text-[#0F1B2D] dark:text-[#F1F5F9] text-sm"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-xs font-semibold text-[#5B6B7F] dark:text-[#94A3B8] uppercase tracking-wider">
                        Email Address
                      </label>
                      <div className="relative">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-[#5B6B7F] dark:text-[#94A3B8] pointer-events-none">
                          <Mail size={16} />
                        </span>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-[#0B1220] border border-[#E3E8EE] dark:border-[#1F2A3D] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1D4ED8] focus:border-[#1D4ED8] text-[#0F1B2D] dark:text-[#F1F5F9] text-sm"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 flex justify-end">
                    <button
                      type="submit"
                      className="h-10 px-5 bg-[#1D4ED8] hover:bg-[#1E40AF] text-white font-medium rounded-lg text-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                    >
                      Save Account Info
                    </button>
                  </div>
                </form>
              </div>

              {/* Dedicated Password & Security Section */}
              <div className="bg-white dark:bg-[#111A2B] p-6 sm:p-8 rounded-xl border border-[#E3E8EE] dark:border-[#1F2A3D] shadow-sm space-y-6">
                <div>
                  <h3 className="text-base font-bold text-[#0F1B2D] dark:text-[#F1F5F9] flex items-center gap-2">
                    <Lock size={18} className="text-[#1D4ED8]" />
                    Password & Security
                  </h3>
                  <p className="text-xs text-[#5B6B7F] dark:text-[#94A3B8] mt-1">
                    Manage your credentials or change your account password.
                  </p>
                </div>

                {/* Direct Change Password Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="block text-xs font-semibold text-[#5B6B7F] dark:text-[#94A3B8] uppercase tracking-wider">
                        New Password
                      </label>
                      <div className="relative">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-[#5B6B7F] dark:text-[#94A3B8] pointer-events-none">
                          <Lock size={16} />
                        </span>
                        <input
                          type="password"
                          name="newPassword"
                          placeholder="At least 6 characters"
                          value={formData.newPassword}
                          onChange={handleChange}
                          className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-[#0B1220] border border-[#E3E8EE] dark:border-[#1F2A3D] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1D4ED8] focus:border-[#1D4ED8] text-[#0F1B2D] dark:text-[#F1F5F9] text-sm"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-xs font-semibold text-[#5B6B7F] dark:text-[#94A3B8] uppercase tracking-wider">
                        Confirm New Password
                      </label>
                      <div className="relative">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-[#5B6B7F] dark:text-[#94A3B8] pointer-events-none">
                          <Lock size={16} />
                        </span>
                        <input
                          type="password"
                          name="confirmNewPassword"
                          placeholder="Re-enter password"
                          value={formData.confirmNewPassword}
                          onChange={handleChange}
                          className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-[#0B1220] border border-[#E3E8EE] dark:border-[#1F2A3D] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1D4ED8] focus:border-[#1D4ED8] text-[#0F1B2D] dark:text-[#F1F5F9] text-sm"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 flex justify-end">
                    <button
                      type="submit"
                      disabled={!formData.newPassword}
                      className="h-10 px-5 bg-[#1D4ED8] hover:bg-[#1E40AF] text-white font-medium rounded-lg text-xs transition-colors flex items-center gap-1.5 disabled:opacity-40 cursor-pointer"
                    >
                      Update Password
                    </button>
                  </div>
                </form>

                {/* Separate Forgot Password & Recovery Card */}
                <div className="pt-6 border-t border-[#E3E8EE] dark:border-[#1F2A3D]">
                  <div className="p-4 sm:p-5 rounded-lg bg-[#F5F8FA] dark:bg-[#0B1220] border border-[#E3E8EE] dark:border-[#1F2A3D] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <span className="text-xs font-semibold text-[#0F1B2D] dark:text-[#F1F5F9] block">
                        Need to reset your password via email?
                      </span>
                      <p className="text-[11px] text-[#5B6B7F] dark:text-[#94A3B8] leading-relaxed">
                        If you have forgotten your current password, generate a secure reset link to your email.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => navigate("/forgot-password")}
                      className="h-9 px-4 bg-white dark:bg-[#111A2B] hover:bg-[#F5F8FA] dark:hover:bg-[#1F2A3D] border border-[#E3E8EE] dark:border-[#1F2A3D] text-[#0F1B2D] dark:text-[#F1F5F9] rounded-lg text-xs font-medium whitespace-nowrap transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <span>Forgot Password</span>
                      <ArrowRight size={13} />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Danger Zone */}
            <div className="bg-white dark:bg-[#111A2B] p-6 rounded-xl border border-[#E3E8EE] dark:border-[#1F2A3D] shadow-sm flex flex-col justify-between gap-6 h-fit">
              <div>
                <h3 className="text-base font-bold text-[#B91C1C] flex items-center gap-2">
                  <Trash2 size={18} />
                  Danger Zone
                </h3>
                <p className="text-xs text-[#5B6B7F] dark:text-[#94A3B8] mt-1">
                  Once deleted, your account data cannot be recovered.
                </p>
              </div>

              <div className="p-4 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/40 rounded-lg">
                <span className="text-xs text-[#B91C1C] font-semibold block">Deactivate Account</span>
                <span className="text-[11px] text-[#5B6B7F] dark:text-[#94A3B8] block mt-1">
                  Permanently deletes your account and removes all associated room listings and bookings.
                </span>
                <button
                  onClick={handleDeleteAccount}
                  className="mt-4 w-full h-9 bg-[#B91C1C] hover:bg-red-800 text-white rounded-lg text-xs font-semibold transition-colors cursor-pointer"
                >
                  Delete My Account
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === "wallet" && (
          <div className="space-y-6">
            {/* Top Stat Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {/* Card 1: Revenue / Earnings (For Owner) or Wallet Refund Balance (For Renter) */}
              <div className="bg-white dark:bg-[#111A2B] p-5 rounded-xl border border-[#E3E8EE] dark:border-[#1F2A3D] shadow-sm flex flex-col justify-between">
                <div className="flex items-center gap-3">
                  <span className="p-2.5 bg-[#F5F8FA] dark:bg-[#0B1220] text-[#1D4ED8] rounded-lg border border-[#E3E8EE] dark:border-[#1F2A3D] flex items-center justify-center">
                    <IndianRupee size={20} />
                  </span>
                  <div>
                    <h4 className="text-xs font-semibold text-[#5B6B7F] dark:text-[#94A3B8] uppercase tracking-wider">
                      {user.role === "OWNER" ? "Total Revenue" : "Refund Balance"}
                    </h4>
                    <p className="text-[11px] text-[#5B6B7F] dark:text-[#94A3B8]">
                      {user.role === "OWNER" ? "Earnings from tenant bookings" : "Vacate refunds credited"}
                    </p>
                  </div>
                </div>

                <div className="mt-5 flex items-baseline gap-2">
                  <span className="text-2xl sm:text-3xl font-bold tracking-tight text-[#0F1B2D] dark:text-[#F1F5F9]">
                    ₹{(user.role === "OWNER" ? totalEarnings : totalRefunded).toLocaleString("en-IN")}
                  </span>
                  <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-[#DCFCE7] text-[#15803D] dark:bg-emerald-950/40 dark:text-emerald-300">
                    {user.role === "OWNER" ? "+ Earnings" : "+ Refund Credits"}
                  </span>
                </div>
              </div>

              {/* Card 2: Transactions Count / Total Spent */}
              <div className="bg-white dark:bg-[#111A2B] p-5 rounded-xl border border-[#E3E8EE] dark:border-[#1F2A3D] shadow-sm flex flex-col justify-between">
                <div className="flex items-center gap-3">
                  <span className="p-2.5 bg-[#F5F8FA] dark:bg-[#0B1220] text-[#1D4ED8] rounded-lg border border-[#E3E8EE] dark:border-[#1F2A3D] flex items-center justify-center">
                    <Receipt size={20} />
                  </span>
                  <div>
                    <h4 className="text-xs font-semibold text-[#5B6B7F] dark:text-[#94A3B8] uppercase tracking-wider">
                      {user.role === "OWNER" ? "Paid Leases" : "Total Rent Paid"}
                    </h4>
                    <p className="text-[11px] text-[#5B6B7F] dark:text-[#94A3B8]">
                      {user.role === "OWNER" ? "Active contracts" : "Gross rent payments made"}
                    </p>
                  </div>
                </div>

                <div className="mt-5 flex items-baseline gap-2">
                  <span className="text-2xl sm:text-3xl font-bold tracking-tight text-[#0F1B2D] dark:text-[#F1F5F9]">
                    {user.role === "OWNER" ? paymentsList.length : `₹${totalSpent.toLocaleString("en-IN")}`}
                  </span>
                  <span className="text-xs text-[#5B6B7F] dark:text-[#94A3B8]">
                    {user.role === "OWNER" ? "Contracts" : "Spent"}
                  </span>
                </div>
              </div>

              {/* Card 3: RoomCoins Rewards */}
              <div className="bg-white dark:bg-[#111A2B] p-5 rounded-xl border border-[#E3E8EE] dark:border-[#1F2A3D] shadow-sm flex flex-col justify-between">
                <div className="flex items-center gap-3">
                  <span className="p-2.5 bg-[#F5F8FA] dark:bg-[#0B1220] text-[#0F766E] rounded-lg border border-[#E3E8EE] dark:border-[#1F2A3D] flex items-center justify-center">
                    <Coins size={20} />
                  </span>
                  <div>
                    <h4 className="text-xs font-semibold text-[#5B6B7F] dark:text-[#94A3B8] uppercase tracking-wider">
                      Platform Coins
                    </h4>
                    <p className="text-[11px] text-[#5B6B7F] dark:text-[#94A3B8]">Loyalty points balance</p>
                  </div>
                </div>

                <div className="mt-5 flex items-baseline gap-2">
                  <span className="text-2xl sm:text-3xl font-bold tracking-tight text-[#0F1B2D] dark:text-[#F1F5F9]">
                    {coins}
                  </span>
                  <span className="text-xs text-[#5B6B7F] dark:text-[#94A3B8]">Coins</span>
                </div>
              </div>
            </div>

            {/* Discount Voucher for Renters */}
            {user.role === "RENTER" && (
              <div className="bg-white dark:bg-[#111A2B] p-5 rounded-xl border border-[#E3E8EE] dark:border-[#1F2A3D] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-0.5">
                  <h4 className="text-sm font-semibold text-[#0F1B2D] dark:text-[#F1F5F9] flex items-center gap-2">
                    <Coins size={16} className="text-[#0F766E]" />
                    <span>Redeem Discount Voucher</span>
                  </h4>
                  <p className="text-xs text-[#5B6B7F] dark:text-[#94A3B8]">
                    Exchange 10 RoomCoins for a ₹100 instant rental discount on checkout.
                  </p>
                </div>
                <button
                  onClick={applyDiscount}
                  disabled={discountApplied || coins < 10}
                  className={`h-9 px-4 rounded-lg text-xs font-medium transition-colors flex items-center justify-center gap-1.5 shrink-0 cursor-pointer ${
                    discountApplied || coins < 10
                      ? "bg-[#F5F8FA] dark:bg-[#0B1220] text-[#5B6B7F] dark:text-[#94A3B8] border border-[#E3E8EE] dark:border-[#1F2A3D] cursor-not-allowed"
                      : "bg-[#0F766E] hover:bg-[#115E59] text-white"
                  }`}
                >
                  <span>{discountApplied ? "Discount Applied" : "Apply 10 Coins Voucher"}</span>
                </button>
              </div>
            )}

            {/* Transaction History Log Section */}
            <div className="bg-white dark:bg-[#111A2B] p-6 sm:p-8 rounded-xl border border-[#E3E8EE] dark:border-[#1F2A3D] shadow-sm space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#E3E8EE] dark:border-[#1F2A3D]">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-lg bg-[#F5F8FA] dark:bg-[#0B1220] text-[#1D4ED8] border border-[#E3E8EE] dark:border-[#1F2A3D] flex items-center justify-center">
                    <Receipt size={18} />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-[#0F1B2D] dark:text-[#F1F5F9]">
                      {user.role === "OWNER" ? "Payment & Settlement History" : "Payment & Refund History"}
                    </h3>
                    <p className="text-xs text-[#5B6B7F] dark:text-[#94A3B8]">
                      {user.role === "OWNER" 
                        ? "Real-time log of rent deposits and 30% retention vacate settlements"
                        : "Log of rental payments and 70% vacate refund deposits"}
                    </p>
                  </div>
                </div>

                <span className="self-start sm:self-auto px-2.5 py-1 bg-[#F5F8FA] dark:bg-[#0B1220] text-[#5B6B7F] dark:text-[#94A3B8] border border-[#E3E8EE] dark:border-[#1F2A3D] rounded-md text-xs font-medium">
                  {paymentsList.length} Total Records
                </span>
              </div>

              {walletLoading ? (
                <div className="py-12 flex flex-col items-center justify-center gap-3">
                  <div className="w-8 h-8 border-2 border-[#1D4ED8] border-t-transparent rounded-full animate-spin" />
                  <span className="text-xs text-[#5B6B7F] dark:text-[#94A3B8]">Loading transaction logs...</span>
                </div>
              ) : paymentsList.length === 0 ? (
                <div className="py-12 text-center space-y-3">
                  <div className="w-12 h-12 rounded-lg bg-[#F5F8FA] dark:bg-[#0B1220] border border-[#E3E8EE] dark:border-[#1F2A3D] flex items-center justify-center mx-auto text-[#5B6B7F] dark:text-[#94A3B8]">
                    <Wallet size={20} />
                  </div>
                  <h4 className="text-sm font-semibold text-[#0F1B2D] dark:text-[#F1F5F9]">
                    No Transactions Yet
                  </h4>
                  <p className="text-xs text-[#5B6B7F] dark:text-[#94A3B8] max-w-sm mx-auto">
                    {user.role === "OWNER"
                      ? "When renters book and pay for your listed properties, payment deposits and transaction receipts will automatically appear here."
                      : "When you complete rent payments on approved bookings, your payment receipts and refund credits will appear here."}
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {paymentsList.map((payment) => {
                    const bookingId = payment.bookingId?._id || payment.bookingId;
                    const isCopied = copiedTxn === payment.transactionId;
                    const isRefund = payment.type === 'REFUND';
                    const isRetention = payment.type === 'RETENTION_FEE';

                    return (
                      <div
                        key={payment._id}
                        className="p-4 rounded-lg bg-[#F5F8FA] dark:bg-[#0B1220] border border-[#E3E8EE] dark:border-[#1F2A3D] flex flex-col md:flex-row md:items-center justify-between gap-4"
                      >
                        {/* Left: Property & Tenant Details */}
                        <div className="flex items-start gap-3.5">
                          <div className="w-12 h-12 rounded-lg overflow-hidden bg-slate-200 dark:bg-slate-800 shrink-0 border border-[#E3E8EE] dark:border-[#1F2A3D]">
                            <img
                              src={payment.roomId?.imageUrl || "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=600&q=80"}
                              alt={payment.roomId?.title}
                              className="w-full h-full object-cover"
                            />
                          </div>

                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <h4 className="text-sm font-semibold text-[#0F1B2D] dark:text-[#F1F5F9] leading-tight">
                                {payment.roomId?.title || "Rental Property"}
                              </h4>
                              <span className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase ${
                                isRefund 
                                  ? 'bg-purple-50 text-purple-700 dark:bg-purple-950/40 dark:text-purple-300 border border-purple-200 dark:border-purple-900/60'
                                  : isRetention
                                    ? 'bg-blue-50 text-[#1D4ED8] dark:bg-blue-950/40 dark:text-blue-300 border border-blue-200 dark:border-blue-900/60'
                                    : 'bg-[#DCFCE7] text-[#15803D] dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-900/60'
                              }`}>
                                {isRefund ? "70% LEASE REFUND" : isRetention ? "30% VACATE RETENTION" : payment.paymentMethod || "ONLINE"}
                              </span>
                            </div>

                            <p className="text-xs text-[#5B6B7F] dark:text-[#94A3B8] flex items-center gap-1">
                              <Building size={12} />
                              <span>{payment.roomId?.location || "Location"} • {payment.roomId?.bhkType || "Unit"}</span>
                            </p>

                            {/* Description if present */}
                            {payment.description && (
                              <p className="text-xs text-[#5B6B7F] dark:text-[#94A3B8] italic">
                                {payment.description}
                              </p>
                            )}

                            {/* Tenant Info (Visible to Owner) */}
                            {user.role === "OWNER" && payment.userId && (
                              <p className="text-xs text-[#5B6B7F] dark:text-[#94A3B8] font-medium pt-0.5">
                                Tenant: <strong className="text-[#0F1B2D] dark:text-[#F1F5F9]">{payment.userId.name}</strong> ({payment.userId.email})
                              </p>
                            )}

                            {/* Timestamp & TXN */}
                            <div className="flex flex-wrap items-center gap-3 text-[11px] text-[#5B6B7F] dark:text-[#94A3B8] pt-1">
                              <span className="flex items-center gap-1">
                                <Clock size={12} />
                                {new Date(payment.createdAt).toLocaleString("en-IN", {
                                  dateStyle: "medium",
                                  timeStyle: "short"
                                })}
                              </span>
                              <span>•</span>
                              <div className="flex items-center gap-1 font-mono text-[11px]">
                                <span>TXN: {payment.transactionId}</span>
                                <button
                                  onClick={() => {
                                    navigator.clipboard.writeText(payment.transactionId);
                                    setCopiedTxn(payment.transactionId);
                                    toast.success("Transaction ID copied!");
                                    setTimeout(() => setCopiedTxn(null), 2000);
                                  }}
                                  className="p-1 hover:bg-[#E3E8EE] dark:hover:bg-[#1F2A3D] rounded transition-colors cursor-pointer"
                                  title="Copy TXN ID"
                                >
                                  {isCopied ? <Check size={11} className="text-[#15803D]" /> : <Copy size={11} />}
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Right: Amount & Receipt Button */}
                        <div className="flex md:flex-col items-center md:items-end justify-between md:justify-center gap-2 pt-3 md:pt-0 border-t md:border-t-0 border-[#E3E8EE] dark:border-[#1F2A3D] shrink-0">
                          <div className="text-right">
                            <span className={`text-base font-bold flex items-center gap-0.5 ${
                              isRefund ? 'text-purple-600 dark:text-purple-400' : 'text-[#0F1B2D] dark:text-[#F1F5F9]'
                            }`}>
                              {user.role === "OWNER" || isRefund ? "+" : ""}₹{payment.amount?.toLocaleString("en-IN")}
                            </span>
                            <span className={`text-[10px] font-semibold uppercase block ${
                              isRefund ? 'text-purple-600 dark:text-purple-400' : 'text-[#5B6B7F] dark:text-[#94A3B8]'
                            }`}>
                              {isRefund ? "Refund Credited" : isRetention ? "Retained Fee" : "Completed"}
                            </span>
                          </div>

                          {bookingId && (
                            <button
                              onClick={() => setSelectedReceiptBookingId(bookingId)}
                              className="h-8 px-3 bg-[#1D4ED8] hover:bg-[#1E40AF] text-white rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5 cursor-pointer"
                            >
                              <Receipt size={12} />
                              <span>View Receipt</span>
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === "rooms" && user.role === "OWNER" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center px-1">
              <div>
                <h3 className="text-base font-bold text-[#0F1B2D] dark:text-[#F1F5F9]">Active Listed Rooms</h3>
                <p className="text-xs text-[#5B6B7F] dark:text-[#94A3B8]">Edit, activate, or remove your properties.</p>
              </div>
              
              <button
                onClick={() => navigate("/add-room")}
                className="h-9 px-4 bg-[#1D4ED8] hover:bg-[#1E40AF] text-white rounded-lg text-xs font-medium transition-colors cursor-pointer"
              >
                Add New Room
              </button>
            </div>

            {roomsLoading ? (
              <div className="py-12 text-center">
                <div className="w-8 h-8 border-2 border-[#1D4ED8] border-t-transparent rounded-full animate-spin mx-auto" />
              </div>
            ) : ownerRooms && ownerRooms.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
              <div className="text-center py-16 bg-white dark:bg-[#111A2B] rounded-xl border border-[#E3E8EE] dark:border-[#1F2A3D] p-8 shadow-sm">
                <p className="text-[#5B6B7F] dark:text-[#94A3B8] text-sm font-medium">No listed properties found.</p>
                <button
                  onClick={() => navigate("/add-room")}
                  className="mt-4 h-9 px-4 bg-[#1D4ED8] hover:bg-[#1E40AF] text-white rounded-lg text-xs font-medium transition-colors cursor-pointer"
                >
                  Create Your First Listing
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Avatar Selection Modal */}
      {showAvatarModal && (
        <div
          className="fixed inset-0 bg-black/60 flex items-center justify-center z-[120] p-4 overflow-y-auto"
          onClick={() => setShowAvatarModal(false)}
        >
          <div
            className="bg-white dark:bg-[#111A2B] border border-[#E3E8EE] dark:border-[#1F2A3D] rounded-xl shadow-lg w-full max-w-lg max-h-[90vh] flex flex-col overflow-hidden"
            onClick={e => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-[#E3E8EE] dark:border-[#1F2A3D]">
              <div className="flex items-center gap-2.5">
                <span className="p-2 bg-[#F5F8FA] dark:bg-[#0B1220] border border-[#E3E8EE] dark:border-[#1F2A3D] rounded-lg">
                  <Smile size={18} className="text-[#1D4ED8]" />
                </span>
                <div>
                  <h3 className="text-base font-bold text-[#0F1B2D] dark:text-[#F1F5F9]">Choose Your Avatar</h3>
                  <p className="text-xs text-[#5B6B7F] dark:text-[#94A3B8] mt-0.5">Click an avatar to preview, then confirm</p>
                </div>
              </div>
              <button
                onClick={() => setShowAvatarModal(false)}
                className="p-1.5 hover:bg-[#F5F8FA] dark:hover:bg-[#1F2A3D] rounded-lg text-[#5B6B7F] dark:text-[#94A3B8] transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Live Preview + Category Tabs */}
            <div className="px-6 py-4 flex items-center gap-4">
              <img
                src={previewAvatar || selectedAvatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'User')}&background=1d4ed8&color=fff`}
                alt="Preview"
                className="w-14 h-14 rounded-lg border border-[#E3E8EE] dark:border-[#1F2A3D] object-cover flex-shrink-0 bg-slate-100"
              />
              <div className="flex-1">
                <p className="text-xs font-semibold text-[#5B6B7F] dark:text-[#94A3B8] mb-1.5 uppercase tracking-wider">Category</p>
                <div className="flex gap-1.5 flex-wrap">
                  {[{key:"people",label:"People"},{key:"fun",label:"Fun"},{key:"shapes",label:"Abstract"}].map(tab => (
                    <button
                      key={tab.key}
                      onClick={() => setAvatarTab(tab.key)}
                      className={`px-3 py-1 rounded-md text-xs font-medium transition-colors cursor-pointer ${
                        avatarTab === tab.key
                          ? "bg-[#1D4ED8] text-white"
                          : "bg-[#F5F8FA] dark:bg-[#0B1220] text-[#5B6B7F] dark:text-[#94A3B8] border border-[#E3E8EE] dark:border-[#1F2A3D] hover:bg-slate-200 dark:hover:bg-[#1F2A3D]"
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
              <div className="grid grid-cols-4 gap-3">
                {avatarCategories[avatarTab].map((avatar, index) => (
                  <div
                    key={avatar}
                    className={`cursor-pointer rounded-lg overflow-hidden border-2 aspect-square relative ${
                      (previewAvatar || selectedAvatar) === avatar
                        ? "border-[#1D4ED8]"
                        : "border-[#E3E8EE] dark:border-[#1F2A3D] hover:border-[#1D4ED8]/60"
                    }`}
                    onClick={() => setPreviewAvatar(avatar)}
                    onDoubleClick={() => selectAvatar(avatar)}
                  >
                    <img
                      src={avatar}
                      alt={`Avatar ${index + 1}`}
                      className="w-full h-full object-cover bg-slate-50"
                    />
                    {(previewAvatar || selectedAvatar) === avatar && (
                      <div className="absolute top-1 right-1 bg-[#1D4ED8] rounded-full p-0.5">
                        <Check size={10} className="text-white" strokeWidth={3} />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Confirm Footer */}
            <div className="px-6 py-4 border-t border-[#E3E8EE] dark:border-[#1F2A3D] flex gap-3">
              <button
                onClick={() => { setPreviewAvatar(null); setShowAvatarModal(false); }}
                className="flex-1 h-9 rounded-lg text-xs font-medium border border-[#E3E8EE] dark:border-[#1F2A3D] text-[#5B6B7F] dark:text-[#94A3B8] hover:bg-[#F5F8FA] dark:hover:bg-[#1F2A3D] transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                disabled={!previewAvatar && !selectedAvatar}
                onClick={() => {
                  if (previewAvatar) selectAvatar(previewAvatar);
                  else setShowAvatarModal(false);
                }}
                className="flex-1 h-9 rounded-lg text-xs font-medium bg-[#1D4ED8] hover:bg-[#1E40AF] text-white transition-colors flex items-center justify-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                <Check size={14} />
                <span>Use this Avatar</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Payment Receipt Modal */}
      {selectedReceiptBookingId && (
        <PaymentReceiptModal
          isOpen={Boolean(selectedReceiptBookingId)}
          onClose={() => setSelectedReceiptBookingId(null)}
          bookingId={selectedReceiptBookingId}
        />
      )}
    </div>
  );
};

export default Profile;
