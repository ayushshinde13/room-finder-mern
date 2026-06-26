import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import useAuth from "../../hooks/useAuth";
import DarkToggle from "./DarkToggle";
import { motion, AnimatePresence } from "framer-motion";
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
  User as UserIcon,
  Sparkles
} from "lucide-react";

const Navbar = () => {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <motion.nav
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="sticky top-0 z-50 w-full glass-panel border-b border-slate-200/50 dark:border-slate-800/50 px-6 py-4 shadow-sm"
    >
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Logo and Mobile Menu Toggle */}
        <div className="flex items-center gap-4">
          <button
            className="md:hidden p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            onClick={() => setOpen(!open)}
            aria-label="Toggle Menu"
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>

          <Link to="/" className="flex items-center gap-2 group">
            <span className="p-2 bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-500 rounded-xl group-hover:scale-105 transition-transform duration-200">
              <Sparkles size={20} className="fill-emerald-500/20" />
            </span>
            <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent group-hover:text-emerald-500 dark:group-hover:text-emerald-400 transition-colors duration-200">
              Room<span className="text-emerald-500 dark:text-emerald-400">Finder</span>
            </span>
          </Link>
        </div>

        {/* Desktop Menu links */}
        <div className="hidden md:flex items-center gap-6">
          <div className="flex items-center gap-1 bg-slate-100/50 dark:bg-slate-900/50 p-1 rounded-full border border-slate-200/30 dark:border-slate-800/30">
            <NavLinks user={user} onLogout={handleLogout} />
          </div>
          
          <div className="flex items-center gap-4 border-l border-slate-200 dark:border-slate-800 pl-4">
            <DarkToggle />

            {/* Profile Avatar Card */}
            {user && (
              <Link to="/profile" className="flex items-center gap-3 p-1 pr-3 rounded-full hover:bg-slate-100/50 dark:hover:bg-slate-900/50 border border-transparent hover:border-slate-200/40 dark:hover:border-slate-800/40 transition-all duration-200 group">
                <div className="relative">
                  <img
                    key={user.avatar}
                    src={user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'User')}&background=10b981&color=fff`}
                    alt="avatar"
                    className="w-8 h-8 rounded-full border-2 border-emerald-500/80 cursor-pointer object-cover"
                  />
                  <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-emerald-500 border-2 border-white dark:border-slate-950 rounded-full flex items-center justify-center">
                    <span className="w-1.5 h-1.5 bg-white rounded-full animate-ping" />
                  </div>
                </div>
                <div className="flex flex-col text-left">
                  <span className="text-sm font-semibold text-slate-800 dark:text-slate-200 leading-none group-hover:text-emerald-500 transition-colors duration-200">
                    {user.name}
                  </span>
                  <span className="text-[10px] font-medium text-emerald-600 dark:text-emerald-400 capitalize mt-0.5">
                    {user.role.toLowerCase()}
                  </span>
                </div>
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Menu panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden mt-4 bg-white/95 dark:bg-slate-900/95 backdrop-blur-lg rounded-2xl border border-slate-200/50 dark:border-slate-800/50 shadow-xl overflow-hidden"
          >
            <div className="flex flex-col gap-4 p-4">
              <div className="flex flex-col gap-2">
                <NavLinks
                  user={user}
                  onLogout={handleLogout}
                  closeMenu={() => setOpen(false)}
                  isMobile
                />
              </div>
              
              <div className="flex items-center justify-between border-t border-slate-200 dark:border-slate-800 pt-4 px-2">
                <DarkToggle />
                
                {user && (
                  <Link
                    to="/profile"
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-3"
                  >
                    <img
                      key={user.avatar}
                      src={user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'User')}&background=10b981&color=fff`}
                      alt="avatar"
                      className="w-9 h-9 rounded-full border-2 border-emerald-500 object-cover"
                    />
                    <div className="flex flex-col text-left">
                      <span className="text-sm font-bold text-slate-800 dark:text-slate-200">{user.name}</span>
                      <span className="text-xs text-emerald-500 capitalize">{user.role.toLowerCase()}</span>
                    </div>
                  </Link>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

/* -------------------------------- */

const NavLinks = ({ user, onLogout, closeMenu, isMobile }) => {
  const linkClass = isMobile 
    ? "flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-emerald-500/10 hover:text-emerald-500 dark:hover:bg-emerald-500/20 text-slate-700 dark:text-slate-300 font-medium transition-all"
    : "flex items-center gap-1.5 px-4 py-2 rounded-full text-slate-700 dark:text-slate-300 hover:text-emerald-500 dark:hover:text-emerald-400 font-medium text-sm transition-all duration-200";

  return (
    <>
      <Link to="/" onClick={closeMenu} className={linkClass}>
        <HomeIcon size={16} />
        <span>Home</span>
      </Link>
      <Link to="/about" onClick={closeMenu} className={linkClass}>
        <Info size={16} />
        <span>About</span>
      </Link>

      {user ? (
        <>
          {user.role === "OWNER" && (
            <>
              <Link to="/add-room" onClick={closeMenu} className={linkClass}>
                <PlusCircle size={16} />
                <span>Add Room</span>
              </Link>
              <Link to="/my-rooms" onClick={closeMenu} className={linkClass}>
                <List size={16} />
                <span>My Rooms</span>
              </Link>
              <Link to="/booking-requests" onClick={closeMenu} className={linkClass}>
                <Bell size={16} />
                <span>Requests</span>
              </Link>
            </>
          )}

          {user.role === "RENTER" && (
            <>
              <Link to="/explore" onClick={closeMenu} className={linkClass}>
                <Compass size={16} />
                <span>Explore</span>
              </Link>
              <Link to="/my-bookings" onClick={closeMenu} className={linkClass}>
                <Calendar size={16} />
                <span>My Bookings</span>
              </Link>
            </>
          )}

          <button
            onClick={() => {
              onLogout();
              closeMenu && closeMenu();
            }}
            className={isMobile 
              ? "flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-red-500/10 text-red-500 font-medium transition-all text-left w-full"
              : "flex items-center gap-1.5 px-4 py-2 rounded-full text-red-500 hover:bg-red-500/10 hover:text-red-600 font-medium text-sm transition-all duration-200"}
          >
            <LogOut size={16} />
            <span>Logout</span>
          </button>
        </>
      ) : (
        <>
          <Link to="/login" onClick={closeMenu} className={linkClass}>
            <LogIn size={16} />
            <span>Login</span>
          </Link>
          <Link to="/register" onClick={closeMenu} className={linkClass}>
            <UserPlus size={16} />
            <span>Register</span>
          </Link>
        </>
      )}
    </>
  );
};

export default Navbar;