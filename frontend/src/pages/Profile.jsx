import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const {
    token,
    user,
    setUser,
    setToken,
    setCartItems
  } = useContext(ShopContext);

  const navigate = useNavigate();
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);

  const [editProfile, setEditProfile] = useState({
    name: user?.name || "",
    email: user?.email || ""
  });

  // Hydrate user from localStorage on reload
  useEffect(() => {
    if (!token) {
      navigate("/login");
    }

    if (!user) {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        setEditProfile({
          name: parsedUser.name || "",
          email: parsedUser.email || ""
        });
      }
    }
  }, [token, user, navigate, setUser]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken("");
    setUser(null);
    setCartItems({});
    navigate("/login");
  };

  const handleProfileUpdate = (e) => {
    e.preventDefault();
    // You can send updated profile to backend here

    const updatedUser = {
      ...user,
      name: editProfile.name,
      email: editProfile.email
    };

    setUser(updatedUser);
    localStorage.setItem("user", JSON.stringify(updatedUser));
    setShowEditProfile(false);
  };

  const handlePasswordChange = (e) => {
    e.preventDefault();
    // Add backend integration here later
    setShowChangePassword(false);
  };

  return (
    <div className="max-w-4xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
      <h2 className="text-3xl font-bold mb-8">My Profile</h2>

      {/* Account Details */}
      <div className="bg-white shadow rounded-xl p-6 mb-6">
        <h3 className="text-xl font-semibold mb-4">Account Details</h3>
        <div className="space-y-2 text-gray-700">
          <p><span className="font-medium">Name:</span> {user?.name || "N/A"}</p>
          <p><span className="font-medium">Email:</span> {user?.email || "N/A"}</p>
          <p><span className="font-medium">User ID:</span> {user?._id || "N/A"}</p>
        </div>
      </div>

      {/* Orders */}
      <div className="bg-white shadow rounded-xl p-6 mb-6">
        <h3 className="text-xl font-semibold mb-4">Orders</h3>
        <p className="text-gray-700 mb-2">View your past purchases and track current orders.</p>
        <button
          onClick={() => navigate("/orders")}
          className="px-4 py-2 bg-black text-white rounded-xl text-sm hover:bg-gray-800 transition"
        >
          View Orders
        </button>
      </div>

      {/* Browse Products Prompt */}
      <div className="bg-white shadow rounded-xl p-6 mb-6">
        <h3 className="text-xl font-semibold mb-4">Looking for something?</h3>
        <p className="text-gray-700 mb-2">Browse our collection and discover products you'll love.</p>
        <button
          onClick={() => navigate("/collection")}
          className="mt-3 px-4 py-2 bg-pink-100 text-black rounded-xl text-sm hover:bg-pink-200 transition"
        >
          Browse Products
        </button>
      </div>

      {/* Account Settings */}
      <div className="bg-white shadow rounded-xl p-6">
        <h3 className="text-xl font-semibold mb-4">Account Settings</h3>
        <div className="flex flex-col gap-3 text-sm">
          <button
            onClick={() => setShowEditProfile(true)}
            className="text-blue-600 hover:underline text-left"
          >
            Update Profile Info
          </button>
          <button
            onClick={() => setShowChangePassword(true)}
            className="text-blue-600 hover:underline text-left"
          >
            Change Password
          </button>
          <button
            onClick={handleLogout}
            className="text-red-600 hover:underline text-left"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Edit Profile Modal */}
      {showEditProfile && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <form
            onSubmit={handleProfileUpdate}
            className="bg-white p-6 rounded-xl w-full max-w-md shadow-lg"
          >
            <h3 className="text-lg font-semibold mb-4">Update Profile</h3>
            <input
              type="text"
              placeholder="Name"
              value={editProfile.name}
              onChange={(e) =>
                setEditProfile({ ...editProfile, name: e.target.value })
              }
              className="w-full mb-3 px-4 py-2 border rounded-md"
              required
            />
            <input
              type="email"
              placeholder="Email"
              value={editProfile.email}
              onChange={(e) =>
                setEditProfile({ ...editProfile, email: e.target.value })
              }
              className="w-full mb-3 px-4 py-2 border rounded-md"
              required
            />
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowEditProfile(false)}
                className="text-gray-600 hover:underline"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800"
              >
                Save
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Change Password Modal */}
      {showChangePassword && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <form
            onSubmit={handlePasswordChange}
            className="bg-white p-6 rounded-xl w-full max-w-md shadow-lg"
          >
            <h3 className="text-lg font-semibold mb-4">Change Password</h3>
            <input
              type="password"
              placeholder="New Password"
              className="w-full mb-3 px-4 py-2 border rounded-md"
              required
            />
            <input
              type="password"
              placeholder="Confirm Password"
              className="w-full mb-3 px-4 py-2 border rounded-md"
              required
            />
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowChangePassword(false)}
                className="text-gray-600 hover:underline"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800"
              >
                Change
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default Profile;
