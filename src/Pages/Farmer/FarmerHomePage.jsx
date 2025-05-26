import React, { useState } from 'react';
import { Layout, theme } from 'antd';
import FarmerHeader from './Component/FarmerHeader';
import FarmerSidebar from './Component/FarmerSidebar';
import { Outlet } from 'react-router-dom';

const { Content } = Layout;

const FarmerHomePage = () => {
  const [collapsed, setCollapsed] = useState(false);

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <FarmerSidebar collapsed={collapsed} />

      <Layout>
        <FarmerHeader collapsed={collapsed} setCollapsed={setCollapsed} />

        <Content
          style={{
            margin: '24px 16px',
            padding: 24,
            minHeight: 280,
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
          }}
        >
          <Outlet/>
        </Content>
      </Layout>
    </Layout>
  );
};

export default FarmerHomePage;
