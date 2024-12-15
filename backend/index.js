const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
app.use(cors());

const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });

app.use(express.json());
const port = process.env.PORT || 3000;
mongoose.connect(process.env.DATABASE_LOCAL).then(() => {
  console.log("MongoDB Connect");
});

const taskRoutes = require("./routes/taskRoute");
const userRoutes = require("./routes/userRoute");
app.use("/task", taskRoutes);
app.use("/user", userRoutes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
