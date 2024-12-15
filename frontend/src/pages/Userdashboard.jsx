import { IoSettingsOutline } from "react-icons/io5";
import { FaTasks } from "react-icons/fa";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import { SlLogout } from "react-icons/sl";
import { useState, useEffect } from "react";
import axios from "axios";
import { Modal, message } from "antd";

function Userdashboard() {
  const [tasks, setTasks] = useState([]);
  const [status, setStatus] = useState(""); // Status per task
  const [isLogoutModalVisible, setIsLogoutModalVisible] = useState(false); // State for logout modal
  const navigate = useNavigate();
  const { userId } = useParams();

  // Fetch tasks from the API
  const fetchTasks = async () => {
    try {
      const response = await axios.get(
        `http://127.0.0.1:8080/user/getTasksByUser/${userId}`
      );
      setTasks(response.data.data.tasks); // Set the tasks to the state
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  // Update task status
  const updateTaskStatus = async (taskId, newStatus) => {
    try {
      const api = `http://127.0.0.1:8080/task/updateTask/${taskId}`;
      const response = await axios.put(api, { status: newStatus });
      console.log(response);
      // Update the task status locally after the successful update
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task._id === taskId ? { ...task, status: newStatus } : task
        )
      );

      message.success("Task status successfully updated!");
    } catch (error) {
      console.error(error);
      message.error("Error updating task status. Please try again.");
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  // Show the logout confirmation modal
  const showLogoutConfirm = () => {
    setIsLogoutModalVisible(true);
  };

  // Handle cancel action in the logout modal
  const handleCancelLogout = () => {
    setIsLogoutModalVisible(false);
  };

  // Handle logout
  const handleLogout = () => {
    navigate("/homepage");
    window.localStorage.removeItem("name");
    window.localStorage.removeItem("email");
    console.log("Logged Out");
    setIsLogoutModalVisible(false); // Close modal after logout
  };

  // Helper function for status color
  const getStatusColor = (status) => {
    switch (status) {
      case "Pending":
        return "text-red-600"; // Red for Pending
      case "In-Progress":
        return "text-yellow-500"; // Yellow for In-Progress
      case "Completed":
        return "text-green-600"; // Green for Completed
      default:
        return "text-gray-500"; // Default color
    }
  };

  // Helper function for priority color
  const getPriorityColor = (priority) => {
    switch (priority) {
      case "High":
        return "text-red-600"; // Red for High priority
      case "Medium":
        return "text-yellow-500"; // Yellow for Medium priority
      case "Low":
        return "text-green-600"; // Green for Low priority
      default:
        return "text-gray-500"; // Default color
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar Section */}
      <aside className="bg-gradient-to-r from-purple-600 to-purple-700 text-white w-1/5 p-4 flex flex-col space-y-4">
        <h2 className="text-lg font-semibold text-center">Welcome User</h2>
        <nav>
          <ul className="space-y-3">
            <li className="hover:bg-purple-700 p-2 rounded">
              <NavLink className="flex gap-3 items-center text-sm">
                <FaTasks className="text-xl" />
                My Tasks
              </NavLink>
            </li>
            <li className="hover:bg-purple-700 p-2 rounded">
              <NavLink className="flex gap-3 items-center text-sm">
                <IoSettingsOutline className="text-xl" />
                Settings
              </NavLink>
            </li>
            <li className="hover:bg-purple-700 p-2 rounded">
              <NavLink
                onClick={showLogoutConfirm}
                to="#"
                className="flex gap-3 items-center text-sm"
              >
                <SlLogout className="text-xl" />
                Logout
              </NavLink>
            </li>
          </ul>
        </nav>
      </aside>

      {/* Main Section */}
      <main className="flex-1 p-4 bg-white overflow-y-auto">
        {/* Header */}
        <header className="bg-purple-600 text-white p-4 rounded mb-4">
          <h1 className="text-lg font-semibold">Your Assigned Tasks</h1>
        </header>

        {/* Content Section */}
        <section className="p-4">
          <h2 className="text-xl font-semibold text-center text-gray-700 mb-4">
            Task List
          </h2>

          {/* Render the tasks if they exist */}
          {tasks.length > 0 ? (
            <div className="space-y-4">
              {tasks.map((task) => (
                <div
                  key={task._id}
                  className="bg-white shadow-md p-4 hover:shadow-lg transition duration-200"
                >
                  <h3 className="text-lg font-semibold text-gray-700">
                    {task.title}
                  </h3>
                  <p className="text-gray-600 mt-2">{task.description}</p>
                  <div className="mt-4 flex justify-between text-sm text-gray-500">
                    <span className={getPriorityColor(task.priority)}>
                      Priority: <strong>{task.priority}</strong>
                    </span>
                    <span className={getStatusColor(task.status)}>
                      Status: <strong>{task.status}</strong>
                    </span>
                    <span>
                      Created Date:
                      <strong>
                        {new Date(task.createdAt).toLocaleDateString()}
                      </strong>
                    </span>
                    <span>
                      Due Date:
                      <strong>
                        {new Date(task.dueDate).toLocaleDateString()}
                      </strong>
                    </span>
                  </div>

                  {/* Status Update Section */}
                  <div className="mt-4">
                    <label
                      className="text-sm font-semibold block mb-2"
                      htmlFor="status"
                    >
                      Update Status
                    </label>
                    <select
                      className="border border-gray-300 rounded p-2 w-full"
                      id="status"
                      name="status"
                      value={status}
                      onChange={(e) => setStatus(e.target.value)}
                      required
                    >
                      <option value="">Select Status</option>
                      <option value="Pending">Pending</option>
                      <option value="In-Progress">In-Progress</option>
                      <option value="Completed">Completed</option>
                    </select>

                    {/* Update button for each task */}
                    <button
                      onClick={() => updateTaskStatus(task._id, status)}
                      className="mt-3 bg-purple-600 text-white py-2 px-4 rounded"
                    >
                      Update Status
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500">No tasks available.</p>
          )}
        </section>
      </main>

      {/* Logout Confirmation Modal */}
      <Modal
        title="Confirm Logout"
        visible={isLogoutModalVisible}
        onOk={handleLogout}
        onCancel={handleCancelLogout}
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
        <p>Are you sure you want to logout?</p>
      </Modal>
    </div>
  );
}

export default Userdashboard;
