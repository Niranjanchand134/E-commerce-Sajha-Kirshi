import React from "react";
import { useLocation } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import { FaBox, FaUser, FaMapMarkerAlt, FaMoneyBillWave } from "react-icons/fa"; // Icons from react-icons

const Buynow = () => {
  const { state } = useLocation();
  const { product, farmer, UserData, quantity } = state || {};

  // Fallback data
  const defaultProduct = {
    name: "Mustang ko Apple",
    price: 999,
    imagePaths: [
      "https://www.collinsdictionary.com/images/full/apple_158989157.jpg",
    ],
  };
  const defaultFarmer = {
    farmName: "Pratik Farm",
    district: "Lalitpur",
    municipality: "Godawari",
    wardNumber: "5",
    tole: "Gotpdawari-5",
  };
  const defaultUser = {
    name: "Yukesh Shrestha",
    number: "+977-1234567890",
  };

  const getFormattedAddress = (farmer) => {
    if (!farmer) {
      return "Shadobato, Road, Lalitpur, Near Shadobato Chok way to Lagankhel";
    }
    const { district, municipality, wardNumber, tole } = farmer;
    return [tole, wardNumber && `Ward - ${wardNumber}`, municipality, district]
      .filter(Boolean)
      .join(", ");
  };

  const productData = product || defaultProduct;
  const farmerData = farmer || defaultFarmer;
  const userData = UserData || defaultUser;
  const qty = quantity || 1;

  // Calculate totals
  const itemTotal = productData.price * qty;
  const deliveryFee = 135;
  const total = itemTotal + deliveryFee;

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-100 py-8">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-green-800 mb-8">
            Order Confirmation
          </h2>
          <div className="flex flex-col lg:flex-row gap-6 justify-center">
            {/* Product List Card */}
            <div className="lg:w-2/3 bg-white rounded-lg shadow-lg p-6">
              <div className="flex items-center justify-between border-b pb-4 mb-4">
                <h3 className="text-xl font-semibold text-green-800 flex items-center">
                  <FaBox className="mr-2 text-green-600" /> Order Details
                </h3>
                <a href="#" className="text-sm text-green-600 hover:underline">
                  Edit
                </a>
              </div>
              <div className="mb-6">
                <div className="flex items-center gap-2">
                  <FaUser className="text-green-600" />
                  <p className="font-medium text-gray-800">{userData.name}</p>
                </div>
                <div className="flex items-start gap-2 mt-2">
                  <FaMapMarkerAlt className="text-green-600 mt-1" />
                  <p className="text-gray-600">
                    {getFormattedAddress(farmerData)}
                  </p>
                </div>
              </div>
              <div className="bg-green-50 p-4 rounded-lg mb-4">
                <h4 className="text-lg font-semibold text-green-800">
                  Package 1 of 1
                </h4>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="flex gap-4">
                  <div className="h-32 w-[50vh] rounded-lg overflow-hidden">
                    <img
                      src={productData.imagePaths[0]}
                      alt={productData.name}
                      className="w-full h-full object-fit"
                    />
                  </div>
                  <div>
                    <h5 className="text-lg font-semibold text-gray-800">
                      {productData.name}
                    </h5>
                    <p className="text-gray-600">{farmerData.farmName}</p>
                    <p className="text-gray-600">
                      {getFormattedAddress(farmerData)}
                    </p>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <h5 className="text-green-600 font-semibold">
                    Rs. {itemTotal}
                  </h5>
                  <p className="text-gray-600">Qty: {qty}</p>
                </div>
              </div>
            </div>

            {/* Order Summary Card */}
            <div className="lg:w-1/3 bg-white rounded-lg shadow-lg p-6">
              <div className="flex items-center justify-between border-b pb-4 mb-4">
                <h3 className="text-xl font-semibold text-green-800 flex items-center">
                  <FaMoneyBillWave className="mr-2 text-green-600" /> Order
                  Summary
                </h3>
                <a href="#" className="text-sm text-green-600 hover:underline">
                  Edit
                </a>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between text-gray-700">
                  <p>
                    Items Total{" "}
                    <span className="text-gray-500">
                      ({qty} item{qty > 1 ? "s" : ""})
                    </span>
                  </p>
                  <p className="font-semibold">Rs. {itemTotal}</p>
                </div>
                <div className="flex justify-between text-gray-700">
                  <p>Delivery Fee</p>
                  <p className="font-semibold">Rs. {deliveryFee}</p>
                </div>
                <hr className="my-3 border-gray-300" />
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-semibold text-gray-800">Total:</p>
                    <p className="text-sm text-gray-500">All Taxes Included</p>
                  </div>
                  <p className="text-red-600 text-lg font-bold">Rs. {total}</p>
                </div>
              </div>
              <button className="mt-6 w-full bg-green-600 text-white font-semibold py-3 rounded-lg hover:bg-green-700 transition duration-300">
                Proceed to Pay
              </button>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Buynow;
