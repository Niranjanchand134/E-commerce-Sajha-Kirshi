import React from 'react';
import { useState } from 'react';
import { Button, Layout, theme } from 'antd';
import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons';

const { Header } = Layout;

const FarmerHeader = ({ collapsed, setCollapsed }) => {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const [showSearch, setShowSearch] = useState(false);

  return (
    <Header
      style={{
        padding: '0 24px',
        background: colorBgContainer,
        borderRadius: borderRadiusLG,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}
    >
      {/* Toggle Button */}
      <Button
        type="text"
        icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
        onClick={() => setCollapsed(!collapsed)}
        style={{
          fontSize: '16px',
          width: 64,
          height: 64,
        }}
      />

      {/* Right-side icons + profile */}
      <div className="hidden lg:flex items-center space-x-6 gap-6 text-xl text-gray-700">
        {/* Icons */}
        <div className="flex items-center space-x-4">
          <div
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
    </div>
          <i className="fa-solid fa-cart-shopping hover:text-black cursor-pointer"></i>
          <i className="fa-solid fa-bell hover:text-black cursor-pointer"></i>
        </div>

        {/* Profile icon and name */}
        <div className="flex items-center text-green-500 space-x-2 gap-2 cursor-pointer hover:text-black">
          <span className="text-base">John Doe</span>
          <i className="fa-solid fa-user-circle text-2xl"></i>
        </div>
      </div>
    </Header>
  );
};

export default FarmerHeader;
