import React, { useState } from 'react';
import { Button, Layout, Dropdown, Menu, theme } from 'antd';
import {
  FormOutlined,
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  MoreOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { useAuth } from '../../../Context/AuthContext';
import { useNavigate } from 'react-router-dom';

const { Header } = Layout;

const FarmerHeader = ({ collapsed, setCollapsed }) => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const [showSearch, setShowSearch] = useState(false);

  const dropmenu = (
    <Menu
      items={[
        {
          label: "Manage my ad",
          key: "manage my ads",
          icon: <FormOutlined />,
          onClick: () => navigate("/manageAd"),
        },
        {
          label: "Profile",
          key: "profile",
          icon: <UserOutlined />,
          onClick: () => navigate("/Farmerlayout/Farmerprofile"),
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

  const handleLogoutClick = () => {
    logout();
    window.location.reload();
  };

  const menu = (
    <Menu>
      <Menu.Item key="search">
        <span>
          <i className="fa-solid fa-magnifying-glass mr-2"></i>Search
        </span>
      </Menu.Item>
      
      <Menu.Item key="profile">
        <span>
          <i className="fa-solid fa-user-circle mr-2"></i>
          {/* {user.name} */}
        </span>
      </Menu.Item>
    </Menu>
  );

  return (
    <Header
      style={{
        padding: "0 24px",
        background: colorBgContainer,
        borderRadius: borderRadiusLG,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      {/* Toggle Button */}
      <Button
        type="text"
        icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
        onClick={() => setCollapsed(!collapsed)}
        style={{
          fontSize: "16px",
          width: 64,
          height: 64,
        }}
      />

      {/* Right-side icons (desktop only) */}
      <div className="hidden lg:flex items-center space-x-6 gap-6 text-xl text-gray-700">
        {/* Icons */}
        <div className="flex items-center space-x-4">
          {/* <div
            className="relative inline-block"
            onMouseEnter={() => setShowSearch(true)}
            onMouseLeave={() => setShowSearch(false)}
          >
            <i className="fa-solid fa-magnifying-glass hover:text-black cursor-pointer text-xl"></i>

            {showSearch && (
              <input
                type="text"
                placeholder="Search..."
                className="absolute left-8 top-0 px-2 py-1 border border-gray-300 rounded-md w-48 transition-all duration-300"
                autoFocus
              />
            )}
          </div> */}
          <i className="fa-solid fa-bell hover:text-black cursor-pointer"></i>
        </div>

        {/* Profile */}
        <div className="flex items-center justify-center my-3 transition-all duration-300 cursor-pointer text-green-500 hover:text-green-500">
          <Dropdown overlay={dropmenu} trigger={["hover"]}>
            <a onClick={(e) => e.preventDefault()} className="no-underline">
              <div className="flex items-center space-x-2 text-green-500">
                <i className="fa-solid fa-user-circle text-2xl "></i>
                <span className="text-base ">{user.name}</span>
              </div>
            </a>
          </Dropdown>
        </div>
      </div>

      {/* Mobile menu button (only on small screens) */}
      <div className="lg:hidden">
        <Dropdown overlay={menu} placement="bottomRight" arrow>
          <Button icon={<MoreOutlined />} />
        </Dropdown>
      </div>
    </Header>
  );
};

export default FarmerHeader;
