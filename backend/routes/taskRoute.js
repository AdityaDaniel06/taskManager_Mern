const express = require("express");
const route = express.Router();

const taskController = require("../controllers/taskController");

route.post("/addNewTask", taskController.addNewTask);
route.get("/getAllTasks", taskController.getAllTasks);

// to delete a task
route.delete("/deleteTask/:id", taskController.deleteTask);
// PUT = to update a task
route.put("/updateTask/:id", taskController.updateTask);
// GET = to gettask by id
route.get("/getTaskById/:id", taskController.getTaskById);

module.exports = route;
