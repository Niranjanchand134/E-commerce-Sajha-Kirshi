import axios from "axios";

export const deleteProductById = async (id) => {
  const response = await fetch(
    `http://localhost:8080/api/farmer/deleteProduct/${id}`,
    {
      method: "DELETE",
    }
  );

  if (!response.ok) {
    throw new Error("Failed to delete product");
  }
  return response.data;
};


export const updateProductById = async (id, data) => {
  const token = localStorage.getItem("token");

  try {
    const response = await axios.patch(
      `http://localhost:8080/farmer/product/${id}`,
      data,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    return response.data;
  } catch (error) {
    if (error.response) {
      console.error(
        "Failed to update",
        error.response.status,
        error.response.data
      );

      // Handle validation errors specifically
      if (
        error.response.status === 400 &&
        error.response.data?.error === "VALIDATION_ERROR"
      ) {
        throw new Error(error.response.data.message);
      }

      throw new Error(
        error.response.data?.message || "Failed to Change Status"
      );
    } else {
      throw new Error("Request failed. Please try again later.");
    }
  }
};

export const categoryChanges = async (category) => {
  const token = localStorage.getItem("token");

  try {
    const response = await axios.get(
      `http://localhost:8080/farmer/products/category/${category}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    console.log(response.data);
    // Ensure we always return an array, even if response.data is a single object
    return Array.isArray(response.data) ? response.data : [response.data];
  } catch (error) {
    console.error("API Error:", error);
    return []; // Return empty array instead of throwing error
  }
};

export const StatusChanges = async (status) => {
  const token = localStorage.getItem("token");

  try {
    const response = await axios.get(
      `http://localhost:8080/farmer/products/status/${status}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    console.log(response.data);
    // Ensure we always return an array, even if response.data is a single object
    return Array.isArray(response.data) ? response.data : [response.data];
  } catch (error) {
    console.error("API Error:", error);
    return []; // Return empty array instead of throwing error
  }
};


export const fillFarmerKyc = async (data) =>{

  const token = localStorage.getItem("token");
  try {
    const response = await axios.post(
      "http://localhost:8080/api/farmer/farmerKyc",
      data,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Error submitting KYC");
  }
}

export const getProductByfarmer = async () =>{

  const token = localStorage.getItem("token");

  const response = await axios.get(
    "http://localhost:8080/api/farmer/getByFarmerId",
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );

  return response.data;
}


export const getChatRoomUserDetails = async (id) => {
  const response = await axios.get(
    `http://localhost:8080/api/rooms/getUserRoom/${id}`
  );
  return response.data;
};

export const getChatRoomFarmerDetails = async (id) => {
  const response = await axios.get(
    `http://localhost:8080/api/rooms/getFarmerRoom/${id}`
  );
  return response.data;
};


export const getDetailsByUserId = async (id) => {
  try {
    const response = await axios.get(
      `http://localhost:8080/api/farmer/getFarmerKYCDetails/${id}`
    );
    return response.data; // Always return the data
  } catch (error) {
    if (error.response && error.response.status === 404) {
      return { status: 404 }; // Return a consistent error object
    }
    throw error; // Re-throw other errors
  }
};

export const getProductById = async (id)=>{
  const response = await axios.get(`http://localhost:8080/getById/${id}`);
  return response.data;
}


export const searchProduct = async (item) => {
  try {
    const response = await axios.get(
      `http://localhost:8080/api/farmer/product/${item}`
    );
    return response.data;
  } catch (error) {
    if (error.response && error.response.status === 404) {
      return []; // return empty array if not found
    }
    throw error; // rethrow other errors
  }
};

export const getOrderList = async () =>{
  const token = localStorage.getItem("token");
  try{
    const response = await axios.get(
      `http://localhost:8080/api/orders/getOrder`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;

  }
  catch (error){
    if (error.response && error.response.status === 404) {
      return []; // return empty array if not found
    }
    throw error; // rethrow other errors
  }
}


export const updateOrder = async (orderId, data) => {
  try {
    const response = await axios.patch(
      `http://localhost:8080/api/orders/updateStatus/${orderId}`,
      { orderStatus: data.status },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    // Extract error message from backend response if available
    const errorMessage =
      error.response?.data || error.message || "Unknown error";
    throw new Error(`Failed to update order status: ${errorMessage}`);
  }
};

export const filterOrders = async (params) => {
  try {
    const queryString = Object.keys(params)
      .map(
        (key) => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`
      )
      .join("&");

    const response = await axios.get(
      `http://localhost:8080/api/orders/filter?${queryString}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    throw error;
  }
};