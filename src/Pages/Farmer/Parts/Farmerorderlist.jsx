import { Space, Table, Button, Tag } from "antd";
import {
  Select,
  DatePicker,
  Typography,
  Input,
  Modal,
  Descriptions,
} from "antd";
import { useEffect, useState } from "react";
import { getOrderList } from "../../../services/farmer/farmerApiService";
// import { updateOrder } from "../../../services/farmer/farmerApiService"; // Import updateOrder API

const { RangePicker } = DatePicker;
const { Title } = Typography;

const Farmerorderlist = () => {
  const [orderViewModal, setOrderViewModal] = useState(false);
  const [orderDetails, setOrderDetails] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [filteredOrders, setFilteredOrders] = useState([]); // For filtered data
  const [searchStatus, setSearchStatus] = useState("ALL");
  const [dateRange, setDateRange] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const orderItems = (order) => [
    {
      key: "1",
      label: "Order ID",
      children: order?.id || "N/A",
    },
    {
      key: "2",
      label: "User Name",
      children: order?.deliveryInfo?.fullName || "N/A",
    },
    {
      key: "3",
      label: "Status",
      children: order?.orderStatus || "N/A",
    },
    {
      key: "4",
      label: "Order Date",
      children: order?.createdAt
        ? new Date(order.createdAt).toLocaleString()
        : "N/A",
    },
    {
      key: "5",
      label: "Address",
      children: order?.deliveryInfo
        ? `${order.deliveryInfo.streetAddress}, ${order.deliveryInfo.wardNumber}, ${order.deliveryInfo.municipality}, ${order.deliveryInfo.district}`
        : "N/A",
    },
    {
      key: "6",
      label: "Payment Method",
      children: order?.payment?.paymentMethod || "N/A",
    },
    {
      key: "7",
      label: "Payment Status",
      children: order?.payment?.paymentStatus || "N/A",
    },
    {
      key: "8",
      label: "Special Instructions",
      children: order?.specialInstructions || "None",
    },
    {
      key: "9",
      label: "Total Items",
      children: order?.items?.length || 0,
    },
    {
      key: "10",
      label: "Total Amount",
      children: `Rs. ${order?.totalAmount || 0}`,
    },
  ];

  const itemColumns = [
    {
      title: "Item Name",
      dataIndex: "productName", // Updated to match response
      key: "productName",
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      render: (price) => `Rs. ${price}`,
    },
    {
      title: "Quantity",
      dataIndex: "quantity",
      key: "quantity",
    },
    {
      title: "Subtotal",
      key: "subtotal",
      render: (_, record) => `Rs. ${record.price * record.quantity}`,
    },
  ];

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      align: "center",
    },
    {
      title: "User Details",
      dataIndex: ["deliveryInfo", "fullName"],
      align: "center",
    },
    {
      title: "Farmer ID",
      dataIndex: "farmerId",
      align: "center",
    },
    {
      title: "Total Price",
      dataIndex: "totalAmount",
      align: "center",
      render: (total) => `Rs. ${total}`,
    },
    {
      title: "Payment Status",
      dataIndex: ["payment", "paymentStatus"],
      align: "center",
      render: (status) => {
        let color =
          status === "COMPLETED"
            ? "green"
            : status === "PENDING"
            ? "orange"
            : "red";
        return (
          <Tag color={color} key={status}>
            {status.toUpperCase()}
          </Tag>
        );
      },
    },
    {
      title: "Order Status",
      dataIndex: "orderStatus",
      align: "center",
      render: (status) => {
        let color =
          status === "PENDING"
            ? "orange"
            : status === "COMPLETED"
            ? "green"
            : "red";
        return (
          <Tag color={color} key={status}>
            {status.toUpperCase()}
          </Tag>
        );
      },
    },
    {
      title: "Change Status",
      key: "status",
      align: "center",
      render: (_, record) => {
        const statusOptions = [
          { value: "PENDING", label: "Pending" },
          { value: "APPROVED", label: "Approved" },
          { value: "PROCESSING", label: "Processing" },
          { value: "COMPLETED", label: "Completed" },
          { value: "CANCELED", label: "Canceled", disabled: true },
        ];

        const handleStatusChange = async (value) => {
          try {
            await updateOrder(record.id, { status: value });
            setOrderDetails((prev) =>
              prev.map((order) =>
                order.id === record.id
                  ? { ...order, orderStatus: value }
                  : order
              )
            );
            if (selectedOrder?.id === record.id) {
              setSelectedOrder({ ...selectedOrder, orderStatus: value });
            }
            console.log(`Updated status for order ${record.id} to ${value}`);
          } catch (error) {
            console.error("Failed to update status:", error);
            alert("Failed to update order status.");
          }
        };

        return (
          <Select
            defaultValue={record.orderStatus}
            style={{ width: 120 }}
            onChange={handleStatusChange}
            options={statusOptions}
          />
        );
      },
    },
    {
      title: "Action",
      key: "action",
      align: "center",
      render: (_, record) => (
        <Space size="middle" className="action-buttons">
          <Button
            type="primary"
            onClick={() => showModal(record)}
            className="view-button"
            style={{ background: "#1890ff", borderColor: "#1890ff" }}
          >
            View Details
          </Button>
        </Space>
      ),
    },
  ];

  const showModal = (record) => {
    setSelectedOrder(record);
    setOrderViewModal(true);
  };

  const handleOk = () => {
    setOrderViewModal(false);
    setSelectedOrder(null);
  };

  const handleCancel = () => {
    setOrderViewModal(false);
    setSelectedOrder(null);
  };

  const handleSearch = () => {
    let filtered = orderDetails;

    // Filter by status
    if (searchStatus !== "ALL") {
      filtered = filtered.filter((order) => order.orderStatus === searchStatus);
    }

    // Filter by date range
    if (dateRange) {
      const [start, end] = dateRange;
      filtered = filtered.filter((order) => {
        const orderDate = new Date(order.createdAt);
        return (
          orderDate >= start.startOf("day").toDate() &&
          orderDate <= end.endOf("day").toDate()
        );
      });
    }

    // Filter by search term (user name or order ID)
    if (searchTerm) {
      filtered = filtered.filter(
        (order) =>
          order.id.toString().includes(searchTerm) ||
          order.deliveryInfo?.fullName
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase())
      );
    }

    setFilteredOrders(filtered);
  };

  const handleClear = () => {
    setSearchStatus("ALL");
    setDateRange(null);
    setSearchTerm("");
    setFilteredOrders(orderDetails);
  };

  useEffect(() => {
    getOrderList()
      .then((response) => {
        console.log("Order response:", response);
        const orders = Array.isArray(response) ? response : [response];
        setOrderDetails(orders);
        setFilteredOrders(orders); // Initialize filtered orders
      })
      .catch((error) => {
        console.error("Error fetching orders:", error);
        setOrderDetails([]);
        setFilteredOrders([]);
      });
  }, []);

  return (
    <div>
      <div className="top-filter">
        <Title level={3}>All Order List</Title>
        <div
          className="filter-option"
          style={{
            marginBottom: "20px",
            padding: "20px",
            backgroundColor: "#f0f2f5",
            borderRadius: "8px",
            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
          }}
        >
          <Space size={20} style={{ width: "100%" }}>
            <Select
              showSearch
              defaultValue="ALL"
              placeholder="Select Status"
              style={{ width: 180 }}
              onChange={(value) => setSearchStatus(value)}
              filterOption={(input, option) =>
                (option?.label ?? "")
                  .toLowerCase()
                  .includes(input.toLowerCase())
              }
              options={[
                { value: "ALL", label: "All Orders" },
                { value: "PENDING", label: "Pending" },
                { value: "APPROVED", label: "Approved" },
                { value: "PROCESSING", label: "Processing" },
                { value: "COMPLETED", label: "Completed" },
                { value: "CANCELED", label: "Canceled" },
              ]}
            />

            <RangePicker
              style={{ width: 250 }}
              onChange={(dates) => setDateRange(dates)}
            />

            <Input
              placeholder="Search by Order ID or Name"
              style={{ width: 250 }}
              allowClear
              onChange={(e) => setSearchTerm(e.target.value)}
              onPressEnter={handleSearch}
            />

            <Space>
              <Button
                type="primary"
                onClick={handleSearch}
                style={{ background: "#1890ff", borderColor: "#1890ff" }}
              >
                Search
              </Button>
              <Button onClick={handleClear}>Clear Filters</Button>
            </Space>
          </Space>
        </div>
      </div>

      <Table
        columns={columns}
        dataSource={filteredOrders}
        bordered
        rowKey="id"
        style={{ boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)" }}
      />

      <Modal
        title="Order Details"
        open={orderViewModal}
        onOk={handleOk}
        onCancel={handleCancel}
        width={800}
        footer={[
          <Button key="back" onClick={handleCancel}>
            Close
          </Button>,
        ]}
      >
        <div>
          <Descriptions
            title="Order Details"
            items={orderItems(selectedOrder)}
            bordered
            column={2}
          />
          <div style={{ marginTop: 24 }}>
            <h3>Order Items</h3>
            <Table
              columns={itemColumns}
              dataSource={selectedOrder?.items || []}
              pagination={false}
              bordered
            />
            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                marginTop: 16,
                alignItems: "center",
                gap: 8,
              }}
            >
              <strong>Total:</strong>
              <span style={{ fontWeight: "bold", fontSize: "1.1em" }}>
                Rs. {selectedOrder?.totalAmount || 0}
              </span>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Farmerorderlist;
