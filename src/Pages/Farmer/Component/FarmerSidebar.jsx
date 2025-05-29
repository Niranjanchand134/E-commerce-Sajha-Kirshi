import React from 'react';
import { Layout, Menu } from 'antd';
import { useNavigate } from 'react-router-dom';
import {
  PlusSquareOutlined,
  HomeOutlined,
  ProductOutlined,
  WechatWorkOutlined,
  UserSwitchOutlined,
  ProfileOutlined,
  SettingOutlined
} from '@ant-design/icons';

const { Sider } = Layout;

const FarmerSidebar = ({ collapsed }) => {
  const navigate = useNavigate();
  return (
    <Sider trigger={null} collapsible collapsed={collapsed} theme="light">
      {/* Logo Section */}
      <div className="flex flex-col items-center justify-center mt-2">
        {collapsed ? (
          <img
            src="/assets/BuyersImg/images/logo1.png"
            alt="logo1"
            className="w-10 h-10 mb-2 transition-all duration-300"
          />
        ) : (
          <img
            src="/assets/BuyersImg/images/logo.png"
            alt="logo2"
            className="w-32 mb-2 transition-all duration-300"
          />
        )}
      </div>

      <div className="flex items-center justify-center my-3 transition-all duration-300 cursor-pointer text-green-500 hover:text-green-500">
        {collapsed ? (
          <i className="fa-solid fa-user-circle text-2xl"></i>
        ) : (
          <div className="flex items-center space-x-2">
            <i className="fa-solid fa-user-circle text-2xl"></i>
            <span className="text-base">Niranjan Chand</span>
          </div>
        )}
      </div>

      {/* Menu Items */}
      <Menu
        theme="light"
        mode="inline"
        defaultSelectedKeys={['1']}
        items={[
          {
            key: '1',
            icon: <HomeOutlined />,
            label: 'Home Page',
            onClick: () => navigate('/Farmerlayout/Farmerdashboard'),
          },
          {
            key: '2',
            icon: <ProductOutlined />,
            label: 'My Products',
            onClick: () => navigate('/Farmerlayout/Farmerproducts'),
          },
          {
            key: '3',
            icon: <PlusSquareOutlined />,
            label: 'Add New Product',
            onClick: () => navigate('/Farmerlayout/Farmeraddproduct'),
          },
          {
            key: '4',
            icon: <WechatWorkOutlined />,
            label: 'Chat',
          },
          {
            key: '5',
            icon: <UserSwitchOutlined />,
            label: 'Orders & Sales',
          },
          {
            key: '6',
            icon: <ProfileOutlined />,
            label: 'KYC Status',
          },
          {
            key: '7',
            icon: <SettingOutlined />,
            label: 'Setting',
          },
        ]}
      />
    </Sider>
  );
};

export default FarmerSidebar;
