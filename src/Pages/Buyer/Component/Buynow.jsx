import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import { useAuth } from "../../../Context/AuthContext";
import { ErrorMessageToast } from "../../../utils/Tostify.util";

const Buynow = () => {
  const { state } = useLocation();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { checkoutItems = [] } = state || {};

  // Fallback data
  const defaultCheckoutItems = [
    {
      id: 1,
      productName: "Mustang ko Apple",
      price: 999,
      discountPrice: 0,
      quantity: 1,
      imageUrl:
        "https://www.collinsdictionary.com/images/full/apple_158989157.jpg",
      farmName: "Pratik Farm",
      location: "Shadobato, Road, Lalitpur, Nepal",
    },
  ];

  const items = checkoutItems.length > 0 ? checkoutItems : defaultCheckoutItems;

  const getFormattedAddress = (location) => {
    return location || "Shadobato, Road, Lalitpur, Near Shadobato Chok";
  };

  // Calculate totals
  // Calculate totals
  const itemTotal = items.reduce(
    (sum, item) =>
      sum +
      (item.discountPrice
        ? (item.price * item.quantity * (100 - item.discountPrice)) / 100
        : item.price * item.quantity),
    0
  );
  const discountAmount = items.reduce(
    (sum, item) =>
      sum +
      (item.discountPrice
        ? (item.price * item.quantity * item.discountPrice) / 100
        : 0),
    0
  );
  const deliveryFee = 135;
  const total = itemTotal - discountAmount + deliveryFee;

  const handleProceedClick = () => {
    if (!user || !user.id) {
      ErrorMessageToast("Please log in to proceed with payment!");
      navigate("/Buyer-login");
      return;
    }

    navigate("/Payment", {
      state: {
        checkoutItems: items,
        itemTotal,
        discountAmount,
        deliveryFee,
        total,
      },
    });
  };

  return (
    <>
      <Header />
      <div className="min-h-screen py-8">
        <div className="container flex flex-col lg:flex-row gap-4 px-4">
          {/* Product List */}
          <div className="lg:w-2/3 bg-white p-4 rounded-lg">
            <div className="flex justify-between items-center gap-4 bg-[#FAFAFA] p-2 mb-4">
              <h5 className="font-semibold">Your Order</h5>
              <a href="/addcart" className="no-underline text-black text-sm">
                EDIT
              </a>
            </div>

            <div className="mb-4">
              <p className="font-medium">{user?.name || "Guest User"}</p>
              <p>{getFormattedAddress(items[0]?.location)}</p>
            </div>

            <div className="bg-gray-100 h-px mb-4"></div>

            <h5 className="bg-[#FAFAFA] p-3 font-semibold mb-2">
              Package Summary
            </h5>

            {items.map((item, index) => (
              <div
                key={item.id}
                className="grid grid-cols-1 sm:grid-cols-7 gap-2 mt-4 items-center"
              >
                <div className="col-span-1">
                  <img
                    src={
                      item.imageUrl ||
                      "https://www.collinsdictionary.com/images/full/apple_158989157.jpg"
                    }
                    alt={item.productName}
                    className="w-24 h-24 object-cover rounded"
                  />
                </div>
                <div className="col-span-4">
                  <h5 className="font-semibold">{item.productName}</h5>
                  <p className="text-sm text-gray-600">{item.farmName}</p>
                  <p className="text-sm text-gray-600">
                    {getFormattedAddress(item.location)}
                  </p>
                  {item.discountPrice > 0 && (
                    <p className="text-sm text-green-500">
                      {item.discountPrice}% off
                    </p>
                  )}
                </div>
                <div className="col-span-2 flex justify-between items-center">
                  <h5 className="text-green-500 font-semibold">
                    Rs.{" "}
                    {(
                      (item.price *
                        item.quantity *
                        (100 - (item.discountPrice || 0))) /
                      100
                    ).toFixed(2)}
                  </h5>
                  <p className="text-sm">Qty: {item.quantity}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:w-1/3 bg-white p-4 rounded-lg">
            <div className="flex justify-between bg-[#FAFAFA] p-2 mb-4">
              <h5 className="font-semibold">Order Summary</h5>
              <a href="/addcart" className="no-underline text-black text-sm">
                EDIT
              </a>
            </div>

            <div className="flex justify-between items-center mb-2">
              <p>
                Items Total{" "}
                <span className="text-gray-500">
                  ({items.length} item{items.length > 1 ? "s" : ""})
                </span>
              </p>
              <h5>Rs. {itemTotal.toFixed(2)}</h5>
            </div>

            {discountAmount > 0 && (
              <div className="flex justify-between items-center mb-2">
                <p>Discount</p>
                <h5 className="text-green-500">
                  -Rs. {discountAmount.toFixed(2)}
                </h5>
              </div>
            )}

            <div className="flex justify-between items-center mb-2">
              <p>Delivery Fee</p>
              <h5>Rs. {deliveryFee.toFixed(2)}</h5>
            </div>

            <hr className="my-2" />

            <div className="flex justify-between items-center">
              <div>
                <p className="font-semibold">Total:</p>
                <p className="text-sm text-gray-500">All Taxes included</p>
              </div>
              <h5 className="text-red-500 text-lg font-bold">
                Rs. {total.toFixed(2)}
              </h5>
            </div>

            <button
              onClick={handleProceedClick}
              className="bg-green-600 p-2 font-semibold text-white w-full rounded hover:bg-green-700 transition mt-4"
            >
              Proceed to Pay
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Buynow;
