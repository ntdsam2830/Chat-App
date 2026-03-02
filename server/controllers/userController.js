import { generateToken } from "../lib/utils.js";
import User from "../models/User.js";
import bcrypt from "bcryptjs";
import cloudinary from "../lib/cloudinary.js";

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

    const token = generateToken(newUser._id);

    res.status(201).json({
      success: true,
      userData: newUser,
      message: "Account created successfully",
      token,
    });
  } catch (error) {
    console.error("Error during sign up:", error.message);
    res.status(500).json({
      success: false,
      message: error.message || "An error occurred during sign up",
    });
  }
};

//Sign in existing user
export const signIn = async (req, res) => {
  try {
    const { email, password } = req.body;
    const userData = await User.findOne({ email });
    if (!userData) {
      return res.status(400).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const isPasswordMatch = await bcrypt.compare(password, userData.password);
    if (!isPasswordMatch) {
      return res.status(400).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const token = generateToken(userData._id);

    res.status(200).json({
      success: true,
      userData,
      token,
      message: "Login successful",
    });
  } catch (error) {
    console.error("Error during login:", error.message);
    res.status(500).json({
      success: false,
      message: error.message || "An error occurred during login",
    });
  }
};

//Check if user is authenticated and return user data
export const checkAuth = async (req, res) => {
  res.json({ success: true, user: req.user });
};

//Update user profile
export const updateProfile = async (req, res) => {
  try {
    const { profilePic, bio, fullName } = req.body;
    const userId = req.user._id;
    let updatedUser;
    if (!profilePic) {
      updatedUser = await User.findByIdAndUpdate(
        userId,
        { bio, fullName },
        { new: true },
      );
    } else {
      const upload = await cloudinary.uploader.upload(profilePic);
      updatedUser = await User.findByIdAndUpdate(
        userId,
        { profilePic: upload.secure_url, bio, fullName },
        { new: true },
      );
    }
    res.status(200).json({
      success: true,
      userData: updatedUser,
      message: "Profile updated successfully",
    });
  } catch (error) {
    console.error("Error updating profile:", error.message);
    res.status(500).json({
      success: false,
      message: error.message || "An error occurred while updating profile",
    });
  }
};
