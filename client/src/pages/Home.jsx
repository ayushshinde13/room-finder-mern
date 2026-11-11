import React from "react";
import { Link } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import { 
  ShieldCheck, 
  Users, 
  DollarSign, 
  ArrowRight, 
  MapPin, 
  Bed, 
  CheckCircle2,
  FileCheck
} from "lucide-react";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import Badge from "../components/ui/Badge";

const Home = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#1D4ED8] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-16 sm:space-y-24 py-4 sm:py-8">
      {/* ================= HERO SECTION ================= */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
        <div className="lg:col-span-7 space-y-6 text-left">
          <div className="space-y-3">
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-[#0F1B2D] dark:text-[#F1F5F9] leading-tight max-w-xl">
              Find verified rooms.{" "}
              <span className="text-[#1D4ED8] dark:text-[#3B82F6]">
                Pay no brokerage.
              </span>
            </h1>

            <p className="text-base sm:text-lg text-[#5B6B7F] dark:text-[#94A3B8] leading-relaxed max-w-xl">
              Connect directly with verified property owners. Transparent rental pricing,
              accurate photos, and secure digital agreements without middleman commissions.
            </p>
          </div>

          {/* Quick CTA Links */}
          <div className="flex flex-wrap items-center gap-4 pt-1">
            <Link to="/explore">
              <Button variant="primary" size="md">
                Browse Available Rooms
              </Button>
            </Link>
            <Link
              to={user?.role === "OWNER" ? "/add-room" : "/register"}
              className="text-sm font-medium text-[#1D4ED8] dark:text-[#3B82F6] hover:underline inline-flex items-center gap-1"
            >
              <span>List your property</span>
              <ArrowRight size={15} strokeWidth={1.75} />
            </Link>
          </div>
        </div>

        {/* Hero Visual: Real Property Image & Verified Card */}
        <div className="lg:col-span-5 relative">
          <div className="relative rounded-xl overflow-hidden border border-[#E3E8EE] dark:border-[#1F2A3D] shadow-[0_1px_2px_rgba(0,0,0,0.04)] aspect-[4/3] bg-[#F5F8FA] dark:bg-[#111A2B]">
            <img
              src="https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80"
              alt="Verified studio apartment"
              className="w-full h-full object-cover"
            />
            {/* Top Verified Tag */}
            <div className="absolute top-3 left-3">
              <Badge variant="verified" size="sm">
                <CheckCircle2 size={12} strokeWidth={2} />
                <span>Verified Listing</span>
              </Badge>
            </div>

            {/* Bottom Card Summary */}
            <div className="absolute bottom-3 left-3 right-3 p-3 bg-white/95 dark:bg-[#111A2B]/95 border border-[#E3E8EE] dark:border-[#1F2A3D] rounded-lg text-left shadow-sm">
              <div className="flex items-center justify-between gap-2">
                <div>
                  <h3 className="text-xs font-bold text-[#0F1B2D] dark:text-[#F1F5F9] truncate">
                    Furnished Studio Apartment
                  </h3>
                  <p className="text-[11px] text-[#5B6B7F] dark:text-[#94A3B8] flex items-center gap-1 mt-0.5">
                    <MapPin size={11} strokeWidth={1.75} />
                    <span>Indiranagar • Direct Owner</span>
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-xs font-bold text-[#0F1B2D] dark:text-[#F1F5F9] block">
                    ₹12,000
                  </span>
                  <span className="text-[10px] text-[#5B6B7F] dark:text-[#94A3B8] block">/ month</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= PLATFORM HIGHLIGHTS ================= */}
      <section className="border-y border-[#E3E8EE] dark:border-[#1F2A3D] py-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-left">
          <div className="space-y-1">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#1D4ED8] dark:text-[#3B82F6]">
              Zero Brokerage
            </span>
            <h3 className="text-sm font-bold text-[#0F1B2D] dark:text-[#F1F5F9]">
              No Middleman Fees
            </h3>
            <p className="text-xs text-[#5B6B7F] dark:text-[#94A3B8] leading-relaxed">
              Every room is listed directly by the property owner. You pay zero commissions.
            </p>
          </div>

          <div className="space-y-1">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#0F766E] dark:text-[#14B8A6]">
              Verified Listings
            </span>
            <h3 className="text-sm font-bold text-[#0F1B2D] dark:text-[#F1F5F9]">
              Authentic Photographs
            </h3>
            <p className="text-xs text-[#5B6B7F] dark:text-[#94A3B8] leading-relaxed">
              All listings include genuine unit photos, confirmed addresses, and verified landlords.
            </p>
          </div>

          <div className="space-y-1">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#1D4ED8] dark:text-[#3B82F6]">
              Direct Contact
            </span>
            <h3 className="text-sm font-bold text-[#0F1B2D] dark:text-[#F1F5F9]">
              Direct Negotiations
            </h3>
            <p className="text-xs text-[#5B6B7F] dark:text-[#94A3B8] leading-relaxed">
              Communicate directly with landlords to review tenancy terms and schedule visits.
            </p>
          </div>

          <div className="space-y-1">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#0F766E] dark:text-[#14B8A6]">
              Digital Proof
            </span>
            <h3 className="text-sm font-bold text-[#0F1B2D] dark:text-[#F1F5F9]">
              Official Invoices
            </h3>
            <p className="text-xs text-[#5B6B7F] dark:text-[#94A3B8] leading-relaxed">
              Automated payment receipts and settlement records for rent and deposits.
            </p>
          </div>
        </div>
      </section>

      {/* ================= THREE PILLARS SECTION ================= */}
      <section className="space-y-8 text-left">
        <div className="max-w-xl space-y-2">
          <h2 className="text-2xl font-bold tracking-tight text-[#0F1B2D] dark:text-[#F1F5F9]">
            A transparent renting standard
          </h2>
          <p className="text-sm text-[#5B6B7F] dark:text-[#94A3B8] leading-relaxed">
            Built from the ground up to solve common rental challenges: hidden charges,
            unverified listing information, and complicated vacate procedures.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card padding="p-6" className="space-y-3">
            <div className="w-10 h-10 rounded-lg bg-[#F5F8FA] dark:bg-[#162035] border border-[#E3E8EE] dark:border-[#1F2A3D] text-[#1D4ED8] dark:text-[#3B82F6] flex items-center justify-center">
              <DollarSign size={20} strokeWidth={1.75} />
            </div>
            <h3 className="text-base font-bold text-[#0F1B2D] dark:text-[#F1F5F9]">
              Transparent Pricing
            </h3>
            <p className="text-xs text-[#5B6B7F] dark:text-[#94A3B8] leading-relaxed">
              What you see is what you pay. Monthly rent rates are fixed, transparent,
              and agreed upon directly with the property owner.
            </p>
          </Card>

          <Card padding="p-6" className="space-y-3">
            <div className="w-10 h-10 rounded-lg bg-[#F5F8FA] dark:bg-[#162035] border border-[#E3E8EE] dark:border-[#1F2A3D] text-[#0F766E] dark:text-[#14B8A6] flex items-center justify-center">
              <Users size={20} strokeWidth={1.75} />
            </div>
            <h3 className="text-base font-bold text-[#0F1B2D] dark:text-[#F1F5F9]">
              Direct Owner Relationships
            </h3>
            <p className="text-xs text-[#5B6B7F] dark:text-[#94A3B8] leading-relaxed">
              Skip agency bureaucracy. Speak directly with landlords about terms,
              amenities, check-in schedules, and house rules.
            </p>
          </Card>

          <Card padding="p-6" className="space-y-3">
            <div className="w-10 h-10 rounded-lg bg-[#F5F8FA] dark:bg-[#162035] border border-[#E3E8EE] dark:border-[#1F2A3D] text-[#1D4ED8] dark:text-[#3B82F6] flex items-center justify-center">
              <FileCheck size={20} strokeWidth={1.75} />
            </div>
            <h3 className="text-base font-bold text-[#0F1B2D] dark:text-[#F1F5F9]">
              Structured Settlements
            </h3>
            <p className="text-xs text-[#5B6B7F] dark:text-[#94A3B8] leading-relaxed">
              Clearly defined refund and vacate terms. If you decide to vacate early,
              refund amounts and retention fees are handled transparently.
            </p>
          </Card>
        </div>
      </section>

      {/* ================= CALL TO ACTION BANNER ================= */}
      <section className="p-8 sm:p-12 rounded-xl bg-[#F5F8FA] dark:bg-[#111A2B] border border-[#E3E8EE] dark:border-[#1F2A3D] text-left">
        <div className="max-w-2xl space-y-4">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#0F1B2D] dark:text-[#F1F5F9]">
            Ready to find your next room?
          </h2>
          <p className="text-sm text-[#5B6B7F] dark:text-[#94A3B8] leading-relaxed">
            Search hundreds of verified listings across major cities. Register in minutes
            to enquire, book, and receive digital receipts.
          </p>
          <div className="pt-2 flex flex-wrap items-center gap-3">
            <Link to="/explore">
              <Button variant="primary" size="md">
                Explore Listings
              </Button>
            </Link>
            <Link to="/register">
              <Button variant="secondary" size="md">
                Create Account
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;