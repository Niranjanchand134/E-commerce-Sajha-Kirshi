import { Space, Table, Button, Dropdown, Menu } from 'antd';
import { createStyles } from "antd-style";
import { FormOutlined, DeleteOutlined } from '@ant-design/icons';
import { useState, useEffect } from 'react';

const useStyle = createStyles(({ css, token }) => {
  const { antCls } = token;
  return {
    customTable: css`
      ${antCls}-table {
        ${antCls}-table-container {
          ${antCls}-table-body,
          ${antCls}-table-content {
            scrollbar-width: thin;
            scrollbar-color: #eaeaea transparent;
            scrollbar-gutter: stable;
          }
        }
      }
    `,
  };
});

const statusOptions = ['Pending', 'Success', 'Approved', 'Declined'];
const statusColors = {
  Pending: 'orange',
  Success: 'green',
  Approved: 'blue',
  Declined: 'red',
};

const StatusCell = ({ initialStatus }) => {
  const [status, setStatus] = useState(initialStatus);
  const handleMenuClick = ({ key }) => setStatus(key);
  const menu = (
    <Menu onClick={handleMenuClick}>
      {statusOptions.map(option => (
        <Menu.Item key={option}>{option}</Menu.Item>
      ))}
    </Menu>
  );
  return (
    <Dropdown overlay={menu} trigger={['click']}>
      <Button style={{ backgroundColor: statusColors[status], color: 'white', fontWeight: '600' }}>
        {status}
      </Button>
    </Dropdown>
  );
};

const sampleData = Array.from({ length: 10 }).map((_, i) => ({
  key: i,
  product: `Tomato ${i}`,
  image: 'https://source.washu.edu/app/uploads/2015/11/Tomato250-1.jpg',
  address: `London, Park Lane no. ${i}`,
  category: i % 2 === 0 ? 'Vegetables' : 'Fruits',
  price: Math.floor(Math.random() * 100) + 10,
  quantity: Math.floor(Math.random() * 50) + 1,
  lastUpdated: Date.now() - Math.floor(Math.random() * 1000000000),
  status: statusOptions[i % statusOptions.length],
}));

const FarmerProducts = () => {
  const { styles } = useStyle();

  const [categoryFilter, setCategoryFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredData, setFilteredData] = useState(sampleData);

  useEffect(() => {
    let data = sampleData;

    if (categoryFilter !== 'All') {
      data = data.filter(item => item.category === categoryFilter);
    }

    if (statusFilter !== 'All') {
      data = data.filter(item => item.status === statusFilter);
    }

    if (searchTerm.trim() !== '') {
      data = data.filter(item =>
        item.product.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredData(data);
  }, [categoryFilter, statusFilter, searchTerm]);

  const columns = [
    {
      title: 'Image',
      width: 100,
      dataIndex: 'image',
      key: 'image',
      fixed: 'left',
      render: (imageUrl) => (
        <img
          src={imageUrl}
          alt="product"
          style={{
            width: 60,
            height: 60,
            objectFit: 'cover',
            borderRadius: 4,
          }}
        />
      ),
    },
    {
      title: 'Product Name',
      width: 140,
      dataIndex: 'product',
      key: 'product',
      fixed: 'left',
    },
    {
      title: 'Category',
      dataIndex: 'category',
      key: 'category',
      width: 120,
      sorter: (a, b) => a.category.localeCompare(b.category),
    },
    {
      title: 'Price per Unit',
      dataIndex: 'price',
      key: 'price',
      width: 150,
      render: (price) => `Rs ${price.toFixed(2)} /kg`,
    },
    {
      title: 'Available Quantity',
      dataIndex: 'quantity',
      key: 'quantity',
      width: 160,
      render: (qty) => `${qty} kg`,
    },
    {
      title: 'Last Updated',
      dataIndex: 'lastUpdated',
      key: 'lastUpdated',
      width: 160,
      render: (timestamp) => new Date(timestamp).toLocaleString(),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 140,
      sorter: (a, b) => a.status.localeCompare(b.status),
      render: (status) => <StatusCell initialStatus={status} />,
    },
    {
      title: 'Action',
      key: 'operation',
      fixed: 'right',
      width: 100,
      render: () => (
        <Space>
          <Button type="link" icon={<FormOutlined />} />
          <Button type="link" icon={<DeleteOutlined />} danger />
        </Space>
      ),
    },
  ];

  return (
    <>
      <div className="flex items-center gap-4 ml-4 mb-4 bg-white flex-wrap">
        {/* Category Dropdown */}
        <div className="flex flex-col">
          <label className="text-sm font-medium text-gray-700 mb-2 ml-2">Category</label>
          <select
            className="border border-gray-300 rounded-full w-32 px-2 py-2 focus:outline-none"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            <option>All</option>
            <option>Vegetables</option>
            <option>Fruits</option>
          </select>
        </div>

        {/* Status Dropdown */}
        <div className="flex flex-col">
          <label className="text-sm font-medium text-gray-700 mb-2 ml-2">Status</label>
          <select
            className="border border-gray-300 w-32 rounded-full px-2 py-2 focus:outline-none"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option>All</option>
            {statusOptions.map((status, index) => (
              <option key={index}>{status}</option>
            ))}
          </select>
        </div>

        {/* Search Input */}
        <div className="flex flex-col flex-1 min-w-[200px]">
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Search product name..."
              className="border border-gray-300 rounded-full px-4 py-2 mt-4 w-80 focus:outline-none"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button className="bg-green-500 text-white px-6 py-2 mt-4 rounded-full hover:bg-green-600 transition duration-200">
              Search
            </button>
          </div>
        </div>
      </div>
      <hr/>
      <div>
        <Table
          className={styles.customTable}
          columns={columns}
          dataSource={filteredData}
          scroll={{ x: 'max-content', y: 56 * 5 }}
        />
      </div>

    </>
  );
};

export default FarmerProducts;
