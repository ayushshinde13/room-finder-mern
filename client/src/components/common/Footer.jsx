import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const Footer = () => {
  const [animate, setAnimate] = useState(false);

  // Start subtle blink after 2 minutes
  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimate(true);
    }, 120000); // 2 minutes

    return () => clearTimeout(timer);
  }, []);

  return (
    <footer
      className="bg-gray-100 dark:bg-gray-950
                 border-t border-gray-200 dark:border-gray-800
                 py-6 px-6 text-center"
    >
      {/* Industry Description */}
      <motion.p
        animate={
          animate
            ? { opacity: [1, 0.65, 1] }
            : { opacity: 1 }
        }
        transition={
          animate
            ? {
                duration: 0.5,
                repeat: Infinity,
                ease: "easeInOut",
              }
            : {}
        }
        className="text-sm text-gray-600 dark:text-gray-400
                   max-w-3xl mx-auto"
      >
        RoomFinder is a modern housing platform built to connect renters
        directly with verified property owners. We eliminate brokers,
        hidden fees, and delays by offering transparent listings and
        secure communication — making room discovery simple and reliable.
      </motion.p>

      {/* Copyright */}
      <p className="text-xs mt-3 text-gray-500 dark:text-gray-500">
        © {new Date().getFullYear()} RoomFinder. All rights reserved.
      </p>
    </footer>
  );
};

export default Footer;
