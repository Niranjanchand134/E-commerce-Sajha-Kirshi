import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import { useAuth } from "../../../Context/AuthContext";
import {
  createOrder,
  initiateEsewaPayment,
  moveToCheckout,
} from "../../../services/OtherServices/cartService";
import { ErrorMessageToast } from "../../../utils/Tostify.util";

const PaymentMethod = () => {
  const { state } = useLocation();
  const { user } = useAuth();
  const navigate = useNavigate();
  const {
    checkoutItems = [],
    itemTotal = 0,
    discountAmount = 0,
    deliveryFee = 135,
    total = 0,
  } = state || {};

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
    if (!user || !user.id) {
      ErrorMessageToast("Please log in to confirm the order!");
      navigate("/Buyer-login");
      return;
    }

    if (!validateForm()) {
      ErrorMessageToast("Please fill in all required fields correctly.");
      return;
    }

    setIsLoading(true);
    try {
      const productIds = items.map((item) => item.productId || item.id);
      await moveToCheckout(user.id, productIds);

      const orderData = {
        userId: user.id,
        farmerId: items[0]?.farmerId,
        items: items.map((item) => ({
          productId: item.productId || item.id,
          productName: item.productName,
          price: item.price,
          discountPrice: item.discountPrice || 0,
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
        itemTotal: Number(itemTotal.toFixed(2)),
        discountAmount: Number(discountAmount.toFixed(2)),
        deliveryFee: Number(deliveryFee.toFixed(2)),
        totalAmount: Number(total.toFixed(2)),
        orderStatus: "PENDING",
      };

      if (selectedMethod === "esewa") {
        console.log("items", items);
        
        console.log("esewa", orderData)
        const response = await initiateEsewaPayment(orderData);
        const paymentRequest = response;

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
        form.submit();
      } else {
        const response = await createOrder(orderData);
        await moveToCheckout(user.id, productIds); // Ensure items are marked for checkout
        ErrorMessageToast("Order confirmed with Cash on Delivery!", "success");
        navigate("/order-confirmation", { state: { orderData: response } });
      }
    } catch (error) {
      console.error("Order confirmation error:", error);
      ErrorMessageToast(
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
                      Full Name *
                    </label>
                    <input
                      type="text"
                      className={`w-full border rounded p-2 ${
                        errors.fullName ? "border-red-500" : "border-gray-300"
                      }`}
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
                      Phone Number *
                    </label>
                    <input
                      type="text"
                      className={`w-full border rounded p-2 ${
                        errors.phoneNumber
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
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
                      className={`w-full border rounded p-2 ${
                        errors.alternatePhoneNumber
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
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
                      className={`w-full border rounded p-2 ${
                        errors.email ? "border-red-500" : "border-gray-300"
                      }`}
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
                      Street Address/Tole *
                    </label>
                    <input
                      type="text"
                      className={`w-full border rounded p-2 ${
                        errors.streetAddress
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
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
                      className="w-full border rounded p-2 border-gray-300"
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
                      Municipality *
                    </label>
                    <input
                      type="text"
                      className={`w-full border rounded p-2 ${
                        errors.municipality
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
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
                      District *
                    </label>
                    <input
                      type="text"
                      className={`w-full border rounded p-2 ${
                        errors.district ? "border-red-500" : "border-gray-300"
                      }`}
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
                      className="w-full border rounded p-2 border-gray-300"
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
                      className="w-full border rounded p-2 border-gray-300"
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
                        className="form-checkbox"
                      />
                      <span className="ml-2 text-sm">
                        Billing address same as delivery address
                      </span>
                    </label>
                  </div>
                  {!deliveryInfo.billingSameAsDelivery && (
                    <>
                      <div>
                        <label className="block text-sm font-medium">
                          Billing Street Address *
                        </label>
                        <input
                          type="text"
                          className={`w-full border rounded p-2 ${
                            errors.billingStreetAddress
                              ? "border-red-500"
                              : "border-gray-300"
                          }`}
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
                          Billing Municipality *
                        </label>
                        <input
                          type="text"
                          className={`w-full border rounded p-2 ${
                            errors.billingMunicipality
                              ? "border-red-500"
                              : "border-gray-300"
                          }`}
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
                          Billing District *
                        </label>
                        <input
                          type="text"
                          className={`w-full border rounded p-2 ${
                            errors.billingDistrict
                              ? "border-red-500"
                              : "border-gray-300"
                          }`}
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

                {/* Payment Method Selection */}
                <h4 className="text-lg font-semibold mt-6">
                  Select Payment Method
                </h4>
                <div className="flex gap-4 mt-4">
                  <div className="space-y-1">
                    <div className="h-32 w-32 p-4 border">
                      <img
                        src="./assets/BuyersImg/images/esewa.png"
                        alt="eSewa"
                        className="w-full h-full object-contain"
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
                        alt="Cash on Delivery"
                        className="w-full h-full object-contain"
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

                {/* Payment Method Confirmation */}
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
                        className="w-16 h-16 object-cover rounded mr-4"
                      />
                      <div className="flex-1">
                        <h5 className="font-semibold text-sm">
                          {item.productName}
                        </h5>
                        <p className="text-sm text-gray-600">{item.farmName}</p>
                        <p className="text-sm text-gray-600">{item.location}</p>
                        {item.discountPrice > 0 && (
                          <p className="text-sm text-green-500">
                            {item.discountPrice}% off
                          </p>
                        )}
                        <p className="text-sm text-gray-600">
                          Qty: {item.quantity}
                        </p>
                        <p className="text-sm font-semibold text-green-500">
                          Rs.{" "}
                          {(
                            (item.price *
                              item.quantity *
                              (100 - (item.discountPrice || 0))) /
                            100
                          ).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Order Totals */}
                <div className="border-t border-gray-200 pt-4">
                  <div className="flex justify-between items-center mb-2">
                    <p className="text-gray-600">
                      Items ({items.length} item{items.length > 1 ? "s" : ""})
                    </p>
                    <p className="font-medium">Rs. {itemTotal.toFixed(2)}</p>
                  </div>
                  {discountAmount > 0 && (
                    <div className="flex justify-between items-center mb-2">
                      <p className="text-gray-600">Discount</p>
                      <p className="font-medium text-green-500">
                        -Rs. {discountAmount.toFixed(2)}
                      </p>
                    </div>
                  )}
                  <div className="flex justify-between items-center mb-2">
                    <p className="text-gray-600">Delivery Fee</p>
                    <p className="font-medium">Rs. {deliveryFee.toFixed(2)}</p>
                  </div>
                  <div className="flex justify-between items-center mt-4">
                    <div>
                      <p className="font-semibold text-gray-800">Total</p>
                      <p className="text-xs text-gray-500">
                        All taxes included
                      </p>
                    </div>
                    <p className="text-lg font-bold text-green-600">
                      Rs. {total.toFixed(2)}
                    </p>
                  </div>
                </div>

                {/* Confirm Order Button */}
                <button
                  onClick={handleConfirmOrder}
                  className={`w-full bg-green-600 text-white px-4 py-2 rounded mt-6 ${
                    isLoading || !selectedMethod
                      ? "opacity-50 cursor-not-allowed"
                      : "hover:bg-green-700"
                  }`}
                  disabled={isLoading || !selectedMethod}
                >
                  {isLoading ? "Processing..." : "Confirm Order"}
                </button>
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
