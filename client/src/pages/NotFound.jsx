import { Link } from "react-router-dom";
import { Compass, Home } from "lucide-react";

const NotFound = () => {
  return (
    <div className="min-h-[75vh] flex flex-col items-center justify-center text-center px-4 py-16">
      <div className="w-16 h-16 rounded-xl bg-[#F5F8FA] dark:bg-[#111A2B] border border-[#E3E8EE] dark:border-[#1F2A3D] flex items-center justify-center text-[#1D4ED8] mx-auto mb-6">
        <Compass size={32} />
      </div>
      
      <h1 className="text-5xl font-bold text-[#0F1B2D] dark:text-[#F1F5F9] tracking-tight mb-2">
        404
      </h1>
      <h2 className="text-lg font-semibold text-[#0F1B2D] dark:text-[#F1F5F9] mb-2">
        Page Not Found
      </h2>
      <p className="text-[#5B6B7F] dark:text-[#94A3B8] text-sm max-w-md mx-auto mb-8">
        The page you are looking for might have been moved, deleted, or does not exist.
      </p>

      <div className="flex flex-wrap items-center justify-center gap-3">
        <Link
          to="/"
          className="inline-flex items-center gap-2 h-11 px-5 rounded-lg bg-[#1D4ED8] hover:bg-[#1E40AF] text-white font-medium text-sm transition-colors"
        >
          <Home size={16} />
          <span>Back to Home</span>
        </Link>
        <Link
          to="/explore"
          className="inline-flex items-center gap-2 h-11 px-5 rounded-lg bg-white dark:bg-[#111A2B] hover:bg-[#F5F8FA] dark:hover:bg-[#1F2A3D] text-[#0F1B2D] dark:text-[#F1F5F9] font-medium text-sm transition-colors border border-[#E3E8EE] dark:border-[#1F2A3D]"
        >
          <Compass size={16} />
          <span>Explore Rooms</span>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
