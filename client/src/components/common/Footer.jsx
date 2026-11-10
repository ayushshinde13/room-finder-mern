import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="w-full bg-[#F5F8FA] dark:bg-[#0B1220] border-t border-[#E3E8EE] dark:border-[#1F2A3D] text-[#5B6B7F] dark:text-[#94A3B8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand & Description */}
          <div className="md:col-span-2 space-y-3">
            <span className="text-lg font-bold text-[#0F1B2D] dark:text-[#F1F5F9]">
              RoomFinder
            </span>
            <p className="text-sm leading-relaxed max-w-md">
              A transparent rental marketplace connecting tenants directly with verified
              property owners. No brokers, no hidden commissions, and digital rental agreements.
            </p>
          </div>

          {/* Navigation Links */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[#0F1B2D] dark:text-[#F1F5F9]">
              Platform
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/explore" className="hover:text-[#0F1B2D] dark:hover:text-[#F1F5F9] transition-colors">
                  Explore Rooms
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-[#0F1B2D] dark:hover:text-[#F1F5F9] transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/register" className="hover:text-[#0F1B2D] dark:hover:text-[#F1F5F9] transition-colors">
                  List Your Property
                </Link>
              </li>
            </ul>
          </div>

          {/* Trust & Transparency */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[#0F1B2D] dark:text-[#F1F5F9]">
              Transparency
            </h4>
            <ul className="space-y-2 text-sm">
              <li className="text-xs">
                Zero Brokerage Guarantee
              </li>
              <li className="text-xs">
                Direct Landlord Contact
              </li>
              <li className="text-xs">
                Digital Payment Receipts
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-[#E3E8EE] dark:border-[#1F2A3D] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <p>© {new Date().getFullYear()} RoomFinder. All rights reserved.</p>
          <p className="text-[#5B6B7F] dark:text-[#94A3B8]">Verified Real-Estate Network</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
