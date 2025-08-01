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

   const {
     checkoutItems = [],
     itemTotal: providedItemTotal,
     discountAmount: providedDiscountAmount,
     deliveryFee: providedDeliveryFee,
     total: providedTotal,
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
       discountPercentage: 0,
       originalPrice: 999,
       discountedPrice: 999,
       totalDiscountAmount: 0,
     },
   ];

   const items = checkoutItems.length > 0 ? checkoutItems : defaultCheckoutItems;


   const calculateTotals = () => {
     const calculations = items.reduce(
       (acc, item) => {
         const originalPrice = item.originalPrice || item.price;
         const discountPercentage = item.discountPercentage || 0;
         const discountedPrice =
           item.discountedPrice ||
           originalPrice * (1 - discountPercentage / 100);
         const itemSubtotal = originalPrice * item.quantity;
         const itemDiscountAmount =
           (originalPrice - discountedPrice) * item.quantity;

         return {
           itemTotal: acc.itemTotal + itemSubtotal,
           discountAmount: acc.discountAmount + itemDiscountAmount,
         };
       },
       { itemTotal: 0, discountAmount: 0 }
     );

     const deliveryFee = items.length > 0 ? 135 : 0;
     const total =
       calculations.itemTotal - calculations.discountAmount + deliveryFee;

     return {
       itemTotal: calculations.itemTotal,
       discountAmount: calculations.discountAmount,
       deliveryFee,
       total,
     };
   };

    const calculated = calculateTotals();
    const itemTotal =
      providedItemTotal !== undefined
        ? providedItemTotal
        : calculated.itemTotal;
    const discountAmount =
      providedDiscountAmount !== undefined
        ? providedDiscountAmount
        : calculated.discountAmount;
    const deliveryFee =
      providedDeliveryFee !== undefined
        ? providedDeliveryFee
        : calculated.deliveryFee;
    const total =
      providedTotal !== undefined ? providedTotal : calculated.total;


  const getFormattedAddress = (location) => {
    return location || "Shadobato, Road, Lalitpur, Near Shadobato Chok";
  };

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
      <div className="min-h-screen py-8 bg-gray-50">
        <div className="container flex flex-col lg:flex-row gap-6 px-4 max-w-6xl">
          {/* Product List */}
          <div className="lg:w-2/3 bg-white rounded-lg shadow-sm p-6">
            <div className="flex justify-between items-center gap-4 bg-gray-50 p-3 mb-4 rounded">
              <h5 className="font-semibold text-gray-800">Your Order</h5>
              <a
                href="/addcart"
                className="no-underline text-black text-sm font-medium"
              >
                EDIT
              </a>
            </div>

            <div className="mb-4">
              <p className="font-medium text-gray-800">
                {user?.name || "Guest User"}
              </p>
              <p className="text-gray-600 text-sm">
                {getFormattedAddress(items[0]?.location)}
              </p>
            </div>

            <div className="bg-gray-100 h-px mb-4"></div>

            <h5 className="bg-gray-50 p-3 font-semibold text-gray-800 mb-4 rounded">
              Package Summary
            </h5>

            {items.map((item, index) => (
              <div
                key={item.id}
                className="grid grid-cols-1 sm:grid-cols-7 gap-2 mt-4 items-center border-b pb-4 last:border-b-0"
              >
                <div className="col-span-1">
                  <img
                    src={
                      item.imageUrl ||
                      "https://www.collinsdictionary.com/images/full/apple_158989157.jpg"
                    }
                    alt={item.productName}
                    className="w-20 h-20 object-cover rounded"
                  />
                </div>
                <div className="col-span-4">
                  <h5 className="font-semibold text-gray-800">
                    {item.productName}
                  </h5>
                  <p className="text-sm text-gray-600">{item.farmName}</p>
                  <p className="text-xs text-gray-400">
                    {getFormattedAddress(item.location)}
                  </p>
                  {item.discountPercentage > 0 && (
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-sm text-green-600 font-medium">
                        {item.discountPercentage}% OFF
                      </span>
                      <span className="text-xs text-gray-400">
                        Rs. {item.originalPrice.toFixed(2)} each
                      </span>
                    </div>
                  )}
                </div>
                <div className="col-span-2 flex justify-between items-center">
                  <div className="text-right">
                    <h5 className="text-green-600 font-semibold">
                      Rs. {(item.discountedPrice * item.quantity).toFixed(2)}
                    </h5>
                    {item.discountPercentage > 0 && (
                      <div className="text-xs text-green-500">
                        Save Rs. {item.totalDiscountAmount.toFixed(2)}
                      </div>
                    )}
                  </div>
                  <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:w-1/3 bg-white rounded-lg shadow-sm p-6 sticky top-6 h-fit">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              Order Summary
            </h2>
            <div className="space-y-3 mb-4">
              <div className="flex justify-between">
                <span className="text-gray-600">
                  Items ({items.length} {items.length === 1 ? "item" : "items"})
                </span>
                <span className="font-medium">Rs. {itemTotal.toFixed(2)}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Discount</span>
                  <span className="font-medium text-green-600">
                    -Rs. {discountAmount.toFixed(2)}
                  </span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium">
                  Rs. {(itemTotal - discountAmount).toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Delivery Fee</span>
                <span className="font-medium">
                  Rs. {deliveryFee.toFixed(2)}
                </span>
              </div>
            </div>
            <div className="border-t border-gray-200 pt-3 mb-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-semibold text-gray-800">Total</p>
                  <p className="text-xs text-gray-400">All taxes included</p>
                </div>
                <p className="text-lg font-bold text-green-600">
                  Rs. {total.toFixed(2)}
                </p>
              </div>
            </div>
            {discountAmount > 0 && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
                <p className="text-sm text-green-800 font-medium">
                  🎉 You're saving Rs. {discountAmount.toFixed(2)} with current
                  discounts!
                </p>
              </div>
            )}
            <button
              onClick={handleProceedClick}
              className={`w-full bg-green-600 text-white px-4 py-3 rounded-lg font-medium transition-colors ${
                items.length === 0
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:bg-green-700"
              }`}
              disabled={items.length === 0}
            >
              Proceed to Pay ({items.length} items)
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Buynow;
