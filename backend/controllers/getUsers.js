import User from "../model/User.js";
import Post from "../model/Post.js";

export const getUsers = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findById(id);
    console.log(user);
    res.status(200).json(user);
    // res.json(id);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};

export const getUsersPost = async (req, res) => {
  const { id } = req.params;

  // res.json(id);
  try {
    const user = await Post.find({ author: id })
      .populate("author", ["firstname", "lastname", "profileImg"])
      .sort({ createdAt: -1 });
    console.log(user);
    res.status(200).json(user);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};
