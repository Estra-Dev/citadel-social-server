import { Schema, model } from "mongoose";

const userSchema = new Schema({
  firstname: {
    type: String,
    required: true,
    min: 2,
    max: 50,
  },
  lastname: {
    type: String,
    required: true,
    min: 2,
    max: 50,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    min: 2,
    max: 50,
  },
  profileImg: String,
});

const User = model("User", userSchema);
export default User;
