import React, { useEffect, useState } from "react";
import { Button, Space, Input, Modal, Tag, Select, Table } from "antd";
import { Typography } from "antd";
import {
  ErrorMessageToast,
  SuccesfulMessageToast,
} from "../../../utils/Tostify.util";
import axios from "axios";

const { Title } = Typography;
const { Option } = Select;

const FarmerKycManagement = () => {
  const [farmerKycData, setFarmerKycData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedKyc, setSelectedKyc] = useState(null);
  const [viewModal, setViewModal] = useState(false);
  const [approveModal, setApproveModal] = useState(false);
  const [rejectModal, setRejectModal] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [filters, setFilters] = useState({
    status: "",
    search: "",
    page: 0,
    size: 10,
  });
  const [totalItems, setTotalItems] = useState(0);

  // API Base URL - replace with your actual API URL
  const API_BASE_URL = "http://localhost:8080/api/admin";

  // Fetch farmer KYC data
  const fetchFarmerKycs = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/farmer-kyc`, {
        params: {
          status: filters.status || undefined,
          search: filters.search || undefined,
          page: filters.page,
          size: filters.size,
        },
      });
      setFarmerKycData(response.data.content || []);
      setTotalItems(response.data.totalElements || 0);
    } catch (error) {
      console.error("Error fetching farmer KYCs:", error);
      ErrorMessageToast("Failed to load farmer KYCs");
    } finally {
      setLoading(false);
    }
  };

  // Get farmer KYC details
  const fetchFarmerKycDetails = async (id) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/farmer-kyc/${id}`);
      setSelectedKyc(response.data);
      setViewModal(true);
    } catch (error) {
      console.error("Error fetching farmer KYC details:", error);
      ErrorMessageToast("Failed to load KYC details");
    }
  };

  // Handle approve KYC
  const handleApprove = async () => {
    if (!selectedKyc) return;

    try {
      await axios.put(
        `${API_BASE_URL}/farmer-kyc/${selectedKyc.id}/approve`,
        null,
        {
          params: {
            approvedBy: localStorage.getItem("adminName") || "Admin",
          },
        }
      );

      SuccesfulMessageToast("Farmer KYC approved successfully");
      setApproveModal(false);
      setSelectedKyc(null);
      fetchFarmerKycs();
    } catch (error) {
      console.error("Error approving KYC:", error);
      ErrorMessageToast("Failed to approve KYC");
    }
  };

  // Handle reject KYC
  const handleReject = async () => {
    if (!selectedKyc || !rejectionReason.trim()) {
      ErrorMessageToast("Please provide a rejection reason");
      return;
    }

    try {
      await axios.put(
        `${API_BASE_URL}/farmer-kyc/${selectedKyc.id}/reject`,
        null,
        {
          params: {
            rejectionReason: rejectionReason,
            rejectedBy: localStorage.getItem("adminName") || "Admin",
          },
        }
      );

      SuccesfulMessageToast("Farmer KYC rejected successfully");
      setRejectModal(false);
      setSelectedKyc(null);
      setRejectionReason("");
      fetchFarmerKycs();
    } catch (error) {
      console.error("Error rejecting KYC:", error);
      ErrorMessageToast("Failed to reject KYC");
    }
  };

  // Handle search
  const handleSearch = () => {
    setFilters((prev) => ({ ...prev, page: 0 }));
    fetchFarmerKycs();
  };

  // Handle filter change
  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value, page: 0 }));
  };

  // Handle pagination
  const handlePaginationChange = (page, pageSize) => {
    setFilters((prev) => ({ ...prev, page: page - 1, size: pageSize }));
  };

  // Table columns
  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      align: "center",
      width: 80,
    },
    {
      title: "Farmer Name",
      render: (_, record) =>
        `${record.user?.firstName || ""} ${record.user?.lastName || ""}`,
      align: "center",
      width: 150,
    },
    {
      title: "Email",
      dataIndex: ["user", "email"],
      align: "center",
      width: 200,
    },
    {
      title: "Farm Name",
      dataIndex: ["farmDetails", "farmName"],
      align: "center",
      width: 150,
    },
    {
      title: "Location",
      render: (_, record) =>
        `${record.district || ""}, ${record.province || ""}`,
      align: "center",
      width: 150,
    },
    {
      title: "Farm Size",
      render: (_, record) =>
        `${record.farmDetails?.farmSize || ""} ${
          record.farmDetails?.farmSizeUnit || ""
        }`,
      align: "center",
      width: 120,
    },
    {
      title: "Experience",
      dataIndex: ["experienceDetails", "yearsOfExperience"],
      align: "center",
      width: 100,
      render: (years) => `${years || 0} years`,
    },
    {
      title: "Status",
      dataIndex: "kycStatus",
      align: "center",
      width: 100,
      render: (status) => {
        let color =
          status === "APPROVED"
            ? "green"
            : status === "PENDING"
            ? "orange"
            : "red";
        return <Tag color={color}>{status}</Tag>;
      },
    },
    {
      title: "Submitted Date",
      dataIndex: "submittedAt",
      align: "center",
      width: 120,
      render: (date) => new Date(date).toLocaleDateString(),
    },
    {
      title: "Action",
      key: "action",
      align: "center",
      width: 250,
      render: (_, record) => (
        <Space size="small">
          <Button
            type="default"
            size="small"
            onClick={() => fetchFarmerKycDetails(record.id)}
          >
            View
          </Button>
          {record.kycStatus === "PENDING" && (
            <>
              <Button
                type="primary"
                size="small"
                onClick={() => {
                  setSelectedKyc(record);
                  setApproveModal(true);
                }}
              >
                Approve
              </Button>
              <Button
                danger
                size="small"
                onClick={() => {
                  setSelectedKyc(record);
                  setRejectModal(true);
                }}
              >
                Reject
              </Button>
            </>
          )}
        </Space>
      ),
    },
  ];

  useEffect(() => {
    fetchFarmerKycs();
  }, [filters.page, filters.size]);

  return (
    <div>
      <div className="top-filter">
        <Title level={3}>Farmer KYC Management</Title>
        <div className="filter-option" style={{ marginBottom: "20px" }}>
          <Space size={20}>
            <Select
              placeholder="Select Status"
              value={filters.status}
              onChange={(value) => handleFilterChange("status", value)}
              style={{ width: 150 }}
              allowClear
            >
              <Option value="PENDING">Pending</Option>
              <Option value="APPROVED">Approved</Option>
              <Option value="REJECTED">Rejected</Option>
            </Select>

            <Input
              placeholder="Search by name, email..."
              value={filters.search}
              onChange={(e) => handleFilterChange("search", e.target.value)}
              style={{ width: 250 }}
            />

            <Button type="primary" onClick={handleSearch}>
              Search
            </Button>
          </Space>
        </div>
      </div>

      <Table
        columns={columns}
        dataSource={farmerKycData}
        bordered
        rowKey="id"
        loading={loading}
        scroll={{ x: 1200 }}
        pagination={{
          current: filters.page + 1,
          pageSize: filters.size,
          total: totalItems,
          onChange: handlePaginationChange,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total, range) =>
            `${range[0]}-${range[1]} of ${total} items`,
        }}
      />

      {/* View Details Modal */}
      <Modal
        title="Farmer KYC Details"
        open={viewModal}
        onCancel={() => {
          setViewModal(false);
          setSelectedKyc(null);
        }}
        footer={null}
        width={800}
      >
        {selectedKyc && (
          <div>
            <div style={{ marginBottom: 16 }}>
              <Title level={4}>Personal Information</Title>
              <p>
                <strong>Name:</strong> {selectedKyc.user?.firstName}{" "}
                {selectedKyc.user?.lastName}
              </p>
              <p>
                <strong>Email:</strong> {selectedKyc.user?.email}
              </p>
              <p>
                <strong>Date of Birth:</strong> {selectedKyc.dateOfBirth}
              </p>
              <p>
                <strong>Gender:</strong> {selectedKyc.gender}
              </p>
              <p>
                <strong>Citizenship Number:</strong>{" "}
                {selectedKyc.citizenshipNumber}
              </p>
              <p>
                <strong>Address:</strong> {selectedKyc.permanentAddress},{" "}
                {selectedKyc.district}, {selectedKyc.province}
              </p>
            </div>

            <div style={{ marginBottom: 16 }}>
              <Title level={4}>Farm Details</Title>
              <p>
                <strong>Farm Name:</strong> {selectedKyc.farmDetails?.farmName}
              </p>
              <p>
                <strong>Description:</strong>{" "}
                {selectedKyc.farmDetails?.description}
              </p>
              <p>
                <strong>Farm Size:</strong> {selectedKyc.farmDetails?.farmSize}{" "}
                {selectedKyc.farmDetails?.farmSizeUnit}
              </p>
              <p>
                <strong>Primary Crops:</strong>{" "}
                {selectedKyc.farmDetails?.primaryCrops}
              </p>
              <p>
                <strong>Annual Production:</strong>{" "}
                {selectedKyc.farmDetails?.annualProductionCapacity}
              </p>
            </div>

            <div style={{ marginBottom: 16 }}>
              <Title level={4}>Experience Details</Title>
              <p>
                <strong>Years of Experience:</strong>{" "}
                {selectedKyc.experienceDetails?.yearsOfExperience} years
              </p>
              <p>
                <strong>Farming Type:</strong>{" "}
                {selectedKyc.experienceDetails?.farmingType}
              </p>
              <p>
                <strong>Certifications:</strong>{" "}
                {selectedKyc.experienceDetails?.certifications}
              </p>
            </div>

            <div style={{ marginBottom: 16 }}>
              <Title level={4}>Bank Details</Title>
              <p>
                <strong>Account Name:</strong>{" "}
                {selectedKyc.bankDetails?.accountName}
              </p>
              <p>
                <strong>Account Number:</strong>{" "}
                {selectedKyc.bankDetails?.accountNumber}
              </p>
              <p>
                <strong>Bank Name:</strong> {selectedKyc.bankDetails?.bankName}
              </p>
              <p>
                <strong>Branch:</strong> {selectedKyc.bankDetails?.branchName}
              </p>
            </div>

            <div>
              <Title level={4}>KYC Status</Title>
              <p>
                <strong>Status:</strong>{" "}
                <Tag
                  color={
                    selectedKyc.kycStatus === "APPROVED"
                      ? "green"
                      : selectedKyc.kycStatus === "PENDING"
                      ? "orange"
                      : "red"
                  }
                >
                  {selectedKyc.kycStatus}
                </Tag>
              </p>
              <p>
                <strong>Submitted At:</strong>{" "}
                {new Date(selectedKyc.submittedAt).toLocaleString()}
              </p>
              {selectedKyc.approvedAt && (
                <p>
                  <strong>Processed At:</strong>{" "}
                  {new Date(selectedKyc.approvedAt).toLocaleString()}
                </p>
              )}
              {selectedKyc.approvedBy && (
                <p>
                  <strong>Processed By:</strong> {selectedKyc.approvedBy}
                </p>
              )}
              {selectedKyc.rejectionReason && (
                <p>
                  <strong>Rejection Reason:</strong>{" "}
                  {selectedKyc.rejectionReason}
                </p>
              )}
            </div>
          </div>
        )}
      </Modal>

      {/* Approve Modal */}
      <Modal
        title="Approve Farmer KYC"
        open={approveModal}
        onOk={handleApprove}
        onCancel={() => {
          setApproveModal(false);
          setSelectedKyc(null);
        }}
        okText="Approve"
        cancelText="Cancel"
      >
        <p>Are you sure you want to approve this farmer's KYC?</p>
        <p>
          This action will allow the farmer to proceed with their application.
        </p>
      </Modal>

      {/* Reject Modal */}
      <Modal
        title="Reject Farmer KYC"
        open={rejectModal}
        onOk={handleReject}
        onCancel={() => {
          setRejectModal(false);
          setSelectedKyc(null);
          setRejectionReason("");
        }}
        okText="Reject"
        cancelText="Cancel"
      >
        <p>Please provide a reason for rejecting this KYC:</p>
        <Input.TextArea
          rows={4}
          value={rejectionReason}
          onChange={(e) => setRejectionReason(e.target.value)}
          placeholder="Enter rejection reason..."
          required
        />
      </Modal>
    </div>
  );
};

export default FarmerKycManagement;
