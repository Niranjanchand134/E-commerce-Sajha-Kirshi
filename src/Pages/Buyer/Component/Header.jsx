import './style.css';
import { useNavigate, NavLink } from 'react-router-dom';
import { UserOutlined, LogoutOutlined, FormOutlined } from '@ant-design/icons';
import { Dropdown, Menu, Space } from 'antd';
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../Context/AuthContext';


const Header = () => {
  const navigate = useNavigate();
  const {user, logout} = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  

  const handleLogoutClick = () => {
    logout();
    window.location.reload();
  };

  const handlecartClick = () => {
    navigate("/addcart");
  };

  useEffect(() => {
    const count = parseInt(localStorage.getItem("cartCount") || "0");
    setCartCount(count);

    // Optional: Update on storage change (e.g., if cart changes on another tab)
    window.addEventListener("storage", () => {
      setCartCount(parseInt(localStorage.getItem("cartCount") || "0"));
    });
  }, []);

  const menu = (
    <Menu
      items={[
        {
          label: "Manage my ad",
          key: "manage my ads",
          icon: <FormOutlined />,
          onClick: () => navigate('/manageAd'),
        },
        {
          label: "Profile",
          key: "profile",
          icon: <UserOutlined />,
          onClick: () => navigate('/profilePage'),
        },
        {
          label: "Logout",
          key: "logout",
          icon: <LogoutOutlined />,
        },
      ]}
      onClick={({ key }) => {
        if (key === "logout") {
          handleLogoutClick();
        }
      }}
    />
  );

 const joinus = {
  items: [
    {
      label: "Farmer Register",
      key: "seller",
      onClick: () => navigate("/Farmer-register"),
    },
    {
      label: "Join as a Delivery Partner",
      key: "delivery",
      onClick: () => navigate("/Farmerlayout/Farmerdashboard"),
    },
  ]
};


  return (
    <nav className="sticky top-0 bg-white p-2 shadow-md z-50">
      <div className="max-w-7xl mx-auto flex justify-around items-center">
        {/* Logo */}
        <div className="w-28">
          <img
            src="/assets/BuyersImg/images/logo.png"
            alt="logo"
            className="w-full"
          />
        </div>

        {/* Hamburger for mobile */}
        <div className="lg:hidden">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="text-2xl"
          >
            <i className="fas fa-bars"></i>
          </button>
        </div>

        {/* Navigation Links */}
        <div
          className={`lg:flex lg:items-center lg:space-x-6 ${
            isMenuOpen ? "block" : "hidden"
          } absolute lg:static top-16 left-0 w-full lg:w-auto bg-white px-4 lg:px-0 py-2 lg:py-0`}
        >
          <ul className="flex flex-col lg:flex-row space-y-3 lg:space-y-0 lg:space-x-6 text-gray-700 text-center">
            <li
              className="hover:text-black cursor-pointer"
              onClick={() => navigate("/")}
            >
              Home
            </li>
            <li className="hover:text-black cursor-pointer">About</li>
            <li
              className="hover:text-black cursor-pointer"
              onClick={() => navigate("/Buyer-shop")}
            >
              Services
            </li>
            <li className="hover:text-black cursor-pointer">Contact</li>
            <li className="hover:text-black cursor-pointer" onClick={() => navigate('/KYC')}>KYC Form</li>
            {/* <li className="hover:text-black cursor-pointer" onClick={() => navigate('/Buyer-login')}>Login</li>
            <li className="hover:text-black cursor-pointer" onClick={() => navigate('/Buyer-register')}>SignUp</li> */}
          </ul>
        </div>

        {/* Right Icons */}
        <div className="hidden lg:flex items-center space-x-4 text-xl text-gray-700">
          <i className="fa-solid fa-magnifying-glass hover:text-black cursor-pointer"></i>
          <div className="relative cursor-pointer" onClick={handlecartClick}>
            <i className="fa-solid fa-cart-shopping hover:text-black text-xl"></i>
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full">
                {cartCount}
              </span>
            )}
          </div>
          <i className="fa-solid fa-bell hover:text-black cursor-pointer"></i>

          <div className="buttons d-flex align-items-center text-center gap-3">
            {user !== null ? (
              <Dropdown overlay={menu} trigger={["hover"]}>
                <a onClick={(e) => e.preventDefault()}>
                  <Space>
                    <UserOutlined />
                    {user.name}
                  </Space>
                </a>
              </Dropdown>
            ) : (
              <div>
                <NavLink to="/Buyer-login" className="btn btn-success m-1">
                  <i className="fa fa-user-plus mr-1"></i> SignUp
                </NavLink>

                <button className="btn btn-outline-success m-1 text-white">
                  <Dropdown menu={joinus} trigger={["click"]}>
                    <a
                      onClick={(e) => e.preventDefault()}
                      className="text-black"
                    >
                      <Space>
                        Join Us
                        <i className="fa fa-caret-down"></i>
                      </Space>
                    </a>
                  </Dropdown>
                </button>

              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Header;
