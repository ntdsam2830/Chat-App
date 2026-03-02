import express from "express";
import {
  signUp,
  updateProfile,
  checkAuth,
  signIn,
} from "../controllers/userController.js";
import { protectRoute } from "../middleware/auth.js";

const userRouter = express.Router();

userRouter.post("/signup", signUp);
userRouter.post("/login", signIn);
userRouter.put("/update-profile", protectRoute, updateProfile);
userRouter.get("/check-auth", protectRoute, checkAuth);

export default userRouter;
