import { motion } from "framer-motion";
import RegisterForm from "../components/auth/RegisterForm";

const Register = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="min-h-screen flex items-center justify-center
                 bg-gray-100 dark:bg-gray-950"
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="bg-white dark:bg-gray-900
                   p-8 rounded-xl shadow-lg
                   w-full max-w-md"
      >
        <motion.h2
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-2xl font-bold text-center mb-6 text-green-500"
        >
          Create an Account
        </motion.h2>

        <RegisterForm />
      </motion.div>
    </motion.div>
  );
};

export default Register;
