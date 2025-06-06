import React, { useState, useRef, use } from "react";
import {
  ArrowLeftOutlined,
  ExclamationCircleOutlined,
  AppstoreOutlined,
  UploadOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons";
import { NavLink } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { useAuth } from "../../../Context/AuthContext";
import { addProduct } from "../../../services/authService";

const FarmerAddProduct = () => {

  const {user} = useAuth();
  const [activeTab, setActiveTab] = useState("product");
  const [images, setImages] = useState([]);
  const fileInputRef = useRef(null);
  const [imageUpload, setImageUpload] = useState([]);
  const [formData, setFormData] = useState({
    user: user.id, // or use a nested object if needed like { id: "", name: "" }
    date: "2025-10-22", // You can use new Date().toISOString().slice(0, 10) for default
    status: "pending",
    name: "",
    category: "",
    description: "",
    quantity: 0,
    unitOfMeasurement: "",
    price: 0,
    minimumOrderQuantity: 0,
    discountPrice: 0,
    deliveryOption: "",
    deliveryTime: "",
    imagePaths: ["/image/upload/v1749143827/iw3cpmd4p32rapegdanw.jpg"],
    available: true,
    harvestDate: "2025-05-20",
    expiryDate: "2025-07-30",
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    const validFiles = selectedFiles.filter((file) => {
      const isValidType = ["image/jpeg", "image/png", "image/jpg"].includes(file.type);
      const isValidSize = file.size <= 5 * 1024 * 1024; // 5MB limit
      if (!isValidType) {
        alert(`${file.name} is not a valid image type (JPG/PNG only).`);
        return false;
      }
      if (!isValidSize) {
        alert(`${file.name} exceeds the 5MB size limit.`);
        return false;
      }
      return true;
    });

    const totalFiles = [...images, ...validFiles].slice(0, 5); // Limit to 5
    setImages(totalFiles);
    
    e.target.value = null;
  };

  const removeImage = (indexToRemove) => {
    const updatedImages = images.filter((_, index) => index !== indexToRemove);
    setImages(updatedImages);
  };

  return (
    <>
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <NavLink
          to="/Farmerlayout/Farmerdashboard"
          className="border border-gray-300 rounded p-1 text-black hover:bg-gray-100 cursor-pointer text-xl flex items-center justify-center"
        >
          <ArrowLeftOutlined />
        </NavLink>
        <h4 className="text-xl font-semibold">Create Product</h4>
      </div>

      {/* Tab Navigation */}
      <div className="flex flex-col sm:flex-row gap-1 sm:gap-3 bg-[#ECEDF3] text-[#7F7F7F] p-1 rounded">
        <div className={`flex items-center gap-1 p-1 rounded cursor-pointer ${
            activeTab === "product" ? "bg-white" : ""
          }`}
          onClick={() => setActiveTab("product")}
        >
          <div className="text-lg">
            <ExclamationCircleOutlined />
          </div>
          <h4 className="text-lg mt-1 sm:text-lg font-semibold leading-none">
            Product Info & Quantity
          </h4>
        </div>
        <div
          className={`flex items-center gap-1 p-1 rounded cursor-pointer ${
            activeTab === "delivery" ? "bg-white" : ""
          }`}
          onClick={() => setActiveTab("delivery")}
        >
          <div className="text-lg">
            <i className="fa-solid fa-truck-fast"></i>
          </div>
          <h4 className="text-lg mt-1 sm:text-lg font-semibold leading-none">
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
                  <label htmlFor="Pname" className="text-sm font-medium text-gray-700 mb-2">
                    Product Name
                  </label>
                  <input
                    type="text"
                    id="Pname"
                    placeholder="Enter Product Name"
                    className="border-2 p-2 rounded border-gray-500 focus:outline-none focus:border-gray-500"
                  />
                </div>
                <div className="flex flex-col w-full">
                  <label htmlFor="Category" className="text-sm font-medium text-gray-700 mb-2">
                    Category
                  </label>
                  <input
                    type="text"
                    id="Category"
                    placeholder="Select Category"
                    className="border-2 p-2 rounded border-gray-500 focus:outline-none focus:border-gray-500"
                  />
                </div>
              </div>
              <div className="flex flex-col w-full">
                <label htmlFor="description" className="text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  id="description"
                  className="border-2 p-2 rounded border-gray-500"
                  rows="4"
                ></textarea>
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
                  <label htmlFor="quality" className="text-sm font-medium text-gray-700 mb-2">
                    Available Quantity
                  </label>
                  <input
                    type="text"
                    id="quality"
                    placeholder="Enter Quantity"
                    className="border-2 p-2 rounded border-gray-500 focus:outline-none focus:border-gray-500"
                  />
                </div>
                <div className="flex flex-col w-full">
                  <label htmlFor="unit" className="text-sm font-medium text-gray-700 mb-2">
                    Unit of Measurement
                  </label>
                  <input
                    type="text"
                    id="unit"
                    placeholder="Select Unit"
                    className="border-2 p-2 rounded border-gray-500 focus:outline-none focus:border-gray-500"
                  />
                </div>
              </div>
              <div className="flex flex-col md:flex-row gap-4 mb-4">
                <div className="flex flex-col w-full">
                  <label htmlFor="Minimumorder" className="text-sm font-medium text-gray-700 mb-2">
                    Minimum Order Quantity
                  </label>
                  <input
                    type="text"
                    id="Minimumorder"
                    className="border-2 p-2 rounded border-gray-500 focus:outline-none focus:border-gray-500"
                  />
                </div>
                <div className="flex flex-col w-full">
                  <label htmlFor="price" className="text-sm font-medium text-gray-700 mb-2">
                    Prices
                  </label>
                  <input
                    type="text"
                    id="price"
                    className="border-2 p-2 rounded border-gray-500 focus:outline-none focus:border-gray-500"
                  />
                </div>
              </div>
              <div className="flex flex-col md:w-1/2">
                <label htmlFor="Dprice" className="text-sm font-medium text-gray-700 mb-2">
                  Discount Price
                </label>
                <input
                  type="text"
                  id="Dprice"
                  className="border-2 p-2 mr-4 rounded border-gray-500 focus:outline-none focus:border-gray-500"
                />
              </div>
            </div>
            <div className="flex justify-end">
              <button className="bg-green-500 mt-4 text-white font-semibold px-6 py-2 rounded shadow-md transition-all duration-300 w-full sm:w-auto">
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
                  <label htmlFor="DeliveryOptions" className="text-sm font-medium text-gray-700 mb-2">
                    Delivery Options
                  </label>
                  <input
                    type="text"
                    id="DeliveryOptions"
                    placeholder="Multi-select the delivery option"
                    className="border-2 p-2 rounded border-gray-500 focus:outline-none focus:border-gray-500"
                  />
                </div>
                <div className="flex flex-col w-full">
                  <label htmlFor="DeliveryTime" className="text-sm font-medium text-gray-700 mb-2">
                    Estimated Delivery Time (optional)
                  </label>
                  <input
                    type="text"
                    id="DeliveryTime"
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
              <p className="text-gray-500">Upload up to 5 images for your product. First image will be used as a cover.</p>

              {images.length < 5 && (
                <label
                  htmlFor="fileUpload"
                  className="flex flex-col items-center justify-center w-32 h-32 cursor-pointer border-2 border-dashed border-gray-300 rounded-lg bg-gray-50 hover:bg-gray-100 transition mt-3"
                >
                  <UploadOutlined className="text-2xl text-blue-600 mb-1" />
                  <span className="text-sm text-gray-700 font-medium">Upload Image</span>
                  <span className="text-sm text-gray-500">{images.length}/5</span>
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
                  <div key={index} className="relative w-20 h-20 border rounded overflow-hidden">
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
            </div>
            <div className="flex justify-end">
              <button className="bg-green-500 mt-4 text-white font-semibold px-6 py-2 rounded shadow-md transition-all duration-300 w-full sm:w-auto">
                Submit
              </button>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default FarmerAddProduct;