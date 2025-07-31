import React, { useEffect, useState } from "react";
import {
  Avatar,
  Button,
  Input,
  Modal,
  Select,
  Space,
  Table,
  Tag,
  Typography,
  Descriptions,
  Image,
  Tabs,
  Alert,
} from "antd";
import { CheckCircleOutlined, UserOutlined } from "@ant-design/icons";
import axios from "axios";
import {
  ErrorMessageToast,
  SuccesfulMessageToast,
} from "../../../utils/Tostify.util";

const { Title } = Typography;
const { TabPane } = Tabs;

const SuperAdminFarmer = () => {
  const [farmerKycDetails, setFarmerKycDetails] = useState([]);
  const [farmerKycId, setFarmerKycId] = useState(null);
  const [modalShow, setModalShow] = useState(false);
  const [declineModal, setDeclineModal] = useState(false);
  const [farmerKycModal, setFarmerKycModal] = useState(false);
  const [selectedKyc, setSelectedKyc] = useState(null);
  const [searchName, setSearchName] = useState("");
  const [statusFilter, setStatusFilter] = useState("PENDING");

  const fetchPendingKyc = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8080/api/admin/farmer-kyc/pending"
      );
      setFarmerKycDetails(response.data);
    } catch (error) {
      ErrorMessageToast("Failed to fetch KYC details!");
    }
  };

  const handleView = async (userId) => {
    try {
      const response = await axios.get(
        `http://localhost:8080/api/farmer/getFarmerKYCDetails/${userId}`
      );
      setSelectedKyc(response.data);
      setFarmerKycId(response.data.id); // Set ID for approve/decline
      setFarmerKycModal(true);
    } catch (error) {
      ErrorMessageToast(
        error.response?.status === 404
          ? "KYC record not found!"
          : "Failed to fetch KYC details!"
      );
    }
  };

  const handleSearch = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8080/api/admin/farmer-kyc/search?name=${searchName}&status=${statusFilter}`
      );
      setFarmerKycDetails(response.data);
    } catch (error) {
      ErrorMessageToast("Search failed!");
    }
  };

  const handleRequestApprove = (record) => {
    setFarmerKycId(record.id);
    setModalShow(true);
  };

  const handleDeclineRequest = (record) => {
    setFarmerKycId(record.id);
    setDeclineModal(true);
  };

  const handleApprove = async () => {
    try {
      await axios.put(
        `http://localhost:8080/api/admin/farmer-kyc/${farmerKycId}/approve`
      );
      SuccesfulMessageToast("Farmer KYC Approved");
      fetchPendingKyc();
      setModalShow(false);
      setFarmerKycModal(false);
    } catch (error) {
      ErrorMessageToast("Approval failed!");
    }
  };

  const handleDecline = async () => {
    try {
      await axios.put(
        `http://localhost:8080/api/admin/farmer-kyc/${farmerKycId}/decline`
      );
      SuccesfulMessageToast("Farmer KYC Declined");
      fetchPendingKyc();
      setDeclineModal(false);
      setFarmerKycModal(false);
    } catch (error) {
      ErrorMessageToast("Decline failed!");
    }
  };

  const handleCancel = () => {
    setModalShow(false);
    setDeclineModal(false);
    setFarmerKycModal(false);
    setSelectedKyc(null);
    setFarmerKycId(null);
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
        const normalizedStatus = record.kycStatus?.toUpperCase();
        return (
          <Space size="middle">
            <Button
              type="primary"
              onClick={() => handleView(record.userId)}
              style={{ background: "#1890ff", borderColor: "#1890ff" }}
            >
              View
            </Button>
            {normalizedStatus !== "APPROVED" && (
              <Button
                type="primary"
                onClick={() => handleRequestApprove(record)}
                style={{ background: "#52c41a", borderColor: "#52c41a" }}
                disabled={normalizedStatus === "REJECTED"}
              >
                Approve
              </Button>
            )}
            {normalizedStatus !== "REJECTED" && (
              <Button
                danger
                onClick={() => handleDeclineRequest(record)}
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
      <div className="top-filter">
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
              onClick={handleSearch}
              style={{ background: "#1890ff", borderColor: "#1890ff" }}
            >
              Search
            </Button>
          </Space>
        </div>
      </div>
      <Table columns={farmerColumns} dataSource={farmerKycDetails} bordered />
      <Modal
        title="Are you sure you want to Approve Farmer KYC?"
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
        title="Are you sure you want to Decline Farmer KYC?"
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
    </div>
  );
};

export default SuperAdminFarmer;
