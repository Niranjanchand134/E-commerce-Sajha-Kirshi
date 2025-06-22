import React, { useState } from "react";
import { FaRegHeart, FaHeart } from "react-icons/fa";
import { RiDeleteBin6Line } from "react-icons/ri";
import { GrSubtract } from "react-icons/gr";
import { IoMdAdd } from "react-icons/io";
import { MdOutlineKeyboardArrowRight } from "react-icons/md";
import Header from "./Header";
import Footer from "./Footer";

const productsData = [
  {
    farm: "Niranjan Farm",
    items: [
      {
        name: "Mustang ko Apple",
        desc: "Fresh healthy apple all the way from Mustang",
        price: 999,
      },
      {
        name: "Mustang ko Apple",
        desc: "Fresh healthy apple all the way from Mustang",
        price: 999,
      },
    ],
  },
  {
    farm: "Pratik Farm",
    items: [
      {
        name: "Mustang ko Apple",
        desc: "Fresh healthy apple all the way from Mustang",
        price: 999,
      },
      {
        name: "Mustang ko Apple",
        desc: "Fresh healthy apple all the way from Mustang",
        price: 999,
      },
    ],
  },
  {
    farm: "Astha Farm",
    items: [
      {
        name: "Mustang ko Apple",
        desc: "Fresh healthy apple all the way from Mustang",
        price: 999,
      },
      {
        name: "Mustang ko Apple",
        desc: "Fresh healthy apple all the way from Mustang",
        price: 999,
      },
    ],
  },
];

// 🧩 Per-product card component with its own state
const ProductCard = ({ item }) => {
  const [count, setCount] = useState(1);
  const [liked, setLiked] = useState(false);

  const increase = () => setCount((prev) => prev + 1);
  const decrease = () => setCount((prev) => (prev > 1 ? prev - 1 : 1));
  const toggleLike = () => setLiked((prev) => !prev);

  return (
    <div className="flex items-center space-x-4 border-b pb-4 last:border-b-0">
      <input type="checkbox" className="form-checkbox" />

      <img
        src="https://www.collinsdictionary.com/images/full/apple_158989157.jpg"
        alt="Apple"
        className="w-20 h-20 object-cover rounded"
      />

      <div className="flex-1">
        <h5 className="font-semibold">{item.name}</h5>
        <p className="text-sm text-gray-500">{item.desc}</p>
      </div>

      <div className="flex gap-4 items-center">
        {/* ❤️ and 🗑 + Price */}
        <div className="flex flex-col items-center justify-between space-y-2">
          <div className="text-green-500 font-semibold">Rs. {item.price}</div>
          <div className="flex gap-4 items-center text-gray-500 text-xl">
            <button
              onClick={toggleLike}
              className="hover:text-red-500 transition-all duration-200"
            >
              {liked ? <FaHeart className="text-red-500" /> : <FaRegHeart />}
            </button>
            <button className="hover:text-red-600 transition-all duration-200">
              <RiDeleteBin6Line />
            </button>
          </div>
        </div>

        {/* Quantity */}
        <div className="flex items-center space-x-2 text-gray-600 font-semibold text-lg">
          <button onClick={decrease} className="bg-[#DAF8D9] p-1">
            <GrSubtract size={16} />
          </button>
          <span className="text-xl">{count}</span>
          <button onClick={increase} className="bg-[#DAF8D9] p-1">
            <IoMdAdd size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

const AddCart = () => {
  return (
    <>
    <Header/>
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <div className="w-full max-w-4xl space-y-10 p-4">
        {productsData.map((farm, index) => (
          <div key={index}>
            {/* Farm Header */}
            <div className="flex items-center gap-1 mb-2">
                <input type="checkbox" className="form-checkbox mb-1" />
                <h2 className="text-green-600 font-semibold text-lg">
                    {farm.farm}
                </h2>
                <MdOutlineKeyboardArrowRight className="text-gray-400 text-xl mb-1" size={20} />
            </div>


            {/* Product List */}
            <div className="bg-white shadow-md rounded p-4 space-y-4">
              {farm.items.map((item, idx) => (
                <ProductCard key={idx} item={item} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
    <Footer/>
    </>
  );
};

export default AddCart;
