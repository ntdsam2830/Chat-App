import User from "../models/User.js";
import bcrypt from "bcryptjs";

//Sign up new user
export const signUp = async (req, res) => {
  const { email, password, fullName, profilePic, bio } = req.body;

  try {
    if (!email || !password || !fullName) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields",
      });
    }
    const user = await User.findOne({ email });

    if (user) {
      return res.status(400).json({
        success: false,
        message: "User with this email already exists",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await User.create({
      email,
      password: hashedPassword,
      fullName,
      profilePic,
      bio,
    });
    res.status(201).json({
      success: true,
      message: "User created successfully",
      user: newUser,
    });

    const token 

  } catch (error) {
    console.error("Error during sign up:", error);
    res.status(500).json({ message: "Server error during sign up" });
  }
};
