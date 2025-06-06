import React, { useState, useRef } from "react";
import {
  ArrowLeftOutlined,
  ExclamationCircleOutlined,
  AppstoreOutlined,
  UploadOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons";
import { NavLink } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";

const FarmerAddProduct = () => {
  const [activeTab, setActiveTab] = useState("product");
  const [images, setImages] = useState([]);
  const fileInputRef = useRef(null);

  const initialValues = {
    productName: "",
    category: "",
    description: "",
    quantity: "",
    unit: "",
    minimumOrder: "",
    price: "",
    discountPrice: "",
    deliveryOptions: "",
    deliveryTime: "",
  };

  const validate = (values) => {
    const errors = {};

    // Product Name
    if (!values.productName) {
      errors.productName = "Product name is required";
    } else if (values.productName.length < 3) {
      errors.productName = "Product name must be at least 3 characters";
    } else if (values.productName.length > 100) {
      errors.productName = "Product name cannot exceed 100 characters";
    }

    // Category
    if (!values.category) {
      errors.category = "Category is required";
    }

    // Description
    if (!values.description) {
      errors.description = "Description is required";
    } else if (values.description.length < 10) {
      errors.description = "Description must be at least 10 characters";
    } else if (values.description.length > 500) {
      errors.description = "Description cannot exceed 500 characters";
    }

    // Quantity
    if (!values.quantity) {
      errors.quantity = "Quantity is required";
    } else if (isNaN(values.quantity) || Number(values.quantity) < 1) {
      errors.quantity = "Quantity must be a number and at least 1";
    }

    // Unit
    if (!values.unit) {
      errors.unit = "Unit of measurement is required";
    }

    // Minimum Order
    if (!values.minimumOrder) {
      errors.minimumOrder = "Minimum order quantity is required";
    } else if (isNaN(values.minimumOrder) || Number(values.minimumOrder) < 1) {
      errors.minimumOrder = "Minimum order must be a number and at least 1";
    }

    // Price
    if (!values.price) {
      errors.price = "Price is required";
    } else if (isNaN(values.price) || Number(values.price) <= 0) {
      errors.price = "Price must be a number greater than 0";
    }

    // Discount Price
    if (values.discountPrice) {
      if (isNaN(values.discountPrice) || Number(values.discountPrice) < 0) {
        errors.discountPrice = "Discount price must be a number and cannot be negative";
      } else if (Number(values.discountPrice) >= Number(values.price)) {
        errors.discountPrice = "Discount price must be less than regular price";
      }
    }

    // Delivery Options
    if (!values.deliveryOptions) {
      errors.deliveryOptions = "Delivery options are required";
    }

    return errors;
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

  const onSubmit = (values, { setSubmitting }) => {
    if (activeTab === "product") {
      // Validate images before moving to delivery tab
      if (images.length === 0) {
        alert("At least one product image is required.");
        setSubmitting(false);
        return;
      }
      setActiveTab("delivery");
    } else {
      // Final submission
      const formData = { ...values, images };
      console.log("Form submitted:", formData);
      // Add your API call here
    }
    setSubmitting(false);
  };

  const categoryOptions = [
    { value: "", label: "Select Category" },
    { value: "Vegetables", label: "Vegetables" },
    { value: "Fruits", label: "Fruits" },
    { value: "Grains", label: "Grains" },
    { value: "Herbs", label: "Herbs" },
    { value: "Other", label: "Other" },
  ];

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

      {/* Form */}
      <Formik initialValues={initialValues} validate={validate} onSubmit={onSubmit}>
        {({ isSubmitting, errors, touched }) => (
          <Form>
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
                        <Field
                          name="productName"
                          type="text"
                          id="Pname"
                          placeholder="Enter Product Name"
                          className={`border-2 p-2 rounded focus:outline-none ${
                            errors.productName && touched.productName
                              ? "border-red-500"
                              : "border-gray-500"
                          }`}
                        />
                        <ErrorMessage
                          name="productName"
                          component="p"
                          className="text-red-500 text-sm mt-1"
                        />
                      </div>
                      <div className="flex flex-col w-full">
                        <label
                          htmlFor="Category"
                          className="text-sm font-medium text-gray-700 mb-2"
                        >
                          Category
                        </label>
                        <Field
                          name="category"
                          as="select"
                          id="Category"
                          className={`border-2 p-2 rounded focus:outline-none ${
                            errors.category && touched.category
                              ? "border-red-500"
                              : "border-gray-500"
                          }`}
                        >
                          {categoryOptions.map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </Field>
                        <ErrorMessage
                          name="category"
                          component="p"
                          className="text-red-500 text-sm mt-1"
                        />
                      </div>
                    </div>
                    <div className="flex flex-col w-full">
                      <label
                        htmlFor="description"
                        className="text-sm font-medium text-gray-700 mb-2"
                      >
                        Description
                      </label>
                      <Field
                        name="description"
                        as="textarea"
                        id="description"
                        className={`border-2 p-2 rounded ${
                          errors.description && touched.description
                            ? "border-red-500"
                            : "border-gray-500"
                        }`}
                        rows="4"
                      />
                      <ErrorMessage
                        name="description"
                        component="p"
                        className="text-red-500 text-sm mt-1"
                      />
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
                        <Field
                          name="quantity"
                          type="text"
                          id="quality"
                          placeholder="Enter Quantity"
                          className={`border-2 p-2 rounded focus:outline-none ${
                            errors.quantity && touched.quantity
                              ? "border-red-500"
                              : "border-gray-500"
                          }`}
                        />
                        <ErrorMessage
                          name="quantity"
                          component="p"
                          className="text-red-500 text-sm mt-1"
                        />
                      </div>
                      <div className="flex flex-col w-full">
                        <label
                          htmlFor="unit"
                          className="text-sm font-medium text-gray-700 mb-2"
                        >
                          Unit of Measurement
                        </label>
                        <Field
                          name="unit"
                          type="text"
                          id="unit"
                          placeholder="Select Unit"
                          className={`border-2 p-2 rounded focus:outline-none ${
                            errors.unit && touched.unit
                              ? "border-red-500"
                              : "border-gray-500"
                          }`}
                        />
                        <ErrorMessage
                          name="unit"
                          component="p"
                          className="text-red-500 text-sm mt-1"
                        />
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
                        <Field
                          name="minimumOrder"
                          type="text"
                          id="Minimumorder"
                          className={`border-2 p-2 rounded focus:outline-none ${
                            errors.minimumOrder && touched.minimumOrder
                              ? "border-red-500"
                              : "border-gray-500"
                          }`}
                        />
                        <ErrorMessage
                          name="minimumOrder"
                          component="p"
                          className="text-red-500 text-sm mt-1"
                        />
                      </div>
                      <div className="flex flex-col w-full">
                        <label
                          htmlFor="price"
                          className="text-sm font-medium text-gray-700 mb-2"
                        >
                          Prices
                        </label>
                        <Field
                          name="price"
                          type="text"
                          id="price"
                          className={`border-2 p-2 rounded focus:outline-none ${
                            errors.price && touched.price
                              ? "border-red-500"
                              : "border-gray-500"
                          }`}
                        />
                        <ErrorMessage
                          name="price"
                          component="p"
                          className="text-red-500 text-sm mt-1"
                        />
                      </div>
                    </div>
                    <div className="flex flex-col md:w-1/2">
                      <label
                        htmlFor="Dprice"
                        className="text-sm font-medium text-gray-700 mb-2"
                      >
                        Discount Price
                      </label>
                      <Field
                        name="discountPrice"
                        type="text"
                        id="Dprice"
                        className={`border-2 p-2 mr-4 rounded focus:outline-none ${
                          errors.discountPrice && touched.discountPrice
                            ? "border-red-500"
                            : "border-gray-500"
                        }`}
                      />
                      <ErrorMessage
                        name="discountPrice"
                        component="p"
                        className="text-red-500 text-sm mt-1"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="bg-green-500 mt-4 text-white font-semibold px-6 py-2 rounded shadow-md transition-all duration-300 w-full sm:w-auto"
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
                        <Field
                          name="deliveryOptions"
                          type="text"
                          id="DeliveryOptions"
                          placeholder="Multi-select the delivery option"
                          className={`border-2 p-2 rounded focus:outline-none ${
                            errors.deliveryOptions && touched.deliveryOptions
                              ? "border-red-500"
                              : "border-gray-500"
                          }`}
                        />
                        <ErrorMessage
                          name="deliveryOptions"
                          component="p"
                          className="text-red-500 text-sm mt-1"
                        />
                      </div>
                      <div className="flex flex-col w-full">
                        <label
                          htmlFor="DeliveryTime"
                          className="text-sm font-medium text-gray-700 mb-2"
                        >
                          Estimated Delivery Time (optional)
                        </label>
                        <Field
                          name="deliveryTime"
                          type="text"
                          id="DeliveryTime"
                          placeholder="e.g, 2-3 days"
                          className={`border-2 p-2 rounded focus:outline-none ${
                            errors.deliveryTime && touched.deliveryTime
                              ? "border-red-500"
                              : "border-gray-500"
                          }`}
                        />
                        <ErrorMessage
                          name="deliveryTime"
                          component="p"
                          className="text-red-500 text-sm mt-1"
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
                  </div>
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="bg-green-500 mt-4 text-white font-semibold px-6 py-2 rounded shadow-md transition-all duration-300 w-full sm:w-auto"
                    >
                      Submit
                    </button>
                  </div>
                </>
              )}
            </div>
          </Form>
        )}
      </Formik>
    </>
  );
};

export default FarmerAddProduct;