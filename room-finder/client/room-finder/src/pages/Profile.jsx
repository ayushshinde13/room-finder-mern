import { useEffect, useState } from "react";
import axios from "axios";
import useAuth from "../hooks/useAuth";

const Profile = () => {
  const { user, token } = useAuth();
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!token || !user) {
      setLoading(false);
      return;
    }

    const fetchProfile = async () => {
      try {
        const response = await axios.get("http://localhost:5001/api/users/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setProfileData(response.data);
      } catch (err) {
        console.error("Error fetching profile:", err);
        setError("Failed to load profile. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [token, user]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-400">
        Loading profile...
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500">
        {error}
      </div>
    );
  }

  if (!profileData) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-400">
        No profile data available.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-950 py-10 px-6">
      <h1 className="text-3xl font-bold text-center text-green-500 mb-8">
        My Profile
      </h1>

      <div className="max-w-md mx-auto bg-white dark:bg-gray-900 rounded-xl shadow p-6">
        <div className="flex flex-col items-center text-center">
          <div className="w-24 h-24 rounded-full border-4 border-green-500 flex items-center justify-center mb-4">
            {profileData.avatar ? (
              <img
                src={profileData.avatar}
                alt="Avatar"
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              <span className="text-2xl font-bold text-green-600">
                {profileData.name?.charAt(0)}
              </span>
            )}
          </div>

          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            {profileData.name}
          </h2>
          <p className="text-gray-500 dark:text-gray-400">{profileData.email}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Role: {profileData.role.toUpperCase()}
          </p>

          {/* Additional info */}
          <div className="mt-6 space-y-2 text-sm text-gray-600 dark:text-gray-300">
            <p>Created at: {new Date(profileData.createdAt).toLocaleDateString()}</p>
            <p>Last updated: {new Date(profileData.updatedAt).toLocaleDateString()}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;