import { BrowserRouter, Routes, Route } from "react-router-dom";

import Landing from "./Pages/Buyer/Landing";
import Login from "./Pages/Buyer/auth/Login";
import Register from "./Pages/Buyer/auth/Register";
import Shop from "./Pages/Buyer/Component/Shop";
import ShopDetail from "./Pages/Buyer/Component/ShopDetail";
import KYChome from "./Pages/Buyer/Component/KYChome";
import KYCform from "./Pages/Buyer/Component/KYCform";

import FarmerRegister from "./Pages/Buyer/auth/FarmerRegister";
import FarmerHomePage from "./Pages/Farmer/FarmerHomePage";
import FarmerLayout from "./Pages/Farmer/auth/FarmerLayout";
import FarmerAddProduct from "./Pages/Farmer/Parts/FarmerAddProduct";
import FarmerDashboard from "./Pages/Farmer/Parts/FarmerDashboard";
import ProtectedRoute from "./components/ProtectedRoute";

import { ToastContainer } from "react-toastify";
import { AuthProvider } from "./Context/AuthContext";
import FarmerProducts from "./Pages/Farmer/Parts/FarmerProducts";
import FarmerKYCform from "./Pages/Farmer/Parts/FarmerKYCform";
import FarmerChatbox from "./Pages/Farmer/Parts/FarmerChatbox";
import FarmerKYChome from "./Pages/Farmer/Parts/FarmerKYChome";
import Farmerorderlist from "./Pages/Farmer/Parts/Farmerorderlist";
import FarmerEditProduct from "./Pages/Farmer/Function/FarmerEditProduct";
import FarmerProfile from "./Pages/Farmer/Parts/FarmerProfile";
import WebSocketClient from "./Pages/Farmer/Parts/WebSocketClient";

import Buynow from "./Pages/Buyer/Component/Buynow";
import AddCart from "./Pages/Buyer/Component/AddCart";
import BuyerChatBox from "./Pages/Buyer/Component/BuyerChatBox";
import ForgetPassword from "./Pages/Buyer/auth/ForgetPassword";
import VerifyOTP from "./Pages/Buyer/auth/VerifyOTP";
import ResetPassword from "./Pages/Buyer/auth/ResetPassword";
import FarmerKYCDetail from "./Pages/Farmer/Parts/FarmerKYCDetails";
import PaymentMethod from "./Pages/Buyer/Component/PaymentMethod";
import OrderConfirmation from "./Pages/Buyer/Component/OrderConfirmation";
import SuperAdminLayout from "./Pages/SuperAdmin/pages/SuperAdminLayout";
import SuperAdminHome from "./Pages/SuperAdmin/pages/SuperAdminHome";
import SuperAdminFarmer from "./Pages/SuperAdmin/pages/superAdminFarmer";
import SuperAdminBuyer from "./Pages/SuperAdmin/pages/SuperAdminBuyer";
import AboutUs from "./Pages/Buyer/Component/AboutUs";
import AccountPage from "./Pages/Buyer/Component/AccountPage";
import AccountProfile from "./Pages/Buyer/Component/AccountProfile";
import BuyerKycDetail from "./Pages/Buyer/Component/BuyerKycDetail";
import Contact from "./Pages/Buyer/Component/Contact";
import MyOrdersPage from "./Pages/Buyer/Component/MyordersPage";
import ErrorPage_404 from "./Pages/Buyer/Component/ErrorPage_404";




const App = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <ToastContainer />
        <Routes>
          {/* Buyer page */}
          <Route path="/" element={<Landing />} />
          <Route path="Buyer-shop" element={<Shop />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="shopdetail/:productId" element={<ShopDetail />} />
          <Route path="Buyer-login" element={<Login />} />
          <Route path="Buyer-register" element={<Register />} />
          <Route path="Farmer-register" element={<FarmerRegister />} />
          <Route path="websocket" element={<WebSocketClient />} />
          <Route path="message" element={<BuyerChatBox />} />
          <Route path="addcart" element={<AddCart />} />
          <Route path="forgetpassword" element={<ForgetPassword />} />
          <Route path="verifyOTP" element={<VerifyOTP />} />
          <Route path="reset-password" element={<ResetPassword />} />
          <Route path="/aboutUs" element={<AboutUs />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/errorPage" element={<ErrorPage_404 />} />

          <Route element={<ProtectedRoute allowedRoles={["buyer"]} />}>
            <Route path="KYC" element={<KYChome />} />
            <Route path="KYC-Form" element={<KYCform />} />
            <Route path="Payment" element={<PaymentMethod />} />
            <Route path="buynow" element={<Buynow />} />
            <Route path="/order-confirmation" element={<OrderConfirmation />} />
            <Route path="/kycDetails" element={<BuyerKycDetail />} />
            <Route path="Myorderspage" element={<MyOrdersPage />} />
            <Route path="setting" element={<AccountPage />}>
              <Route path="" element={<AccountProfile />} />
            </Route>
          </Route>

          {/* Farmer page */}
          <Route element={<ProtectedRoute allowedRoles={["farmer"]} />}>
            <Route path="Farmerlayout" element={<FarmerLayout />}>
              <Route path="Farmer" element={<FarmerHomePage />} />
              <Route path="Farmerdashboard" element={<FarmerDashboard />} />
              <Route path="Farmerproducts" element={<FarmerProducts />} />
              <Route path="Farmeraddproduct" element={<FarmerAddProduct />} />
              <Route path="Farmerchatbox" element={<FarmerChatbox />} />
              <Route path="FarmerKYCHome" element={<FarmerKYChome />} />
              <Route path="FarmerKYCForm" element={<FarmerKYCform />} />
              <Route path="FarmerKYCDetail" element={<FarmerKYCDetail />} />

              <Route path="Farmerorderlist" element={<Farmerorderlist />} />
              <Route path="Farmerprofile" element={<FarmerProfile />} />
              <Route path="Farmereditproduct" element={<FarmerEditProduct />} />
            </Route>
          </Route>

          <Route path="/admin" element={<SuperAdminLayout />}>
            <Route index element={<SuperAdminHome />} />
            <Route path="farmer-kyc" element={<SuperAdminFarmer />} />
            <Route path="buyer-kyc" element={<SuperAdminBuyer />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;

