import React, { useEffect } from "react";
import { Outlet, useNavigate } from "react-router";
import { Affix, Avatar, Badge, Button, Col, Layout, Row, theme } from "antd";
import { useState } from "react";
import {
  BellOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from "@ant-design/icons";
import { Content, Header } from "antd/es/layout/layout";
import Sider from "antd/es/layout/Sider";
import SidebarMenulist from "../AdminComponent/SidebarMenulist";
import ProfileDropdowns from "../../../components/ProfileDropdowns";

const SuperAdminLayout = () => {
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const [dropdownOpen, setdropdownOpen] = useState(false);

  const handleModal = () => {
    console.log("button is clicked ????");
    setdropdownOpen(true);
  };

  useEffect(() => {
    if (localStorage.getItem("role") === "user") {
      navigate("/");
    }
    if (localStorage.getItem("role") === "restaurant") {
      navigate("/restaurant");
    }
  }, []);

  return (
    <div>
      <Layout>
        <Affix offsetTop={0}>
          <Sider trigger={null} collapsible collapsed={collapsed} theme="light">
            <div className="flex flex-col items-center justify-center mt-2">
              {collapsed ? (
                <img
                  src="/assets/BuyersImg/images/logo1.png" // Your small logo path
                  alt="logo-collapsed"
                  className="w-10 h-10 mb-2 transition-all duration-300"
                />
              ) : (
                <img
                  src="/assets/BuyersImg/images/logo.png" // Your full logo path
                  alt="logo-full"
                  className="w-32 mb-2 transition-all duration-300"
                />
              )}
            </div>
            <SidebarMenulist />
          </Sider>
        </Affix>

        <Layout>
          <Header
            className="main-header border-b-2"
            style={{
              zIndex: 999,
              backgroundColor: "#fff",
              position: "sticky",
              top: 0,
            }}
          >
            <Row>
              <Col span={20}>
                <Button
                  className="toggle border-none"
                  onClick={() => setCollapsed(!collapsed)}
                >
                  {collapsed ? (
                    <MenuUnfoldOutlined style={{ height: "20px" }} />
                  ) : (
                    <MenuFoldOutlined />
                  )}
                </Button>
              </Col>

              <Row align="middle" gutter={[20, 0]} style={{ width: 'auto' }}>
                  <Col flex="none">
                    <Badge count={5} onClick={handleModal}>
                      <Avatar shape="circle" style={{ background: "white" }} >
                        <BellOutlined style={{ fontSize: 20, color: "black" }} />
                      </Avatar>
                    </Badge>
                  </Col>

                  <Col flex="none">
                    <div style={{ display: 'flex', alignItems: 'center', height: '100%' }}>
                      <ProfileDropdowns logout={true} />
                    </div>
                  </Col>
                </Row>
            </Row>
          </Header>

          <Layout
            style={{
              padding: "0 24px 24px",
            }}
          >
            <Content className="main-content">
              <Outlet />
            </Content>
          </Layout>
        </Layout>
      </Layout>
    </div>
  );
};

export default SuperAdminLayout;