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
    citizenshipFrontImagePath: "",
    citizenshipBackImagePath: "",
    panNumber: "",
    panCardImagePath: "",
  });

  // Image states
  const [profileImage, setProfileImage] = useState(
    "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
  );
  const [citizenshipFrontImage, setCitizenshipFrontImage] = useState(null);
  const [citizenshipBackImage, setCitizenshipBackImage] = useState(null);
  const [panCardImage, setPanCardImage] = useState(null);

  const steps = [
    { step: 1, label: "Personal Information" },
    { step: 2, label: "Address" },
    { step: 3, label: "Identification and Business Info" },
  ];

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
      } else if (type === "citizenshipFront") {
        setFormData((prev) => ({
          ...prev,
          citizenshipFrontImagePath: result.url,
        }));
      } else if (type === "citizenshipBack") {
        setFormData((prev) => ({
          ...prev,
          citizenshipBackImagePath: result.url,
        }));
      } else if (type === "panCard") {
        setFormData((prev) => ({ ...prev, panCardImagePath: result.url }));
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
  };

  // Handle image uploads with Cloudinary integration
  const handleImageChange = async (e, imageType) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);

      switch (imageType) {
        case "profile":
          setProfileImage(imageUrl);
          await handleImageUpload(file, "profile");
          break;
        case "citizenshipFront":
          setCitizenshipFrontImage(imageUrl);
          await handleImageUpload(file, "citizenshipFront");
          break;
        case "citizenshipBack":
          setCitizenshipBackImage(imageUrl);
          await handleImageUpload(file, "citizenshipBack");
          break;
        case "panCard":
          setPanCardImage(imageUrl);
          await handleImageUpload(file, "panCard");
          break;
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
      case "citizenshipFront":
        setCitizenshipFrontImage(null);
        setFormData((prev) => ({ ...prev, citizenshipFrontImagePath: "" }));
        break;
      case "citizenshipBack":
        setCitizenshipBackImage(null);
        setFormData((prev) => ({ ...prev, citizenshipBackImagePath: "" }));
        break;
      case "panCard":
        setPanCardImage(null);
        setFormData((prev) => ({ ...prev, panCardImagePath: "" }));
        break;
    }
  };

  // Handle form submission
  const handleSubmit = async () => {
    setIsSubmitting(true);
    setSubmitMessage("");

    try {
      // Validate required fields
      if (
        !formData.fullName ||
        !formData.phoneNumber ||
        !formData.email ||
        !formData.dateOfBirth
      ) {
        throw new Error("Please fill in all required fields");
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
      ErrorMessageToast("Failed to save kyc");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Navigate to next step or submit
  const handleNext = () => {
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
            <div>
              <h2 className="text-lg mb-4">1. Personal Information</h2>
              <label htmlFor="fullName" className="mb-1">
                Full Name
              </label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
                className="border rounded p-2 w-full mb-2"
                required
              />
              <div className="flex flex-col md:flex-row gap-4 mt-3">
                <div className="flex flex-col w-full">
                  <label htmlFor="phoneNumber" className="mb-1">
                    Mobile Number
                  </label>
                  <input
                    type="tel"
                    id="phoneNumber"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleInputChange}
                    className="border rounded p-2 w-full"
                    required
                  />
                </div>

                <div className="flex flex-col w-full">
                  <label htmlFor="email" className="mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="border rounded p-2 w-full"
                    required
                  />
                </div>
              </div>
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex flex-col w-full mt-3">
                  <label className="mb-1">Gender</label>
                  <div className="flex border rounded">
                    <button
                      type="button"
                      onClick={() =>
                        setFormData((prev) => ({ ...prev, gender: "Male" }))
                      }
                      className={`px-4 py-2 ${
                        formData.gender === "Male"
                          ? "bg-green-500 rounded text-white"
                          : "bg-white"
                      }`}
                    >
                      Male
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setFormData((prev) => ({ ...prev, gender: "Female" }))
                      }
                      className={`px-4 py-2 ${
                        formData.gender === "Female"
                          ? "bg-green-500 rounded text-white"
                          : "bg-white"
                      }`}
                    >
                      Female
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setFormData((prev) => ({ ...prev, gender: "Other" }))
                      }
                      className={`px-4 py-2 ${
                        formData.gender === "Other"
                          ? "bg-green-500 rounded text-white"
                          : "bg-white"
                      }`}
                    >
                      Other
                    </button>
                  </div>
                </div>

                <div className="flex flex-col w-full mt-3">
                  <label htmlFor="dateOfBirth" className="mb-1">
                    Birth Date
                  </label>
                  <input
                    type="date"
                    id="dateOfBirth"
                    name="dateOfBirth"
                    value={formData.dateOfBirth}
                    onChange={handleInputChange}
                    className="border rounded p-2 w-full"
                    required
                  />
                </div>

                <div className="flex flex-col w-full mt-3">
                  <h2 className="text-lg">Profile Photo Upload</h2>
                  <div className="flex flex-col md:flex-row items-center gap-6">
                    <div className="w-32 h-32 rounded overflow-hidden border border-gray-300">
                      <img
                        src={profileImage}
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div className="grid grid-rows-2 gap-4">
                      <label className="cursor-pointer mt-1">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleImageChange(e, "profile")}
                          className="hidden"
                        />
                        <span className="px-4 py-2 bg-green-500 text-white rounded text-sm">
                          Upload
                        </span>
                      </label>
                      <button
                        type="button"
                        onClick={() => handleRemoveImage("profile")}
                        className="px-3 py-2 border border-black text-black rounded text-sm hover:bg-green-500 hover:text-white transition"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div>
              <h2 className="text-lg mb-4">2. Address</h2>
              <div className="flex flex-col md:flex-row gap-4 mt-3">
                <div className="flex flex-col w-full">
                  <label htmlFor="province" className="mb-1">
                    Province
                  </label>
                  <select
                    id="province"
                    name="province"
                    value={formData.province}
                    onChange={handleInputChange}
                    className="border rounded p-2 w-full"
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
                </div>

                <div className="flex flex-col w-full">
                  <label htmlFor="district" className="mb-1">
                    District
                  </label>
                  <select
                    id="district"
                    name="district"
                    value={formData.district}
                    onChange={handleInputChange}
                    className="border rounded p-2 w-full"
                  >
                    <option value="">Select District</option>
                    <option value="Kathmandu">Kathmandu</option>
                    <option value="Lalitpur">Lalitpur</option>
                    <option value="Bhaktapur">Bhaktapur</option>
                    <option value="Pokhara">Pokhara</option>
                    <option value="Chitwan">Chitwan</option>
                  </select>
                </div>
              </div>

              <div className="flex flex-col md:flex-row gap-4 mt-3">
                <div className="flex flex-col w-full">
                  <label htmlFor="municipality" className="mb-1">
                    Municipality / Rural Municipality
                  </label>
                  <input
                    type="text"
                    id="municipality"
                    name="municipality"
                    value={formData.municipality}
                    onChange={handleInputChange}
                    className="border rounded p-2 w-full"
                  />
                </div>

                <div className="flex flex-col w-full">
                  <label htmlFor="streetAddress" className="mb-1">
                    Address
                  </label>
                  <input
                    type="text"
                    id="streetAddress"
                    name="streetAddress"
                    value={formData.streetAddress}
                    onChange={handleInputChange}
                    className="border rounded p-2 w-full"
                  />
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
                    className="border rounded p-2 w-full"
                  />
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
            <div>
              <h2 className="text-lg mb-4">
                3. Identification and Business Info
              </h2>
              <div className="flex flex-col md:flex-row gap-4 mt-3">
                <div className="flex flex-col w-full">
                  <label htmlFor="citizenshipNumber" className="mb-1">
                    Citizenship Number
                  </label>
                  <input
                    type="text"
                    id="citizenshipNumber"
                    name="citizenshipNumber"
                    value={formData.citizenshipNumber}
                    onChange={handleInputChange}
                    className="border rounded p-2 w-full"
                  />
                </div>

                <div className="flex flex-col w-full">
                  <label htmlFor="panNumber" className="mb-1">
                    PAN Number
                  </label>
                  <input
                    type="text"
                    id="panNumber"
                    name="panNumber"
                    value={formData.panNumber}
                    onChange={handleInputChange}
                    className="border rounded p-2 w-full"
                  />
                </div>
              </div>
              <div className="mt-6">
                <div className="flex flex-col md:flex-row justify-between gap-6">
                  <div className="flex flex-col gap-4">
                    <h2 className="text-lg">
                      Citizen Card Image{" "}
                      <span className="text-gray-500">(Front)</span>
                    </h2>
                    <div className="flex flex-col md:flex-row items-center gap-6">
                      <div className="w-32 h-32 rounded overflow-hidden border border-gray-300">
                        {citizenshipFrontImage ? (
                          <img
                            src={citizenshipFrontImage}
                            alt="Citizenship Front"
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
                              handleImageChange(e, "citizenshipFront")
                            }
                            className="hidden"
                          />
                          <span className="px-4 py-2 bg-green-500 text-white rounded text-sm">
                            Upload
                          </span>
                        </label>
                        <button
                          type="button"
                          onClick={() => handleRemoveImage("citizenshipFront")}
                          disabled={!citizenshipFrontImage}
                          className="px-3 py-2 border border-black text-black rounded text-sm hover:bg-green-500 hover:text-white transition disabled:opacity-50"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-4">
                    <h2 className="text-lg">Pan Card Image</h2>
                    <div className="flex flex-col md:flex-row items-center gap-6">
                      <div className="w-32 h-32 rounded overflow-hidden border border-gray-300">
                        {panCardImage ? (
                          <img
                            src={panCardImage}
                            alt="PAN Card"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
                            No Image
                          </div>
                        )}
                      </div>

                      <div className="grid grid-rows-2 gap-4">
                        <label className="cursor-pointer mt-1">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleImageChange(e, "panCard")}
                            className="hidden"
                          />
                          <span className="px-4 py-2 bg-green-500 text-white rounded text-sm">
                            Upload
                          </span>
                        </label>
                        <button
                          type="button"
                          onClick={() => handleRemoveImage("panCard")}
                          disabled={!panCardImage}
                          className="px-3 py-2 border border-black text-black rounded text-sm hover:bg-green-500 hover:text-white transition disabled:opacity-50"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-6">
                <h2 className="text-lg mb-4">
                  Citizen Card Image{" "}
                  <span className="text-gray-500">(Back)</span>
                </h2>
                <div className="flex flex-col md:flex-row items-center gap-6">
                  <div className="w-32 h-32 rounded overflow-hidden border border-gray-300">
                    {citizenshipBackImage ? (
                      <img
                        src={citizenshipBackImage}
                        alt="Citizenship Back"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
                        No Image
                      </div>
                    )}
                  </div>

                  <div className="grid grid-rows-2 gap-4">
                    <label className="cursor-pointer mt-1">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) =>
                          handleImageChange(e, "citizenshipBack")
                        }
                        className="hidden"
                      />
                      <span className="px-4 py-2 bg-green-500 text-white rounded text-sm">
                        Upload
                      </span>
                    </label>
                    <button
                      type="button"
                      onClick={() => handleRemoveImage("citizenshipBack")}
                      disabled={!citizenshipBackImage}
                      className="px-3 py-2 border border-black text-black rounded text-sm hover:bg-green-500 hover:text-white transition disabled:opacity-50"
                    >
                      Remove
                    </button>
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
