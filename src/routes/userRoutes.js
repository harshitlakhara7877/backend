const express = require("express");
const userRouter = express.Router();
const {body} = require("express-validator");
const userController = require("../controllers/userController");

userRouter.post("/register",[
  body("name").isLength({min: 3}).withMessage("Name must be at least 3 characters long"),
  body("email").isEmail().withMessage("Please provide a valid email"),
  body("password").isLength({min: 6}).withMessage("Password must be at least 6 characters long")
],userController.registerUser);


module.exports = userRouter;  