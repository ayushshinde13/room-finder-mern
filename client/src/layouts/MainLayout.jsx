import Navbar from "../components/common/Navbar";
import Footer from "../components/common/Footer";
import { motion } from "framer-motion";

const MainLayout = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 bg-grid-pattern relative transition-colors duration-300">
      {/* Dynamic ambient background glow */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-emerald-500/5 dark:bg-emerald-500/10 rounded-full blur-[100px] pointer-events-none z-0" />
      <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-teal-500/5 dark:bg-teal-500/5 rounded-full blur-[120px] pointer-events-none z-0" />
      
      <Navbar />

      {/* Animated Page Content */}
      <motion.main
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="flex-1 container mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10"
      >
        {children}
      </motion.main>

      <Footer />
    </div>
  );
};

export default MainLayout;

