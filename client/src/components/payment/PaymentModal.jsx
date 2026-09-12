import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  CreditCard,
  QrCode,
  Building2,
  Wallet,
  ShieldCheck,
  CheckCircle2,
  Lock,
  ArrowRight,
  Sparkles,
  Loader2,
  IndianRupee,
  Coins,
  Receipt,
  Copy,
  Check,
  Zap,
  ShieldAlert,
  KeyRound,
  PlayCircle
} from "lucide-react";
import API from "../../services/api";
import toast from "react-hot-toast";
import useAuth from "../../hooks/useAuth";

const PaymentModal = ({ isOpen, onClose, booking, room, onPaymentSuccess }) => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("simulate"); // Default to simulate for easy test booking!
  const [processing, setProcessing] = useState(false);
  const [processStep, setProcessStep] = useState("");
  const [paymentCompleted, setPaymentCompleted] = useState(false);
  const [completedDetails, setCompletedDetails] = useState(null);
  const [useCoins, setUseCoins] = useState(false);
  const [copiedTxn, setCopiedTxn] = useState(false);

  // Simulation parameters
  const [simulateMode, setSimulateMode] = useState("instant"); // instant | otp
  const [simulatedOtp, setSimulatedOtp] = useState("849201");
  const [enteredOtp, setEnteredOtp] = useState("849201");

  // Form states for other tabs
  const [cardData, setCardData] = useState({
    number: "4532 8920 1145 9081",
    name: user?.name || "Demo Tenant",
    expiry: "12/28",
    cvv: "782"
  });

  const [upiId, setUpiId] = useState(`${(user?.name || "renter").toLowerCase().replace(/\s+/g, "")}@okaxis`);
  const [selectedBank, setSelectedBank] = useState("HDFC");
  const [selectedWallet, setSelectedWallet] = useState("Paytm");

  if (!isOpen) return null;

  const targetRoom = room || booking?.room;
  const baseRent = targetRoom?.rent || 5000;
  const platformFee = 99;
  const discountFee = 99; // Promo 100% off platform fee
  const userCoins = user?.coins || 0;
  const coinDiscount = useCoins ? Math.min(userCoins, 200) : 0;
  const totalAmount = Math.max(1, baseRent + platformFee - discountFee - coinDiscount);

  const handleCardNumberChange = (e) => {
    let val = e.target.value.replace(/\D/g, "").slice(0, 16);
    let formatted = val.match(/.{1,4}/g)?.join(" ") || val;
    setCardData({ ...cardData, number: formatted });
  };

  const handleExpiryChange = (e) => {
    let val = e.target.value.replace(/\D/g, "").slice(0, 4);
    if (val.length >= 3) {
      val = `${val.slice(0, 2)}/${val.slice(2)}`;
    }
    setCardData({ ...cardData, expiry: val });
  };

  const executePayment = async (overrideMethod = null) => {
    const selectedMethod = overrideMethod || activeTab;

    try {
      setProcessing(true);
      setProcessStep("Connecting to Simulated Sandbox Gateway...");

      // Simulate Step 1
      await new Promise((res) => setTimeout(res, 400));
      setProcessStep("Simulating Bank Authorization & Token Check...");

      // Simulate Step 2
      await new Promise((res) => setTimeout(res, 500));
      setProcessStep("Locking Room Reservation & Confirming Payment...");

      const payload = {
        bookingId: booking?._id,
        roomId: targetRoom?._id,
        amount: totalAmount,
        paymentMethod: (selectedMethod === "simulate" ? "SIMULATED_SANDBOX" : selectedMethod).toUpperCase(),
        paymentDetails: {
          isSimulation: true,
          method: selectedMethod,
          ...(selectedMethod === "card" && { last4: cardData.number.slice(-4) }),
          ...(selectedMethod === "upi" && { upiId }),
          ...(selectedMethod === "netbanking" && { bank: selectedBank }),
          ...(selectedMethod === "wallet" && { wallet: selectedWallet }),
          ...(selectedMethod === "simulate" && { simulationType: simulateMode })
        }
      };

      const { data } = await API.post("/payments/process", payload);

      setProcessStep("Payment Confirmed & Verified!");
      setCompletedDetails(data);
      setPaymentCompleted(true);
      toast.success("Simulated Payment Successful! Room is officially booked 🎉");

      if (onPaymentSuccess) {
        onPaymentSuccess(data);
      }
    } catch (err) {
      console.error("Payment error:", err);
      toast.error(err.response?.data?.message || "Payment simulation failed. Please try again.");
    } finally {
      setProcessing(false);
    }
  };

  const copyTransactionId = (txnId) => {
    navigator.clipboard.writeText(txnId);
    setCopiedTxn(true);
    toast.success("Transaction ID copied!");
    setTimeout(() => setCopiedTxn(false), 2000);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 pt-24 pb-12 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => !processing && onClose()}
          className="fixed inset-0 bg-slate-950/75 backdrop-blur-md"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative w-full max-w-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden z-10 my-auto"
        >
          {/* Header */}
          <div className="px-6 py-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/60">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
                <IndianRupee size={20} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-extrabold text-slate-900 dark:text-white">
                    {paymentCompleted ? "Payment Invoice & Receipt" : "Book Room with Payment"}
                  </h2>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                    TEST SANDBOX
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {paymentCompleted
                    ? "Official verification and reservation proof"
                    : "Simulated sandbox payment enabled — no real money will be deducted"}
                </p>
              </div>
            </div>

            {!processing && (
              <button
                onClick={onClose}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                aria-label="Close"
              >
                <X size={18} />
              </button>
            )}
          </div>

          {/* Completed State View */}
          {paymentCompleted ? (
            <div className="p-6 sm:p-8 space-y-6">
              <div className="text-center space-y-3">
                <div className="w-16 h-16 rounded-full bg-emerald-500/10 text-emerald-500 dark:bg-emerald-500/20 flex items-center justify-center mx-auto shadow-inner ring-8 ring-emerald-500/5">
                  <CheckCircle2 size={36} className="animate-bounce" />
                </div>
                <h3 className="text-2xl font-black text-slate-900 dark:text-white">
                  ₹{totalAmount.toLocaleString("en-IN")} Simulated & Confirmed
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
                  Payment authorized via Sandbox Gateway. The room has been officially marked as <strong>BOOKED</strong>!
                </p>
              </div>

              {/* Receipt Details Box */}
              <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 space-y-3.5 text-xs">
                <div className="flex items-center justify-between pb-3 border-b border-slate-200/50 dark:border-slate-700/50">
                  <span className="text-slate-500">Transaction ID</span>
                  <div className="flex items-center gap-1.5 font-mono font-bold text-slate-800 dark:text-slate-200">
                    <span>{completedDetails?.transactionId || "TXN_789456123"}</span>
                    <button
                      onClick={() => copyTransactionId(completedDetails?.transactionId)}
                      className="p-1 hover:bg-slate-200 dark:hover:bg-slate-700 rounded transition-colors"
                      title="Copy TXN ID"
                    >
                      {copiedTxn ? <Check size={12} className="text-emerald-500" /> : <Copy size={12} />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Property</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200 truncate max-w-[200px]">
                    {targetRoom?.title}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Location</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    {targetRoom?.location}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Beneficiary Landlord</span>
                  <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                    {(targetRoom?.owner || booking?.owner)?.name || "Verified Landlord"} {((targetRoom?.owner || booking?.owner)?.email) ? `(${(targetRoom?.owner || booking?.owner)?.email})` : ""}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Payment Status</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400 uppercase flex items-center gap-1">
                    <CheckCircle2 size={13} /> COMPLETED (Sandbox Verified)
                  </span>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-200/50 dark:border-slate-700/50">
                  <span className="text-slate-500">Reward Coins Earned</span>
                  <span className="inline-flex items-center gap-1 font-bold text-amber-500">
                    <Sparkles size={12} /> +50 RoomCoins
                  </span>
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={onClose}
                  className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-bold text-sm shadow-lg shadow-emerald-600/20 active:scale-[0.99] transition-all flex items-center justify-center gap-2"
                >
                  <Receipt size={16} />
                  <span>Done & View My Bookings</span>
                </button>
              </div>
            </div>
          ) : (
            /* Checkout Step */
            <div className="p-6 sm:p-8 space-y-5">
              {/* Room Card Brief */}
              <div className="p-4 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200/40 dark:border-emerald-800/40 flex items-center justify-between gap-4">
                <div className="space-y-0.5">
                  <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                    Selected Property
                  </span>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white truncate max-w-[280px]">
                    {targetRoom?.title}
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {targetRoom?.location} • {targetRoom?.bhkType}
                  </p>
                  {(targetRoom?.owner || booking?.owner) && (
                    <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold pt-0.5">
                      Landlord / Payee: {(targetRoom?.owner || booking?.owner)?.name} ({(targetRoom?.owner || booking?.owner)?.email})
                    </p>
                  )}
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-medium text-slate-400 uppercase block">Monthly Rent</span>
                  <span className="text-base font-extrabold text-slate-900 dark:text-white">
                    ₹{baseRent.toLocaleString("en-IN")}
                  </span>
                </div>
              </div>

              {/* 1-Click Quick Simulate Banner */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/10 via-emerald-500/10 to-teal-500/10 border border-amber-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-sm">
                    <Zap size={18} className="fill-white" />
                  </div>
                  <div className="text-xs">
                    <span className="font-bold text-slate-900 dark:text-white block">
                      Instant 1-Click Sandbox Payment
                    </span>
                    <span className="text-slate-500 dark:text-slate-400 text-[11px]">
                      Simulate full payment authorization and book the room immediately.
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  disabled={processing}
                  onClick={() => executePayment("simulate")}
                  className="px-4 py-2 bg-gradient-to-r from-amber-500 to-emerald-600 hover:from-amber-600 hover:to-emerald-700 text-white rounded-xl text-xs font-bold shadow-md shadow-amber-500/20 transition-all flex items-center justify-center gap-1.5 shrink-0 active:scale-95 disabled:opacity-60 cursor-pointer"
                >
                  <Zap size={14} className="fill-white" />
                  <span>Simulate & Book (₹{totalAmount})</span>
                </button>
              </div>

              {/* Payment Methods Navigation */}
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Payment Channels (All in Sandbox Mode)
                </label>
                <div className="grid grid-cols-5 gap-2">
                  {[
                    { id: "simulate", label: "⚡ Simulate", icon: Zap },
                    { id: "upi", label: "UPI / QR", icon: QrCode },
                    { id: "card", label: "Cards", icon: CreditCard },
                    { id: "netbanking", label: "NetBanking", icon: Building2 },
                    { id: "wallet", label: "Wallets", icon: Wallet }
                  ].map((tab) => {
                    const Icon = tab.icon;
                    const isActive = activeTab === tab.id;
                    return (
                      <button
                        key={tab.id}
                        type="button"
                        onClick={() => setActiveTab(tab.id)}
                        className={`p-2.5 rounded-2xl border text-center transition-all flex flex-col items-center justify-center gap-1 ${
                          isActive
                            ? "bg-emerald-500/10 border-emerald-500 text-emerald-600 dark:text-emerald-400 font-bold shadow-sm"
                            : "bg-slate-50 dark:bg-slate-800/40 border-slate-200/70 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/80"
                        }`}
                      >
                        <Icon size={16} />
                        <span className="text-[11px] truncate">{tab.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Tab Form Contents */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/30 border border-slate-200/50 dark:border-slate-800/60 min-h-[140px] flex flex-col justify-center">
                {/* 1. SIMULATE TAB */}
                {activeTab === "simulate" && (
                  <div className="space-y-3 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-800 dark:text-slate-200">
                        Choose Simulation Scenario:
                      </span>
                      <span className="text-[10px] text-emerald-500 font-bold bg-emerald-500/10 px-2 py-0.5 rounded-full">
                        Sandbox Active
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setSimulateMode("instant")}
                        className={`p-3 rounded-xl border text-left transition-all ${
                          simulateMode === "instant"
                            ? "border-emerald-500 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 font-semibold"
                            : "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400"
                        }`}
                      >
                        <div className="flex items-center gap-1.5 font-bold mb-0.5">
                          <Zap size={14} className="text-amber-500" />
                          <span>Instant Approval</span>
                        </div>
                        <p className="text-[10px] opacity-80">Bypass gateway prompts and book immediately</p>
                      </button>

                      <button
                        type="button"
                        onClick={() => setSimulateMode("otp")}
                        className={`p-3 rounded-xl border text-left transition-all ${
                          simulateMode === "otp"
                            ? "border-emerald-500 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 font-semibold"
                            : "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400"
                        }`}
                      >
                        <div className="flex items-center gap-1.5 font-bold mb-0.5">
                          <KeyRound size={14} className="text-emerald-500" />
                          <span>Mock 3D OTP</span>
                        </div>
                        <p className="text-[10px] opacity-80">Simulate bank SMS OTP code verification</p>
                      </button>
                    </div>

                    {simulateMode === "otp" && (
                      <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 space-y-2">
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="text-slate-500">Test OTP Sent to Phone:</span>
                          <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
                            {simulatedOtp}
                          </span>
                        </div>
                        <input
                          type="text"
                          maxLength={6}
                          value={enteredOtp}
                          onChange={(e) => setEnteredOtp(e.target.value)}
                          className="w-full text-center tracking-[0.4em] font-mono text-base font-bold py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-800 dark:text-white focus:outline-none"
                        />
                      </div>
                    )}
                  </div>
                )}

                {/* 2. UPI TAB */}
                {activeTab === "upi" && (
                  <div className="space-y-4">
                    <div className="flex flex-col sm:flex-row items-center gap-4">
                      {/* Simulated QR Code */}
                      <div className="p-3 bg-white rounded-2xl shadow-sm border border-slate-200 flex flex-col items-center shrink-0">
                        <div className="w-20 h-20 bg-slate-900 rounded-xl p-2 flex items-center justify-center relative overflow-hidden">
                          <QrCode className="text-white w-full h-full" />
                          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-emerald-400/30 to-transparent animate-pulse pointer-events-none" />
                        </div>
                        <span className="text-[9px] font-bold text-slate-500 mt-1">Test Sandbox QR</span>
                      </div>

                      <div className="w-full space-y-2">
                        <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-300">
                          Or Enter Virtual Payment Address (UPI ID)
                        </label>
                        <input
                          type="text"
                          value={upiId}
                          onChange={(e) => setUpiId(e.target.value)}
                          placeholder="e.g. yourname@oksbi"
                          className="w-full px-3.5 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                        />
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {["@okhdfcbank", "@okaxis", "@paytm", "@ibl"].map((handle) => (
                            <button
                              key={handle}
                              type="button"
                              onClick={() => {
                                const prefix = upiId.split("@")[0] || "user";
                                setUpiId(`${prefix}${handle}`);
                              }}
                              className="px-2 py-0.5 rounded-lg bg-slate-200/60 dark:bg-slate-700/60 text-[10px] text-slate-600 dark:text-slate-300 hover:bg-emerald-500 hover:text-white transition-colors"
                            >
                              {handle}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* 3. CARD TAB */}
                {activeTab === "card" && (
                  <div className="space-y-3 text-xs">
                    <div>
                      <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">
                        Test Card Number
                      </label>
                      <div className="relative">
                        <CreditCard size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                          type="text"
                          value={cardData.number}
                          onChange={handleCardNumberChange}
                          placeholder="4532 •••• •••• 8920"
                          className="w-full pl-9 pr-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 font-mono"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">
                          Expiry (MM/YY)
                        </label>
                        <input
                          type="text"
                          value={cardData.expiry}
                          onChange={handleExpiryChange}
                          placeholder="MM/YY"
                          className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-white focus:outline-none font-mono"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">
                          CVV / CVC
                        </label>
                        <input
                          type="password"
                          maxLength={4}
                          value={cardData.cvv}
                          onChange={(e) => setCardData({ ...cardData, cvv: e.target.value })}
                          placeholder="•••"
                          className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-white focus:outline-none font-mono"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* 4. NETBANKING TAB */}
                {activeTab === "netbanking" && (
                  <div className="space-y-3">
                    <label className="block text-[10px] font-bold uppercase text-slate-400">
                      Popular Simulated Banks
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {["HDFC", "SBI", "ICICI", "Axis", "Kotak", "PNB"].map((bank) => (
                        <button
                          key={bank}
                          type="button"
                          onClick={() => setSelectedBank(bank)}
                          className={`p-2 rounded-xl text-xs font-bold border transition-all ${
                            selectedBank === bank
                              ? "bg-emerald-500/10 border-emerald-500 text-emerald-600 dark:text-emerald-400"
                              : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300"
                          }`}
                        >
                          {bank} Bank
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* 5. WALLET TAB */}
                {activeTab === "wallet" && (
                  <div className="space-y-3">
                    <label className="block text-[10px] font-bold uppercase text-slate-400">
                      Select Simulated Digital Wallet
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {["Paytm", "PhonePe", "Amazon Pay"].map((wallet) => (
                        <button
                          key={wallet}
                          type="button"
                          onClick={() => setSelectedWallet(wallet)}
                          className={`p-3 rounded-xl text-xs font-bold border transition-all text-center ${
                            selectedWallet === wallet
                              ? "bg-emerald-500/10 border-emerald-500 text-emerald-600 dark:text-emerald-400"
                              : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300"
                          }`}
                        >
                          {wallet}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Reward Coin Discount Toggle */}
              {userCoins > 0 && (
                <div className="p-3 rounded-2xl bg-amber-500/5 dark:bg-amber-500/10 border border-amber-500/20 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs text-amber-700 dark:text-amber-400">
                    <Coins size={16} />
                    <span>
                      Redeem <strong>{Math.min(userCoins, 200)}</strong> RoomCoins for ₹{Math.min(userCoins, 200)} off
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    checked={useCoins}
                    onChange={(e) => setUseCoins(e.target.checked)}
                    className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                  />
                </div>
              )}

              {/* Price Breakdown */}
              <div className="space-y-1.5 text-xs pt-1 border-t border-slate-100 dark:border-slate-800">
                <div className="flex justify-between text-slate-500 dark:text-slate-400">
                  <span>First Month Rent</span>
                  <span>₹{baseRent.toLocaleString("en-IN")}</span>
                </div>
                <div className="flex justify-between text-slate-500 dark:text-slate-400">
                  <span>Platform Fee</span>
                  <div className="flex items-center gap-1.5">
                    <span className="line-through text-slate-400">₹{platformFee}</span>
                    <span className="text-emerald-600 dark:text-emerald-400 font-bold">FREE (0)</span>
                  </div>
                </div>
                {useCoins && coinDiscount > 0 && (
                  <div className="flex justify-between text-amber-600 dark:text-amber-400 font-medium">
                    <span>Coin Discount</span>
                    <span>-₹{coinDiscount}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm font-extrabold text-slate-900 dark:text-white pt-1.5 border-t border-slate-200/60 dark:border-slate-800/60">
                  <span>Total Amount</span>
                  <span className="text-emerald-600 dark:text-emerald-400 text-base">
                    ₹{totalAmount.toLocaleString("en-IN")}
                  </span>
                </div>
              </div>

              {/* Checkout Action Button */}
              <div className="space-y-2 pt-1">
                <button
                  type="button"
                  disabled={processing}
                  onClick={() => executePayment()}
                  className="w-full py-3.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded-2xl font-bold text-sm shadow-lg shadow-emerald-600/25 active:scale-[0.99] transition-all flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer"
                >
                  {processing ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      <span>{processStep || "Simulating Payment..."}</span>
                    </>
                  ) : (
                    <>
                      <Lock size={16} />
                      <span>Simulate Pay ₹{totalAmount.toLocaleString("en-IN")} & Book Room</span>
                      <ArrowRight size={16} />
                    </>
                  )}
                </button>

                <div className="flex items-center justify-center gap-3 text-[10px] text-slate-400">
                  <span className="flex items-center gap-1 text-emerald-500 font-semibold">
                    <ShieldCheck size={12} /> Sandbox Mode
                  </span>
                  <span>•</span>
                  <span>No Real Money Deducted</span>
                  <span>•</span>
                  <span>Immediate Room Booking</span>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default PaymentModal;
