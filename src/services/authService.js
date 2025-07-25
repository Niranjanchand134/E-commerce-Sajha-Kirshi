
import axios from "axios";
import { ErrorMessageToast } from "../utils/Tostify.util";

  export const loginDetails = async (email, password) =>{

    try{
      const response = await axios.post("http://localhost:8080/userLogin", {email, password});

      return response.data;
    }
    catch(error){
      if(error.response && error.response.data){
        console.log(error.response.data);
        throw new Error(error.response.data);
      }
      else{
        throw new Error("Login failed. Please try later.")
      }
    }
    
  }

export const UserRegister = async (data) => {
  try {
    const response = await axios.post("http://localhost:8080/registers", data);
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      // Forward error message to caller
      console.log(error.response.data);
      throw new Error(error.response.data);
    } else {
      throw new Error("Registration failed. Please try again.");
    }
  }
};

export const greeting = async () => {
  const response = await axios.get("http://localhost:8080/");

  console.log(response);

  return response.data;
};

export const checkAuth = async () => {
  const token = localStorage.getItem("token");
  // console.log("token", token);
  try {
    const response = await axios.get("http://localhost:8080/test-auth", {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    return response.data; // Return the successful response
  } catch (error) {
    if (error.response) {
      console.error(
        "Server responded with:",
        error.response.status,
        error.response.data
      );
      throw new Error(error.response.data?.message || "Unauthorized");
    }
    throw error; // Re-throw other errors
  }
};

export const addProduct = async (data) =>{
  const token = localStorage.getItem("token"); // or use authToken if passed
  console.log("token",token)
  try {
    const response = await axios.post(
      "http://localhost:8080/farmer/addProduct",
      data,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    console.log("cors header", response);
    return response.data;
  } catch (error) {
    if (error.response) {
      console.error(
        "Server responded with:",
        error.response.status,
        error.response.data
      );
      throw new Error(error.response.data?.message || "Unauthorized");
    } else {
      console.error("Error with request:", error.message);
      throw new Error("Request failed. Please try again later.");
    }
  }
 
}

export const getAllProduct = async ()=>{
  try {
    const response = await axios.get(
      "http://localhost:8080/api/getAll"
    );
    console.log("cors header", response);
    return response.data;
  } catch (error) {
    if (error.response) {
      console.error(
        "Server responded with:",
        error.response.status,
        error.response.data
      );
      throw new Error(error.response.data?.message || "Unauthorized");
    }
  }
}

export const getAllProductById = async () => {
  const token = localStorage.getItem("token");
  try {
    const response = await axios.get(
      "http://localhost:8080/api/farmer/getByFarmerId",
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    console.log("cors header", response);
    return response.data;
  } catch (error) {
    if (error.response) {
      console.error(
        "Server responded with:",
        error.response.status,
        error.response.data
      );
      throw new Error(error.response.data?.message || "Unauthorized");
    }
  }
};

export const CheckEmail = async ({email})=>{
  const response = await axios.post(`http://localhost:8080/api/checkEmail`, {email});
  console.log(response)
  return response;
}

export const CheckOtp = async ({ email, otp }) => {
  const response = await axios.post("http://localhost:8080/api/checkOTP", {
    email,
    otp
  });
  return response.data;
};

export const UpdatePassword = async ({ email, password }) => {
  const response = await axios.post(
    `http://localhost:8080/api/updatePassword`,
    {
      email, password
    }
  );
  console.log(response);
  return response;
};

export const getUserDetailsById = async (id)=>{
  const response = await axios.post(
    `http://localhost:8080/api/user/getUserDetailsById/${id}`
  );
  return response.data;
}