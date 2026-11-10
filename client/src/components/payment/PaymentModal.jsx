import React, { useState } from "react";
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
      toast.success("Payment successful! Room booked.");

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
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 overflow-y-auto">
      {/* Backdrop */}
      <div
        onClick={() => !processing && onClose()}
        className="fixed inset-0 bg-black/60"
      />

      {/* Modal Window */}
      <div className="relative w-full max-w-2xl bg-white dark:bg-[#111A2B] border border-[#E3E8EE] dark:border-[#1F2A3D] rounded-xl shadow-xl overflow-hidden z-10 my-auto max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="px-5 sm:px-6 py-4 border-b border-[#E3E8EE] dark:border-[#1F2A3D] flex items-center justify-between bg-[#F5F8FA] dark:bg-[#0B1220] shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-white dark:bg-[#111A2B] border border-[#E3E8EE] dark:border-[#1F2A3D] text-[#1D4ED8] flex items-center justify-center font-bold shrink-0">
              <IndianRupee size={18} />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-base sm:text-lg font-bold text-[#0F1B2D] dark:text-[#F1F5F9]">
                  {paymentCompleted ? "Payment Confirmation" : "Confirm Booking & Payment"}
                </h2>
                <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-amber-50 text-amber-800 dark:bg-amber-950/40 dark:text-amber-300 border border-amber-200 dark:border-amber-900/60">
                  SANDBOX
                </span>
              </div>
              <p className="text-xs text-[#5B6B7F] dark:text-[#94A3B8]">
                {paymentCompleted
                  ? "Official booking receipt and contract record"
                  : "Simulated sandbox payment — no real money will be charged"}
              </p>
            </div>
          </div>

          {!processing && (
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-[#5B6B7F] dark:text-[#94A3B8] hover:text-[#0F1B2D] dark:hover:text-[#F1F5F9] hover:bg-[#E3E8EE] dark:hover:bg-[#1F2A3D] transition-colors cursor-pointer"
              aria-label="Close"
            >
              <X size={18} />
            </button>
          )}
        </div>

        {/* Completed State View */}
        {paymentCompleted ? (
          <div className="p-6 sm:p-8 space-y-6 overflow-y-auto">
            <div className="text-center space-y-2">
              <div className="w-14 h-14 rounded-full bg-[#DCFCE7] text-[#15803D] flex items-center justify-center mx-auto">
                <CheckCircle2 size={32} />
              </div>
              <h3 className="text-2xl font-bold text-[#0F1B2D] dark:text-[#F1F5F9]">
                ₹{totalAmount.toLocaleString("en-IN")} Payment Confirmed
              </h3>
              <p className="text-xs text-[#5B6B7F] dark:text-[#94A3B8] max-w-sm mx-auto">
                Payment authorized via Sandbox Gateway. The room is now officially <strong>BOOKED</strong>.
              </p>
            </div>

            {/* Receipt Details Box */}
            <div className="p-4 sm:p-5 rounded-lg bg-[#F5F8FA] dark:bg-[#0B1220] border border-[#E3E8EE] dark:border-[#1F2A3D] space-y-2.5 text-xs">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 pb-2 border-b border-[#E3E8EE] dark:border-[#1F2A3D]">
                <span className="text-[#5B6B7F] dark:text-[#94A3B8]">Transaction ID</span>
                <div className="flex items-center gap-1.5 font-mono text-[#0F1B2D] dark:text-[#F1F5F9] break-all">
                  <span>{completedDetails?.transactionId || "TXN_789456123"}</span>
                  <button
                    onClick={() => copyTransactionId(completedDetails?.transactionId)}
                    className="p-1 hover:bg-[#E3E8EE] dark:hover:bg-[#1F2A3D] rounded transition-colors shrink-0 cursor-pointer"
                    title="Copy TXN ID"
                  >
                    {copiedTxn ? <Check size={12} className="text-[#15803D]" /> : <Copy size={12} />}
                  </button>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                <span className="text-[#5B6B7F] dark:text-[#94A3B8]">Property</span>
                <span className="font-medium text-[#0F1B2D] dark:text-[#F1F5F9] sm:text-right">
                  {targetRoom?.title}
                </span>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                <span className="text-[#5B6B7F] dark:text-[#94A3B8]">Location</span>
                <span className="font-medium text-[#0F1B2D] dark:text-[#F1F5F9] sm:text-right">
                  {targetRoom?.location}
                </span>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                <span className="text-[#5B6B7F] dark:text-[#94A3B8]">Landlord</span>
                <span className="font-medium text-[#0F1B2D] dark:text-[#F1F5F9] sm:text-right break-all">
                  {(targetRoom?.owner || booking?.owner)?.name || "Landlord"} {((targetRoom?.owner || booking?.owner)?.email) ? `(${(targetRoom?.owner || booking?.owner)?.email})` : ""}
                </span>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                <span className="text-[#5B6B7F] dark:text-[#94A3B8]">Payment Status</span>
                <span className="font-semibold text-[#15803D] uppercase flex items-center gap-1 sm:justify-end">
                  <CheckCircle2 size={13} /> COMPLETED
                </span>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-[#E3E8EE] dark:border-[#1F2A3D]">
                <span className="text-[#5B6B7F] dark:text-[#94A3B8]">Loyalty Points Earned</span>
                <span className="inline-flex items-center gap-1 font-semibold text-[#0F766E]">
                  <Coins size={14} /> +50 RoomCoins
                </span>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={onClose}
                className="w-full h-11 bg-[#1D4ED8] hover:bg-[#1E40AF] text-white rounded-lg font-medium text-sm transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <Receipt size={16} />
                <span>Done & View My Bookings</span>
              </button>
            </div>
          </div>
        ) : (
          /* Checkout Step */
          <div className="p-5 sm:p-6 space-y-5 overflow-y-auto">
            {/* Room Card Brief */}
            <div className="p-4 rounded-lg bg-[#F5F8FA] dark:bg-[#0B1220] border border-[#E3E8EE] dark:border-[#1F2A3D] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="space-y-0.5">
                <span className="text-[10px] font-semibold text-[#5B6B7F] dark:text-[#94A3B8] uppercase tracking-wider">
                  Selected Property
                </span>
                <h4 className="text-sm font-semibold text-[#0F1B2D] dark:text-[#F1F5F9]">
                  {targetRoom?.title}
                </h4>
                <p className="text-xs text-[#5B6B7F] dark:text-[#94A3B8]">
                  {targetRoom?.location} • {targetRoom?.bhkType}
                </p>
                {(targetRoom?.owner || booking?.owner) && (
                  <p className="text-[11px] text-[#5B6B7F] dark:text-[#94A3B8] pt-0.5 break-all">
                    Landlord: {(targetRoom?.owner || booking?.owner)?.name} ({(targetRoom?.owner || booking?.owner)?.email})
                  </p>
                )}
              </div>
              <div className="sm:text-right flex items-center justify-between sm:block border-t sm:border-t-0 pt-2 sm:pt-0 border-[#E3E8EE] dark:border-[#1F2A3D]">
                <span className="text-[10px] font-medium text-[#5B6B7F] dark:text-[#94A3B8] uppercase block">Monthly Rent</span>
                <span className="text-base font-bold text-[#0F1B2D] dark:text-[#F1F5F9]">
                  ₹{baseRent.toLocaleString("en-IN")}
                </span>
              </div>
            </div>

            {/* Quick 1-Click Simulate Banner */}
            <div className="p-4 rounded-lg bg-[#F5F8FA] dark:bg-[#0B1220] border border-[#E3E8EE] dark:border-[#1F2A3D] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#1D4ED8] text-white flex items-center justify-center shrink-0">
                  <Zap size={16} />
                </div>
                <div className="text-xs">
                  <span className="font-semibold text-[#0F1B2D] dark:text-[#F1F5F9] block">
                    Instant 1-Click Sandbox Payment
                  </span>
                  <span className="text-[#5B6B7F] dark:text-[#94A3B8] text-[11px]">
                    Authorize test payment and confirm the booking immediately.
                  </span>
                </div>
              </div>

              <button
                type="button"
                disabled={processing}
                onClick={() => executePayment("simulate")}
                className="w-full sm:w-auto px-4 h-9 bg-[#1D4ED8] hover:bg-[#1E40AF] text-white rounded-lg text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 shrink-0 disabled:opacity-60 cursor-pointer"
              >
                <Zap size={14} />
                <span>Simulate & Book (₹{totalAmount})</span>
              </button>
            </div>

            {/* Payment Methods Navigation */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-[#5B6B7F] dark:text-[#94A3B8] uppercase tracking-wider">
                Payment Method (Sandbox Mode)
              </label>
              <div className="grid grid-cols-5 gap-2">
                {[
                  { id: "simulate", label: "Instant", icon: Zap },
                  { id: "upi", label: "UPI", icon: QrCode },
                  { id: "card", label: "Card", icon: CreditCard },
                  { id: "netbanking", label: "NetBank", icon: Building2 },
                  { id: "wallet", label: "Wallet", icon: Wallet }
                ].map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setActiveTab(tab.id)}
                      className={`p-2.5 rounded-lg border text-center transition-colors flex flex-col items-center justify-center gap-1 cursor-pointer ${
                        isActive
                          ? "bg-blue-50 dark:bg-blue-950/40 border-[#1D4ED8] text-[#1D4ED8] font-semibold"
                          : "bg-white dark:bg-[#111A2B] border-[#E3E8EE] dark:border-[#1F2A3D] text-[#5B6B7F] dark:text-[#94A3B8] hover:bg-[#F5F8FA] dark:hover:bg-[#1F2A3D]"
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
            <div className="p-4 rounded-lg bg-[#F5F8FA] dark:bg-[#0B1220] border border-[#E3E8EE] dark:border-[#1F2A3D] min-h-[140px] flex flex-col justify-center">
              {/* 1. SIMULATE TAB */}
              {activeTab === "simulate" && (
                <div className="space-y-3 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-[#0F1B2D] dark:text-[#F1F5F9]">
                      Simulation Scenario:
                    </span>
                    <span className="text-[10px] text-[#15803D] font-semibold bg-[#DCFCE7] dark:bg-emerald-950/40 px-2 py-0.5 rounded">
                      Sandbox Active
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setSimulateMode("instant")}
                      className={`p-3 rounded-lg border text-left transition-colors cursor-pointer ${
                        simulateMode === "instant"
                          ? "border-[#1D4ED8] bg-white dark:bg-[#111A2B] text-[#1D4ED8] font-semibold"
                          : "border-[#E3E8EE] dark:border-[#1F2A3D] bg-white dark:bg-[#111A2B] text-[#5B6B7F] dark:text-[#94A3B8]"
                      }`}
                    >
                      <div className="flex items-center gap-1.5 font-semibold mb-0.5">
                        <Zap size={14} className="text-[#1D4ED8]" />
                        <span>Instant Approval</span>
                      </div>
                      <p className="text-[10px] text-[#5B6B7F] dark:text-[#94A3B8]">Approve immediately without extra steps</p>
                    </button>

                    <button
                      type="button"
                      onClick={() => setSimulateMode("otp")}
                      className={`p-3 rounded-lg border text-left transition-colors cursor-pointer ${
                        simulateMode === "otp"
                          ? "border-[#1D4ED8] bg-white dark:bg-[#111A2B] text-[#1D4ED8] font-semibold"
                          : "border-[#E3E8EE] dark:border-[#1F2A3D] bg-white dark:bg-[#111A2B] text-[#5B6B7F] dark:text-[#94A3B8]"
                      }`}
                    >
                      <div className="flex items-center gap-1.5 font-semibold mb-0.5">
                        <KeyRound size={14} className="text-[#1D4ED8]" />
                        <span>Mock 3D OTP</span>
                      </div>
                      <p className="text-[10px] text-[#5B6B7F] dark:text-[#94A3B8]">Simulate bank SMS OTP code verification</p>
                    </button>
                  </div>

                  {simulateMode === "otp" && (
                    <div className="p-3 bg-white dark:bg-[#111A2B] rounded-lg border border-[#E3E8EE] dark:border-[#1F2A3D] space-y-2">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-[#5B6B7F] dark:text-[#94A3B8]">Test OTP Code:</span>
                        <span className="font-mono font-bold text-[#1D4ED8]">
                          {simulatedOtp}
                        </span>
                      </div>
                      <input
                        type="text"
                        maxLength={6}
                        value={enteredOtp}
                        onChange={(e) => setEnteredOtp(e.target.value)}
                        className="w-full text-center tracking-[0.4em] font-mono text-base font-bold py-1.5 bg-[#F5F8FA] dark:bg-[#0B1220] border border-[#E3E8EE] dark:border-[#1F2A3D] rounded-lg text-[#0F1B2D] dark:text-[#F1F5F9] focus:outline-none focus:ring-2 focus:ring-[#1D4ED8]"
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
                    <div className="p-3 bg-white rounded-lg border border-[#E3E8EE] flex flex-col items-center shrink-0">
                      <div className="w-16 h-16 bg-[#0F1B2D] rounded-md p-1.5 flex items-center justify-center">
                        <QrCode className="text-white w-full h-full" />
                      </div>
                      <span className="text-[9px] font-medium text-[#5B6B7F] mt-1">Sandbox QR</span>
                    </div>

                    <div className="w-full space-y-1.5">
                      <label className="block text-xs font-semibold text-[#5B6B7F] dark:text-[#94A3B8]">
                        Enter UPI ID
                      </label>
                      <input
                        type="text"
                        value={upiId}
                        onChange={(e) => setUpiId(e.target.value)}
                        placeholder="e.g. yourname@okhdfcbank"
                        className="w-full px-3 py-2 bg-white dark:bg-[#111A2B] border border-[#E3E8EE] dark:border-[#1F2A3D] rounded-lg text-xs text-[#0F1B2D] dark:text-[#F1F5F9] focus:outline-none focus:ring-2 focus:ring-[#1D4ED8]"
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
                            className="px-2 py-0.5 rounded bg-white dark:bg-[#111A2B] border border-[#E3E8EE] dark:border-[#1F2A3D] text-[10px] text-[#5B6B7F] dark:text-[#94A3B8] hover:text-[#1D4ED8] transition-colors cursor-pointer"
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
                    <label className="block text-[10px] font-semibold uppercase text-[#5B6B7F] dark:text-[#94A3B8] mb-1">
                      Test Card Number
                    </label>
                    <div className="relative">
                      <CreditCard size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#5B6B7F] dark:text-[#94A3B8]" />
                      <input
                        type="text"
                        value={cardData.number}
                        onChange={handleCardNumberChange}
                        placeholder="4532 •••• •••• 8920"
                        className="w-full pl-9 pr-3 py-2 bg-white dark:bg-[#111A2B] border border-[#E3E8EE] dark:border-[#1F2A3D] rounded-lg text-[#0F1B2D] dark:text-[#F1F5F9] focus:outline-none focus:ring-2 focus:ring-[#1D4ED8] font-mono text-xs"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] font-semibold uppercase text-[#5B6B7F] dark:text-[#94A3B8] mb-1">
                        Expiry (MM/YY)
                      </label>
                      <input
                        type="text"
                        value={cardData.expiry}
                        onChange={handleExpiryChange}
                        placeholder="MM/YY"
                        className="w-full px-3 py-2 bg-white dark:bg-[#111A2B] border border-[#E3E8EE] dark:border-[#1F2A3D] rounded-lg text-[#0F1B2D] dark:text-[#F1F5F9] focus:outline-none font-mono text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-semibold uppercase text-[#5B6B7F] dark:text-[#94A3B8] mb-1">
                        CVV / CVC
                      </label>
                      <input
                        type="password"
                        maxLength={4}
                        value={cardData.cvv}
                        onChange={(e) => setCardData({ ...cardData, cvv: e.target.value })}
                        placeholder="•••"
                        className="w-full px-3 py-2 bg-white dark:bg-[#111A2B] border border-[#E3E8EE] dark:border-[#1F2A3D] rounded-lg text-[#0F1B2D] dark:text-[#F1F5F9] focus:outline-none font-mono text-xs"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* 4. NETBANKING TAB */}
              {activeTab === "netbanking" && (
                <div className="space-y-2">
                  <label className="block text-[10px] font-semibold uppercase text-[#5B6B7F] dark:text-[#94A3B8]">
                    Select Bank
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {["HDFC", "SBI", "ICICI", "Axis", "Kotak", "PNB"].map((bank) => (
                      <button
                        key={bank}
                        type="button"
                        onClick={() => setSelectedBank(bank)}
                        className={`p-2 rounded-lg text-xs font-medium border transition-colors cursor-pointer ${
                          selectedBank === bank
                            ? "bg-blue-50 dark:bg-blue-950/40 border-[#1D4ED8] text-[#1D4ED8]"
                            : "bg-white dark:bg-[#111A2B] border-[#E3E8EE] dark:border-[#1F2A3D] text-[#0F1B2D] dark:text-[#F1F5F9]"
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
                <div className="space-y-2">
                  <label className="block text-[10px] font-semibold uppercase text-[#5B6B7F] dark:text-[#94A3B8]">
                    Select Digital Wallet
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {["Paytm", "PhonePe", "Amazon Pay"].map((wallet) => (
                      <button
                        key={wallet}
                        type="button"
                        onClick={() => setSelectedWallet(wallet)}
                        className={`p-2.5 rounded-lg text-xs font-medium border transition-colors text-center cursor-pointer ${
                          selectedWallet === wallet
                            ? "bg-blue-50 dark:bg-blue-950/40 border-[#1D4ED8] text-[#1D4ED8]"
                            : "bg-white dark:bg-[#111A2B] border-[#E3E8EE] dark:border-[#1F2A3D] text-[#0F1B2D] dark:text-[#F1F5F9]"
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
              <div className="p-3 rounded-lg bg-[#F5F8FA] dark:bg-[#0B1220] border border-[#E3E8EE] dark:border-[#1F2A3D] flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs text-[#0F766E] dark:text-[#14B8A6]">
                  <Coins size={16} />
                  <span>
                    Redeem <strong>{Math.min(userCoins, 200)}</strong> RoomCoins for ₹{Math.min(userCoins, 200)} off
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={useCoins}
                  onChange={(e) => setUseCoins(e.target.checked)}
                  className="w-4 h-4 rounded text-[#1D4ED8] focus:ring-[#1D4ED8] cursor-pointer"
                />
              </div>
            )}

            {/* Price Breakdown */}
            <div className="space-y-1.5 text-xs pt-1 border-t border-[#E3E8EE] dark:border-[#1F2A3D]">
              <div className="flex justify-between text-[#5B6B7F] dark:text-[#94A3B8]">
                <span>First Month Rent</span>
                <span>₹{baseRent.toLocaleString("en-IN")}</span>
              </div>
              <div className="flex justify-between text-[#5B6B7F] dark:text-[#94A3B8]">
                <span>Brokerage / Platform Fee</span>
                <span className="text-[#15803D] font-medium">₹0 (Zero Brokerage)</span>
              </div>
              {useCoins && coinDiscount > 0 && (
                <div className="flex justify-between text-[#0F766E] font-medium">
                  <span>Coins Discount</span>
                  <span>-₹{coinDiscount}</span>
                </div>
              )}
              <div className="flex justify-between text-sm font-bold text-[#0F1B2D] dark:text-[#F1F5F9] pt-1.5 border-t border-[#E3E8EE] dark:border-[#1F2A3D]">
                <span>Total Amount</span>
                <span className="text-base text-[#1D4ED8]">
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
                className="w-full h-11 bg-[#1D4ED8] hover:bg-[#1E40AF] text-white rounded-lg font-semibold text-sm transition-colors flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer"
              >
                {processing ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    <span>{processStep || "Simulating Payment..."}</span>
                  </>
                ) : (
                  <>
                    <Lock size={16} />
                    <span>Pay ₹{totalAmount.toLocaleString("en-IN")} & Complete Booking</span>
                    <ArrowRight size={16} />
                  </>
                )}
              </button>

              <div className="flex items-center justify-center gap-2 text-[11px] text-[#5B6B7F] dark:text-[#94A3B8]">
                <span className="flex items-center gap-1 text-[#15803D] font-medium">
                  <ShieldCheck size={13} /> Sandbox Test Gateway
                </span>
                <span>•</span>
                <span>No Actual Money Charged</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentModal;
