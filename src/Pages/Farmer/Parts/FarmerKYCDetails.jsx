import React from "react";

const FarmerKYCDetail = ({ farmerData }) => {
  const {
    // Personal Information
    id,
    userId,
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

    // Farm Details
    farmName,
    description,
    gpsCoordinates,
    farmSize,
    farmSizeUnit,
    primaryCrops,
    seasonalCalendar,
    annualProductionCapacity,

    // Experience Details
    yearsOfExperience,
    farmingType,
    certifications,
    supportingDocsPath,

    // Bank Details
    accountName,
    accountNumber,
    bankName,
    branchName,
    panNumber,
    panCardImagePath,
    esewaId,
  } = farmerData;

  // Helper component for image display
  const ImageViewer = ({ label, path }) =>
    path ? (
      <div className="mb-4">
        <p className="text-sm font-medium text-gray-600">{label}</p>
        <img
          src={path}
          alt={label}
          className="mt-1 h-32 object-contain border rounded-md shadow-sm cursor-pointer hover:opacity-90"
          onClick={() => window.open(path, "_blank")}
        />
      </div>
    ) : null;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-[#4BAF47]">
        Farmer KYC Details
      </h1>

      {/* Personal Information */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4 text-[#4BAF47] border-b pb-2">
          Personal Information
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <p className="text-sm font-medium text-gray-600">Farmer ID</p>
            <p className="text-base">{id}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600">User ID</p>
            <p className="text-base">{userId}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600">Date of Birth</p>
            <p className="text-base">{dateOfBirth}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600">Gender</p>
            <p className="text-base">{gender}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600">
              Citizenship Number
            </p>
            <p className="text-base">{citizenshipNumber}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600">Issued District</p>
            <p className="text-base">{citizenshipIssuedDistrict}</p>
          </div>
          <div className="md:col-span-2 lg:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-4">
            <ImageViewer
              label="Citizenship Front"
              path={citizenshipFrontImagePath}
            />
            <ImageViewer
              label="Citizenship Back"
              path={citizenshipBackImagePath}
            />
          </div>
          <div className="md:col-span-2 lg:col-span-3">
            <p className="text-sm font-medium text-gray-600">
              Permanent Address
            </p>
            <p className="text-base">{permanentAddress}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600">Province</p>
            <p className="text-base">{province}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600">District</p>
            <p className="text-base">{district}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600">Municipality</p>
            <p className="text-base">{municipality}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600">Ward Number</p>
            <p className="text-base">{wardNumber}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600">Tole</p>
            <p className="text-base">{tole}</p>
          </div>
        </div>
      </div>

      {/* Farm Details */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4 text-[#4BAF47] border-b pb-2">
          Farm Details
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm font-medium text-gray-600">Farm Name</p>
            <p className="text-base">{farmName}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600">GPS Coordinates</p>
            <p className="text-base">{gpsCoordinates}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600">Farm Size</p>
            <p className="text-base">
              {farmSize} {farmSizeUnit}
            </p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600">Primary Crops</p>
            <p className="text-base">{primaryCrops}</p>
          </div>
          <div className="md:col-span-2">
            <p className="text-sm font-medium text-gray-600">Description</p>
            <p className="text-base">{description}</p>
          </div>
          <div className="md:col-span-2">
            <p className="text-sm font-medium text-gray-600">
              Seasonal Calendar
            </p>
            <p className="text-base">{seasonalCalendar}</p>
          </div>
          <div className="md:col-span-2">
            <p className="text-sm font-medium text-gray-600">
              Annual Production Capacity
            </p>
            <p className="text-base">{annualProductionCapacity}</p>
          </div>
        </div>
      </div>

      {/* Experience Details */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4 text-[#4BAF47] border-b pb-2">
          Experience Details
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm font-medium text-gray-600">
              Years of Experience
            </p>
            <p className="text-base">{yearsOfExperience}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600">Farming Type</p>
            <p className="text-base">{farmingType}</p>
          </div>
          <div className="md:col-span-2">
            <p className="text-sm font-medium text-gray-600">Certifications</p>
            <p className="text-base">{certifications}</p>
          </div>
          <div className="md:col-span-2">
            <ImageViewer
              label="Supporting Documents"
              path={supportingDocsPath}
            />
          </div>
        </div>
      </div>

      {/* Bank Details */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4 text-[#4BAF47] border-b pb-2">
          Bank Details
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm font-medium text-gray-600">Account Name</p>
            <p className="text-base">{accountName}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600">Account Number</p>
            <p className="text-base">{accountNumber}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600">Bank Name</p>
            <p className="text-base">{bankName}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600">Branch Name</p>
            <p className="text-base">{branchName}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600">PAN Number</p>
            <p className="text-base">{panNumber}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600">eSewa ID</p>
            <p className="text-base">{esewaId}</p>
          </div>
          <div className="md:col-span-2">
            <ImageViewer label="PAN Card Image" path={panCardImagePath} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default FarmerKYCDetail;
