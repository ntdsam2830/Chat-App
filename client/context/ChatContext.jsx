/* eslint-disable react-refresh/only-export-components */
import { createContext, useState, useContext, useEffect } from "react";
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
        // Clear the unseen messages count for this user
        setUnseenMessages((prevUnseenMessages) => ({
          ...prevUnseenMessages,
          [userId]: 0,
        }));
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

    // Remove any existing listener to avoid duplicates
    socket.off("newMessage");

    socket.on("newMessage", (payload) => {
      // Server sends { message: newMessage } — handle both shapes
      const incoming = payload?.message || payload;
      if (!incoming) return;

      const senderId = String(incoming.senderId);

      if (selectedUser && String(selectedUser._id) === senderId) {
        // If the selected conversation is open, append message and mark seen
        incoming.seen = true;
        setMessages((prevMessages) => [...prevMessages, incoming]);
        // mark this single message as seen on backend
        axios.put(`/api/messages/mark/${incoming._id}`).catch(() => {});
        // clear unseen counter for this user
        setUnseenMessages((prev) => ({ ...prev, [senderId]: 0 }));
      } else {
        // Increment unseen count for other users
        setUnseenMessages((prevUnseenMessages) => ({
          ...prevUnseenMessages,
          [senderId]: prevUnseenMessages[senderId]
            ? prevUnseenMessages[senderId] + 1
            : 1,
        }));
      }
    });
  };

  //function to unsubscribe from messages
  const unsubscribeFromMessages = () => {
    if (socket) socket.off("newMessage");
  };

  useEffect(() => {
    subscribeToMessages();
    return () => {
      unsubscribeFromMessages();
    };
  }, [socket, selectedUser]);

  // Chat context logic here
  const value = {
    // Define the values to be provided to the context
    messages,
    users,
    selectedUser,
    unseenMessages,
    getUsers,
    getMessages,
    setSelectedUser,
    sendMessage,
    setUnseenMessages,
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};
