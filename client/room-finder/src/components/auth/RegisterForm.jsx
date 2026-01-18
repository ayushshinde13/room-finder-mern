import { useState } from "react";
import axios from "axios";

const RegisterForm = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "RENTER",
  });

  const submitHandler = async (e) => {
    e.preventDefault();
    await axios.post("http://localhost:5001/api/auth/register", form);
    alert("Registered successfully. Login now.");
  };

  return (
    <form
      onSubmit={submitHandler}
      className="w-96 space-y-4
                 bg-transparent"
    >
     

      <input
        type="text"
        placeholder="Full Name"
        onChange={(e) =>
          setForm({ ...form, name: e.target.value })
        }
        className="w-full p-3 rounded-lg
                   bg-gray-800
                   text-white placeholder-gray-400
                   border border-gray-700
                   focus:outline-none focus:ring-2
                   focus:ring-green-500"
      />

      <input
        type="email"
        placeholder="Email"
        onChange={(e) =>
          setForm({ ...form, email: e.target.value })
        }
        className="w-full p-3 rounded-lg
                   bg-gray-800
                   text-white placeholder-gray-400
                   border border-gray-700
                   focus:outline-none focus:ring-2
                   focus:ring-green-500"
      />

      <input
        type="password"
        placeholder="Password"
        onChange={(e) =>
          setForm({ ...form, password: e.target.value })
        }
        className="w-full p-3 rounded-lg
                   bg-gray-800
                   text-white placeholder-gray-400
                   border border-gray-700
                   focus:outline-none focus:ring-2
                   focus:ring-green-500"
      />

      <select
        onChange={(e) =>
          setForm({ ...form, role: e.target.value })
        }
        className="w-full p-3 rounded-lg
                   bg-gray-800
                   text-white
                   border border-gray-700
                   focus:outline-none focus:ring-2
                   focus:ring-green-500"
      >
        <option value="RENTER">Renter</option>
        <option value="OWNER">Owner</option>
      </select>

      <button
        className="w-full bg-green-600 hover:bg-green-700
                   text-white py-2 rounded-lg
                   font-semibold transition"
      >
        Register
      </button>
    </form>
  );
};

export default RegisterForm;
