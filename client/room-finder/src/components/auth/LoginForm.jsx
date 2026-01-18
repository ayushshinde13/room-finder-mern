import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import toast from "react-hot-toast";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const { data } = await axios.post(
        "http://localhost:5001/api/auth/login",
        { email, password }
      );

      login(data);
      toast.success("Login successful");

      // ✅ ALWAYS GO TO PROFILE
      navigate("/profile");

    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={submitHandler}
      className="max-w-md mx-auto space-y-4
                 bg-gray-900 p-6 rounded-xl shadow-lg"
    >
      {/* Email */}
      <input
        type="email"
        required
        placeholder="Email"
        onChange={(e) => setEmail(e.target.value)}
        className="w-full p-3 rounded-lg
                   bg-gray-800 text-white
                   placeholder-gray-400
                   border border-gray-700
                   focus:outline-none focus:ring-2
                   focus:ring-green-500"
      />

      {/* Password */}
      <input
        type="password"
        required
        placeholder="Password"
        onChange={(e) => setPassword(e.target.value)}
        className="w-full p-3 rounded-lg
                   bg-gray-800 text-white
                   placeholder-gray-400
                   border border-gray-700
                   focus:outline-none focus:ring-2
                   focus:ring-green-500"
      />

      {/* Button */}
      <button
        disabled={loading}
        className="w-full bg-green-600 hover:bg-green-700
                   text-white py-2 rounded-lg
                   font-semibold transition
                   disabled:opacity-50"
      >
        {loading ? "Logging in..." : "Login"}
      </button>
    </form>
  );
};

export default LoginForm;
