const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 100,
  },
  description: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 2000,
  },
  priority: {
    type: String,
    required: true,
    enum: ["Low", "Medium", "High"],
  },
  status: {
    type: String,
    required: true,
    enum: ["Pending", "In-Progress", "Completed"],
  },
  completed: {
    type: Boolean,
    default: false,
  },
  dueDate: {
    type: Date,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  assignTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user", // referencing User model
  },
  //   assignToUser: {
  //     type: mongoose.Schema.Types.ObjectId,
  //     ref: "user", // referencing User model
  //   },
});
taskSchema.pre("save", function (next) {
  if (this.dueDate && this.dueDate < Date.now()) {
    return next(new Error("Due date cannot be in the past"));
  }
  next();
});

module.exports = mongoose.model("task", taskSchema);
