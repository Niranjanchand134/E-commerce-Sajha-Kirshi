import { Space, Table, Button, Tag } from "antd";
import { Link, NavLink } from "react-router-dom";
import { FormOutlined, DeleteOutlined, RightOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import { getProductByfarmer } from "../../../services/farmer/farmerApiService";
import axios from "axios";
import { useAuth } from "../../../Context/AuthContext";

const columns = [
  {
    title: "Sender",
    dataIndex: "sender",
    key: "sender",
    render: (text, record) => (
      <Space>
        <i className="fa-solid fa-user-circle text-2xl"></i>
        <span>
          {record.deliveryInfo?.fullName || record.sender || "Unknown"}
        </span>
      </Space>
    ),
  },
  {
    title: "Date",
    dataIndex: "date",
    key: "date",
    render: (text, record) => {
      // Format the date if it comes from API in different format
      const date = record.createdAt || record.date || record.orderDate;
      if (date) {
        return new Date(date).toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
        });
      }
      return "N/A";
    },
  },
  {
    title: "Status",
    dataIndex: "status",
    key: "status",
    render: (status, record) => {
      // Use orderStatus if status is not available
      const orderStatus = record.orderStatus || status || "Unknown";
      let backgroundColor;
      let textColor;

      if (orderStatus === "Success" || orderStatus === "DELIVERED") {
        backgroundColor = "#BDFFA6";
        textColor = "green";
      } else if (orderStatus === "Pending" || orderStatus === "PENDING") {
        backgroundColor = "#FCFFA6";
        textColor = "#785C01";
      } 
      else if (orderStatus === "Failed" || orderStatus === "CANCELLED") {
        backgroundColor = "#FFA6A6";
        textColor = "#780101";
      }
      else if (orderStatus === "CONFIRMED" || orderStatus === "COD") {
        backgroundColor = "#A6D8FF";
        textColor = "#005B8C";
      }
      else if (orderStatus === "DELIVERING") {
        backgroundColor = "#A6D8FF";
        textColor = "#005B8C";
      }
      else {
        backgroundColor = "#FFA6A6";
        textColor = "#780101";
      }

      return (
        <Button
          className="rounded-full"
          size="small"
          type="primary"
          style={{
            backgroundColor: backgroundColor,
            borderColor: backgroundColor,
            color: textColor,
          }}
        >
          {orderStatus}
        </Button>
      );
    },
  },
  {
    title: "Amount",
    dataIndex: "amount",
    key: "amount",
    render: (amount, record) => {
      const totalAmount = record.totalAmount || amount || record.price || 0;
      return <span>Rs. {totalAmount}</span>;
    },
  },
  {
    title: "Qty",
    dataIndex: "qty",
    key: "qty",
    render: (qty, record) => {
      // Calculate total quantity from items array
      let totalQuantity = 0;
      if (record.items && Array.isArray(record.items)) {
        totalQuantity = record.items.reduce((sum, item) => {
          return sum + (item.quantity || 0);
        }, 0);
      }
      return <span>{totalQuantity} kg</span>;
    },
  }
];

const FarmerDashboard = () => {
  const { user } = useAuth();

  const [productCount, setProductCount] = useState(0);
  const [orderCount, setOrderCount] = useState(0);
  const [pendingOrderCount, setPendingOrderCount] = useState(0);
  const [deliveredOrderCount, setDeliveredOrderCount] = useState(0);
  const [recentOrders, setRecentOrders] = useState([]);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/api/farmer/getProductCount/${user.id}`
        );
        console.log("Product count response:", response.data);
        // Assuming the API returns a number or an array
        const count =
          typeof response.data === "number"
            ? response.data
            : response.data.length;
        setProductCount(count);
      } catch (error) {
        console.error("Error fetching product count:", error);
        setProductCount(0);
      }
    };

    const fetchOrder = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/api/orders/getFarmerOrder/${user.id}`
        );
        console.log("Order response:", response.data);

        const orders = response.data || [];
        setOrderCount(orders.length);

        // Filter orders by status
        const pendingOrders = orders.filter(
          (order) =>
            order.orderStatus === "PENDING" || order.status === "Pending"
        );
        const deliveredOrders = orders.filter(
          (order) =>
            order.orderStatus === "DELIVERED" || order.status === "Success"
        );

        setPendingOrderCount(pendingOrders.length);
        setDeliveredOrderCount(deliveredOrders.length);

        // Get recent orders (last 5-10 orders)
        const sortedOrders = orders.sort((a, b) => {
          const dateA = new Date(a.createdAt || a.orderDate || a.date || 0);
          const dateB = new Date(b.createdAt || b.orderDate || b.date || 0);
          return dateB - dateA; // Sort descending (newest first)
        });

        setRecentOrders(sortedOrders.slice(0, 5)); // Show only 5 most recent orders
      } catch (error) {
        console.error("Error fetching orders:", error);
        setOrderCount(0);
        setPendingOrderCount(0);
        setDeliveredOrderCount(0);
        setRecentOrders([]);
      }
    };

    if (user?.id) {
      fetchOrder();
      fetchProduct();
    }
  }, [user?.id]);

  return (
    <>
      <div className="w-full bg-gray-50 p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-7xl mx-auto">
          <div className="bg-white rounded-lg shadow-md p-6 text-center flex flex-col items-center">
            <div className="flex items-center mb-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8 text-gray-500 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                />
              </svg>
              <h3 className="text-gray-500 text-sm font-medium uppercase">
                Active Product
              </h3>
            </div>
            <p className="text-3xl font-bold mt-2">{productCount}</p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 text-center flex flex-col items-center">
            <div className="flex items-center mb-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8 text-blue-500 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <h3 className="text-gray-500 text-sm font-medium uppercase">
                Total Orders
              </h3>
            </div>
            <p className="text-3xl font-bold mt-2">{orderCount}</p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 text-center flex flex-col items-center">
            <div className="flex items-center mb-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8 text-yellow-500 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <h3 className="text-gray-500 text-sm font-medium uppercase">
                Pending Orders
              </h3>
            </div>
            <p className="text-3xl font-bold mt-2">{pendingOrderCount}</p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 text-center flex flex-col items-center">
            <div className="flex items-center mb-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8 text-green-500 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <h3 className="text-gray-500 text-sm font-medium uppercase">
                Delivered Orders
              </h3>
            </div>
            <p className="text-3xl font-bold mt-2">{deliveredOrderCount}</p>
          </div>
        </div>
      </div>

      <div className="mt-4 rounded shadow p-4">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-1 h-6 bg-green-500 rounded"></div>
          <h1 className="text-2xl font-bold whitespace-nowrap">
            Recent Orders
          </h1>
        </div>

        <div className="overflow-x-auto">
          <Table
            columns={columns}
            dataSource={recentOrders.map((order, index) => ({
              ...order,
              key: order.id || index,
            }))}
            pagination={false}
            locale={{ emptyText: "No recent orders found" }}
          />
        </div>

        <div className="flex justify-end mt-2 mr-8">
          <Link to="orders" className="m-2 text-black">
            See more <RightOutlined />
          </Link>
        </div>
      </div>
    </>
  );
};

export default FarmerDashboard;
