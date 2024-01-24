import express from "express";
import bcrypt from "bcrypt";
import User from "../model/User.js";
import jwt from "jsonwebtoken";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { uploads } from "../middleware/multer.js";

const router = express.Router();

const saltRounds = 10;

router.post("/register", uploads.single("profileImg"), async (req, res) => {
  const { firstname, lastname, email, password } = req.body;
  const profileImg = await uploadOnCloudinary(req.file.path);

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    res.json({ message: "User already exist" });
  }

  const hashedPassword = await bcrypt.hash(password, saltRounds);

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

router.post("/login", async (req, res) => {
  const { firstname, password } = req.body;

  try {
    const existingUser = await User.findOne({ firstname });

    if (existingUser) {
      const profileImg = existingUser.profileImg;
      const passOk = await bcrypt.compare(password, existingUser.password);
      if (!passOk) {
        console.log(passOk);
        return res.json({ message: "Wrong Password" });
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
          .json({ token, userID: existingUser._id });
      }
    } else {
      console.log("This user does not exist");
      return res.json({ message: "This user does not exist" });
    }
  } catch (error) {
    // console.log(error);
    console.log("This user does not exist");
  }
});

router.get("/profile", (req, res) => {
  const { access_token } = req.cookies;
  jwt.verify(access_token, process.env.SECRETE, {}, (err, info) => {
    if (err) throw err;
    res.json(info);
  });
  console.log(access_token);
});

export default router;
