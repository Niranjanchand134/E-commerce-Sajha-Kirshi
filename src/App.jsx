import { BrowserRouter, Routes, Route } from "react-router-dom";

import Landing from "./Pages/Buyer/Landing";
import Login from "./Pages/Buyer/auth/Login";
import Register from "./Pages/Buyer/auth/Register";
import Shop from "./Pages/Buyer/Component/Shop";
import ShopDetail from "./Pages/Buyer/Component/ShopDetail";

import FarmerRegister from "./Pages/Buyer/auth/FarmerRegister";
import FarmerHomePage from "./Pages/Farmer/FarmerHomePage";
import FarmerLayout from "./Pages/Farmer/auth/FarmerLayout";
import FarmerAddProduct from "./Pages/Farmer/Parts/FarmerAddProduct";
import FarmerDashboard from "./Pages/Farmer/Parts/FarmerDashboard";



const App = () => {
  return(
      <BrowserRouter>
        <Routes>
          {/* Buyer page */}
          <Route path='/' element={<Landing />}/>
          <Route path='Buyer-shop' element={<Shop/>}/>
          <Route path='Buyer-shopdetail' element={<ShopDetail/>}/>
          <Route path='Buyer-login' element={<Login/>}/>
          <Route path='Buyer-register' element={<Register/>}/>
          <Route path='Farmer-register' element={<FarmerRegister/>}/>

          {/* Farmer page */}
          <Route path='Farmerlayout' element={<FarmerLayout/>}>
              <Route path='Farmer' element={<FarmerHomePage/>}/>
              <Route path='Farmeraddproduct' element={<FarmerAddProduct/>}/>
              <Route path='Farmerdashboard' element={<FarmerDashboard/>}/>
          </Route>
        </Routes>
      </BrowserRouter>
  );
}

export default App;

