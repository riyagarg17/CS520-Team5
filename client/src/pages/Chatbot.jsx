import React, { useState, useEffect, useRef } from "react";
import ChatMessage from "../components/ChatMessage";
import ChatInput from "../components/ChatInput";
import { useUserContext } from "../context/UserContext";
// import { ENDPOINTS } from "../api/endpoint"; // Import when ready for backend integration
import "../styles/Chatbot.css";
import doctorIcon from '../assets/doctor_icon.jpg'; // Import the image

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

  // Simulate backend streaming response
  const simulateBotResponse = (userMessageText) => {
    setIsLoading(true);
    // No loadingMessageId needed

    // Add a temporary loading message without id
    setMessages((prevMessages) => [
      ...prevMessages,
      { sender: "bot", text: "..." },
    ]);

    // Simulate network delay and response generation
    setTimeout(() => {
      const botResponseText = `This is a simulated response to: "${userMessageText}"`;
      // Update the last message in the array
      setMessages((prevMessages) => {
        const updatedMessages = [...prevMessages];
        // Ensure there's a message to update
        if (updatedMessages.length > 0) {
          const lastMessageIndex = updatedMessages.length - 1;
          // Update the text of the last message (which was the loading message)
          updatedMessages[lastMessageIndex] = {
            ...updatedMessages[lastMessageIndex],
            text: botResponseText,
          };
        }
        return updatedMessages;
      });
      setIsLoading(false); // Stop loading
    }, 1500); // Simulate 1.5 seconds delay
  };

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

    // --- Backend Integration (Commented out for now - Needs similar update logic) ---
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
            // No botMessageId needed

            // Add initial bot message placeholder when starting stream
            setMessages(prev => [...prev, { sender: 'bot', text: '...' }]);

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                const chunk = decoder.decode(value, { stream: true });
                botResponseText += chunk;

                // Update the last message in the array
                setMessages(prev => {
                    const updatedMessages = [...prev];
                    if (updatedMessages.length > 0) {
                         const lastMessageIndex = updatedMessages.length - 1;
                         updatedMessages[lastMessageIndex] = {
                             ...updatedMessages[lastMessageIndex],
                             text: botResponseText
                         };
                    }
                    return updatedMessages;
                });
            }

        } catch (error) {
            console.error("Error fetching chat response:", error);
            // Add an error message to the chat (without id)
            setMessages(prev => [...prev, { sender: 'bot', text: 'Sorry, something went wrong.' }]);
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
        {/* Use index as key, acceptable if list isn't reordered/filtered */}
        {messages.map((msg, index) => (
          <ChatMessage key={index} message={msg} />
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