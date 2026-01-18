import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import RoomCard from "../components/rooms/RoomCard";
import RoomFilter from "../components/rooms/RoomFilter";

const ExploreRooms = () => {
  const [rooms, setRooms] = useState([]);
  const [filteredRooms, setFilteredRooms] = useState([]);
  const [filters, setFilters] = useState({
    location: '',
    bhkType: '',
    minRent: '',
    maxRent: ''
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const response = await fetch('http://localhost:5001/api/rooms');

        if (response.ok) {
          const data = await response.json();
          // Show only the first room initially
          const initialRooms = data.length > 0 ? [data[0]] : [];
          setRooms(data);
          setFilteredRooms(initialRooms); // Only show the first room initially
        } else {
          console.error('Failed to fetch rooms');
        }
      } catch (error) {
        console.error('Error fetching rooms:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRooms();
  }, []);

  // Apply filters whenever rooms or filters change
  useEffect(() => {
    let result = [...rooms];
    
    if (filters.location) {
      result = result.filter(room => 
        room.location.toLowerCase().includes(filters.location.toLowerCase()) ||
        room.title.toLowerCase().includes(filters.location.toLowerCase())
      );
    }
    
    if (filters.bhkType) {
      result = result.filter(room => room.bhkType === filters.bhkType);
    }
    
    if (filters.minRent) {
      result = result.filter(room => room.rent >= parseInt(filters.minRent));
    }
    
    if (filters.maxRent) {
      result = result.filter(room => room.rent <= parseInt(filters.maxRent));
    }
    
    // Show only the first room if no filters are active
    if (!filters.location && !filters.bhkType && !filters.minRent && !filters.maxRent) {
      setFilteredRooms(result.length > 0 ? [result[0]] : []);
    } else {
      setFilteredRooms(result);
    }
  }, [filters, rooms]);

  const handleFilterChange = (filterName, value) => {
    setFilters(prev => ({
      ...prev,
      [filterName]: value
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-400">
        Loading rooms...
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="min-h-screen bg-gray-100 dark:bg-gray-950
                 text-gray-900 dark:text-gray-100 py-8"
    >
      <div className="container mx-auto px-4">
        <motion.h1
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="text-3xl font-bold text-center text-green-500 mb-8"
        >
          Explore Rooms
        </motion.h1>

        {/* Filters Section */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-gray-900 rounded-xl shadow p-6 mb-8"
        >
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Location / Title
              </label>
              <input
                type="text"
                placeholder="Search location or title..."
                value={filters.location}
                onChange={(e) => handleFilterChange('location', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-800 dark:text-white"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                BHK Type
              </label>
              <select
                value={filters.bhkType}
                onChange={(e) => handleFilterChange('bhkType', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-800 dark:text-white"
              >
                <option value="">All Types</option>
                <option value="1BHK">1BHK</option>
                <option value="2BHK">2BHK</option>
                <option value="3BHK">3BHK</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Min Rent (₹)
              </label>
              <input
                type="number"
                placeholder="Min"
                value={filters.minRent}
                onChange={(e) => handleFilterChange('minRent', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-800 dark:text-white"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Max Rent (₹)
              </label>
              <input
                type="number"
                placeholder="Max"
                value={filters.maxRent}
                onChange={(e) => handleFilterChange('maxRent', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-800 dark:text-white"
              />
            </div>
          </div>
        </motion.div>

        {/* Results Count */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mb-6 text-gray-600 dark:text-gray-400"
        >
          Showing {filteredRooms.length} {filteredRooms.length === 1 ? 'room' : 'rooms'}
        </motion.div>

        {/* Rooms Grid */}
        {filteredRooms.length > 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filteredRooms.map((room, index) => (
              <motion.div
                key={room._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
                whileHover={{ y: -5 }}
              >
                <RoomCard room={room} />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-center py-12"
          >
            <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300">
              No rooms found
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mt-2">
              Try adjusting your search filters
            </p>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default ExploreRooms;