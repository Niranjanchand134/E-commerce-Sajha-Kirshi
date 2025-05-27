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
    <Layout style={{ height: '100vh', overflow: 'hidden' }}>
      <FarmerSidebar collapsed={collapsed} />

      <Layout style={{ overflow: 'hidden' }}>
        <FarmerHeader collapsed={collapsed} setCollapsed={setCollapsed} />

        <Content
          style={{
            margin: '24px 16px',
            padding: 24,
            overflowY: 'auto',     // Makes Content scrollable
            height: 'calc(100vh - 64px)', // Assuming header height is 64px
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
          }}
        >
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default FarmerHomePage;
