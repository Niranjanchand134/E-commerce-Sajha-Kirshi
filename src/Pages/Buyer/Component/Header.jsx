import './style.css';
import { useNavigate } from 'react-router-dom';
import { UserOutlined, LogoutOutlined, FormOutlined } from '@ant-design/icons';
import { Dropdown, Menu, Space } from 'antd';
import React, { useState } from 'react';

const Header = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogoutClick = () => {
    localStorage.removeItem("username");
    navigate("/login");
    window.location.reload();
  };

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

  return (
    <nav className="sticky top-0 bg-white p-2 shadow-md z-50">
      <div className="max-w-7xl mx-auto flex justify-around items-center">
        {/* Logo */}
        <div className="w-28">
          <img src="/assets/BuyersImg/images/logo.png" alt="logo" className="w-full" />
        </div>

        {/* Hamburger for mobile */}
        <div className="lg:hidden">
          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-2xl">
            <i className="fas fa-bars"></i>
          </button>
        </div>

        {/* Navigation Links */}
        <div className={`lg:flex lg:items-center lg:space-x-6 ${isMenuOpen ? "block" : "hidden"} absolute lg:static top-16 left-0 w-full lg:w-auto bg-white px-4 lg:px-0 py-2 lg:py-0`}>
          <ul className="flex flex-col lg:flex-row space-y-3 lg:space-y-0 lg:space-x-6 text-gray-700 text-center">
            <li className="hover:text-black cursor-pointer">Home</li>
            <li className="hover:text-black cursor-pointer">About</li>
            <li className="hover:text-black cursor-pointer" onClick={() => navigate('/Buyer-shop')}>Services</li>
            <li className="hover:text-black cursor-pointer">Contact</li>
            <li className="hover:text-black cursor-pointer" onClick={() => navigate('/Buyer-login')}>Login</li>
            <li className="hover:text-black cursor-pointer" onClick={() => navigate('/Buyer-register')}>SignUp</li>
          </ul>
        </div>

        {/* Right Icons */}
        <div className="hidden lg:flex items-center space-x-4 text-xl text-gray-700">
          <i className="fa-solid fa-magnifying-glass hover:text-black cursor-pointer"></i>
          <i className="fa-solid fa-cart-shopping hover:text-black cursor-pointer"></i>
          <i className="fa-solid fa-bell hover:text-black cursor-pointer"></i>

          <Dropdown overlay={menu} trigger={["hover"]}>
            <a onClick={(e) => e.preventDefault()} className="hover:text-black">
              <Space>
                <UserOutlined />
              </Space>
            </a>
          </Dropdown>
        </div>
      </div>
    </nav>
  );
};

export default Header;
