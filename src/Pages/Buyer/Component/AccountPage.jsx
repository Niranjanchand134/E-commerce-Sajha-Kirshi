import React, { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router";
import { Modal } from "antd";
import AccountSidebar from "./AccountSidebar";
import Header from "./Header";

const AccountPage = () => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleUserLogout = () => setIsModalOpen(true);

  const handleOk = () => {
    localStorage.removeItem("is_Login");
    setIsModalOpen(false);
    navigate("/");
    window.location.reload();
  };

  useEffect(() => {
    if (localStorage.getItem("is_Login") === "0") {
      navigate("/login");
    }
  }, [navigate]);

  return (
    <>
    <Header/>
      <div className="min-h-screen bg-gray-50">
        <main className="pt-6">
          {/* Account Header */}
          <div className="bg-white shadow-sm">
            <div className="container mx-auto px-4 sm:px-6 py-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-gray-800">
                    Account Settings
                  </h1>
                  <p className="text-gray-500 mt-1">
                    Manage your profile information
                  </p>
                </div>
                <button
                  onClick={handleUserLogout}
                  className="mt-4 sm:mt-0 px-4 py-2 bg-[#16A34A] hover:bg-[#12803A] text-white rounded-lg font-medium transition-colors"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>

          {/* Account Content */}
          <div className="px-4  py-4">
            <div className="flex flex-col md:flex-row gap-2">
              <AccountSidebar />
              <div className="flex-1">
                <Outlet />
              </div>
            </div>
          </div>
        </main>

        <Modal
          title="Confirm Logout"
          open={isModalOpen}
          onOk={handleOk}
          onCancel={() => setIsModalOpen(false)}
          okText="Logout"
          okButtonProps={{
            className: "bg-[#16A34A] hover:bg-[#12803A] border-none",
          }}
        >
          <p>Are you sure you want to logout?</p>
        </Modal>
      </div>
    </>
  );
};

export default AccountPage;
