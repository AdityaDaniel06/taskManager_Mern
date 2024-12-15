const express = require("express");
const route = express.Router();

const userController = require("../controllers/userController");

route.post("/usercheck", userController.userCheck);

route.post("/createUser", userController.saveUser);
route.get("/getAllUsers", userController.getAllUsers);
route.get("/getUserById/:id", userController.getUserById);
route.get("/getTasksByUser/:userId", userController.getTasksByUser);

route.delete("/deleteUser/:id", userController.deleteUser);

module.exports = route;
