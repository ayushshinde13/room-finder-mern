import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import useAuth from "../../hooks/useAuth";
import DarkToggle from "./DarkToggle";
import { motion, AnimatePresence } from "framer-motion";

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
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="sticky top-0 z-50
                 bg-white dark:bg-gray-900
                 shadow-md px-6 py-4"
    >
      {/* TOP BAR */}
      <div className="flex justify-between items-center">
        {/* LEFT */}
        <div className="flex items-center gap-4">
          <button
            className="md:hidden text-2xl"
            onClick={() => setOpen(!open)}
          >
            ☰
          </button>

          <motion.div
            whileHover={{ scale: 1.05 }}
            className="flex items-center gap-2"
          >
            <span className="text-2xl">🏠</span>
            <Link
              to="/"
              className="text-xl font-extrabold text-green-500"
            >
              RoomFinder
            </Link>
          </motion.div>
        </div>

        {/* DESKTOP MENU */}
        <div className="hidden md:flex items-center gap-6">
          <NavLinks user={user} onLogout={handleLogout} />
          <DarkToggle />

          {/* PROFILE AVATAR */}
          {user && (
            <Link to="/profile" className="flex items-center gap-2 group">
              <div className="relative">
                <img
                  key={user.avatar} // Adding key to force re-render when avatar changes
                  src={user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'User')}&background=random`}
                  alt="avatar"
                  className="w-10 h-10 rounded-full border-2 border-green-500 cursor-pointer transition-transform duration-200 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black bg-opacity-30 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                  <span className="text-white text-xs font-bold">Change</span>
                </div>
              </div>
              <span className={`text-sm font-medium ${user.role === "RENTER" ? "text-white" : "text-gray-700 dark:text-gray-300"}`}>
                {user.name}
              </span>
            </Link>
          )}
        </div>
      </div>

      {/* MOBILE MENU */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden mt-4
                       bg-white dark:bg-gray-900
                       rounded-xl shadow-lg p-4"
          >
            <div className="flex flex-col gap-4">
              <NavLinks
                user={user}
                onLogout={handleLogout}
                closeMenu={() => setOpen(false)}
              />
              <DarkToggle />

              {user && (
                <Link
                  to="/profile"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-3"
                >
                  <img
                    key={user.avatar} // Adding key to force re-render when avatar changes
                    src={user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'User')}&background=random`}
                    alt="avatar"
                    className="w-10 h-10 rounded-full border border-green-500"
                  />
                  <span className={`${user.role === "RENTER" ? "text-white" : "text-gray-700 dark:text-gray-300"}`}>{user.name}</span>
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

/* -------------------------------- */

const NavLinks = ({ user, onLogout, closeMenu }) => (
  <>
    <NavItem to="/" label="Home" closeMenu={closeMenu} />
    <NavItem to="/about" label="About" closeMenu={closeMenu} />

    {user ? (
      <>
        {user.role === "OWNER" && (
          <>
            <NavItem to="/add-room" label="Add Room" closeMenu={closeMenu} />
            <NavItem to="/my-rooms" label="My Rooms" closeMenu={closeMenu} />
            <NavItem to="/booking-requests" label="Booking Requests" closeMenu={closeMenu} />
          </>
        )}

        {user.role === "RENTER" && (
          <>
            <NavItem to="/explore" label="Explore Rooms" closeMenu={closeMenu} />
            <NavItem to="/my-bookings" label="My Bookings" closeMenu={closeMenu} />
          </>
        )}

        <button
          onClick={() => {
            onLogout();
            closeMenu && closeMenu();
          }}
          className="text-red-500 hover:underline text-left"
        >
          Logout
        </button>
      </>
    ) : (
      <>
        <NavItem to="/login" label="Login" closeMenu={closeMenu} />
        <NavItem to="/register" label="Register" closeMenu={closeMenu} />
      </>
    )}
  </>
);

/* -------------------------------- */

const NavItem = ({ to, label, closeMenu }) => (
  <motion.div whileHover={{ scale: 1.1 }}>
    <Link
      to={to}
      onClick={closeMenu}
      className="hover:text-green-400"
    >
      {label}
    </Link>
  </motion.div>
);

export default Navbar;