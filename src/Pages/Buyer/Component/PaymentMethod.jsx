import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import { useAuth } from "../../../Context/AuthContext";
import {
  createOrder,
  initiateEsewaPayment,
  markAsCompleted,
  moveToCheckout,
} from "../../../services/OtherServices/cartService";

const PaymentMethod = () => {
  const { state } = useLocation();
  const { user } = useAuth();
  const navigate = useNavigate();
  const {
    checkoutItems = [],
    itemTotal = 0,
    deliveryFee = 135,
    total = 0,
  } = state || {};

  // Fallback data
  const defaultCheckoutItems = [
    {
      id: 1,
      productName: "Mustang ko Apple",
      price: 999,
      quantity: 1,
      imageUrl:
        "https://www.collinsdictionary.com/images/full/apple_158989157.jpg",
      farmName: "Pratik Farm",
      location: "Shadobato, Road, Lalitpur, Nepal",
    },
  ];

  const items = checkoutItems.length > 0 ? checkoutItems : defaultCheckoutItems;

  // Delivery information state
  const [deliveryInfo, setDeliveryInfo] = useState({
    fullName: user?.name || "",
    streetAddress: "",
    wardNumber: "",
    municipality: "",
    district: "",
    landmark: "",
    phoneNumber: user?.number || "",
    alternatePhoneNumber: "",
    email: user?.email || "",
    deliveryInstructions: "",
    billingSameAsDelivery: true,
    billingAddress: {
      streetAddress: "",
      municipality: "",
      district: "",
    },
  });
  const [selectedMethod, setSelectedMethod] = useState("");
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  // Validate delivery information
  const validateForm = () => {
    const newErrors = {};
    if (!deliveryInfo.fullName.trim())
      newErrors.fullName = "Full name is required";
    if (!deliveryInfo.streetAddress.trim())
      newErrors.streetAddress = "Street address is required";
    if (!deliveryInfo.municipality.trim())
      newErrors.municipality = "Municipality is required";
    if (!deliveryInfo.district.trim())
      newErrors.district = "District is required";
    if (!deliveryInfo.phoneNumber.trim())
      newErrors.phoneNumber = "Phone number is required";
    if (
      deliveryInfo.phoneNumber.trim() &&
      !/^\+?\d{10,}$/.test(deliveryInfo.phoneNumber)
    )
      newErrors.phoneNumber = "Invalid phone number";
    if (
      deliveryInfo.alternatePhoneNumber.trim() &&
      !/^\+?\d{10,}$/.test(deliveryInfo.alternatePhoneNumber)
    )
      newErrors.alternatePhoneNumber = "Invalid alternate phone number";
    if (deliveryInfo.email.trim() && !/\S+@\S+\.\S+/.test(deliveryInfo.email))
      newErrors.email = "Invalid email address";
    if (!selectedMethod)
      newErrors.paymentMethod = "Please select a payment method";
    if (!deliveryInfo.billingSameAsDelivery) {
      if (!deliveryInfo.billingAddress.streetAddress.trim())
        newErrors.billingStreetAddress = "Billing street address is required";
      if (!deliveryInfo.billingAddress.municipality.trim())
        newErrors.billingMunicipality = "Billing municipality is required";
      if (!deliveryInfo.billingAddress.district.trim())
        newErrors.billingDistrict = "Billing district is required";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleConfirmOrder = async () => {
    if (!validateForm()) {
      alert("Please fill in all required fields correctly.");
      return;
    }

    setIsLoading(true);
    try {

      console.log("Here is the Items Data at payment", items);
      // Move selected items to checkout
      const productIds = items.map((item) => item.productId || item.id);
      await moveToCheckout(user.id, productIds);

      // Prepare order data
      const orderData = {
        userId: user.id,
        farmerId: items[0].farmerId,
        items: items.map((item) => ({
          productId: item.productId || item.id,
          productName: item.productName,
          price: item.price,
          quantity: item.quantity,
          farmName: item.farmName,
          location: item.location,
          imageUrl: item.imageUrl,
        })),
        deliveryInfo: {
          ...deliveryInfo,
          billingAddress: deliveryInfo.billingSameAsDelivery
            ? {
                streetAddress: deliveryInfo.streetAddress,
                wardNumber: deliveryInfo.wardNumber,
                municipality: deliveryInfo.municipality,
                district: deliveryInfo.district,
              }
            : deliveryInfo.billingAddress,
        },
        payment: {
          paymentMethod: selectedMethod.toUpperCase(),
          paymentStatus: "PENDING",
          amount: Number(total.toFixed(2)),
        },
        totalAmount: Number(total.toFixed(2)),
        orderStatus: "PENDING",
      };
      console.log("order data", orderData); 

      if (selectedMethod === "esewa") {
        // Initiate eSewa payment
        const response = await initiateEsewaPayment(orderData);
        const paymentRequest = response;

        // Create form to submit to eSewa
        const form = document.createElement("form");
        form.method = "POST";
        form.action = "https://rc-epay.esewa.com.np/api/epay/main/v2/form";

        const fields = {
          amount: paymentRequest.amount,
          tax_amount: paymentRequest.tax_amount,
          total_amount: paymentRequest.total_amount,
          transaction_uuid: paymentRequest.transaction_uuid,
          product_code: paymentRequest.product_code,
          product_service_charge: paymentRequest.product_service_charge,
          product_delivery_charge: paymentRequest.product_delivery_charge,
          success_url: paymentRequest.success_url,
          failure_url: paymentRequest.failure_url,
          signed_field_names: paymentRequest.signed_field_names,
          signature: paymentRequest.signature,
        };

        for (const [key, value] of Object.entries(fields)) {
          const input = document.createElement("input");
          input.type = "hidden";
          input.name = key;
          input.value = value;
          form.appendChild(input);
        }

        document.body.appendChild(form);
        console.log("Submitting eSewa form with fields:", fields);
        form.submit();
      } else {
        // Save order for Cash on Delivery
        const response = await createOrder(orderData);
        // await markAsCompleted(user.id);
        alert("Order confirmed with Cash on Delivery!");
        navigate("/order-confirmation", { state: { orderData: response } });
      }
    } catch (error) {
      console.error("Order confirmation error:", error);
      alert(
        `Order confirmation failed: ${
          error.response?.data?.message || error.message
        }`
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Left Column - Delivery and Payment Form */}
            <div className="lg:w-2/3 space-y-6">
              {/* Delivery Information Card */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-gray-800">
                    Delivery Information
                  </h2>
                  <div className="text-sm text-gray-500">* Required fields</div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium">
                      Full Name
                    </label>
                    <input
                      type="text"
                      className="w-full border rounded p-2"
                      value={deliveryInfo.fullName}
                      onChange={(e) =>
                        setDeliveryInfo({
                          ...deliveryInfo,
                          fullName: e.target.value,
                        })
                      }
                    />
                    {errors.fullName && (
                      <p className="text-red-500 text-sm">{errors.fullName}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium">
                      Phone Number
                    </label>
                    <input
                      type="text"
                      className="w-full border rounded p-2"
                      value={deliveryInfo.phoneNumber}
                      onChange={(e) =>
                        setDeliveryInfo({
                          ...deliveryInfo,
                          phoneNumber: e.target.value,
                        })
                      }
                    />
                    {errors.phoneNumber && (
                      <p className="text-red-500 text-sm">
                        {errors.phoneNumber}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium">
                      Alternate Phone Number
                    </label>
                    <input
                      type="text"
                      className="w-full border rounded p-2"
                      value={deliveryInfo.alternatePhoneNumber}
                      onChange={(e) =>
                        setDeliveryInfo({
                          ...deliveryInfo,
                          alternatePhoneNumber: e.target.value,
                        })
                      }
                    />
                    {errors.alternatePhoneNumber && (
                      <p className="text-red-500 text-sm">
                        {errors.alternatePhoneNumber}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium">Email</label>
                    <input
                      type="email"
                      className="w-full border rounded p-2"
                      value={deliveryInfo.email}
                      onChange={(e) =>
                        setDeliveryInfo({
                          ...deliveryInfo,
                          email: e.target.value,
                        })
                      }
                    />
                    {errors.email && (
                      <p className="text-red-500 text-sm">{errors.email}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium">
                      Street Address/Tole
                    </label>
                    <input
                      type="text"
                      className="w-full border rounded p-2"
                      value={deliveryInfo.streetAddress}
                      onChange={(e) =>
                        setDeliveryInfo({
                          ...deliveryInfo,
                          streetAddress: e.target.value,
                        })
                      }
                    />
                    {errors.streetAddress && (
                      <p className="text-red-500 text-sm">
                        {errors.streetAddress}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium">
                      Ward Number
                    </label>
                    <input
                      type="text"
                      className="w-full border rounded p-2"
                      value={deliveryInfo.wardNumber}
                      onChange={(e) =>
                        setDeliveryInfo({
                          ...deliveryInfo,
                          wardNumber: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium">
                      Municipality
                    </label>
                    <input
                      type="text"
                      className="w-full border rounded p-2"
                      value={deliveryInfo.municipality}
                      onChange={(e) =>
                        setDeliveryInfo({
                          ...deliveryInfo,
                          municipality: e.target.value,
                        })
                      }
                    />
                    {errors.municipality && (
                      <p className="text-red-500 text-sm">
                        {errors.municipality}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium">
                      District
                    </label>
                    <input
                      type="text"
                      className="w-full border rounded p-2"
                      value={deliveryInfo.district}
                      onChange={(e) =>
                        setDeliveryInfo({
                          ...deliveryInfo,
                          district: e.target.value,
                        })
                      }
                    />
                    {errors.district && (
                      <p className="text-red-500 text-sm">{errors.district}</p>
                    )}
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium">
                      Landmark (Optional)
                    </label>
                    <input
                      type="text"
                      className="w-full border rounded p-2"
                      value={deliveryInfo.landmark}
                      onChange={(e) =>
                        setDeliveryInfo({
                          ...deliveryInfo,
                          landmark: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium">
                      Delivery Instructions (Optional)
                    </label>
                    <textarea
                      className="w-full border rounded p-2"
                      value={deliveryInfo.deliveryInstructions}
                      onChange={(e) =>
                        setDeliveryInfo({
                          ...deliveryInfo,
                          deliveryInstructions: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={deliveryInfo.billingSameAsDelivery}
                        onChange={(e) =>
                          setDeliveryInfo({
                            ...deliveryInfo,
                            billingSameAsDelivery: e.target.checked,
                          })
                        }
                      />
                      <span className="ml-2">
                        Billing address same as delivery address
                      </span>
                    </label>
                  </div>
                  {!deliveryInfo.billingSameAsDelivery && (
                    <>
                      <div>
                        <label className="block text-sm font-medium">
                          Billing Street Address
                        </label>
                        <input
                          type="text"
                          className="w-full border rounded p-2"
                          value={deliveryInfo.billingAddress.streetAddress}
                          onChange={(e) =>
                            setDeliveryInfo({
                              ...deliveryInfo,
                              billingAddress: {
                                ...deliveryInfo.billingAddress,
                                streetAddress: e.target.value,
                              },
                            })
                          }
                        />
                        {errors.billingStreetAddress && (
                          <p className="text-red-500 text-sm">
                            {errors.billingStreetAddress}
                          </p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium">
                          Billing Municipality
                        </label>
                        <input
                          type="text"
                          className="w-full border rounded p-2"
                          value={deliveryInfo.billingAddress.municipality}
                          onChange={(e) =>
                            setDeliveryInfo({
                              ...deliveryInfo,
                              billingAddress: {
                                ...deliveryInfo.billingAddress,
                                municipality: e.target.value,
                              },
                            })
                          }
                        />
                        {errors.billingMunicipality && (
                          <p className="text-red-500 text-sm">
                            {errors.billingMunicipality}
                          </p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium">
                          Billing District
                        </label>
                        <input
                          type="text"
                          className="w-full border rounded p-2"
                          value={deliveryInfo.billingAddress.district}
                          onChange={(e) =>
                            setDeliveryInfo({
                              ...deliveryInfo,
                              billingAddress: {
                                ...deliveryInfo.billingAddress,
                                district: e.target.value,
                              },
                            })
                          }
                        />
                        {errors.billingDistrict && (
                          <p className="text-red-500 text-sm">
                            {errors.billingDistrict}
                          </p>
                        )}
                      </div>
                    </>
                  )}
                </div>

                <h4 className="text-lg font-semibold mt-6">
                  Select Payment Method
                </h4>
                <div className="flex gap-4 mt-4">
                  <div className="space-y-1">
                    <div className="h-32 w-32 p-4 border">
                      <img
                        src="./assets/BuyersImg/images/esewa.png"
                        alt="esewa img"
                      />
                    </div>
                    <div
                      className={`w-32 rounded text-center cursor-pointer p-2 ${
                        selectedMethod === "esewa"
                          ? "bg-[#60BC47] text-white"
                          : "text-black hover:bg-[#60BC47] hover:text-white"
                      }`}
                      onClick={() => setSelectedMethod("esewa")}
                    >
                      eSewa Mobile Wallet
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="h-32 w-32 p-4 border">
                      <img
                        src="./assets/BuyersImg/images/delivery.png"
                        alt="delivery img"
                      />
                    </div>
                    <div
                      className={`w-32 rounded text-center cursor-pointer p-2 ${
                        selectedMethod === "cod"
                          ? "bg-[#60BC47] text-white"
                          : "text-black hover:bg-[#60BC47] hover:text-white"
                      }`}
                      onClick={() => setSelectedMethod("cod")}
                    >
                      Cash on Delivery
                    </div>
                  </div>
                </div>
                {errors.paymentMethod && (
                  <p className="text-red-500 text-sm mt-2">
                    {errors.paymentMethod}
                  </p>
                )}

                <div className="mt-6">
                  {selectedMethod === "esewa" && (
                    <div className="bg-green-100 border-l-4 border-green-600 p-4 rounded">
                      <h5 className="font-bold text-green-700">
                        eSewa Selected
                      </h5>
                      <p>
                        eSewa account {deliveryInfo.fullName} will be charged
                      </p>
                    </div>
                  )}
                  {selectedMethod === "cod" && (
                    <div className="bg-yellow-100 border-l-4 border-yellow-600 p-4 rounded">
                      <h5 className="font-bold text-yellow-700">
                        Cash on Delivery Selected
                      </h5>
                      <p>
                        You may pay in cash to our courier upon receiving your
                        parcel at the doorstep. Before agreeing to receive the
                        parcel, check if your delivery status has been updated
                        to 'Out for Delivery'. Before receiving, confirm that
                        the airway bill shows that the parcel is from Sajha
                        Krishi. Before you make payment to the courier, confirm
                        your order number, sender information, and tracking
                        number on the parcel.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Right Column - Order Summary */}
            <div className="lg:w-1/3">
              <div className="bg-white rounded-lg shadow-sm p-6 sticky top-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold text-gray-800">
                    Order Summary
                  </h2>
                  <a
                    href="/addcart"
                    className="text-green-600 hover:text-green-700 text-sm font-medium flex items-center"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 mr-1"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                      />
                    </svg>
                    Edit
                  </a>
                </div>

                {/* Order Items */}
                <div className="space-y-4 mb-4">
                  {items.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-start border-b border-gray-100 pb-4"
                    >
                      <img
                        src={
                          item.imageUrl ||
                          "https://www.collinsdictionary.com/images/full/apple_158989157.jpg"
                        }
                        alt={item.productName}
                        className="w-16 h-16 object-cover rounded-lg mr-3"
                      />
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-800">
                          {item.productName}
                        </h4>
                        <p className="text-xs text-gray-500">{item.farmName}</p>
                        <div className="flex justify-between mt-1">
                          <span className="text-sm text-gray-500">
                            Qty: {item.quantity}
                          </span>
                          <span className="font-medium text-green-600">
                            Rs. {item.price * item.quantity}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Order Totals */}
                <div className="space-y-3 mb-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">
                      Items ({items.length}{" "}
                      {items.length === 1 ? "item" : "items"})
                    </span>
                    <span className="font-medium">Rs. {itemTotal}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Delivery Fee</span>
                    <span className="font-medium">Rs. {deliveryFee}</span>
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-3 mb-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-semibold text-gray-800">
                        Total Amount
                      </p>
                      <p className="text-xs text-gray-400">
                        All taxes included
                      </p>
                    </div>
                    <p className="text-lg font-bold text-green-600">
                      Rs. {total.toFixed(2)}
                    </p>
                  </div>
                </div>

                <button
                  onClick={handleConfirmOrder}
                  disabled={isLoading}
                  className={`w-full bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-4 rounded-lg transition duration-200 flex items-center justify-center ${
                    isLoading ? "opacity-70 cursor-not-allowed" : ""
                  }`}
                >
                  {isLoading ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Processing...
                    </>
                  ) : (
                    "Confirm Order"
                  )}
                </button>

                <div className="mt-4 text-center text-xs text-gray-400">
                  By placing your order, you agree to our Terms and Conditions
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default PaymentMethod;
