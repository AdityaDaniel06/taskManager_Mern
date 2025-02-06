const TaskModel = require("../models/taskModel");
const UserModel = require("../models/userModel");

const addNewTask = async (req, res) => {
  // console.log(req.body);
  try {
    // Find the user by their username or another unique field (e.g., email)
    const user = await UserModel.findOne({ name: req.body.assignTo }); // assuming `assignTo` is username or unique field

    // console.log(user);
    if (!user) {
      return res.status(404).json({
        status: "fail",
        message: "User not found",
      });
    }
    const newTask = await TaskModel.create({
      title: req.body.title,
      description: req.body.description,
      dueDate: req.body.dueDate,
      priority: req.body.priority,
      assignTo: user._id, // Assign the user's ObjectId here
      status: "Pending",
    });

    // Step 2: Update the user's tasksAssigned array
    if (req.body.assignTo) {
      //   const updatedUser = await UserModel.findOneAndUpdate(
      //     req.body.assignTo, // User ID
      //     { $push: { tasksAssigned: newTask._id } }, // Add the task ID
      //     { new: true } // Return the updated user document
      //   );

      //   if (!updatedUser) {
      //     return res.status(404).json({
      //       status: "fail",
      //       message: "User not found. Task created but not assigned to any user.",
      //     });
      //   }
      user.tasksAssigned.push(newTask._id);
      await user.save();
    }

    res.status(201).json({
      status: "success",
      data: {
        task: newTask,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(404).json({ status: "fail", message: err });
  }
};

const getAllTasks = async (req, res) => {
  try {
    // Fetch all tasks and populate the assignToUser field
    const tasks = await TaskModel.find({}).populate(
      "assignTo",
      "name email role"
    );
    res.status(200).json({
      status: "success",
      data: {
        tasks,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(404).json({ status: "fail", message: err });
  }
};
const deleteTask = async (req, res) => {
  //   console.log("deleting ", req.params.id);

  try {
    const book = await TaskModel.findByIdAndDelete(req.params.id);
    res.status(204).json({
      status: "success",
      data: null,
    });
  } catch (err) {
    return res.status(404).json({
      status: "fail",
      message: "Invalid Data sent!",
    });
  }
};
const updateTask = async (req, res) => {
  try {
    // Fetch the task by ID
    const task = await TaskModel.findById(req.params.id);
    if (!task) {
      return res.status(404).json({
        status: "fail",
        message: "Task not found!",
      });
    }

    // Check if `assignToUser` is being updated
    if (
      req.body.assignToUser &&
      req.body.assignToUser !== task.assignTo?.toString()
    ) {
      // Remove the task ID from the previous user's `tasksAssigned` array
      if (task.assignTo) {
        await UserModel.findByIdAndUpdate(
          task.assignToUser,
          { $pull: { tasksAssigned: req.params.id } },
          { new: true }
        );
      }

      // Add the task ID to the new user's `tasksAssigned` array
      await UserModel.findByIdAndUpdate(
        req.body.assignToUser,
        { $push: { tasksAssigned: req.params.id } },
        { new: true }
      );
    }

    // Update the task
    const updatedTask = await TaskModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.status(200).json({
      status: "success",
      data: {
        task: updatedTask,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: "fail",
      message: error.message,
    });
  }
};

const getTaskById = async (req, res) => {
  try {
    // Fetch the task by ID and populate the 'assignToUser' field if referenced
    const task = await TaskModel.findById(req.params.id).populate(
      "assignTo",
      "name"
    );

    // Handle the case where the task is not found
    if (!task) {
      return res.status(404).json({
        status: "fail",
        message: "No task found with the given ID",
      });
    }

    // Send the task data if found
    res.status(200).json({
      status: "success",
      data: {
        task,
      },
    });
  } catch (error) {
    console.error("Error fetching task:", error);

    // Handle invalid ObjectId errors specifically
    if (error.kind === "ObjectId") {
      return res.status(400).json({
        status: "fail",
        message: "Invalid task ID format",
      });
    }

    // Generic server error response
    res.status(500).json({
      status: "fail",
      message: "An error occurred while fetching the task",
    });
  }
};
module.exports = {
  addNewTask,
  getAllTasks,
  deleteTask,
  getTaskById,
  updateTask,
};
