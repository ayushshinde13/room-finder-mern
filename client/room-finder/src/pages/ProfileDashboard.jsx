import { motion } from "framer-motion";

const ProfileDashboard = () => {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-950 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-12">
          <motion.h1 
            className="text-3xl font-bold text-gray-900 dark:text-white mb-4"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            John Doe
          </motion.h1>
          <div className="w-24 h-1 bg-green-500 mx-auto rounded-full"></div>
        </div>

        {/* Owner Dashboard */}
        <motion.div 
          className="mb-16"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <h2 className="text-2xl font-bold text-center text-green-500 mb-10">Owner Dashboard</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {/* Add Room Card */}
            <motion.div
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              className="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-800 cursor-pointer"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <div className="text-center h-full flex flex-col items-center justify-center">
                <h3 className="text-xl font-bold text-green-500 mb-2">Add Room</h3>
                <p className="text-gray-600 dark:text-gray-400">Add new room</p>
              </div>
            </motion.div>

            {/* My Rooms Card */}
            <motion.div
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              className="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-800 cursor-pointer"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <div className="text-center h-full flex flex-col items-center justify-center">
                <h3 className="text-xl font-bold text-green-500 mb-2">My Rooms</h3>
                <p className="text-gray-600 dark:text-gray-400">Your listed rooms</p>
              </div>
            </motion.div>

            {/* Booking Requests Card */}
            <motion.div
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              className="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-800 cursor-pointer"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <div className="text-center h-full flex flex-col items-center justify-center">
                <h3 className="text-xl font-bold text-green-500 mb-2">Booking Requests</h3>
                <p className="text-gray-600 dark:text-gray-400">Approve or reject bookings</p>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Renter Dashboard */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
        >
          <h2 className="text-2xl font-bold text-center text-green-500 mb-10">Renter Dashboard</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {/* Explore Rooms Card */}
            <motion.div
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              className="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-800 cursor-pointer"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
            >
              <div className="text-center h-full flex flex-col items-center justify-center">
                <h3 className="text-xl font-bold text-green-500 mb-2">Explore Rooms</h3>
                <p className="text-gray-600 dark:text-gray-400">Find available rooms</p>
              </div>
            </motion.div>

            {/* My Bookings Card */}
            <motion.div
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              className="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-800 cursor-pointer"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
            >
              <div className="text-center h-full flex flex-col items-center justify-center">
                <h3 className="text-xl font-bold text-green-500 mb-2">My Bookings</h3>
                <p className="text-gray-600 dark:text-gray-400">Rooms you booked</p>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ProfileDashboard;