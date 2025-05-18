import './style.css';
import { useNavigate, NavLink } from 'react-router-dom';
import { UserOutlined, LogoutOutlined, FormOutlined } from '@ant-design/icons';
import { Dropdown, Menu, Space } from 'antd'; // ✅ IMPORT Menu
import React from 'react';

const Header = () => {
  const navigate = useNavigate();

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
    <>
      <nav className="sticky top-0 bg-white p-[20px]">
        <div className="flex justify-around text-regal-blue">
          <div className="w-32">
            <img src="/assets/BuyersImg/images/logo.png" alt="logo" />
          </div>
          <div className="flex items-center">
            <ul className="grid grid-flow-col gap-4 text-gray-700">
              <li className="hover:text-black active">Home</li>
              <li>About</li>
              <li>Services</li>
              <li>Contact</li>
              <li onClick={() => navigate('/Buyer-login')}>Login</li>
              <li onClick={() => navigate('/Buyer-register')}>SignUp</li>
            </ul>
          </div>
          <div className="grid grid-flow-col gap-4 items-center">
            <div>
              <i className="fa-solid fa-magnifying-glass"></i>
            </div>
            <div>
              <i className="fa-solid fa-cart-shopping"></i>
            </div>
            <div>
              <i className="fa-solid fa-bell"></i>
            </div>
            <div>
              <Dropdown overlay={menu} trigger={["hover"]}>
                <a onClick={(e) => e.preventDefault()}>
                  <Space>
                    <UserOutlined />
                  </Space>
                </a>
              </Dropdown>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Header;
