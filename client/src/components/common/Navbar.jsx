import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import DarkToggle from "./DarkToggle";
import { 
  Home as HomeIcon, 
  Info, 
  PlusCircle, 
  List, 
  Bell, 
  Compass, 
  Calendar, 
  LogOut, 
  LogIn, 
  UserPlus, 
  Menu, 
  X,
  User as UserIcon
} from "lucide-react";

const Navbar = () => {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    setOpen(false);
    navigate("/login");
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-white dark:bg-[#0B1220] border-b border-[#E3E8EE] dark:border-[#1F2A3D]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Left: Mobile Toggle & Logo */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            className="md:hidden p-2 rounded-lg text-[#5B6B7F] hover:text-[#0F1B2D] dark:text-[#94A3B8] dark:hover:text-[#F1F5F9] hover:bg-[#F5F8FA] dark:hover:bg-[#111A2B] transition-colors"
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
          >
            {open ? <X size={20} strokeWidth={1.75} /> : <Menu size={20} strokeWidth={1.75} />}
          </button>

          <Link to="/" className="flex items-center gap-2">
            <span className="text-xl font-bold tracking-tight text-[#0F1B2D] dark:text-[#F1F5F9]">
              RoomFinder
            </span>
          </Link>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1">
          <NavLinks user={user} onLogout={handleLogout} pathname={location.pathname} />
        </nav>

        {/* Right: Actions & Dark Toggle */}
        <div className="flex items-center gap-2.5">
          <DarkToggle />

          {user ? (
            <Link
              to="/profile"
              className="flex items-center gap-2.5 pl-2 pr-3 py-1.5 rounded-lg hover:bg-[#F5F8FA] dark:hover:bg-[#111A2B] transition-colors text-left"
            >
              <img
                src={user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || "User")}&background=1D4ED8&color=fff&bold=true`}
                alt={user.name}
                className="w-8 h-8 rounded-full object-cover border border-[#E3E8EE] dark:border-[#1F2A3D]"
              />
              <div className="hidden lg:block">
                <span className="text-xs font-semibold text-[#0F1B2D] dark:text-[#F1F5F9] block leading-tight">
                  {user.name}
                </span>
                <span className="text-[11px] text-[#5B6B7F] dark:text-[#94A3B8] capitalize block leading-tight">
                  {user.role?.toLowerCase()}
                </span>
              </div>
            </Link>
          ) : (
            <div className="hidden sm:flex items-center gap-2">
              <Link
                to="/login"
                className="h-9 px-3.5 text-xs font-medium text-[#0F1B2D] dark:text-[#F1F5F9] border border-[#E3E8EE] dark:border-[#1F2A3D] rounded-lg hover:bg-[#F5F8FA] dark:hover:bg-[#111A2B] transition-colors inline-flex items-center justify-center"
              >
                Sign in
              </Link>
              <Link
                to="/register"
                className="h-9 px-3.5 text-xs font-medium text-white bg-[#1D4ED8] hover:bg-[#1E40AF] dark:bg-[#3B82F6] dark:hover:bg-[#2563EB] rounded-lg transition-colors inline-flex items-center justify-center"
              >
                Get Started
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Menu Panel */}
      {open && (
        <div className="md:hidden border-t border-[#E3E8EE] dark:border-[#1F2A3D] bg-white dark:bg-[#0B1220] px-4 py-4 space-y-2">
          <NavLinks
            user={user}
            onLogout={handleLogout}
            closeMenu={() => setOpen(false)}
            pathname={location.pathname}
            isMobile
          />

          {!user && (
            <div className="grid grid-cols-2 gap-2 pt-3 border-t border-[#E3E8EE] dark:border-[#1F2A3D]">
              <Link
                to="/login"
                onClick={() => setOpen(false)}
                className="h-10 text-xs font-medium text-center flex items-center justify-center border border-[#E3E8EE] dark:border-[#1F2A3D] rounded-lg text-[#0F1B2D] dark:text-[#F1F5F9]"
              >
                Sign in
              </Link>
              <Link
                to="/register"
                onClick={() => setOpen(false)}
                className="h-10 text-xs font-medium text-center flex items-center justify-center bg-[#1D4ED8] text-white rounded-lg"
              >
                Get Started
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
};

/* -------------------------------- */

const NavLinks = ({ user, onLogout, closeMenu, pathname, isMobile }) => {
  const getItemClass = (path) => {
    const isActive = pathname === path;
    if (isMobile) {
      return `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
        isActive
          ? "bg-[#F5F8FA] dark:bg-[#111A2B] text-[#1D4ED8] dark:text-[#3B82F6]"
          : "text-[#5B6B7F] dark:text-[#94A3B8] hover:bg-[#F5F8FA] dark:hover:bg-[#111A2B] hover:text-[#0F1B2D] dark:hover:text-[#F1F5F9]"
      }`;
    }
    return `inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
      isActive
        ? "bg-[#F5F8FA] dark:bg-[#111A2B] text-[#1D4ED8] dark:text-[#3B82F6]"
        : "text-[#5B6B7F] dark:text-[#94A3B8] hover:bg-[#F5F8FA] dark:hover:bg-[#111A2B] hover:text-[#0F1B2D] dark:hover:text-[#F1F5F9]"
    }`;
  };

  return (
    <>
      <Link to="/" onClick={closeMenu} className={getItemClass("/")}>
        <HomeIcon size={16} strokeWidth={1.75} />
        <span>Home</span>
      </Link>

      <Link to="/about" onClick={closeMenu} className={getItemClass("/about")}>
        <Info size={16} strokeWidth={1.75} />
        <span>About</span>
      </Link>

      {user && user.role === "RENTER" && (
        <>
          <Link to="/explore" onClick={closeMenu} className={getItemClass("/explore")}>
            <Compass size={16} strokeWidth={1.75} />
            <span>Explore Rooms</span>
          </Link>
          <Link to="/my-bookings" onClick={closeMenu} className={getItemClass("/my-bookings")}>
            <Calendar size={16} strokeWidth={1.75} />
            <span>My Bookings</span>
          </Link>
        </>
      )}

      {user && user.role === "OWNER" && (
        <>
          <Link to="/add-room" onClick={closeMenu} className={getItemClass("/add-room")}>
            <PlusCircle size={16} strokeWidth={1.75} />
            <span>Add Property</span>
          </Link>
          <Link to="/my-rooms" onClick={closeMenu} className={getItemClass("/my-rooms")}>
            <List size={16} strokeWidth={1.75} />
            <span>My Properties</span>
          </Link>
          <Link to="/booking-requests" onClick={closeMenu} className={getItemClass("/booking-requests")}>
            <Bell size={16} strokeWidth={1.75} />
            <span>Requests</span>
          </Link>
        </>
      )}

      {user && (
        <Link to="/profile" onClick={closeMenu} className={getItemClass("/profile")}>
          <UserIcon size={16} strokeWidth={1.75} />
          <span>Account & Wallet</span>
        </Link>
      )}

      {user && (
        <button
          type="button"
          onClick={() => {
            onLogout();
            closeMenu && closeMenu();
          }}
          className={
            isMobile
              ? "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-[#B91C1C] hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors text-left cursor-pointer"
              : "inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium text-[#B91C1C] hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors cursor-pointer"
          }
        >
          <LogOut size={16} strokeWidth={1.75} />
          <span>Sign out</span>
        </button>
      )}
    </>
  );
};

export default Navbar;