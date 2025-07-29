import { useNavigate } from "react-router-dom";
import { BuyerKycForm } from "../../../services/buyer/BuyerApiService";
import { ErrorMessageToast, SuccesfulMessageToast } from "../../../utils/Tostify.util";
import Footer from "./Footer";
import Header from "./Header";
import React, { useState } from "react";
import { useAuth } from "../../../Context/AuthContext";

const KYCform = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState("");
  const {user} = useAuth();
  const [errors, setErrors] = useState({});

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

  // Validation rules for each step
  const validateStep = (step) => {
    const newErrors = {};
    
    if (step === 1) {
      if (!formData.fullName.trim()) newErrors.fullName = "Full name is required";
      if (!formData.phoneNumber.trim()) newErrors.phoneNumber = "Phone number is required";
      else if (!/^\d{10}$/.test(formData.phoneNumber)) newErrors.phoneNumber = "Invalid phone number (10 digits required)";
      if (!formData.email.trim()) newErrors.email = "Email is required";
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = "Invalid email format";
      if (!formData.dateOfBirth) newErrors.dateOfBirth = "Date of birth is required";
      if (!formData.gender) newErrors.gender = "Gender is required";
      if (!formData.profilePhotoPath) newErrors.profilePhoto = "Profile photo is required";
    }
    
    if (step === 2) {
      if (!formData.province) newErrors.province = "Province is required";
      if (!formData.district) newErrors.district = "District is required";
      if (!formData.municipality) newErrors.municipality = "Municipality is required";
      if (!formData.streetAddress) newErrors.streetAddress = "Street address is required";
      if (!formData.ward) newErrors.ward = "Ward number is required";
      else if (isNaN(formData.ward) || formData.ward < 1 || formData.ward > 35) {
        newErrors.ward = "Ward must be between 1-35";
      }
    }
    
    if (step === 3) {
      if (!formData.citizenshipNumber) newErrors.citizenshipNumber = "Citizenship number is required";
      if (!formData.panNumber) newErrors.panNumber = "PAN number is required";
      if (!formData.citizenshipFrontImagePath) newErrors.citizenshipFrontImage = "Citizenship front image is required";
      if (!formData.citizenshipBackImagePath) newErrors.citizenshipBackImage = "Citizenship back image is required";
      if (!formData.panCardImagePath) newErrors.panCardImage = "PAN card image is required";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
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

  // Handle image uploads
  const handleImageChange = (e, imageType) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type and size
      if (!file.type.match('image.*')) {
        ErrorMessageToast("Please upload an image file");
        return;
      }
      if (file.size > 2 * 1024 * 1024) { // 2MB limit
        ErrorMessageToast("Image size should be less than 2MB");
        return;
      }

      const imageUrl = URL.createObjectURL(file);

      switch (imageType) {
        case "profile":
          setProfileImage(imageUrl);
          setFormData((prev) => ({ ...prev, profilePhotoPath: file.name }));
          if (errors.profilePhoto) {
            setErrors(prev => {
              const newErrors = {...prev};
              delete newErrors.profilePhoto;
              return newErrors;
            });
          }
          break;
        case "citizenshipFront":
          setCitizenshipFrontImage(imageUrl);
          setFormData((prev) => ({
            ...prev,
            citizenshipFrontImagePath: file.name,
          }));
          if (errors.citizenshipFrontImage) {
            setErrors(prev => {
              const newErrors = {...prev};
              delete newErrors.citizenshipFrontImage;
              return newErrors;
            });
          }
          break;
        case "citizenshipBack":
          setCitizenshipBackImage(imageUrl);
          setFormData((prev) => ({
            ...prev,
            citizenshipBackImagePath: file.name,
          }));
          if (errors.citizenshipBackImage) {
            setErrors(prev => {
              const newErrors = {...prev};
              delete newErrors.citizenshipBackImage;
              return newErrors;
            });
          }
          break;
        case "panCard":
          setPanCardImage(imageUrl);
          setFormData((prev) => ({ ...prev, panCardImagePath: file.name }));
          if (errors.panCardImage) {
            setErrors(prev => {
              const newErrors = {...prev};
              delete newErrors.panCardImage;
              return newErrors;
            });
          }
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
        setErrors(prev => ({...prev, profilePhoto: "Profile photo is required"}));
        break;
      case "citizenshipFront":
        setCitizenshipFrontImage(null);
        setFormData((prev) => ({ ...prev, citizenshipFrontImagePath: "" }));
        setErrors(prev => ({...prev, citizenshipFrontImage: "Citizenship front image is required"}));
        break;
      case "citizenshipBack":
        setCitizenshipBackImage(null);
        setFormData((prev) => ({ ...prev, citizenshipBackImagePath: "" }));
        setErrors(prev => ({...prev, citizenshipBackImage: "Citizenship back image is required"}));
        break;
      case "panCard":
        setPanCardImage(null);
        setFormData((prev) => ({ ...prev, panCardImagePath: "" }));
        setErrors(prev => ({...prev, panCardImage: "PAN card image is required"}));
        break;
    }
  };

  // Handle form submission
  const handleSubmit = async () => {
    setIsSubmitting(true);
    setSubmitMessage("");

    try {
      // Final validation before submission
      if (!validateStep(currentStep)) {
        setIsSubmitting(false);
        return;
      }

      // Convert phone number to integer
      const submitData = {
        ...formData,
        phoneNumber: parseInt(formData.phoneNumber),
        ward: formData.ward ? parseInt(formData.ward) : null,
      };

      const response = await BuyerKycForm(submitData);
      SuccesfulMessageToast("KYC form submitted successfully!");
      navigate("/")
    } catch (error) {
      ErrorMessageToast("Failed to save kyc");
      setIsSubmitting(false);
    } 
  };

  // Navigate to next step or submit
  const handleNext = () => {
    // Validate current step before proceeding
    if (validateStep(currentStep)) {
      if (currentStep < steps.length) {
        setCurrentStep(currentStep + 1);
      } else {
        handleSubmit();
      }
    }
  };

  // Helper function to check if a field has error
  const hasError = (fieldName) => {
    return errors[fieldName] ? "border-red-500" : "";
  };

  return (
    <>
      <Header />
      <div className="flex justify-center">
        <div className="bg-[#4BAF47] text-white p-4 md:p-8 max-w-4xl w-full">
          <h5>Almost done, please follow the remarks below to complete KYC</h5>
          <p>Please upload photo and one of the following documents:</p>
          <ul>
            <li>Business Registration Certificate</li>
            <li>Password Size Photo</li>
            <li>PAN Cart</li>
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
                className={`border rounded p-2 w-full mb-1 ${hasError('fullName')}`}
                required
              />
              {errors.fullName && <p className="text-red-500 text-sm mb-2">{errors.fullName}</p>}

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
                    className={`border rounded p-2 w-full ${hasError('phoneNumber')}`}
                    required
                  />
                  {errors.phoneNumber && <p className="text-red-500 text-sm">{errors.phoneNumber}</p>}
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
                    className={`border rounded p-2 w-full ${hasError('email')}`}
                    required
                  />
                  {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
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
                  {errors.gender && <p className="text-red-500 text-sm">{errors.gender}</p>}
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
                    className={`border rounded p-2 w-full ${hasError('dateOfBirth')}`}
                    required
                  />
                  {errors.dateOfBirth && <p className="text-red-500 text-sm">{errors.dateOfBirth}</p>}
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
                  {errors.profilePhoto && <p className="text-red-500 text-sm">{errors.profilePhoto}</p>}
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
                    className={`border rounded p-2 w-full ${hasError('province')}`}
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
                  {errors.province && <p className="text-red-500 text-sm">{errors.province}</p>}
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
                    className={`border rounded p-2 w-full ${hasError('district')}`}
                  >
                    <option value="">Select District</option>
                    <option value="Kathmandu">Kathmandu</option>
                    <option value="Lalitpur">Lalitpur</option>
                    <option value="Bhaktapur">Bhaktapur</option>
                    <option value="Pokhara">Pokhara</option>
                    <option value="Chitwan">Chitwan</option>
                  </select>
                  {errors.district && <p className="text-red-500 text-sm">{errors.district}</p>}
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
                    className={`border rounded p-2 w-full ${hasError('municipality')}`}
                  />
                  {errors.municipality && <p className="text-red-500 text-sm">{errors.municipality}</p>}
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
                    className={`border rounded p-2 w-full ${hasError('streetAddress')}`}
                  />
                  {errors.streetAddress && <p className="text-red-500 text-sm">{errors.streetAddress}</p>}
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
                    className={`border rounded p-2 w-full ${hasError('ward')}`}
                  />
                  {errors.ward && <p className="text-red-500 text-sm">{errors.ward}</p>}
                </div>

                <div className="flex flex-col w-full mt-3">
                  <label htmlFor="tole" className="mb-1">
                    Tole / Street
                  </label>
                  <input
                    type="text"
                    id="tole"
                    name="tole"
                    value={formData.tole}
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
                    className={`border rounded p-2 w-full ${hasError('citizenshipNumber')}`}
                  />
                  {errors.citizenshipNumber && <p className="text-red-500 text-sm">{errors.citizenshipNumber}</p>}
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
                    className={`border rounded p-2 w-full ${hasError('panNumber')}`}
                  />
                  {errors.panNumber && <p className="text-red-500 text-sm">{errors.panNumber}</p>}
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
                    {errors.citizenshipFrontImage && <p className="text-red-500 text-sm">{errors.citizenshipFrontImage}</p>}
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
                    {errors.panCardImage && <p className="text-red-500 text-sm">{errors.panCardImage}</p>}
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
                {errors.citizenshipBackImage && <p className="text-red-500 text-sm">{errors.citizenshipBackImage}</p>}
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
}

export default KYCform;