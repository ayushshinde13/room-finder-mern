import React, { useState, useEffect, useMemo } from "react";
import { useLocation } from "react-router-dom";
import RoomCard from "../components/rooms/RoomCard";
import { Search, SlidersHorizontal, RotateCcw, Building2 } from "lucide-react";
import API from "../services/api";

const ExploreRooms = () => {
  const routerLocation = useLocation();
  const searchParams = new URLSearchParams(routerLocation.search);

  const [rooms, setRooms] = useState([]);
  const [filters, setFilters] = useState({
    location: searchParams.get("location") || "",
    bhkType: searchParams.get("bhkType") || "",
    minRent: searchParams.get("minRent") || "",
    maxRent: searchParams.get("maxRent") || ""
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const { data } = await API.get("/rooms");
        setRooms(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Error fetching rooms:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRooms();
  }, []);

  // Update filters if URL parameters change
  useEffect(() => {
    const params = new URLSearchParams(routerLocation.search);
    setFilters({
      location: params.get("location") || "",
      bhkType: params.get("bhkType") || "",
      minRent: params.get("minRent") || "",
      maxRent: params.get("maxRent") || ""
    });
  }, [routerLocation.search]);

  // Filter rooms dynamically
  const filteredRooms = useMemo(() => {
    return rooms.filter((room) => {
      if (room.isBooked) return false;

      if (filters.location.trim()) {
        const query = filters.location.trim().toLowerCase();
        const matchesLocation = room.location?.toLowerCase().includes(query);
        const matchesTitle = room.title?.toLowerCase().includes(query);
        const matchesDesc = room.description?.toLowerCase().includes(query);
        if (!matchesLocation && !matchesTitle && !matchesDesc) {
          return false;
        }
      }

      if (filters.bhkType) {
        const roomBhk = room.bhkType || room.type;
        if (roomBhk !== filters.bhkType) {
          return false;
        }
      }

      if (filters.minRent !== "") {
        const roomRent = Number(room.rent ?? room.price ?? 0);
        const min = Number(filters.minRent);
        if (!isNaN(min) && roomRent < min) {
          return false;
        }
      }

      if (filters.maxRent !== "") {
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
    filters.minRent !== "" ||
    filters.maxRent !== ""
  );

  const handleFilterChange = (filterName, value) => {
    setFilters((prev) => ({
      ...prev,
      [filterName]: value
    }));
  };

  const handleResetFilters = () => {
    setFilters({
      location: "",
      bhkType: "",
      minRent: "",
      maxRent: ""
    });
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#1D4ED8] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8 py-4 sm:py-6 text-left">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#0F1B2D] dark:text-[#F1F5F9]">
            Explore Available Rooms
          </h1>
          <p className="text-xs sm:text-sm text-[#5B6B7F] dark:text-[#94A3B8] mt-1">
            Browse verified listings with transparent rental pricing and direct landlord agreements.
          </p>
        </div>

        {isFilterActive && (
          <button
            type="button"
            onClick={handleResetFilters}
            className="h-9 px-3.5 bg-white dark:bg-[#111A2B] border border-[#E3E8EE] dark:border-[#1F2A3D] text-xs font-medium text-[#5B6B7F] dark:text-[#94A3B8] hover:text-[#0F1B2D] dark:hover:text-[#F1F5F9] rounded-lg transition-colors inline-flex items-center gap-1.5 w-fit cursor-pointer"
          >
            <RotateCcw size={13} strokeWidth={1.75} />
            <span>Reset Filters</span>
          </button>
        )}
      </div>

      {/* Filter Bar Card */}
      <div className="bg-white dark:bg-[#111A2B] border border-[#E3E8EE] dark:border-[#1F2A3D] rounded-xl p-4 sm:p-5 shadow-[0_1px_2px_rgba(0,0,0,0.04)] space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#0F1B2D] dark:text-[#F1F5F9]">
            <SlidersHorizontal size={15} strokeWidth={1.75} className="text-[#1D4ED8] dark:text-[#3B82F6]" />
            <span>Search & Filter</span>
          </div>
          {isFilterActive && (
            <span className="text-[11px] font-semibold text-[#1D4ED8] dark:text-[#3B82F6]">
              Filters applied
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {/* Location / Keyword */}
          <div className="space-y-1">
            <label className="block text-[11px] font-semibold text-[#5B6B7F] dark:text-[#94A3B8] uppercase tracking-wider">
              Location or Keyword
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-[#5B6B7F] dark:text-[#94A3B8] pointer-events-none">
                <Search size={15} strokeWidth={1.75} />
              </span>
              <input
                type="text"
                placeholder="City, area or title..."
                value={filters.location}
                onChange={(e) => handleFilterChange("location", e.target.value)}
                className="w-full h-10 pl-9 pr-3 text-xs bg-[#F5F8FA] dark:bg-[#0B1220] border border-[#E3E8EE] dark:border-[#1F2A3D] rounded-lg text-[#0F1B2D] dark:text-[#F1F5F9] placeholder-[#5B6B7F]/60 dark:placeholder-[#94A3B8]/60 focus:outline-none focus:ring-2 focus:ring-[#1D4ED8]/20 focus:border-[#1D4ED8] dark:focus:ring-[#3B82F6]/30 dark:focus:border-[#3B82F6] transition-colors"
              />
            </div>
          </div>

          {/* Unit Type */}
          <div className="space-y-1">
            <label className="block text-[11px] font-semibold text-[#5B6B7F] dark:text-[#94A3B8] uppercase tracking-wider">
              Room Type
            </label>
            <select
              value={filters.bhkType}
              onChange={(e) => handleFilterChange("bhkType", e.target.value)}
              className="w-full h-10 px-3 text-xs bg-[#F5F8FA] dark:bg-[#0B1220] border border-[#E3E8EE] dark:border-[#1F2A3D] rounded-lg text-[#0F1B2D] dark:text-[#F1F5F9] focus:outline-none focus:ring-2 focus:ring-[#1D4ED8]/20 focus:border-[#1D4ED8] dark:focus:ring-[#3B82F6]/30 dark:focus:border-[#3B82F6] transition-colors cursor-pointer"
            >
              <option value="">All Unit Types</option>
              <option value="1BHK">1 BHK</option>
              <option value="2BHK">2 BHK</option>
              <option value="3BHK">3 BHK</option>
            </select>
          </div>

          {/* Min Rent */}
          <div className="space-y-1">
            <label className="block text-[11px] font-semibold text-[#5B6B7F] dark:text-[#94A3B8] uppercase tracking-wider">
              Min Monthly Rent (₹)
            </label>
            <input
              type="number"
              min="0"
              placeholder="0"
              value={filters.minRent}
              onChange={(e) => handleFilterChange("minRent", e.target.value)}
              className="w-full h-10 px-3 text-xs bg-[#F5F8FA] dark:bg-[#0B1220] border border-[#E3E8EE] dark:border-[#1F2A3D] rounded-lg text-[#0F1B2D] dark:text-[#F1F5F9] placeholder-[#5B6B7F]/60 dark:placeholder-[#94A3B8]/60 focus:outline-none focus:ring-2 focus:ring-[#1D4ED8]/20 focus:border-[#1D4ED8] dark:focus:ring-[#3B82F6]/30 dark:focus:border-[#3B82F6] transition-colors"
            />
          </div>

          {/* Max Rent */}
          <div className="space-y-1">
            <label className="block text-[11px] font-semibold text-[#5B6B7F] dark:text-[#94A3B8] uppercase tracking-wider">
              Max Monthly Rent (₹)
            </label>
            <input
              type="number"
              min="0"
              placeholder="No upper limit"
              value={filters.maxRent}
              onChange={(e) => handleFilterChange("maxRent", e.target.value)}
              className="w-full h-10 px-3 text-xs bg-[#F5F8FA] dark:bg-[#0B1220] border border-[#E3E8EE] dark:border-[#1F2A3D] rounded-lg text-[#0F1B2D] dark:text-[#F1F5F9] placeholder-[#5B6B7F]/60 dark:placeholder-[#94A3B8]/60 focus:outline-none focus:ring-2 focus:ring-[#1D4ED8]/20 focus:border-[#1D4ED8] dark:focus:ring-[#3B82F6]/30 dark:focus:border-[#3B82F6] transition-colors"
            />
          </div>
        </div>
      </div>

      {/* Results Count Line */}
      <div className="text-xs font-medium text-[#5B6B7F] dark:text-[#94A3B8]">
        Showing <strong>{filteredRooms.length}</strong> available {filteredRooms.length === 1 ? "room" : "rooms"}
        {isFilterActive ? ` matching criteria` : ""}
      </div>

      {/* Property Cards Grid */}
      {filteredRooms.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRooms.map((room) => (
            <RoomCard key={room._id} room={room} />
          ))}
        </div>
      ) : (
        <div className="p-12 text-center bg-white dark:bg-[#111A2B] border border-[#E3E8EE] dark:border-[#1F2A3D] rounded-xl space-y-3 max-w-lg mx-auto">
          <Building2 size={32} strokeWidth={1.5} className="mx-auto text-[#5B6B7F] dark:text-[#94A3B8]" />
          <h3 className="text-base font-bold text-[#0F1B2D] dark:text-[#F1F5F9]">
            No matching properties found
          </h3>
          <p className="text-xs text-[#5B6B7F] dark:text-[#94A3B8] leading-relaxed">
            Try adjusting your search criteria, clearing the budget ceiling, or resetting all filters.
          </p>
          {isFilterActive && (
            <button
              type="button"
              onClick={handleResetFilters}
              className="mt-2 h-9 px-4 bg-[#1D4ED8] hover:bg-[#1E40AF] text-white text-xs font-medium rounded-lg transition-colors cursor-pointer"
            >
              Reset Filters
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default ExploreRooms;
