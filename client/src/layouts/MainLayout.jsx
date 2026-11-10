import React from "react";
import Navbar from "../components/common/Navbar";
import Footer from "../components/common/Footer";

const MainLayout = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-[#0B1220] text-[#0F1B2D] dark:text-[#F1F5F9] transition-colors duration-150">
      <Navbar />
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;
