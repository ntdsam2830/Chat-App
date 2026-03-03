import { message } from "antd";
import Message from "../models/Message.js";
import cloudinary from "../lib/cloudinary.js";

//Get all users except the current user
export const getUsersForSidebar = async (req, res) => {
  try {
    const userId = req.user._id;
    const filteredUsers = await User.find({ _id: { $ne: userId } }).select(
      "-password",
    );
    const unseenMessages = {};
    const promises = filteredUsers.map(async (user) => {
      const messages = await Message.find({
        senderId: user._id,
        receiverId: userId,
        seen: false,
      })
        .sort({ createdAt: -1 })
        .limit(1);
      if (messages.length > 0) {
        unseenMessages[user._id] = messages.length;
      }
    });
    await Promise.all(promises);
    res.status(200).json({
      success: true,
      users: filteredUsers,
      unseenMessages,
    });
  } catch (error) {
    console.error("Error fetching users for sidebar:", error.message);
    res.status(500).json({
      success: false,
      message: error.message || "An error occurred while fetching users",
    });
  }
};

//Get all messages for selected user
export const getMessages = async (req, res) => {
  try {
    const { id: selectedUserId } = req.params;
    const myId = req.user._id;
    const messages = await Message.find({
      $or: [
        { senderId: myId, receiverId: selectedUserId },
        { senderId: selectedUserId, receiverId: myId },
      ],
    }).sort({ createdAt: 1 });
    await Message.updateMany(
      { senderId: selectedUserId, receiverId: myId, seen: false },
      { $set: { seen: true } },
    );

    res.status(200).json({
      success: true,
      messages,
    });
  } catch (error) {
    console.error("Error fetching messages:", error.message);
    res.status(500).json({
      success: false,
      message: error.message || "An error occurred while fetching messages",
    });
  }
};

//API to mark a message as seen
export const markMessageAsSeen = async (req, res) => {
  try {
    const { id } = req.params;
    await Message.findByIdAndUpdate(id, { seen: true }, { new: true });
    res.status(200).json({
      success: true,
      message: "Message marked as seen",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message:
        error.message || "An error occurred while marking message as seen",
    });
  }
};

//Send message to selected user
export const sendMessage = async (req, res) => {
  try {
    const { text, image } = req.body;
    const senderId = req.user._id;
    const receiverId = req.params.id;

    let imageUrl = "";
    if (image) {
      const upload = await cloudinary.uploader.upload(image);
      imageUrl = upload.secure_url;
    }

    const newMessage = await Message.create({
      senderId,
      receiverId,
      text,
      image: imageUrl,
    });

    res.status(201).json({
      success: true,
      message: "Message sent successfully",
      newMessage,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "An error occurred while sending message",
    });
  }
};
