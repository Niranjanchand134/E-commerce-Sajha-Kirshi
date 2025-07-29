import { Card, Descriptions, Tag, Image, Avatar, Tabs, Button } from "antd";
import {
  UserOutlined,
  IdcardOutlined,
  HomeOutlined,
  CalendarOutlined,
  MailOutlined,
  PhoneOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";
import { getKycByUserId } from "../../../services/buyer/BuyerApiService";
import { useAuth } from "../../../Context/AuthContext";
import { useEffect, useState } from "react";
import Header from "./Header";
import Footer from "./Footer";

const BuyerKycDetail = () => {
  const [buyerKyc, setBuyerKyc] = useState({});

  const { user } = useAuth();

  useEffect(() => {
    const getKycDetails = async () => {
      const response = await getKycByUserId(user.id);
      console.log("here is ", response);
      setBuyerKyc(response);
    };

    getKycDetails();
  }, []);

  return (
    <>
      <Header />
      <div className="max-w-6xl mx-auto p-4 md:p-6">
        <Card className="shadow-sm rounded-lg border-0">
          {/* Header Section */}
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6 mb-8">
            <Avatar
              size={100}
              src={buyerKyc.profilePhotoPath}
              icon={<UserOutlined />}
              className="border-2 border-primary"
            />
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
                {buyerKyc.fullName}
              </h1>
              <div className="flex items-center gap-2 mt-2">
                <Tag
                  color={
                    buyerKyc.kycStatus === "APPROVED"
                      ? "green"
                      : buyerKyc.kycStatus === "PENDING"
                      ? "orange"
                      : "red"
                  }
                  className="text-sm font-medium"
                >
                  {buyerKyc.kycStatus}
                </Tag>
                {buyerKyc.verified && (
                  <Tag
                    color="blue"
                    icon={<CheckCircleOutlined />}
                    className="text-sm font-medium"
                  >
                    Verified
                  </Tag>
                )}
              </div>
            </div>
          </div>

          {/* Main Content Tabs */}
          <Tabs defaultActiveKey="1">
            {/* Personal Information Tab */}
            <Tabs.TabPane tab="Personal Information" key="1">
              <Descriptions bordered column={2} className="rounded-lg">
                <Descriptions.Item label="Full Name" span={2}>
                  {buyerKyc.fullName}
                </Descriptions.Item>
                <Descriptions.Item label="Email" span={2}>
                  <div className="flex items-center gap-2">
                    <MailOutlined />
                    {buyerKyc.email}
                  </div>
                </Descriptions.Item>
                <Descriptions.Item label="Phone Number">
                  <div className="flex items-center gap-2">
                    <PhoneOutlined />
                    {buyerKyc.phoneNumber}
                  </div>
                </Descriptions.Item>
                <Descriptions.Item label="Date of Birth">
                  <div className="flex items-center gap-2">
                    <CalendarOutlined />
                    {buyerKyc.dateofBirth || "Not provided"}
                  </div>
                </Descriptions.Item>
                <Descriptions.Item label="Gender">
                  {buyerKyc.gender}
                </Descriptions.Item>
                <Descriptions.Item label="Citizenship Number">
                  {buyerKyc.citizenshipNumber}
                </Descriptions.Item>
                <Descriptions.Item label="PAN Number">
                  {buyerKyc.panNumber}
                </Descriptions.Item>
              </Descriptions>
            </Tabs.TabPane>

            {/* Address Information Tab */}
            <Tabs.TabPane tab="Address Information" key="2">
              <Descriptions bordered column={2} className="rounded-lg">
                <Descriptions.Item label="Province">
                  {buyerKyc.province}
                </Descriptions.Item>
                <Descriptions.Item label="District">
                  {buyerKyc.district}
                </Descriptions.Item>
                <Descriptions.Item label="Municipality">
                  {buyerKyc.municipality}
                </Descriptions.Item>
                <Descriptions.Item label="Ward No.">
                  {buyerKyc.ward}
                </Descriptions.Item>
                <Descriptions.Item label="Street Address" span={2}>
                  <div className="flex items-center gap-2">
                    <HomeOutlined />
                    {buyerKyc.streetAddress}
                  </div>
                </Descriptions.Item>
                <Descriptions.Item label="Landmark" span={2}>
                  {buyerKyc.landmark}
                </Descriptions.Item>
              </Descriptions>
            </Tabs.TabPane>

            {/* Documents Tab */}
            <Tabs.TabPane tab="Documents" key="3">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card
                  title="Business Registration"
                  className="shadow-sm"
                  extra={<Tag icon={<IdcardOutlined />}>Business</Tag>}
                >
                  <Image
                    src={buyerKyc.businessRegistrationImagePath}
                    alt="Business Registration"
                    className="rounded-md"
                    fallback="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMIAAADDCAYAAADQvc6UAAABRWlDQ1BJQ0MgUHJvZmlsZQAAKJFjYGASSSwoyGFhYGDIzSspCnJ3UoiIjFJgf8LAwSDCIMogwMCcmFxc4BgQ4ANUwgCjUcG3awyMIPqyLsis7PPOq3QdDFcvjV3jOD1boQVTPQrgSkktTgbSf4A4LbmgqISBgTEFyFYuLykAsTuAbJEioKOA7DkgdjqEvQHEToKwj4DVhAQ5A9k3gGyB5IxEoBmML4BsnSQk8XQkNtReEOBxcfXxUQg1Mjc0dyHgXNJBSWpFCYh2zi+oLMpMzyhRcASGUqqCZ16yno6CkYGRAQMDKMwhqj/fAIcloxgHQqxAjIHBEugw5sUIsSQpBobtQPdLciLEVJYzMPBHMDBsayhILEqEO4DxG0txmrERhM29nYGBddr//5/DGRjYNRkY/l7////39v///y4Dmn+LgeHANwDrkl1AuO+pmgAAADhlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAAqACAAQAAAABAAAAwqADAAQAAAABAAAAwwAAAAD9b/HnAAAHlklEQVR4Ae3dP3Ik1RUG8O+u6otnJBaJ7wNMBCExCREhgYjYB/ASiAgJCQkJiYiQkJCQkJCQkJB2bC93/jvpe7irq6t7uqq7urue733v1+9/jnle9h4k2l0wY"
                  />
                </Card>

                {/* Note: The API response doesn't contain citizenship or PAN card images, 
                     so these cards will show fallback images or be hidden if needed */}
                {buyerKyc.citizenshipFrontImagePath && (
                  <Card
                    title="Citizenship Front"
                    className="shadow-sm"
                    extra={<Tag icon={<IdcardOutlined />}>Citizenship</Tag>}
                  >
                    <Image
                      src={buyerKyc.citizenshipFrontImagePath}
                      alt="Citizenship Front"
                      className="rounded-md"
                    />
                  </Card>
                )}

                {buyerKyc.citizenshipBackImagePath && (
                  <Card
                    title="Citizenship Back"
                    className="shadow-sm"
                    extra={<Tag icon={<IdcardOutlined />}>Citizenship</Tag>}
                  >
                    <Image
                      src={buyerKyc.citizenshipBackImagePath}
                      alt="Citizenship Back"
                      className="rounded-md"
                    />
                  </Card>
                )}

                {buyerKyc.panCardImagePath && (
                  <Card
                    title="PAN Card"
                    className="shadow-sm"
                    extra={<Tag icon={<IdcardOutlined />}>PAN</Tag>}
                  >
                    <Image
                      src={buyerKyc.panCardImagePath}
                      alt="PAN Card"
                      className="rounded-md"
                    />
                  </Card>
                )}
              </div>
            </Tabs.TabPane>
          </Tabs>
        </Card>
      </div>
      <Footer />
    </>
  );
};

export default BuyerKycDetail;
