import Navbar from "../components/common/Navbar";
import Footer from "../components/common/Footer";
import { motion } from "framer-motion";

const MainLayout = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* Animated Page Content */}
      <motion.main
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="flex-1 container mx-auto px-4 py-6"
      >
        {children}
      </motion.main>

      <Footer />
    </div>
  );
};

export default MainLayout;
