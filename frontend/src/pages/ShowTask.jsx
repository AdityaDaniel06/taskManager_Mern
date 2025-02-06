/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { message, Modal } from "antd";

function ShowTask() {
  const navigate = useNavigate(); // navigate to edit with id params
  const [task, setTask] = useState([]);
  const [currentPage, setCurrentPage] = useState(1); // Track current page
  const [itemsPerPage, setItemsPerPage] = useState(7); // Items per page
  const [isModalVisible, setIsModalVisible] = useState(false); // Modal visibility state
  const [taskToDelete, setTaskToDelete] = useState(null); // Track task to delete

  // Get all tasks
  const fetchAllTasks = async () => {
    try {
      const response = await axios.get(
        "http://127.0.0.1:8080/task/getAllTasks"
      );
      setTask(response.data.data.tasks);
      console.log(response.data.data.tasks);
    } catch (error) {
      console.log(error);
      message.error("Failed to fetch tasks");
    }
  };

  useEffect(() => {
    fetchAllTasks();
  }, []);

  const deleteTask = (id) => {
    try {
      axios
        .delete(`http://127.0.0.1:8080/task/deleteTask/${id}`)
        .then((res) => {
          message.info("Task deleted successfully");
          fetchAllTasks();
        })
        .catch((err) => {
          console.log(err);
          message.error("Error deleting task");
        });
    } catch (err) {
      console.log(err);
      message.error(err);
    }
  };

  // Handle the deletion after confirmation
  const handleDeleteConfirm = () => {
    if (taskToDelete) {
      deleteTask(taskToDelete);
      setIsModalVisible(false); // Close modal after confirming delete
      setTaskToDelete(null); // Reset task to delete
    }
  };

  // Show the modal to confirm delete
  const showDeleteConfirm = (id) => {
    setTaskToDelete(id); // Set the task to delete
    setIsModalVisible(true); // Show modal
  };

  // Edit task by navigating to a new route
  const handleEdit = (id) => {
    navigate(`/admin/edit/${id}`);
  };

  // Paginate tasks
  const indexOfLastTask = currentPage * itemsPerPage;
  const indexOfFirstTask = indexOfLastTask - itemsPerPage;
  const currentTasks = task.slice(indexOfFirstTask, indexOfLastTask);

  // Set row background color based on priority using switch
  const responseTable = currentTasks.map((value, index) => {
    let priorityClass;
    switch (value.priority) {
      case "High":
        priorityClass = "bg-red-50 hover:bg-red-200 text-red-800";
        break;
      case "Medium":
        priorityClass = "bg-yellow-50 hover:bg-yellow-100 text-yellow-700";
        break;
      case "Low":
        priorityClass = "bg-green-100 hover:bg-green-200 text-green-800";
        break;
      default:
        priorityClass = "bg-white";
        break;
    }

    return (
      <tr
        key={index}
        className={`${priorityClass} border-b transition duration-150`}
      >
        <td className="p-3 text-sm ">{index + 1}</td>
        <td className="p-3 text-sm ">{value._id}</td>
        <td className="p-3 text-sm ">{value.title}</td>
        <td className="p-3 text-sm ">{value.description}</td>
        <td className="p-3 text-sm ">{value.priority}</td>
        <td className="p-3 text-sm ">{value.status}</td>
        <td className="p-3 text-sm ">
          {value.assignTo?.name ?? "Not Assigned"}
        </td>
        <td className="p-3 text-sm text-gray-700">
          {value.completed ? "Yes" : "No"}
        </td>
        <td className="p-3 text-sm text-gray-700">
          {value.createdAt.split("T")[0]}
        </td>
        <td className="p-3 text-sm text-gray-700">
          {value.dueDate.split("T")[0]}
        </td>
        <td className="p-3 text-sm text-center">
          <button
            onClick={() => handleEdit(value._id)}
            className="bg-gray-500 text-white py-1 px-3 rounded-md text-sm hover:bg-gray-600 transition duration-150"
          >
            Edit
          </button>
        </td>
        <td className="p-3 text-sm text-center">
          <button
            onClick={() => showDeleteConfirm(value._id)} // Show delete confirmation modal
            className="bg-red-500 text-white py-1 px-2 rounded-md text-sm hover:bg-red-600 transition duration-150"
          >
            Delete
          </button>
        </td>
      </tr>
    );
  });

  // Pagination logic
  const totalPages = Math.ceil(task.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="container mx-auto my-10 p-5">
      <h1 className="text-2xl font-bold text-purple-700 mb-5">
        All Tasks {task.length > 0 ? `(${task.length})` : "No Tasks Present"}
      </h1>
      <div className="overflow-x-auto shadow-lg">
        <table className="table-auto w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-500 text-white">
              <th className="p-2.5 text-sm font-semibold text-center">
                Task No.
              </th>
              <th className="p-2.5 text-sm font-semibold text-center">
                Task ID
              </th>
              <th className="p-2.5 text-sm font-semibold text-center">Title</th>
              <th className="p-2.5 text-sm font-semibold text-center">
                Description
              </th>
              <th className="p-2.5 text-sm font-semibold text-center">
                Priority
              </th>
              <th className="p-2.5 text-sm font-semibold text-center">
                Status
              </th>
              <th className="p-2.5 text-sm font-semibold text-center">
                Assigned To
              </th>
              <th className="p-2.5 text-sm font-semibold text-center">
                Completed
              </th>
              <th className="p-2.5 text-sm font-semibold text-center">
                Created Date
              </th>
              <th className="p-2.5 text-sm font-semibold text-center">
                Due Date
              </th>
              <th className="p-2.5 text-sm font-semibold text-center">
                Actions
              </th>
              <th className="p-2.5 text-sm font-semibold text-center"></th>
            </tr>
          </thead>
          <tbody>{responseTable}</tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="mt-4 flex justify-center">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="bg-gray-500 text-white py-2 px-4 rounded-md mr-2 hover:bg-gray-600 transition duration-150"
        >
          Previ.
        </button>
        <span className="text-gray-700 py-2 px-4">{`Page ${currentPage} of ${totalPages}`}</span>
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="bg-gray-500 text-white py-2 px-4 rounded-md ml-2 hover:bg-gray-600 transition duration-150"
        >
          Next
        </button>
      </div>

      {/* Confirmation Modal */}
      <Modal
        title="Confirm Deletion"
        visible={isModalVisible}
        onOk={handleDeleteConfirm}
        onCancel={() => setIsModalVisible(false)} // Close modal without deletion
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
        <p>Are you sure you want to delete this task?</p>
      </Modal>
    </div>
  );
}

export default ShowTask;
