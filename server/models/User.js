import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
    },

    password: {
      type: String,
      required: true,
    },

    role: {
      type: String,
      enum: ["OWNER", "RENTER"],
      default: "RENTER",
    },

    avatar: {
      type: String,
      default: "https://ui-avatars.com/api/?name=User",
    },
    
    coins: {
      type: Number,
      default: 0, // Reward coins for users
    },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);