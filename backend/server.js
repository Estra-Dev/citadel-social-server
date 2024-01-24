import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import "dotenv/config";
import router from "./router/router.js";
import userRouter from "./router/users.js";
import { getPost, personalPost, post } from "./router/postRouter.js";
import cookieParser from "cookie-parser";
import { uploads } from "./middleware/multer.js";

import path from "path";
import { fileURLToPath } from "url";
import { verifyToken } from "./middleware/authorization.js";

// CONFIGURATION
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cookieParser());
app.use(
  cors({
    credentials: true,
    origin: ["http://localhost:5173"],
  })
);
app.use(express.json());
app.use("/auth", router);
app.use("/users", userRouter);
app.use("/uploads", express.static(path.join(__dirname, "backend/uploads")));

// CLOUDINARY CONFIGURATION

// cloudinary.v2.uploader.upload(
//   "https://upload.wikimedia.org/wikipedia/commons/a/ae/Olympic_flag.jpg",
//   { public_id: "olympic_flag" },
//   function (error, result) {
//     console.log(result);
//   }
// );

const PORT = process.env.PORT || 3200;

app.get("/", (req, res) => {
  res.json({ Message: "Welcome" });
});

app.post("/post", verifyToken, uploads.single("file"), post);
app.get("/post", verifyToken, getPost);
app.get("/mepost", verifyToken, personalPost);

try {
  mongoose.connect(process.env.DATA_COMPASS_URL).then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  });
} catch (error) {
  console.log(`Could not connect: ${error}`);
}
