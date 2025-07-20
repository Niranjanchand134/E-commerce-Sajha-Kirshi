import React, { useEffect, useState } from "react";
import { Button, Modal, Table, Tag, Typography } from "antd";
import axios from "axios";
import { ErrorMessageToast } from "../../../utils/Tostify.util";
import { useParams } from "react-router-dom";

const { Title } = Typography;

const SuperAdminFarmer = () => {
  const { id } = useParams(); // Get ID from URL
  const [kycDetails, setKycDetails] = useState(null);
  const [kycViewModal, setKycViewModal] = useState(true);

  const fetchKycDetails = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8080/api/admin/farmer-kyc/${id}`
      );
      setKycDetails(response.data);
    } catch (error) {
      ErrorMessageToast("Failed to fetch KYC details!");
    }
  };

  const handleCancel = () => {
    setKycViewModal(false);
  };

  useEffect(() => {
    fetchKycDetails();
  }, [id]);

  const columns = [
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
        let color =
          status === "APPROVED"
            ? "green"
            : status === "PENDING"
            ? "geekblue"
            : "volcano";
        return <Tag color={color}>{status}</Tag>;
      },
    },
    {
      title: "Action",
      key: "action",
      align: "center",
      render: (_, record) => (
        <Button  onClick={() => setKycViewModal(true)}>
          View
        </Button>
      ),
    },
  ];

  return (
    <div>
      <Title level={3}>Farmer KYC Details</Title>
      <Table
        columns={columns}
        dataSource={kycDetails ? [kycDetails] : []}
        bordered
      />
      <Modal
        title="Farmer KYC Details"
        open={kycViewModal}
        onOk={handleCancel}
        onCancel={handleCancel}
        width={800}
      >
        {kycDetails && (
          <div>
            <p>
              <strong>Name:</strong> {kycDetails.userName}
            </p>
            <p>
              <strong>Email:</strong> {kycDetails.userEmail}
            </p>
            <p>
              <strong>Date of Birth:</strong> {kycDetails.dateOfBirth}
            </p>
            <p>
              <strong>Gender:</strong> {kycDetails.gender}
            </p>
            <p>
              <strong>Citizenship Number:</strong>{" "}
              {kycDetails.citizenshipNumber}
            </p>
            <p>
              <strong>Address:</strong> {kycDetails.permanentAddress},{" "}
              {kycDetails.district}, {kycDetails.province}
            </p>
            <p>
              <strong>Farm Name:</strong> {kycDetails.farmName}
            </p>
            <p>
              <strong>Farm Size:</strong> {kycDetails.farmSize}{" "}
              {kycDetails.farmSizeUnit}
            </p>
            <p>
              <strong>Primary Crops:</strong> {kycDetails.primaryCrops}
            </p>
            <p>
              <strong>Years of Experience:</strong>{" "}
              {kycDetails.yearsOfExperience}
            </p>
            <p>
              <strong>Bank Name:</strong> {kycDetails.bankName}
            </p>
            <p>
              <strong>Account Number:</strong> {kycDetails.accountNumber}
            </p>
            <p>
              <strong>Status:</strong> {kycDetails.kycStatus}
            </p>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default SuperAdminFarmer;
