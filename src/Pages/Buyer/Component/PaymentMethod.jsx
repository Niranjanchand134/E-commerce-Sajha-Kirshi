import { useLocation } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import React, { useState } from "react";

const PaymentMethod = () => {
  const { state } = useLocation();
  const [selectedMethod, setSelectedMethod] = useState("");
  const { product, farmer, UserData, quantity } = state || {};

  const productData = product || { name: "Apple", price: 999 };
  const qty = quantity || 1;

  const itemTotal = productData.price * qty;
  const deliveryFee = 135;
  const total = itemTotal + deliveryFee;

  return (
    <>
    <Header/>
      <div className="min-h-screen py-8">
        <div className="container flex gap-4 px-4">
        <div className="lg:w-2/3 bg-white p-4">
            <h4 className="text-lg font-semibold">Select Payment Method</h4>

            <div className="flex gap-4 mt-4 ">
                {/* eSewa Option */}
                <div className="space-y-1" onClick={() => setSelectedMethod("esewa")}>
                  <div className="h-32 w-32 p-4 border">
                      <img src="./assets/BuyersImg/images/esewa.png" alt="esewa img" />
                  </div>
                  <div
                      className={`w-32 rounded text-center cursor-pointer ${
                      selectedMethod === "esewa"
                          ? "bg-[#60BC47] text-white"
                          : "text-black hover:bg-[#60BC47] "
                      }`}
                  >
                      <button className="w-full h-full hover:text-white">eSewa Mobile Wallet</button>
                  </div>
                </div>

                {/* Cash on Delivery Option */}
                <div className="space-y-1" onClick={() => setSelectedMethod("cod")}>
                  <div className="h-32 w-32 p-4 border">
                      <img src="./assets/BuyersImg/images/delivery.png" alt="delivery img" />
                  </div>
                  <div
                      className={`w-32 rounded text-center cursor-pointer ${
                      selectedMethod === "cod"
                          ? "bg-[#60BC47] text-white"
                          : "text-black hover:bg-[#60BC47] "
                      }`}
                  >
                      <button className="w-full h-full hover:text-white">Cash on <br />Delivery</button>
                  </div>
                </div>
            </div>

            {/* Conditional Info Display */}
            <div className="mt-6">
                {selectedMethod === "esewa" && (
                <div className="bg-green-100 border-l-4 border-green-600 p-4 rounded">
                    <h5 className="font-bold text-green-700">eSewa Selected</h5>
                    <p>eSewa account Pratik.....rai will be charged</p>
                    <button className="bg-[#60BC47] rounded p-2 w-32 text-white">Pay Now</button>
                </div>
                )}
                {selectedMethod === "cod" && (
                <div className="bg-yellow-100 border-l-4 border-yellow-600 p-4 rounded">
                    <h5 className="font-bold text-yellow-700">Cash on Delivery Selected</h5>
                    <p>You may pay in cash to our courier upon receiving your parcel at the 
                        doorstep- Before agreeing to receive the parcel, check if your 
                        delivery status has been updated to 'Out for Delivery'- 
                        Before receiving, confirm that the airway bill shows that the 
                        parcel is from Daraz- Before you make payment to the courier, 
                        confirm your order number, sender information and tracking number on the parcel</p>
                    <button className="bg-[#60BC47] rounded p-2 w-32 text-white">Confirm  Order</button>
                </div>
                )}
            </div>
            </div>

          {/* Proceed to Pay */}
          <div className="lg:w-1/3 bg-white p-4 rounded">
            <div className="flex justify-between bg-[#FAFAFA] p-2 ">
              <h5 className="font-semibold mr-4">{productData.name}</h5>
              <a href="#" className="no-underline text-black text-sm">EDIT</a>
            </div>

            <h5 className="font-semibold">Order Summary</h5>

            <div className="flex justify-between">
              <p>
                Items Total{" "}
                <span className="text-gray-500">
                  ({qty} item{qty > 1 ? "s" : ""})
                </span>
              </p>
              <h5>Rs. {itemTotal}</h5>
            </div>

            <div className="flex justify-between">
              <p>Delivery Fee</p>
              <h5>Rs. {deliveryFee}</h5>
            </div>

            <hr className="my-2" />

            <div className="flex justify-between">
              <div>
                <p className="font-semibold">Total:</p>
              </div>
              <h5 className="text-red-500 text-lg font-bold">Rs. {total}</h5>
            </div>
          </div>
        </div>
      </div>
     <Footer/> 
    </>
  );
};

export default PaymentMethod;
