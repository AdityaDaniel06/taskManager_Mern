const UserModel = require("../models/userModel");
const TaskModel = require("../models/taskModel");

// create a user
const saveUser = async (req, res) => {
  try {
    console.log(req.body);
    const { name, email, password, role } = req.body;
    const userData = await UserModel.create({
      name,
      email,
      password,
      role,
    });
    console.log(userData);
    res.status(200).send("Data saved successfully");
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await UserModel.find({});
    res.status(200).send(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getUserById = async (req, res) => {
  try {
    const user = await UserModel.findById(req.params.id);
    if (!user) {
      return res.status(404).send("User not found");
    }
    res.status(200).send(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteUser = async (req, res) => {
  //   console.log("deleting ", req.params.id);

  try {
    const user = await TaskModel.findByIdAndDelete(req.params.id);
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

// authorization

const userCheck = async (req, res) => {
  const { email, password } = req.body;
  const User = await UserModel.find({ email: email });
  console.log(User);
  if (User.length >= 1) {
    if (User[0].password != password) {
      res.status(401).send({ msg: "Invalid Password!" });
    } else {
      res.send({ Data: User, msg: "Login Successful" });
    }
  } else {
    res.status(401).send({ msg: "Invalid Email" });
  }
};

// Get all tasks assigned to a specific user
const getTasksByUser = async (req, res) => {
  try {
    // Fetch all tasks assigned to a specific user by their user ID
    const tasks = await TaskModel.find({ assignTo: req.params.userId });

    // Check if there are any tasks assigned to the user
    if (tasks.length === 0) {
      return res.status(404).json({
        status: "fail",
        message: "No tasks found for the given user ID",
      });
    }

    // Send the tasks data if found
    res.status(200).json({
      status: "success",
      data: {
        tasks,
      },
    });
  } catch (error) {
    console.error("Error fetching tasks:", error);

    // Handle any server error
    res.status(500).json({
      status: "fail",
      message: "An error occurred while fetching tasks",
    });
  }
};

module.exports = {
  saveUser,
  getAllUsers,
  getUserById,
  userCheck,
  deleteUser,
  getTasksByUser,
};
