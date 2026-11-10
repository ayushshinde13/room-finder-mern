import React, { useState } from "react";
import { MapPin, X, Bed, CheckCircle2, MessageSquare } from "lucide-react";
import { useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import API from "../../services/api";
import toast from "react-hot-toast";
import Badge from "../ui/Badge";

const RoomCard = ({ room }) => {
  const [open, setOpen] = useState(false);
  const [requestLoading, setRequestLoading] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleRequestBooking = async (e) => {
    e.stopPropagation();
    
    if (!user) {
      toast.error("Please sign in to enquire and request this room");
      navigate("/login");
      return;
    }

    if (user.role === "OWNER") {
      toast.error("Landlords cannot book rooms");
      return;
    }

    if (room.isBooked) {
      toast.error("This room is already occupied");
      return;
    }

    try {
      setRequestLoading(true);
      await API.post("/bookings", { roomId: room._id });
      toast.success(
        `Request submitted to ${room.owner?.name || "the owner"}. Track status in My Bookings.`
      );
      navigate("/my-bookings");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to submit booking request");
    } finally {
      setRequestLoading(false);
    }
  };

  const ownerName = room.owner?.name || "Verified Landlord";
  const rentPrice = Number(room.rent || room.price || 0);

  return (
    <>
      <div
        onClick={() => setOpen(true)}
        className="bg-white dark:bg-[#111A2B] border border-[#E3E8EE] dark:border-[#1F2A3D] rounded-xl overflow-hidden shadow-[0_1px_2px_rgba(0,0,0,0.04)] hover:-translate-y-0.5 hover:shadow-[0_4px_6px_-1px_rgba(0,0,0,0.06)] transition-all duration-150 flex flex-col h-full cursor-pointer text-left group"
      >
        {/* Real photo on top (4:3 aspect ratio) */}
        <div className="relative aspect-[4/3] w-full bg-[#F5F8FA] dark:bg-[#0B1220] overflow-hidden">
          <img
            src={
              room.imageUrl ||
              room.image ||
              "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=600&q=80"
            }
            alt={room.title}
            className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-200"
          />

          <div className="absolute top-3 right-3">
            {room.isBooked ? (
              <Badge variant="danger" size="sm">
                Occupied
              </Badge>
            ) : (
              <Badge variant="verified" size="sm">
                <CheckCircle2 size={11} strokeWidth={2} />
                <span>Verified</span>
              </Badge>
            )}
          </div>
        </div>

        {/* Content Details */}
        <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
          <div className="space-y-1.5">
            <span className="text-[11px] font-semibold text-[#5B6B7F] dark:text-[#94A3B8] uppercase tracking-wider block">
              {room.bhkType || room.type || "Studio"} • Verified Property
            </span>

            <h3 className="text-base font-bold text-[#0F1B2D] dark:text-[#F1F5F9] truncate group-hover:text-[#1D4ED8] dark:group-hover:text-[#3B82F6] transition-colors">
              {room.title}
            </h3>

            <div className="flex items-center gap-1.5 text-xs text-[#5B6B7F] dark:text-[#94A3B8]">
              <MapPin size={13} strokeWidth={1.75} className="shrink-0" />
              <span className="truncate">{room.location}</span>
            </div>

            {room.owner && (
              <p className="text-xs text-[#5B6B7F] dark:text-[#94A3B8] pt-1">
                Landlord: <strong className="text-[#0F1B2D] dark:text-[#F1F5F9]">{ownerName}</strong>
              </p>
            )}
          </div>

          {/* Pricing & CTA */}
          <div className="pt-3 border-t border-[#E3E8EE] dark:border-[#1F2A3D] flex items-center justify-between gap-3">
            <div>
              <span className="text-[10px] uppercase font-semibold text-[#5B6B7F] dark:text-[#94A3B8] block leading-none">
                Rent
              </span>
              <span className="text-base font-bold text-[#0F1B2D] dark:text-[#F1F5F9] block mt-0.5">
                ₹{rentPrice.toLocaleString("en-IN")}
                <span className="text-xs font-normal text-[#5B6B7F] dark:text-[#94A3B8]">/mo</span>
              </span>
            </div>

            {!room.isBooked && user && user.role === "RENTER" && (
              <button
                type="button"
                onClick={handleRequestBooking}
                disabled={requestLoading}
                className="h-9 px-3.5 bg-[#1D4ED8] hover:bg-[#1E40AF] dark:bg-[#3B82F6] dark:hover:bg-[#2563EB] text-white text-xs font-medium rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                {requestLoading ? (
                  <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <MessageSquare size={13} strokeWidth={1.75} />
                    <span>Enquire & Book</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Clean Fullscreen Modal Preview */}
      {open && (
        <div
          className="fixed inset-0 z-[120] bg-black/60 flex items-center justify-center p-4 overflow-y-auto"
          onClick={() => setOpen(false)}
        >
          <div
            className="relative w-full max-w-2xl bg-white dark:bg-[#111A2B] border border-[#E3E8EE] dark:border-[#1F2A3D] rounded-xl overflow-hidden shadow-xl text-left my-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-[#E3E8EE] dark:border-[#1F2A3D]">
              <span className="text-xs font-semibold text-[#5B6B7F] dark:text-[#94A3B8] uppercase tracking-wider">
                Property Overview
              </span>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="p-1 rounded-lg text-[#5B6B7F] hover:text-[#0F1B2D] dark:text-[#94A3B8] dark:hover:text-[#F1F5F9] transition-colors"
                aria-label="Close"
              >
                <X size={18} strokeWidth={1.75} />
              </button>
            </div>

            <div className="p-5 space-y-4 max-h-[80vh] overflow-y-auto">
              <div className="aspect-[16/10] w-full rounded-lg overflow-hidden bg-[#F5F8FA] dark:bg-[#0B1220] border border-[#E3E8EE] dark:border-[#1F2A3D]">
                <img
                  src={
                    room.imageUrl ||
                    room.image ||
                    "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80"
                  }
                  alt={room.title}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between gap-3 flex-wrap">
                  <h2 className="text-xl font-bold text-[#0F1B2D] dark:text-[#F1F5F9]">
                    {room.title}
                  </h2>
                  <span className="text-lg font-bold text-[#1D4ED8] dark:text-[#3B82F6]">
                    ₹{rentPrice.toLocaleString("en-IN")}/month
                  </span>
                </div>

                <p className="text-xs text-[#5B6B7F] dark:text-[#94A3B8] flex items-center gap-1.5">
                  <MapPin size={14} strokeWidth={1.75} />
                  <span>{room.location}</span>
                </p>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-3.5 rounded-lg bg-[#F5F8FA] dark:bg-[#0B1220] border border-[#E3E8EE] dark:border-[#1F2A3D] text-xs">
                  <div>
                    <span className="text-[#5B6B7F] dark:text-[#94A3B8] block text-[10px] uppercase font-semibold">Unit Type</span>
                    <strong className="text-[#0F1B2D] dark:text-[#F1F5F9]">{room.bhkType || room.type || "1 BHK"}</strong>
                  </div>
                  <div>
                    <span className="text-[#5B6B7F] dark:text-[#94A3B8] block text-[10px] uppercase font-semibold">Brokerage</span>
                    <strong className="text-[#15803D] dark:text-[#34D399]">₹0 (Free)</strong>
                  </div>
                  <div>
                    <span className="text-[#5B6B7F] dark:text-[#94A3B8] block text-[10px] uppercase font-semibold">Landlord</span>
                    <strong className="text-[#0F1B2D] dark:text-[#F1F5F9]">{ownerName}</strong>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="h-10 px-4 text-xs font-medium border border-[#E3E8EE] dark:border-[#1F2A3D] rounded-lg text-[#0F1B2D] dark:text-[#F1F5F9] hover:bg-[#F5F8FA] dark:hover:bg-[#111A2B] transition-colors"
                >
                  Close
                </button>
                {!room.isBooked && user && user.role === "RENTER" && (
                  <button
                    type="button"
                    onClick={handleRequestBooking}
                    disabled={requestLoading}
                    className="h-10 px-5 bg-[#1D4ED8] hover:bg-[#1E40AF] dark:bg-[#3B82F6] dark:hover:bg-[#2563EB] text-white text-xs font-medium rounded-lg transition-colors flex items-center gap-1.5"
                  >
                    <span>Send Booking Enquiry</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default RoomCard;
