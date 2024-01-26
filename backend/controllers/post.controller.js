import Post from "../model/Post.js";
import jwt from "jsonwebtoken";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

export const post = async (req, res) => {
  const { text } = req.body;

  const img = await uploadOnCloudinary(req.file.path);
  console.log(img);

  const { access_token } = req.cookies;
  jwt.verify(access_token, process.env.SECRETE, {}, async (err, info) => {
    if (err) throw err;
    // res.json(info);
    const newPost = await Post.create({
      text,
      image: img.secure_url,
      author: info.id,
    });
    res.json(newPost);
    console.log(newPost);
  });
};

export const getPost = async (req, res) => {
  const response = await Post.find()
    .populate("author", ["firstname", "lastname", "profileImg"])
    .sort({ createdAt: -1 });
  res.json(response);
};

export const personalPost = async (req, res) => {
  const { access_token } = req.cookies;
  jwt.verify(access_token, process.env.SECRETE, {}, async (err, info) => {
    if (err) throw err;

    const result = await Post.find({ author: info.id })
      .populate("author", ["firstname", "lastname", "profileImg"])
      .sort({ createdAt: -1 });
    res.json(result);
    console.log(result);
  });
};
