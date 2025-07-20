

import { Client } from "@stomp/stompjs";
import axios from "axios";
import SockJS from "sockjs-client";

export const BuyerKycForm = async (form)=>{

    try{

        const response = await axios.post("http://localhost:8080/buyerKyc", form);

    return response.data;
    }
    catch(error){
        if (error.response) {
          console.error(
            "failed to save the kyc",
            error.response.status,
            error.response.data
          );
          throw new Error(
            error.response.data?.message || "Failed to save the kyc"
          );
        } else {
          throw new Error("Request failed. Please try again later.");
        }
    }

    
}

export const createChatRoom = async (data)=>{
  try{
  const response = await axios.post("http://localhost:8080/api/rooms/createRoom",data);
 return response.data; // Returns chat room data or ID
  } catch (error) {
    console.error('Error creating chat room:', error);
    throw {
      status: error.response?.status,
      message: error.response?.data || 'Failed to create chat room',
    };
  }
};


export const getKycByUserId = async (userId) => {
  try {
    const response = await axios.get(
      `http://localhost:8080/api/getkycById/${userId}`
    );
    return response.data; // Returns the BuyerKycDTO
  } catch (error) {
    console.error("Error fetching KYC details:", error);
    // Throw error with status and message
    throw {
      status: error.response?.status,
      message: error.response?.data || "Failed to fetch KYC details",
    };
  }
};
