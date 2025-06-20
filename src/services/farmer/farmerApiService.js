import axios from "axios";

export const deleteProductById = async (id) => {
  const response = await fetch(`http://localhost:8080/farmer/product/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error("Failed to delete product");
  }
  return response.json();
};


export const updateProductById = async (id, data)=>{

    const token = localStorage.getItem("token");

    try{
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
    }
    catch (error){
        if (error.response) {
          console.error(
            "failed to update",
            error.response.status,
            error.response.data
          );
          throw new Error(error.response.data?.message || "Failed to Change Status");
        } else {
          // console.error("Error with request:", error.message);
          throw new Error("Request failed. Please try again later.");
        }
    }

    
}

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


export const getChatRoomUserDetails = async (id) =>{

  const response = await axios.get(
    `http://localhost:8080/api/rooms/getUserRoom/${id}`
  );

  return response.data;

}