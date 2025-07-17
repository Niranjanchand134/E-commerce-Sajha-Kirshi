

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
  const response = await axios.post("http://localhost:8080/api/rooms/createRoom",data);
  return response.data;
}

