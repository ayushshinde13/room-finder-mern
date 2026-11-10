import { useEffect, useState } from "react";
import useAuth from "../hooks/useAuth";
import { Calendar, MapPin, User, Mail, ShieldAlert, Receipt } from "lucide-react";
import toast from "react-hot-toast";
import API from "../services/api";
import PaymentReceiptModal from "../components/payment/PaymentReceiptModal";

const MyRoomBookings = () => {
  const { user, token } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [receiptBookingId, setReceiptBookingId] = useState(null);

  useEffect(() => {
    if (!token) return;

    const fetchBookings = async () => {
      try {
        const { data } = await API.get('/bookings/owner');
        setBookings(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Error fetching booking requests:', error);
        toast.error('Error loading bookings');
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [token]);

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#1D4ED8] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user || user.role !== 'OWNER') {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center text-[#B91C1C] font-semibold flex items-center gap-2">
          <ShieldAlert size={20} />
          <span>Access denied. Landlords only.</span>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#0F1B2D] dark:text-[#F1F5F9]">
          Tenant Rental History
        </h1>
        <p className="text-[#5B6B7F] dark:text-[#94A3B8] text-sm mt-1">
          Complete log of tenants who successfully leased or requested your rooms.
        </p>
      </div>

      {bookings.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-[#111A2B] rounded-xl border border-[#E3E8EE] dark:border-[#1F2A3D] p-8 shadow-sm">
          <User className="w-12 h-12 text-[#5B6B7F]/40 dark:text-[#94A3B8]/40 mx-auto mb-4" />
          <h3 className="text-base font-semibold text-[#0F1B2D] dark:text-[#F1F5F9]">
            No Rental Records
          </h3>
          <p className="text-[#5B6B7F] dark:text-[#94A3B8] text-sm mt-1 max-w-sm mx-auto">
            You don't have any bookings or tenant records for your properties yet.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {bookings.map((booking) => (
            <div
              key={booking._id}
              className="bg-white dark:bg-[#111A2B] p-5 sm:p-6 rounded-xl border border-[#E3E8EE] dark:border-[#1F2A3D] shadow-sm flex flex-col md:flex-row gap-5"
            >
              {/* Left Room Image */}
              <div className="md:w-56 shrink-0 aspect-[4/3] rounded-lg overflow-hidden border border-[#E3E8EE] dark:border-[#1F2A3D] bg-[#F5F8FA] dark:bg-[#0B1220]">
                <img
                  src={booking.room?.imageUrl || "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=600&q=80"}
                  alt={booking.room?.title}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Right Booking details */}
              <div className="flex-1 flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h3 className="text-base font-semibold text-[#0F1B2D] dark:text-[#F1F5F9] leading-tight">
                      {booking.room?.title}
                    </h3>
                    
                    <span className={`px-2.5 py-0.5 rounded text-[11px] font-semibold tracking-wide uppercase ${
                      booking.status === 'PENDING' 
                        ? 'bg-amber-50 text-amber-800 dark:bg-amber-950/40 dark:text-amber-300 border border-amber-200 dark:border-amber-900/60' 
                        : booking.status === 'APPROVED'
                          ? 'bg-blue-50 text-[#1D4ED8] dark:bg-blue-950/40 dark:text-blue-300 border border-blue-200 dark:border-blue-900/60'
                          : booking.status === 'BOOKED'
                            ? 'bg-[#DCFCE7] text-[#15803D] dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-900/60'
                            : 'bg-red-50 text-[#B91C1C] dark:bg-red-950/40 dark:text-red-300 border border-red-200 dark:border-red-900/60'
                    }`}>
                      {booking.status === 'APPROVED' ? 'APPROVED (UNPAID)' : booking.status === 'BOOKED' ? 'PAID & OCCUPIED' : booking.status}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 text-xs text-[#5B6B7F] dark:text-[#94A3B8]">
                    <MapPin size={14} className="text-[#5B6B7F] dark:text-[#94A3B8] shrink-0" />
                    <span>{booking.room?.location} • {booking.room?.bhkType}</span>
                  </div>

                  <div className="text-base font-bold text-[#0F1B2D] dark:text-[#F1F5F9] pt-1">
                    ₹{booking.room?.rent?.toLocaleString("en-IN")}
                    <span className="text-xs font-normal text-[#5B6B7F] dark:text-[#94A3B8] ml-1">/ month</span>
                  </div>
                  
                  {/* Renter detail log box */}
                  <div className="mt-3 p-3.5 bg-[#F5F8FA] dark:bg-[#0B1220] rounded-lg border border-[#E3E8EE] dark:border-[#1F2A3D] space-y-1.5">
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-[#5B6B7F] dark:text-[#94A3B8] block mb-1">Tenant Details</span>
                    <div className="flex items-center gap-2 text-xs text-[#0F1B2D] dark:text-[#F1F5F9]">
                      <User size={13} className="text-[#5B6B7F] dark:text-[#94A3B8]" />
                      <span className="font-medium">{booking.renter?.name}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-[#5B6B7F] dark:text-[#94A3B8]">
                      <Mail size={13} className="text-[#5B6B7F] dark:text-[#94A3B8]" />
                      <span>{booking.renter?.email}</span>
                    </div>
                  </div>
                </div>

                {/* Bottom Timeline details */}
                <div className="mt-4 pt-3 border-t border-[#E3E8EE] dark:border-[#1F2A3D] flex items-center justify-between gap-4 text-[#5B6B7F] dark:text-[#94A3B8] text-xs">
                  <div className="flex items-center gap-1.5">
                    <Calendar size={14} />
                    <span>Requested on {new Date(booking.createdAt).toLocaleDateString()}</span>
                  </div>

                  {booking.status === 'BOOKED' && (
                    <button
                      onClick={() => setReceiptBookingId(booking._id)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#1D4ED8] hover:bg-[#1E40AF] text-white rounded-lg font-medium text-xs transition-colors cursor-pointer"
                    >
                      <Receipt size={13} />
                      <span>View Receipt</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Payment Receipt Modal */}
      {receiptBookingId && (
        <PaymentReceiptModal
          isOpen={Boolean(receiptBookingId)}
          onClose={() => setReceiptBookingId(null)}
          bookingId={receiptBookingId}
        />
      )}
    </div>
  );
};

export default MyRoomBookings;