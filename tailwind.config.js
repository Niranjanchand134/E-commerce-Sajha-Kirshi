/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/Buyer/Component/Header.jsx",
    "./src/pages/Buyer/Landing.jsx",
    "./src/pages/Buyer/Component/Product.jsx",
    "./src/pages/Buyer/Component/Footer.jsx",
    "./src/pages/Buyer/Component/scroll.jsx",
    "./src/pages/Buyer/Component/shop.jsx",
    "./src/pages/Buyer/Component/ShopDetail.jsx",
    "./src/pages/Buyer/Component/OtherContent.jsx",
    "./src/pages/Buyer/auth/FarmerRegister.jsx",
    "./src/pages/Buyer/Component/KYChome.jsx",

    "./src/pages/Farmer/FarmerHomePage.jsx",
    "./src/pages/Farmer/Component/FarmerSidebar.jsx",
    "./src/pages/Farmer/Parts/FarmerDashboard.jsx",
    "./src/pages/Farmer/Parts/FarmerProducts.jsx",
    "./src/pages/Farmer/Parts/FarmerAddProduct.jsx",
    "./src/pages/Farmer/Parts/FarmerChatbox.jsx",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
