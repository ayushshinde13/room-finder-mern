import { motion } from "framer-motion";
import useAuth from "../hooks/useAuth";
import { Link } from "react-router-dom";
import { 
  ShieldCheck, 
  Users, 
  DollarSign, 
  ArrowRight, 
  Search, 
  Building, 
  CheckCircle2,
  Sparkles
} from "lucide-react";

const Home = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-emerald-500" />
      </div>
    );
  }

  return (
    <div className="relative py-12 md:py-20 overflow-hidden">
      {/* ================= HERO SECTION ================= */}
      <section className="max-w-7xl mx-auto px-6 text-center md:text-left grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-24 relative z-10">
        <div className="space-y-6">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-semibold"
          >
            <Sparkles size={14} className="fill-emerald-500/20 animate-pulse" />
            <span>Direct booking, no middlemen</span>
          </motion.div>
          
          <motion.h1
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight tracking-tight text-slate-900 dark:text-white"
          >
            Find Verified Rooms
            <span className="block bg-gradient-to-r from-emerald-500 to-teal-400 bg-clip-text text-transparent mt-2">
              Without Hidden Fees
            </span>
          </motion.h1>

          <motion.p
            initial={{ y: 15, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="max-w-xl text-base sm:text-lg text-slate-600 dark:text-slate-400 leading-relaxed"
          >
            RoomFinder connects tenants directly with property owners. Browse listings with verified photos, transparent rental costs, and secure digital booking contracts.
          </motion.p>

          <motion.div
            initial={{ y: 15, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start"
          >
            {!user ? (
              <>
                <Link
                  to="/login"
                  className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white rounded-xl font-semibold shadow-lg shadow-emerald-500/10 flex items-center justify-center gap-2 transition-all duration-200 text-sm group"
                >
                  Get Started <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  to="/register"
                  className="px-6 py-3 bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-800/80 rounded-xl font-semibold transition-colors text-sm flex items-center justify-center"
                >
                  Create Account
                </Link>
              </>
            ) : (
              <div className="flex flex-col gap-4 text-left bg-white/40 dark:bg-slate-900/40 p-6 rounded-2xl border border-slate-200/30 dark:border-slate-800/30 backdrop-blur-sm max-w-md w-full">
                <div>
                  <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                    <CheckCircle2 size={18} className="text-emerald-500" />
                    Welcome Back, {user.name}!
                  </h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                    Manage your account details and rooms right from your dashboard.
                  </p>
                </div>
                <Link
                  to={user.role === 'RENTER' ? '/explore' : '/my-rooms'}
                  className="px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white rounded-xl font-semibold text-center text-sm shadow-md transition-all duration-200 flex items-center justify-center gap-1.5"
                >
                  {user.role === 'RENTER' ? (
                    <>
                      <Search size={16} /> Explore Listings
                    </>
                  ) : (
                    <>
                      <Building size={16} /> Manage Rooms
                    </>
                  )}
                </Link>
              </div>
            )}
          </motion.div>
        </div>

        {/* Hero Dashboard Preview (Visual representation of SaaS layout) */}
        <motion.div
          initial={{ opacity: 0, x: 50, scale: 0.95 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
          className="hidden lg:block relative"
        >
          <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/20 to-teal-500/20 rounded-3xl blur-3xl opacity-30 -z-10" />
          <div className="glass-panel rounded-3xl p-6 shadow-2xl border border-slate-200/50 dark:border-slate-800/50 relative overflow-hidden">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200/50 dark:border-slate-800/50 mb-6">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 bg-red-400 rounded-full" />
                <span className="w-3 h-3 bg-yellow-400 rounded-full" />
                <span className="w-3 h-3 bg-green-400 rounded-full" />
              </div>
              <span className="text-xs text-slate-400 font-mono">dashboard_preview.tsx</span>
            </div>
            
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="p-4 bg-slate-100/50 dark:bg-slate-900/50 rounded-2xl border border-slate-200/30 dark:border-slate-800/30">
                <span className="text-xs text-slate-500 dark:text-slate-400 block font-medium">Listings</span>
                <span className="text-xl font-bold mt-1 block">432+</span>
              </div>
              <div className="p-4 bg-slate-100/50 dark:bg-slate-900/50 rounded-2xl border border-slate-200/30 dark:border-slate-800/30">
                <span className="text-xs text-slate-500 dark:text-slate-400 block font-medium">Verified</span>
                <span className="text-xl font-bold mt-1 block text-emerald-500">100%</span>
              </div>
              <div className="p-4 bg-slate-100/50 dark:bg-slate-900/50 rounded-2xl border border-slate-200/30 dark:border-slate-800/30">
                <span className="text-xs text-slate-500 dark:text-slate-400 block font-medium">Avg Rent</span>
                <span className="text-xl font-bold mt-1 block">₹8.5k</span>
              </div>
            </div>

            <div className="space-y-3">
              <div className="h-24 bg-slate-100/30 dark:bg-slate-900/30 rounded-2xl border border-slate-200/20 dark:border-slate-800/20 p-3 flex gap-3 items-center">
                <div className="w-20 h-full bg-slate-200 dark:bg-slate-800 rounded-xl animate-pulse" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded-md w-3/4 animate-pulse" />
                  <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded-md w-1/2 animate-pulse" />
                </div>
              </div>
              <div className="h-24 bg-slate-100/30 dark:bg-slate-900/30 rounded-2xl border border-slate-200/20 dark:border-slate-800/20 p-3 flex gap-3 items-center">
                <div className="w-20 h-full bg-slate-200 dark:bg-slate-800 rounded-xl animate-pulse" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded-md w-3/5 animate-pulse" />
                  <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded-md w-1/3 animate-pulse" />
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* ================= STATS COUNTERS ================= */}
      <section className="max-w-7xl mx-auto px-6 mb-24 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 p-8 glass-panel rounded-3xl border border-slate-200/50 dark:border-slate-800/50 text-center">
          <div>
            <span className="text-3xl font-extrabold text-slate-900 dark:text-white">1,200+</span>
            <span className="text-xs text-slate-500 dark:text-slate-400 block mt-1 font-medium">Renters Housed</span>
          </div>
          <div>
            <span className="text-3xl font-extrabold text-slate-900 dark:text-white">450+</span>
            <span className="text-xs text-slate-500 dark:text-slate-400 block mt-1 font-medium">Verified Property Owners</span>
          </div>
          <div>
            <span className="text-3xl font-extrabold text-slate-900 dark:text-white">₹0</span>
            <span className="text-xs text-slate-500 dark:text-slate-400 block mt-1 font-medium">Brokerage/Middlemen Fees</span>
          </div>
          <div>
            <span className="text-3xl font-extrabold text-slate-900 dark:text-white">24/7</span>
            <span className="text-xs text-slate-500 dark:text-slate-400 block mt-1 font-medium">Secure Payment Processing</span>
          </div>
        </div>
      </section>

      {/* ================= FEATURES SECTION ================= */}
      <section className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center max-w-xl mx-auto mb-16">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white">
            Designed for Modern Living
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
            Explore features built to make the booking process transparent, efficient, and simple.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              icon: <ShieldCheck className="w-6 h-6 text-emerald-500" />,
              title: "Verified Listings",
              desc: "Every listed apartment is vetted for visual accuracy and ownership legitimacy before going public.",
            },
            {
              icon: <Users className="w-6 h-6 text-emerald-500" />,
              title: "Direct Owner Contact",
              desc: "Renters negotiate directly with owners, bypassing middle-men to save thousands on setup.",
            },
            {
              icon: <DollarSign className="w-6 h-6 text-emerald-500" />,
              title: "Transparent Pricing",
              desc: "Zero hidden subscription fees, lock-in rates, or additional broker margins. What you view is what you pay.",
            },
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className="glass-panel p-8 rounded-3xl shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-slate-200/50 dark:border-slate-800/50"
            >
              <div className="p-3 bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-500 rounded-2xl w-fit mb-6">
                {item.icon}
              </div>
              <h3 className="text-lg font-bold mb-3 text-slate-900 dark:text-white">
                {item.title}
              </h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
                {item.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;