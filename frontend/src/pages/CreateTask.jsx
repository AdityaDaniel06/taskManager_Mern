import { useState, useEffect } from "react";
import axios from "axios";
import { message } from "antd";
function CreateTask() {
  const [input, setInput] = useState({});
  const [users, setUsers] = useState([]); // array to store list of user

  const fetchUserName = async () => {
    try {
      const response = await axios.get(
        "http://127.0.0.1:8080/user/getAllUsers"
      );
      console.log(response.data);
      const userName = response.data.map((user) => user.name);
      // Set the fetched users to state
      setUsers(userName);
      console.log(users);
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    fetchUserName();
  }, []);

  const handleInput = (e) => {
    let name = e.target.name;
    let value = e.target.value;
    setInput((values) => ({ ...values, [name]: value }));
    console.log(input);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .post("http://127.0.0.1:8080/task/addNewTask", input)
      .then((res) => {
        console.log(res);
        if (res.status == 201) {
          message.success("Created a Task successfully");
          setInput(() => ({
            title: "",
            description: "",
            priority: "",
            dueDate: "",
            assignedTo: "",
          }));
        }
      })
      .catch((error) => {
        message.error("Failed to create task. Please try again.");
        console.error(error);
      });
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md bg-white shadow-lg rounded-lg p-6">
        <h2 className="text-2xl font-bold text-purple-700 mb-4 text-center">
          Create a New Task
        </h2>

        {/* Form for creating a new task */}
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
              value={input.dueDate || ""}
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
              value={input.assignTo}
              onChange={handleInput}
              required
            >
              <option value="">Select User</option>
              {users.map((option, index) => (
                <option key={index} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label
              className="text-gray-700 text-sm font-semibold mb-1 block"
              htmlFor="status"
            >
              Status
            </label>
            <input
              className="border border-gray-300 rounded-lg w-full p-2 focus:ring-2 focus:ring-purple-500 focus:outline-none"
              type="text"
              id="status"
              name="status"
              //   value={input.dueDate || ""}
              value={"Pending"}
              onChange={handleInput}
              disabled
            />
          </div>
          <div className="text-center mt-6">
            <button
              type="submit"
              className="bg-purple-700 text-white py-2 px-4 rounded-lg hover:bg-purple-800 transition duration-200"
              onClick={handleSubmit}
            >
              Create Task
            </button>
            {/* LATER: if any input is empty make button disabled */}
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateTask;
