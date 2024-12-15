import { useState } from "react";
import { NavLink } from "react-router-dom";
import { RiDashboard2Line } from "react-icons/ri";
import { FaUserFriends } from "react-icons/fa";
import { TbReportSearch } from "react-icons/tb";
import { BsDatabaseAdd } from "react-icons/bs";
import { SlLogout } from "react-icons/sl";
import { Modal } from "antd";
import { useNavigate } from "react-router-dom";

function SideNav() {
  const [isModalVisible, setIsModalVisible] = useState(false); // State for the modal
  const navigate = useNavigate();

  // Handle the logout action
  const logout = () => {
    // Simple logout logic
    window.localStorage.removeItem("name");
    window.localStorage.removeItem("email");
    navigate("/");
    console.log("Logged Out");
  };

  // Show the confirmation modal
  const showLogoutConfirm = () => {
    setIsModalVisible(true);
  };

  // Handle cancel action in the modal
  const handleCancel = () => {
    setIsModalVisible(false);
  };

  // Handle ok action in the modal (perform logout)
  const handleOk = () => {
    logout();
    setIsModalVisible(false); // Close modal after logout
  };

  return (
    <nav className="w-1/5 bg-gray-200 p-4 h-screen">
      <div className="text-lg font-bold mb-4">Hi User</div>
      <ul className="space-y-2">
        <li className="hover:bg-gray-300 p-2 rounded">
          <NavLink className="flex gap-3 align-baseline" to="create-user">
            <FaUserFriends className="size-8" />
            Create User
          </NavLink>
        </li>
        <li className="hover:bg-gray-300 p-2 rounded">
          <NavLink className="flex gap-3 align-baseline" to="add-task">
            <TbReportSearch className="size-8" />
            Create Tasks
          </NavLink>
        </li>
        <li className="hover:bg-gray-300 p-2 rounded">
          <NavLink className="flex gap-3 align-baseline" to="show-task">
            <BsDatabaseAdd className="size-8" />
            Show Tasks
          </NavLink>
        </li>
        <li className="hover:bg-gray-300 p-2 rounded">
          <NavLink className="flex gap-3 align-baseline" to="assign-task">
            <RiDashboard2Line className="size-8" />
            Show Users
          </NavLink>
        </li>
        <li className="hover:bg-gray-300 p-2 rounded">
          <NavLink
            className="flex gap-3 align-baseline"
            onClick={showLogoutConfirm}
            to="#"
          >
            <SlLogout className="size-7" />
            Logout
          </NavLink>
        </li>
      </ul>

      {/* Logout Confirmation Modal */}
      <Modal
        title="Confirm Logout"
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        okText="Yes"
        cancelText="No"
        okButtonProps={{
          style: {
            backgroundColor: "#e43434",
            borderColor: "#e43434",
            color: "white",
          },
        }}
        cancelButtonProps={{
          style: {
            backgroundColor: "#e0e0e0",
            borderColor: "#e0e0e0",
            color: "#000",
          },
        }}
      >
        <p>Are you sure you want to logout?</p>
      </Modal>
    </nav>
  );
}

export default SideNav;
