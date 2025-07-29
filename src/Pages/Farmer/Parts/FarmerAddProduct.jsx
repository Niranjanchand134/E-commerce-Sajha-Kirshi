import React, { useState, useRef, useEffect } from "react";
import {
  ArrowLeftOutlined,
  ExclamationCircleOutlined,
  AppstoreOutlined,
  UploadOutlined,
  CloseCircleOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  WarningOutlined,
} from "@ant-design/icons";
import { useAuth } from "../../../Context/AuthContext";
import { addProduct } from "../../../services/authService";
import { SlTag } from "react-icons/sl";
import { useNavigate } from "react-router-dom";
import {
  SuccesfulMessageToast,
  ErrorMessageToast,
} from "../../../utils/Tostify.util";
import axios from "axios";

const FarmerAddProduct = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("product");
  const [images, setImages] = useState([]);
  const fileInputRef = useRef(null);
  const [imageUpload, setImageUpload] = useState([]);
  const navigate = useNavigate();

  // Validation errors state
  const [errors, setErrors] = useState({
    name: "",
    category: "",
    description: "",
    quantity: "",
    unitOfMeasurement: "",
    price: "",
    minimumOrderQuantity: "",
    discountPrice: "",
    deliveryOption: "",
    images: "",
  });

  // KYC status states
  const [kycStatus, setKycStatus] = useState(null);
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    date: "2025-10-22",
    status: "Active",
    name: "",
    category: "",
    description: "",
    quantity: 0,
    unitOfMeasurement: "",
    price: 0,
    minimumOrderQuantity: 0,
    discountPrice: 0,
    deliveryOption: [],
    deliveryTime: "",
    imagePaths: ["/image/upload/v1749143827/iw3cpmd4p32rapegdanw.jpg"],
    available: true,
    harvestDate: "2025-05-20",
    expiryDate: "2025-07-30",
  });

  // Validate product info tab
  const validateProductInfo = () => {
    const newErrors = {};
    let isValid = true;

    if (!formData.name.trim()) {
      newErrors.name = "Product name is required";
      isValid = false;
    } else if (formData.name.length > 100) {
      newErrors.name = "Product name must be less than 100 characters";
      isValid = false;
    }

    if (!formData.category) {
      newErrors.category = "Category is required";
      isValid = false;
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
      isValid = false;
    } else if (formData.description.length > 500) {
      newErrors.description = "Description must be less than 500 characters";
      isValid = false;
    }

    if (formData.quantity <= 0) {
      newErrors.quantity = "Quantity must be greater than 0";
      isValid = false;
    }

    if (!formData.unitOfMeasurement) {
      newErrors.unitOfMeasurement = "Unit of measurement is required";
      isValid = false;
    }

    if (formData.price <= 0) {
      newErrors.price = "Price must be greater than 0";
      isValid = false;
    }

    if (formData.minimumOrderQuantity <= 0) {
      newErrors.minimumOrderQuantity = "Minimum order quantity must be greater than 0";
      isValid = false;
    } else if (formData.minimumOrderQuantity > formData.quantity) {
      newErrors.minimumOrderQuantity = "Cannot exceed available quantity";
      isValid = false;
    }

    if (formData.discountPrice < 0) {
      newErrors.discountPrice = "Discount cannot be negative";
      isValid = false;
    } else if (formData.discountPrice > formData.price) {
      newErrors.discountPrice = "Discount cannot exceed price";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  // Validate delivery tab
  const validateDeliveryInfo = () => {
    const newErrors = {};
    let isValid = true;

    if (!formData.deliveryOption || formData.deliveryOption.length === 0) {
      newErrors.deliveryOption = "At least one delivery option is required";
      isValid = false;
    }

    if (images.length === 0) {
      newErrors.images = "At least one image is required";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const handleImageChange = async (e) => {
    const selectedFiles = Array.from(e.target.files);
    
    // Validate file types and sizes
    const validFiles = selectedFiles.filter(file => {
      const validTypes = ['image/jpeg', 'image/png', 'image/gif'];
      if (!validTypes.includes(file.type)) {
        ErrorMessageToast("Only JPG, PNG, and GIF images are allowed");
        return false;
      }
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        ErrorMessageToast("Image size must be less than 5MB");
        return false;
      }
      return true;
    });

    const totalFiles = [...images, ...validFiles].slice(0, 5);
    setImages(totalFiles);

    const uploads = validFiles.map((file) => {
      const data = new FormData();
      data.append("file", file);
      data.append("upload_preset", "SajhaKrishi");
      data.append("cloud_name", "dtwunctra");
      return data;
    });

    setImageUpload(uploads);
    e.target.value = null;
    
    // Clear image error when images are added
    if (errors.images && totalFiles.length > 0) {
      setErrors({ ...errors, images: "" });
    }
  };

  const removeImage = (indexToRemove) => {
    const updatedImages = images.filter((_, index) => index !== indexToRemove);
    setImages(updatedImages);
  };

  const handleNextTab = () => {
    if (validateProductInfo()) {
      setActiveTab("delivery");
    }
  };

  const handleSubmit = async () => {
    if (!validateDeliveryInfo()) return;

    const uploadPromises = imageUpload.map((uploadData) =>
      fetch("https://api.cloudinary.com/v1_1/dtwunctra/image/upload", {
        method: "POST",
        body: uploadData,
      }).then((res) => res.json())
    );

    try {
      const results = await Promise.all(uploadPromises);
      const urls = results.map((result) => result.url);
      console.log("Uploaded URLs:", urls);

      const finalData = {
        ...formData,
        deliveryOption: Array.isArray(formData.deliveryOption)
          ? formData.deliveryOption
          : [formData.deliveryOption],
        imagePaths: urls,
      };

      console.log("here is the product data: ", finalData);

      const response = await addProduct(finalData);
      console.log("Product saved:", response);
      SuccesfulMessageToast("Product Added Successfully");
      setFormData("");
      navigate("/Farmerlayout/Farmerproducts");
    } catch (error) {
      console.error("Error uploading images:", error);
      ErrorMessageToast("Failed to add product");
    }
  };

  // Check KYC status (unchanged from original)
  const checkKycStatus = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `http://localhost:8080/api/farmer/getFarmerKYCDetails/${user.id}`
      );

      if (response.data && response.data.id) {
        if (response.data.verified === true) {
          setKycStatus("verified");
        } else if (response.data.kycStatus === "PENDING") {
          setKycStatus("pending");
        } else if (response.data.kycStatus === "REJECTED") {
          setKycStatus("rejected");
        } else {
          setKycStatus("pending");
        }
      } else {
        setKycStatus("not_filled");
      }
    } catch (error) {
      console.error("Error fetching KYC details:", error);
      if (error.response && error.response.status === 404) {
        setKycStatus("not_filled");
      } else {
        ErrorMessageToast("Failed to check KYC status");
        setKycStatus("error");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user && user.id) {
      checkKycStatus();
    }
  }, [user]);

  // Loading state (unchanged from original)
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Checking KYC status...</p>
        </div>
      </div>
    );
  }

  // KYC not filled message (unchanged from original)
  if (kycStatus === "not_filled") {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
          <WarningOutlined className="text-4xl text-yellow-500 mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            KYC Required
          </h2>
          <p className="text-gray-600 mb-6">
            You need to complete your KYC (Know Your Customer) verification
            before you can add products. This helps us ensure the authenticity
            of sellers on our platform.
          </p>
          <div className="space-y-3">
            <button
              onClick={() => navigate("/Farmerlayout/FarmerKYCHome")}
              className="bg-green-500 hover:bg-green-600 text-white font-semibold px-6 py-3 rounded-lg transition-colors duration-200 w-full sm:w-auto"
            >
              Complete KYC Now
            </button>
            <div>
              <button
                onClick={() => navigate("/Farmerlayout/Farmerproducts")}
                className="text-gray-500 hover:text-gray-700 underline"
              >
                Go back to products
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // KYC pending verification message (unchanged from original)
  if (kycStatus === "pending") {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
          <ClockCircleOutlined className="text-4xl text-blue-500 mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            KYC Under Review
          </h2>
          <p className="text-gray-600 mb-6">
            Your KYC application is currently under review by our team. This
            process typically takes 1-3 business days. You'll be able to add
            products once your KYC is approved.
          </p>
          <div className="bg-white rounded-lg p-4 mb-6">
            <div className="flex items-center justify-center space-x-2 text-blue-600">
              <ClockCircleOutlined />
              <span className="font-medium">Status: Pending Review</span>
            </div>
          </div>
          <div className="space-y-3">
            <button
              onClick={() => window.location.reload()}
              className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-6 py-3 rounded-lg transition-colors duration-200 w-full sm:w-auto"
            >
              Refresh Status
            </button>
            <div>
              <button
                onClick={() => navigate("/Farmerlayout/Farmerproducts")}
                className="text-gray-500 hover:text-gray-700 underline"
              >
                Go back to products
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // KYC rejected message (unchanged from original)
  if (kycStatus === "rejected") {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <CloseCircleOutlined className="text-4xl text-red-500 mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            KYC Application Rejected
          </h2>
          <p className="text-gray-600 mb-6">
            Unfortunately, your KYC application has been rejected. Please
            contact our support team or resubmit your KYC with correct
            information.
          </p>
          <div className="space-y-3">
            <button
              onClick={() => navigate("/farmer/kyc")}
              className="bg-red-500 hover:bg-red-600 text-white font-semibold px-6 py-3 rounded-lg transition-colors duration-200 w-full sm:w-auto"
            >
              Resubmit KYC
            </button>
            <div>
              <button
                onClick={() => navigate("/Farmerlayout/Farmerproducts")}
                className="text-gray-500 hover:text-gray-700 underline"
              >
                Go back to products
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state (unchanged from original)
  if (kycStatus === "error") {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center">
          <ExclamationCircleOutlined className="text-4xl text-gray-500 mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Unable to Check KYC Status
          </h2>
          <p className="text-gray-600 mb-6">
            We're having trouble checking your KYC status. Please try again
            later.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="bg-gray-500 hover:bg-gray-600 text-white font-semibold px-6 py-3 rounded-lg transition-colors duration-200"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // KYC verified - show the add product form
  if (kycStatus === "verified") {
    return (
      <>
        <div className="px-4 py-4">
          {/* Header with KYC verified indicator */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="border border-gray-300 rounded p-1 hover:bg-gray-100 cursor-pointer text-xl flex items-center justify-center">
                <ArrowLeftOutlined />
              </div>
              <h4 className="text-xl font-semibold">Create Product</h4>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 bg-[#ECEDF3] p-1 rounded">
            <div
              className={`flex items-center gap-2 p-1 rounded cursor-pointer ${
                activeTab === "product" ? "bg-white" : ""
              }`}
              onClick={() => setActiveTab("product")}
            >
              <div className="text-xl">
                <ExclamationCircleOutlined />
              </div>
              <h4 className="text-lg sm:text-xl mt-1 font-semibold leading-none">
                Product Info & Quantity
              </h4>
            </div>

            <div
              className={`flex items-center gap-2 p-1 rounded cursor-pointer ${
                activeTab === "delivery" ? "bg-white" : ""
              }`}
              onClick={() => setActiveTab("delivery")}
            >
              <div className="text-xl">
                <i className="fa-solid fa-sliders"></i>
              </div>
              <h4 className="text-lg sm:text-xl mt-1 font-semibold leading-none">
                Delivery & Media
              </h4>
            </div>
          </div>

          {/* Tab Content */}
          <div className="mt-4 p-4 border rounded shadow-sm bg-white">
            {activeTab === "product" && (
              <>
                {/* Product Info */}
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <div className="text-blue-500 mb-1 cursor-pointer text-xl flex items-center justify-center">
                      <ExclamationCircleOutlined />
                    </div>
                    <h4 className="text-xl font-semibold">Product Info</h4>
                  </div>
                  <div className="flex flex-col md:flex-row gap-4 mb-4">
                    <div className="flex flex-col w-full">
                      <label
                        htmlFor="Pname"
                        className="text-sm font-medium text-gray-700 mb-2"
                      >
                        Product Name
                      </label>
                      <input
                        type="text"
                        id="Pname"
                        name="name"
                        onChange={handleChange}
                        placeholder="Enter Product Name"
                        className={`border-2 p-2 rounded ${
                          errors.name ? "border-red-500" : "border-gray-500"
                        } focus:outline-none focus:border-gray-500`}
                      />
                      {errors.name && (
                        <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                      )}
                    </div>
                    <div className="flex flex-col w-full">
                      <label
                        htmlFor="Category"
                        className="text-sm font-medium text-gray-700 mb-2"
                      >
                        Category
                      </label>

                      <div className="relative">
                        <select
                          id="Category"
                          name="category"
                          onChange={handleChange}
                          className={`appearance-none border-2 p-2 pr-10 rounded ${
                            errors.category ? "border-red-500" : "border-gray-500"
                          } focus:outline-none focus:border-gray-500 w-full`}
                        >
                          <option value="">Select Category</option>
                          <option value="vegetables">Vegetables</option>
                          <option value="fruits">Fruits</option>
                          <option value="grains">Grains</option>
                          <option value="dairy">Dairy</option>
                          <option value="meat">Meat</option>
                        </select>

                        <div className="absolute inset-y-0 right-2 flex items-center pointer-events-none">
                          <SlTag className="text-gray-500 -rotate-90" />
                        </div>
                      </div>
                      {errors.category && (
                        <p className="text-red-500 text-sm mt-1">{errors.category}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col w-full">
                    <label
                      htmlFor="description"
                      className="text-sm font-medium text-gray-700 mb-2"
                    >
                      Description
                    </label>
                    <textarea
                      id="description"
                      name="description"
                      onChange={handleChange}
                      className={`border-2 p-2 rounded ${
                        errors.description ? "border-red-500" : "border-gray-500"
                      }`}
                      rows="4"
                    ></textarea>
                    {errors.description && (
                      <p className="text-red-500 text-sm mt-1">{errors.description}</p>
                    )}
                  </div>
                </div>

                {/* Quantity & Price */}
                <div className="mt-6">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="text-blue-500 mb-1 cursor-pointer text-xl flex items-center justify-center">
                      <ExclamationCircleOutlined />
                    </div>
                    <h4 className="text-xl font-semibold">Quantity & Price</h4>
                  </div>
                  <div className="flex flex-col md:flex-row gap-4 mb-4">
                    <div className="flex flex-col w-full">
                      <label
                        htmlFor="quality"
                        className="text-sm font-medium text-gray-700 mb-2"
                      >
                        Available Quantity
                      </label>
                      <input
                        type="number"
                        id="quality"
                        name="quantity"
                        onChange={handleChange}
                        placeholder="Enter Quantity"
                        className={`border-2 p-2 rounded ${
                          errors.quantity ? "border-red-500" : "border-gray-500"
                        } focus:outline-none focus:border-gray-500`}
                      />
                      {errors.quantity && (
                        <p className="text-red-500 text-sm mt-1">{errors.quantity}</p>
                      )}
                    </div>
                    <div className="flex flex-col w-full">
                      <label
                        htmlFor="unit"
                        className="text-sm font-medium text-gray-700 mb-2"
                      >
                        Unit of Measurement
                      </label>

                      <div className="relative">
                        <select
                          id="unit"
                          name="unitOfMeasurement"
                          onChange={handleChange}
                          className={`appearance-none border-2 p-2 pr-10 rounded ${
                            errors.unitOfMeasurement ? "border-red-500" : "border-gray-500"
                          } focus:outline-none focus:border-gray-500 w-full`}
                        >
                          <option value="">Select Unit</option>
                          <option value="kg">Kilogram (kg)</option>
                          <option value="g">Gram (g)</option>
                          <option value="l">Liter (l)</option>
                          <option value="ml">Milliliter (ml)</option>
                          <option value="piece">Piece</option>
                          <option value="dozen">Dozen</option>
                          <option value="packet">Packet</option>
                        </select>

                        <div className="absolute inset-y-0 right-2 flex items-center pointer-events-none">
                          <SlTag className="text-gray-500 -rotate-90" />
                        </div>
                      </div>
                      {errors.unitOfMeasurement && (
                        <p className="text-red-500 text-sm mt-1">{errors.unitOfMeasurement}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col md:flex-row gap-4 mb-4">
                    <div className="flex flex-col w-full">
                      <label
                        htmlFor="Minimumorder"
                        className="text-sm font-medium text-gray-700 mb-2"
                      >
                        Minimum Order Quantity
                      </label>
                      <input
                        type="number"
                        id="Minimumorder"
                        name="minimumOrderQuantity"
                        onChange={handleChange}
                        className={`border-2 p-2 rounded ${
                          errors.minimumOrderQuantity ? "border-red-500" : "border-gray-500"
                        } focus:outline-none focus:border-gray-500`}
                      />
                      {errors.minimumOrderQuantity && (
                        <p className="text-red-500 text-sm mt-1">{errors.minimumOrderQuantity}</p>
                      )}
                    </div>
                    <div className="flex flex-col w-full">
                      <label
                        htmlFor="price"
                        className="text-sm font-medium text-gray-700 mb-2"
                      >
                        Prices
                      </label>
                      <input
                        type="number"
                        id="price"
                        name="price"
                        onChange={handleChange}
                        className={`border-2 p-2 rounded ${
                          errors.price ? "border-red-500" : "border-gray-500"
                        } focus:outline-none focus:border-gray-500`}
                      />
                      {errors.price && (
                        <p className="text-red-500 text-sm mt-1">{errors.price}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col md:w-1/2">
                    <label
                      htmlFor="Dprice"
                      className="text-sm font-medium text-gray-700 mb-2"
                    >
                      Discount Percentage
                    </label>
                    <input
                      type="number"
                      id="Dprice"
                      name="discountPrice"
                      onChange={handleChange}
                      className={`border-2 p-2 mr-4 rounded ${
                        errors.discountPrice ? "border-red-500" : "border-gray-500"
                      } focus:outline-none focus:border-gray-500`}
                    />
                    {errors.discountPrice && (
                      <p className="text-red-500 text-sm mt-1">{errors.discountPrice}</p>
                    )}
                  </div>
                </div>
                <div className="flex justify-end">
                  <button
                    className="bg-green-500 mt-4 text-white font-semibold px-6 py-2 rounded shadow-md transition-all duration-300 w-full sm:w-auto"
                    onClick={handleNextTab}
                  >
                    Next: Delivery & Media
                  </button>
                </div>
              </>
            )}

            {activeTab === "delivery" && (
              <>
                <div>
                  {/* Delivery Info */}
                  <div className="flex items-center gap-2 mb-4">
                    <div className="text-blue-500 mb-1 cursor-pointer text-xl flex items-center justify-center">
                      <ExclamationCircleOutlined />
                    </div>
                    <h4 className="text-xl font-semibold">Delivery & Pickup</h4>
                  </div>
                  <div className="flex flex-col md:flex-row gap-4 mb-4">
                    <div className="flex flex-col w-full">
                      <label
                        htmlFor="DeliveryOptions"
                        className="text-sm font-medium text-gray-700 mb-2"
                      >
                        Delivery Options
                      </label>
                      <input
                        type="text"
                        id="DeliveryOptions"
                        name="deliveryOption"
                        onChange={handleChange}
                        placeholder="Multi-select the delivery option"
                        className={`border-2 p-2 rounded ${
                          errors.deliveryOption ? "border-red-500" : "border-gray-500"
                        } focus:outline-none focus:border-gray-500`}
                      />
                      {errors.deliveryOption && (
                        <p className="text-red-500 text-sm mt-1">{errors.deliveryOption}</p>
                      )}
                    </div>
                    <div className="flex flex-col w-full">
                      <label
                        htmlFor="DeliveryTime"
                        className="text-sm font-medium text-gray-700 mb-2"
                      >
                        Estimated Delivery Time (optional)
                      </label>
                      <input
                        type="text"
                        id="DeliveryTime"
                        name="deliveryTime"
                        onChange={handleChange}
                        placeholder="e.g, 2-3 days"
                        className="border-2 p-2 rounded border-gray-500 focus:outline-none focus:border-gray-500"
                      />
                    </div>
                  </div>

                  {/* Image Upload */}
                  <div className="flex items-center gap-2 mt-4">
                    <div className="text-blue-500 mb-1 text-xl flex items-center justify-center">
                      <AppstoreOutlined />
                    </div>
                    <h4 className="text-xl font-semibold">Product Images</h4>
                  </div>
                  <p className="text-gray-500">
                    Upload up to 5 images for your product. First image will be
                    used as a cover.
                  </p>

                  {images.length < 5 && (
                    <label
                      htmlFor="fileUpload"
                      className="flex flex-col items-center justify-center w-32 h-32 cursor-pointer border-2 border-dashed border-gray-300 rounded-lg bg-gray-50 hover:bg-gray-100 transition mt-3"
                    >
                      <UploadOutlined className="text-2xl text-blue-600 mb-1" />
                      <span className="text-sm text-gray-700 font-medium">
                        Upload Image
                      </span>
                      <span className="text-sm text-gray-500">
                        {images.length}/5
                      </span>
                      <input
                        type="file"
                        id="fileUpload"
                        accept="image/*"
                        multiple
                        ref={fileInputRef}
                        onChange={handleImageChange}
                        className="hidden"
                      />
                    </label>
                  )}

                  {/* Image Preview Grid */}
                  <div className="flex gap-3 mt-4 flex-wrap">
                    {images.map((file, index) => (
                      <div
                        key={index}
                        className="relative w-20 h-20 border rounded overflow-hidden"
                      >
                        <img
                          src={URL.createObjectURL(file)}
                          alt={`preview ${index}`}
                          className="w-full h-full object-cover"
                        />
                        <button
                          onClick={() => removeImage(index)}
                          className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full p-1 text-sm shadow-md hover:bg-red-700"
                          title="Remove"
                        >
                          <CloseCircleOutlined style={{ fontSize: "16px" }} />
                        </button>
                      </div>
                    ))}
                  </div>
                  {errors.images && (
                    <p className="text-red-500 text-sm mt-1">{errors.images}</p>
                  )}
                </div>
                <div className="flex justify-between mt-4">
                  <button
                    onClick={() => setActiveTab("product")}
                    className="bg-gray-500 text-white font-semibold px-6 py-2 rounded shadow-md transition-all duration-300"
                  >
                    Back
                  </button>
                  <button
                    onClick={handleSubmit}
                    className="bg-green-500 text-white font-semibold px-6 py-2 rounded shadow-md transition-all duration-300"
                  >
                    Submit
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </>
    );
  }

  // Fallback
  return null;
};

export default FarmerAddProduct;