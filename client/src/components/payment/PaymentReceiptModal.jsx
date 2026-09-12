import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, CheckCircle2, Receipt, Copy, Check, Calendar, MapPin, IndianRupee, ShieldCheck, Printer } from "lucide-react";
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

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 pt-24 pb-12 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-slate-950/75 backdrop-blur-md"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden z-10 my-auto"
        >
          {/* Header */}
          <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/60">
            <div className="flex items-center gap-2">
              <Receipt size={18} className="text-emerald-500" />
              <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">
                Official Payment Receipt
              </h3>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <X size={16} />
            </button>
          </div>

          <div className="p-6 space-y-6">
            {loading ? (
              <div className="py-12 flex flex-col items-center justify-center gap-3">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-emerald-500" />
                <span className="text-xs text-slate-400">Loading invoice data...</span>
              </div>
            ) : receipt ? (
              <>
                <div className="text-center space-y-2">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold border border-emerald-500/20">
                    <CheckCircle2 size={14} />
                    <span>Payment Completed</span>
                  </div>
                  <h2 className="text-3xl font-black text-slate-900 dark:text-white">
                    ₹{receipt.amount?.toLocaleString("en-IN")}
                  </h2>
                  <p className="text-[11px] text-slate-400">
                    Paid on {new Date(receipt.createdAt).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })}
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60 space-y-3 text-xs">
                  <div className="flex justify-between items-center pb-2 border-b border-slate-200/50 dark:border-slate-700/50">
                    <span className="text-slate-500">Transaction ID</span>
                    <div className="flex items-center gap-1.5 font-mono font-bold text-slate-800 dark:text-slate-200">
                      <span>{receipt.transactionId}</span>
                      <button onClick={copyTxn} className="p-1 hover:bg-slate-200 dark:hover:bg-slate-700 rounded">
                        {copied ? <Check size={12} className="text-emerald-500" /> : <Copy size={12} />}
                      </button>
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-slate-500">Property</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200 truncate max-w-[200px]">
                      {receipt.roomId?.title || "Rental Property"}
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-slate-500">Location</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">
                      {receipt.roomId?.location || "N/A"}
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-slate-500">Property Owner / Landlord</span>
                    <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                      {receipt.ownerId?.name || receipt.roomId?.owner?.name || "Verified Landlord"} {receipt.ownerId?.email || receipt.roomId?.owner?.email ? `(${receipt.ownerId?.email || receipt.roomId?.owner?.email})` : ""}
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-slate-500">Tenant / Paid By</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">
                      {receipt.userId?.name} ({receipt.userId?.email})
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-slate-500">Payment Channel</span>
                    <span className="font-bold text-emerald-600 dark:text-emerald-400 uppercase">
                      {receipt.paymentMethod}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <button
                    onClick={handlePrint}
                    className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5"
                  >
                    <Printer size={14} />
                    <span>Print Invoice</span>
                  </button>
                  <button
                    onClick={onClose}
                    className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all"
                  >
                    Close
                  </button>
                </div>
              </>
            ) : (
              <div className="text-center py-8 space-y-2">
                <p className="text-xs text-slate-500">No payment record found for this booking.</p>
                <button
                  onClick={onClose}
                  className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-semibold"
                >
                  Close
                </button>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default PaymentReceiptModal;
