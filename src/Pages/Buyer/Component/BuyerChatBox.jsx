import React, { useState, useEffect, useCallback } from "react";
import { IoMdArrowBack } from "react-icons/io";
import {
  InfoCircleOutlined,
  SendOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import SockJS from "sockjs-client";
import { Stomp } from "@stomp/stompjs";
import axios from "axios";
import { useAuth } from "../../../Context/AuthContext";
import { ErrorMessageToast, SuccesfulMessageToast } from "../../../utils/Tostify.util";
import { getChatRoomFarmerDetails, getChatRoomUserDetails } from "../../../services/farmer/farmerApiService";
import Header from "./Header";

const BuyerChatBox = () => {
  const [stompClient, setStompClient] = useState(null);
  const [subscription, setSubscription] = useState(null);
  const { user } = useAuth();
  const [currentUser, setCurrentUser] = useState(null);
  const [roomId, setRoomId] = useState(null);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Initialize current user
  useEffect(() => {
    if (user) {
      setCurrentUser({ id: user.id, name: user.name });
    }
  }, [user]);

  // Fetch user rooms
  useEffect(() => {
    const fetchUserRoom = async () => {
      try {
        const usersRoom = await getChatRoomFarmerDetails(user.id);
        if (usersRoom && usersRoom !== "Empty Room." && usersRoom.buyer) {
          const transformedUser = {
            id: usersRoom.id,
            name: usersRoom.farmer.name,
            buyer: usersRoom.buyer,
            farmer: usersRoom.farmer,
            message: usersRoom.lastMessage?.content || "No messages yet",
            time: usersRoom.lastActivity
              ? new Date(usersRoom.lastActivity).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })
              : "Recently",
            image: `https://i.pravatar.cc/150?img=${usersRoom.buyer.id}`,
            messages: usersRoom.messages || [],
            roomData: usersRoom,
          };
          setUsers([transformedUser]);
        } else {
          setUsers([]);
        }
      } catch (error) {
        console.error("Error fetching user room:", error);
        setUsers([]);
      }
    };

    if (user?.id) {
      fetchUserRoom();
    }
  }, [user]);

  // Initialize WebSocket
  useEffect(() => {
    const socket = new SockJS("http://localhost:8080/ws");
    const client = Stomp.over(socket);
    client.debug = (str) => {
      console.log("STOMP DEBUG:", str);
    };

    client.connect(
      {},
      () => {
        setStompClient(client);
        // SuccesfulMessageToast("Connected to chat");
      },
      (error) => {
        console.error("WebSocket connection error:", error);
        // ErrorMessageToast("Failed to connect to chat");
      }
    );

    return () => {
      if (client && client.connected) {
        console.log("Disconnecting from WebSocket...");
        client.disconnect(() => {
          console.log("Disconnected from WebSocket.");
          setStompClient(null);
          setSubscription(null);
        });
      }
    };
  }, []);

  // Subscribe to WebSocket topic and fetch messages when roomId changes
  useEffect(() => {
    if (!roomId || !stompClient || !stompClient.connected) return;

    const fetchMessages = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/api/rooms/${roomId}/messages`
        );
        const fetchedMessages = response.data.map((msg) => ({
          sender: msg.sender.id === currentUser?.id ? "You" : msg.sender.name,
          text: msg.content,
          time: new Date(msg.timestamp).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
          senderId: msg.sender.id,
          receiverId: msg.receiver.id,
        }));
        setMessages(fetchedMessages);
      } catch (error) {
        console.error("Error fetching messages:", error);
        ErrorMessageToast("Failed to load messages");
      }
    };

    fetchMessages();

    // Store subscription in a ref to avoid dependency loop
    const sub = stompClient.subscribe(`/topic/room/${roomId}`, (message) => {
      try {
        const receivedMessage = JSON.parse(message.body);
        setMessages((prev) => [
          ...prev,
          {
            sender:
              receivedMessage.sender.id === currentUser?.id
                ? "You"
                : receivedMessage.sender.name,
            text: receivedMessage.content,
            time: new Date(receivedMessage.timestamp).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            }),
            senderId: receivedMessage.sender.id,
            receiverId: receivedMessage.receiver.id,
          },
        ]);
      } catch (error) {
        console.error("Error parsing WebSocket message:", error);
      }
    });
    return () => {
      if (sub) {
        sub.unsubscribe();
      }
    };
  }, [roomId, stompClient, currentUser?.id]); // Removed subscription from dependencies // Removed subscription from dependencies

  const handleSendMessage = () => {
    if (!inputMessage.trim()) {
      ErrorMessageToast("Message cannot be empty");
      return;
    }

    if (!stompClient?.connected) {
      ErrorMessageToast("Not connected to chat server");
      return;
    }
    if (
      inputMessage.trim() === "" ||
      !stompClient ||
      !stompClient.connected ||
      !selectedUser ||
      !roomId
    ) {
      ErrorMessageToast("Cannot send message: Invalid input or connection");
      return;
    }

    const messagePayload = {
      senderId: currentUser.id,
      receiverId: selectedUser.buyer.id,
      content: inputMessage,
    };

    try {
      stompClient.publish({
        destination: `/app/sendMessage/${roomId}`,
        body: JSON.stringify(messagePayload),
      });

      setInputMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
      ErrorMessageToast("Failed to send message");
    }
  };

  const handleUserRoom = useCallback(
    (chatUser) => {
      // Only update if roomId actually changed
      if (roomId !== chatUser.id) {
        setRoomId(chatUser.id);
        setSelectedUser(chatUser);
        setMessages([]); // Clear messages when changing rooms
      }
    },
    [roomId]
  );

  return (
    <>
      <Header />

      <div className="flex flex-col md:flex-row h-screen bg-white font-sans">
        <div className="w-full md:w-1/4 border-r border-gray-200 bg-[#F7F9FA] flex flex-col">
          <div className="flex items-center justify-between p-4 border-b border-gray-300">
            <div className="flex gap-2">
              <button className="text-xl text-gray-600">
                <IoMdArrowBack />
              </button>
              <h2 className="text-lg mt-1 font-semibold text-gray-700">Chat</h2>
            </div>
            <button className="text-sm text-gray-500 underline">
              View all
            </button>
          </div>

          <div className="p-4">
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-base">
                <SearchOutlined />
              </span>
              <input
                type="text"
                placeholder="Search Messenger"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded bg-gray-100 focus:outline-none"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto space-y-4 p-4 pt-0">
            {filteredUsers.map((chatUser, index) => (
              <div key={chatUser.id || index}>
                <div
                  className="flex items-start space-x-3 p-2 rounded cursor-pointer hover:bg-gray-100"
                  onClick={() => handleUserRoom(chatUser)}
                  style={{ minWidth: "0" }}
                >
                  <img
                    src={chatUser.image}
                    alt={chatUser.name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center">
                      <span
                        className="font-semibold truncate block max-w-[120px]"
                        title={chatUser.name}
                      >
                        {chatUser.name}
                      </span>
                      <span className="text-xs text-gray-400 whitespace-nowrap ml-2">
                        {chatUser.time}
                      </span>
                    </div>
                    <div
                      className="text-sm text-gray-500 truncate"
                      title={chatUser.message}
                    >
                      {chatUser.message}
                    </div>
                  </div>
                </div>
                {index < filteredUsers.length - 1 && (
                  <hr className="border-green-700" />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col flex-1 w-full">
          {selectedUser ? (
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <div className="flex items-center space-x-2">
                <img
                  src={selectedUser.image}
                  alt={selectedUser.name}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div>
                  <div className="font-bold">{selectedUser.name}</div>
                  <div className="text-xs text-green-500">Online</div>
                </div>
              </div>
              <div className="space-x-4">
                <button className="text-gray-500 text-xl">
                  <InfoCircleOutlined />
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full text-gray-400 p-4">
              Select a user to start chatting
            </div>
          )}

          {selectedUser && (
            <>
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((msg, index) => (
                  <div
                    key={index}
                    className={`flex ${
                      msg.sender === "You" ? "justify-end" : "justify-start"
                    } items-start`}
                  >
                    {msg.sender !== "You" && (
                      <div className="bg-gray-100 p-3 rounded-lg max-w-xs md:max-w-md break-words">
                        {msg.text}
                      </div>
                    )}
                    <div className="text-xs text-gray-400 mx-2 self-end">
                      {msg.time}
                    </div>
                    {msg.sender === "You" && (
                      <div className="bg-teal-100 p-3 rounded-lg max-w-xs md:max-w-md break-words">
                        {msg.text}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <div className="flex flex-wrap items-center gap-2 p-4 border-t border-gray-200">
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder="Type your message here.."
                  className="flex-1 p-2 rounded bg-gray-100 min-w-[150px]"
                  onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                />
                <button
                  className="text-black text-xl"
                  onClick={handleSendMessage}
                >
                  <SendOutlined />
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default BuyerChatBox;
