import React, { useState } from "react";

const AccountProfile = () => {
  const [profileData, setProfileData] = useState({
    firstName: "Pratik",
    lastName: "Bhattarai",
    phoneNumber: "9843411801",
    email: "pratikb957@gmail.com",
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      alert("Your profile has been updated successfully.");
    }, 1000);
  };

  const handleCancel = () => {
    setProfileData({
      firstName: "Pratik",
      lastName: "Bhattarai",
      phoneNumber: "9843411801",
      email: "pratikb957@gmail.com",
    });
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-sm">
      {/* Profile Picture Section */}
      <div className="mb-8">
        <h2 className="text-sm font-medium text-gray-500 mb-2 uppercase tracking-wider">
          Profile Picture
        </h2>
        <div className="flex items-center space-x-4">
          <div className="h-20 w-20 rounded-full bg-[#16A34A] bg-opacity-10 flex items-center justify-center">
            <span className="text-2xl font-bold text-[#16A34A]">
              {profileData.firstName.charAt(0)}
            </span>
          </div>
          <button className="text-[#16A34A] hover:text-[#12803A] text-sm font-medium">
            Change Photo
          </button>
        </div>
      </div>

      {/* Form Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {Object.entries(profileData).map(([key, value]) => (
          <div key={key}>
            <label
              htmlFor={key}
              className="block text-sm font-medium text-gray-500 mb-2 uppercase tracking-wider"
            >
              {key.replace(/([A-Z])/g, " $1").trim()}
            </label>
            <input
              id={key}
              name={key}
              value={value}
              onChange={handleInputChange}
              disabled={key === "email"}
              className={`w-full px-4 py-3 border ${
                key === "email" ? "bg-gray-50" : "bg-white"
              } rounded-lg focus:outline-none focus:ring-2 focus:ring-[#16A34A] focus:border-transparent transition-all`}
            />
          </div>
        ))}
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3 justify-end">
        <button
          onClick={handleCancel}
          className="px-6 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={handleSave}
          disabled={isLoading}
          className="px-6 py-2.5 bg-[#16A34A] hover:bg-[#12803A] text-white rounded-lg font-medium disabled:opacity-70 transition-colors"
        >
          {isLoading ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </div>
  );
};

export default AccountProfile;
