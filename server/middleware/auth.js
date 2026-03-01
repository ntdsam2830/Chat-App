import jwt from "jsonwebtoken";
import User from "../models/User.js";

//Middleware to protect routes and ensure only authenticated users can access certain endpoints
export const protectRoute = async (req, res, next) => {
  try {
    const token = req.headers.token;
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId).select("-password");
    if (!user)
      return res.json({
        success: false,
        message: "User not found",
      });
    req.user = user; // Attach user data to the request object for use in subsequent middleware or route handlers
    next(); // Proceed to the next middleware or route handler
  } catch (error) {
    console.error("Error in auth middleware:", error.message);
    res.status(401).json({
      success: false,
      message: "Not authorized, token failed",
    });
  }
};
