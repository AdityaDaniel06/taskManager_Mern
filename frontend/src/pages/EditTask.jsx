import axios from "axios";
import { message } from "antd";
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";

function EditTask() {
  const { id } = useParams();
  const [input, setInput] = useState({});
  const [users, setUsers] = useState([]); // array to store list of users

  const handleInput = (e) => {
    const nm = e.target.name;
    const val = e.target.value;
    setInput((values) => ({
      ...values,
      [nm]: val,
    }));
  };

  const fetchUserName = async () => {
    try {
      const response = await axios.get(
        "http://127.0.0.1:8080/user/getAllUsers"
      );
      setUsers(response.data); // Store entire user objects
    } catch (error) {
      console.error(error);
    }
  };

  // Getting task by Id
  const fetchData = async () => {
    const api = `http://127.0.0.1:8080/task/getTaskById/${id}`;
    try {
      const response = await axios.get(api);
      const taskData = response.data.data.task;
      setInput({
        title: taskData.title,
        description: taskData.description,
        priority: taskData.priority,
        dueDate: taskData.dueDate,
        assignTo: taskData.assignTo?.name, // Store the user ID
        status: taskData.status,
        completed: taskData.completed,
      });
    } catch (error) {
      console.error(error);
      message.error("Error fetching data", error.status);
    }
  };

  useEffect(() => {
    fetchData();
    fetchUserName();
  }, []);

  // Update the task
  const handleSubmit = (e) => {
    e.preventDefault();
    try {
      const api = `http://127.0.0.1:8080/task/updateTask/${id}`;
      axios
        .put(api, input)
        .then((res) => {
          console.log("Updated value ", res);
          message.success("Data successfully updated!");
          setInput({
            title: "",
            description: "",
            priority: "",
            dueDate: "",
            assignTo: "",
          });
        })
        .catch((error) => {
          console.error(error);
          message.error("Error updating data. Please try again.");
        });
    } catch (e) {
      console.error(e);
      message.error("An unexpected error occurred.", e);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md bg-white shadow-lg rounded-lg p-6">
        <h2 className="text-2xl font-bold text-purple-700 mb-4 text-center">
          Edit Task
        </h2>

        <form className="space-y-4">
          {/* Task Title */}
          <div>
            <label
              className="text-gray-700 text-sm font-semibold mb-1 block"
              htmlFor="title"
            >
              Task Title
            </label>
            <input
              className="border border-gray-300 rounded-lg w-full p-2 focus:ring-2 focus:ring-purple-500 focus:outline-none"
              type="text"
              id="title"
              name="title"
              value={input.title || ""}
              onChange={handleInput}
              placeholder="Enter task title"
              required
            />
          </div>

          {/* Task Description */}
          <div>
            <label
              className="text-gray-700 text-sm font-semibold mb-1 block"
              htmlFor="description"
            >
              Description
            </label>
            <textarea
              className="border border-gray-300 rounded-lg w-full p-2 focus:ring-2 focus:ring-purple-500 focus:outline-none"
              id="description"
              name="description"
              value={input.description || ""}
              onChange={handleInput}
              placeholder="Enter task description"
              rows="3"
              required
            />
          </div>

          {/* Due Date */}
          <div>
            <label
              className="text-gray-700 text-sm font-semibold mb-1 block"
              htmlFor="dueDate"
            >
              Due Date
            </label>
            <input
              className="border border-gray-300 rounded-lg w-full p-2 focus:ring-2 focus:ring-purple-500 focus:outline-none"
              type="date"
              id="dueDate"
              name="dueDate"
              value={input.dueDate?.split("T")[0] || ""}
              onChange={handleInput}
              required
            />
          </div>

          {/* Priority */}
          <div>
            <label
              className="text-gray-700 text-sm font-semibold mb-1 block"
              htmlFor="priority"
            >
              Priority
            </label>
            <select
              className="border border-gray-300 rounded-lg w-full p-2 focus:ring-2 focus:ring-purple-500 focus:outline-none"
              id="priority"
              name="priority"
              value={input.priority || ""}
              onChange={handleInput}
              required
            >
              <option value="">Select Priority</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>

          {/* Assign to */}
          <div>
            <label
              className="text-gray-700 text-sm font-semibold mb-1 block"
              htmlFor="assignTo"
            >
              Assign to
            </label>
            <select
              className="border border-gray-300 rounded-lg w-full p-2 focus:ring-2 focus:ring-purple-500 focus:outline-none"
              id="assignTo"
              name="assignTo"
              value={input.assignTo || ""}
              onChange={handleInput}
              required
            >
              <option value="">Select User</option>
              {users.map((user) => (
                <option key={user._id} value={user._id}>
                  {user.name}
                </option>
              ))}
            </select>
          </div>

          {/* Status */}
          <div>
            <label
              className="text-gray-700 text-sm font-semibold mb-1 block"
              htmlFor="status"
            >
              Status
            </label>
            <select
              className="border border-gray-300 rounded-lg w-full p-2 focus:ring-2 focus:ring-purple-500 focus:outline-none"
              id="status"
              name="status"
              value={input.status || ""}
              onChange={handleInput}
              required
            >
              <option value="">Update Status</option>
              <option value="Pending">Pending</option>
              <option value="In-Progress">In-Progress</option>
              <option value="Completed">Completed</option>
            </select>
          </div>

          {/* Completed */}
          <div>
            <label
              className="text-gray-700 text-sm font-semibold mb-1 block"
              htmlFor="completed"
            >
              Completed
            </label>
            <select
              className="border border-gray-300 rounded-lg w-full p-2 focus:ring-2 focus:ring-purple-500 focus:outline-none"
              id="completed"
              name="completed"
              value={input.completed || ""}
              onChange={handleInput}
              required
            >
              <option value="">Completed?</option>
              <option value="true">Yes</option>
              <option value="false">No</option>
            </select>
          </div>

          {/* Submit Button */}
          <div className="text-center mt-6">
            <button
              type="submit"
              className="bg-purple-700 text-white py-2 px-4 rounded-lg hover:bg-purple-800 transition duration-200"
              onClick={handleSubmit}
            >
              Update Task
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditTask;
