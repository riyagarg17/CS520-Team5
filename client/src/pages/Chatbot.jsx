import React, { useState, useEffect, useRef } from "react";
import ChatMessage from "../components/ChatMessage";
import ChatInput from "../components/ChatInput";
import { useUserContext } from "../context/UserContext";
// import { ENDPOINTS } from "../api/endpoint"; // Import when ready for backend integration
import "../styles/Chatbot.css";
import doctorIcon from '../assets/doctor_icon.jpg'; // Import the image

const Chatbot = () => {
  const [messages, setMessages] = useState([]);
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

  // Simulate backend streaming response
  const simulateBotResponse = (userMessageText) => {
    setIsLoading(true);
    const loadingMessageId = Date.now(); // Unique ID for the loading message

    // Add a temporary loading message
    setMessages((prevMessages) => [
      ...prevMessages,
      { id: loadingMessageId, sender: "bot", text: "..." },
    ]);

    // Simulate network delay and response generation
    setTimeout(() => {
      const botResponseText = `This is a simulated response to: "${userMessageText}"`;
      // Update the loading message with the actual response
      setMessages((prevMessages) =>
        prevMessages.map((msg) =>
          msg.id === loadingMessageId
            ? { ...msg, text: botResponseText }
            : msg
        )
      );
      setIsLoading(false); // Stop loading
    }, 1500); // Simulate 1.5 seconds delay
  };

  // Handle sending a message
  const handleSendMessage = async () => {
    const trimmedInput = inputValue.trim();
    if (!trimmedInput || isLoading) return;

    const userMessage = {
      id: Date.now(), // Simple unique ID for now
      sender: "user",
      text: trimmedInput,
    };

    // Add user message to the state
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setInputValue(""); // Clear input field

    // --- Backend Integration (Commented out for now) ---
    /*
        setIsLoading(true);
        try {
            // Prepare payload including user context
            const payload = {
                userInput: trimmedInput,
                userContext: { // Send relevant user info
                    email: user.email,
                    type: user.type,
                    // Add other relevant context if needed
                }
            };

            // Replace with actual API call and streaming logic
            const response = await fetch(ENDPOINTS.chatAssistant, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            if (!response.ok || !response.body) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            let botResponseText = '';
            let firstChunk = true;
            let botMessageId = Date.now();

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                const chunk = decoder.decode(value, { stream: true });
                botResponseText += chunk;

                if (firstChunk) {
                    // Add initial bot message placeholder or first chunk
                    setMessages(prev => [...prev, { id: botMessageId, sender: 'bot', text: botResponseText }]);
                    firstChunk = false;
                } else {
                    // Update the existing bot message
                    setMessages(prev => prev.map(msg =>
                        msg.id === botMessageId ? { ...msg, text: botResponseText } : msg
                    ));
                }
            }

        } catch (error) {
            console.error("Error fetching chat response:", error);
            // Add an error message to the chat
            setMessages(prev => [...prev, { id: Date.now(), sender: 'bot', text: 'Sorry, something went wrong.' }]);
        } finally {
            setIsLoading(false);
        }
        */
    // --- End Backend Integration ---

    // Use simulation for now
    simulateBotResponse(trimmedInput);
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
        {messages.map((msg) => (
          <ChatMessage key={msg.id} message={msg} />
        ))}
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