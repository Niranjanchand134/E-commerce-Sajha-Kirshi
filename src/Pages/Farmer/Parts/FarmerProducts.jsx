// FarmerProducts.jsx
import { Space, Table, Button, Dropdown, Menu } from 'antd';
import { createStyles } from "antd-style";
import { FormOutlined, DeleteOutlined } from '@ant-design/icons';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllProduct } from '../../../services/authService';
import { categoryChanges, StatusChanges, updateProductById } from '../../../services/farmer/farmerApiService';

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

const statusOptions = ['Active', 'Pause', 'Inactive'];
const statusColors = {
  Active: 'green',
  Pause: 'orange',
  Inactive: 'red',
};

const StatusCell = ({ initialStatus, record, onStatusChange }) => {
  const [status, setStatus] = useState(initialStatus);
  const [loading, setLoading] = useState(false);

  const handleMenuClick = async ({ key }) => {
    try {
      setLoading(true);
      await updateProductById(record.id, { status: key });
      setStatus(key);
      onStatusChange(record.id, key);
    } catch (error) {
      console.error("Failed to update status:", error);
    } finally {
      setLoading(false);
    }
  };

  const menu = (
    <Menu onClick={handleMenuClick}>
      {statusOptions.map((option) => (
        <Menu.Item key={option} disabled={loading}>
          {option}
        </Menu.Item>
      ))}
    </Menu>
  );

  return (
    <Dropdown overlay={menu} trigger={["click"]} disabled={loading}>
      <Button
        style={{
          backgroundColor: statusColors[status],
          color: "white",
          fontWeight: "600",
          width: "100%",
        }}
        loading={loading}
      >
        {status}
      </Button>
    </Dropdown>
  );
};

const FarmerProducts = () => {
  const { styles } = useStyle();
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const productData = await getAllProduct();
        setFilteredData(productData);
        setError(null);
      } catch (err) {
        console.log("Error fetching products:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleCategoryChanges = async (e) => {
    const value = e.target.value;
    setCategoryFilter(value);
    try {
      const response = await categoryChanges(value);
      setFilteredData(response);
    } catch (error) {
      console.log("error .........");
    }
  };

  const handleStatusChanges = async (e) => {
    const value = e.target.value;
    setStatusFilter(value);
    try {
      const response = await StatusChanges(value);
      setFilteredData(response);
    } catch (error) {
      console.log("error .........");
    }
  };

  const columns = [
    {
      title: "Image",
      width: 100,
      dataIndex: "imagePaths",
      key: "image",
      fixed: "left",
      render: (imagePaths) => {
        const firstImage =
          Array.isArray(imagePaths) && imagePaths.length > 0
            ? imagePaths[0]
            : "https://via.placeholder.com/60x60?text=No+Image";

        return (
          <img
            src={firstImage}
            alt="product"
            style={{ width: 60, height: 60, objectFit: "cover", borderRadius: 4 }}
            onError={(e) => {
              e.target.src = "https://via.placeholder.com/60x60?text=No+Image";
            }}
          />
        );
      },
    },
    {
      title: "Product Name",
      width: 140,
      dataIndex: "name",
      key: "product",
      fixed: "left",
    },
    {
      title: "Category",
      dataIndex: "category",
      key: "category",
      width: 120,
      sorter: (a, b) => a.category.localeCompare(b.category),
    },
    {
      title: "Price per Unit",
      dataIndex: "price",
      key: "price",
      width: 150,
      render: (price) => `Rs ${price ? price.toFixed(2) : "0.00"} /kg`,
    },
    {
      title: "Available Quantity",
      dataIndex: "quantity",
      key: "quantity",
      width: 160,
      render: (qty) => `${qty || 0} kg`,
    },
    {
      title: "Last Updated",
      dataIndex: "lastUpdated",
      key: "lastUpdated",
      width: 160,
      render: (timestamp) => {
        if (!timestamp) return "N/A";
        return new Date(timestamp).toLocaleString();
      },
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: 140,
      sorter: (a, b) => a.status.localeCompare(b.status),
      render: (status, record) => (
        <StatusCell
          initialStatus={status}
          record={record}
          onStatusChange={(id, newStatus) => {
            setFilteredData((prev) =>
              prev.map((item) => (item.id === id ? { ...item, status: newStatus } : item))
            );
          }}
        />
      ),
    },
    {
      title: "Action",
      key: "operation",
      fixed: "right",
      width: 100,
      render: (_, record) => (
        <Space>
          <Button
            type="link"
            icon={<FormOutlined />}
            onClick={() => navigate(`/Farmerlayout/Farmereditproduct/${record.id}`, { state: { product: record } })}
          />
          <Button
            type="link"
            icon={<DeleteOutlined />}
            danger
            onClick={() => console.log("Delete:", record)}
          />
        </Space>
      ),
    },
  ];

  return (
    <>
      <div className="flex items-center gap-4 ml-4 mb-4 bg-white flex-wrap">
        {/* Category Filter */}
        <div className="flex flex-col">
          <label className="text-sm font-medium text-gray-700 mb-2 ml-2">Category</label>
          <select
            className="border border-gray-300 rounded-full w-32 px-2 py-2 focus:outline-none"
            value={categoryFilter}
            onChange={handleCategoryChanges}
          >
            <option>All</option>
            <option value="vegetables">Vegetables</option>
            <option value="fruits">Fruits</option>
            <option value="grains">Grains</option>
            <option value="dairy">Dairy</option>
            <option value="meat">Meat</option>
          </select>
        </div>

        {/* Status Filter */}
        <div className="flex flex-col">
          <label className="text-sm font-medium text-gray-700 mb-2 ml-2">Status</label>
          <select
            className="border border-gray-300 w-32 rounded-full px-2 py-2 focus:outline-none"
            value={statusFilter}
            onChange={handleStatusChanges}
          >
            <option>All</option>
            <option value="Active">Active</option>
            <option value="Pause">Pause</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>

        {/* Search */}
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

      <hr />

      <div>
        <Table
          className={styles.customTable}
          columns={columns}
          dataSource={filteredData}
          rowKey="id"
          scroll={{ x: "max-content", y: 56 * 5 }}
          loading={loading}
        />
      </div>
    </>
  );
};

export default FarmerProducts;
