import React, { useState, useEffect } from "react";
import { 
  X, 
  CheckCircle2, 
  Receipt, 
  Copy, 
  Check, 
  Calendar, 
  MapPin, 
  IndianRupee, 
  ShieldCheck, 
  Printer, 
  Building2, 
  User, 
  Mail, 
  Download,
  Share2,
  QrCode
} from "lucide-react";
import API from "../../services/api";
import toast from "react-hot-toast";

const PaymentReceiptModal = ({ isOpen, onClose, bookingId }) => {
  const [receipt, setReceipt] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!isOpen || !bookingId) return;

    const fetchReceipt = async () => {
      try {
        setLoading(true);
        const { data } = await API.get(`/payments/receipt/${bookingId}`);
        setReceipt(data);
      } catch (err) {
        console.error("Error fetching receipt:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchReceipt();
  }, [isOpen, bookingId]);

  if (!isOpen) return null;

  const copyTxn = () => {
    if (!receipt?.transactionId) return;
    navigator.clipboard.writeText(receipt.transactionId);
    setCopied(true);
    toast.success("Transaction ID copied to clipboard");
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: "RoomFinder Payment Receipt",
        text: `Payment Receipt for ${receipt?.roomId?.title || "Rental Room"} - Amount: ₹${receipt?.amount || 0} - TXN: ${receipt?.transactionId || ""}`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      copyTxn();
    }
  };

  const formattedDate = receipt?.createdAt 
    ? new Date(receipt.createdAt).toLocaleString("en-IN", { 
        dateStyle: "medium", 
        timeStyle: "short" 
      }) 
    : "Verified Recent Transaction";

  const rentAmount = Number(receipt?.amount || 0);

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 overflow-y-auto">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/60 print:hidden"
      />

      {/* Modal Window Container */}
      <div className="relative w-full max-w-lg bg-white dark:bg-[#111A2B] border border-[#E3E8EE] dark:border-[#1F2A3D] rounded-xl shadow-xl overflow-hidden z-10 my-auto print:border-none print:shadow-none print:max-w-none print:w-full print:bg-white print:text-black">
        {/* Modal Header */}
        <div className="px-5 sm:px-6 py-4 border-b border-[#E3E8EE] dark:border-[#1F2A3D] flex items-center justify-between bg-[#F5F8FA] dark:bg-[#0B1220] print:bg-white print:border-b print:border-black">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-white dark:bg-[#111A2B] border border-[#E3E8EE] dark:border-[#1F2A3D] text-[#1D4ED8] flex items-center justify-center font-bold">
              <Receipt size={17} />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-sm sm:text-base text-[#0F1B2D] dark:text-[#F1F5F9] print:text-black">
                  RoomFinder
                </span>
                <span className="text-[10px] uppercase font-semibold tracking-wider px-1.5 py-0.5 rounded bg-[#DCFCE7] text-[#15803D] border border-emerald-200 print:border-black print:text-black">
                  Verified Invoice
                </span>
              </div>
              <p className="text-[11px] text-[#5B6B7F] dark:text-[#94A3B8] print:text-slate-600">
                Official Tenancy Booking Confirmation
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1 print:hidden">
            <button
              onClick={handlePrint}
              className="p-1.5 rounded-lg text-[#5B6B7F] dark:text-[#94A3B8] hover:text-[#0F1B2D] dark:hover:text-[#F1F5F9] hover:bg-[#E3E8EE] dark:hover:bg-[#1F2A3D] transition-colors cursor-pointer"
              title="Print Receipt"
            >
              <Printer size={16} />
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-[#5B6B7F] dark:text-[#94A3B8] hover:text-[#0F1B2D] dark:hover:text-[#F1F5F9] hover:bg-[#E3E8EE] dark:hover:bg-[#1F2A3D] transition-colors cursor-pointer"
              title="Close"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        <div className="p-5 sm:p-6 space-y-5 max-h-[82vh] overflow-y-auto">
          {loading ? (
            <div className="py-16 flex flex-col items-center justify-center gap-3">
              <div className="w-8 h-8 border-2 border-[#1D4ED8] border-t-transparent rounded-full animate-spin" />
              <span className="text-xs text-[#5B6B7F] dark:text-[#94A3B8]">Loading invoice details...</span>
            </div>
          ) : receipt ? (
            <>
              {/* Status & Amount Highlight */}
              <div className="text-center space-y-2 p-4 rounded-lg bg-[#F5F8FA] dark:bg-[#0B1220] border border-[#E3E8EE] dark:border-[#1F2A3D] print:border print:border-slate-300">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-[#DCFCE7] text-[#15803D] text-xs font-semibold print:border-black print:text-black">
                  <CheckCircle2 size={13} />
                  <span>Payment Verified & Confirmed</span>
                </div>

                <div className="text-3xl font-bold text-[#0F1B2D] dark:text-[#F1F5F9] print:text-black">
                  ₹{rentAmount.toLocaleString("en-IN")}
                </div>

                <p className="text-xs text-[#5B6B7F] dark:text-[#94A3B8] flex items-center justify-center gap-1.5">
                  <Calendar size={13} />
                  <span>Paid on {formattedDate}</span>
                </p>
              </div>

              {/* Receipt Content Card */}
              <div className="rounded-lg bg-white dark:bg-[#111A2B] border border-[#E3E8EE] dark:border-[#1F2A3D] p-4 sm:p-5 space-y-3 print:bg-white print:border print:border-slate-300">
                {/* Transaction ID */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 pb-3 border-b border-[#E3E8EE] dark:border-[#1F2A3D]">
                  <span className="text-[11px] font-semibold text-[#5B6B7F] dark:text-[#94A3B8] uppercase tracking-wider">
                    Transaction ID
                  </span>
                  <div className="flex items-center gap-1.5 font-mono text-xs text-[#0F1B2D] dark:text-[#F1F5F9] print:text-black break-all">
                    <span>{receipt.transactionId}</span>
                    <button
                      onClick={copyTxn}
                      className="p-1 hover:bg-[#F5F8FA] dark:hover:bg-[#1F2A3D] rounded transition-colors print:hidden cursor-pointer"
                      title="Copy TXN"
                    >
                      {copied ? <Check size={12} className="text-[#15803D]" /> : <Copy size={12} />}
                    </button>
                  </div>
                </div>

                {/* Property Title */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                  <span className="text-xs text-[#5B6B7F] dark:text-[#94A3B8]">Property</span>
                  <span className="font-semibold text-xs text-[#0F1B2D] dark:text-[#F1F5F9] sm:text-right print:text-black">
                    {receipt.roomId?.title || "Rental Accommodation"}
                  </span>
                </div>

                {/* Location */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                  <span className="text-xs text-[#5B6B7F] dark:text-[#94A3B8]">Location</span>
                  <span className="font-medium text-xs text-[#0F1B2D] dark:text-[#F1F5F9] sm:text-right flex items-center gap-1 sm:justify-end print:text-black">
                    <MapPin size={12} className="text-[#5B6B7F] dark:text-[#94A3B8] shrink-0" />
                    <span>{receipt.roomId?.location || "Location"}</span>
                  </span>
                </div>

                {/* Owner / Landlord */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                  <span className="text-xs text-[#5B6B7F] dark:text-[#94A3B8]">Landlord / Payee</span>
                  <span className="font-medium text-xs text-[#0F1B2D] dark:text-[#F1F5F9] sm:text-right print:text-black break-all">
                    {receipt.ownerId?.name || receipt.roomId?.owner?.name || "Landlord"}
                  </span>
                </div>

                {/* Tenant / Renter */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                  <span className="text-xs text-[#5B6B7F] dark:text-[#94A3B8]">Tenant / Paid By</span>
                  <span className="font-medium text-xs text-[#0F1B2D] dark:text-[#F1F5F9] sm:text-right print:text-black break-all">
                    {receipt.userId?.name || "Tenant"}
                  </span>
                </div>

                {/* Payment Channel */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 pt-2 border-t border-[#E3E8EE] dark:border-[#1F2A3D]">
                  <span className="text-xs text-[#5B6B7F] dark:text-[#94A3B8]">Payment Channel</span>
                  <span className="font-semibold text-xs text-[#1D4ED8] uppercase print:text-black">
                    {receipt.paymentMethod || "ONLINE"}
                  </span>
                </div>
              </div>

              {/* Digital Verification Seal & Security Note */}
              <div className="flex items-center justify-between p-3 rounded-lg bg-[#F5F8FA] dark:bg-[#0B1220] border border-[#E3E8EE] dark:border-[#1F2A3D] text-[11px] text-[#5B6B7F] dark:text-[#94A3B8]">
                <div className="flex items-center gap-2">
                  <ShieldCheck size={16} className="text-[#15803D] shrink-0" />
                  <div>
                    <span className="font-semibold text-[#0F1B2D] dark:text-[#F1F5F9] block">
                      Authentic Digital Tax Invoice
                    </span>
                    <span>Zero brokerage fee • Direct landlord lease</span>
                  </div>
                </div>

                <div className="hidden sm:flex flex-col items-center shrink-0">
                  <QrCode size={20} className="text-[#5B6B7F] dark:text-[#94A3B8]" />
                  <span className="text-[8px] uppercase tracking-widest font-mono">VERIFIED</span>
                </div>
              </div>

              {/* Action Buttons (Print, Share, Close) */}
              <div className="flex flex-col sm:flex-row items-center gap-2.5 pt-1 print:hidden">
                <button
                  onClick={handlePrint}
                  className="w-full sm:flex-1 h-10 bg-white dark:bg-[#111A2B] border border-[#E3E8EE] dark:border-[#1F2A3D] hover:bg-[#F5F8FA] dark:hover:bg-[#1F2A3D] text-[#0F1B2D] dark:text-[#F1F5F9] rounded-lg text-xs font-medium transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Printer size={15} />
                  <span>Print Receipt</span>
                </button>

                <button
                  onClick={handleShare}
                  className="w-full sm:w-auto px-4 h-10 bg-white dark:bg-[#111A2B] border border-[#E3E8EE] dark:border-[#1F2A3D] hover:bg-[#F5F8FA] dark:hover:bg-[#1F2A3D] text-[#0F1B2D] dark:text-[#F1F5F9] rounded-lg text-xs font-medium transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                  title="Share or Copy Link"
                >
                  <Share2 size={15} />
                  <span className="sm:hidden">Share</span>
                </button>

                <button
                  onClick={onClose}
                  className="w-full sm:flex-1 h-10 bg-[#1D4ED8] hover:bg-[#1E40AF] text-white rounded-lg text-xs font-semibold transition-colors cursor-pointer"
                >
                  Done & Close
                </button>
              </div>
            </>
          ) : (
            <div className="text-center py-10 space-y-3">
              <p className="text-xs text-[#5B6B7F] dark:text-[#94A3B8]">No payment record found for this booking ID.</p>
              <button
                onClick={onClose}
                className="px-5 h-9 bg-white dark:bg-[#111A2B] border border-[#E3E8EE] dark:border-[#1F2A3D] text-[#0F1B2D] dark:text-[#F1F5F9] rounded-lg text-xs font-medium cursor-pointer"
              >
                Close
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentReceiptModal;
