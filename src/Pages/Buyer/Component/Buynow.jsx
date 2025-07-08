import { useLocation } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import { useNavigate } from "react-router-dom";

const Buynow = () => {
  const { state } = useLocation();
  const { product, farmer, UserData, quantity } = state || {};
  const navigate = useNavigate();

  // Fallback data
  const defaultProduct = {
    name: "Mustang ko Apple",
    price: 999,
    imagePaths: [
      "https://www.collinsdictionary.com/images/full/apple_158989157.jpg",
    ],
  };
  const defaultFarmer = {
    farmName: "Pratik Farm",
    district: "Lalitpur",
    municipality: "Godawari",
    wardNumber: "5",
    tole: "Gotpdawari-5",
  };
  const defaultUser = {
    name: "Yukesh Shrestha",
    number: "+977-1234567890",
  };

  const getFormattedAddress = (farmer) => {
    if (!farmer) {
      return "Shadobato, Road, Lalitpur, Near Shadobato Chok way to Lagankhel";
    }
    const { district, municipality, wardNumber, tole } = farmer;
    return [tole, wardNumber && `Ward - ${wardNumber}`, municipality, district]
      .filter(Boolean)
      .join(", ");
  };

  const handleProceedClick = () => {
    navigate("/Payment");
  };

  const productData = product || defaultProduct;
  const farmerData = farmer || defaultFarmer;
  const userData = UserData || defaultUser;
  const qty = quantity || 1;

  // Calculate totals
  const itemTotal = productData.price * qty;
  const deliveryFee = 135;
  const total = itemTotal + deliveryFee;

  return (
    <>
      <Header />
      <div className="min-h-screen py-8">
      <div className="container flex gap-4 px-4">
        {/* Product List */}
        <div className="lg:w-2/3 bg-white p-4">
          <div className="flex justify-between items-center gap-4 bg-[#FAFAFA] p-2 mb-2">
            <h5 className="font-semibold">Mustang ko Apple</h5>
            <a href="#" className="no-underline text-black text-sm">EDIT</a>
          </div>

          <div className="mb-4">
            <p className="font-medium">{userData.name}</p>
            <p>{getFormattedAddress(farmerData)} <br />Near Shadobato Chok way to Lagankhel</p>
          </div>

          <div className="bg-[#F4F4F4] p-1" />

          <h5 className="bg-[#FAFAFA] p-2 font-semibold">Package 1 out of 1</h5>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-4">
            <div className="flex gap-4">
              <div className="w-[50vh] rounded-lg overflow-hidden">
                <img
                  src={productData.imagePaths[0]}
                  alt={productData.name}
                  className="w-32 h-32 object-fit"
                />
              </div>
              <div>
                <h5 className="font-semibold w-48">{productData.name}</h5>
                <p>{farmerData.farmName}</p>
                <p>{getFormattedAddress(farmerData)}</p>
              </div>
            </div>

            <div className="flex justify-between">
              <h5 className="text-green-500 font-semibold ml-2">Rs. {itemTotal}</h5>
              <p>Qty: {qty}</p>
            </div>
          </div>
        </div>

        {/* Proceed to Pay */}
        <div className="lg:w-1/3 bg-white p-4 rounded">
          <div className="flex justify-between bg-[#FAFAFA] p-2 ">
            <h5 className="font-semibold mr-4">Mustang ko Apple</h5>
            <a href="#" className="no-underline text-black text-sm">EDIT</a>
          </div>

          <h5 className="font-semibold ">Order Summary</h5>

          <div className="flex justify-between ">
            <p>Items Total <span className="text-gray-500">({qty} item{qty > 1 ? "s" : ""})</span></p>
            <h5>Rs. {itemTotal}</h5>
          </div>

          <div className="flex justify-between">
            <p>Delivery Fee</p>
            <h5>Rs. {deliveryFee}</h5>
          </div>

          <hr className="my-2" />

          <div className="flex justify-between">
            <div>
                <p className="font-semibold">Total:</p>
                <p className="text-sm text-gray-500">All Taxes included</p>
            </div>
            <h5 className="text-red-500 text-lg font-bold ">Rs. {total}</h5>
          </div>

          <div>
            <button onClick={handleProceedClick} className="bg-green-600 p-2 font-semibold text-white w-full rounded hover:bg-green-700 transition">
              Proceed to Pay
            </button>
          </div>
        </div>
      </div>
      </div>
      <Footer />
    </>
  );
};

export default Buynow;
