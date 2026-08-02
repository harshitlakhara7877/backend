const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const userRouter = require("./routes/userRoutes");
const cookieParser = require("cookie-parser");

const app = express();
app.use(cookieParser());

//middle ware
app.use(cors());
app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

app.get("/", (req,res) => {
  res.send("Hello World")
});

app.use("/users", userRouter);



module.exports = app;