const Footer = () => {
  return (
    <>
      <footer className="bg-[#24231D] text-white py-10 md:flex md:justify-around md:items-center">
        <div className="max-w-screen-xl mx-auto pl-40 pr-40  grid grid-cols-1 md:grid-cols-4 gap-">
          {/* Shop Categories */}
          <div>
            <img src="/assets/BuyersImg/images/logo2.png" alt="Logo" className="mb-2" />
            <p className="text-gray-400 mb-4">
              There are many variations of passages of lorem ipsum available, but the majority suffered.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-white hover:text-blue-400"><i className="fab fa-facebook"></i></a>
              <a href="#" className="text-white hover:text-blue-400"><i className="fab fa-twitter"></i></a>
              <a href="#" className="text-white hover:text-pink-500"><i className="fab fa-instagram"></i></a>
              <a href="#" className="text-white hover:text-blue-600"><i className="fab fa-linkedin"></i></a>
            </div>
          </div>

          {/* Customer Service */}
          <div>
            <h5 className="text-lg font-semibold mb-3 pl-8">Customer Service</h5>
            <img src="/assets/BuyersImg/images/underline.png" className="h-8 pl-8" alt="underline" />
            <ul className="space-y-3 text-gray-400">
              <li className="flex items-center gap-2"><img src="/assets/BuyersImg/images/leaf.png" className="w-4 h-4" alt="Leaf" />About</li>
              <li className="flex items-center gap-2"><img src="/assets/BuyersImg/images/leaf.png" className="w-4 h-4" alt="Leaf" />Services</li>
              <li className="flex items-center gap-2"><img src="/assets/BuyersImg/images/leaf.png" className="w-4 h-4" alt="Leaf" />Our Projects</li>
              <li className="flex items-center gap-2"><img src="/assets/BuyersImg/images/leaf.png" className="w-4 h-4" alt="Leaf" />Meet the Farmers</li>
              <li className="flex items-center gap-2"><img src="/assets/BuyersImg/images/leaf.png" className="w-4 h-4" alt="Leaf" />Latest News</li>
              <li className="flex items-center gap-2"><img src="/assets/BuyersImg/images/leaf.png" className="w-4 h-4" alt="Leaf" />Contact</li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h5 className="text-lg font-semibold mb-3 ">News</h5>
            <img src="/assets/BuyersImg/images/underline.png" className="h-8" alt="underline" />
            <ul className="space-y">
              <li className="text-white">Bringing Food Production Back To Cities</li>
              <li className="text-[#EEC044]">May 13, 2025</li><br/>
              <li className="text-white">The Future of Farming, Smart Irrigation Solutions</li>
              <li className="text-[#EEC044]">May 13, 2022</li>
            </ul>
          </div>

          {/* Newsletter Signup */}
          <div>
            <h5 className="text-lg font-semibold mb-3 pl-8">Contact</h5>
            <img src="/assets/BuyersImg/images/underline.png" className="h-8 pl-8" alt="Leaf" />
            <ul className="space-y-2 text-gray-400 gap-4">
              <li className="flex items-center gap-2"><i class="fa-solid fa-phone"/>+977-9865820501</li>
              <li className="flex items-center gap-2"><i class="fa-solid fa-envelope"/>niranjachand134@gmail.com</li>
              <li className="flex items-center gap-2"><i class="fa-solid fa-location-dot"/>80 broklyn golden street line Kumaripati, Lalitpur</li>
            </ul>
            <form className="flex pl-8">
              <input type="email" placeholder="Enter your email" className="px-3 py-2 rounded-l-lg text-black" />
              <button type="submit" className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-r-lg transition duration-300">
                <i class="fa-solid fa-paper-plane"></i>
              </button>
            </form>
          </div>
        </div>
      </footer>

      <div className="bg-[#1F1E17] text-gray-400 text-sm text-center md:flex md:justify-around md:items-center px-4 md:px-16">
        <p>© All Copyright 2024 by @ Niranjan Chand</p>
        <p>Terms of Use | Privacy Policy</p>
      </div>
    </>
  );
};

export default Footer;
