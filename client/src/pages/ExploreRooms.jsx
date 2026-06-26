import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import RoomCard from "../components/rooms/RoomCard";
import { Search, MapPin, SlidersHorizontal, Info } from "lucide-react";

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
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-emerald-500" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
            Explore Properties
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
            Browse premium listings verified for security and zero broker markup.
          </p>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/50 text-xs font-semibold text-slate-500 dark:text-slate-400 w-fit">
          <Info size={14} className="text-emerald-500" />
          <span>Active filter constraints apply</span>
        </div>
      </div>

      {/* Filters Panel */}
      <motion.div
        initial={{ y: 15, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="glass-panel p-6 rounded-3xl shadow-sm border border-slate-200/60 dark:border-slate-800/80 mb-8"
      >
        <div className="flex items-center gap-2 mb-4 text-slate-800 dark:text-slate-200 font-bold text-sm">
          <SlidersHorizontal size={16} className="text-emerald-500" />
          <span>Search Filters</span>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
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
                className="w-full pl-9 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800/30 border border-slate-200 dark:border-slate-800/80 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-slate-800 dark:text-white placeholder-slate-400 text-sm transition-all duration-200"
              />
            </div>
          </div>
          
          <div className="space-y-1">
            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              BHK Arrangement
            </label>
            <select
              value={filters.bhkType}
              onChange={(e) => handleFilterChange('bhkType', e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800/30 border border-slate-200 dark:border-slate-800/80 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-slate-800 dark:text-white text-sm cursor-pointer transition-all duration-200"
            >
              <option value="">All Arrangements</option>
              <option value="1BHK">1 BHK</option>
              <option value="2BHK">2 BHK</option>
              <option value="3BHK">3 BHK</option>
            </select>
          </div>
          
          <div className="space-y-1">
            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Min Monthly Rent (₹)
            </label>
            <input
              type="number"
              placeholder="0"
              value={filters.minRent}
              onChange={(e) => handleFilterChange('minRent', e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800/30 border border-slate-200 dark:border-slate-800/80 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-slate-800 dark:text-white placeholder-slate-400 text-sm transition-all duration-200"
            />
          </div>
          
          <div className="space-y-1">
            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Max Monthly Rent (₹)
            </label>
            <input
              type="number"
              placeholder="No limit"
              value={filters.maxRent}
              onChange={(e) => handleFilterChange('maxRent', e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800/30 border border-slate-200 dark:border-slate-800/80 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-slate-800 dark:text-white placeholder-slate-400 text-sm transition-all duration-200"
            />
          </div>
        </div>
      </motion.div>

      {/* Results Count Info */}
      <div className="flex items-center justify-between mb-6 px-2 text-slate-500 dark:text-slate-400 text-sm font-medium">
        <span>Found {filteredRooms.length} matching {filteredRooms.length === 1 ? 'room' : 'rooms'}</span>
        {!filters.location && !filters.bhkType && !filters.minRent && !filters.maxRent && (
          <span className="text-xs text-amber-600 dark:text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-md font-semibold">Showing initial listing. Adjust filters to search.</span>
        )}
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
          <SlidersHorizontal size={40} className="text-slate-300 dark:text-slate-700 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200">
            No Listings Found
          </h3>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-2 max-w-sm mx-auto">
            We couldn't find any rooms matching your specifications. Try loosening your filter criteria.
          </p>
        </motion.div>
      )}
    </div>
  );
};

export default ExploreRooms;