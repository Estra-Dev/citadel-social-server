import express from "express";
import { getUsers, getUsersPost } from "../controllers/users.js";

const userRouter = express.Router();

userRouter.get("/:id", getUsers);
userRouter.get("/friends/:id", getUsersPost);

export default userRouter;
