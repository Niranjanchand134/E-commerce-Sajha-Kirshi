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
import { CheckCircleOutlined, UserOutlined } from "@ant-design/icons";
import axios from "axios";
import {
  ErrorMessageToast,
  SuccesfulMessageToast,
} from "../../../utils/Tostify.util";

const { Title } = Typography;
const { TabPane } = Tabs;

const SuperAdminBuyer = () => {
  const [buyerKycDetails, setBuyerKycDetails] = useState([]);
  const [buyerKycId, setBuyerKycId] = useState(null);
  const [modalShow, setModalShow] = useState(false);
  const [declineModal, setDeclineModal] = useState(false);
  const [kycViewModal, setKycViewModal] = useState(false);
  const [selectedKyc, setSelectedKyc] = useState(null);
  const [searchName, setSearchName] = useState("");
  const [statusFilter, setStatusFilter] = useState("PENDING");

  const fetchPendingKyc = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8080/api/admin/buyer-kyc/pending"
      );
      setBuyerKycDetails(response.data);
    } catch (error) {
      ErrorMessageToast("Failed to fetch buyer KYC details!");
    }
  };

  const handleView = async (record) => {
    try {
      const response = await axios.get(
        `http://localhost:8080/api/admin/buyer-kyc/${record.id}`
      );
      setSelectedKyc(response.data);
      setBuyerKycId(record.id);
      setKycViewModal(true);
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
        `http://localhost:8080/api/admin/buyer-kyc/search?name=${searchName}&status=${statusFilter}`
      );
      setBuyerKycDetails(response.data);
    } catch (error) {
      ErrorMessageToast("Search failed!");
    }
  };

  const handleRequestApprove = (record) => {
    setBuyerKycId(record.id);
    setModalShow(true);
  };

  const handleDeclineRequest = (record) => {
    setBuyerKycId(record.id);
    setDeclineModal(true);
  };

  const handleApprove = async () => {
    try {
      await axios.put(
        `http://localhost:8080/api/admin/buyer-kyc/${buyerKycId}/approve`
      );
      SuccesfulMessageToast("Buyer KYC Approved");
      fetchPendingKyc();
      setModalShow(false);
      setKycViewModal(false);
    } catch (error) {
      ErrorMessageToast("Approval failed!");
    }
  };

  const handleDecline = async () => {
    try {
      await axios.put(
        `http://localhost:8080/api/admin/buyer-kyc/${buyerKycId}/decline`
      );
      SuccesfulMessageToast("Buyer KYC Declined");
      fetchPendingKyc();
      setDeclineModal(false);
      setKycViewModal(false);
    } catch (error) {
      ErrorMessageToast("Decline failed!");
    }
  };

  const handleCancel = () => {
    setModalShow(false);
    setDeclineModal(false);
    setKycViewModal(false);
    setSelectedKyc(null);
    setBuyerKycId(null);
  };

  useEffect(() => {
    fetchPendingKyc();
  }, []);

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
        const normalizedStatus = record.kycStatus?.toUpperCase();
        return (
          <Space size="middle">
            <Button
              type="primary"
              onClick={() => handleView(record)}
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
              onClick={handleSearch}
              style={{ background: "#1890ff", borderColor: "#1890ff" }}
            >
              Search
            </Button>
          </Space>
        </div>
      </div>
      <Table columns={buyerColumns} dataSource={buyerKycDetails} bordered />
      <Modal
        title="Are you sure you want to Approve Buyer KYC?"
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
        title="Are you sure you want to Decline Buyer KYC?"
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

                <div className="document-images" style={{ marginTop: 20 }}>
                  <h4>Identity Documents</h4>
                  <Row gutter={16}>
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
                    {new Date().toLocaleDateString()}
                  </Descriptions.Item>
                </Descriptions>

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

export default SuperAdminBuyer;
