import React, { useState, useEffect } from "react";
import Footer from "./Footer";
import Header from "./Header";
import { useAuth } from "../../../Context/AuthContext";
import { ErrorMessageToast } from "../../../utils/Tostify.util";
import { useNavigate } from "react-router-dom";

const MyOrdersPage = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("all");
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [currentReviewItem, setCurrentReviewItem] = useState(null);
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [orderToCancel, setOrderToCancel] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        if (!user?.id) return;

        setLoading(true);
        const response = await fetch(
          `http://localhost:8080/api/orders/getOrder/${user.id}`
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setOrders(data);
      } catch (error) {
        setError(error.message);
        // ErrorMessageToast("Failed to fetch orders: " + error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user]);

  // Filter orders based on active tab
  const filteredOrders =
    activeTab === "all"
      ? orders
      : orders.filter(
          (order) => order.orderStatus.toLowerCase() === activeTab.toLowerCase()
        );

  // Status styling
  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "delivered":
        return "bg-green-100 text-green-800";
      case "shipped":
        return "bg-blue-100 text-blue-800";
      case "processing":
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Toggle order details expansion
  const toggleOrderDetails = (orderId) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  // Handle review submission
  const handleSubmitReview = () => {
    if (!currentReviewItem || !reviewRating) return;

    const updatedOrders = orders.map((order) => {
      const updatedItems = order.items.map((item) => {
        if (item.productId === currentReviewItem.productId) {
          return { ...item, rating: reviewRating, review: reviewText };
        }
        return item;
      });
      return { ...order, items: updatedItems };
    });

    setOrders(updatedOrders);
    setShowReviewModal(false);
    setReviewRating(0);
    setReviewText("");
  };

  // Show cancel confirmation modal
  const showCancelConfirmation = (orderId) => {
    setOrderToCancel(orderId);
    setShowCancelModal(true);
  };

  // Cancel order function
  const cancelOrder = async () => {
    if (!orderToCancel) return;

    try {
      const response = await fetch(
        `http://localhost:8080/api/orders/updateStatus/${orderToCancel}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            orderStatus: "CANCELLED",
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const updatedOrder = await response.json();

      setOrders(
        orders.map((order) =>
          order.id === orderToCancel
            ? {
                ...order,
                orderStatus: "CANCELLED",
                cancelledDate: new Date().toISOString(),
              }
            : order
        )
      );

      setShowCancelModal(false);
      setOrderToCancel(null);
    } catch (error) {
      setError(error.message);
      ErrorMessageToast("Failed to cancel order: " + error.message);
      setShowCancelModal(false);
      setOrderToCancel(null);
    }
  };

  const handleNavigation = ()=>{
    navigate("/Buyer-shop");
  }

  if (loading) {
    return (
      <>
        <Header />
        <div className="container mx-auto px-4 py-8 max-w-6xl text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your orders...</p>
        </div>
        <Footer />
      </>
    );
  }

  if (error) {
    return (
      <>
        <Header />
        <div className="container mx-auto px-4 py-8 max-w-6xl text-center">
          <div className="text-red-500 mb-4">
            <svg
              className="w-12 h-12 mx-auto"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              ></path>
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900">
            Please Order the Product
          </h3>
          <p className="mt-2 text-gray-600">No Order Available</p>
          <button
          onClick={handleNavigation}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Buy Now
          </button>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">My Orders</h1>

        {/* Order Status Tabs */}
        <div className="flex overflow-x-auto mb-6 border-b">
          {[
            "all",
            "pending",
            "processing",
            "shipped",
            "delivered",
            "cancelled",
          ].map((tab) => (
            <button
              key={tab}
              className={`px-4 py-3 font-medium whitespace-nowrap ${
                activeTab === tab
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-600 hover:text-gray-800"
              }`}
              onClick={() => setActiveTab(tab)}
            >
              {tab === "all"
                ? "All Orders"
                : tab.charAt(0).toUpperCase() + tab.slice(1)}
              {tab !== "all" && (
                <span className="ml-1 text-xs bg-gray-200 px-2 py-0.5 rounded-full">
                  {
                    orders.filter((o) => o.orderStatus.toLowerCase() === tab)
                      .length
                  }
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Orders List */}
        {filteredOrders.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <svg
              className="mx-auto h-16 w-16 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.5"
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              ></path>
            </svg>
            <h3 className="mt-4 text-lg font-medium text-gray-900">
              No orders found
            </h3>
            <p className="mt-2 text-gray-500">
              {activeTab === "all"
                ? "You haven't placed any orders yet."
                : `You don't have any ${activeTab} orders.`}
            </p>
            <button className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
              Start Shopping
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredOrders.map((order) => (
              <div
                key={order.id}
                className="bg-white shadow rounded-lg overflow-hidden"
              >
                {/* Order Header */}
                <div className="px-6 py-4 border-b flex flex-col sm:flex-row justify-between">
                  <div className="mb-2 sm:mb-0">
                    <div className="flex items-center">
                      <span className="text-gray-600">Order #</span>
                      <span className="font-medium ml-1">{order.id}</span>
                      <span className="mx-2 text-gray-400">•</span>
                      <span className="text-gray-600">Placed on</span>
                      <span className="font-medium ml-1">
                        {new Date(order.createdAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </span>
                    </div>
                    {order.orderStatus === "CANCELLED" && order.updatedAt && (
                      <div className="mt-1 text-sm text-gray-600">
                        Cancelled on{" "}
                        {new Date(order.updatedAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                        })}
                      </div>
                    )}
                  </div>
                  <div className="flex items-center">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                        order.orderStatus
                      )}`}
                    >
                      {order.orderStatus}
                    </span>
                  </div>
                </div>

                {/* Order Items Summary */}
                <div className="px-6 py-4">
                  <div className="flex overflow-x-auto pb-2">
                    {order.items.map((item) => (
                      <div key={item.productId} className="flex-shrink-0 mr-4">
                        <img
                          className="h-16 w-16 rounded object-cover border"
                          src={
                            item.imageUrl || "https://via.placeholder.com/80"
                          }
                          alt={item.productName}
                        />
                      </div>
                    ))}
                  </div>
                  <div className="mt-3 flex justify-between items-center">
                    <div>
                      <p className="text-sm text-gray-600">
                        {order.items.length} item
                        {order.items.length > 1 ? "s" : ""} • Total:
                        <span className="font-medium text-gray-900 ml-1">
                          Rs. {order.totalAmount.toFixed(2)}
                        </span>
                      </p>
                    </div>
                    <button
                      onClick={() => toggleOrderDetails(order.id)}
                      className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                    >
                      {expandedOrder === order.id
                        ? "Hide details"
                        : "View details"}
                    </button>
                  </div>
                </div>

                {/* Expanded Order Details */}
                {expandedOrder === order.id && (
                  <div className="border-t">
                    {/* Items Details */}
                    <div className="px-6 py-4">
                      <h3 className="font-medium text-gray-900 mb-3">
                        Items in this order
                      </h3>
                      <div className="space-y-4">
                        {order.items.map((item) => (
                          <div
                            key={item.productId}
                            className="flex border-b pb-4 last:border-0 last:pb-0"
                          >
                            <div className="flex-shrink-0">
                              <img
                                className="h-20 w-20 rounded object-cover border"
                                src={
                                  item.imageUrl ||
                                  "https://via.placeholder.com/80"
                                }
                                alt={item.productName}
                              />
                            </div>
                            <div className="ml-4 flex-1">
                              <div className="flex justify-between">
                                <div>
                                  <h4 className="text-base font-medium text-gray-900">
                                    {item.productName}
                                  </h4>
                                  <p className="text-sm text-gray-600">
                                    Qty: {item.quantity}
                                  </p>
                                  <p className="text-sm text-gray-900">
                                    Rs. {item.price.toFixed(2)}
                                  </p>
                                </div>
                                <div className="text-right">
                                  {order.orderStatus === "DELIVERED" && (
                                    <div className="mb-2">
                                      <p className="text-sm text-gray-600">
                                        Delivered
                                      </p>
                                      {item.rating ? (
                                        <div className="flex items-center justify-end mt-1">
                                          {[...Array(5)].map((_, i) => (
                                            <svg
                                              key={i}
                                              className={`h-4 w-4 ${
                                                i < item.rating
                                                  ? "text-yellow-400"
                                                  : "text-gray-300"
                                              }`}
                                              fill="currentColor"
                                              viewBox="0 0 20 20"
                                            >
                                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                            </svg>
                                          ))}
                                        </div>
                                      ) : (
                                        <button
                                          onClick={() => {
                                            setCurrentReviewItem(item);
                                            setShowReviewModal(true);
                                          }}
                                          className="mt-1 text-xs px-2 py-1 bg-blue-50 text-blue-600 rounded hover:bg-blue-100"
                                        >
                                          Rate & Review
                                        </button>
                                      )}
                                    </div>
                                  )}
                                  <p className="text-sm font-medium">
                                    Rs.{" "}
                                    {(item.price * item.quantity).toFixed(2)}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Order Summary */}
                    <div className="px-6 py-4 bg-gray-50">
                      <h3 className="font-medium text-gray-900 mb-3">
                        Order Summary
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <h4 className="text-sm font-medium text-gray-900 mb-2">
                            Shipping Information
                          </h4>
                          <div className="text-sm text-gray-600 space-y-1">
                            {order.deliveryInfo && (
                              <>
                                <p>{order.deliveryInfo.fullName}</p>
                                <p>{order.deliveryInfo.streetAddress}</p>
                                <p>
                                  {order.deliveryInfo.municipality},{" "}
                                  {order.deliveryInfo.district}
                                </p>
                                <p>Phone: {order.deliveryInfo.phoneNumber}</p>
                              </>
                            )}
                          </div>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-gray-900 mb-2">
                            Payment Information
                          </h4>
                          <div className="text-sm text-gray-600 space-y-1">
                            <p>{order.payment?.paymentMethod || "N/A"}</p>
                            <p>
                              Status: {order.payment?.paymentStatus || "N/A"}
                            </p>
                          </div>

                          <div className="mt-4 text-sm">
                            <div className="flex justify-between py-1">
                              <span className="text-gray-600">Subtotal</span>
                              <span>Rs. {order.totalAmount.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between py-1">
                              <span className="text-gray-600">Shipping</span>
                              <span>Free</span>
                            </div>
                            <div className="flex justify-between py-1 font-medium border-t mt-2 pt-2">
                              <span className="text-gray-900">Total</span>
                              <span className="text-gray-900">
                                Rs. {order.totalAmount.toFixed(2)}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Order Actions */}
                    <div className="px-6 py-4 bg-white border-t flex flex-wrap justify-end gap-3">
                      {order.orderStatus === "PENDING" && (
                        <button
                          onClick={() => showCancelConfirmation(order.id)}
                          className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                        >
                          Cancel Order
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Cancel Order Confirmation Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Cancel Order
            </h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to cancel this order? This action cannot be
              undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowCancelModal(false);
                  setOrderToCancel(null);
                }}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                No, Keep It
              </button>
              <button
                onClick={cancelOrder}
                className="px-4 py-2 bg-red-600 rounded-md text-sm font-medium text-white hover:bg-red-700"
              >
                Yes, Cancel Order
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Review Modal */}
      {showReviewModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Rate & Review
            </h3>
            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-2">
                How would you rate this product?
              </p>
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setReviewRating(star)}
                    className="text-2xl focus:outline-none"
                  >
                    {star <= reviewRating ? "★" : "☆"}
                  </button>
                ))}
              </div>
            </div>
            <div className="mb-4">
              <label
                htmlFor="review"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Your Review
              </label>
              <textarea
                id="review"
                rows="3"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
              />
            </div>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowReviewModal(false);
                  setReviewRating(0);
                  setReviewText("");
                }}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitReview}
                className="px-4 py-2 bg-blue-600 rounded-md text-sm font-medium text-white hover:bg-blue-700"
              >
                Submit Review
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </>
  );
};

export default MyOrdersPage;
