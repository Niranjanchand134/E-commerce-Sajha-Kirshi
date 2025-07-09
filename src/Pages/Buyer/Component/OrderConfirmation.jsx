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

  return (
    <>
      <Header />
      <div className="min-h-screen py-8 bg-gray-100">
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="bg-white p-6 rounded-lg shadow-md">
            {isLoading ? (
              <p className="text-center text-gray-600">
                Loading order details...
              </p>
            ) : fetchError ? (
              <p className="text-red-500 text-center">
                {fetchError}
                {error && ` Reason: ${error}`}
              </p>
            ) : (
              <>
                <h4 className="text-2xl font-semibold mb-4 text-center">
                  {status === "success" ||
                  orderData?.orderStatus === "CONFIRMED"
                    ? "Order Confirmed!"
                    : "Order Failed"}
                </h4>
                {status === "success" ||
                orderData?.orderStatus === "CONFIRMED" ? (
                  <div className="text-center">
                    <p className="text-lg text-gray-700 mb-4">
                      Your order has been successfully placed. Thank you for
                      shopping with Sajha Krishi!
                    </p>
                    {orderData && (
                      <div className="text-left">
                        <h5 className="font-semibold text-lg mb-2">
                          Order Details
                        </h5>
                        <p>
                          <strong>Order ID:</strong> {orderData.id}
                        </p>
                        <p>
                          <strong>Total:</strong> Rs. {orderData.totalAmount}
                        </p>
                        <p>
                          <strong>Payment Method:</strong>{" "}
                          {orderData.payment.paymentMethod}
                        </p>
                        <p>
                          <strong>Payment Status:</strong>{" "}
                          {orderData.payment.paymentStatus}
                        </p>
                        {orderData.payment.transactionId && (
                          <p>
                            <strong>Transaction ID:</strong>{" "}
                            {orderData.payment.transactionId}
                          </p>
                        )}
                        <div className="mt-4">
                          <h6 className="font-semibold">Items:</h6>
                          {orderData.items.map((item) => (
                            <div
                              key={item.id}
                              className="flex justify-between mt-2"
                            >
                              <span>
                                {item.productName} (x{item.quantity})
                              </span>
                              <span>Rs. {item.price * item.quantity}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="text-center text-red-500 mb-4">
                    Sorry, your payment failed or was cancelled.
                    {error && ` Reason: ${error}`}
                    <br />
                    Please try again.
                  </p>
                )}
                <div className="mt-6 flex justify-center gap-4">
                  <button
                    onClick={() => navigate("/addcart")}
                    className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
                  >
                    Back to Cart
                  </button>
                  <button
                    onClick={() => navigate("/")}
                    className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 transition"
                  >
                    Continue Shopping
                  </button>
                </div>
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