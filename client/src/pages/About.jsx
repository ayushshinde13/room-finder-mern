import React from "react";
import { Mail, Phone, MapPin, ShieldCheck, Users, FileText } from "lucide-react";
import Card from "../components/ui/Card";

const About = () => {
  return (
    <div className="space-y-16 py-4 sm:py-8 max-w-5xl mx-auto text-left">
      {/* Hero Header */}
      <section className="space-y-4">
        <span className="text-xs font-semibold uppercase tracking-wider text-[#1D4ED8] dark:text-[#3B82F6]">
          Our Purpose
        </span>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#0F1B2D] dark:text-[#F1F5F9]">
          Direct, verified room rentals without brokerage.
        </h1>
        <p className="text-base sm:text-lg text-[#5B6B7F] dark:text-[#94A3B8] leading-relaxed max-w-3xl">
          RoomFinder was built to eliminate unnecessary brokerage fees and listing misinformation.
          We connect prospective tenants directly with verified homeowners and property managers,
          providing transparent pricing and official digital payment records.
        </p>
      </section>

      {/* Core Values Grid */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card padding="p-6" className="space-y-3">
          <div className="w-10 h-10 rounded-lg bg-[#F5F8FA] dark:bg-[#162035] border border-[#E3E8EE] dark:border-[#1F2A3D] text-[#1D4ED8] dark:text-[#3B82F6] flex items-center justify-center">
            <ShieldCheck size={20} strokeWidth={1.75} />
          </div>
          <h3 className="text-base font-bold text-[#0F1B2D] dark:text-[#F1F5F9]">
            Verified Listings
          </h3>
          <p className="text-xs text-[#5B6B7F] dark:text-[#94A3B8] leading-relaxed">
            Every property on RoomFinder is vetted for accurate photographic representation,
            room amenities, and landlord legitimacy before appearing in search results.
          </p>
        </Card>

        <Card padding="p-6" className="space-y-3">
          <div className="w-10 h-10 rounded-lg bg-[#F5F8FA] dark:bg-[#162035] border border-[#E3E8EE] dark:border-[#1F2A3D] text-[#0F766E] dark:text-[#14B8A6] flex items-center justify-center">
            <Users size={20} strokeWidth={1.75} />
          </div>
          <h3 className="text-base font-bold text-[#0F1B2D] dark:text-[#F1F5F9]">
            Direct Owner Communication
          </h3>
          <p className="text-xs text-[#5B6B7F] dark:text-[#94A3B8] leading-relaxed">
            Renters communicate directly with owners. No middleman broker can mark up the price
            or require extra service retainers.
          </p>
        </Card>

        <Card padding="p-6" className="space-y-3">
          <div className="w-10 h-10 rounded-lg bg-[#F5F8FA] dark:bg-[#162035] border border-[#E3E8EE] dark:border-[#1F2A3D] text-[#1D4ED8] dark:text-[#3B82F6] flex items-center justify-center">
            <FileText size={20} strokeWidth={1.75} />
          </div>
          <h3 className="text-base font-bold text-[#0F1B2D] dark:text-[#F1F5F9]">
            Clear Legal Terms
          </h3>
          <p className="text-xs text-[#5B6B7F] dark:text-[#94A3B8] leading-relaxed">
            From digital booking confirmations to structured 70/30 vacate settlements,
            both tenants and property owners are protected by transparent platform policies.
          </p>
        </Card>
      </section>

      {/* Support & Contact Section */}
      <section className="space-y-6 pt-4 border-t border-[#E3E8EE] dark:border-[#1F2A3D]">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-[#0F1B2D] dark:text-[#F1F5F9]">
            Contact & Support
          </h2>
          <p className="text-sm text-[#5B6B7F] dark:text-[#94A3B8] mt-1">
            Questions regarding listing verification, bookings, or account access? Reach out directly.
          </p>
        </div>

        <Card padding="p-6" className="max-w-md space-y-3.5">
          <div className="flex items-center gap-3 text-xs text-[#0F1B2D] dark:text-[#F1F5F9]">
            <Mail size={16} strokeWidth={1.75} className="text-[#1D4ED8] dark:text-[#3B82F6] shrink-0" />
            <span>support@roomfinder.com</span>
          </div>
          <div className="flex items-center gap-3 text-xs text-[#0F1B2D] dark:text-[#F1F5F9]">
            <Phone size={16} strokeWidth={1.75} className="text-[#1D4ED8] dark:text-[#3B82F6] shrink-0" />
            <span>+91 98765 43210</span>
          </div>
          <div className="flex items-center gap-3 text-xs text-[#0F1B2D] dark:text-[#F1F5F9]">
            <MapPin size={16} strokeWidth={1.75} className="text-[#1D4ED8] dark:text-[#3B82F6] shrink-0" />
            <span>Bengaluru & Raipur, India</span>
          </div>
        </Card>
      </section>
    </div>
  );
};

export default About;
