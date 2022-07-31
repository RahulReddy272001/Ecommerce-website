/** @format */

const router = require("express").Router();
const User = require("../models/User");
const CryptoJS = require("crypto-js");
const jwt = require("jsonwebtoken")



// REGISTER
router.post("/register", async (req, resp) => {
  const newUser = new User({
    username: req.body.username,
    email: req.body.email,
    password: CryptoJS.AES.encrypt(
      req.body.password,
      process.env.PASS_SEC
    ).toString(),
  });

  try {
    const savedUser = await newUser.save();
    resp.status(201).json(savedUser);
  } catch (err) {
    resp.status(500).json(err);
  }
});

//LOGIN

router.post("/login", async (req, resp) => {
  try {
    const user = await User.findOne({ username: req.body.username });
    !user && resp.status(401).json("wrong credentials!");

    const hashPassword = CryptoJS.AES.decrypt(
      user.password,
      process.env.PASS_SEC
    );
    const OriginalPassword = hashPassword.toString(CryptoJS.enc.Utf8);
    OriginalPassword !== req.body.password &&
      resp.status(401).json("wrong credentials!");


    //JWT IS USE TO VARIFY THE DETAILS OF USER TO VARIFY
    //ITS DETAILS OF ACCOUNT CART ETC 
    const accessToken = jwt.sign({
      id: user._id,
      isAdmin: user.isAdmin,

    }, process.env.JWT_SEC,
      { expiresIn: "3d" });

    const { password, ...others } = user._doc;

    resp.status(200).json({ ...others, accessToken });
  } catch (err) {
    resp.status(200).json(err);
  }
});

module.exports = router;
