import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import RoomCard from "../components/rooms/RoomCard";
import { Search, SlidersHorizontal, RotateCcw, Building2 } from "lucide-react";
import API from "../services/api";

const ExploreRooms = () => {
  const [rooms, setRooms] = useState([]);
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
        const { data } = await API.get('/rooms');
        setRooms(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Error fetching rooms:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRooms();
  }, []);

  // Filter rooms dynamically based on active filter criteria
  const filteredRooms = useMemo(() => {
    return rooms.filter((room) => {
      // 0. Only show unbooked / available rooms to renters
      if (room.isBooked) {
        return false;
      }

      // 1. Location & Keyword Search
      if (filters.location.trim()) {
        const query = filters.location.trim().toLowerCase();
        const matchesLocation = room.location?.toLowerCase().includes(query);
        const matchesTitle = room.title?.toLowerCase().includes(query);
        const matchesDesc = room.description?.toLowerCase().includes(query);
        if (!matchesLocation && !matchesTitle && !matchesDesc) {
          return false;
        }
      }

      // 2. BHK Arrangement Filter
      if (filters.bhkType) {
        const roomBhk = room.bhkType || room.type;
        if (roomBhk !== filters.bhkType) {
          return false;
        }
      }

      // 3. Min Monthly Rent Filter
      if (filters.minRent !== '') {
        const roomRent = Number(room.rent ?? room.price ?? 0);
        const min = Number(filters.minRent);
        if (!isNaN(min) && roomRent < min) {
          return false;
        }
      }

      // 4. Max Monthly Rent Filter
      if (filters.maxRent !== '') {
        const roomRent = Number(room.rent ?? room.price ?? 0);
        const max = Number(filters.maxRent);
        if (!isNaN(max) && roomRent > max) {
          return false;
        }
      }

      return true;
    });
  }, [rooms, filters]);

  const isFilterActive = Boolean(
    filters.location.trim() ||
    filters.bhkType ||
    filters.minRent !== '' ||
    filters.maxRent !== ''
  );

  const handleFilterChange = (filterName, value) => {
    setFilters((prev) => ({
      ...prev,
      [filterName]: value
    }));
  };

  const handleResetFilters = () => {
    setFilters({
      location: '',
      bhkType: '',
      minRent: '',
      maxRent: ''
    });
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-emerald-500" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
            Explore Properties
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
            Browse verified listings for security and transparent rental costs.
          </p>
        </div>

        {isFilterActive && (
          <button
            onClick={handleResetFilters}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200 transition-all duration-200 w-fit active:scale-95 shadow-sm"
          >
            <RotateCcw size={14} className="text-emerald-500" />
            <span>Reset Filters</span>
          </button>
        )}
      </div>

      {/* Filters Panel */}
      <motion.div
        initial={{ y: 15, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="glass-panel p-6 rounded-3xl shadow-sm border border-slate-200/60 dark:border-slate-800/80 mb-8"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2 text-slate-800 dark:text-slate-200 font-bold text-sm">
            <SlidersHorizontal size={16} className="text-emerald-500" />
            <span>Search Filters</span>
          </div>
          {isFilterActive && (
            <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full">
              Filters Active
            </span>
          )}
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Location / Keyword */}
          <div className="space-y-1">
            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Location / Keyword
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400 pointer-events-none">
                <Search size={16} />
              </span>
              <input
                type="text"
                placeholder="City, area or title..."
                value={filters.location}
                onChange={(e) => handleFilterChange('location', e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-slate-800 dark:text-white placeholder-slate-400 text-sm transition-all duration-200"
              />
            </div>
          </div>
          
          {/* BHK Arrangement */}
          <div className="space-y-1">
            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              BHK Arrangement
            </label>
            <select
              value={filters.bhkType}
              onChange={(e) => handleFilterChange('bhkType', e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-slate-800 dark:text-white text-sm cursor-pointer transition-all duration-200"
            >
              <option value="" className="text-slate-900 dark:text-slate-100 bg-white dark:bg-slate-900">All Arrangements</option>
              <option value="1BHK" className="text-slate-900 dark:text-slate-100 bg-white dark:bg-slate-900">1 BHK</option>
              <option value="2BHK" className="text-slate-900 dark:text-slate-100 bg-white dark:bg-slate-900">2 BHK</option>
              <option value="3BHK" className="text-slate-900 dark:text-slate-100 bg-white dark:bg-slate-900">3 BHK</option>
            </select>
          </div>
          
          {/* Min Rent */}
          <div className="space-y-1">
            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Min Monthly Rent (₹)
            </label>
            <input
              type="number"
              min="0"
              placeholder="0"
              value={filters.minRent}
              onChange={(e) => handleFilterChange('minRent', e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-slate-800 dark:text-white placeholder-slate-400 text-sm transition-all duration-200"
            />
          </div>
          
          {/* Max Rent */}
          <div className="space-y-1">
            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Max Monthly Rent (₹)
            </label>
            <input
              type="number"
              min="0"
              placeholder="No limit"
              value={filters.maxRent}
              onChange={(e) => handleFilterChange('maxRent', e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-slate-800 dark:text-white placeholder-slate-400 text-sm transition-all duration-200"
            />
          </div>
        </div>
      </motion.div>

      {/* Results Count Info */}
      <div className="flex items-center justify-between mb-6 px-2 text-slate-500 dark:text-slate-400 text-sm font-medium">
        <span>
          Showing {filteredRooms.length} {filteredRooms.length === 1 ? 'room' : 'rooms'} {isFilterActive ? `(filtered from ${rooms.length})` : ''}
        </span>
      </div>

      {/* Rooms Listing Grid */}
      {filteredRooms.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredRooms.map((room) => (
            <RoomCard key={room._id} room={room} />
          ))}
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-16 glass-panel rounded-3xl border border-slate-200/50 dark:border-slate-800/50"
        >
          <Building2 size={40} className="text-slate-300 dark:text-slate-700 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200">
            No Listings Found
          </h3>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-2 max-w-sm mx-auto">
            We couldn't find any rooms matching your specifications. Try loosening your filter criteria or resetting filters.
          </p>
          {isFilterActive && (
            <button
              onClick={handleResetFilters}
              className="mt-6 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-semibold rounded-xl transition-colors shadow-sm"
            >
              Reset Filters
            </button>
          )}
        </motion.div>
      )}
    </div>
  );
};

export default ExploreRooms;