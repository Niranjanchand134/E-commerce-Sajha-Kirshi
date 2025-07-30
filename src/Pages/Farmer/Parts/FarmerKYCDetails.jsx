import React, { useState } from "react";
import {
  User,
  MapPin,
  Briefcase,
  CreditCard,
  CheckCircle,
  XCircle,
  Clock,
  Eye,
  Mail,
  Phone,
  Calendar,
  Award,
  Sprout,
  Building,
} from "lucide-react";

const FarmerKYCDetail = ({ farmerData }) => {
  const [activeTab, setActiveTab] = useState("personal");

  const {
    // Personal Information
    id,
    userId,
    userName,
    userEmail,
    dateOfBirth,
    gender,
    citizenshipNumber,
    citizenshipIssuedDistrict,
    citizenshipFrontImagePath,
    citizenshipBackImagePath,
    permanentAddress,
    province,
    district,
    municipality,
    wardNumber,
    tole,
    kycStatus,
    verified,
    profileImagePath,

    // Farm Details
    farmName,
    farmSize,
    farmSizeUnit,
    primaryCrops,
    annualProductionCapacity,

    // Experience Details
    yearsOfExperience,
    farmingType,
    certifications,

    // Payment Details
    esewaId,
    esewaQrImagePath,

    // Additional fields
    rejectionReason,
  } = farmerData;

  // Status configuration
  const getStatusConfig = (status, isVerified) => {
    if (status === "APPROVED" || status === "Approved") {
      return {
        icon: CheckCircle,
        text: isVerified ? "Verified & Approved" : "Approved",
        bgGradient: isVerified
          ? "from-emerald-500 to-green-600"
          : "from-blue-500 to-indigo-600",
        textColor: "text-white",
        pulse: isVerified,
      };
    } else if (status === "PENDING" || status === "Pending") {
      return {
        icon: Clock,
        text: "Under Review",
        bgGradient: "from-amber-500 to-orange-600",
        textColor: "text-white",
        pulse: true,
      };
    } else if (status === "REJECTED" || status === "Rejected") {
      return {
        icon: XCircle,
        text: "Rejected",
        bgGradient: "from-red-500 to-rose-600",
        textColor: "text-white",
        pulse: false,
      };
    } else {
      return {
        icon: Clock,
        text: "Needs Review",
        bgGradient: "from-gray-500 to-gray-600",
        textColor: "text-white",
        pulse: false,
      };
    }
  };

  const statusConfig = getStatusConfig(kycStatus, verified);
  const StatusIcon = statusConfig.icon;

  // Enhanced Image Viewer
  const ImageViewer = ({ src, alt, className = "" }) => {
    if (!src) {
      return (
        <div
          className={`bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl h-48 flex items-center justify-center border-2 border-dashed border-gray-300 ${className}`}
        >
          <div className="text-center text-gray-500">
            <Eye className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No image available</p>
          </div>
        </div>
      );
    }

    return (
      <div
        className={`group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 ${className}`}
      >
        <img
          src={src}
          alt={alt}
          className="w-full h-48 object-cover cursor-pointer transform group-hover:scale-110 transition-transform duration-700"
          onClick={() => window.open(src, "_blank")}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="absolute bottom-4 left-4 right-4">
            <p className="text-white font-medium text-sm truncate">{alt}</p>
            <p className="text-gray-200 text-xs">Click to view full size</p>
          </div>
        </div>
        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <Eye className="w-4 h-4 text-gray-700" />
        </div>
      </div>
    );
  };

  // Data Card Component
  const DataCard = ({ icon: Icon, label, value, accent = false }) => (
    <div
      className={`p-4 rounded-xl border transition-all duration-300 hover:shadow-md ${
        accent
          ? "bg-gradient-to-r from-green-50 to-emerald-50 border-green-200 hover:border-green-300"
          : "bg-white border-gray-200 hover:border-gray-300"
      }`}
    >
      <div className="flex items-start space-x-3">
        {Icon && (
          <div
            className={`p-2 rounded-lg ${
              accent ? "bg-green-100" : "bg-gray-100"
            }`}
          >
            <Icon
              className={`w-4 h-4 ${
                accent ? "text-green-600" : "text-gray-600"
              }`}
            />
          </div>
        )}
        <div className="flex-1 min-w-0">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">
            {label}
          </p>
          <p className="text-sm font-semibold text-gray-900 break-words">
            {value || "Not provided"}
          </p>
        </div>
      </div>
    </div>
  );

  // Tab Navigation
  const tabs = [
    { id: "personal", label: "Personal Info", icon: User },
    { id: "farm", label: "Farm Details", icon: Sprout },
    { id: "experience", label: "Experience", icon: Award },
    { id: "payment", label: "Payment Info", icon: CreditCard },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Hero Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            {/* Profile Info */}
            <div className="flex items-start space-x-4">
              <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg overflow-hidden">
                {profileImagePath ? (
                  <img
                    src={profileImagePath}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User className="w-8 h-8 text-white" />
                )}
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{userName}</h1>
                <div className="flex items-center space-x-4 mt-2 text-gray-600">
                  <span className="flex items-center">
                    <Mail className="w-4 h-4 mr-1" />
                    {userEmail}
                  </span>
                  <span className="flex items-center">
                    <User className="w-4 h-4 mr-1" />
                    ID: #{id}
                  </span>
                </div>
              </div>
            </div>

            {/* Status Badge */}
            <div className="flex items-center space-x-3">
              <div
                className={`
                flex items-center space-x-3 px-6 py-3 rounded-2xl bg-gradient-to-r ${
                  statusConfig.bgGradient
                } 
                shadow-lg hover:shadow-xl transition-all duration-800 ${
                  statusConfig.pulse ? "animate-pulse" : ""
                }
              `}
              >
                <StatusIcon className="w-6 h-6 text-white" />
                <span className="font-semibold text-white text-lg">
                  {statusConfig.text}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8 overflow-x-auto">
            {tabs.map((tab) => {
              const TabIcon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    flex items-center space-x-2 py-4 px-2 border-b-2 font-medium text-sm whitespace-nowrap
                    transition-colors duration-200 ${
                      activeTab === tab.id
                        ? "border-green-500 text-green-600"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    }
                  `}
                >
                  <TabIcon className="w-5 h-5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Personal Information Tab */}
        {activeTab === "personal" && (
          <div className="space-y-8">
            <div className="bg-white rounded-3xl shadow-xl p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                <User className="w-6 h-6 mr-3 text-green-600" />
                Personal Information
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                <DataCard
                  icon={Calendar}
                  label="Date of Birth"
                  value={
                    dateOfBirth
                      ? new Date(dateOfBirth).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })
                      : "Not provided"
                  }
                />
                <DataCard icon={User} label="Gender" value={gender} />
                <DataCard
                  icon={CreditCard}
                  label="Citizenship Number"
                  value={citizenshipNumber}
                />
                <DataCard
                  icon={MapPin}
                  label="Issued District"
                  value={citizenshipIssuedDistrict}
                />
                <DataCard icon={MapPin} label="Province" value={province} />
                <DataCard icon={MapPin} label="District" value={district} />
                <DataCard
                  icon={Building}
                  label="Municipality"
                  value={municipality}
                />
                <DataCard
                  icon={MapPin}
                  label="Ward Number"
                  value={wardNumber?.toString()}
                />
                <DataCard icon={MapPin} label="Tole" value={tole} />
              </div>

              <div className="mb-8">
                <h3 className="text-lg font-medium text-gray-800 mb-4">
                  Permanent Address
                </h3>
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-gray-800">
                    {permanentAddress || "Not provided"}
                  </p>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-800 mb-6">
                  Identity Documents
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-3">
                      Profile Image
                    </p>
                    <ImageViewer
                      src={profileImagePath}
                      alt="Citizenship Front"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Farm Details Tab */}
        {activeTab === "farm" && (
          <div className="bg-white rounded-3xl shadow-xl p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
              <Sprout className="w-6 h-6 mr-3 text-green-600" />
              Farm Information
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              <DataCard
                icon={Sprout}
                label="Farm Name"
                value={farmName}
                accent
              />
              <DataCard
                icon={Award}
                label="Farm Size"
                value={
                  farmSize && farmSizeUnit
                    ? `${farmSize} ${farmSizeUnit}`
                    : "Not provided"
                }
              />
              <DataCard
                icon={Sprout}
                label="Primary Crops"
                value={primaryCrops}
                accent
              />
              <DataCard
                icon={Award}
                label="Annual Production Capacity"
                value={annualProductionCapacity}
              />
            </div>
          </div>
        )}

        {/* Experience Tab */}
        {activeTab === "experience" && (
          <div className="bg-white rounded-3xl shadow-xl p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
              <Award className="w-6 h-6 mr-3 text-green-600" />
              Experience & Certifications
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <DataCard
                icon={Calendar}
                label="Years of Experience"
                value={
                  yearsOfExperience
                    ? `${yearsOfExperience} years`
                    : "Not provided"
                }
                accent
              />
              <DataCard
                icon={Sprout}
                label="Farming Type"
                value={farmingType}
              />
            </div>

            <div className="mb-8">
              <h3 className="text-lg font-medium text-gray-800 mb-4">
                Certifications
              </h3>

              {certifications ? (
                <div className="max-w-2xl">
                  <ImageViewer
                    src={certifications}
                    alt="Farmer Certifications"
                    className="w-full"
                  />
                </div>
              ) : (
                <div className="bg-gray-50 rounded-xl p-6 text-center">
                  <Award className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-500">No certifications uploaded</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Payment Information Tab */}
        {activeTab === "payment" && (
          <div className="bg-white rounded-3xl shadow-xl p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
              <CreditCard className="w-6 h-6 mr-3 text-green-600" />
              Payment Information
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <DataCard icon={Phone} label="eSewa ID" value={esewaId} accent />
            </div>

            {esewaQrImagePath && (
              <div>
                <h3 className="text-lg font-medium text-gray-800 mb-4">
                  eSewa QR Code
                </h3>
                <div className="max-w-md">
                  <ImageViewer src={esewaQrImagePath} alt="eSewa QR Code" />
                </div>
              </div>
            )}

            {!esewaId && !esewaQrImagePath && (
              <div className="bg-gray-50 rounded-xl p-6 text-center">
                <CreditCard className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-500">No payment information provided</p>
              </div>
            )}
          </div>
        )}

        {/* Rejection Reason (if applicable) */}
        {rejectionReason && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 mt-6">
            <h3 className="text-lg font-medium text-red-800 mb-2 flex items-center">
              <XCircle className="w-5 h-5 mr-2" />
              Rejection Reason
            </h3>
            <p className="text-red-700">{rejectionReason}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FarmerKYCDetail;
