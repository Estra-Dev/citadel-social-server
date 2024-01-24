import { Schema, model } from "mongoose";

const postSchema = new Schema(
  {
    text: String,
    image: String,
    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

const Post = model("Post", postSchema);

export default Post;
