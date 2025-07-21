import React, { useEffect, useState } from "react";
import Footer from "./Footer";
import Header from "./Header";
import { Pagination } from "antd";
import { NavLink, useLocation } from "react-router-dom";
import { getAllProduct } from "../../../services/authService";
import { getDetailsByUserId } from "../../../services/farmer/farmerApiService";

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
            <div className="w-full md:w-3/4 bg-white rounded-lg">
              <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
                {currentProducts.length > 0 ? (
                  currentProducts.map((product) => (
                    <NavLink
                      key={product.id}
                      to={`/shopdetail/${product.id}`}
                      className="rounded text-black no-underline transition-shadow duration-300 hover:shadow-md"
                    >
                      <img
                        src={
                          product.imagePaths[0] ||
                          "/assets/BuyersImg/Products/Onion.png"
                        }
                        alt={product.name}
                      />
                      <div className="flex justify-between">
                        <div className="p-2">
                          <h5>{product.name}</h5>
                          <p className="text-green-500 text-lg">
                            Rs {product.price || "00.00"}
                          </p>
                        </div>
                        <div className="text-right p-2">
                          <p>
                            {farmerDetails[product.user.id]?.farmName ||
                              "Farm Name"}
                          </p>
                          <div className="flex gap-1">
                            <p className="text-[10px]">
                              {farmerDetails[product.user.id]?.district ||
                                "Location"}
                            </p>
                            <p className="text-[10px]">
                              {(farmerDetails[product.user.id]?.district &&
                                farmerDetails[product.user.id]?.municipality) ||
                                "Location"}
                            </p>
                          </div>
                        </div>
                      </div>
                    </NavLink>
                  ))
                ) : (
                  <div className="col-span-full text-center py-8">
                    <p>No products available</p>
                  </div>
                )}
              </div>

              {/* Pagination */}
              <div className="flex justify-center mt-6">
                <Pagination
                  current={currentPage}
                  onChange={handlePageChange}
                  total={filteredProducts.length}
                  pageSize={productsPerPage}
                  className="custom-pagination"
                />
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
