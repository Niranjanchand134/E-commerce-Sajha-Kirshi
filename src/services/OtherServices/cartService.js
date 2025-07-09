import axios from "axios";

// Base URL configuration
const BASE_URL = "http://localhost:8080/api/cart";

// Configure axios defaults
axios.defaults.headers.common["Content-Type"] = "application/json";
axios.defaults.timeout = 10000; // 10 seconds timeout

// Generic error handler
const handleApiError = (error, operation) => {
  console.error(`Error in ${operation}:`, error);

  if (error.response) {
    // Server responded with error status
    const { status, data } = error.response;
    switch (status) {
      case 400:
        throw new Error(data.message || "Invalid request data");
      case 404:
        throw new Error("Resource not found");
      case 500:
        throw new Error("Internal server error. Please try again later.");
      default:
        throw new Error(data.message || `Server error: ${status}`);
    }
  } else if (error.request) {
    // Network error
    throw new Error(
      "Network error. Please check your connection and try again."
    );
  } else {
    // Other error
    throw new Error("An unexpected error occurred. Please try again.");
  }
};

// 1. Add item to cart
export const addToCart = async (data) => {
  try {
    // Validate required fields
    if (
      !data.userId ||
      !data.productId ||
      !data.productName ||
      !data.price ||
      !data.quantity
    ) {
      throw new Error(
        "Missing required fields: userId, productId, productName, price, quantity"
      );
    }

    // Validate data types
    if (typeof data.userId !== "number" || typeof data.productId !== "number") {
      throw new Error("userId and productId must be numbers");
    }

    if (typeof data.price !== "number" || data.price <= 0) {
      throw new Error("Price must be a positive number");
    }

    if (typeof data.quantity !== "number" || data.quantity <= 0) {
      throw new Error("Quantity must be a positive number");
    }

    const response = await axios.post(`${BASE_URL}/addToCart`, data);
    return {
      success: true,
      data: response.data,
      message: "Item added to cart successfully",
    };
  } catch (error) {
    handleApiError(error, "addToCart");
  }
};

// 2. Get cart items for a user
export const getCartItems = async (userId) => {
  try {
    if (!userId || typeof userId !== "number") {
      throw new Error("Valid userId is required");
    }

    const response = await axios.get(`${BASE_URL}/user/${userId}`);
    return {
      success: true,
      data: response.data,
      message: "Cart items retrieved successfully",
    };
  } catch (error) {
    handleApiError(error, "getCartItems");
  }
};

// 3. Update cart item
export const updateCartItem = async (itemId, data) => {
  try {
    if (!itemId || typeof itemId !== "number") {
      throw new Error("Valid itemId is required");
    }

    if (
      !data.quantity ||
      typeof data.quantity !== "number" ||
      data.quantity <= 0
    ) {
      throw new Error("Valid quantity is required");
    }

    if (data.price && (typeof data.price !== "number" || data.price <= 0)) {
      throw new Error("Price must be a positive number");
    }

    const response = await axios.patch(`${BASE_URL}/update/${itemId}`, data);
    return {
      success: true,
      data: response.data,
      message: "Cart item updated successfully",
    };
  } catch (error) {
    handleApiError(error, "updateCartItem");
  }
};

// 4. Remove cart item
export const removeCartItem = async (itemId) => {
  try {
    if (!itemId || typeof itemId !== "number") {
      throw new Error("Valid itemId is required");
    }

    const response = await axios.delete(`${BASE_URL}/remove/${itemId}`);
    return {
      success: true,
      data: response.data,
      message: "Item removed from cart successfully",
    };
  } catch (error) {
    handleApiError(error, "removeCartItem");
  }
};

// 5. Clear entire cart
export const clearCart = async (userId) => {
  try {
    if (!userId || typeof userId !== "number") {
      throw new Error("Valid userId is required");
    }

    const response = await axios.delete(`${BASE_URL}/clear/${userId}`);
    return {
      success: true,
      data: response.data,
      message: "Cart cleared successfully",
    };
  } catch (error) {
    handleApiError(error, "clearCart");
  }
};

// 6. Get cart total
export const getCartTotal = async (userId) => {
  try {
    if (!userId || typeof userId !== "number") {
      throw new Error("Valid userId is required");
    }

    const response = await axios.get(`${BASE_URL}/total/${userId}`);
    return {
      success: true,
      data: response.data,
      message: "Cart total retrieved successfully",
    };
  } catch (error) {
    handleApiError(error, "getCartTotal");
  }
};

// 7. Get cart item count
export const getCartItemCount = async (userId) => {
  try {
    if (!userId || typeof userId !== "number") {
      throw new Error("Valid userId is required");
    }

    const response = await axios.get(`${BASE_URL}/count/${userId}`);
    return {
      success: true,
      data: response.data,
      message: "Cart item count retrieved successfully",
    };
  } catch (error) {
    handleApiError(error, "getCartItemCount");
  }
};

// 8. Get cart summary
export const getCartSummary = async (userId) => {
  try {
    if (!userId || typeof userId !== "number") {
      throw new Error("Valid userId is required");
    }

    const response = await axios.get(`${BASE_URL}/summary/${userId}`);
    return {
      success: true,
      data: response.data,
      message: "Cart summary retrieved successfully",
    };
  } catch (error) {
    handleApiError(error, "getCartSummary");
  }
};

// 9. Move cart to checkout
export const moveToCheckout = async (userId) => {
  try {
    if (!userId || typeof userId !== "number") {
      throw new Error("Valid userId is required");
    }

    const response = await axios.post(`${BASE_URL}/checkout/${userId}`);
    return {
      success: true,
      data: response.data,
      message: "Cart moved to checkout successfully",
    };
  } catch (error) {
    handleApiError(error, "moveToCheckout");
  }
};

