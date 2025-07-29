const Footer = () => {
  return (
    <>
      <footer className="bg-[#24231D] text-white py-6 px-4 md:px-40">
        <div className="mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 justify-items-center gap-8">
          {/* Logo and Social Links */}
          <div className="flex flex-col items-center sm:items-start">
            <img src="/assets/BuyersImg/images/logo2.png" alt="Logo" className="mb-2 w-48" />
            <p className="text-gray-400 mb-4 text-center sm:text-left max-w-64">
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
          <div className="flex flex-col items-center sm:items-start">
            <h5 className="text-lg font-semibold mb-3">Customer Service</h5>
            <img src="/assets/BuyersImg/images/underline.png" className="h-8" alt="underline" />
            <ul className="space-y-3 text-gray-400 mt-2">
              <li className="flex items-center gap-2"><img src="/assets/BuyersImg/images/leaf.png" className="w-4 h-4" alt="Leaf" />About</li>
              <li className="flex items-center gap-2"><img src="/assets/BuyersImg/images/leaf.png" className="w-4 h-4" alt="Leaf" />Products</li>
              <li className="flex items-center gap-2"><img src="/assets/BuyersImg/images/leaf.png" className="w-4 h-4" alt="Leaf" />login</li>
              <li className="flex items-center gap-2"><img src="/assets/BuyersImg/images/leaf.png" className="w-4 h-4" alt="Leaf" />Register as Buyer</li>
              <li className="flex items-center gap-2"><img src="/assets/BuyersImg/images/leaf.png" className="w-4 h-4" alt="Leaf" />Register as Farmer</li>
              <li className="flex items-center gap-2"><img src="/assets/BuyersImg/images/leaf.png" className="w-4 h-4" alt="Leaf" />Contact</li>
            </ul>
          </div>

          {/* Contact */}
          <div className="flex flex-col items-center sm:items-start">
            <h5 className="text-lg font-semibold mb-3">Contact</h5>
            <img src="/assets/BuyersImg/images/underline.png" className="h-8" alt="Leaf" />
            <ul className="space-y-2 text-gray-400 mt-2">
              <li className="flex items-start gap-2"><i className="fa-solid fa-phone mt-1"/>+977-9865820501</li>
              <li className="flex items-start gap-2"><i className="fa-solid fa-envelope mt-1"/>sajhakrishi@gmail.com</li>
              <li className="flex items-start gap-2"><i className="fa-solid fa-location-dot mt-1"/>80 broklyn golden street line Kumaripati, Lalitpur</li>
            </ul>
          </div>
        </div>
      </footer>

      <div className="bg-[#1F1E17] text-gray-400 text-sm py-4 px-4 text-center">
        <p>© All Copyright 2024 by @ Sajha Krishi</p>
      </div>
    </>
  );
};

export default Footer;