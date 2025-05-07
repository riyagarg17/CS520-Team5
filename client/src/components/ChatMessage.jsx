import React from "react";
import "../styles/Chatbot.css"; // Assuming styles are in Chatbot.css

const ChatMessage = ({ message }) => {
  const { sender, text } = message;
  const messageClass = sender === "user" ? "user-message" : "bot-message";
  const isLoadingMessage = text === "...";

  return (
    <div className={`message-bubble ${messageClass}`}>
      {isLoadingMessage ? (
        <div className="loading-dots">
          <span></span>
          <span></span>
          <span></span>
        </div>
      ) : (
        <p>{text}</p>
      )}
    </div>
  );
};

export default ChatMessage;
