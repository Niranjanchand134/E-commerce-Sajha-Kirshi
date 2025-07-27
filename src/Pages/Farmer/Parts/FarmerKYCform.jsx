import React, { useState } from "react";
import { fillFarmerKyc } from "../../../services/farmer/farmerApiService";
import {
  ErrorMessageToast,
  SuccesfulMessageToast,
} from "../../../utils/Tostify.util";
import { MapContainer, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "../../../App.css";
import AdminMapComponent from "../Component/map/AdminMapComponent";
import { useAuth } from "../../../Context/AuthContext";
import { useNavigate } from "react-router-dom";

const FarmerKYCform = () => {
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [gender, setGender] = useState("");
  const [esewaQrImage, setEsewaQrImage] = useState(null);
  const [profileImage, setProfileImage] = useState(null);
  const [farmImage, setFarmImage] = useState(null);
  const [certificateImage, setCertificateImage] = useState(null);
  const navigate = useNavigate();
  const [image, setImage] = useState(
    "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
  );

  const [form, setForm] = useState({
    dateOfBirth: "",
    gender: "",
    citizenshipNumber: "",
    citizenshipIssuedDistrict: "",
    permanentAddress: "",
    province: "",
    district: "",
    municipality: "",
    wardNumber: "",
    tole: "",
    farmName: "",
    farmSize: "",
    farmSizeUnit: "Ropani",
    primaryCrops: "",
    annualProductionCapacity: "",
    yearsOfExperience: "",
    farmingType: "",
    certifications: "",
    esewaId: "",
    esewaQrImagePath: "",
    profileImagePath: "",
  });

  const steps = [
    { step: 1, label: "Personal Information" },
    { step: 2, label: "Address & Farm Details" },
    { step: 3, label: "Identification and Business Info" },
  ];

  const handleImageUpload = async (file, type) => {
    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", "SajhaKrishi");
    data.append("cloud_name", "dtwunctra");

    try {
      const response = await fetch(
        "https://api.cloudinary.com/v1_1/dtwunctra/image/upload",
        {
          method: "POST",
          body: data,
        }
      );
      const result = await response.json();

      if (type === "citizenshipFront") {
        setForm((prev) => ({
          ...prev,
          citizenshipFrontImagePath: result.url,
        }));
      } else if (type === "citizenshipBack") {
        setForm((prev) => ({
          ...prev,
          citizenshipBackImagePath: result.url,
        }));
      } else if (type === "esewaQr") {
        setForm((prev) => ({ ...prev, esewaQrImagePath: result.url }));
      } 
      else if (type === "profileImg") {
        setForm((prev) => ({ ...prev, profileImagePath: result.url }));
      } else if (type === "certificate") {
        setForm((prev) => ({ ...prev, certifications: result.url }));
      }

      return result.url;
    } catch (error) {
      console.error("Error uploading image:", error);
      return null;
    }
  };



  const handleEsewaQrChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setEsewaQrImage(URL.createObjectURL(file));
      await handleImageUpload(file, "esewaQr");
    }
  };

   const handleProfileChange = async (e) => {
     const file = e.target.files[0];
     if (file) {
       setProfileImage(URL.createObjectURL(file));
       await handleImageUpload(file, "profileImg");
     }
   };

  const handleCertificateChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setCertificateImage(URL.createObjectURL(file));
      await handleImageUpload(file, "certificate");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    console.log("Submitting form:", form);
    try {
      const response = await fillFarmerKyc(form);
      console.log("KYC submitted successfully:", response);
      navigate("/");
      SuccesfulMessageToast("KYC submitted successfully");
    } catch (error) {
      console.error("Error submitting KYC:", error);
      ErrorMessageToast("Error submitting KYC. Please try again.");
    }
  };


  const handleRemove = () => {
    setImage(null);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="flex justify-center">
        <div className="bg-[#4BAF47] text-white p-4 md:p-8 max-w-4xl w-full">
          <h5 className="text-lg font-semibold">
            Almost done, please follow the remarks below to complete KYC
          </h5>
          <p>Please upload photo and one of the following documents:</p>
          <ul className="list-disc pl-5">
            <li>Citizenship Certificate</li>
            <li>Driving Licence</li>
            <li>Passport</li>
          </ul>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-4 md:p-6">
        {/* Stepper */}
        <div className="mb-6">
          {/* Progress Bar */}
          <div className="relative mb-4">
            <div className="flex items-center justify-between">
              {steps.map((s, index) => (
                <div
                  key={s.step}
                  className="flex flex-col items-center relative z-10"
                >
                  {/* Step Circle */}
                  <div className="relative">
                    <button
                      onClick={() => setCurrentStep(s.step)}
                      className={`w-12 h-12 rounded-full flex items-center justify-center font-semibold text-sm transition-all duration-300 shadow-lg hover:scale-105 ${
                        currentStep === s.step
                          ? "bg-gradient-to-br from-green-500 to-green-600 text-white shadow-green-200"
                          : currentStep > s.step
                          ? "bg-gradient-to-br from-green-400 to-green-500 text-white shadow-green-100"
                          : "bg-white border-2 border-gray-300 text-gray-600 hover:border-green-400 hover:text-green-600"
                      }`}
                    >
                      {currentStep > s.step ? (
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2.5}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      ) : (
                        s.step
                      )}
                    </button>

                    {/* Active Step Pulse Animation */}
                    {currentStep === s.step && (
                      <div className="absolute inset-0 rounded-full bg-green-500 animate-ping opacity-20"></div>
                    )}
                  </div>

                  {/* Step Label */}
                  <div className="mt-3 text-center">
                    <div
                      className={`text-xs font-medium mb-1 transition-colors duration-200 ${
                        currentStep === s.step
                          ? "text-green-600"
                          : currentStep > s.step
                          ? "text-green-500"
                          : "text-gray-500"
                      }`}
                    >
                      Step {s.step}
                    </div>
                    <div
                      className={`text-sm font-medium max-w-24 leading-tight transition-colors duration-200 ${
                        currentStep === s.step
                          ? "text-gray-900"
                          : currentStep > s.step
                          ? "text-gray-700"
                          : "text-gray-600"
                      }`}
                    >
                      {s.label}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Progress Line */}
            <div className="absolute top-6 left-0 right-0 h-0.5 bg-gray-200 -z-10">
              <div
                className="h-full bg-gradient-to-r from-green-400 to-green-500 transition-all duration-500 ease-out"
                style={{
                  width: `${((currentStep - 1) / (steps.length - 1)) * 100}%`,
                }}
              ></div>
            </div>
          </div>

          {/* Mobile Alternative - Compact Design */}
          <div className="md:hidden">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="text-sm text-gray-600">
                  Step {currentStep} of {steps.length}
                </div>
                <div className="text-sm font-medium text-gray-900">
                  {steps.find((s) => s.step === currentStep)?.label}
                </div>
              </div>

              {/* Mobile Progress Bar */}
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-green-400 to-green-500 h-2 rounded-full transition-all duration-500 ease-out"
                  style={{
                    width: `${(currentStep / steps.length) * 100}%`,
                  }}
                ></div>
              </div>

              {/* Step Navigation Dots */}
              <div className="flex justify-center space-x-2 mt-4">
                {steps.map((s, index) => (
                  <button
                    key={s.step}
                    onClick={() => setCurrentStep(s.step)}
                    className={`w-2 h-2 rounded-full transition-all duration-200 ${
                      currentStep === s.step
                        ? "bg-green-500 w-6"
                        : currentStep > s.step
                        ? "bg-green-400"
                        : "bg-gray-300"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Form Content */}
        <div className="mt-2">
          {currentStep === 1 && (
            <div className="max-w-7xl mx-auto p-6">
              {/* Header */}
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Personal Information
                </h2>
                <p className="text-sm text-gray-600">
                  Please provide your personal details and identification
                  information
                </p>
              </div>

              {/* Basic Information Section */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
                <div className="flex items-center mb-6">
                  <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                    <svg
                      className="w-4 h-4 text-green-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800">
                    Basic Information
                  </h3>
                </div>

                <div className="space-y-5">
                  {/* Full Name */}
                  <div className="space-y-2">
                    <label
                      htmlFor="name"
                      className="text-sm font-medium text-gray-700"
                    >
                      Full Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      onChange={handleChange}
                      value={user.name}
                      className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                      style={{ "--tw-ring-color": "#4BAF47" }}
                      placeholder="Enter your full name"
                    />
                  </div>

                  {/* Mobile and Email Row */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label
                        htmlFor="number"
                        className="text-sm font-medium text-gray-700"
                      >
                        Mobile Number
                      </label>
                      <input
                        type="text"
                        id="number"
                        name="number"
                        onChange={handleChange}
                        value={form.number}
                        className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                        style={{ "--tw-ring-color": "#4BAF47" }}
                        placeholder="Enter mobile number"
                      />
                    </div>

                    <div className="space-y-2">
                      <label
                        htmlFor="email"
                        className="text-sm font-medium text-gray-700"
                      >
                        Email Address
                      </label>
                      <input
                        type="email"
                        id="email"
                        onChange={handleChange}
                        value={user.email}
                        className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                        style={{ "--tw-ring-color": "#4BAF47" }}
                        placeholder="Enter email address"
                      />
                    </div>
                  </div>

                  {/* Address, Gender, Birth Date Row */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <label
                        htmlFor="address"
                        className="text-sm font-medium text-gray-700"
                      >
                        Permanent Address
                      </label>
                      <input
                        type="text"
                        id="address"
                        name="permanentAddress"
                        onChange={handleChange}
                        value={form.permanentAddress}
                        className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                        style={{ "--tw-ring-color": "#4BAF47" }}
                        placeholder="Enter permanent address"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">
                        Gender
                      </label>
                      <div className="flex border border-gray-200 rounded-lg overflow-hidden">
                        <button
                          type="button"
                          onClick={() =>
                            setForm((prev) => ({ ...prev, gender: "Male" }))
                          }
                          className={`flex-1 px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
                            form.gender === "Male"
                              ? "text-white"
                              : "bg-white text-gray-700 hover:bg-gray-50"
                          }`}
                          style={
                            form.gender === "Male"
                              ? { backgroundColor: "#4BAF47" }
                              : {}
                          }
                        >
                          Male
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            setForm((prev) => ({ ...prev, gender: "Female" }))
                          }
                          className={`flex-1 px-3 py-2.5 text-sm font-medium transition-all duration-200 border-l border-r border-gray-200 ${
                            form.gender === "Female"
                              ? "text-white"
                              : "bg-white text-gray-700 hover:bg-gray-50"
                          }`}
                          style={
                            form.gender === "Female"
                              ? { backgroundColor: "#4BAF47" }
                              : {}
                          }
                        >
                          Female
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            setForm((prev) => ({ ...prev, gender: "Other" }))
                          }
                          className={`flex-1 px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
                            form.gender === "Other"
                              ? "text-white"
                              : "bg-white text-gray-700 hover:bg-gray-50"
                          }`}
                          style={
                            form.gender === "Other"
                              ? { backgroundColor: "#4BAF47" }
                              : {}
                          }
                        >
                          Other
                        </button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label
                        htmlFor="date"
                        className="text-sm font-medium text-gray-700"
                      >
                        Birth Date
                      </label>
                      <input
                        type="date"
                        id="date"
                        name="dateOfBirth"
                        onChange={handleChange}
                        value={form.dateOfBirth}
                        className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                        style={{ "--tw-ring-color": "#4BAF47" }}
                      />
                    </div>
                  </div>

                  {/* Citizenship Details Row */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label
                        htmlFor="citizenshipNumber"
                        className="text-sm font-medium text-gray-700"
                      >
                        Citizenship Number
                      </label>
                      <input
                        type="text"
                        id="citizenshipNumber"
                        name="citizenshipNumber"
                        onChange={handleChange}
                        value={form.citizenshipNumber}
                        className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                        style={{ "--tw-ring-color": "#4BAF47" }}
                        placeholder="Enter citizenship number"
                      />
                    </div>

                    <div className="space-y-2">
                      <label
                        htmlFor="citizenshipIssuedDistrict"
                        className="text-sm font-medium text-gray-700"
                      >
                        Citizenship Issued District
                      </label>
                      <select
                        id="citizenshipIssuedDistrict"
                        name="citizenshipIssuedDistrict"
                        onChange={handleChange}
                        value={form.citizenshipIssuedDistrict}
                        className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                        style={{ "--tw-ring-color": "#4BAF47" }}
                      >
                        <option value="">Select district</option>
                        <option value="Kathmandu">Kathmandu</option>
                        <option value="Lalitpur">Lalitpur</option>
                        <option value="Bhaktapur">Bhaktapur</option>
                        <option value="Chitwan">Chitwan</option>
                        <option value="Rupandehi">Rupandehi</option>
                        <option value="Nepalgunj">Nepalgunj</option>
                      </select>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <label className="text-sm font-medium text-gray-700">
                      Profile Image
                    </label>
                    <div className="border-2 border-dashed w-[65vh] border-gray-200 rounded-lg p-4 hover:border-green-300 transition-colors duration-200">
                      <div className="flex items-center space-x-4">
                        <div className="w-20 h-20 rounded-lg overflow-hidden border border-gray-200 bg-gray-50 flex-shrink-0">
                          {profileImage ? (
                            <img
                              src={profileImage}
                              alt="Certificate"
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <svg
                                className="w-6 h-6 text-gray-400"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                                />
                              </svg>
                            </div>
                          )}
                        </div>
                        <div className="flex-1 space-y-2">
                          <label className="cursor-pointer">
                            <input
                              type="file"
                              accept="image/*"
                              name="certifications"
                              onChange={handleProfileChange}
                              className="hidden"
                            />
                            <span className="inline-flex items-center px-3 py-2 bg-green-500 text-white text-xs font-medium rounded-lg hover:bg-green-600 transition-colors duration-200">
                              <svg
                                className="w-4 h-4 mr-2"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                                />
                              </svg>
                              Upload Image
                            </span>
                          </label>
                          {profileImage && (
                            <button
                              onClick={() => {
                                setProfileImage(null);
                                setForm((prev) => ({
                                  ...prev,
                                  profileImagePath: "",
                                }));
                              }}
                              className="inline-flex items-center px-3 py-2 border border-gray-300 text-gray-700 text-xs font-medium rounded-lg hover:bg-gray-50 transition-colors duration-200"
                            >
                              <svg
                                className="w-4 h-4 mr-2"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                />
                              </svg>
                              Remove
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Document Upload Section */}
            </div>
          )}

          {currentStep === 2 && (
            <div className="max-w-7xl mx-auto p-6">
              {/* Header */}
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Address & Farm Details
                </h2>
                <p className="text-sm text-gray-600">
                  Please provide your location and farm information
                </p>
              </div>

              {/* Address Section */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
                <div className="flex items-center mb-6">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                    <svg
                      className="w-4 h-4 text-blue-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800">
                    Address Information
                  </h3>
                </div>

                <div className="space-y-5">
                  {/* Province and District Row */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label
                        htmlFor="province"
                        className="text-sm font-medium text-gray-700"
                      >
                        Province
                      </label>
                      <select
                        id="province"
                        name="province"
                        onChange={handleChange}
                        value={form.province}
                        className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      >
                        <option value="">Select Province</option>
                        <option value="Province 1">Province 1</option>
                        <option value="Province 2">Province 2</option>
                        <option value="Bagmati Province">
                          Bagmati Province
                        </option>
                        <option value="Gandaki Province">
                          Gandaki Province
                        </option>
                        <option value="Lumbini Province">
                          Lumbini Province
                        </option>
                        <option value="Karnali Province">
                          Karnali Province
                        </option>
                        <option value="Sudurpashchim Province">
                          Sudurpashchim Province
                        </option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label
                        htmlFor="district"
                        className="text-sm font-medium text-gray-700"
                      >
                        District
                      </label>
                      <select
                        id="district"
                        name="district"
                        onChange={handleChange}
                        value={form.district}
                        className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      >
                        <option value="">Select District</option>
                        <option value="Kathmandu">Kathmandu</option>
                        <option value="Lalitpur">Lalitpur</option>
                        <option value="Bhaktapur">Bhaktapur</option>
                        <option value="Chitwan">Chitwan</option>
                        <option value="Rupandehi">Rupandehi</option>
                        <option value="Nepalgunj">Nepalgunj</option>
                      </select>
                    </div>
                  </div>

                  {/* Municipality and Ward Number Row */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label
                        htmlFor="municipality"
                        className="text-sm font-medium text-gray-700"
                      >
                        Municipality
                      </label>
                      <select
                        id="municipality"
                        name="municipality"
                        onChange={handleChange}
                        value={form.municipality}
                        className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      >
                        <option value="">Select Municipality</option>
                        <option value="Kathmandu Metropolitan">
                          Kathmandu Metropolitan
                        </option>
                        <option value="Lalitpur Metropolitan">
                          Lalitpur Metropolitan
                        </option>
                        <option value="Bhaktapur Municipality">
                          Bhaktapur Municipality
                        </option>
                        <option value="Bharatpur Metropolitan">
                          Bharatpur Metropolitan
                        </option>
                        <option value="Pokhara Metropolitan">
                          Pokhara Metropolitan
                        </option>
                        <option value="Biratnagar Metropolitan">
                          Biratnagar Metropolitan
                        </option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label
                        htmlFor="wardNumber"
                        className="text-sm font-medium text-gray-700"
                      >
                        Ward Number
                      </label>
                      <input
                        type="number"
                        id="wardNumber"
                        name="wardNumber"
                        onChange={handleChange}
                        value={form.wardNumber}
                        className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                        placeholder="Enter ward number"
                      />
                    </div>
                  </div>

                  {/* Tole Row */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label
                        htmlFor="tole"
                        className="text-sm font-medium text-gray-700"
                      >
                        Tole
                      </label>
                      <input
                        type="text"
                        id="tole"
                        name="tole"
                        onChange={handleChange}
                        value={form.tole}
                        className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                        placeholder="Enter tole name"
                      />
                    </div>
                    <div></div>
                  </div>
                </div>
              </div>

              {/* Farm Details Section */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <div className="flex items-center mb-6">
                  <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                    <svg
                      className="w-4 h-4 text-green-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800">
                    Farm Information
                  </h3>
                </div>

                <div className="space-y-5">
                  {/* First Row - Production and Primary Crops */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label
                        htmlFor="annualProductionCapacity"
                        className="text-sm font-medium text-gray-700"
                      >
                        Farm Name
                      </label>
                      <input
                        type="text"
                        id="annualProductionCapacity"
                        name="farmName"
                        onChange={handleChange}
                        value={form.farmName}
                        className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                        placeholder="Enter farm name"
                      />
                    </div>
                    <div className="space-y-2">
                      <label
                        htmlFor="annualProductionCapacity"
                        className="text-sm font-medium text-gray-700"
                      >
                        Total Annual Production Capacity
                      </label>
                      <input
                        type="text"
                        id="annualProductionCapacity"
                        name="annualProductionCapacity"
                        onChange={handleChange}
                        value={form.annualProductionCapacity}
                        className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                        placeholder="e.g., 2000 KG"
                      />
                    </div>

                    <div className="space-y-2">
                      <label
                        htmlFor="primaryCrops"
                        className="text-sm font-medium text-gray-700"
                      >
                        Primary Crops
                      </label>
                      <input
                        type="text"
                        id="primaryCrops"
                        name="primaryCrops"
                        onChange={handleChange}
                        value={form.primaryCrops}
                        className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                        placeholder="e.g., Rice, Wheat, Maize"
                      />
                    </div>
                  </div>

                  {/* Farm Size with Unit Selector */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label
                        htmlFor="farmSize"
                        className="text-sm font-medium text-gray-700"
                      >
                        Farm Size{" "}
                        <span className="text-gray-500 font-normal">
                          (in ropani / hectares)
                        </span>
                      </label>
                      <div className="flex items-center border border-gray-200 rounded-lg focus-within:ring-2 focus-within:ring-green-500 focus-within:border-transparent transition-all duration-200">
                        <input
                          type="text"
                          id="farmSize"
                          name="farmSize"
                          onChange={handleChange}
                          value={form.farmSize}
                          className="flex-1 px-4 py-2.5 text-sm border-0 rounded-l-lg focus:outline-none focus:ring-0"
                          placeholder="Enter size"
                        />
                        <div className="border-l border-gray-200">
                          <select
                            onChange={handleChange}
                            name="farmSizeUnit"
                            value={form.farmSizeUnit}
                            className="px-3 py-2.5 text-sm border-0 rounded-r-lg focus:outline-none focus:ring-1 bg-gray-50"
                          >
                            <option value="Ropani">Ropani</option>
                            <option value="Hectares">Hectares</option>
                            <option value="Aana">Aana</option>
                          </select>
                        </div>
                      </div>
                    </div>
                    <div></div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="max-w-7xl mx-auto p-6">
              {/* Header */}
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Identification & Business Information
                </h2>
                <p className="text-sm text-gray-600">
                  Please provide your farming experience and payment details
                </p>
              </div>

              {/* Main Content Grid */}
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                {/* Farming Experience Section */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                  <div className="flex items-center mb-6">
                    <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                      <svg
                        className="w-4 h-4 text-green-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4"
                        />
                      </svg>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-800">
                      Farming Experience
                    </h3>
                  </div>

                  {/* Form Fields */}
                  <div className="space-y-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label
                          htmlFor="yearsOfExperience"
                          className="text-sm font-medium text-gray-700"
                        >
                          Years of Experience
                        </label>
                        <input
                          type="number"
                          id="yearsOfExperience"
                          name="yearsOfExperience"
                          onChange={handleChange}
                          value={form.yearsOfExperience}
                          className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                          placeholder="e.g., 5"
                        />
                      </div>

                      <div className="space-y-2">
                        <label
                          htmlFor="farmingType"
                          className="text-sm font-medium text-gray-700"
                        >
                          Farming Type
                        </label>
                        <select
                          id="farmingType"
                          name="farmingType"
                          onChange={handleChange}
                          value={form.farmingType}
                          className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                        >
                          <option value="">Select farming type</option>
                          <option value="Organic">Organic</option>
                          <option value="Traditional">Traditional</option>
                          <option value="Commercial">Commercial</option>
                          <option value="Mixed">Mixed</option>
                        </select>
                      </div>
                    </div>

                    {/* Certificate Upload */}
                    <div className="space-y-3">
                      <label className="text-sm font-medium text-gray-700">
                        Certificate Image
                      </label>
                      <div className="border-2 border-dashed border-gray-200 rounded-lg p-4 hover:border-green-300 transition-colors duration-200">
                        <div className="flex items-center space-x-4">
                          <div className="w-20 h-20 rounded-lg overflow-hidden border border-gray-200 bg-gray-50 flex-shrink-0">
                            {certificateImage ? (
                              <img
                                src={certificateImage}
                                alt="Certificate"
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <svg
                                  className="w-6 h-6 text-gray-400"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                                  />
                                </svg>
                              </div>
                            )}
                          </div>
                          <div className="flex-1 space-y-2">
                            <label className="cursor-pointer">
                              <input
                                type="file"
                                accept="image/*"
                                name="certifications"
                                onChange={handleCertificateChange}
                                className="hidden"
                              />
                              <span className="inline-flex items-center px-3 py-2 bg-green-500 text-white text-xs font-medium rounded-lg hover:bg-green-600 transition-colors duration-200">
                                <svg
                                  className="w-4 h-4 mr-2"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                                  />
                                </svg>
                                Upload Image
                              </span>
                            </label>
                            {certificateImage && (
                              <button
                                onClick={() => {
                                  setCertificateImage(null);
                                  setForm((prev) => ({
                                    ...prev,
                                    certifications: "",
                                  }));
                                }}
                                className="inline-flex items-center px-3 py-2 border border-gray-300 text-gray-700 text-xs font-medium rounded-lg hover:bg-gray-50 transition-colors duration-200"
                              >
                                <svg
                                  className="w-4 h-4 mr-2"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                  />
                                </svg>
                                Remove
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bank & Payment Details Section */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                  <div className="flex items-center mb-6">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                      <svg
                        className="w-4 h-4 text-blue-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                        />
                      </svg>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-800">
                      Payment Details
                    </h3>
                  </div>

                  {/* Payment Form */}
                  <div className="space-y-5">
                    <div className="space-y-2">
                      <label
                        htmlFor="esewaId"
                        className="text-sm font-medium text-gray-700"
                      >
                        eSewa ID
                      </label>
                      <input
                        type="text"
                        id="esewaId"
                        name="esewaId"
                        onChange={handleChange}
                        value={form.esewaId}
                        className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                        placeholder="Enter your eSewa mobile number or ID"
                      />
                    </div>

                    {/* eSewa QR code  Upload */}
                    <div className="space-y-3">
                      <label className="text-sm font-medium text-gray-700">
                        eSewa QR Code
                      </label>
                      <div className="border-2 border-dashed border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors duration-200">
                        <div className="flex items-center space-x-4">
                          <div className="w-20 h-20 rounded-lg overflow-hidden border border-gray-200 bg-gray-50 flex-shrink-0">
                            {esewaQrImage ? (
                              <img
                                src={esewaQrImage}
                                alt="PAN Card"
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <svg
                                  className="w-6 h-6 text-gray-400"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                  />
                                </svg>
                              </div>
                            )}
                          </div>
                          <div className="flex-1 space-y-2">
                            <label className="cursor-pointer">
                              <input
                                type="file"
                                accept="image/*"
                                onChange={handleEsewaQrChange}
                                className="hidden"
                              />
                              <span className="inline-flex items-center px-3 py-2 bg-blue-500 text-white text-xs font-medium rounded-lg hover:bg-blue-600 transition-colors duration-200">
                                <svg
                                  className="w-4 h-4 mr-2"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                                  />
                                </svg>
                                Upload QR Code
                              </span>
                            </label>
                            {esewaQrImage && (
                              <button
                                onClick={() => {
                                  setEsewaQrImage(null);
                                  setForm((prev) => ({
                                    ...prev,
                                    esewaQrImagePath: "",
                                  }));
                                }}
                                className="inline-flex items-center px-3 py-2 border border-gray-300 text-gray-700 text-xs font-medium rounded-lg hover:bg-gray-50 transition-colors duration-200"
                              >
                                <svg
                                  className="w-4 h-4 mr-2"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                  />
                                </svg>
                                Remove
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Navigation Buttons */}
        <div className="text-center p-4 md:p-8">
          <h4 className="text-green-500 p-2">Have doubts? Worry not!</h4>
          <div className="flex gap-3 justify-center">
            <button
              disabled={currentStep === 1}
              onClick={() => setCurrentStep(currentStep - 1)}
              className="bg-[#EFBE44] p-2 w-32 rounded-full text-white text-lg font-bold disabled:opacity-50"
            >
              Previous
            </button>
            {currentStep === steps.length ? (
              <button
                className="bg-[#4BAF47] p-2 w-32 rounded-full text-white text-lg font-bold"
                onClick={handleSubmit}
                type="submit"
              >
                Submit
              </button>
            ) : (
              <button
                disabled={currentStep === steps.length}
                onClick={() => setCurrentStep(currentStep + 1)}
                className="bg-[#4BAF47] p-2 w-32 rounded-full text-white text-lg font-bold disabled:opacity-50"
              >
                Next
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FarmerKYCform;
