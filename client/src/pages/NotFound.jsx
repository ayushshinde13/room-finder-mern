import { Link } from "react-router-dom";
import { Compass, Home, ArrowLeft } from "lucide-react";

const NotFound = () => {
  return (
    <div className="min-h-[75vh] flex flex-col items-center justify-center text-center px-4 py-16">
      <div className="relative mb-6">
        <div className="w-24 h-24 rounded-3xl bg-emerald-500/10 dark:bg-emerald-500/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400 mx-auto shadow-inner">
          <Compass size={48} className="animate-pulse" />
        </div>
      </div>
      
      <h1 className="text-6xl font-black text-slate-900 dark:text-white tracking-tight mb-2">
        404
      </h1>
      <h2 className="text-xl font-bold text-slate-800 dark:text-slate-200 mb-2">
        Page Not Found
      </h2>
      <p className="text-slate-500 dark:text-slate-400 text-sm max-w-md mx-auto mb-8">
        Oops! The page you are looking for might have been moved, deleted, or does not exist.
      </p>

      <div className="flex flex-wrap items-center justify-center gap-3">
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm transition-all shadow-md hover:shadow-emerald-500/20 active:scale-95"
        >
          <Home size={16} />
          <span>Back to Home</span>
        </Link>
        <Link
          to="/explore"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold text-sm transition-all border border-slate-200/50 dark:border-slate-700/50 active:scale-95"
        >
          <Compass size={16} />
          <span>Explore Rooms</span>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
