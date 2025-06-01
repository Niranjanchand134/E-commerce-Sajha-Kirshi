import { useNavigate } from "react-router-dom";
import FarmerHomePage from "../FarmerHomePage";
import { useEffect } from "react";

const FarmerLayout = () => {

    const navigate = useNavigate();

    // useEffect(() => {
    //   const token = localStorage.getItem("token");
    //   try {
    //     const decoded = jwtDecode(token);
    //     const role = decoded.role;

    //     if (
    //       role === "farmer" &&
    //       window.location.pathname !== "/Farmerlayout/Farmerdashboard"
    //     ) {
    //       navigate("/Farmerlayout/Farmerdashboard");
    //     } else if (role !== "farmer") {
    //       navigate("/");
    //     }
    //   } catch (err) {
    //     navigate("/");
    //   }
    // }, []);
      
    return(
        <>
        <FarmerHomePage/>
        </>
    )
}

export default FarmerLayout;