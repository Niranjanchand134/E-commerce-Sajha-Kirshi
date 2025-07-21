import { Link } from "react-router-dom";
import { CalendarOutlined, ClockCircleOutlined, RightOutlined, ShoppingOutlined, UserOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import { getDetailsByUserId, getProductByfarmer } from "../../../services/farmer/farmerApiService";
import { getAllProduct } from "../../../services/authService";
import { Avatar } from "antd";

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

        <div className="flex justify-around items-center flex-wrap mb-4 ">
          <h2>Listings</h2>
          <Link to="buyer-shop" className="m-2 text-black">
            View All <RightOutlined />
          </Link>
        </div>

        <div className="w-full mb-12 ">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-3">
              {products && Array.isArray(products) ? (
                products.map((product) => (
                  <Link
                    key={product.id}
                    to={`/shopdetail/${product.id}`}
                    className="w-full bg-white rounded-lg border border-gray-200 hover:border-gray-300 shadow-xs hover:shadow-sm transition-all duration-200 no-underline"
                  >
                    {/* Image Section - More compact */}
                    <div className="relative w-full aspect-[4/3] bg-gray-50 flex items-center justify-center p-2">
                      <img
                        src={
                          product.imagePaths[0] ||
                          "/assets/placeholder-product.png"
                        }
                        alt={product.name}
                        className="h-full object-contain"
                      />

                      {/* Top badges */}
                      <div className="absolute top-2 left-2 right-2 flex justify-between">
                        <span
                          className={`text-xs px-2 py-1 rounded-full ${
                            product.status === "Active"
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {product.status === "Active"
                            ? "Available"
                            : "Unavailable"}
                        </span>

                        {product.discountPrice && (
                          <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                            {Math.round(
                              ((product.price - product.discountPrice) /
                                product.price) *
                                100
                            )}
                            % OFF
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Product Info - More compact */}
                    <div className="p-3 space-y-1.5">
                      <div className="flex justify-between items-start">
                        <h3 className="text-sm font-medium text-gray-900 line-clamp-2">
                          {product.name}
                        </h3>
                        <span className="text-xs text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded">
                          {product.category}
                        </span>
                      </div>

                      {/* Pricing - Compact */}
                      <div className="flex items-center gap-1.5">
                        <span
                          className={`font-medium ${
                            product.discountPrice
                              ? "text-red-600"
                              : "text-gray-900"
                          }`}
                        >
                          Rs {product.discountPrice || product.price}
                        </span>
                        {product.discountPrice && (
                          <span className="text-xs text-gray-400 line-through">
                            Rs {product.price}
                          </span>
                        )}
                      </div>

                      {/* Quantity & Min Order - Single line */}
                      <div className="text-xs text-gray-600">
                        {product.quantity} {product.unitOfMeasurement} • Min{" "}
                        {product.minimumOrderQuantity}
                      </div>

                      {/* Dates - Compact */}
                      <div className="flex items-center text-xs text-gray-500 gap-1.5">
                        <span title="Harvest date">
                          🗓️{" "}
                          {new Date(product.harvestDate).toLocaleDateString(
                            "en-US",
                            { month: "short", day: "numeric" }
                          )}
                        </span>
                        {product.expiryDate && (
                          <span title="Expiry date">
                            ⏳{" "}
                            {new Date(product.expiryDate).toLocaleDateString(
                              "en-US",
                              { month: "short", day: "numeric" }
                            )}
                          </span>
                        )}
                      </div>

                      {/* Farmer Info - Compact */}
                      <div className="flex items-center gap-1.5 pt-1 text-xs">
                        <div className="w-5 h-5 mb-3 bg-gray-200 rounded-full flex items-center justify-center">
                          <UserOutlined style={{ fontSize: 10 }} />
                        </div>
                        <div className="truncate">
                          <p className="font-medium m-0 text-gray-700 truncate">
                            {farmerDetails[product.user.id]?.farmName ||
                              "Local Farm"}
                          </p>
                          <p className="text m-0-gray-500 truncate">
                            {farmerDetails[product.user.id]?.municipality ||
                              "Location"}
                          </p>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))
              ) : (
                <div className="col-span-full text-center text-gray-600 py-10">
                  <ShoppingOutlined className="text-4xl mb-2 text-gray-300" />
                  <p>No products available</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      
    </>
  );
};

export default Product;
