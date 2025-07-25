import React, { useState } from "react";
import { fillFarmerKyc } from "../../../services/farmer/farmerApiService";
import {
  ErrorMessageToast,
  SuccesfulMessageToast,
} from "../../../utils/Tostify.util";

import { MapContainer, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "../../../App.css"
import AdminMapComponent from "../Component/map/AdminMapComponent";

const FarmerKYCform = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [gender, setGender] = useState("");
  const [citizenshipFrontImage, setCitizenshipFrontImage] = useState(null);
  const [citizenshipBackImage, setCitizenshipBackImage] = useState(null);
  const [panCardImage, setPanCardImage] = useState(null);
  const [farmImage, setFarmImage] = useState(null);
  const [certificateImage, setCertificateImage] = useState(null);
  const [image, setImage] = useState(
    "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
  );


  const [form, setForm] = useState({
    // Personal & Identity Details
    dateOfBirth: "",
    gender: "",
    citizenshipNumber: "",
    citizenshipIssuedDistrict: "",
    citizenshipFrontImagePath: "",
    citizenshipBackImagePath: "",
    permanentAddress: "",
    province: "",
    district: "",
    municipality: "",
    wardNumber: "",
    tole: "",

    // Farm Details
    gpsCoordinates: "",
    farmSize: "",
    farmSizeUnit: "Ropani",
    primaryCrops: "",
    seasonalCalendar: "",
    annualProductionCapacity: "",

    // Experience Details
    yearsOfExperience: "",
    farmingType: "",
    certifications: "",
    supportingDocsPath: "",

    // Bank Details
    accountName: "",
    accountNumber: "",
    bankName: "",
    branchName: "",
    panNumber: "",
    panCardImagePath: "",
    esewaId: "",
    khaltiId: "",
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

      // Update the corresponding image path in the form state
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
      } else if (type === "panCard") {
        setForm((prev) => ({ ...prev, panCardImagePath: result.url }));
      } else if (type === "certificate") {
        setForm((prev) => ({ ...prev, certifications: result.url }));
      }

      return result.url;
    } catch (error) {
      console.error("Error uploading image:", error);
      return null;
    }
  };

  const handleCitizenshipFrontChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setCitizenshipFrontImage(URL.createObjectURL(file));
      await handleImageUpload(file, "citizenshipFront");
    }
  };

  const handleCitizenshipBackChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setCitizenshipBackImage(URL.createObjectURL(file));
      await handleImageUpload(file, "citizenshipBack");
    }
  };

  const handlePanCardChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setPanCardImage(URL.createObjectURL(file));
      await handleImageUpload(file, "panCard");
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
    // Here you would typically send the form data to your backend API
    console.log("Submitting form:", form);

    try {
      const response = await fillFarmerKyc(form);
      console.log("KYC submitted successfully:", response);
      SuccesfulMessageToast("KYC submitted successfully");
    } catch (error) {
      console.error("Error submitting KYC:", error);
      // alert("Error submitting KYC. Please try again.");
      ErrorMessageToast("Error submitting KYC. Please try again.");
    }
  };

  const handleLocationSelect = (latlng) => {
    setLatitude(latlng.lat);
    setLongitude(latlng.lng);
    form.setFieldsValue({
      latitude: latlng.lat,
      longitude: latlng.lng,
    });
  };

  const handleRemove = () => {
    setImage(null);
  };
  return (
    <>
      <div className="">
        <div className="flex justify-center">
          <div className="bg-[#4BAF47] text-white p-4 md:p-8 max-w-4xl w-full">
            <h5>
              Almost done, please follow the remarks below to complete KYC
            </h5>
            <p>Please upload photo and one of the following documents :</p>
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
                {/* Arrow → */}
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
                <label form="name" className="mb-1 font-semibold">
                  Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  onChange={handleChange}
                  value={form.name}
                  className="border rounded-full p-2 w-full mb-2"
                />
                <div className="flex flex-col md:flex-row gap-4 mt-3">
                  <div className="flex flex-col w-full">
                    <label htmlFor="number" className="mb-1 font-semibold">
                      Mobile Number
                    </label>
                    <input
                      type="text"
                      id="number"
                      onChange={handleChange}
                      value={form.number}
                      className="border rounded-full p-2 w-full"
                    />
                  </div>

                  <div className="flex flex-col w-full">
                    <label htmlFor="email" className="mb-1 font-semibold">
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      onChange={handleChange}
                      value={form.email}
                      className="border rounded-full p-2 w-full"
                    />
                  </div>
                </div>
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex flex-col w-full mt-3">
                    <label htmlFor="date" className="mb-1 font-semibold">
                      Permanent Address
                    </label>
                    <input
                      type="text"
                      id="address"
                      name="permanentAddress"
                      onChange={handleChange}
                      value={form.permanentAddress}
                      className="border rounded-full p-2 w-full"
                    />
                  </div>

                  <div className="flex flex-col w-full mt-3">
                    <label className="mb-1 font-semibold">Gender</label>
                    <div className="flex border rounded-full">
                      <button
                        type="button"
                        onClick={() =>
                          setForm((prevForm) => ({
                            ...prevForm,
                            gender: "Male",
                          }))
                        }
                        className={`px-4 py-2 ${
                          form.gender === "Male"
                            ? "bg-green-500 rounded-full text-white"
                            : "bg-white "
                        }`}
                      >
                        {" "}
                        Male{" "}
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          setForm((prevForm) => ({
                            ...prevForm,
                            gender: "Female",
                          }))
                        }
                        className={`px-4 py-2 ${
                          form.gender === "Female"
                            ? "bg-green-500 rounded-full text-white"
                            : "bg-white"
                        }`}
                      >
                        {" "}
                        Female{" "}
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          setForm((prevForm) => ({
                            ...prevForm,
                            gender: "Other",
                          }))
                        }
                        className={`px-4 py-2 ${
                          form.gender === "Other"
                            ? "bg-green-500 rounded-full text-white"
                            : "bg-white"
                        }`}
                      >
                        {" "}
                        Other{" "}
                      </button>
                    </div>
                  </div>

                  <div className="flex flex-col w-full mt-3">
                    <label htmlFor="date" className="mb-1 font-semibold">
                      Birth Date
                    </label>
                    <input
                      type="date"
                      id="date"
                      name="dateOfBirth"
                      onChange={handleChange}
                      value={form.dateOfBirth}
                      placeholder="Enter email"
                      className="border rounded-full p-2 w-full"
                    />
                  </div>
                </div>
                <div className="flex flex-col md:flex-row gap-4 mt-3">
                  <div className="flex flex-col w-full">
                    <label htmlFor="number" className="mb-1 font-semibold">
                      Citizenship Number
                    </label>
                    <input
                      type="text"
                      id="number"
                      name="citizenshipNumber"
                      onChange={handleChange}
                      value={form.citizenshipNumber}
                      className="border rounded-full p-2 w-full"
                    />
                  </div>

                  <div className="flex flex-col w-full">
                    <label
                      htmlFor="citizendistrict"
                      className="mb-1 font-semibold"
                    >
                      Citizenship Issued District
                    </label>
                    <select
                      id="citizenshipIssuedDistrict"
                      name="citizenshipIssuedDistrict"
                      onChange={handleChange}
                      value={form.citizenshipIssuedDistrict}
                      className="border rounded-full p-2 w-full"
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
                <h2 className="text-lg py-3">
                  Upload Citizenship Document{" "}
                  <span className="">(Front & Back)</span>
                </h2>
                <div className="flex flex-col md:flex-row gap-8">
                  <div>
                    <div className="flex flex-col md:flex-row items-center gap-6 border-1 border-black rounded p-2">
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
                        <label className="cursor-pointer mt-1">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleCitizenshipFrontChange}
                            className="hidden"
                          />
                          <span className="px-4 py-2 bg-green-500 text-white rounded text-sm">
                            Upload
                          </span>
                        </label>
                        <button
                          onClick={() => {
                            setCitizenshipFrontImage(null);
                            setForm((prev) => ({
                              ...prev,
                              citizenshipFrontImagePath: "",
                            }));
                          }}
                          disabled={!citizenshipFrontImage}
                          className="px-3 py-2 border border-black text-black rounded text-sm hover:bg-green-500 hover:text-white transition disabled:opacity-50"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                    <h5 className="text-lg py-3 text-center">Front</h5>
                  </div>

                  <div>
                    <div className="flex flex-col md:flex-row items-center gap-6 border-1 border-black rounded p-2">
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
                            onChange={handleCitizenshipBackChange}
                            className="hidden"
                          />
                          <span className="px-4 py-2 bg-green-500 text-white rounded text-sm">
                            Upload
                          </span>
                        </label>
                        <button
                          onClick={() => {
                            setCitizenshipBackImage(null);
                            setForm((prev) => ({
                              ...prev,
                              citizenshipBackImagePath: "",
                            }));
                          }}
                          disabled={!citizenshipBackImage}
                          className="px-3 py-2 border border-black text-black rounded text-sm hover:bg-green-500 hover:text-white transition disabled:opacity-50"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                    <h5 className="text-lg py-3 text-center">Back</h5>
                  </div>
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div>
                <div className="flex justify-between">
                  <div>
                    <h2 className="text-lg mb-4">2. Address & Farm Details</h2>
                  </div>
                  {/* <div className="relative w-64 mb-4 max-w-sm mr-6 shadow rounded ">
                    <input
                      type="text"
                      placeholder="Search Google Maps"
                      className="w-64 p-1 border rounded outline-none"
                      aria-label="Search"
                    />
                    <i className="fas fa-search fa-lg absolute right-3 mt-3 text-gray-500 pointer-events-none"></i>
                  </div> */}
                </div>
                <div className="flex">
                  <div className="flex flex-col w-full mt-3">
                    <label htmlFor="crops" className="mb-1 font-semibold">
                      Province
                    </label>
                    <select
                      id="province"
                      name="province"
                      onChange={handleChange}
                      value={form.province}
                      className="border rounded-full p-2 w-full"
                    >
                      <option value="">Select</option>
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
                  <div className="flex flex-col w-full mt-3">
                    <label htmlFor="crops" className="mb-1 font-semibold">
                      District
                    </label>
                    <select
                      id="district"
                      name="district"
                      onChange={handleChange}
                      value={form.district}
                      className="border rounded-full p-2 w-full"
                    >
                      <option value="">Select</option>
                      <option value="Kathmandu">Kathmandu</option>
                      <option value="Lalitpur">Lalitpur</option>
                      <option value="Bhaktapur">Bhaktapur</option>
                      <option value="Chitwan">Chitwan</option>
                      <option value="Rupandehi">Rupandehi</option>
                      <option value="Nepalgunj">Nepalgunj</option>
                    </select>
                  </div>
                </div>
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex flex-col w-full mt-3">
                    <label
                      htmlFor="municipality"
                      className="mb-1 font-semibold"
                    >
                      Municipality
                    </label>
                    <select
                      id="municipality"
                      name="municipality"
                      onChange={handleChange}
                      value={form.municipality}
                      className="border rounded-full p-2 w-full"
                    >
                      <option value="">Select</option>
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

                  <div className="flex flex-col w-full mt-3">
                    <label htmlFor="ward" className="mb-1 font-semibold">
                      Ward Number
                    </label>
                    <input
                      type="number"
                      id="wardNumber"
                      name="wardNumber"
                      onChange={handleChange}
                      value={form.wardNumber}
                      className="border rounded-full p-2 w-full"
                      placeholder="Enter ward number"
                    />
                  </div>
                </div>

                <div className="flex">
                  <div className="flex flex-col w-full mt-3">
                    <label htmlFor="tole" className="mb-1 font-semibold">
                      Tole
                    </label>
                    <input
                      type="text"
                      id="tole"
                      name="tole"
                      onChange={handleChange}
                      value={form.tole}
                      className="border rounded-full p-2 w-full"
                      placeholder="Enter tole name"
                    />
                  </div>

                  {/* You can add another field here if needed to maintain the 2-column layout */}
                  <div className="flex flex-col w-full mt-3">
                    {/* Empty div to maintain layout, or add another field */}
                  </div>
                </div>

                <div className="mt-7">
                  <h2 className="text-lg mb-4">Farm Details</h2>
                </div>
                <div className="flex flex-col md:flex-row gap-4 mt-2">
                  <div className="flex flex-col w-full mt-3">
                    <label htmlFor="capacity" className="mb-1 font-semibold">
                      Total Annual Production Capacity
                    </label>
                    <input
                      type="text"
                      id="annualProductionCapacity"
                      name="annualProductionCapacity"
                      onChange={handleChange}
                      value={form.annualProductionCapacity}
                      className="border rounded-full p-2 w-full"
                      placeholder="e.g., 2000 KG"
                    />
                  </div>

                  <div className="flex flex-col w-full mt-3">
                    <label htmlFor="crops" className="mb-1 font-semibold">
                      Primary Crops
                    </label>
                    <input
                      type="text"
                      id="primaryCrops"
                      name="primaryCrops"
                      onChange={handleChange}
                      value={form.primaryCrops}
                      className="border rounded-full p-2 w-full"
                      placeholder="e.g., Rice, Wheat, Maize"
                    />
                  </div>

                  <div className="flex flex-col w-full mt-3">
                    <label htmlFor="size" className="mb-1 font-semibold">
                      Farm Size
                      <span className="text-gray-600">
                        (in ropani / hectares)
                      </span>
                    </label>
                    <div className="flex items-center border rounded-full p-2 w-32">
                      <input
                        type="text"
                        id="farmSize"
                        name="farmSize"
                        onChange={handleChange}
                        value={form.farmSize}
                        className="outline-none w-10 placeholder-black font-semibold"
                      />
                      <select
                        onChange={handleChange}
                        name="farmSizeUnit"
                        value={form.farmSizeUnit}
                        className="outline-none bg-transparent"
                      >
                        <option value="Ropani">Ropani</option>
                        <option value="Hectares">Hectares</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {currentStep === 3 && (
              <div>
                <div className="flex justify-between">
                  <h2 className="text-lg mb-4">
                    3. Farming Experience{" "}
                    <span className="text-gray-600">(10 Years)</span>
                  </h2>
                  <h2 className="text-lg mb-4 mr-60 text-left">Farm picture</h2>
                </div>

                <div className="flex flex-col-2 gap-4 justify-content-between ">
                  <div className="flow flow-rows-2 md:flex-row-2 space-y-4 mt-3">
                    <div className="flex flex-col">
                      <label
                        htmlFor="yearsOfExperience"
                        className="mb-1 font-semibold"
                      >
                        Years of Experience
                      </label>
                      <input
                        type="number"
                        id="yearsOfExperience"
                        name="yearsOfExperience"
                        onChange={handleChange}
                        value={form.yearsOfExperience}
                        className="border rounded-full p-2 w-full"
                        placeholder="e.g., 5"
                      />
                    </div>

                    <div className="flex flex-col w-full">
                      <label
                        htmlFor="farmingType"
                        className="mb-1 font-semibold"
                      >
                        Farming Type
                      </label>
                      <select
                        id="farmingType"
                        name="farmingType"
                        onChange={handleChange}
                        value={form.farmingType}
                        className="border rounded-full p-2 w-full"
                      >
                        <option value="">Select</option>
                        <option value="Organic">Organic</option>
                        <option value="Traditional">Traditional</option>
                        <option value="Commercial">Commercial</option>
                        <option value="Mixed">Mixed</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex flex-col w-full md:w-1/2 items-center">
                    <div className="flex flex-col md:flex-row items-center gap-6 border-1 border-black rounded p-2">
                      <div className="w-32 h-32 rounded overflow-hidden border border-gray-300">
                        {certificateImage ? (
                          <img
                            src={certificateImage}
                            alt="Certificate"
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
                            name="certifications"
                            onChange={handleCertificateChange}
                            className="hidden"
                          />
                          <span className="px-4 py-2 bg-green-500 text-white rounded text-sm">
                            Upload
                          </span>
                        </label>
                        <button
                          onClick={() => {
                            setCertificateImage(null);
                            setForm((prev) => ({
                              ...prev,
                              certifications: "",
                            }));
                          }}
                          disabled={!certificateImage}
                          className="px-3 py-2 border border-black text-black rounded text-sm hover:bg-green-500 hover:text-white transition disabled:opacity-50"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                    <h5 className="text-lg py-3 text-center">
                      Certificate Image
                    </h5>
                  </div>
                </div>
                <h2 className="text-lg mb-4">4. Bank & Payment Details</h2>
                <div className="flex flex-col md:flex-row gap-4 mt-3">
                  <div className="flex flex-col w-full">
                    <label htmlFor="number" className="mb-1 font-semibold">
                      Bank Name
                    </label>
                    <input
                      type="text"
                      id="accountName"
                      name="bankName"
                      onChange={handleChange}
                      value={form.bankName}
                      className="border rounded-full p-2 w-full"
                      placeholder="Bank name"
                    />
                  </div>
                  <div className="flex flex-col w-full">
                    <label htmlFor="number" className="mb-1 font-semibold">
                      Bank Account Name
                    </label>
                    <input
                      type="text"
                      id="accountName"
                      name="accountName"
                      onChange={handleChange}
                      value={form.accountName}
                      className="border rounded-full p-2 w-full"
                      placeholder="Account holder name"
                    />
                  </div>

                  <div className="flex flex-col w-full">
                    <label htmlFor="email" className="mb-1 font-semibold">
                      Bank Account Number
                    </label>
                    <input
                      type="text"
                      id="accountNumber"
                      name="accountNumber"
                      onChange={handleChange}
                      value={form.accountNumber}
                      className="border rounded-full p-2 w-full"
                      placeholder="Account number"
                    />
                  </div>
                </div>

                <div className="flex flex-col md:flex-row gap-4 mt-3">
                  <div className="flex flex-col w-full">
                    <label htmlFor="branchName" className="mb-1 font-semibold">
                      Branch Name
                    </label>
                    <input
                      type="text"
                      id="branchName"
                      name="branchName"
                      onChange={handleChange}
                      value={form.branchName}
                      className="border rounded-full p-2 w-full"
                      placeholder="Branch location"
                    />
                  </div>
                  <div className="flex flex-col w-full">
                    <label htmlFor="panNumber" className="mb-1 font-semibold">
                      PAN Number
                    </label>
                    <input
                      type="text"
                      id="panNumber"
                      name="panNumber"
                      onChange={handleChange}
                      value={form.panNumber}
                      className="border rounded-full p-2 w-full"
                      placeholder="PAN number"
                    />
                  </div>

                  <div className="flex flex-col w-full md:w-3/4 items-center">
                    <label className="mb-1 font-semibold">PAN Card Image</label>
                    <div className="flex flex-col md:flex-row items-center gap-6 border-1 border-black rounded p-2">
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
                        <label className="cursor-pointer">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handlePanCardChange}
                            className="hidden"
                          />
                          <span className="px-3 py-1 bg-green-500 text-white rounded text-sm">
                            Upload
                          </span>
                        </label>
                        <button
                          onClick={() => {
                            setPanCardImage(null);
                            setForm((prev) => ({
                              ...prev,
                              panCardImagePath: "",
                            }));
                          }}
                          disabled={!panCardImage}
                          className="px-3 py-2 border border-black text-black rounded text-sm hover:bg-green-500 hover:text-white transition disabled:opacity-50"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col md:flex-row gap-4 mt-3">
                  <div className="flex flex-col w-full">
                    <label htmlFor="email" className="mb-1 font-semibold">
                      eSewa ID
                      <span className="text-gray-600"></span>
                    </label>
                    <input
                      type="text"
                      id="esewaId"
                      name="esewaId"
                      onChange={handleChange}
                      value={form.esewaId}
                      className="border rounded-full p-2 w-full"
                      placeholder="eSewa mobile number or ID"
                    />
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
                className="bg-[#EFBE44] p-2 w-32 rounded-full text-white text-1xl font-bold"
              >
                Previous
              </button>
              {currentStep === steps.length ? (
                <button
                  className="bg-[#4BAF47] p-2 w-32 rounded-full text-white text-1xl font-bold"
                  onClick={handleSubmit}
                  type="submit" // Add appropriate submit handler if needed
                >
                  Submit
                </button>
              ) : (
                <button
                  disabled={currentStep === steps.length}
                  onClick={() => setCurrentStep(currentStep + 1)}
                  className="bg-[#4BAF47] p-2 w-32 rounded-full text-white text-1xl font-bold"
                >
                  Next
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default FarmerKYCform;
