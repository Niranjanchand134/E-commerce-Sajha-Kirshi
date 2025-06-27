import { useNavigate } from "react-router-dom";
import { FaLaptop, FaUserEdit, FaCheckCircle, FaUsers, FaUserCircle, FaMapMarkerAlt, FaIdCard,
  FaImage, FaAddressCard, } from "react-icons/fa";
import { useEffect, useState } from "react";
import { getDetailsByUserId } from "../../../services/farmer/farmerApiService";
import { useAuth } from "../../../Context/AuthContext";
import FarmerKYCDetail from "./FarmerKYCDetails";


const infoItems = [
  {
    icon: <FaUsers className="text-3xl text-green-700" />,
    title: "Family information",
    description: "Father, mother, grandfather & spouse name",
  },
  {
    icon: <FaUserCircle className="text-3xl text-green-700" />,
    title: "Personal information",
    description: "D.O.B, Gender, Occupation",
  },
  {
    icon: <FaMapMarkerAlt className="text-3xl text-green-700" />,
    title: "Address information",
    description: "Zone, Municipality, District, Ward",
  },
  {
    icon: <FaIdCard className="text-3xl text-green-700" />,
    title: "Identity information",
    description: "Identity number, Issued place, Issued date",
  },
  {
    icon: <FaImage className="text-3xl text-green-700" />,
    title: "Profile picture",
    description: "Picture showing the face of the customer",
  },
  {
    icon: <FaAddressCard className="text-3xl text-green-700" />,
    title: "Identity picture",
    description: "Front & Back side (Clear photograph)",
  },
];

    const FarmerKYChome = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [kycData, setKycData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [kycStatus, setKycStatus] = useState("checking"); // 'checking', 'not-submitted', 'submitted'

    useEffect(() => {
      const checkKYCStatus = async () => {
        try {
          const result = await getDetailsByUserId(user.id);
          console.log(result);

          if (result.status === 404) {
            setKycStatus("not-submitted");
          } else {
            setKycData(result); // Now result is the actual data
            setKycStatus("submitted");
          }
        } catch (error) {
          console.error("Error checking KYC status:", error);
          setKycStatus("error");
        } finally {
          setLoading(false);
        }
      };

      checkKYCStatus();
    }, [user.id]);

    const handleClick = () => {
        navigate("/Farmerlayout/FarmerKYCForm");
    };

    if (loading) {
        return (
        <div className="flex justify-center items-center h-screen">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
        </div>
        );
    }

    if (kycStatus === "submitted" && kycData) {

        console.log(".,,,,,,,,,,")
        return <FarmerKYCDetail farmerData={kycData} />;
    }

  return (
    <>
      <div className="bg-[#4BAF47] h-64 flex justify-center">
        <div className="p-8 text-white w-full max-w-2xl space-y-4">
          <h1 className="font-semibold leading-snug">
            Complete your KYC now & Get extra benefits
          </h1>
          <button
            onClick={handleClick}
            className="bg-[#EFBE44] p-2 w-32 rounded-full"
          >
            Fill KYC
          </button>
        </div>
        <div className="w-80 h-80 mt-8">
          <img src="./assets/BuyersImg/KYCimg/kyc1.png" alt="kyc image" />
        </div>
      </div>
      <div className="flex justify-center p-8">
        <p className="text-center max-w-3xl">
          To enjoy more of the wide range of services from Sajha Sewa, it is
          mandatory for all the customers to fill the KYC (Know Your Customer)
          form to Buy and Sell Vegetables
        </p>
      </div>

      <div className="flex flex-col items-center justify-center px-4 py-8">
        <div className="flex flex-col sm:flex-row justify-center gap-12 text-center">
          <div className="flex flex-col items-center">
            <div className="bg-green-100 p-6 rounded-full mb-4">
              <FaLaptop className="text-green-700 text-4xl" />
            </div>
            <h3 className="text-xl font-semibold">Step 1</h3>
            <p className="text-gray-600 mt-2">Log in to your Khalti account</p>
          </div>

          <div className="flex flex-col items-center">
            <div className="bg-green-100 p-6 rounded-full mb-4">
              <FaUserEdit className="text-green-700 text-4xl" />
            </div>
            <h3 className="text-xl font-semibold">Step 2</h3>
            <p className="text-gray-600 mt-2">
              Go to ‘Profile’ option & ‘Edit’.
            </p>
          </div>

          <div className="flex flex-col items-center">
            <div className="bg-green-100 p-6 rounded-full mb-4">
              <FaCheckCircle className="text-green-700 text-4xl" />
            </div>
            <h3 className="text-xl font-semibold">Step 3</h3>
            <p className="text-gray-600 mt-2">
              Fill the form, Get verified to enjoy.
            </p>
          </div>
        </div>

        <p className="mt-8 text-sm italic text-gray-500">
          Note: KYC Verification may take upto 48 hours.
        </p>
      </div>
      <div className="flex flex-col items-center justify-center px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {infoItems.map((item, index) => (
            <div
              key={index}
              className="flex items-start space-x-4 rounded-lg p-2"
            >
              <div className="flex-shrink-0 p-3 bg-green-100 rounded-full">
                {item.icon}
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {item.title}
                </h3>
                <p className="text-sm text-gray-700">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="bg-[#4BAF47] h-48 flex justify-center">
        <div className="p-8 text-white w-full max-w-3xl space-y-4">
          <h1 className="font-semibold leading-snug">
            Just a form away from all the exclusive Sajha Krishi services.
          </h1>
        </div>
        <div className=" flex items-center text-white text-2xl font-bold">
          <button
            onClick={handleClick}
            className="bg-[#EFBE44] p-2 w-48 rounded-full"
          >
            Fill KYC
          </button>
        </div>
      </div>
      <div className="text-center p-8">
        <h1 className="text-green-500 p-2">Have doubts? Worry not!</h1>
        <button
          onClick={handleClick}
          className="bg-[#EFBE44] p-2 w-48 rounded-full text-white text-2xl font-bold"
        >
          Contact Us
        </button>
      </div>
    </>
  );
};

export default FarmerKYChome;