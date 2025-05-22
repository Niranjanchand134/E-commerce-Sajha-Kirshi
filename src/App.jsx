import { BrowserRouter, Routes, Route } from "react-router-dom";

import Landing from "./Pages/Buyer/Landing";
import Login from "./Pages/Buyer/auth/Login";
import Register from "./Pages/Buyer/auth/Register";
import Shop from "./Pages/Buyer/Component/Shop";
import ShopDetail from "./Pages/Buyer/Component/ShopDetail";
import FarmerRegister from "./Pages/Buyer/auth/FarmerRegister";



const App = () => {
  return(
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Landing />}/>
          <Route path='Buyer-shop' element={<Shop/>}/>
          <Route path='Buyer-shopdetail' element={<ShopDetail/>}/>
          <Route path='Buyer-login' element={<Login/>}/>
          <Route path='Buyer-register' element={<Register/>}/>
          <Route path='Farmer-register' element={<FarmerRegister/>}/>
        </Routes>
      </BrowserRouter>
  );
}

export default App;

