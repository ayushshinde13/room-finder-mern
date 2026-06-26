import { motion } from "framer-motion";

const About = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="min-h-screen bg-gray-100 dark:bg-gray-950
                 text-gray-900 dark:text-gray-100"
    >
      {/* ================= HERO ================= */}
      <section className="container mx-auto px-6 py-16">
        <motion.h1
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="text-4xl md:text-5xl font-extrabold mb-6"
        >
          About RoomFinder
        </motion.h1>

        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="max-w-3xl text-lg text-gray-600 dark:text-gray-400"
        >
          <span className="font-semibold text-green-500">
            Simplifying room rentals through trust, transparency, and technology.
          </span>
          <br />
          <br />
          RoomFinder is a modern rental platform designed to eliminate brokers,
          reduce fraud, and connect tenants directly with verified property owners.
          We focus on providing a seamless, secure, and user-friendly experience
          for students, working professionals, and families.
        </motion.p>
      </section>

      {/* ================= MISSION / VISION ================= */}
      <section className="container mx-auto px-6 py-10
                          grid grid-cols-1 md:grid-cols-2 gap-8">
        {[
          {
            title: "Our Mission",
            desc:
              "To make room and apartment rentals transparent, affordable, and accessible for everyone — without middlemen or hidden charges.",
          },
          {
            title: "Our Vision",
            desc:
              "To become India’s most trusted digital rental platform by empowering owners and renters with technology-driven solutions.",
          },
        ].map((item, i) => (
          <motion.div
            key={i}
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.2 }}
            className="bg-white dark:bg-gray-900
                       p-6 rounded-xl shadow"
          >
            <h3 className="text-2xl font-bold mb-3 text-green-500">
              {item.title}
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              {item.desc}
            </p>
          </motion.div>
        ))}
      </section>

      {/* ================= CONTACT SECTION ================= */}
      <section className="container mx-auto px-6 py-16">
        <motion.h2
          initial={{ y: 30, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="text-3xl font-bold mb-6"
        >
          Contact Us
        </motion.h2>

        <motion.p
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="max-w-2xl text-gray-600 dark:text-gray-400 mb-8"
        >
          Whether you are a property owner looking to list your space
          or a renter searching for the perfect home, our team is here
          to help you every step of the way.
        </motion.p>

        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="bg-white dark:bg-gray-900
                     p-6 rounded-xl shadow max-w-md"
        >
          <p className="mb-2">
            📧 <span className="font-semibold">Email:</span>{" "}
            support@roomfinder.com
          </p>
          <p className="mb-2">
            📞 <span className="font-semibold">Phone:</span>{" "}
            +91 98765 XXXXX
          </p>
          <p>
            📍 <span className="font-semibold">Location:</span>{" "}
            India
          </p>
        </motion.div>
      </section>
    </motion.div>
  );
};

export default About;
