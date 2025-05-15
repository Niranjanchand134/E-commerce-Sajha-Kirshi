import { BrowserRouter, Routes, Route } from "react-router-dom";

import Landing from "./Pages/Buyer/Landing";
import Login from "./Pages/Buyer/auth/Login";
import Register from "./Pages/Buyer/auth/Register";



const App = () => {
  return(
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Landing />}/>
          <Route path='Buyer-login' element={<Login/>}/>
          <Route path='Buyer-register' element={<Register/>}/>
        </Routes>
      </BrowserRouter>
  );
}

export default App;

