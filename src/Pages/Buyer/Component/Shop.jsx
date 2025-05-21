import React from 'react';
import Footer from "./Footer";
import Header from "./Header";
import { Layout,Input, Select, Menu, Pagination  } from 'antd';
import {UserOutlined, LaptopOutlined, NotificationOutlined } from '@ant-design/icons';
import { NavLink } from 'react-router-dom';

const { Sider, Content } = Layout;
const { Search } = Input;

const items2 = [UserOutlined, LaptopOutlined, NotificationOutlined].map((icon, index) => {
  const key = String(index + 1);
  return {
    key: `sub${key}`,
    icon: React.createElement(icon),
    label: `subnav ${key}`,
    children: Array.from({ length: 4 }).map((_, j) => {
      const subKey = index * 4 + j + 1;
      return {
        key: subKey,
        label: `option${subKey}`,
      };
    }),
  };
});
const onClick = e => {
  console.log('click', e);
};


const handleChange = value => {
  console.log(`selected ${value}`);
};

const onSearch = (value, _e, info) =>
  console.log(info === null || info === void 0 ? void 0 : info.source, value);



const siderStyle = {
  textAlign: 'center',
  lineHeight: '120px',
  color: 'black',
  backgroundColor: 'white',
};

const layoutStyle = {
  borderRadius: 8,
  overflow: 'hidden',
  maxWidth: '1000px',  // Better for large screens
  margin: '0 auto',    // Center the layout
  width: '100%',
};



const Shop = () => {
  return (
    <>
      <Header />
      <div>
        <div className="text-center p-4">
          <h2 className="font-bold">Explore Different Products</h2>
          <p>Discover Fresh and Healthy products directly from the farmers.</p>
        </div>
       <div className="flex justify-around items-center p-2">
            <div style={{ width: 160 }} className="pe-8">
                <Select
                showSearch
                placeholder="Location"
                style={{ width: '100%' }}
                filterOption={(input, option) => {
                    var _a;
                    return ((_a = option?.label) ?? '')
                    .toLowerCase()
                    .includes(input.toLowerCase());
                }}
                options={[
                    { value: '1', label: 'Jack' },
                    { value: '2', label: 'Lucy' },
                    { value: '3', label: 'Tom' },
                ]}
                />
            </div>

            <div style={{ width: 350 }}>
                <Search
                placeholder="Search................................."
                onSearch={onSearch}
                enterButton
                style={{ width: '100%' }}
                />
            </div>

            <div style={{ width: 120 }}>
                <Select
                defaultValue="lucy"
                style={{ width: '100%' }}
                onChange={handleChange}
                options={[
                    { value: 'jack', label: 'Jack' },
                    { value: 'lucy', label: 'Lucy' },
                    { value: 'Yiminghe', label: 'yiminghe' },
                    { value: 'disabled', label: 'Disabled', disabled: true },
                ]}
                />
            </div>
        </div>
        
        <div className="p-4">
          <Layout style={layoutStyle}>
            <Sider width="26%" style={siderStyle}>
              <h2 className='text-left'>categories</h2>
              <Menu
                mode="inline"
                defaultSelectedKeys={['1']}
                defaultOpenKeys={['sub1']}
                style={{ height: '100%', borderRight: 0 }}
                items={items2}
              />
            </Sider>
            <Content style={{ padding: '16px', width: '100%', background: "white" }}>
                <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 w-full ">
                  <NavLink to={'/Buyer-shopdetail'} className="rounded text-black no-underline transition-shadow duration-300 hover:shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1)]">
                    <img src="/assets/BuyersImg/Products/Onion.png" alt="Onion" />
                    <div className="flex justify-between">
                      <div className="p-2">
                        <h5>Onions</h5>
                        <p className='text-green-500 text-lg'>Rs 20.00</p>
                      </div>
                      <div className="text-right">
                        <p className='mt-2'>Farm Name</p>
                        <p>Godawari-5-Lalitpur</p>
                      </div>
                    </div>
                  </NavLink>
                </div>
            </Content>
          </Layout>
          <Pagination align="center" defaultCurrent={1} total={50} style={{ marginTop: 16 }}/>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Shop;
