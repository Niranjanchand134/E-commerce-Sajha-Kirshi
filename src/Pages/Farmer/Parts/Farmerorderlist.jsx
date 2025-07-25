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
import { filterOrders, getOrderList, updateOrder } from "../../../services/farmer/farmerApiService";

const { RangePicker } = DatePicker;
const { Title } = Typography;

const Farmerorderlist = () => {
  const [orderViewModal, setOrderViewModal] = useState(false);
  const [orderDetails, setOrderDetails] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [searchStatus, setSearchStatus] = useState("ALL");
  const [dateRange, setDateRange] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusChangeModal, setStatusChangeModal] = useState(false);
  const [pendingStatusChange, setPendingStatusChange] = useState({
    orderId: null,
    newStatus: null,
  });
  const [loading, setLoading] = useState(false);

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

  const showStatusChangeModal = (orderId, newStatus) => {
    setPendingStatusChange({ orderId, newStatus });
    setStatusChangeModal(true);
  };

  const handleStatusChangeConfirm = async () => {
    if (!pendingStatusChange.orderId || !pendingStatusChange.newStatus) {
      setStatusChangeModal(false);
      return;
    }

    try {
      const updatedOrder = await updateOrder(pendingStatusChange.orderId, {
        status: pendingStatusChange.newStatus,
      });

      // Update the order details state
      setOrderDetails((prev) =>
        prev.map((order) =>
          order.id === pendingStatusChange.orderId
            ? { ...order, orderStatus: updatedOrder.orderStatus }
            : order
        )
      );

      // Update the filtered orders state
      setFilteredOrders((prev) =>
        prev.map((order) =>
          order.id === pendingStatusChange.orderId
            ? { ...order, orderStatus: updatedOrder.orderStatus }
            : order
        )
      );

      // Update selected order if it's the one being changed
      if (selectedOrder?.id === pendingStatusChange.orderId) {
        setSelectedOrder({
          ...selectedOrder,
          orderStatus: updatedOrder.orderStatus,
        });
      }

      setStatusChangeModal(false);
      setPendingStatusChange({ orderId: null, newStatus: null });
    } catch (error) {
      console.error("Failed to update status:", error);
      alert(`Failed to update order status: ${error.message}`);
      setStatusChangeModal(false);
    }
  };

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
            : status === "DELIVERED"
            ? "green"
            : status === "CANCELLED"
            ? "red"
            : "blue"; // For CONFIRMED, PROCESSING, SHIPPED
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
          { value: "CONFIRMED", label: "Confirmed" },
          { value: "PROCESSING", label: "Processing" },
          { value: "SHIPPED", label: "Shipped" },
          { value: "DELIVERED", label: "Delivered" },
          { value: "CANCELLED", label: "Cancelled" },
        ];

        const handleStatusChange = (value) => {
          showStatusChangeModal(record.id, value);
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
          <Button
            type="primary"
            onClick={() => showModal(record)}
            className="view-button"
            style={{ background: "#1890ff", borderColor: "#1890ff" }}
          >
            Message
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

  // Add this function for filtering
  const handleSearch = async () => {
    setLoading(true);
    try {
      let params = {};

      if (searchStatus !== "ALL") {
        params.status = searchStatus;
      }

      if (dateRange) {
        params.startDate = dayjs(dateRange[0]).startOf("day").toISOString();
        params.endDate = dayjs(dateRange[1]).endOf("day").toISOString();
      }

      if (searchTerm) {
        params.search = searchTerm;
      }

      const response = await filterOrders(params);
      setFilteredOrders(response);
      message.success("Orders filtered successfully");
    } catch (error) {
      console.error("Error filtering orders:", error);
      message.error("Failed to filter orders");
    } finally {
      setLoading(false);
    }
  };

  const handleClear = async () => {
    setSearchStatus("ALL");
    setDateRange(null);
    setSearchTerm("");
    try {
      setLoading(true);
      const response = await getOrderList();
      setFilteredOrders(response);
      message.success("Filters cleared");
    } catch (error) {
      console.error("Error clearing filters:", error);
      message.error("Failed to clear filters");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getOrderList()
      .then((response) => {
        console.log("Order response:", response);
        const orders = Array.isArray(response) ? response : [response];
        setOrderDetails(orders);
        setFilteredOrders(orders);
      })
      .catch((error) => {
        console.error("Error fetching orders:", error);
        setOrderDetails([]);
        setFilteredOrders([]);
      });
  }, []);

  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="px-4 py-4">
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
              value={searchStatus}
              placeholder="Select Status"
              style={{ width: 180 }}
              onChange={(value) => setSearchStatus(value)}
              options={[
                { value: "ALL", label: "All Orders" },
                { value: "PENDING", label: "Pending" },
                { value: "CONFIRMED", label: "Confirmed" },
                { value: "PROCESSING", label: "Processing" },
                { value: "SHIPPED", label: "Shipped" },
                { value: "DELIVERED", label: "Delivered" },
                { value: "CANCELLED", label: "Cancelled" },
              ]}
            />

            <RangePicker
              style={{ width: 250 }}
              value={dateRange}
              onChange={(dates) => setDateRange(dates)}
            />

            <Input
              placeholder="Search by Order ID or Name"
              style={{ width: 250 }}
              value={searchTerm}
              allowClear
              onChange={(e) => setSearchTerm(e.target.value)}
              onPressEnter={handleSearch}
            />

            <Space>
              <Button
                type="primary"
                onClick={handleSearch}
                loading={loading}
                style={{ background: "#1890ff", borderColor: "#1890ff" }}
              >
                Search
              </Button>
              <Button onClick={handleClear} loading={loading}>
                Clear Filters
              </Button>
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
      {/* Status Change Confirmation Modal */}
      <Modal
        title="Confirm Status Change"
        open={statusChangeModal}
        onOk={handleStatusChangeConfirm}
        onCancel={() => setStatusChangeModal(false)}
        okText="Yes, Change Status"
        cancelText="Cancel"
        okButtonProps={{
          style: {
            backgroundColor: "#1890ff", // Primary color
            borderColor: "#1890ff",
            color: "white",
          },
        }}
      >
        <p>
          Are you sure you want to change the order status to{" "}
          {pendingStatusChange.newStatus}?
        </p>
      </Modal>
    </div>
  );
};

export default Farmerorderlist;
