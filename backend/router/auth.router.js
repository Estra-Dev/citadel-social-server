import express from "express";
import bcrypt from "bcrypt";
import bcryptjs from "bcryptjs";
import User from "../model/User.js";
import jwt from "jsonwebtoken";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { uploads } from "../middleware/multer.js";

const router = express.Router();

const saltRounds = 10;

// Registration Route
router.post("/register", uploads.single("profileImg"), async (req, res) => {
  const { firstname, lastname, email, password } = req.body;
  const profileImg = await uploadOnCloudinary(req.file.path);

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    res.json({ message: "User already exist" });
  }

  const hashedPassword = await bcryptjs.hash(password, saltRounds);

  const newUser = await User.create({
    firstname,
    lastname,
    email,
    password: hashedPassword,
    profileImg: profileImg.secure_url,
  });

  res.status(201).json({ user: newUser });
  console.log(newUser);
});

// Login Route
router.post("/login", async (req, res) => {
  const { firstname, password } = req.body;

  try {
    const existingUser = await User.findOne({ firstname });

    if (existingUser) {
      const profileImg = existingUser.profileImg;
      const passOk = await bcryptjs.compare(password, existingUser.password);

      const { password: pass, ...rest } = existingUser._doc;
      if (!passOk) {
        console.log(passOk);
        return res.json({ message: "Wrong Credentials" });
      } else {
        console.log(passOk);

        const token = jwt.sign(
          {
            id: existingUser._id,
            firstname,
            lastname: existingUser.lastname,
            email: existingUser.email,
            profileImg,
          },
          process.env.SECRETE
        );
        res
          .status(201)
          .cookie("access_token", token)
          .json({ token, userID: existingUser._id, rest });
      }
    } else {
      console.log("Wrong User Credentials");
      return res.json({ message: "Wrong User Credentials" });
    }
  } catch (error) {
    console.log("This user does not exist");
  }
});

// Profile Route
router.get("/profile", (req, res) => {
  const { access_token } = req.cookies;
  jwt.verify(access_token, process.env.SECRETE, {}, (err, info) => {
    if (err) throw err;
    res.json(info);
  });
  console.log(access_token);
});

export default router;
