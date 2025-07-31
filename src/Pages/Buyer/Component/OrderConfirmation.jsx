import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import { getOrderById } from "../../../services/OtherServices/cartService";

const OrderConfirmation = () => {
  const { search, state } = useLocation();
  const navigate = useNavigate();
  const params = new URLSearchParams(search);
  const status = params.get("status");
  const orderId = params.get("orderId");
  const error = params.get("error");
  const [orderData, setOrderData] = useState(state?.orderData || null);
  const [isLoading, setIsLoading] = useState(false);
  const [fetchError, setFetchError] = useState(null);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      if (orderId && !orderData) {
        setIsLoading(true);
        try {
          const response = await getOrderById(orderId);
          console.log("Fetched order data:", response);
          setOrderData(response);
        } catch (err) {
          console.error("Error fetching order:", err);
          setFetchError(
            "Failed to fetch order details. Please try again later."
          );
        } finally {
          setIsLoading(false);
        }
      }
    };
    fetchOrderDetails();
  }, [orderId, orderData]);

  // Function to determine if order is successful
  const isOrderSuccessful = () => {
    // Check URL status parameter first
    if (status === "success") return true;

    // If no URL status, check orderData
    if (orderData) {
      // For COD orders, consider them successful if they have PENDING status
      // (since COD orders start as PENDING until delivery)
      if (
        orderData.payment?.paymentMethod === "COD" &&
        (orderData.orderStatus === "PENDING" ||
          orderData.orderStatus === "CONFIRMED")
      ) {
        return true;
      }

      // For other payment methods, check for confirmed/delivered status
      if (
        orderData.orderStatus === "CONFIRMED" ||
        orderData.orderStatus === "DELIVERED" ||
        orderData.payment?.paymentStatus === "COMPLETED"
      ) {
        return true;
      }
    }

    return false;
  };

  const orderSuccessful = isOrderSuccessful();

  return (
    <>
      <Header />
      <div className="min-h-screen py-8 bg-gray-100">
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="bg-white p-6 rounded-lg shadow-md">
            {isLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Loading order details...</p>
              </div>
            ) : fetchError ? (
              <div className="text-center py-8">
                <div className="text-red-500 text-6xl mb-4">❌</div>
                <p className="text-red-500 text-lg font-medium mb-2">
                  Unable to load order details
                </p>
                <p className="text-gray-600">
                  {fetchError}
                  {error && ` Reason: ${error}`}
                </p>
              </div>
            ) : (
              <>
                {/* Order Status Header */}
                <div className="text-center mb-6">
                  <div
                    className={`text-6xl mb-4 ${
                      orderSuccessful ? "text-green-500" : "text-red-500"
                    }`}
                  >
                    {orderSuccessful ? "✅" : "❌"}
                  </div>
                  <h4
                    className={`text-2xl font-semibold mb-2 ${
                      orderSuccessful ? "text-green-700" : "text-red-700"
                    }`}
                  >
                    {orderSuccessful ? "Order Confirmed!" : "Order Failed"}
                  </h4>
                  <p
                    className={`text-lg ${
                      orderSuccessful ? "text-gray-700" : "text-red-600"
                    }`}
                  >
                    {orderSuccessful
                      ? "Your order has been successfully placed. Thank you for shopping with Sajha Krishi!"
                      : "Sorry, your payment failed or was cancelled."}
                    {error && !orderSuccessful && ` Reason: ${error}`}
                  </p>
                </div>

                {/* Order Details */}
                {orderData && orderSuccessful && (
                  <div className="bg-gray-50 rounded-lg p-6 mb-6">
                    <h5 className="font-semibold text-lg mb-4 text-gray-800 border-b pb-2">
                      Order Details
                    </h5>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                      <div className="space-y-2">
                        <p className="flex justify-between">
                          <span className="font-medium text-gray-600">
                            Order ID:
                          </span>
                          <span className="text-gray-800">
                            {orderData.id || "Pending"}
                          </span>
                        </p>
                        <p className="flex justify-between">
                          <span className="font-medium text-gray-600">
                            Total Amount:
                          </span>
                          <span className="text-green-600 font-semibold">
                            Rs. {orderData.totalAmount}
                          </span>
                        </p>
                        <p className="flex justify-between">
                          <span className="font-medium text-gray-600">
                            Payment Method:
                          </span>
                          <span className="text-gray-800">
                            {orderData.payment?.paymentMethod}
                          </span>
                        </p>
                        <p className="flex justify-between">
                          <span className="font-medium text-gray-600">
                            Payment Status:
                          </span>
                          <span
                            className={`font-medium ${
                              orderData.payment?.paymentStatus === "COMPLETED"
                                ? "text-green-600"
                                : orderData.payment?.paymentStatus === "PENDING"
                                ? "text-yellow-600"
                                : "text-red-600"
                            }`}
                          >
                            {orderData.payment?.paymentStatus}
                          </span>
                        </p>
                      </div>

                      <div className="space-y-2">
                        <p className="flex justify-between">
                          <span className="font-medium text-gray-600">
                            Order Status:
                          </span>
                          <span
                            className={`font-medium ${
                              orderData.orderStatus === "CONFIRMED" ||
                              orderData.orderStatus === "DELIVERED"
                                ? "text-green-600"
                                : orderData.orderStatus === "PENDING"
                                ? "text-yellow-600"
                                : "text-red-600"
                            }`}
                          >
                            {orderData.orderStatus}
                          </span>
                        </p>
                        {orderData.payment?.transactionId && (
                          <p className="flex justify-between">
                            <span className="font-medium text-gray-600">
                              Transaction ID:
                            </span>
                            <span className="text-gray-800 text-sm">
                              {orderData.payment.transactionId}
                            </span>
                          </p>
                        )}
                        {orderData.deliveryInfo?.fullName && (
                          <p className="flex justify-between">
                            <span className="font-medium text-gray-600">
                              Delivery To:
                            </span>
                            <span className="text-gray-800">
                              {orderData.deliveryInfo.fullName}
                            </span>
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Items List */}
                    {orderData.items && orderData.items.length > 0 && (
                      <div>
                        <h6 className="font-semibold text-gray-800 mb-3 border-b pb-2">
                          Items Ordered:
                        </h6>
                        <div className="space-y-3">
                          {orderData.items.map((item, index) => (
                            <div
                              key={item.id || index}
                              className="flex justify-between items-center bg-white p-3 rounded border"
                            >
                              <div className="flex-1">
                                <span className="font-medium text-gray-800">
                                  {item.productName}
                                </span>
                                <span className="text-gray-600 ml-2">
                                  (Qty: {item.quantity})
                                </span>
                                {item.farmName && (
                                  <div className="text-sm text-gray-500 mt-1">
                                    From: {item.farmName}
                                  </div>
                                )}
                              </div>
                              <div className="text-right">
                                <div className="font-medium text-gray-800">
                                  Rs. {(item.price * item.quantity).toFixed(2)}
                                </div>
                                <div className="text-sm text-gray-500">
                                  Rs. {item.price}/unit
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* COD Information */}
                    {orderData.payment?.paymentMethod === "COD" && (
                      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mt-4">
                        <h6 className="font-semibold text-yellow-800 mb-2">
                          Cash on Delivery
                        </h6>
                        <p className="text-sm text-yellow-700">
                          Please keep the exact amount ready. Our delivery
                          person will collect Rs. {orderData.totalAmount} when
                          your order arrives.
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row justify-center gap-4">
                  {orderSuccessful ? (
                    <>
                      <button
                        onClick={() => navigate("/Myorderspage")}
                        className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition font-medium"
                      >
                        View My Orders
                      </button>
                      <button
                        onClick={() => navigate("/Buyer-shop")}
                        className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition font-medium"
                      >
                        Continue Shopping
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => navigate("/addcart")}
                        className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition font-medium"
                      >
                        Back to Cart
                      </button>
                      <button
                        onClick={() => navigate("/")}
                        className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition font-medium"
                      >
                        Continue Shopping
                      </button>
                    </>
                  )}
                </div>

                {/* Additional Information */}
                {orderSuccessful && (
                  <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <h6 className="font-semibold text-blue-800 mb-2">
                      What's Next?
                    </h6>
                    <ul className="text-sm text-blue-700 space-y-1">
                      <li>
                        • You will receive an SMS/email confirmation shortly
                      </li>
                      <li>• Track your order status in "My Orders" section</li>
                      <li>
                        • Our team will contact you for delivery confirmation
                      </li>
                      <li>• For any questions, contact our customer support</li>
                    </ul>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default OrderConfirmation;
