
import axios from "axios";

export const loginDetails = async (email, password) =>{
    const response = await axios.post("http://localhost:8080/userLogin", {email, password});

    console.log(response);

    return response.data;
}

export const greeting = async () => {
  const response = await axios.get("http://localhost:8080/");

  console.log(response);

  return response.data;
};
