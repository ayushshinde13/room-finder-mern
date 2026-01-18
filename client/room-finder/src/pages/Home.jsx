import { motion } from "framer-motion";
import useAuth from "../hooks/useAuth";

const Home = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-400">
        Loading...
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="min-h-screen bg-gray-100 dark:bg-gray-950
                 text-gray-900 dark:text-gray-100"
    >
      {/* ================= HERO SECTION ================= */}
      <section className="container mx-auto px-6 py-16">
        <motion.h1
          initial={{ y: 40, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-4xl md:text-5xl font-extrabold leading-tight mb-6"
        >
          Find Verified Rooms & Apartments
          <span className="block text-green-500 mt-2">
            Without Brokers or Hidden Fees
          </span>
        </motion.h1>

        <motion.p
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="max-w-2xl text-lg text-gray-600 dark:text-gray-400"
        >
          RoomFinder connects tenants directly with property owners.
          Browse verified listings, transparent pricing, and
          secure accommodations across top cities.
        </motion.p>

        {!user && (
          <motion.div 
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="mt-10 flex gap-4"
          >
            <a 
              href="/login" 
              className="px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors"
            >
              Login
            </a>
            <a 
              href="/register" 
              className="px-6 py-3 bg-gray-800 text-white rounded-lg font-semibold hover:bg-gray-900 transition-colors dark:bg-gray-700 dark:hover:bg-gray-600"
            >
              Register
            </a>
          </motion.div>
        )}
        
        {user && (
          <motion.div 
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="mt-10 text-center"
          >
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-4">
              Welcome Back, {user.name}!
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">
              Navigate to your dashboard to manage your account
            </p>
            <a 
              href={user.role === 'RENTER' ? '/explore' : '/my-rooms'} 
              className="inline-block px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors"
            >
              {user.role === 'RENTER' ? 'Explore Rooms' : 'Manage My Rooms'}
            </a>
          </motion.div>
        )}
      </section>

      {/* ================= TRUST INDICATORS ================= */}
      <section
        className="container mx-auto px-6 py-10
                   grid grid-cols-1 md:grid-cols-3 gap-8"
      >
        {[
          {
            title: "Verified Listings",
            desc: "All rooms are verified to ensure authenticity and safety.",
          },
          {
            title: "Direct Owner Contact",
            desc: "No brokers. No middlemen. Talk directly to owners.",
          },
          {
            title: "Transparent Pricing",
            desc: "No hidden charges. What you see is what you pay.",
          },
        ].map((item, i) => (
          <motion.div
            key={i}
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.15 }}
            className="bg-white dark:bg-gray-900
                       p-6 rounded-xl shadow"
          >
            <h3 className="text-xl font-bold mb-2 text-green-500">
              {item.title}
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              {item.desc}
            </p>
          </motion.div>
        ))}
      </section>
    </motion.div>
  );
};

export default Home;