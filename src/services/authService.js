
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
