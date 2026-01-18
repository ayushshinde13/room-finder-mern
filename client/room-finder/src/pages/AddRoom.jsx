import { useState } from "react";
import axios from "axios";
import useAuth from "../hooks/useAuth";

const AddRoom = () => {
  const { user, token } = useAuth();

  const [room, setRoom] = useState({
    title: "",
    type: "1BHK",
    price: "",
    location: "",
    image: "",
  });

  // ⏳ Loading check
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Checking access...
      </div>
    );
  }

  // 🚫 Owner only
  if (user.role !== "OWNER") {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500">
        Access denied. Owners only.
      </div>
    );
  }

  const submitHandler = async () => {
    try {
      await axios.post(
        "http://localhost:5001/api/rooms",
        {
          title: room.title,
          bhkType: room.type,     // ✅ backend expects this
          rent: room.price,       // ✅ backend expects this
          location: room.location,
          imageUrl: room.image,   // ✅ backend expects this
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("✅ Room added successfully");

      setRoom({
        title: "",
        type: "1BHK",
        price: "",
        location: "",
        image: "",
      });
    } catch (err) {
      console.error(err.response?.data || err.message);
      alert("❌ Failed to add room");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-950">
      <div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-lg w-full max-w-md space-y-4">

        <h2 className="text-2xl font-bold text-green-500 text-center">
          Add New Room
        </h2>

        <input
          value={room.title}
          onChange={(e) => setRoom({ ...room, title: e.target.value })}
          placeholder="Room Title"
          className="w-full p-3 rounded bg-gray-800 text-white"
          required
        />

        <select
          value={room.type}
          onChange={(e) => setRoom({ ...room, type: e.target.value })}
          className="w-full p-3 rounded bg-gray-800 text-white"
        >
          <option>1BHK</option>
          <option>2BHK</option>
          <option>3BHK</option>
        </select>

        <input
          value={room.price}
          onChange={(e) => setRoom({ ...room, price: e.target.value })}
          type="number"
          placeholder="Monthly Rent"
          className="w-full p-3 rounded bg-gray-800 text-white"
          required
        />

        <input
          value={room.location}
          onChange={(e) => setRoom({ ...room, location: e.target.value })}
          placeholder="Location"
          className="w-full p-3 rounded bg-gray-800 text-white"
          required
        />

        <input
          value={room.image}
          onChange={(e) => setRoom({ ...room, image: e.target.value })}
          placeholder="Image URL"
          className="w-full p-3 rounded bg-gray-800 text-white"
          required
        />

        <button
          onClick={submitHandler}
          className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-semibold"
        >
          Add Room
        </button>
      </div>
    </div>
  );
};

export default AddRoom;
