import React, { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { ExclamationCircleOutlined, AppstoreOutlined, UploadOutlined, CloseCircleOutlined } from "@ant-design/icons";
import { SlTag } from "react-icons/sl";

const FarmerEditProduct = () => {
  const location = useLocation();
  const { product } = location.state || {};
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    name: "",
    category: "",
    description: "",
    quantity: "",
    unitOfMeasurement: "",
    minimumOrderQuantity: "",
    price: "",
    discountPrice: "",
    deliveryOption: "",
    deliveryTime: ""
  });

  const [images, setImages] = useState([]);

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || "",
        category: product.category || "",
        description: product.description || "",
        quantity: product.quantity || "",
        unitOfMeasurement: product.unitOfMeasurement || "",
        minimumOrderQuantity: product.minimumOrderQuantity || "",
        price: product.price || "",
        discountPrice: product.discountPrice || "",
        deliveryOption: product.deliveryOption || "",
        deliveryTime: product.deliveryTime || ""
      });
    }
  }, [product]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    const selectedImages = Array.from(e.target.files);
    if (selectedImages.length + images.length <= 5) {
      setImages((prev) => [...prev, ...selectedImages]);
    }
  };

  const removeImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    console.log("Form submitted", formData, images);
  };

  return (
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
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter Product Name"
              className="border-2 p-2 rounded border-gray-500 focus:outline-none focus:border-gray-500"
            />
          </div>
          <div className="flex flex-col w-full">
            <label htmlFor="Category" className="text-sm font-medium text-gray-700 mb-2">
              Category
            </label>
            <div className="relative">
              <select
                id="Category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="appearance-none border-2 p-2 pr-10 rounded border-gray-500 focus:outline-none focus:border-gray-500 w-full"
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
          </div>
        </div>
        <div className="flex flex-col w-full">
          <label htmlFor="description" className="text-sm font-medium text-gray-700 mb-2">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
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
              type="number"
              id="quality"
              name="quantity"
              value={formData.quantity}
              onChange={handleChange}
              placeholder="Enter Quantity"
              className="border-2 p-2 rounded border-gray-500 focus:outline-none focus:border-gray-500"
            />
          </div>
          <div className="flex flex-col w-full">
            <label htmlFor="unit" className="text-sm font-medium text-gray-700 mb-2">
              Unit of Measurement
            </label>
            <div className="relative">
              <select
                id="unit"
                name="unitOfMeasurement"
                value={formData.unitOfMeasurement}
                onChange={handleChange}
                className="appearance-none border-2 p-2 pr-10 rounded border-gray-500 focus:outline-none focus:border-gray-500 w-full"
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
          </div>
        </div>
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <div className="flex flex-col w-full">
            <label htmlFor="Minimumorder" className="text-sm font-medium text-gray-700 mb-2">
              Minimum Order Quantity
            </label>
            <input
              type="number"
              id="Minimumorder"
              name="minimumOrderQuantity"
              value={formData.minimumOrderQuantity}
              onChange={handleChange}
              className="border-2 p-2 rounded border-gray-500 focus:outline-none focus:border-gray-500"
            />
          </div>
          <div className="flex flex-col w-full">
            <label htmlFor="price" className="text-sm font-medium text-gray-700 mb-2">
              Prices
            </label>
            <input
              type="number"
              id="price"
              name="price"
              value={formData.price}
              onChange={handleChange}
              className="border-2 p-2 rounded border-gray-500 focus:outline-none focus:border-gray-500"
            />
          </div>
        </div>
        <div className="flex flex-col md:w-1/2">
          <label htmlFor="Dprice" className="text-sm font-medium text-gray-700 mb-2">
            Discount Percentage
          </label>
          <input
            type="number"
            id="Dprice"
            name="discountPrice"
            value={formData.discountPrice}
            onChange={handleChange}
            className="border-2 p-2 mr-4 rounded border-gray-500 focus:outline-none focus:border-gray-500"
          />
        </div>
      </div>

      {/* Delivery Info */}
      <div className="mt-6">
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
              name="deliveryOption"
              value={formData.deliveryOption}
              onChange={handleChange}
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
              name="deliveryTime"
              value={formData.deliveryTime}
              onChange={handleChange}
              placeholder="e.g, 2-3 days"
              className="border-2 p-2 rounded border-gray-500 focus:outline-none focus:border-gray-500"
            />
          </div>
        </div>
      </div>

      {/* Image Upload */}
      <div className="mt-6">
        <div className="flex items-center gap-2">
          <div className="text-blue-500 mb-1 text-xl flex items-center justify-center">
            <AppstoreOutlined />
          </div>
          <h4 className="text-xl font-semibold">Product Images</h4>
        </div>
        <p className="text-gray-500">
          Upload up to 5 images for your product. First image will be used as a cover.
        </p>

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
        <button
          onClick={handleSubmit}
          className="bg-green-500 mt-4 text-white font-semibold px-6 py-2 rounded shadow-md transition-all duration-300 w-full sm:w-auto"
        >
          Submit
        </button>
      </div>
    </>
  );
};

export default FarmerEditProduct;