// 10. Mark cart as completed
export const markAsCompleted = async (userId) => {
  try {
    if (!userId || typeof userId !== "number") {
      throw new Error("Valid userId is required");
    }

    const response = await axios.post(`${BASE_URL}/complete/${userId}`);
    return {
      success: true,
      data: response.data,
      message: "Cart marked as completed successfully",
    };
  } catch (error) {
    handleApiError(error, "markAsCompleted");
  }
};

// 11. Bulk operations - Add multiple items
export const addMultipleToCart = async (items) => {
  try {
    if (!Array.isArray(items) || items.length === 0) {
      throw new Error("Items must be a non-empty array");
    }

    const promises = items.map((item) => addToCart(item));
    const results = await Promise.allSettled(promises);

    const successful = results.filter(
      (result) => result.status === "fulfilled"
    );
    const failed = results.filter((result) => result.status === "rejected");

    return {
      success: failed.length === 0,
      data: {
        successful: successful.map((result) => result.value),
        failed: failed.map((result) => result.reason.message),
        totalItems: items.length,
        successCount: successful.length,
        failureCount: failed.length,
      },
      message: `${successful.length} items added successfully, ${failed.length} failed`,
    };
  } catch (error) {
    handleApiError(error, "addMultipleToCart");
  }
};

// 12. Update multiple cart items
export const updateMultipleCartItems = async (updates) => {
  try {
    if (!Array.isArray(updates) || updates.length === 0) {
      throw new Error("Updates must be a non-empty array");
    }

    const promises = updates.map((update) =>
      updateCartItem(update.itemId, update.data)
    );
    const results = await Promise.allSettled(promises);

    const successful = results.filter(
      (result) => result.status === "fulfilled"
    );
    const failed = results.filter((result) => result.status === "rejected");

    return {
      success: failed.length === 0,
      data: {
        successful: successful.map((result) => result.value),
        failed: failed.map((result) => result.reason.message),
        totalUpdates: updates.length,
        successCount: successful.length,
        failureCount: failed.length,
      },
      message: `${successful.length} items updated successfully, ${failed.length} failed`,
    };
  } catch (error) {
    handleApiError(error, "updateMultipleCartItems");
  }
};

// 13. Get cart statistics
export const getCartStatistics = async (userId) => {
  try {
    if (!userId || typeof userId !== "number") {
      throw new Error("Valid userId is required");
    }

    const [itemsResult, totalResult, countResult] = await Promise.allSettled([
      getCartItems(userId),
      getCartTotal(userId),
      getCartItemCount(userId),
    ]);

    const items =
      itemsResult.status === "fulfilled" ? itemsResult.value.data : [];
    const total =
      totalResult.status === "fulfilled" ? totalResult.value.data : 0;
    const count =
      countResult.status === "fulfilled" ? countResult.value.data : 0;

    return {
      success: true,
      data: {
        items,
        total,
        count,
        uniqueProducts: items.length,
        averagePrice: items.length > 0 ? total / count : 0,
        isEmpty: items.length === 0,
      },
      message: "Cart statistics retrieved successfully",
    };
  } catch (error) {
    handleApiError(error, "getCartStatistics");
  }
};

// 14. Utility function to validate cart item data
export const validateCartItemData = (data) => {
  const errors = [];

  if (!data.userId || typeof data.userId !== "number") {
    errors.push("Valid userId is required");
  }

  if (!data.productId || typeof data.productId !== "number") {
    errors.push("Valid productId is required");
  }

  if (
    !data.productName ||
    typeof data.productName !== "string" ||
    data.productName.trim().length === 0
  ) {
    errors.push("Valid productName is required");
  }

  if (!data.price || typeof data.price !== "number" || data.price <= 0) {
    errors.push("Valid price is required");
  }

  if (
    !data.quantity ||
    typeof data.quantity !== "number" ||
    data.quantity <= 0
  ) {
    errors.push("Valid quantity is required");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

// 15. Retry mechanism for failed requests
export const retryApiCall = async (
  apiFunction,
  maxRetries = 3,
  delay = 1000
) => {
  let lastError;

  for (let i = 0; i < maxRetries; i++) {
    try {
      return await apiFunction();
    } catch (error) {
      lastError = error;
      if (i < maxRetries - 1) {
        await new Promise((resolve) => setTimeout(resolve, delay * (i + 1)));
      }
    }
  }

  throw lastError;
};

// Export all functions as default object
export default {
  addToCart,
  getCartItems,
  updateCartItem,
  removeCartItem,
  clearCart,
  getCartTotal,
  getCartItemCount,
  getCartSummary,
  moveToCheckout,
  markAsCompleted,
  addMultipleToCart,
  updateMultipleCartItems,
  getCartStatistics,
  validateCartItemData,
  retryApiCall,
};



export async function createOrder(orderData) {
  try {
    const response = await fetch("/api/orders/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(orderData),
    });
    if (!response.ok) throw new Error("Failed to create order");
    return response.json();
  } catch (error) {
    throw new Error(error.message);
  }
}

export const initiateEsewaPayment = async(orderData)=>{
  try {
    const response = await fetch(
      `http://localhost:8080/api/orders/initiate-esewa`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData),
      }
    );
    if (!response.ok) throw new Error("Failed to initiate eSewa payment");
    return response.json();
  } catch (error) {
    throw new Error(error.message);
  }
}

export const getOrderById = async (orderId) => {
  try {
    const response = await fetch(
      `http://localhost:8080/api/orders/${orderId}`,
      {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      }
    );
    if (!response.ok) throw new Error("Failed to fetch order details");
    return response.json();
  } catch (error) {
    throw new Error(error.message);
  }
};


