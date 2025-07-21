import "./style.css";
import { useNavigate, NavLink } from "react-router-dom";
import { UserOutlined, LogoutOutlined, FormOutlined } from "@ant-design/icons";
import { Dropdown, Menu, Space } from "antd";
import React, { useState, useEffect } from "react";
import { useAuth } from "../../../Context/AuthContext";
import { getCartItemCount } from "../../../services/OtherServices/cartService";
import NotificationPopup from "../../../components/NotificationPopup";
import { getKycByUserId } from "../../../services/buyer/BuyerApiService";


const Header = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    if (user?.id) {
      fetchCartCount();
    }
  }, [user]);

  const fetchCartCount = async () => {
    try {
      const response = await getCartItemCount(user.id);
      setCartCount(response.data);
      localStorage.setItem("cartCount", response.data);
    } catch (error) {
      console.error("Failed to fetch cart count:", error);
      setCartCount(0);
      localStorage.setItem("cartCount", "0");
    }
  };

  const handleLogoutClick = () => {
    logout();
    setCartCount(0);
    localStorage.setItem("cartCount", "0");
    window.location.reload();
  };

  const handleKycClick = async () =>{
    const response = await getKycByUserId(user.id);
    if (!response && !response.id){
      navigate("/kyc")
    }
    navigate("/kycDetails");
  }

  const handleCartClick = () => {
    navigate("/addcart");
  };

  const menu = (
    <Menu
      items={[
        {
          label: "Profile",
          key: "profile",
          icon: <UserOutlined />,
          onClick: () => navigate("/setting"),
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
    ],
  };

  const handleMessageClick = () => {
    navigate("/message");
  };
  const handleNotificationClick = ()=>{
    navigate("/notification");
  }

  return (
    <nav className="sticky top-0 bg-white p-2 shadow-md z-50">
      <div className="max-w-7xl mx-auto flex justify-around items-center">
        <div className="w-28">
          <img
            src="/assets/BuyersImg/images/logo.png"
            alt="logo"
            className="w-full"
          />
        </div>

        <div className="lg:hidden">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="text-2xl"
          >
            <i className="fas fa-bars"></i>
          </button>
        </div>

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
            {user !== null ? (
              <></>
            ) : (
              <li
                className="hover:text-black cursor-pointer"
                onClick={() => navigate("/aboutUs")}
              >
                About
              </li>
            )}

            <li
              className="hover:text-black cursor-pointer"
              onClick={() => navigate("/Buyer-shop")}
            >
              Services
            </li>
            {user !== null ? (
              <></>
            ) : (
              <li className="hover:text-black cursor-pointer">Contact</li>
            )}

            {user !== null ? (
              <>
                <li
                  className="hover:text-black cursor-pointer"
                  onClick={handleKycClick}
                >
                  KYC Form
                </li>
                <li
                  className="hover:text-black cursor-pointer"
                  
                >
                  My Order
                </li>
              </>
            ) : (
              <></>
            )}
          </ul>
        </div>

        <div className="hidden lg:flex items-center space-x-4 text-xl text-gray-700">
          <i className="fa-solid fa-magnifying-glass hover:text-black cursor-pointer"></i>
          <div className="relative cursor-pointer" onClick={handleCartClick}>
            <i className="fa-solid fa-cart-shopping hover:text-black text-xl"></i>
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full">
                {cartCount}
              </span>
            )}
          </div>
          {/* <i onClick={handleNotificationClick} className="fa-solid fa-bell hover:text-black cursor-pointer"></i> */}
          <NotificationPopup />
          <i
            onClick={handleMessageClick}
            className="fa-solid fa-message hover:text-black cursor-pointer"
          ></i>

          <div className="buttons d-flex align-items-center text-center gap-3">
            {user !== null ? (
              <Dropdown overlay={menu} trigger={["hover"]}>
                <a onClick={(e) => e.preventDefault()}>
                  <Space className="text-green-700">
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

                <button className="btn btn-outline-success m-1">
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
