/* eslint-disable react-refresh/only-export-components */
import axios from "axios";
import { createContext, useState, useContext } from "react";
import { AuthContext } from "./AuthContext.jsx";
import toast from "react-hot-toast";

export const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [unseenMessages, setUnseenMessages] = useState({});

  const { socket, axios } = useContext(AuthContext);

  //function to get all users for sidebar
  const getUsers = async () => {
    try {
      const { data } = await axios.get("/api/messages/users");
      if (data.success) {
        setUsers(data.users);
        setUnseenMessages(data.unseenMessages);
      }
    } catch (error) {
      toast.error("Error fetching users:" + error.message);
    }
  };

  const getMessages = async (userId) => {
    try {
      const { data } = await axios.get(`/api/messages/${userId}`);
      if (data.success) {
        setMessages(data.messages);
        setSelectedUser(userId);
      }
    } catch (error) {
      toast.error("Error fetching messages:" + error.message);
    }
  };

  //function to send message
  const sendMessage = async (messageData) => {
    try {
      const { data } = await axios.post(
        `/api/messages/send/${selectedUser._id}`,
        messageData,
      );
      if (data.success) {
        // Update the messages list with the new message
        setMessages((prevMessages) => [...prevMessages, data.newMessage]);
      } else {
        toast.error("Error sending message:" + data.message);
      }
    } catch (error) {
      toast.error("Error sending message:" + error.message);
    }
  };

  //function to subscribe to message for selected user
  const subscribeToMessages = async () => {
    if (!socket) return;
    socket.on("newMessage", (newMessage) => {
      if (selectedUser && newMessage.senderId === selectedUser._id) {
        newMessage.seen = true; // Mark the message as seen if it's from the selected user
        setMessages((prevMessages) => [...prevMessages, newMessage]);
        axios.put(`/api/messages/mark/${newMessage._id}`); // Mark messages as seen in the backend
      } else {
        // Handle unseen messages for other users
        setUnseenMessages((prevUnseenMessages) => ({
          ...prevUnseenMessages,
          [newMessage.senderId]: prevUnseenMessages[newMessage.senderId]
            ? prevUnseenMessages[newMessage.senderId] + 1
            : 1,
        }));
      }
    });
  };

  // Chat context logic here
  const value = {
    // Define the values to be provided to the context
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};
