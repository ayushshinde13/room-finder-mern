import React from "react";
import { Search } from "lucide-react";

const RoomFilter = ({ setType, setQuery }) => {
  return (
    <div className="flex flex-col sm:flex-row gap-3 mb-6 text-left">
      <div className="relative flex-1">
        <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#5B6B7F] dark:text-[#94A3B8]">
          <Search size={15} strokeWidth={1.75} />
        </span>
        <input
          type="text"
          placeholder="Search rooms by title or location..."
          className="w-full h-10 pl-9 pr-3 text-xs bg-white dark:bg-[#111A2B] border border-[#E3E8EE] dark:border-[#1F2A3D] rounded-lg text-[#0F1B2D] dark:text-[#F1F5F9] placeholder-[#5B6B7F]/60 dark:placeholder-[#94A3B8]/60 focus:outline-none focus:ring-2 focus:ring-[#1D4ED8]/20 focus:border-[#1D4ED8] transition-colors"
          onChange={(e) => setQuery(e.target.value.toLowerCase())}
        />
      </div>

      <select
        onChange={(e) => setType(e.target.value)}
        className="h-10 px-3 text-xs bg-white dark:bg-[#111A2B] border border-[#E3E8EE] dark:border-[#1F2A3D] rounded-lg text-[#0F1B2D] dark:text-[#F1F5F9] focus:outline-none focus:ring-2 focus:ring-[#1D4ED8]/20 focus:border-[#1D4ED8] transition-colors cursor-pointer w-full sm:w-44"
      >
        <option value="">All Unit Types</option>
        <option value="1BHK">1 BHK</option>
        <option value="2BHK">2 BHK</option>
        <option value="3BHK">3 BHK</option>
      </select>
    </div>
  );
};

export default RoomFilter;
