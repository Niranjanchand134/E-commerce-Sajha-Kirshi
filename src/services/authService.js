
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

export const addProduct = async (data) =>{
  const token = localStorage.getItem("token"); // or use authToken if passed
  console.log("token",token)
  try {
    const response = await axios.post(
      "http://localhost:8080/api/products/add",
      data
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
