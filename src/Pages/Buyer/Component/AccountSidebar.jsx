import React, { useState } from "react";
import { User, ShoppingBag } from "lucide-react";
import { useLocation, useNavigate } from "react-router";

const AccountSidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const menuItems = [
    {
      icon: <User className="h-5 w-5" />,
      label: "My Profile",
      path: "/setting",
    },
    {
      icon: <ShoppingBag className="h-5 w-5" />,
      label: "Order History",
      path: "/setting/orderHistory",
    },
  ];

  return (
    <aside className="w-full md:w-64 shrink-0">
      <nav className="sticky top-20 p-4">
        <ul className="space-y-2">
          {menuItems.map((item, index) => {
            const isActive = location.pathname === item.path;
            return (
              <li key={index}>
                <button
                  onClick={() => navigate(item.path)}
                  className={`flex w-full items-center text-base px-4 py-3 rounded-lg transition-all duration-200 ${
                    isActive
                      ? "text-white bg-[#16A34A] font-medium shadow-md"
                      : "hover:bg-gray-100 text-gray-700 hover:text-[#16A34A]"
                  }`}
                >
                  <span className="mr-3">{item.icon}</span>
                  <span>{item.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
};

export default AccountSidebar;
