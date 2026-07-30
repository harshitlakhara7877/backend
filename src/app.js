const dotenv = require("dotenv");
dotenv.config();
const express = require("express")
const cors = require("cors");

const app = express();

//middle ware
app.use(cors());
app.use(express.json());

const details = [];

app.get("/", (req,res) => {
  res.send("Hello World")
});



module.exports = app;