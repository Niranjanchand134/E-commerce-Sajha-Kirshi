import {
  BarsOutlined,
  HomeOutlined,
  MenuFoldOutlined,
  PayCircleOutlined,
  ProductOutlined,
  UserAddOutlined,
  UsergroupDeleteOutlined,
} from "@ant-design/icons";
import { Menu } from "antd";
import React from "react";
import { useNavigate } from "react-router";


const SidebarMenulist = ({collapsed}) => {
  const navigate = useNavigate();

  const handleMenuClick = (path) => {
    navigate(path); // Navigate to the specified path
  };

  const handleBuyerClick = (path) => {
    navigate(path); // Navigate to the specified path
  };

  const handleFarmerClick = (path) => {
    navigate(path); // Navigate to the specified path
  };

  return (
    <Menu trigger={null} theme={"light"} mode="inline" className="menu-bar">
      <Menu.Item
        key="home"
        className="text-base font-medium"
        icon={<HomeOutlined style={{ fontSize: "20px" }} />}
        onClick={() => handleMenuClick("")}
      >
        Home
      </Menu.Item>

      <Menu.Item
        key="restaurant"
        className="text-base font-medium"
        onClick={() => handleFarmerClick("./farmer-kyc")}
        icon={<ProductOutlined style={{ fontSize: "20px" }} color="#080808" />}
      >
        Farmer Kyc
      </Menu.Item>
      <Menu.Item
        key="user"
        className="text-base font-medium"
        onClick={() => handleBuyerClick("./buyer-kyc")}
        icon={< UsergroupDeleteOutlined  style={{ fontSize: "20px" }} color="#080808" />}
      >
        Buyer Kyc
      </Menu.Item>
    </Menu>
  );
};

export default SidebarMenulist;
