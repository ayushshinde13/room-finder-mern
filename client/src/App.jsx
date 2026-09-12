import { Routes, Route } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import Home from "./pages/Home";
import About from "./pages/About";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import AddRoom from "./pages/AddRoom";
import MyRooms from "./pages/MyRooms";
import NotFound from "./pages/NotFound";
import Profile from "./pages/Profile";
import ProtectedRoute from "./components/common/ProtectedRoute";
import MyBookings from "./pages/MyBookings";
import BookingRequests from "./pages/BookingRequests";
import ExploreRooms from "./pages/ExploreRooms";
import MyRoomBookings from "./pages/MyRoomBookings";
import EditRoom from "./pages/EditRoom";

function App() {
  return (
    <MainLayout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route path="/profile" element={<Profile />} />

        {/* OWNER ONLY */}
        <Route
          path="/add-room"
          element={
            <ProtectedRoute role="OWNER">
              <AddRoom />
            </ProtectedRoute>
          }
        />

        {/* OWNER ONLY - My Rooms */}
        <Route
          path="/my-rooms"
          element={
            <ProtectedRoute role="OWNER">
              <MyRooms />
            </ProtectedRoute>
          }
        />

        {/* OWNER ONLY - Edit Room */}
        <Route
          path="/edit-room/:roomId"
          element={
            <ProtectedRoute role="OWNER">
              <EditRoom />
            </ProtectedRoute>
          }
        />

        {/* OWNER ONLY - My Room Bookings */}
        <Route
          path="/my-room-bookings"
          element={
            <ProtectedRoute role="OWNER">
              <MyRoomBookings />
            </ProtectedRoute>
          }
        />

        {/* Explore rooms - available to logged-in users */}
        <Route
          path="/explore"
          element={
            <ProtectedRoute>
              <ExploreRooms />
            </ProtectedRoute>
          }
        />

        {/* RENTER ONLY - My Bookings */}
        <Route
          path="/my-bookings"
          element={
            <ProtectedRoute role="RENTER">
              <MyBookings />
            </ProtectedRoute>
          }
        />

        {/* OWNER ONLY - Booking Requests */}
        <Route
          path="/booking-requests"
          element={
            <ProtectedRoute role="OWNER">
              <BookingRequests />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </MainLayout>
  );
}

export default App;