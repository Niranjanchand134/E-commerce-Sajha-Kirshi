import React, { useState, useRef, useEffect } from "react";
import { BiImageAdd } from "react-icons/bi";
import { IoMdArrowBack } from "react-icons/io";
import { AiOutlinePlus } from "react-icons/ai";
import { InfoCircleOutlined, SendOutlined, SearchOutlined  } from "@ant-design/icons";
import { Client } from "@stomp/stompjs"; 
import SockJS from "sockjs-client";


const ChatBox = () => {
  const [stompClient, setStompClient] = useState(null);
  const [connected, setConnected] = useState(false);
  const [currentUser, setCurrentUser] = useState("You"); 
  const users = [
    {
      name: "Yukesh Stha",
      message: "Hi, yes, David have found it, ask our concierge 👀",
      time: "5 minutes ago",
      image: "https://i.pravatar.cc/150?img=1",
    },
    {
      name: "Luella Mills",
      message: "Well, it seems to be working now.",
      time: "10 minutes ago",
      image: "https://i.pravatar.cc/150?img=2",
    },
    {
      name: "Ethel Kelly",
      message: "Please review the tickets",
      time: "2 hours ago",
      image: "https://i.pravatar.cc/150?img=3",
    },
    {
      name: "Herman May",
      message: "Thanks a lot. It was easy to fix it .",
      time: "4 hours ago",
      image: "https://i.pravatar.cc/150?img=4",
    },
  ];

  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const fileInputRef = useRef();
  const imageVideoInputRef = useRef();
  const [searchTerm, setSearchTerm] = useState("");

  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    // Initialize WebSocket connection when component mounts
    const initializeWebSocket = () => {
      const token = localStorage.getItem("token");
      const socket = new SockJS("http://localhost:8080/ws");
      const client = new Client({
        webSocketFactory: () => socket,
        connectHeaders: {
          Authorization: `Bearer ${token}`,
        },
        reconnectDelay: 5000,
        heartbeatIncoming: 4000,
        heartbeatOutgoing: 4000,
        onConnect: () => {
          setConnected(true);
          console.log("Connected to WebSocket");

          // Subscribe to public messages
          client.subscribe("/chatroom/public", (message) => {
            const receivedMessage = JSON.parse(message.body);
            handleReceivedMessage(receivedMessage);
          });

          // Subscribe to private messages
          client.subscribe(`/user/${currentUser}/private`, (message) => {
            const receivedMessage = JSON.parse(message.body);
            handleReceivedMessage(receivedMessage);
          });
        },
        onDisconnect: () => {
          setConnected(false);
          console.log("Disconnected from WebSocket");
        },
      });

      client.activate();
      setStompClient(client);

      return () => {
        if (client) {
          client.deactivate();
        }
      };
    };

    initializeWebSocket();
  }, [currentUser]);


  const handleReceivedMessage = (message) => {
    const newMessage = {
      sender: message.senderName,
      text: message.message,
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };
    setMessages((prev) => [...prev, newMessage]);
  };

  const handleSendMessage = () => {
    if (inputMessage.trim() === "") return;

    if (stompClient && connected) {
      // For public messages
      // stompClient.publish({
      //   destination: '/app/message',
      //   body: JSON.stringify({
      //     senderName: currentUser,
      //     receiverName: 'public',
      //     message: inputMessage,
      //     date: new Date(),
      //     status: 'MESSAGE'
      //   })
      // });

      // For private messages
      if (selectedUser) {
        stompClient.publish({
          destination: "/app/private-message",
          body: JSON.stringify({
            senderName: currentUser,
            receiverName: selectedUser.name, // This should match the receiver's username in your system
            message: inputMessage,
            date: new Date(),
            status: "MESSAGE",
          }),
        });
      }

      const newMessage = {
        sender: "You",
        text: inputMessage,
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };
      setMessages((prev) => [...prev, newMessage]);
      setInputMessage("");
    } else {
      console.error("WebSocket not connected");
    }
  };

  const handleSendPdf = (e) => {
    const file = e.target.files[0];
    if (file && file.type === "application/pdf") {
      const newMessage = {
        sender: "You",
        text: `📄 ${file.name}`,
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };
      setMessages((prev) => [...prev, newMessage]);
    }
  };

  const handleSendMedia = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.type.startsWith("image/") || file.type.startsWith("video/")) {
        const newMessage = {
          sender: "You",
          text: file.type.startsWith("image/")
            ? `🖼️ ${file.name}`
            : `🎥 ${file.name}`,
          time: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
          fileUrl: URL.createObjectURL(file),
          fileType: file.type,
        };
        setMessages((prev) => [...prev, newMessage]);
      } else {
        alert("Please select an image or video file");
      }
    }
  };

  return (
    <div className="flex flex-col md:flex-row h-screen bg-white font-sans">
      {/* Sidebar */}
      <div className="w-full md:w-1/4 border-r border-gray-200 bg-[#F7F9FA] flex flex-col">
        {/* Sidebar Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-300">
          <div className="flex gap-2">
            <button className="text-xl text-gray-600">
              <IoMdArrowBack />
            </button>
            <h2 className="text-lg mt-1 font-semibold text-gray-700">Chat</h2>
          </div>
          <button className="text-sm text-gray-500 ununderline">
            View all
          </button>
        </div>

        {/* Search */}
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

        {/* User List */}
        <div className="flex-1 overflow-y-auto space-y-4 p-4 pt-0">
          {filteredUsers.map((user, index) => (
            <div key={index}>
              <div
                className="flex items-start space-x-3 p-2 rounded cursor-pointer hover:bg-gray-100"
                onClick={() => setSelectedUser(user)}
                style={{ minWidth: "0" }}
              >
                <img
                  src={user.image}
                  alt={user.name}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center">
                    <span
                      className="font-semibold truncate block max-w-[120px]"
                      title={user.name}
                    >
                      {user.name}
                    </span>
                    <span className="text-xs text-gray-400 whitespace-nowrap ml-2">
                      {user.time}
                    </span>
                  </div>
                  <div
                    className="text-sm text-gray-500 truncate"
                    title={user.message}
                  >
                    {user.message}
                  </div>
                </div>
              </div>
              {index < filteredUsers.length - 1 && (
                <hr className="border-green-700 " />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex flex-col flex-1 w-full">
        {/* Header */}
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

        {/* Messages */}
        {selectedUser && (
          <>
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((msg, index) =>
                msg.sender === "You" ? (
                  <div key={index} className="flex justify-end items-start">
                    <div className="text-xs text-gray-400 mr-2 self-end">
                      {msg.time}
                    </div>
                    <div className="bg-teal-100 p-3 rounded-lg max-w-xs md:max-w-md break-words">
                      {msg.fileUrl ? (
                        msg.fileType.startsWith("image/") ? (
                          <img
                            src={msg.fileUrl}
                            alt={msg.text}
                            className="max-w-full rounded"
                          />
                        ) : msg.fileType.startsWith("video/") ? (
                          <video controls className="max-w-full rounded">
                            <source src={msg.fileUrl} type={msg.fileType} />
                            Your browser does not support the video tag.
                          </video>
                        ) : (
                          msg.text
                        )
                      ) : (
                        msg.text
                      )}
                    </div>
                  </div>
                ) : (
                  <div key={index} className="flex items-start">
                    <div className="bg-gray-100 p-3 rounded-lg max-w-xs md:max-w-md break-words">
                      {msg.fileUrl ? (
                        msg.fileType.startsWith("image/") ? (
                          <img
                            src={msg.fileUrl}
                            alt={msg.text}
                            className="max-w-full rounded"
                          />
                        ) : msg.fileType.startsWith("video/") ? (
                          <video controls className="max-w-full rounded">
                            <source src={msg.fileUrl} type={msg.fileType} />
                            Your browser does not support the video tag.
                          </video>
                        ) : (
                          msg.text
                        )
                      ) : (
                        msg.text
                      )}
                    </div>
                    <div className="text-xs text-gray-400 ml-2 self-end">
                      {msg.time}
                    </div>
                  </div>
                )
              )}
            </div>

            {/* Input */}
            <div className="flex flex-wrap items-center gap-2 p-4 border-t border-gray-200">
              <input
                type="file"
                accept="image/*,video/*"
                ref={imageVideoInputRef}
                style={{ display: "none" }}
                onChange={handleSendMedia}
              />
              <button
                className="text-xl text-black"
                onClick={() => imageVideoInputRef.current.click()}
              >
                <BiImageAdd />
              </button>
              <button
                className="text-lg bg-black rounded-full text-white"
                onClick={() => fileInputRef.current.click()}
              >
                <AiOutlinePlus />
              </button>
              <input
                type="file"
                accept="application/pdf"
                ref={fileInputRef}
                style={{ display: "none" }}
                onChange={handleSendPdf}
              />
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
  );
};

export default FarmerChatbox;
