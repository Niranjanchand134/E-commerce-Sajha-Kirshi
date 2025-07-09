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
        <div className="text-center p-2">
          <p className="text-[#EEC044]">Recently Added</p>
          <h2 className="font-bold">Products</h2>
        </div>

        <div className="flex justify-around items-center flex-wrap mb-4 px-4">
          <h2>Listings</h2>
          <Link to="buyer-shop" className="m-2 text-black">
            View All <RightOutlined />
          </Link>
        </div>

        <div className="w-full mb-12">
          <div className="max-w-6xl mx-auto px-8 lg:px-32">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 justify-items-center">
              {products && Array.isArray(products) ? (
                products.map((product) => (
                  <Link
                    key={product.id}
                    to={`/shopdetail/${product.id}`}
                    className="w-full max-w-[320px] bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-lg transition duration-300 group no-underline"
                  >
                    {/* Image Section */}
                    <div className="w-full h-48 bg-white flex items-center justify-center p-2">
                      <img
                        src={product.imagePaths[0] || "/assets/BuyersImg/Products/Onion.png"}
                        alt={product.name}
                        className="max-h-full object-contain group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>

                    {/* Product Info */}
                    <div className="p-3 space-y-1">
                      <h3 className="text-sm font-semibold text-gray-800 leading-tight line-clamp-2">
                        {product.name}
                      </h3>
                      <p className="text-red-500 font-bold text-sm">Rs {product.price || "00.00"}</p>
                      <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
                        <span>{farmerDetails[product.user.id]?.farmName || "Farm Name"}</span>
                        <span className="text-right">
                          {(farmerDetails[product.user.id]?.district || "District")},{" "}
                          {(farmerDetails[product.user.id]?.municipality || "Municipality")}
                        </span>
                      </div>
                    </div>
                  </Link>
                ))
              ) : (
                <div className="col-span-full text-center text-gray-600">No products available</div>
              )}
            </div>
          </div>
        </div>

      </div>
    </>
  );
};

export default Product;
