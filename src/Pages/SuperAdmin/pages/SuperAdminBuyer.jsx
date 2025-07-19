import React, { useEffect, useState } from "react";
import {
  Button,
  Space,
  Typography,
  Input,
  Modal,
  Tag,
  Select,
  Table,
} from "antd";
import { useNavigate, useParams } from "react-router";
import axios from "axios";
import {
  ErrorMessageToast,
  SuccesfulMessageToast,
} from "../../../utils/Tostify.util";

const { Title } = Typography;

const SuperAdminBuyer = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // For viewing specific KYC details
  const [buyerKycDetails, setBuyerKycDetails] = useState([]);
  const [kycViewModal, setKycViewModal] = useState(false);
  const [selectedKyc, setSelectedKyc] = useState(null);
  const [searchName, setSearchName] = useState("");
  const [statusFilter, setStatusFilter] = useState("PENDING");

  const fetchBuyerKyc = async () => {
    try {
      const response = await axios.get(
        `/api/admin/buyer-kyc/search?name=${searchName}&status=${statusFilter}`
      );
      setBuyerKycDetails(response.data);
    } catch (error) {
      ErrorMessageToast("Failed to fetch buyer KYC!");
    }
  };

  const fetchKycDetails = async (kycId) => {
    try {
      const response = await axios.get(`/api/admin/buyer-kyc/${kycId}`);
      setSelectedKyc(response.data);
      setKycViewModal(true);
    } catch (error) {
      ErrorMessageToast("Failed to fetch KYC details!");
    }
  };

  const handleView = (record) => {
    fetchKycDetails(record.id);
  };

  const handleOk = () => {
    setKycViewModal(false);
  };

  const handleCancel = () => {
    setKycViewModal(false);
  };

  useEffect(() => {
    fetchBuyerKyc();
    if (id) {
      fetchKycDetails(id);
    }
  }, [id, searchName, statusFilter]);

  const columns = [
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
        <Space size="middle">
          <Button type="primary" onClick={() => handleView(record)}>
            View
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div className="top-filter">
        <Title level={3}>All Buyer KYC</Title>
        <div className="filter-option" style={{ marginBottom: "20px" }}>
          <Space size={20}>
            <Select
              defaultValue="PENDING"
              onChange={(value) => setStatusFilter(value)}
              style={{ width: "20vh" }}
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
            <Button type="primary" onClick={fetchBuyerKyc}>
              Search
            </Button>
          </Space>
        </div>
      </div>
      <Table columns={columns} dataSource={buyerKycDetails} bordered />
      <Modal
        title="Buyer KYC Details"
        open={kycViewModal}
        onOk={handleOk}
        onCancel={handleCancel}
        width={800}
      >
        {selectedKyc && (
          <div>
            <p>
              <strong>Name:</strong> {selectedKyc.fullName}
            </p>
            <p>
              <strong>Email:</strong> {selectedKyc.email}
            </p>
            <p>
              <strong>Phone Number:</strong> {selectedKyc.phoneNumber}
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
              <strong>Address:</strong> {selectedKyc.streetAddress},{" "}
              {selectedKyc.district}, {selectedKyc.province}
            </p>
            <p>
              <strong>PAN Number:</strong> {selectedKyc.panNumber}
            </p>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default SuperAdminBuyer;
