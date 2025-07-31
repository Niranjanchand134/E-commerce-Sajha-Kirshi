import React, { useEffect, useState } from "react";
import {
  Avatar,
  Button,
  Card,
  Col,
  Descriptions,
  Image,
  Input,
  Modal,
  Row,
  Select,
  Space,
  Table,
  Tabs,
  Tag,
  Typography,
} from "antd";
import { ClockAlert } from "lucide-react";
import { CheckCircleOutlined, UserOutlined } from "@ant-design/icons";
import axios from "axios";
import {
  ErrorMessageToast,
  SuccesfulMessageToast,
} from "../../../utils/Tostify.util";
import DetailsCards from "../../../components/DetailsCards";
import TabPane from "antd/es/tabs/TabPane";

const { Title } = Typography;

const SuperAdminHome = () => {
  const [farmerKycDetails, setFarmerKycDetails] = useState([]);
  const [buyerKycDetails, setBuyerKycDetails] = useState([]);
  const [farmerKycId, setFarmerKycId] = useState(null);
  const [buyerKycId, setBuyerKycId] = useState(null);
  const [modalShow, setModalShow] = useState(false);
  const [declineModal, setDeclineModal] = useState(false);
  const [kycViewModal, setKycViewModal] = useState(false);
  const [farmerKycModal, setFarmerKycModal] = useState(false);
  const [selectedKyc, setSelectedKyc] = useState(null);
  const [modalType, setModalType] = useState("");
  const [searchName, setSearchName] = useState("");
  const [statusFilter, setStatusFilter] = useState("PENDING");

  // Set JWT token for all axios requests
  // axios.defaults.headers.common[
  //   "Authorization"
  // ] = `Bearer ${localStorage.getItem("token")}`;

  const fetchPendingKyc = async () => {
    try {
      const farmerResponse = await axios.get(
        "http://localhost:8080/api/admin/farmer-kyc/pending"
      );
      const buyerResponse = await axios.get(
        "http://localhost:8080/api/admin/buyer-kyc/pending"
      );
      console.log("here is the admin farmer response", farmerResponse.data);
      console.log("here is the admin Buyer response", buyerResponse.data);

      setFarmerKycDetails(farmerResponse.data);
      setBuyerKycDetails(buyerResponse.data);
    } catch (error) {
      ErrorMessageToast("Failed to fetch KYC details!");
    }
  };

  const handleView = async (record, type) => {
    try {
      if (type === "farmer") {
        const response = await axios.get(
          `http://localhost:8080/api/farmer/getFarmerKYCDetails/${record}`
        );
        setSelectedKyc(response.data);
        setFarmerKycId(record.id); // Set ID for approve/decline
        setModalType("farmer");
        setFarmerKycModal(true);
      } else {
        const response = await axios.get(
          `http://localhost:8080/api/admin/buyer-kyc/${record.id}`
        );
        setSelectedKyc(response.data);
        setBuyerKycId(record.id); // Set ID for approve/decline
        setModalType("buyer");
        setKycViewModal(true);
      }
    } catch (error) {
      ErrorMessageToast(
        error.response?.status === 404
          ? "KYC record not found!"
          : "Failed to fetch KYC details!"
      );
    }
  };

  const handleSearch = async (type) => {
    try {
      if (type === "farmer") {
        const response = await axios.get(
          `http://localhost:8080/api/admin/farmer-kyc/search?name=${searchName}&status=${statusFilter}`
        );
        setFarmerKycDetails(response.data);
      } else {
        const response = await axios.get(
          `http://localhost:8080/api/admin/buyer-kyc/search?name=${searchName}&status=${statusFilter}`
        );
        setBuyerKycDetails(response.data);
      }
    } catch (error) {
      ErrorMessageToast("Search failed!");
    }
  };

  const handleRequestApprove = (record, type) => {
    if (type === "farmer") {
      setFarmerKycId(record.id);
    } else {
      setBuyerKycId(record.id);
    }
    setModalType(type);
    setModalShow(true);
  };

  const handleDeclineRequest = (record, type) => {
    if (type === "farmer") {
      setFarmerKycId(record.id);
    } else {
      setBuyerKycId(record.id);
    }
    setModalType(type);
    setDeclineModal(true);
  };

  const handleApprove = async () => {
    try {
      if (modalType === "farmer") {
        await axios.put(
          `http://localhost:8080/api/admin/farmer-kyc/${farmerKycId}/approve`
        );
        SuccesfulMessageToast("Farmer KYC Approved");
      } else {
        await axios.put(
          `http://localhost:8080/api/admin/buyer-kyc/${buyerKycId}/approve`
        );
        SuccesfulMessageToast("Buyer KYC Approved");
      }
      fetchPendingKyc();
      setModalShow(false);
      setKycViewModal(false); // Close view modal after approve
    } catch (error) {
      ErrorMessageToast("Approval failed!");
    }
  };

  const handleDecline = async () => {
    try {
      if (modalType === "farmer") {
        await axios.put(
          `http://localhost:8080/api/admin/farmer-kyc/${farmerKycId}/decline`
        );
        SuccesfulMessageToast("Farmer KYC Declined");
      } else {
        await axios.put(
          `http://localhost:8080/api/admin/buyer-kyc/${buyerKycId}/decline`
        );
        SuccesfulMessageToast("Buyer KYC Declined");
      }
      fetchPendingKyc();
      setDeclineModal(false);
      setKycViewModal(false); // Close view modal after decline
    } catch (error) {
      ErrorMessageToast("Decline failed!");
    }
  };

  const handleCancel = () => {
    setModalShow(false);
    setDeclineModal(false);
    setKycViewModal(false);
    setFarmerKycModal(false)
    setSelectedKyc(null);
    setFarmerKycId(null);
    setBuyerKycId(null);
  };

  useEffect(() => {
    fetchPendingKyc();
  }, []);

  const farmerColumns = [
    {
      title: "ID",
      dataIndex: "id",
      align: "center",
    },
    {
      title: "Farmer Name",
      dataIndex: "userName",
      align: "center",
    },
    {
      title: "Location",
      dataIndex: "district",
      align: "center",
    },
    {
      title: "Email",
      dataIndex: "userEmail",
      align: "center",
    },
    {
      title: "Status",
      dataIndex: "kycStatus",
      align: "center",
      render: (status) => {
        const normalizedStatus = status?.toUpperCase();
        return (
          <Tag
            color={
              normalizedStatus === "APPROVED"
                ? "green"
                : normalizedStatus === "PENDING"
                ? "orange"
                : "red"
            }
          >
            {status}
          </Tag>
        );
      },
    },
    {
      title: "Action",
      key: "action",
      align: "center",
      render: (_, record) => {
        // Normalize status for consistent comparison
        const normalizedStatus = record.kycStatus?.toUpperCase();
        console.log(
          "Farmer record status:",
          record.kycStatus,
          "Normalized:",
          normalizedStatus
        );

        return (
          <Space size="middle">
            <Button
              type="primary"
              onClick={() => handleView(record.userId, "farmer")}
              style={{ background: "#1890ff", borderColor: "#1890ff" }}
            >
              View
            </Button>

            {/* Only show Approve button if status is not Approved */}
            {normalizedStatus !== "APPROVED" && (
              <Button
                type="primary"
                onClick={() => handleRequestApprove(record, "farmer")}
                style={{ background: "#52c41a", borderColor: "#52c41a" }}
                disabled={normalizedStatus === "REJECTED"}
              >
                Approve
              </Button>
            )}

            {/* Only show Decline button if status is not Rejected */}
            {normalizedStatus !== "REJECTED" && (
              <Button
                danger
                onClick={() => handleDeclineRequest(record, "farmer")}
                disabled={normalizedStatus === "APPROVED"}
              >
                Decline
              </Button>
            )}
          </Space>
        );
      },
    },
  ];

  const buyerColumns = [
    {
      title: "ID",
      dataIndex: "id",
      align: "center",
    },
    {
      title: "Buyer Name",
      dataIndex: "fullName",
      align: "center",
    },
    {
      title: "Location",
      dataIndex: "district",
      align: "center",
    },
    {
      title: "Email",
      dataIndex: "email",
      align: "center",
    },
    {
      title: "Status",
      dataIndex: "kycStatus",
      align: "center",
      render: (status) => {
        const normalizedStatus = status?.toUpperCase();
        return (
          <Tag
            color={
              normalizedStatus === "APPROVED"
                ? "green"
                : normalizedStatus === "PENDING"
                ? "orange"
                : "red"
            }
          >
            {status}
          </Tag>
        );
      },
    },
    {
      title: "Action",
      key: "action",
      align: "center",
      render: (_, record) => {
        // Normalize status for consistent comparison
        const normalizedStatus = record.kycStatus?.toUpperCase();
        console.log(
          "Buyer record status:",
          record.kycStatus,
          "Normalized:",
          normalizedStatus
        );

        return (
          <Space size="middle">
            <Button
              type="primary"
              onClick={() => handleView(record, "buyer")}
              style={{ background: "#1890ff", borderColor: "#1890ff" }}
            >
              View
            </Button>

            {/* Only show Approve button if status is not APPROVED */}
            {normalizedStatus !== "APPROVED" && (
              <Button
                type="primary"
                onClick={() => handleRequestApprove(record, "buyer")}
                style={{ background: "#52c41a", borderColor: "#52c41a" }}
                disabled={normalizedStatus === "REJECTED"}
              >
                Approve
              </Button>
            )}

            {/* Only show Decline button if status is not REJECTED */}
            {normalizedStatus !== "REJECTED" && (
              <Button
                danger
                onClick={() => handleDeclineRequest(record, "buyer")}
                disabled={normalizedStatus === "APPROVED"}
              >
                Decline
              </Button>
            )}
          </Space>
        );
      },
    },
  ];

  return (
    <div className="mt-5">
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <div
          style={{
            display: "flex",
            overflowX: "auto",
            width: "100%",
            gap: 16,
            padding: "8px 8px 16px 8px", // Added padding to prevent cutting
            alignItems: "stretch", // Ensures all cards have equal height
          }}
        >
          {/* Pending Farmer KYC Card */}
          <Col flex="1 1 300px" style={{ display: "flex" }}>
            <DetailsCards
              icon={
                <div
                  style={{
                    backgroundColor: "rgba(46, 125, 50, 0.1)",
                    borderRadius: "50%",
                    width: 48,
                    height: 48,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <ClockAlert style={{ color: "#2e7d32", fontSize: 24 }} />
                </div>
              }
              title="Pending Farmer KYC"
              value={farmerKycDetails.length}
              trend="up"
              style={{
                background: "linear-gradient(135deg, #f5f5f5 0%, #ffffff 100%)",
                boxShadow: "0 1px 4px rgba(0,0,0,0.08)", // Softer shadow
                borderRadius: 12,
                width: "100%",
                padding: 16,
              }}
            />
          </Col>

          {/* Pending Buyer KYC Card */}
          <Col flex="1 1 300px" style={{ display: "flex" }}>
            <DetailsCards
              icon={
                <div
                  style={{
                    backgroundColor: "rgba(30, 136, 229, 0.1)",
                    borderRadius: "50%",
                    width: 48,
                    height: 48,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <ClockAlert style={{ color: "#1e88e5", fontSize: 24 }} />
                </div>
              }
              title="Pending Buyer KYC"
              value={buyerKycDetails.length}
              trend="down"
              style={{
                background: "linear-gradient(135deg, #f5f5f5 0%, #ffffff 100%)",
                boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
                borderRadius: 12,
                width: "100%",
                padding: 16,
              }}
            />
          </Col>

          {/* Total Users Card */}
          <Col flex="1 1 300px" style={{ display: "flex" }}>
            <DetailsCards
              icon={
                <div
                  style={{
                    backgroundColor: "rgba(156, 39, 176, 0.1)",
                    borderRadius: "50%",
                    width: 48,
                    height: 48,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <UserOutlined style={{ color: "#9c27b0", fontSize: 24 }} />
                </div>
              }
              title="Total Register Users"
              value="3,474"
              style={{
                background: "linear-gradient(135deg, #f5f5f5 0%, #ffffff 100%)",
                boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
                borderRadius: 12,
                width: "100%",
                padding: 16,
              }}
            />
          </Col>

          {/* Approved KYCs Card */}
          <Col flex="1 1 300px" style={{ display: "flex" }}>
            <DetailsCards
              icon={
                <div
                  style={{
                    backgroundColor: "rgba(67, 160, 71, 0.1)",
                    borderRadius: "50%",
                    width: 48,
                    height: 48,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <CheckCircleOutlined
                    style={{ color: "#43a047", fontSize: 24 }}
                  />
                </div>
              }
              title="Total Approved KYCs"
              value="1,892"
              style={{
                background: "linear-gradient(135deg, #f5f5f5 0%, #ffffff 100%)",
                boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
                borderRadius: 12,
                width: "100%",
                padding: 16,
              }}
            />
          </Col>
        </div>
      </Row>
      <div>
        <div className="top-filter mt-10">
          <Title level={3}>Pending Farmer KYC Requests</Title>
          <div className="filter-option" style={{ marginBottom: "20px" }}>
            <Space size={20}>
              <Select
                defaultValue="PENDING"
                onChange={(value) => setStatusFilter(value)}
                style={{ width: "25vh" }}
                options={[
                  { value: "PENDING", label: "Pending" },
                  { value: "APPROVED", label: "Approved" },
                  { value: "DECLINED", label: "Declined" },
                ]}
              />
              <Input
                placeholder="Search by Farmer Name"
                value={searchName}
                onChange={(e) => setSearchName(e.target.value)}
              />
              <Button
                type="primary"
                onClick={() => handleSearch("farmer")}
                style={{ background: "#1890ff", borderColor: "#1890ff" }}
              >
                Search
              </Button>
            </Space>
          </div>
        </div>
        <Table columns={farmerColumns} dataSource={farmerKycDetails} bordered />
      </div>
      <div>
        <div className="top-filter mt-10">
          <Title level={3}>Pending Buyer KYC Requests</Title>
          <div className="filter-option" style={{ marginBottom: "20px" }}>
            <Space size={20}>
              <Select
                defaultValue="PENDING"
                onChange={(value) => setStatusFilter(value)}
                style={{ width: "25vh" }}
                options={[
                  { value: "PENDING", label: "Pending" },
                  { value: "APPROVED", label: "Approved" },
                  { value: "DECLINED", label: "Declined" },
                ]}
              />
              <Input
                placeholder="Search by Buyer Name"
                value={searchName}
                onChange={(e) => setSearchName(e.target.value)}
              />
              <Button
                type="primary"
                onClick={() => handleSearch("buyer")}
                style={{ background: "#1890ff", borderColor: "#1890ff" }}
              >
                Search
              </Button>
            </Space>
          </div>
        </div>
        <Table columns={buyerColumns} dataSource={buyerKycDetails} bordered />
      </div>
      <Modal
        title={`Are you sure you want to Approve ${
          modalType === "farmer" ? "Farmer" : "Buyer"
        } KYC?`}
        open={modalShow}
        onOk={handleApprove}
        onCancel={handleCancel}
        okText="Approve"
        cancelText="Cancel"
        okButtonProps={{
          style: { backgroundColor: "#52c41a", borderColor: "#52c41a" },
        }}
      />
      <Modal
        title={`Are you sure you want to Decline ${
          modalType === "farmer" ? "Farmer" : "Buyer"
        } KYC?`}
        open={declineModal}
        onOk={handleDecline}
        onCancel={handleCancel}
        okText="Decline"
        cancelText="Cancel"
        okButtonProps={{
          danger: true,
        }}
      />
      <Modal
        title={`Farmer KYC Details - ${selectedKyc?.userName || ""}`}
        open={farmerKycModal}
        onCancel={handleCancel}
        footer={[
          <Button key="cancel" onClick={handleCancel}>
            Close
          </Button>,
          <Button
            key="approve"
            type="primary"
            onClick={handleApprove}
            style={{ background: "#52c41a", borderColor: "#52c41a" }}
            disabled={selectedKyc?.kycStatus !== "Pending"}
          >
            Approve
          </Button>,
          <Button
            key="decline"
            danger
            onClick={handleDecline}
            disabled={selectedKyc?.kycStatus !== "Pending"}
          >
            Decline
          </Button>,
        ]}
        width={900}
      >
        {selectedKyc && (
          <div className="kyc-details-container">
            <div className="kyc-header">
              <Avatar
                size={64}
                src={selectedKyc.profileImagePath}
                icon={<UserOutlined />}
              />
              <div className="kyc-title">
                <h3>{selectedKyc.farmName}</h3>
                <Tag
                  color={
                    selectedKyc.kycStatus === "Pending"
                      ? "orange"
                      : selectedKyc.kycStatus === "Approved"
                      ? "green"
                      : "red"
                  }
                >
                  {selectedKyc.kycStatus}
                </Tag>
                {selectedKyc.verified && (
                  <Tag color="blue" icon={<CheckCircleOutlined />}>
                    Verified
                  </Tag>
                )}
              </div>
            </div>

            <Tabs defaultActiveKey="1">
              <TabPane tab="Personal Information" key="1">
                <Descriptions bordered column={2}>
                  <Descriptions.Item label="Full Name">
                    {selectedKyc.userName}
                  </Descriptions.Item>
                  <Descriptions.Item label="Date of Birth">
                    {selectedKyc.dateOfBirth}
                  </Descriptions.Item>
                  <Descriptions.Item label="Gender">
                    {selectedKyc.gender}
                  </Descriptions.Item>
                  <Descriptions.Item label="Email">
                    {selectedKyc.userEmail}
                  </Descriptions.Item>
                  <Descriptions.Item label="Citizenship Number" span={2}>
                    {selectedKyc.citizenshipNumber}
                    {selectedKyc.citizenshipIssuedDistrict && (
                      <span>
                        {" "}
                        (Issued: {selectedKyc.citizenshipIssuedDistrict})
                      </span>
                    )}
                  </Descriptions.Item>
                  <Descriptions.Item label="Address" span={2}>
                    {selectedKyc.permanentAddress}
                    {selectedKyc.tole && <span>, {selectedKyc.tole}</span>}
                    {selectedKyc.wardNumber && (
                      <span>, Ward {selectedKyc.wardNumber}</span>
                    )}
                    <br />
                    {selectedKyc.municipality}, {selectedKyc.district},{" "}
                    {selectedKyc.province}
                  </Descriptions.Item>
                  <Descriptions.Item label="Years of Experience">
                    {selectedKyc.yearsOfExperience} years
                  </Descriptions.Item>
                </Descriptions>

                {/* Document Images - Only show if available */}
                {(selectedKyc.citizenshipFrontImagePath ||
                  selectedKyc.citizenshipBackImagePath ||
                  selectedKyc.panCardImagePath) && (
                  <div className="document-images">
                    <h4>Documents:</h4>
                    <Image.PreviewGroup>
                      {selectedKyc.citizenshipFrontImagePath && (
                        <Image
                          width={200}
                          src={selectedKyc.citizenshipFrontImagePath}
                          alt="Citizenship Front"
                        />
                      )}
                      {selectedKyc.citizenshipBackImagePath && (
                        <Image
                          width={200}
                          src={selectedKyc.citizenshipBackImagePath}
                          alt="Citizenship Back"
                        />
                      )}
                      {selectedKyc.panCardImagePath && (
                        <Image
                          width={200}
                          src={selectedKyc.panCardImagePath}
                          alt="PAN Card"
                        />
                      )}
                    </Image.PreviewGroup>
                  </div>
                )}
              </TabPane>

              <TabPane tab="Farm Details" key="2">
                <Descriptions bordered column={2}>
                  <Descriptions.Item label="Farm Name">
                    {selectedKyc.farmName}
                  </Descriptions.Item>
                  <Descriptions.Item label="Farming Type">
                    {selectedKyc.farmingType}
                  </Descriptions.Item>
                  <Descriptions.Item label="Farm Size">
                    {selectedKyc.farmSize} {selectedKyc.farmSizeUnit}
                  </Descriptions.Item>
                  <Descriptions.Item label="Years of Experience">
                    {selectedKyc.yearsOfExperience} years
                  </Descriptions.Item>
                  <Descriptions.Item label="Primary Crops" span={2}>
                    {selectedKyc.primaryCrops}
                  </Descriptions.Item>
                  <Descriptions.Item
                    label="Annual Production Capacity"
                    span={2}
                  >
                    {selectedKyc.annualProductionCapacity}
                  </Descriptions.Item>
                </Descriptions>

                {/* Certifications Image */}
                {selectedKyc.certifications && (
                  <div className="certification-section">
                    <h4>Certifications:</h4>
                    <Image
                      width={300}
                      src={selectedKyc.certifications}
                      alt="Certifications"
                      className="certification-image"
                    />
                  </div>
                )}
              </TabPane>

              <TabPane tab="Payment Details" key="3">
                <Descriptions bordered column={2}>
                  <Descriptions.Item label="eSewa ID">
                    {selectedKyc.esewaId || "N/A"}
                  </Descriptions.Item>
                  <Descriptions.Item label="Bank Details">
                    {selectedKyc.bankName || "N/A"}
                  </Descriptions.Item>
                </Descriptions>

                {/* eSewa QR Code */}
                {selectedKyc.esewaQrImagePath && (
                  <div className="payment-qr-section">
                    <h4>eSewa QR Code:</h4>
                    <Image
                      width={200}
                      src={selectedKyc.esewaQrImagePath}
                      alt="eSewa QR Code"
                      className="qr-image"
                    />
                  </div>
                )}
              </TabPane>

              {/* Show rejection reason if status is rejected */}
              {selectedKyc.kycStatus === "Rejected" &&
                selectedKyc.rejectionReason && (
                  <TabPane tab="Rejection Details" key="4">
                    <div className="rejection-section">
                      <Alert
                        message="KYC Rejected"
                        description={selectedKyc.rejectionReason}
                        type="error"
                        showIcon
                      />
                    </div>
                  </TabPane>
                )}
            </Tabs>

            <style jsx>{`
              .kyc-details-container {
                padding: 10px;
              }
              .kyc-header {
                display: flex;
                align-items: center;
                margin-bottom: 20px;
                gap: 16px;
              }
              .kyc-title {
                flex: 1;
              }
              .kyc-title h3 {
                margin: 0;
                margin-bottom: 8px;
              }
              .document-images {
                margin-top: 20px;
              }
              .document-images h4 {
                margin-bottom: 10px;
                color: #1890ff;
              }
              .document-images .ant-image {
                margin-right: 10px;
                margin-bottom: 10px;
              }
              .certification-section {
                margin-top: 20px;
              }
              .certification-section h4 {
                margin-bottom: 10px;
                color: #1890ff;
              }
              .certification-image {
                border: 1px solid #d9d9d9;
                border-radius: 6px;
              }
              .payment-qr-section {
                margin-top: 20px;
              }
              .payment-qr-section h4 {
                margin-bottom: 10px;
                color: #1890ff;
              }
              .qr-image {
                border: 1px solid #d9d9d9;
                border-radius: 6px;
              }
              .rejection-section {
                padding: 20px 0;
              }
            `}</style>
          </div>
        )}
      </Modal>
      <Modal
        title={`Buyer KYC Details - ${selectedKyc?.fullName || ""}`}
        open={kycViewModal}
        onCancel={handleCancel}
        footer={[
          <Button key="cancel" onClick={handleCancel}>
            Close
          </Button>,
          <Button
            key="approve"
            type="primary"
            onClick={handleApprove}
            style={{ background: "#52c41a", borderColor: "#52c41a" }}
            disabled={selectedKyc?.kycStatus !== "PENDING"}
          >
            Approve
          </Button>,
          <Button
            key="decline"
            danger
            onClick={handleDecline}
            disabled={selectedKyc?.kycStatus !== "PENDING"}
          >
            Decline
          </Button>,
        ]}
        width={900}
      >
        {selectedKyc && (
          <div className="kyc-details-container">
            <div className="kyc-header">
              <Avatar
                size={64}
                src={selectedKyc.profilePhotoPath}
                icon={<UserOutlined />}
              />
              <div className="kyc-title">
                <h3>{selectedKyc.fullName}</h3>
                <Tag
                  color={
                    selectedKyc.kycStatus === "PENDING"
                      ? "orange"
                      : selectedKyc.kycStatus === "APPROVED"
                      ? "green"
                      : "red"
                  }
                >
                  {selectedKyc.kycStatus}
                </Tag>
                {selectedKyc.verified && (
                  <Tag color="blue" icon={<CheckCircleOutlined />}>
                    Verified
                  </Tag>
                )}
              </div>
            </div>

            <Tabs defaultActiveKey="1">
              <TabPane tab="Personal Information" key="1">
                <Descriptions bordered column={2}>
                  <Descriptions.Item label="Full Name">
                    {selectedKyc.fullName}
                  </Descriptions.Item>
                  <Descriptions.Item label="Date of Birth">
                    {selectedKyc.dateOfBirth}
                  </Descriptions.Item>
                  <Descriptions.Item label="Gender">
                    {selectedKyc.gender}
                  </Descriptions.Item>
                  <Descriptions.Item label="Email">
                    {selectedKyc.email}
                  </Descriptions.Item>
                  <Descriptions.Item label="Phone Number">
                    {selectedKyc.phoneNumber}
                  </Descriptions.Item>
                  <Descriptions.Item label="Citizenship Number">
                    {selectedKyc.citizenshipNumber}
                  </Descriptions.Item>
                  <Descriptions.Item label="PAN Number">
                    {selectedKyc.panNumber || "N/A"}
                  </Descriptions.Item>
                  <Descriptions.Item label="User ID">
                    {selectedKyc.userId}
                  </Descriptions.Item>
                  <Descriptions.Item label="Address" span={2}>
                    {selectedKyc.streetAddress}
                    {selectedKyc.landmark && (
                      <span>, {selectedKyc.landmark}</span>
                    )}
                    <br />
                    Ward {selectedKyc.ward}, {selectedKyc.municipality}
                    <br />
                    {selectedKyc.district}, {selectedKyc.province}
                  </Descriptions.Item>
                  <Descriptions.Item label="Verification Status" span={2}>
                    {selectedKyc.verified ? (
                      <Tag color="green" icon={<CheckCircleOutlined />}>
                        Verified
                      </Tag>
                    ) : (
                      <Tag color="orange">Not Verified</Tag>
                    )}
                  </Descriptions.Item>
                </Descriptions>

                {/* Document Images */}
                <div className="document-images" style={{ marginTop: 20 }}>
                  <h4>Identity Documents</h4>
                  <Row gutter={16}>
                    {/* Profile Photo */}
                    <Col span={8}>
                      <Card
                        title="Profile Photo"
                        size="small"
                        cover={
                          selectedKyc.profilePhotoPath ? (
                            <Image
                              width="100%"
                              height={200}
                              style={{ objectFit: "cover" }}
                              src={selectedKyc.profilePhotoPath}
                              alt="Profile Photo"
                            />
                          ) : (
                            <div
                              style={{
                                height: 200,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                background: "#f5f5f5",
                              }}
                            >
                              <UserOutlined
                                style={{ fontSize: 48, color: "#bfbfbf" }}
                              />
                            </div>
                          )
                        }
                      />
                    </Col>

                    {/* Business Registration Document */}
                    <Col span={8}>
                      <Card
                        title="Business Registration"
                        size="small"
                        cover={
                          selectedKyc.businessRegistrationImagePath ? (
                            <Image
                              width="100%"
                              height={200}
                              style={{ objectFit: "cover" }}
                              src={selectedKyc.businessRegistrationImagePath}
                              alt="Business Registration"
                            />
                          ) : (
                            <div
                              style={{
                                height: 200,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                background: "#f5f5f5",
                                color: "#bfbfbf",
                              }}
                            >
                              No Document
                            </div>
                          )
                        }
                      />
                    </Col>
                  </Row>
                </div>
              </TabPane>

              <TabPane tab="KYC Status" key="2">
                <Descriptions bordered column={2}>
                  <Descriptions.Item label="KYC ID">
                    {selectedKyc.id}
                  </Descriptions.Item>
                  <Descriptions.Item label="Current Status">
                    <Tag
                      color={
                        selectedKyc.kycStatus === "PENDING"
                          ? "orange"
                          : selectedKyc.kycStatus === "APPROVED"
                          ? "green"
                          : "red"
                      }
                    >
                      {selectedKyc.kycStatus}
                    </Tag>
                  </Descriptions.Item>
                  <Descriptions.Item label="Profile Verified">
                    {selectedKyc.verified ? (
                      <Tag color="green" icon={<CheckCircleOutlined />}>
                        Yes
                      </Tag>
                    ) : (
                      <Tag color="red">No</Tag>
                    )}
                  </Descriptions.Item>
                  <Descriptions.Item label="Application Date">
                    {/* You can format this date if you have createdAt field */}
                    {new Date().toLocaleDateString()}
                  </Descriptions.Item>
                </Descriptions>

                {/* Show rejection reason if status is rejected */}
                {selectedKyc.kycStatus === "REJECTED" &&
                  selectedKyc.rejectionReason && (
                    <div style={{ marginTop: 20 }}>
                      <Alert
                        message="KYC Rejected"
                        description={selectedKyc.rejectionReason}
                        type="error"
                        showIcon
                      />
                    </div>
                  )}
              </TabPane>
            </Tabs>

            <style jsx>{`
              .kyc-details-container {
                padding: 10px;
              }
              .kyc-header {
                display: flex;
                align-items: center;
                margin-bottom: 20px;
                gap: 16px;
              }
              .kyc-title {
                flex: 1;
              }
              .kyc-title h3 {
                margin: 0;
                margin-bottom: 8px;
              }
              .document-images {
                margin-top: 20px;
              }
              .document-images h4 {
                margin-bottom: 16px;
                color: #1890ff;
                font-weight: 600;
              }
            `}</style>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default SuperAdminHome;
