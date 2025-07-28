import React, { useEffect, useState } from "react";
import Footer from "./Footer";
import Header from "./Header";
import { Pagination } from "antd";
import { Link, NavLink, useLocation } from "react-router-dom";
import { getAllProduct } from "../../../services/authService";
import { getDetailsByUserId } from "../../../services/farmer/farmerApiService";
import { UserOutlined } from "@ant-design/icons";

const Shop = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const urlCategory = queryParams.get("category") || "All";

  const [locationFilter, setLocationFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [openIndex, setOpenIndex] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [products, setProduct] = useState([]);
  const [farmerDetails, setFarmerDetails] = useState({});

  const handleLocationChanges = (e) => setLocationFilter(e.target.value);
  const handleStatusChanges = (e) => setStatusFilter(e.target.value);
  const toggleCategory = (index) =>
    setOpenIndex(openIndex === index ? null : index);

  const productsPerPage = 9;

  // Filter and sort products based on search term, location, URL category, and sorting
  const filteredProducts = products
    .filter((product) => {
      const matchesSearch = product.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

      // Location filter (based on farmer's district)
      const matchesLocation =
        locationFilter === "All" ||
        locationFilter === "Location" ||
        farmerDetails[product.user.id]?.district
          ?.toLowerCase()
          .includes(locationFilter.toLowerCase());

      // URL category filter (based on product name)
      const matchesCategory =
        urlCategory === "All" ||
        product.name.toLowerCase().includes(urlCategory.toLowerCase());

      return matchesSearch && matchesLocation && matchesCategory;
    })
    .sort((a, b) => {
      if (statusFilter === "lower-higher") {
        return a.price - b.price;
      } else if (statusFilter === "higher-lower") {
        return b.price - a.price;
      }
      return 0; // Default sorting (no change)
    });

  const indexOfLast = currentPage * productsPerPage;
  const indexOfFirst = indexOfLast - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirst, indexOfLast);

  const handlePageChange = (page) => setCurrentPage(page);

  const categories = [
    { title: "Agriculture", subItems: ["Crops", "Tools", "Irrigation"] },
    { title: "Farming", subItems: ["Animal Husbandry", "Aquaculture"] },
    {
      title: "Fresh Vegetables",
      subItems: ["Leafy Greens", "Root Vegetables"],
    },
    { title: "Harvest", subItems: ["Seasonal", "Storage"] },
    { title: "Organic Food", subItems: ["Certified", "Non-GMO"] },
  ];

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const productResponse = await getAllProduct();
        console.log("the response of product..", productResponse);
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
      <Header />
      <div>
        <div className="text-center p-4">
          <h2 className="font-bold">Explore Different Products</h2>
          <p>Discover Fresh and Healthy products directly from the farmers.</p>
        </div>

        {/* Filters */}
        <div className="w-full px-4 mb-6">
          <div className="flex flex-col sm:flex-row flex-wrap justify-center items-center gap-4">
            <div className="relative w-full sm:w-auto">
              <select
                className="appearance-none w-full max-w-full sm:w-48 border border-gray-300 rounded-xl bg-green-500 text-white px-4 py-2 pr-8 focus:outline-none"
                value={locationFilter}
                onChange={handleLocationChanges}
              >
                <option value="All">Location</option>
                <option value="Kathmandu">Kathmandu</option>
                <option value="Pokhara">Pokhara</option>
                <option value="Lalitpur">Lalitpur</option>
                <option value="Bhaktapur">Bhaktapur</option>
                <option value="Chitwan">Chitwan</option>
              </select>
              <div className="pointer-events-none absolute right-3 top-1/2 transform -translate-y-1/2 text-white text-xs">
                ▼
              </div>
            </div>

            <div className="w-full sm:w-auto">
              <input
                type="text"
                placeholder="Search product name..."
                className="w-full max-w-full sm:w-[32rem] border border-gray-300 rounded-xl px-4 py-2 focus:outline-none"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="relative w-full sm:w-auto">
              <select
                className="appearance-none w-full max-w-full sm:w-48 border border-gray-300 rounded-xl px-4 py-2 pr-8 focus:outline-none"
                value={statusFilter}
                onChange={handleStatusChanges}
              >
                <option value="All">Default sorting</option>
                <option value="lower-higher">Lower-Higher</option>
                <option value="higher-lower">Higher-Lower</option>
              </select>
              <div className="pointer-events-none absolute right-3 top-1/2 transform -translate-y-1/2 text-black text-xs">
                ▼
              </div>
            </div>
          </div>
        </div>

        {/* Content Layout */}
        <div className="p-4 max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-start justify-content-center gap-6">
            {/* Sidebar Categories */}
            {/* <aside className="w-full md:w-1/4 bg-white border rounded-lg p-4">
              <h2 className="text-lg font-semibold mb-4">Categories</h2>
              <ul className="space-y-2">
                {categories.map((cat, index) => (
                  <li key={index}>
                    <button
                      onClick={() => toggleCategory(index)}
                      className="flex items-center justify-between w-full text-left text-gray-700 font-medium hover:text-green-600"
                    >
                      {cat.title}
                      <span
                        className={`transform transition-transform ${
                          openIndex === index ? "rotate-90" : ""
                        }`}
                      >
                        ›
                      </span>
                    </button>
                    {openIndex === index && (
                      <ul className="mt-2 text-sm text-gray-500 space-y-2 text-[16px]">
                        {cat.subItems.map((item, i) => (
                          <li
                            key={i}
                            className="hover:text-green-600 cursor-pointer"
                          >
                            {item}
                          </li>
                        ))}
                      </ul>
                    )}
                  </li>
                ))}
              </ul>
            </aside> */}

            {/* Product Grid */}
            <div className="w-full mb-12">
              <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-3">
                  {currentProducts && Array.isArray(currentProducts) ? (
                    currentProducts.map((product) => (
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
                                {product.discountPrice}% OFF
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
                            {product.discountPrice ? (
                              <>
                                <span className="text-red-600 font-medium">
                                  Rs{" "}
                                  {(
                                    product.price -
                                    (product.price * product.discountPrice) /
                                      100
                                  ).toFixed(2)}
                                </span>
                                <span className="text-gray-500 line-through ml-2">
                                  Rs {product.price}
                                </span>
                              </>
                            ) : (
                              <span className="text-gray-900 font-medium">
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
                                {new Date(
                                  product.expiryDate
                                ).toLocaleDateString("en-US", {
                                  month: "short",
                                  day: "numeric",
                                })}
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
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Shop;
