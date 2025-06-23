import { useParams } from "react-router-dom";
import { getDetailsByUserId, getProductById } from "../../../services/farmer/farmerApiService";
import Footer from "./Footer";
import Header from "./Header";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

const ShopDetail = () => {
    const navigate = useNavigate();

   const { productId } = useParams();
   const scrollRef = useRef(null);
   const [product, setProduct] = useState(null);
   const [farmer, setFarmer] = useState(null);
   const [selectedImage, setSelectedImage] = useState("");
   const [loading, setLoading] = useState(true);
   const [error, setError] = useState(null);

   useEffect(() => {
     const fetchProductAndFarmer = async () => {
       try {
         setLoading(true);
         // Fetch product details
         const productData = await getProductById(productId);
         setProduct(productData);
         setSelectedImage(
           productData.imagePaths[0] || "/assets/BuyersImg/Products/Onion.png"
         );

         // Fetch farmer details
         const farmerData = await getDetailsByUserId(productData.user.id);
         console.log(farmerData);
         setFarmer(farmerData);
       } catch (err) {
         console.error("Error fetching product or farmer details:", err);
         setError("Failed to load product details.");
       } finally {
         setLoading(false);
       }
     };

     fetchProductAndFarmer();
   }, [productId]);

  const scroll = (direction) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({
        left: direction === "left" ? -200 : 200,
        behavior: "smooth",
      });
    }
  };

  if (loading) {
    return <div className="text-center p-4">Loading...</div>;
  }

  if (error || !product) {
    return (
      <div className="text-center p-4 text-red-500">
        {error || "Product not found."}
      </div>
    );
  }

  const handleBuynowClick = () => {
    navigate("/buynow");
  };

  const handleAddCartClick = () => {
    // Get existing count or default to 0
    const count = parseInt(localStorage.getItem("cartCount") || "0");
    // Increment and update
    localStorage.setItem("cartCount", count + 1);

    alert("Product added to cart!");
    navigate("/addcart");
  };



  return (
    <>
      <Header />
      {/* Detail part */}
      <div className="flex flex-col md:flex-row justify-center gap-4 mt-8 px-4 md:px-0">
        <div className="w-96 h-105 md:w-80 h-auto md:h-140 object-contain">
          <img
            src={selectedImage}
            alt={product.name}
            className="object-contain"
          />
        </div>
        <div className="w-full md:w-auto">
          <div className="flex flex-col sm:flex-row gap-2">
            <h4>{product.name}</h4>
            <p className="mt-1 text-sm sm:text-base">
              (Minimum {product.minimumOrderQuantity || "N/A"}{" "}
              {product.unitOfMeasurement || "unit"})
            </p>
          </div>
          <div className="flex text-green-500 gap-2">
            <h5>Rs. {product.price || "00.00"}</h5>
            <p className="text-sm mt-1">
              Per {product.unitOfMeasurement || "unit"}
            </p>
          </div>

          <hr className="mt-1" />
          <p className="w-full md:w-96 text-sm md:text-base">
            {product.description || "No description available."}
          </p>
          <div className="flex flex-col sm:flex-row gap-2 mt-4">
            <h4 className="text-base font-semibold">Choose Quantity</h4>
            <input
              type="number"
              placeholder={` /${product.unitOfMeasurement || "unit"}`}
              className="w-full sm:w-20 border-2 border-solid border-black px-2 py-1"
              min={product.minimumOrderQuantity || 1}
            />
          </div>
          <div className="flex flex-col sm:flex-row gap-3 mt-4">
            <button
              onClick={handleAddCartClick}
              className="bg-green-600 text-white font-semibold px-6 py-2 rounded shadow-md transition-all duration-300 w-full sm:w-auto"
            >
              Add to cart
            </button>
            <button
              onClick={handleBuynowClick}
              className="bg-[#EEC044] text-white font-semibold px-6 py-2 rounded shadow-md transition-all duration-300 w-full sm:w-auto"
            >
              Add to wishlist
            </button>
          </div>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 mt-3">
            <h5>Chat With the Farmer</h5>
            <button className="bg-green-500 rounded text-white p-1">
              Message
            </button>
          </div>
          <div className="relative flex items-center w-full max-w-md mx-auto mt-4">
            <button
              onClick={() => scroll("left")}
              className="absolute left-0 z-10 bg-transparent text-gray-600 text-xl p-2"
            >
              ❮
            </button>
            <div
              ref={scrollRef}
              className="flex space-x-4 overflow-x-auto scroll-smooth px-8 no-scrollbar"
            >
              {product.imagePaths.map((src, index) => (
                <div
                  key={index}
                  className="w-[80px] h-[80px] bg-gray-200 rounded-lg flex-shrink-0 flex items-center justify-center overflow-hidden cursor-pointer"
                  onClick={() => setSelectedImage(src)}
                >
                  <img
                    src={src}
                    alt={`Image ${index + 1}`}
                    className="w-[80px] h-[100px] object-contain"
                  />
                </div>
              ))}
            </div>
            <button
              onClick={() => scroll("right")}
              className="absolute right-0 z-10 bg-transparent text-gray-600 text-xl p-2"
            >
              ❯
            </button>
          </div>
        </div>
      </div>

      {/* About us part */}
      <div className="flex flex-col md:flex-row md:flex-wrap justify-center gap-4 text-white my-8">
        <div className="bg-green-600 rounded w-64 p-4">
          <h4>About</h4>
          <p>
            {farmer?.description ||
              "Lorem ipsum is simply free text used by copytyping refreshing."}
          </p>
        </div>
        <div className="bg-[#C5CE38] rounded w-64 p-4">
          <h4>Contact</h4>
          <p>
            {farmer?.contact ||
              "+1- (246) 333-0079 support@agrios.com Mon - Fri: 7:00 am - 6:00 pm"}
          </p>
        </div>
        <div className="bg-[#EEC044] rounded w-64 p-4">
          <h4>Address</h4>
          <p>
            {farmer?.location ||
              "66 Broklun Road Golden Street, New York, United States of America"}
          </p>
        </div>
      </div>

      {/* Google Map */}
      <div className="flex justify-center">
        <iframe
          title={`${farmer?.farmName || "Farm"} Location`}
          src={
            farmer?.mapUrl ||
            "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3533.522068845213!2d85.31823907471563!3d27.670254826203855!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39eb19ce1dace9ed%3A0xfb9c8b305818fb7d!2sKumaripati%2C%20Lalitpur!5e0!3m2!1sen!2snp!4v1747846965367!5m2!1sen!2snp"
          }
          width="820"
          height="450"
          style={{ border: 0 }}
          allowFullScreen=""
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        ></iframe>
      </div>

      {/* Farmer Detail */}
      <div className="flex flex-col items-center justify-center my-8">
        <div className="w-full max-w-4xl">
          <h3 className="text-xl font-semibold mb-4 text-left ml-6">
            Farmer Details
          </h3>
          <div className="flex items-start gap-6 bg-white p-6 rounded-lg">
            <img
              src={
                farmer?.image ||
                "https://t4.ftcdn.net/jpg/02/23/50/73/360_F_223507349_F5RFU3kL6eMt5LijOaMbWLeHUTv165CB.jpg"
              }
              alt={farmer?.farmName || "Farmer"}
              className="w-48 h-48 rounded object-cover"
            />
            <div className="max-w-xl">
              <h5 className="text-lg font-semibold">
                {farmer?.farmName || "Unknown Farmer"}
              </h5>
              <p className="text-green-500 mb-2">
                {farmer?.dateOfBirth || "N/A"}
              </p>
              <p className="text-gray-700">
                {farmer?.description || "No description available."}
              </p>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default ShopDetail;
