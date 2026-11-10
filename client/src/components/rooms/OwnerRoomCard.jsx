import React, { useState } from "react";
import { MapPin, Edit3, Trash2, X, CheckCircle2 } from "lucide-react";
import Badge from "../ui/Badge";

const OwnerRoomCard = ({ room, onEdit, onDelete }) => {
  const [open, setOpen] = useState(false);

  const handleDelete = (e) => {
    e.stopPropagation();
    if (onDelete) {
      onDelete(room._id);
    }
  };

  const rentPrice = Number(room.rent || room.price || 0);

  return (
    <>
      <div
        onClick={() => setOpen(true)}
        className="bg-white dark:bg-[#111A2B] border border-[#E3E8EE] dark:border-[#1F2A3D] rounded-xl overflow-hidden shadow-[0_1px_2px_rgba(0,0,0,0.04)] hover:-translate-y-0.5 hover:shadow-[0_4px_6px_-1px_rgba(0,0,0,0.06)] transition-all duration-150 flex flex-col h-full cursor-pointer text-left group"
      >
        {/* Image Area 4:3 */}
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
                <span>Available</span>
              </Badge>
            )}
          </div>
        </div>

        {/* Content Details */}
        <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
          <div className="space-y-1.5">
            <span className="text-[11px] font-semibold text-[#5B6B7F] dark:text-[#94A3B8] uppercase tracking-wider block">
              {room.bhkType || room.type || "Studio"} • Listed Property
            </span>

            <h3 className="text-base font-bold text-[#0F1B2D] dark:text-[#F1F5F9] truncate group-hover:text-[#1D4ED8] dark:group-hover:text-[#3B82F6] transition-colors">
              {room.title}
            </h3>

            <div className="flex items-center gap-1.5 text-xs text-[#5B6B7F] dark:text-[#94A3B8]">
              <MapPin size={13} strokeWidth={1.75} className="shrink-0" />
              <span className="truncate">{room.location}</span>
            </div>
          </div>

          <div className="pt-3 border-t border-[#E3E8EE] dark:border-[#1F2A3D] space-y-3">
            <div>
              <span className="text-[10px] uppercase font-semibold text-[#5B6B7F] dark:text-[#94A3B8] block leading-none">
                Rent
              </span>
              <span className="text-base font-bold text-[#0F1B2D] dark:text-[#F1F5F9] block mt-0.5">
                ₹{rentPrice.toLocaleString("en-IN")}
                <span className="text-xs font-normal text-[#5B6B7F] dark:text-[#94A3B8]">/mo</span>
              </span>
            </div>

            {/* Owner Actions */}
            <div className="flex items-center gap-2 pt-2 border-t border-[#E3E8EE] dark:border-[#1F2A3D]">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit && onEdit(room._id);
                }}
                className="flex-1 h-9 px-3 rounded-lg border border-[#E3E8EE] dark:border-[#1F2A3D] bg-[#F5F8FA] hover:bg-white dark:bg-[#0B1220] dark:hover:bg-[#162035] text-[#0F1B2D] dark:text-[#F1F5F9] text-xs font-medium transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Edit3 size={13} strokeWidth={1.75} />
                <span>Edit</span>
              </button>
              
              <button
                type="button"
                onClick={handleDelete}
                className="h-9 px-3 rounded-lg border border-red-200 dark:border-red-900/40 text-[#B91C1C] hover:bg-red-50 dark:hover:bg-red-950/20 text-xs font-medium transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Trash2 size={13} strokeWidth={1.75} />
                <span>Delete</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Preview Modal */}
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
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="h-10 px-4 text-xs font-medium border border-[#E3E8EE] dark:border-[#1F2A3D] rounded-lg text-[#0F1B2D] dark:text-[#F1F5F9] hover:bg-[#F5F8FA] transition-colors cursor-pointer"
                >
                  Close
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setOpen(false);
                    onEdit && onEdit(room._id);
                  }}
                  className="h-10 px-5 bg-[#1D4ED8] hover:bg-[#1E40AF] dark:bg-[#3B82F6] dark:hover:bg-[#2563EB] text-white text-xs font-medium rounded-lg transition-colors cursor-pointer"
                >
                  Edit Property
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default OwnerRoomCard;
