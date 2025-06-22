import React from 'react';
import Header from './Header';
import Footer from './Footer';

const Buynow = () => {
  return (
    <>
      <Header />
      <div className="flex justify-center items-start">
      <div className="flex flex-col lg:flex-row justify-center p-4 gap-6">
        {/* Product List */}
        <div className="lg:w-2/3 bg-white p-4">
          <div className="flex justify-between items-center gap-4 bg-[#FAFAFA] p-2 mb-2">
            <h5 className="font-semibold">Mustang ko Apple</h5>
            <a href="#" className="no-underline text-black text-sm">EDIT</a>
          </div>

          <div className="mb-4">
            <p className="font-medium">Yukesh Shrestha</p>
            <p>Shadobato, Road, Lalitpur <br />Near Shadobato Chok way to Lagankhel</p>
          </div>

          <div className="bg-[#F4F4F4] p-1" />

          <h5 className="bg-[#FAFAFA] p-2 font-semibold">Package 1 out of 1</h5>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-4">
            <div className="flex gap-4">
              <div className="h-32 w-32">
                <img
                  src="https://www.collinsdictionary.com/images/full/apple_158989157.jpg"
                  alt="product img"
                />
              </div>
              <div>
                <h5 className="font-semibold w-48">Mustang ko Apple</h5>
                <p>Pratik Farm</p>
                <p>Gotpdawari-5-Lalitpur</p>
              </div>
            </div>

            <div className="flex justify-between">
              <h5 className="text-green-500 font-semibold ml-8">Rs. 999</h5>
              <p>Qty: 1</p>
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
            <p>Items Total <span className="text-gray-500">(1 item)</span></p>
            <h5>Rs. 999</h5>
          </div>

          <div className="flex justify-between">
            <p>Delivery Fee</p>
            <h5>Rs. 135</h5>
          </div>

          <hr className="my-2" />

          <div className="flex justify-between">
            <div>
                <p className="font-semibold">Total:</p>
                <p className="text-sm text-gray-500">All Taxes included</p>
            </div>
            <h5 className="text-red-500 text-lg font-bold ">Rs. 1134</h5>
          </div>

          <div>
            <button className="bg-green-600 p-2 font-semibold text-white w-full rounded hover:bg-green-700 transition">
              Proceed to Pay
            </button>
          </div>
        </div>
      </div>
      </div>
      <Footer/>
    </>
  );
};

export default Buynow;
