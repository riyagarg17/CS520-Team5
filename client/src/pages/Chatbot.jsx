import React, { useState, useEffect, useRef } from "react";
import ChatMessage from "../components/ChatMessage";
import ChatInput from "../components/ChatInput";
import { useUserContext } from "../context/UserContext";
// import { ENDPOINTS } from "../api/endpoint"; // Import when ready for backend integration
import "../styles/Chatbot.css";
import doctorIcon from '../assets/doctor_icon.jpg'; // Import the image
import { sendChatMessageWithContext } from "../api/services/chatbotService"; // Import the service for sending messages

// TODO: analyze how chathistory is stored, maybe store after page refresh?
const Chatbot = () => {
  // Remove id from initial message
  const startPrompt = { sender: "bot", text: "Hello, how can I assist you today?" };
  const [messages, setMessages] = useState([startPrompt]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useUserContext(); // Get user context
  const messagesEndRef = useRef(null); // Ref for scrolling

  // Function to scroll to the bottom of the messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Scroll to bottom whenever messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Handle sending a message
  const handleSendMessage = async () => {
    const trimmedInput = inputValue.trim();
    if (!trimmedInput || isLoading) return;

    // Create user message without id
    const userMessage = {
      sender: "user",
      text: trimmedInput,
    };

    // Add user message to the state
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setInputValue(""); // Clear input field
    setIsLoading(true); // Set loading state immediately

    try {
      const userName = user?.name || "Guest";
      const userEmail = user?.email || "";
      const userType = user?.type || "unknown";
      const userGender = user?.gender || "unknown";

      const response = await sendChatMessageWithContext(
        userMessage.text,
        messages,
        {name: userName, email: userEmail, userType: userType, userGender: userGender} // Pass user information
      );

      console.log("Response from server:", response);
      setMessages(prev => {
        return [...prev, { sender: 'bot', text: response.result }];
      });

      // If i add streaming, use this
      // const reader = response.body.getReader();
      // const decoder = new TextDecoder();
      // let botResponseText = '';
      // let firstChunk = true;

      // // Add initial bot message placeholder when starting stream
      // setMessages(prev => [...prev, { sender: 'bot', text: '...' }]);

      // while (true) {
      //     const { done, value } = await reader.read();
      //     if (done) break;

      //     const chunk = decoder.decode(value, { stream: true });
      //     botResponseText += chunk;

      //     // Update the last message in the array
      //     setMessages(prev => {
      //         const updatedMessages = [...prev];
      //         if (updatedMessages.length > 0) {
      //              const lastMessageIndex = updatedMessages.length - 1;
      //              updatedMessages[lastMessageIndex] = {
      //                  ...updatedMessages[lastMessageIndex],
      //                  text: botResponseText
      //              };
      //         }
      //         return updatedMessages;
      //     });
      // }

    } catch (error) {
      console.error("Error fetching chat response:", error);
      // Add an error message to the chat (without id)
      setMessages(prev => [...prev, { sender: 'bot', text: 'Sorry, something went wrong.' }]);
    } finally {
      setIsLoading(false); // Turn off loading state
    }
  };

  return (
    <div className="chat-container">
      <div className="chat-header">
        <img
          src={doctorIcon} // Placeholder image path
          alt="Chatbot Avatar"
          className="chat-avatar"
        />
        <span className="chat-title">AI Health Assistant</span>
      </div>
      <div className="chat-messages">
        {/* Use index as key, acceptable if list isn't reordered/filtered */}
        {messages.map((msg, index) => (
          <ChatMessage key={index} message={msg} />
        ))}
        {/* Conditionally render loading indicator */}
        {isLoading && (
          <div className="message-bubble bot-message">
            <div className="loading-dots">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        )}
        {/* Dummy div to help scroll to bottom */}
        <div ref={messagesEndRef} />
      </div>
      <ChatInput
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onSend={handleSendMessage}
        isLoading={isLoading}
      />
    </div>
  );
};

export default Chatbot;