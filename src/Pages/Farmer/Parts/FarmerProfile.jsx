import { ArrowLeftOutlined, CheckCircleFilled } from "@ant-design/icons";
import { FaUserAlt } from "react-icons/fa";
import { FaCheckCircle } from "react-icons/fa";

const FarmerProfile = () => {
    const profile = {
    kycVerified: true,
    dob: "2060-03-29 BS",
    gender: "Male",
    address: "Gowaswari-5, Lalitour",
    farmingExperience: "10 years",
    bankAccount: "94166541541",
    panNumber: "456578",
    farmSize: "20 Hec",
    citizenNumber: "24444",
    citizenIssueDate: "2020-20-20",
    citizenIssuedFrom: "2002-20-20",
    images: ["", "", ""], // Replace with actual image URLs
  };

  const rows = [
    { label: "Kyc Verified", value: profile.kycVerified ? (
      <span className="text-green-600 font-medium flex items-center gap-1">
        Verified <FaCheckCircle className="h-4 w-4" />
      </span>
    ) : "Not Verified" },
    { label: "Date of Birth", value: profile.dob },
    { label: "Gender", value: profile.gender },
    { label: "Address", value: profile.address },
    { label: "Farming Experience", value: profile.farmingExperience },
    { label: "Bank Ac Number", value: profile.bankAccount },
    { label: "Pan Number", value: profile.panNumber },
    { label: "Farm Size", value: profile.farmSize },
    { label: "Citizen Number", value: profile.citizenNumber },
    { label: "Citizen Issue Date", value: profile.citizenIssueDate },
    { label: "Citizen Issued From", value: profile.citizenIssuedFrom },
  ];
    return (
        <>
        <div className="flex items-center gap-2 mb-4">
            <div className="border border-gray-300 rounded p-1 hover:bg-gray-100 cursor-pointer text-xl flex items-center justify-center">
            <ArrowLeftOutlined />
            </div>
            <h4 className="text-xl font-semibold">Profile</h4>
        </div>
        <div className="border rounded-lg overflow-hidden bg-white">
            <div className="flex flex-col sm:flex-row gap-8 p-4 items-center sm:items-start">
                <div>
                    <img
                        src="https://t4.ftcdn.net/jpg/03/64/21/11/360_F_364211147_1qgLVxv1Tcq0Ohz3FawUfrtONzz8nq3e.jpg"
                        alt="Profile"
                        className="w-32 h-32 mt-8 rounded-full object-cover border"
                    />
                </div>

                {/* Info Section */}
                <div className="sm:text-left">
                    <h4 className="text-xl font-semibold text-gray-800">Niranjan Chand</h4>
                    <p className="text-gray-600">Email: Pratik@gmail.com</p>
                    <p className="text-gray-600">Mobile: 9865820501</p>
                    <p className="text-gray-600">Joined on: 2022-02-02</p>

                    <div className="flex justify-center sm:justify-start items-center gap-2 mt-2">
                        <FaUserAlt className="text-green-500 text-xl" />
                        <h4 className="text-green-500 text-lg mt-2 font-medium">Farmer</h4>
                    </div>
                </div>
            </div>
        </div><br/>

        <div className="border p-4 bg-white rounded-lg">
            <h2 className="text-lg font-semibold mb-4">Profile Detail</h2>

            <div className="grid grid-cols-1">
                {rows.map((row, index) => (
                <div
                    key={index}
                    className="grid grid-cols-2 py-2 text-sm border-b last:border-b-0"
                >
                    <div className="font-normal ">{row.label}</div>
                    <div className="text-gray-700 font-normal">{row.value}</div>
                </div>
                ))}
            </div>

            <div className="mt-6">
                <h3 className="text-sm font-semibold text-gray-700 mb-2">Images</h3>
                <div className="flex gap-4">
                {(profile.images || ["", "", ""]).map((img, index) => (
                    <div
                    key={index}
                    className="w-32 h-32 border rounded-md bg-gray-100 flex items-center justify-center"
                    >
                    {img ? (
                        <img
                        src={img}
                        alt={`Image ${index + 1}`}
                        className="object-cover w-full h-full rounded"
                        />
                    ) : (
                        <span className="text-xs text-gray-400">No Image</span>
                    )}
                    </div>
                ))}
                </div>
            </div>
        </div>
        </>
    )
}

export default FarmerProfile;