/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
import axios from "axios";
import { message, Modal } from "antd";

function AssignedTask() {
  const [users, setUsers] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [currentPage, setCurrentPage] = useState(1); // Track the current page
  const [itemsPerPage, setItemsPerPage] = useState(7); // Items per page

  // Fetch users from the backend
  const fetchUsers = async () => {
    try {
      const response = await axios.get(
        "http://127.0.0.1:8080/user/getAllUsers"
      );
      setUsers(response.data);
    } catch (error) {
      console.error(error);
      message.error("Failed to fetch users");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Delete user
  const deleteUser = (id) => {
    axios
      .delete(`http://127.0.0.1:8080/user/deleteUser/${id}`)
      .then((res) => {
        message.success("User removed successfully");
        fetchUsers();
        setIsModalVisible(false); // Close modal after deletion
        setUserToDelete(null); // Reset userToDelete
      })
      .catch((err) => {
        console.log(err);
        message.error("Error while deleting user");
      });
  };

  // Show the delete confirmation modal
  const showDeleteConfirm = (id) => {
    setUserToDelete(id);
    setIsModalVisible(true);
  };

  // Handle cancel action on the modal
  const handleCancel = () => {
    setIsModalVisible(false);
    setUserToDelete(null);
  };

  // Pagination logic
  const indexOfLastUser = currentPage * itemsPerPage;
  const indexOfFirstUser = indexOfLastUser - itemsPerPage;
  const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);

  const totalPages = Math.ceil(users.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Table for displaying users
  const responseTable = currentUsers.map((value, index) => (
    <tr
      key={index}
      className="bg-white hover:bg-gray-50 border-b transition duration-150"
    >
      <td className="p-4 text-gray-700 text-left">{value.name}</td>
      <td className="p-4 text-gray-700 text-left">{value.email}</td>
      <td className="p-4 text-gray-700 text-left">{value.role}</td>
      <td className="p-4 text-gray-700 text-left">
        {value.tasksAssigned.length}
      </td>
      <td className="p-4 text-left">
        <button
          onClick={() => showDeleteConfirm(value._id)}
          className="bg-red-500 text-white py-2 px-4 rounded-lg text-sm hover:bg-red-600 transition duration-200 focus:outline-none focus:ring-2 focus:ring-red-400"
        >
          Delete
        </button>
      </td>
    </tr>
  ));

  return (
    <div className="container mx-auto my-5 p-5">
      {/* <h1 className="text-3xl font-bold text-purple-700 mb-8 text-center"></h1> */}

      {/* Table Section */}
      <div className="overflow-x-auto rounded-lg shadow-md">
        {users.length > 0 ? (
          <table className="table-auto w-full border border-gray-200 bg-gray-50 rounded-lg">
            <thead className="bg-purple-700 text-white text-sm uppercase">
              <tr>
                <th className="p-4 text-left">Name</th>
                <th className="p-4 text-left">Email</th>
                <th className="p-4 text-left">Role</th>
                <th className="p-4 text-left">Tasks Assigned</th>
                <th className="p-4 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>{responseTable}</tbody>
          </table>
        ) : (
          <div className="p-6 bg-gray-100 text-gray-600 rounded-lg text-center shadow-inner">
            <p className="text-lg font-medium">No tasks found for users.</p>
          </div>
        )}
      </div>

      {/* Pagination Controls */}
      <div className="mt-4 flex justify-center">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="bg-purple-700 text-white py-2 px-4 rounded-md mr-2 hover:bg-purple-800 transition duration-150"
        >
          Previous
        </button>
        <span className="text-gray-700 py-2 px-4">{`Page ${currentPage} of ${totalPages}`}</span>
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="bg-purple-700 text-white py-2 px-4 rounded-md ml-2 hover:bg-purple-800 transition duration-150"
        >
          Next
        </button>
      </div>

      {/* Delete Confirmation Modal */}
      <Modal
        title="Confirm Deletion"
        visible={isModalVisible}
        onOk={() => deleteUser(userToDelete)}
        onCancel={handleCancel}
        okText="Yes"
        cancelText="No"
        okButtonProps={{
          style: {
            backgroundColor: "#7B1FA2",
            borderColor: "#7B1FA2",
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
        <p>Are you sure you want to delete this user?</p>
      </Modal>
    </div>
  );
}

export default AssignedTask;
