import { LogoutOutlined, SettingOutlined, UserOutlined } from "@ant-design/icons";
import { Avatar, Dropdown, Modal } from "antd";
import React, { useContext, useState } from "react";
import { useNavigate } from "react-router";
// import { UserContext } from "../../Context/User.context";

const items = [
  {
    key: "1",
    label: "My Account",
    disabled: true,
  },
  {
    type: "divider",
  },
  {
    key: "/restaurant/setting",
    label: "Setting",
    icon: <SettingOutlined />,
  },
  {
    key: "/logout",
    label: "Logout",
    icon: <LogoutOutlined />,
  },
];

const ProfileDropdowns = (logout) => {
//   const { _rest, _setRest } = useContext();
//   const { user } = useContext(UserContext); // Assuming you have user context

  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOk = () => {
    if (_setRest) {
      _setRest(null); // Reset _rest to null
    }
    if (logout) {
      localStorage.setItem("admin_Login", 0);
    }
    // localStorage.removeItem("restaurant_Login");

    setIsModalOpen(false);
    navigate("/login");
    console.log("Logout clicked");
  };
  
  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const handleMenuClick = (e) => {
    if (e.key === "/restaurant/setting") {
      navigate("/restaurant/setting");
    } else if (e.key === "/logout") {
      setIsModalOpen(true);
    }
  };

  return (
    <div className="flex items-center justify-center my-3 transition-all duration-300 cursor-pointer text-green-500 hover:text-green-500">
      <Dropdown 
        menu={{ items, onClick: handleMenuClick }}
        trigger={["hover"]}
      >
        <a onClick={(e) => e.preventDefault()} className="no-underline">
          <div className="flex items-center space-x-2 text-green-500">
            <UserOutlined className="text-2xl" />
            <span className="text-base">Profile</span>
          </div>
        </a>
      </Dropdown>
      
      <Modal
        title="Are you sure want to Logout!"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        okButtonProps={{
          style: {
            backgroundColor: '#52c41a',
            borderColor: '#52c41a',
          }
        }}
      />
    </div>
  );
};

export default ProfileDropdowns;