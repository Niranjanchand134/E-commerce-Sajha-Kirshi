import Footer from "./Footer";
import Header from "./Header";
import { Layout,Input, Select, Menu, Pagination  } from 'antd';
import { AppstoreOutlined, MailOutlined, SettingOutlined } from '@ant-design/icons';

const { Sider, Content } = Layout;
const { Search } = Input;

const items = [
  {
    key: 'sub1',
    icon: <MailOutlined />,
    label: 'Navigation One',
    children: [
      {
        key: '1-1',
        label: 'Item 1',
        type: 'group',
        children: [
          { key: '1', label: 'Option 1' },
          { key: '2', label: 'Option 2' },
        ],
      },
      {
        key: '1-2',
        label: 'Item 2',
        type: 'group',
        children: [
          { key: '3', label: 'Option 3' },
          { key: '4', label: 'Option 4' },
        ],
      },
    ],
  },
  {
    key: 'sub2',
    icon: <AppstoreOutlined />,
    label: 'Navigation Two',
    children: [
      { key: '5', label: 'Option 5' },
      { key: '6', label: 'Option 6' },
      {
        key: 'sub3',
        label: 'Submenu',
        children: [
          { key: '7', label: 'Option 7' },
          { key: '8', label: 'Option 8' },
        ],
      },
    ],
  },
  {
    key: 'sub4',
    label: 'Navigation Three',
    icon: <SettingOutlined />,
    children: [
      { key: '9', label: 'Option 9' },
      { key: '10', label: 'Option 10' },
      { key: '11', label: 'Option 11' },
      { key: '12', label: 'Option 12' },
    ],
  },
];
const onClick = e => {
  console.log('click', e);
};


const handleChange = value => {
  console.log(`selected ${value}`);
};

const onSearch = (value, _e, info) =>
  console.log(info === null || info === void 0 ? void 0 : info.source, value);

const contentStyle = {
  textAlign: 'center',
  minHeight: 120,
  lineHeight: '120px',
  color: '#fff',
  backgroundColor: '#0958d9',
};

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
                placeholder="Select a person"
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
              <h2>categories</h2>
              <Menu onClick={onClick} style={{ width: 256 }} mode="vertical" items={items} />
            </Sider>
            <Content style={contentStyle}>Content</Content>
          </Layout>
          <Pagination align="center" defaultCurrent={1} total={50} style={{ marginTop: 16 }}/>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Shop;
