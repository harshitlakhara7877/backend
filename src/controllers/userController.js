const User = require("../models/user");
const bcrypt = require("bcryptjs");
const {validattionResult, validationResult} = require("express-validator");

module.exports.registerUser = async (req, res) => {
  try{
    const errors = validationResult(req);

    if(!errors.isEmpty()){
      return res.status(400).json({errors: errors.array()})
    }
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({email});
    if(existingUser){
      return res.status(409).json({message: "User already exists"});
    }

    const hashedPassword = await User.hashedPassword(password);
    // const hashedPassword = await bcrypt.hash(password, 12);   // this is the same as the abovebut we have static method in user model so use it.

    const user = await User.create({
      name,
      email,
      password: hashedPassword
    });

    const token = user.generateAuthToken();
    res.status(201).json({user, token});
  }
  catch(err){
    console.error(err);
    res.status(500).json({error: `Internal server error: ${err.message}`});
  }
}

