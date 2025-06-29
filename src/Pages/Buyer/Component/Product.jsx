import { Link } from "react-router-dom";
import { RightOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import { getDetailsByUserId, getProductByfarmer } from "../../../services/farmer/farmerApiService";
import { getAllProduct } from "../../../services/authService";

const Product = () => {
  const [products, setProduct] = useState([]);
  const [farmerDetails, setFarmerDetails] = useState({});

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const productResponse = await getAllProduct();
        console.log("the reposnse of product..", productResponse);
        setProduct(productResponse);
        // Fetch farmer details for each unique user ID
        const uniqueUserIds = [
          ...new Set(productResponse.map((product) => product.user.id)),
        ];
        const farmerPromises = uniqueUserIds.map((userId) =>
          getDetailsByUserId(userId)
        );
        const farmerResponses = await Promise.all(farmerPromises);
        console.log("the farmer details is ", farmerResponses);

        // Create a map of userId -> farmer details
        const farmerMap = farmerResponses.reduce((acc, farmer) => {
          acc[farmer.id] = farmer;
          return acc;
        }, {});
        setFarmerDetails(farmerMap);
      } catch (error) {
        console.log("Error fetching products:", error);
      }
    };

    fetchProduct();
  }, []);

  return (
    <>
      <div>
        <div className="text-center p-4">
          <p className="text-[#EEC044]">Recently Added</p>
          <h2 className="font-bold">Products</h2>
        </div>

        <div className="flex justify-around items-center flex-wrap mb-4 px-4">
          <h2>Listings</h2>
          <Link to="buyer-shop" className="m-2 text-black">
            View All <RightOutlined />
          </Link>
        </div>

{/* <div className="flex justify-center items-center min-h-screen">
          <div className="w-full md:w-3/4 bg-white rounded-lg "> */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:px-60">
          {products && Array.isArray(products) ? (
           products.map((product) => (
            <Link
              key={product.id}
              to={`/shopdetail/${product.id}`}
              className="rounded text-black no-underline transition-shadow duration-300 hover:shadow-md"
            >
              <div className="text-center rounded">
                <img
                  src={
                    product.imagePaths[0] || "/assets/BuyersImg/Products/Onion.png"
                  } // Fallback image if product.image doesn't exist
                  alt={product.name}
                  className="w-full h-[200px] object-cover mx-auto rounded"
                />
                <div className="flex justify-between">
                  <div className="p-2">
                    <h5>{product.name}</h5>
                    <p className="text-green-500 text-lg">
                      Rs {product.price || "00.00"}
                    </p>
                  </div>
                  <div className="text-right p-2">
                    <p className="mt-1 ">
                      {farmerDetails[product.user.id]?.farmName || "Farm Name"}
                    </p>
                    <div className="flex gap-1">
                      <p className="text-[10px]">
                        {farmerDetails[product.user.id]?.district || "Location"}
                      </p>
                      <p className="text-[10px]">
                        {(farmerDetails[product.user.id]?.district &&
                          farmerDetails[product.user.id]?.municipality) ||
                          "Location"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
           ))
        ) : (
          <div>No products available</div> // Fallback UI
        )}
        </div>
      </div>
      {/* </div> */}
      {/* </div> */}
    </>
  );
};

export default Product;
