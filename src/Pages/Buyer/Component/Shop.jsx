import React, { useState } from 'react';
import Footer from "./Footer";
import Header from "./Header";
import { Pagination } from 'antd';
import { NavLink } from 'react-router-dom';

const Shop = () => {
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [openIndex, setOpenIndex] = useState(null);
  const [currentPage, setCurrentPage] = useState(1); // ✅ Current page state

  const handleCategoryChanges = (e) => setCategoryFilter(e.target.value);
  const handleStatusChanges = (e) => setStatusFilter(e.target.value);
  const toggleCategory = (index) => setOpenIndex(openIndex === index ? null : index);

  const productsPerPage = 9; // ✅ Display 4 products per page

  // ✅ Dummy data (you can replace with real products)
  const allProducts = new Array(12).fill({
    name: 'Onions',
    price: 20,
    location: 'Godawari-5-Lalitpur',
    image: '/assets/BuyersImg/Products/Onion.png',
  });

  const indexOfLast = currentPage * productsPerPage;
  const indexOfFirst = indexOfLast - productsPerPage;
  const currentProducts = allProducts.slice(indexOfFirst, indexOfLast);

  const handlePageChange = (page) => setCurrentPage(page);

  const categories = [
    { title: 'Agriculture', subItems: ['Crops', 'Tools', 'Irrigation'] },
    { title: 'Farming', subItems: ['Animal Husbandry', 'Aquaculture'] },
    { title: 'Fresh Vegetables', subItems: ['Leafy Greens', 'Root Vegetables'] },
    { title: 'Harvest', subItems: ['Seasonal', 'Storage'] },
    { title: 'Organic Food', subItems: ['Certified', 'Non-GMO'] },
  ];

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
                value={categoryFilter}
                onChange={handleCategoryChanges}
              >
                <option>Location</option>
                <option value="vegetables">Kathmandu</option>
                <option value="fruits">Pokhara</option>
                <option value="grains">Lalitpur</option>
                <option value="dairy">Bhaktapur</option>
                <option value="meat">Darchula</option>
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
                <option>Default sorting</option>
                <option value="Active">Active</option>
                <option value="Pause">Pause</option>
                <option value="Inactive">Inactive</option>
              </select>
              <div className="pointer-events-none absolute right-3 top-1/2 transform -translate-y-1/2 text-black text-xs">
                ▼
              </div>
            </div>
          </div>
        </div>

        {/* Content Layout */}
        <div className="p-4 max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-start gap-6">
            {/* Sidebar Categories */}
            <aside className="w-full md:w-1/4 bg-white border rounded-lg p-4">
              <h2 className="text-lg font-semibold mb-4">Categories</h2>
              <ul className="space-y-2">
                {categories.map((cat, index) => (
                  <li key={index}>
                    <button
                      onClick={() => toggleCategory(index)}
                      className="flex items-center justify-between w-full text-left text-gray-700 font-medium hover:text-green-600"
                    >
                      {cat.title}
                      <span className={`transform transition-transform ${openIndex === index ? 'rotate-90' : ''}`}>
                        ›
                      </span>
                    </button>
                    {openIndex === index && (
                      <ul className=" mt-2 text-sm text-gray-500 space-y-2 text-[16px]">
                        {cat.subItems.map((item, i) => (
                          <li key={i} className="hover:text-green-600 cursor-pointer">{item}</li>
                        ))}
                      </ul>
                    )}
                  </li>
                ))}
              </ul>
            </aside>

            {/* Product Grid */}
            <div className="w-full md:w-3/4 bg-white rounded-lg ">
              <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
                {currentProducts.map((product, idx) => (
                  <NavLink
                    key={idx}
                    to={'/Buyer-shopdetail'}
                    className="rounded text-black no-underline transition-shadow duration-300 hover:shadow-md"
                  >
                    <img src={product.image} alt={product.name} />
                    <div className="flex justify-between">
                      <div className="p-2">
                        <h5>{product.name}</h5>
                        <p className="text-green-500 text-lg">Rs {product.price}.00</p>
                      </div>
                      <div className="text-right p-2">
                        <p>Farm Name</p>
                        <p>{product.location}</p>
                      </div>
                    </div>
                  </NavLink>
                ))}
              </div>

              {/* Pagination */}
              <div className="flex justify-center mt-6">
                <Pagination
                  current={currentPage}
                  onChange={handlePageChange}
                  total={allProducts.length}
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
