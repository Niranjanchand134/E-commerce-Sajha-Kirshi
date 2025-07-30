import { useNavigate } from "react-router-dom";
import { BuyerKycForm } from "../../../services/buyer/BuyerApiService";
import {
  ErrorMessageToast,
  SuccesfulMessageToast,
} from "../../../utils/Tostify.util";
import Footer from "./Footer";
import Header from "./Header";
import React, { useState } from "react";
import { useAuth } from "../../../Context/AuthContext";

const KYCform = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState("");
  const [errors, setErrors] = useState({});
  const { user } = useAuth();

  const navigate = useNavigate();

  // Form state
  const [formData, setFormData] = useState({
    userId: user.id,
    fullName: "",
    phoneNumber: "",
    email: "",
    dateOfBirth: "",
    gender: "",
    profilePhotoPath: "",
    province: "",
    district: "",
    municipality: "",
    ward: "",
    streetAddress: "",
    landmark: "",
    citizenshipNumber: "",
    panNumber: "",
    businessRegistrationImagePath: "",
  });

  // Image states
  const [profileImage, setProfileImage] = useState(
    "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
  );
  const [businessRegistrationImagePath, setBusinessRegistrationImagePath] =
    useState(null);

  const steps = [
    { step: 1, label: "Personal Information" },
    { step: 2, label: "Address" },
    { step: 3, label: "Identification and Business Info" },
  ];

  // Validation rules for each step
  const validateStep = (step) => {
    const newErrors = {};
    
    if (step === 1) {
      if (!formData.fullName.trim()) newErrors.fullName = "Full name is required";
      if (!formData.phoneNumber.trim()) newErrors.phoneNumber = "Phone number is required";
      else if (!/^[0-9]{10}$/.test(formData.phoneNumber)) newErrors.phoneNumber = "Invalid phone number (10 digits)";
      if (!formData.email.trim()) newErrors.email = "Email is required";
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = "Invalid email format";
      if (!formData.dateOfBirth) newErrors.dateOfBirth = "Date of birth is required";
      if (!formData.gender) newErrors.gender = "Gender is required";
      if (!formData.profilePhotoPath) newErrors.profilePhotoPath = "Profile photo is required";
    }
    
    if (step === 2) {
      if (!formData.province) newErrors.province = "Province is required";
      if (!formData.district) newErrors.district = "District is required";
      if (!formData.municipality) newErrors.municipality = "Municipality is required";
      if (!formData.streetAddress) newErrors.streetAddress = "Street address is required";
      if (formData.ward && isNaN(formData.ward)) newErrors.ward = "Ward must be a number";
    }
    
    if (step === 3) {
      if (!formData.citizenshipNumber) newErrors.citizenshipNumber = "Citizenship number is required";
      if (!formData.panNumber) newErrors.panNumber = "PAN number is required";
      else if (!/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(formData.panNumber)) newErrors.panNumber = "Invalid PAN format";
      if (!formData.businessRegistrationImagePath) newErrors.businessRegistrationImagePath = "Business registration image is required";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Cloudinary image upload function
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

      // Update the corresponding image path in the form state
      if (type === "profile") {
        setFormData((prev) => ({
          ...prev,
          profilePhotoPath: result.url,
        }));
      } else if (type === "businessRegistrationImage") {
        setFormData((prev) => ({
          ...prev,
          businessRegistrationImagePath: result.url,
        }));
      }

      return result.url;
    } catch (error) {
      console.error("Error uploading image:", error);
      ErrorMessageToast("Failed to upload image. Please try again.");
      return null;
    }
  };

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = {...prev};
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  // Handle image uploads with Cloudinary integration
  const handleImageChange = async (e, imageType) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        ErrorMessageToast("File size should be less than 5MB");
        return;
      }
      
      // Validate file type
      if (!['image/jpeg', 'image/png'].includes(file.type)) {
        ErrorMessageToast("Only JPEG or PNG images are allowed");
        return;
      }

      const imageUrl = URL.createObjectURL(file);

      switch (imageType) {
        case "profile":
          setProfileImage(imageUrl);
          await handleImageUpload(file, "profile");
          break;
        case "businessRegistrationImage":
          setBusinessRegistrationImagePath(imageUrl);
          await handleImageUpload(file, "businessRegistrationImage");
          break;
      }
      
      // Clear image error if any
      if (errors[`${imageType}Path`]) {
        setErrors(prev => {
          const newErrors = {...prev};
          delete newErrors[`${imageType}Path`];
          return newErrors;
        });
      }
    }
  };

  // Handle image removal
  const handleRemoveImage = (imageType) => {
    switch (imageType) {
      case "profile":
        setProfileImage(
          "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
        );
        setFormData((prev) => ({ ...prev, profilePhotoPath: "" }));
        break;
      case "businessRegistrationImage":
        setBusinessRegistrationImagePath(null);
        setFormData((prev) => ({ ...prev, businessRegistrationImagePath: "" }));
        break;
    }
  };

  // Handle form submission
  const handleSubmit = async () => {
    setIsSubmitting(true);
    setSubmitMessage("");

    try {
      // Final validation before submission
      if (!validateStep(1) || !validateStep(2) || !validateStep(3)) {
        ErrorMessageToast("Please fix all validation errors before submitting");
        setIsSubmitting(false);
        return;
      }

      // Convert phone number to integer
      const submitData = {
        ...formData,
        phoneNumber: parseInt(formData.phoneNumber),
        ward: formData.ward ? parseInt(formData.ward) : null,
      };

      console.log("Submitting KYC data:", submitData);
      const response = await BuyerKycForm(submitData);
      SuccesfulMessageToast("KYC form submitted successfully!");
      navigate("/");
    } catch (error) {
      console.error("Error submitting KYC:", error);
      ErrorMessageToast(error.message || "Failed to save kyc");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Navigate to next step with validation
  const handleNext = () => {
    if (!validateStep(currentStep)) {
      ErrorMessageToast("Please fix all validation errors before proceeding");
      return;
    }

    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    } else {
      handleSubmit();
    }
  };

  return (
    <>
      <Header />
      <div className="flex justify-center">
        <div className="bg-[#4BAF47] text-white p-4 md:p-8 max-w-4xl w-full">
          <h5>Almost done, please follow the remarks below to complete KYC</h5>
          <p>Please upload photo and one of the following documents:</p>
          <ul>
            <li>Citizenship Certificate</li>
            <li>Driving Licence</li>
            <li>Passport</li>
          </ul>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-4 md:p-6">
        {/* Stepper */}
        <div className="flex flex-col md:flex-row items-center justify-center space-y-4 md:space-y-0 md:space-x-2 lg:space-x-4 mb-8">
          {steps.map((s, index) => (
            <React.Fragment key={s.step}>
              <div className="flex items-center">
                <div className="flex flex-col items-center">
                  <span className="text-sm text-gray-600 mb-1">Step</span>
                  <button
                    onClick={() => setCurrentStep(s.step)}
                    className={`w-10 h-10 rounded-full text-sm font-semibold flex items-center justify-center
                  ${
                    currentStep === s.step
                      ? "bg-[#4BAF47] text-white"
                      : "border border-gray-400 text-black"
                  }`}
                  >
                    {s.step}
                  </button>
                  <span className="text-sm mt-1 text-center w-64 md:w-48 lg:w-64">
                    {s.label}
                  </span>
                </div>
              </div>
              {index < steps.length - 1 && (
                <div className="text-xl md:text-2xl lg:text-3xl text-gray-500 rotate-90 md:rotate-0">
                  →
                </div>
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Form Content */}
        <div className="mt-8">
          {currentStep === 1 && (
            <div className="max-w-3xl mx-auto p-6 bg-white rounded-xl ">
              {/* Section Header */}
              <div className="mb-8">
                 <h2 className="text-lg mb-4">1. Personal Information</h2>
              </div>

              {/* Form Content */}
              <div className="space-y-6">
                {/* Full Name */}
                <div>
                  <label
                    htmlFor="fullName"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    className={`border rounded p-2 w-full ${errors.fullName ? 'border-red-500' : ''}`}
                    placeholder="Enter your full name"
                    required
                  />
                  {errors.fullName && <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>}
                </div>

                {/* Contact Info Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Mobile Number */}
                  <div>
                    <label
                      htmlFor="phoneNumber"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Mobile Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      id="phoneNumber"
                      name="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={handleInputChange}
                      className={`border rounded p-2 w-full ${errors.phoneNumber ? 'border-red-500' : ''}`}
                      placeholder="98XXXXXXXX"
                      required
                    />
                    {errors.phoneNumber && <p className="text-red-500 text-sm mt-1">{errors.phoneNumber}</p>}
                  </div>

                  {/* Email */}
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className={`border rounded p-2 w-full ${errors.email ? 'border-red-500' : ''}`}
                      placeholder="your@email.com"
                      required
                    />
                    {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                  </div>
                </div>

                {/* Gender and Birth Date Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Gender */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Gender <span className="text-red-500">*</span>
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {["Male", "Female", "Other"].map((genderOption) => (
                        <button
                          key={genderOption}
                          type="button"
                          onClick={() => {
                            setFormData((prev) => ({
                              ...prev,
                              gender: genderOption,
                            }));
                            if (errors.gender) {
                              setErrors(prev => {
                                const newErrors = {...prev};
                                delete newErrors.gender;
                                return newErrors;
                              });
                            }
                          }}
                          className={`py-2.5 px-4 rounded-lg border transition-all ${
                            formData.gender === genderOption
                              ? "bg-green-500 text-white border-green-500"
                              : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                          }`}
                        >
                          {genderOption}
                        </button>
                      ))}
                    </div>
                    {errors.gender && <p className="text-red-500 text-sm mt-1">{errors.gender}</p>}
                  </div>

                  {/* Birth Date */}
                  <div>
                    <label
                      htmlFor="dateOfBirth"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Birth Date <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      id="dateOfBirth"
                      name="dateOfBirth"
                      value={formData.dateOfBirth}
                      onChange={handleInputChange}
                      className={`border rounded p-2 w-full ${errors.dateOfBirth ? 'border-red-500' : ''}`}
                      required
                    />
                    {errors.dateOfBirth && <p className="text-red-500 text-sm mt-1">{errors.dateOfBirth}</p>}
                  </div>
                </div>

                {/* Profile Photo Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Profile Photo <span className="text-red-500">*</span>
                  </label>
                  {errors.profilePhotoPath && <p className="text-red-500 text-sm mb-2">{errors.profilePhotoPath}</p>}
                  <div className={`flex flex-col md:flex-row items-center gap-6 p-4 border-2 border-dashed rounded-lg transition-colors ${
                    errors.profilePhotoPath ? 'border-red-500' : 'border-gray-300 hover:border-green-300'
                  }`}>
                    <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-gray-100 shadow-sm">
                      {profileImage ? (
                        <img
                          src={profileImage}
                          alt="Profile"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                          <svg
                            className="w-12 h-12 text-gray-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={1}
                              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                            />
                          </svg>
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col gap-3">
                      <label className="cursor-pointer">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleImageChange(e, "profile")}
                          className="hidden"
                        />
                        <span className="inline-flex items-center px-4 py-2.5 bg-green-500 text-white text-sm font-medium rounded-lg hover:bg-green-600 transition-colors">
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
                          {profileImage ? "Change Photo" : "Upload Photo"}
                        </span>
                      </label>

                      {profileImage && (
                        <button
                          type="button"
                          onClick={() => handleRemoveImage("profile")}
                          className="inline-flex items-center px-4 py-2.5 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-colors"
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

                      <p className="text-xs text-gray-500">
                        JPEG or PNG, max 5MB
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="max-w-3xl mx-auto p-6 bg-white rounded-xl">
              <h2 className="text-lg mb-4">2. Address</h2>
              <div className="flex flex-col md:flex-row gap-4 mt-3">
                <div className="flex flex-col w-full">
                  <label htmlFor="province" className="mb-1">
                    Province <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="province"
                    name="province"
                    value={formData.province}
                    onChange={handleInputChange}
                    className={`border rounded p-2 w-full ${errors.province ? 'border-red-500' : ''}`}
                  >
                    <option value="">Select Province</option>
                    <option value="Province 1">Province 1</option>
                    <option value="Province 2">Province 2</option>
                    <option value="Bagmati Province">Bagmati Province</option>
                    <option value="Gandaki Province">Gandaki Province</option>
                    <option value="Lumbini Province">Lumbini Province</option>
                    <option value="Karnali Province">Karnali Province</option>
                    <option value="Sudurpashchim Province">
                      Sudurpashchim Province
                    </option>
                  </select>
                  {errors.province && <p className="text-red-500 text-sm mt-1">{errors.province}</p>}
                </div>

                <div className="flex flex-col w-full">
                  <label htmlFor="district" className="mb-1">
                    District <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="district"
                    name="district"
                    value={formData.district}
                    onChange={handleInputChange}
                    className={`border rounded p-2 w-full ${errors.district ? 'border-red-500' : ''}`}
                  >
                    <option value="">Select District</option>
                    <option value="Kathmandu">Kathmandu</option>
                    <option value="Lalitpur">Lalitpur</option>
                    <option value="Bhaktapur">Bhaktapur</option>
                    <option value="Pokhara">Pokhara</option>
                    <option value="Chitwan">Chitwan</option>
                  </select>
                  {errors.district && <p className="text-red-500 text-sm mt-1">{errors.district}</p>}
                </div>
              </div>

              <div className="flex flex-col md:flex-row gap-4 mt-3">
                <div className="flex flex-col w-full">
                  <label htmlFor="municipality" className="mb-1">
                    Municipality / Rural Municipality <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="municipality"
                    name="municipality"
                    value={formData.municipality}
                    onChange={handleInputChange}
                    className={`border rounded p-2 w-full ${errors.municipality ? 'border-red-500' : ''}`}
                  />
                  {errors.municipality && <p className="text-red-500 text-sm mt-1">{errors.municipality}</p>}
                </div>

                <div className="flex flex-col w-full">
                  <label htmlFor="streetAddress" className="mb-1">
                    Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="streetAddress"
                    name="streetAddress"
                    value={formData.streetAddress}
                    onChange={handleInputChange}
                    className={`border rounded p-2 w-full ${errors.streetAddress ? 'border-red-500' : ''}`}
                  />
                  {errors.streetAddress && <p className="text-red-500 text-sm mt-1">{errors.streetAddress}</p>}
                </div>
              </div>
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex flex-col w-full mt-3">
                  <label htmlFor="ward" className="mb-1">
                    Ward Number
                  </label>
                  <input
                    type="number"
                    id="ward"
                    name="ward"
                    value={formData.ward}
                    onChange={handleInputChange}
                    className={`border rounded p-2 w-full ${errors.ward ? 'border-red-500' : ''}`}
                  />
                  {errors.ward && <p className="text-red-500 text-sm mt-1">{errors.ward}</p>}
                </div>

                <div className="flex flex-col w-full mt-3">
                  <label htmlFor="landmark" className="mb-1">
                    Landmark <span className="text-gray-600">(optional)</span>
                  </label>
                  <input
                    type="text"
                    id="landmark"
                    name="landmark"
                    value={formData.landmark}
                    onChange={handleInputChange}
                    className="border rounded p-2 w-full"
                  />
                </div>
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="max-w-3xl mx-auto p-6 bg-white rounded-xl">
              <h2 className="text-lg mb-4">
                3. Identification and Business Info
              </h2>
              <div className="flex flex-col md:flex-row gap-4 mt-3">
                <div className="flex flex-col w-full">
                  <label htmlFor="citizenshipNumber" className="mb-1">
                    Citizenship Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="citizenshipNumber"
                    name="citizenshipNumber"
                    value={formData.citizenshipNumber}
                    onChange={handleInputChange}
                    className={`border rounded p-2 w-full ${errors.citizenshipNumber ? 'border-red-500' : ''}`}
                  />
                  {errors.citizenshipNumber && <p className="text-red-500 text-sm mt-1">{errors.citizenshipNumber}</p>}
                </div>

                <div className="flex flex-col w-full">
                  <label htmlFor="panNumber" className="mb-1">
                    PAN Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="panNumber"
                    name="panNumber"
                    value={formData.panNumber}
                    onChange={handleInputChange}
                    className={`border rounded p-2 w-full ${errors.panNumber ? 'border-red-500' : ''}`}
                    placeholder="ABCDE1234F"
                  />
                  {errors.panNumber && <p className="text-red-500 text-sm mt-1">{errors.panNumber}</p>}
                </div>
              </div>
              <div className="mt-6">
                <div className="flex flex-col md:flex-row justify-between gap-6">
                  <div className="flex flex-col gap-4">
                    <h2 className="text-lg">Business Registration Image <span className="text-red-500">*</span></h2>
                    {errors.businessRegistrationImagePath && <p className="text-red-500 text-sm">{errors.businessRegistrationImagePath}</p>}
                    <div className={`flex flex-col md:flex-row items-center gap-6 p-4 border-2 rounded-lg ${
                      errors.businessRegistrationImagePath ? 'border-red-500' : 'border-dashed border-gray-300 hover:border-green-300'
                    }`}>
                      <div className="w-32 h-32 rounded overflow-hidden border border-gray-300">
                        {businessRegistrationImagePath ? (
                          <img
                            src={businessRegistrationImagePath}
                            alt="Business Registration"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
                            No Image
                          </div>
                        )}
                      </div>

                      <div className="grid grid-rows-2 gap-4">
                        <label className="cursor-pointer">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) =>
                              handleImageChange(e, "businessRegistrationImage")
                            }
                            className="hidden"
                          />
                          <span className="px-4 py-2 bg-green-500 text-white rounded text-sm">
                            Upload
                          </span>
                        </label>
                        <button
                          type="button"
                          onClick={() =>
                            handleRemoveImage("businessRegistrationImage")
                          }
                          disabled={!businessRegistrationImagePath}
                          className="px-3 py-2 border border-black text-black rounded text-sm hover:bg-green-500 hover:text-white transition disabled:opacity-50"
                        >
                          Remove
                        </button>
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
          <div className="flex gap-3 justify-center">
            <button
              disabled={currentStep === 1}
              onClick={() => setCurrentStep(currentStep - 1)}
              className="bg-[#EFBE44] p-2 w-32 rounded-full text-white text-1xl font-bold disabled:opacity-50"
            >
              Previous
            </button>
            <button
              disabled={isSubmitting}
              onClick={handleNext}
              className="bg-[#4BAF47] p-2 w-32 rounded-full text-white text-1xl font-bold disabled:opacity-50"
            >
              {isSubmitting
                ? "Submitting..."
                : currentStep === steps.length
                ? "Submit"
                : "Next"}
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default KYCform;